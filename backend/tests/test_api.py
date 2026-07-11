from copy import deepcopy
from datetime import datetime, timezone
from types import SimpleNamespace

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.main import app, db_dependency


class AsyncCursor:
    def __init__(self, documents):
        self.documents = list(documents)

    def sort(self, field, direction):
        reverse = direction == -1
        self.documents.sort(key=lambda document: document.get(field) is None)
        self.documents.sort(key=lambda document: document.get(field), reverse=reverse)
        return self

    def skip(self, amount):
        self.documents = self.documents[amount:]
        return self

    def limit(self, amount):
        self.documents = self.documents[:amount]
        return self

    def __aiter__(self):
        self._iter = iter(self.documents)
        return self

    async def __anext__(self):
        try:
            return next(self._iter)
        except StopIteration:
            raise StopAsyncIteration


class FakeCollection:
    def __init__(self, documents):
        self.documents = deepcopy(documents)

    def find(self, query):
        return AsyncCursor([document for document in self.documents if self._matches(document, query)])

    async def find_one(self, query, sort=None, projection=None):
        matches = [document for document in self.documents if self._matches(document, query)]
        if sort:
            for field, direction in reversed(sort):
                matches.sort(key=lambda document: document.get(field), reverse=direction == -1)
        if not matches:
            return None
        return deepcopy(matches[0])

    async def count_documents(self, query):
        return len([document for document in self.documents if self._matches(document, query)])

    async def insert_one(self, document):
        saved = deepcopy(document)
        saved["_id"] = f"fake-{len(self.documents) + 1}"
        self.documents.append(saved)
        return SimpleNamespace(inserted_id=saved["_id"])

    async def find_one_and_update(self, query, update, return_document=None):
        for document in self.documents:
            if self._matches(document, query):
                for field, amount in update.get("$inc", {}).items():
                    document[field] = document.get(field, 0) + amount
                return deepcopy(document)
        return None

    async def find_one_and_delete(self, query):
        for index, document in enumerate(self.documents):
            if self._matches(document, query):
                return self.documents.pop(index)
        return None

    def aggregate(self, pipeline):
        match_ids = set(pipeline[0]["$match"]["location_id"]["$in"])
        grouped = {}
        for document in self.documents:
            if document["location_id"] in match_ids:
                grouped.setdefault(document["location_id"], []).append(document["rating_for_location"])
        rows = [
            {"_id": location_id, "avg_rating": sum(ratings) / len(ratings)}
            for location_id, ratings in grouped.items()
        ]
        return AsyncCursor(rows)

    def _matches(self, document, query):
        for key, expected in query.items():
            actual = document.get(key)
            if isinstance(expected, dict) and "$lte" in expected:
                if actual is None or actual > expected["$lte"]:
                    return False
            elif actual != expected:
                return False
        return True


class FakeDb:
    def __init__(self):
        self.locations = FakeCollection(
            [
                {
                    "_id": "loc-1",
                    "location_id": 1,
                    "coordinates": [-1.2222, 50.1111],
                    "created_at": datetime(2023, 1, 1, tzinfo=timezone.utc),
                    "distance_from_user_km": 2,
                    "location_name": "Brighton Beach",
                    "location_area": "Brighton",
                    "location_img_url": "https://example.com/brighton.jpg",
                    "body": "A popular seaside spot.",
                    "water_classification": "excellent",
                    "water_classification_date": "2023-09-24T12:15:00",
                },
                {
                    "_id": "loc-2",
                    "location_id": 2,
                    "coordinates": [-3.1664, 51.4656],
                    "created_at": datetime(2023, 1, 2, tzinfo=timezone.utc),
                    "distance_from_user_km": 10,
                    "location_name": "Barry Island",
                    "location_area": "Vale of Glamorgan",
                    "location_img_url": "https://example.com/barry.jpg",
                    "body": "Family-friendly beach.",
                    "water_classification": "good",
                    "water_classification_date": "2023-09-25T12:15:00",
                },
            ]
        )
        self.reviews = FakeCollection(
            [
                {
                    "_id": "rev-1",
                    "review_id": 1,
                    "username": "johndoe",
                    "uid": "uid-1",
                    "body": "Great.",
                    "rating_for_location": 5,
                    "votes_for_review": 0,
                    "created_at": datetime(2023, 2, 1, tzinfo=timezone.utc),
                    "location_id": 1,
                },
                {
                    "_id": "rev-2",
                    "review_id": 2,
                    "username": "janedoe",
                    "uid": "uid-2",
                    "body": "Nice.",
                    "rating_for_location": 3,
                    "votes_for_review": 1,
                    "created_at": datetime(2023, 2, 2, tzinfo=timezone.utc),
                    "location_id": 1,
                },
            ]
        )


@pytest_asyncio.fixture
async def client():
    fake_db = FakeDb()
    app.dependency_overrides[db_dependency] = lambda: fake_db
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://testserver",
    ) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_get_locations_returns_average_ratings(client):
    response = await client.get("/api/locations")

    assert response.status_code == 200
    body = response.json()
    assert body["total_count"] == 2
    location_one = next(location for location in body["locations"] if location["location_id"] == 1)
    assert location_one["avg_rating"] == 4


@pytest.mark.asyncio
async def test_post_location_flips_coordinates(client):
    response = await client.post(
        "/api/locations",
        json={
            "coordinates": [50.1111, -1.2222],
            "location_name": "New Spot",
            "location_area": "Brighton",
            "body": "A new swim spot.",
            "location_img_url": "https://example.com/new.jpg",
        },
    )

    assert response.status_code == 201
    assert response.json()["location"]["coordinates"] == [-1.2222, 50.1111]


@pytest.mark.asyncio
async def test_reviews_can_be_created_voted_and_deleted(client):
    create_response = await client.post(
        "/api/locations/1/reviews",
        json={
            "username": "newuser",
            "uid": "uid-3",
            "body": "Loved it.",
            "rating_for_location": 5,
        },
    )
    assert create_response.status_code == 201
    review_id = create_response.json()["review"]["review_id"]

    vote_response = await client.patch(f"/api/reviews/{review_id}", json={"inc_votes": 1})
    assert vote_response.status_code == 200
    assert vote_response.json()["review"]["votes_for_review"] == 1

    delete_response = await client.delete(f"/api/reviews/{review_id}")
    assert delete_response.status_code == 204


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "payload",
    [
        {"inc_votes": 0},
        {"inc_votes": 2},
        {"inc_votes": 0.5},
        {"inc_votes": True},
        {"inc_votes": "up"},
    ],
)
async def test_patch_review_rejects_invalid_vote_increments(client, payload):
    response = await client.patch("/api/reviews/1", json=payload)

    assert response.status_code == 400
    assert response.json() == {"message": "Bad Request"}


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "payload",
    [
        {
            "username": "newuser",
            "uid": "uid-3",
            "body": "   ",
            "rating_for_location": 5,
        },
        {
            "username": "newuser",
            "uid": "uid-3",
            "body": "Loved it.",
            "rating_for_location": 0,
        },
        {
            "username": "newuser",
            "uid": "uid-3",
            "body": "Loved it.",
            "rating_for_location": 6,
        },
        {
            "username": "newuser",
            "uid": "uid-3",
            "body": "Loved it.",
            "rating_for_location": True,
        },
        {
            "username": "newuser",
            "uid": "uid-3",
            "body": "Loved it.",
            "rating_for_location": "excellent",
        },
        {
            "username": "",
            "uid": "uid-3",
            "body": "Loved it.",
            "rating_for_location": 5,
        },
    ],
)
async def test_post_review_rejects_invalid_payloads(client, payload):
    response = await client.post("/api/locations/1/reviews", json=payload)

    assert response.status_code == 400
    assert response.json() == {"message": "Bad Request"}


@pytest.mark.asyncio
async def test_post_review_for_missing_location_returns_404():
    fake_db = FakeDb()
    starting_review_count = await fake_db.reviews.count_documents({})
    app.dependency_overrides[db_dependency] = lambda: fake_db
    try:
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://testserver",
        ) as client:
            response = await client.post(
                "/api/locations/999/reviews",
                json={
                    "username": "newuser",
                    "uid": "uid-3",
                    "body": "Loved it.",
                    "rating_for_location": 5,
                },
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 404
    assert response.json() == {"message": "Location Does Not Exist!"}
    assert await fake_db.reviews.count_documents({}) == starting_review_count


@pytest.mark.asyncio
async def test_missing_location_reviews_returns_404(client):
    response = await client.get("/api/locations/999/reviews")

    assert response.status_code == 404
    assert response.json() == {"message": "Location Does Not Exist!"}
