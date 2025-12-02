from typing import List

from fastapi import APIRouter, Depends, Query, HTTPException

from app.domain.models import Course
from app.services.recommendation_service import RecommendationService
from app.api.deps import get_recommendation_service

router = APIRouter()