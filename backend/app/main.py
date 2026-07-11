from contextlib import asynccontextmanager

import httpx
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from pydantic import ValidationError

from .database import close_database_connection, get_database
from .repositories import (
    create_location,
    create_review,
    delete_review,
    get_location,
    list_locations,
    list_reviews_for_location,
    update_review_votes,
)
from .schemas import (
    LocationCreate,
    LocationResponse,
    LocationsResponse,
    ReviewCreate,
    ReviewResponse,
    ReviewsResponse,
    VotePatch,
)

GOVERNMENT_SAMPLING_POINTS_URL = "https://location.data.gov.uk/doc/ef/SamplingPoint/bwsp.eaew.json?_view=sampling-point&_pageSize=500"

ENDPOINTS = {
    "GET /api": {"description": "serves up a json representation of all the available endpoints"},
    "GET /api/government/sampling-points": {
        "description": "proxies the official UK Government bathing water sampling point feed"
    },
    "GET /api/locations": {
        "description": "serves all safe swimming spots",
        "queries": ["sort_by", "distance", "order", "limit", "p"],
    },
    "GET /api/locations/:location_id": {
        "description": "serves up the details of a specific location"
    },
    "GET /api/locations/:location_id/reviews": {
        "description": "serves up reviews for a specific location",
        "queries": ["limit", "p"],
    },
    "POST /api/locations/:location_id/reviews": {"description": "posts a review for a location"},
    "PATCH /api/reviews/:review_id": {"description": "increments review votes"},
    "DELETE /api/reviews/:review_id": {"description": "deletes a review"},
    "POST /api/locations": {"description": "posts a new swimming location"},
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await close_database_connection()


app = FastAPI(title="froke API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def db_dependency():
    return get_database()


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"message": exc.detail})


@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(status_code=400, content={"message": "Bad Request"})


@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=400, content={"message": "Bad Request"})


@app.get("/api")
async def get_endpoints():
    return ENDPOINTS


@app.get("/api/government/sampling-points")
async def get_government_sampling_points():
    headers = {
        "Accept": "application/json",
        "User-Agent": "Froke/1.0 (+https://expo.dev; mobile-app)",
    }
    try:
        async with httpx.AsyncClient(
            timeout=20.0, follow_redirects=True, headers=headers
        ) as client:
            response = await client.get(GOVERNMENT_SAMPLING_POINTS_URL)
            response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=exc.response.status_code, detail="Government API unavailable"
        ) from exc
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="Government API unavailable") from exc

    return JSONResponse(content=response.json())


@app.get("/api/locations", response_model=LocationsResponse)
async def get_locations(
    distance: str | None = None,
    sort_by: str | None = None,
    order: str | None = None,
    limit: str | None = None,
    p: str | None = None,
    db=Depends(db_dependency),
):
    return await list_locations(
        db,
        distance=distance,
        sort_by=sort_by,
        order=order,
        limit=limit,
        p=p,
    )


@app.get("/api/locations/{location_id}", response_model=LocationResponse)
async def get_location_by_id(location_id: str, db=Depends(db_dependency)):
    location = await get_location(db, location_id)
    return {"location": location}


@app.post("/api/locations", status_code=201, response_model=LocationResponse)
async def post_location(payload: LocationCreate, db=Depends(db_dependency)):
    location = await create_location(db, payload.model_dump())
    return {"location": location}


@app.get("/api/locations/{location_id}/reviews", response_model=ReviewsResponse)
async def get_reviews_by_location_id(
    location_id: str,
    limit: str | None = None,
    p: str | None = None,
    db=Depends(db_dependency),
):
    return await list_reviews_for_location(db, location_id=location_id, limit=limit, p=p)


@app.post("/api/locations/{location_id}/reviews", status_code=201, response_model=ReviewResponse)
async def post_review(location_id: str, payload: ReviewCreate, db=Depends(db_dependency)):
    review = await create_review(db, location_id=location_id, payload=payload.model_dump())
    return {"review": review}


@app.patch("/api/reviews/{review_id}", response_model=ReviewResponse)
async def patch_review_votes(review_id: str, payload: VotePatch, db=Depends(db_dependency)):
    review = await update_review_votes(db, review_id=review_id, inc_votes=payload.inc_votes)
    return {"review": review}


@app.delete("/api/reviews/{review_id}", status_code=204)
async def remove_review(review_id: str, db=Depends(db_dependency)):
    await delete_review(db, review_id=review_id)
    return Response(status_code=204)


@app.api_route("/{path_name:path}", methods=["GET", "POST", "PATCH", "DELETE", "PUT"])
async def not_found(path_name: str):
    return JSONResponse(status_code=404, content={"message": "Not found"})
