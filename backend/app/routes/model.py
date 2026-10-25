from fastapi import APIRouter
from ..model_loader import ModelSingleton

router = APIRouter()
model_singleton = ModelSingleton()

@router.get("/api/model-info")
async def model_info():
    return {
        "model": "ChilliFusionNet",
        "architecture": "EfficientNetB4 + CBAM + BiLSTM",
        "input_size": "380x380",
        "classes": len(model_singleton.class_names)
    }

@router.get("/api/classes")
async def get_classes():
    return {
        "classes": model_singleton.class_names
    }

@router.get("/api/statistics")
async def statistics():
    return {
        "message": "Training metrics unavailable",
        "training_epochs": "10 Initial + 50 Fine-Tuning",
        "early_stopping": "OFF"
    }
