from fastapi import APIRouter
from app.database.realtime_db import realtime_db

router = APIRouter(prefix="/api/graph", tags=["graph"])

@router.get("/")
def get_knowledge_graph():
    return realtime_db.get_graph()
