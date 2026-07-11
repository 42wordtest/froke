from datetime import datetime
from math import isfinite
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ApiError(BaseModel):
    message: str


class LocationCreate(BaseModel):
    coordinates: list[float] = Field(min_length=2, max_length=2)
    location_name: str
    location_area: str
    body: str
    location_img_url: str | None = None
    username: str | None = None
    uid: str | None = None


class ReviewCreate(BaseModel):
    username: str
    uid: str
    body: str
    rating_for_location: int | float

    @field_validator("username", "uid", "body")
    @classmethod
    def reject_blank_text(cls, value: str):
        if not value.strip():
            raise ValueError("must not be blank")
        return value

    @field_validator("rating_for_location", mode="before")
    @classmethod
    def validate_rating(cls, value):
        if isinstance(value, bool):
            raise ValueError("rating_for_location must be numeric")
        try:
            numeric_value = float(value)
        except (TypeError, ValueError):
            raise ValueError("rating_for_location must be numeric") from None
        if not isfinite(numeric_value) or numeric_value < 1 or numeric_value > 5:
            raise ValueError("rating_for_location must be between 1 and 5")
        return value


class VotePatch(BaseModel):
    inc_votes: int | float

    @field_validator("inc_votes")
    @classmethod
    def reject_bool(cls, value: int | float):
        if isinstance(value, bool):
            raise ValueError("inc_votes must be numeric")
        return value


class LocationOut(BaseModel):
    id: str | None = Field(default=None, alias="_id")
    location_id: int
    coordinates: list[float]
    created_at: Any = None
    distance_from_user_km: float | None = None
    location_name: str
    location_area: str
    location_img_url: str | None = None
    body: str
    review_count: int | None = None
    water_classification: str | None = None
    water_classification_date: Any = None
    username: str | None = None
    uid: str | None = None
    avg_rating: float | None = None

    model_config = ConfigDict(populate_by_name=True, extra="allow")


class ReviewOut(BaseModel):
    id: str | None = Field(default=None, alias="_id")
    uid: str
    review_id: int
    username: str
    votes_for_review: int | float = 0
    rating_for_location: int | float
    body: str
    created_at: Any = None
    location_id: int

    model_config = ConfigDict(populate_by_name=True, extra="allow")


class LocationsResponse(BaseModel):
    locations: list[LocationOut]
    total_count: int


class LocationResponse(BaseModel):
    location: LocationOut


class ReviewsResponse(BaseModel):
    reviews: list[ReviewOut]
    total_count: int


class ReviewResponse(BaseModel):
    review: ReviewOut
