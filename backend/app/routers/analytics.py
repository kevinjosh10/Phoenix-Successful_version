from fastapi import APIRouter
from app.database.realtime_db import realtime_db

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/")
def get_analytics():
    return realtime_db.get_analytics()
