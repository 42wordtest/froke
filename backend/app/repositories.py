from datetime import UTC, datetime
from typing import Any

from fastapi import HTTPException
from pymongo import ASCENDING, DESCENDING, ReturnDocument

from .serialization import serialize_document


def _parse_positive_int(value: Any, default: int, name: str) -> int:
    if value is None:
        return default
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Bad Request") from None
    if parsed < 1:
        raise HTTPException(status_code=400, detail="Bad Request")
    return parsed


def _parse_numeric_id(value: Any) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Bad Request") from None


def _sort_direction(order: str | None) -> int:
    return ASCENDING if order == "asc" else DESCENDING


async def list_locations(
    db,
    *,
    distance: str | None,
    sort_by: str | None,
    order: str | None,
    limit: str | None,
    p: str | None,
) -> dict[str, Any]:
    page_size = _parse_positive_int(limit, 10, "limit")
    page = _parse_positive_int(p, 1, "p")
    offset = (page - 1) * page_size

    query: dict[str, Any] = {}
    if distance is not None:
        try:
            query["distance_from_user_km"] = {"$lte": float(distance)}
        except ValueError:
            raise HTTPException(status_code=400, detail="Bad Request") from None

    sort_field = sort_by or "created_at"
    cursor = (
        db.locations.find(query)
        .sort(sort_field, _sort_direction(order))
        .skip(offset)
        .limit(page_size)
    )
    locations = [serialize_document(location) async for location in cursor]
    total_count = await db.locations.count_documents(query)
    await _attach_average_ratings(db, locations)

    return {"locations": locations, "total_count": total_count}


async def get_location(db, location_id: str | int) -> dict[str, Any]:
    numeric_id = _parse_numeric_id(location_id)
    location = await db.locations.find_one({"location_id": numeric_id})
    if not location:
        raise HTTPException(status_code=404, detail="Location Does Not Exist!")

    serialized = serialize_document(location)
    await _attach_average_ratings(db, [serialized])
    return serialized


async def create_location(db, payload: dict[str, Any]) -> dict[str, Any]:
    max_location = await db.locations.find_one(
        {},
        sort=[("location_id", DESCENDING)],
        projection={"location_id": True},
    )
    next_id = (max_location or {}).get("location_id", 0) + 1
    lat, lon = payload["coordinates"]

    document = {
        "location_id": next_id,
        "coordinates": [lon, lat],
        "created_at": datetime.now(UTC),
        "distance_from_user_km": payload.get("distance_from_user_km"),
        "location_name": payload["location_name"],
        "location_area": payload["location_area"],
        "location_img_url": payload.get("location_img_url"),
        "body": payload["body"],
        "review_count": payload.get("review_count"),
        "water_classification": None,
        "water_classification_date": None,
    }
    if payload.get("username"):
        document["username"] = payload["username"]
    if payload.get("uid"):
        document["uid"] = payload["uid"]

    result = await db.locations.insert_one(document)
    saved = await db.locations.find_one({"_id": result.inserted_id})
    return serialize_document(saved)


async def list_reviews_for_location(
    db,
    *,
    location_id: str,
    limit: str | None,
    p: str | None,
) -> dict[str, Any]:
    numeric_location_id = _parse_numeric_id(location_id)
    page_size = _parse_positive_int(limit, 10, "limit")
    page = _parse_positive_int(p, 1, "p")
    offset = (page - 1) * page_size

    if not await db.locations.find_one({"location_id": numeric_location_id}):
        raise HTTPException(status_code=404, detail="Location Does Not Exist!")

    query = {"location_id": numeric_location_id}
    cursor = db.reviews.find(query).sort("created_at", DESCENDING).skip(offset).limit(page_size)
    reviews = [serialize_document(review) async for review in cursor]
    total_count = await db.reviews.count_documents(query)
    return {"reviews": reviews, "total_count": total_count}


async def create_review(db, *, location_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    numeric_location_id = _parse_numeric_id(location_id)
    if not await db.locations.find_one({"location_id": numeric_location_id}):
        raise HTTPException(status_code=404, detail="Location Does Not Exist!")

    max_review = await db.reviews.find_one(
        {},
        sort=[("review_id", DESCENDING)],
        projection={"review_id": True},
    )
    next_id = (max_review or {}).get("review_id", 0) + 1
    document = {
        "review_id": next_id,
        "username": payload["username"],
        "uid": payload["uid"],
        "body": payload["body"],
        "rating_for_location": payload["rating_for_location"],
        "votes_for_review": 0,
        "created_at": datetime.now(UTC),
        "location_id": numeric_location_id,
    }

    result = await db.reviews.insert_one(document)
    saved = await db.reviews.find_one({"_id": result.inserted_id})
    return serialize_document(saved)


async def update_review_votes(db, *, review_id: str, inc_votes: int | float) -> dict[str, Any]:
    numeric_review_id = _parse_numeric_id(review_id)
    review = await db.reviews.find_one_and_update(
        {"review_id": numeric_review_id},
        {"$inc": {"votes_for_review": inc_votes}},
        return_document=ReturnDocument.AFTER,
    )
    if not review:
        raise HTTPException(status_code=404, detail="Not Found")
    return serialize_document(review)


async def delete_review(db, *, review_id: str) -> None:
    numeric_review_id = _parse_numeric_id(review_id)
    result = await db.reviews.find_one_and_delete({"review_id": numeric_review_id})
    if not result:
        raise HTTPException(status_code=404, detail="Review not found")


async def _attach_average_ratings(db, locations: list[dict[str, Any]]) -> None:
    location_ids = [location["location_id"] for location in locations]
    if not location_ids:
        return

    pipeline = [
        {"$match": {"location_id": {"$in": location_ids}}},
        {"$group": {"_id": "$location_id", "avg_rating": {"$avg": "$rating_for_location"}}},
    ]
    ratings = {row["_id"]: row["avg_rating"] async for row in db.reviews.aggregate(pipeline)}
    for location in locations:
        location["avg_rating"] = ratings.get(location["location_id"])
