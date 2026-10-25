from fastapi import APIRouter
from ..model_loader import ModelSingleton

router = APIRouter()
model_singleton = ModelSingleton()

@router.get("/api/health")
async def health_check():
    return {
        "status": "healthy" if model_singleton.is_healthy() else "unhealthy",
        "model_loaded": model_singleton.model is not None,
        "classes_loaded": len(model_singleton.class_names) > 0
    }
