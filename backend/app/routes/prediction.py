import time
import numpy as np
import io
import base64
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Optional

from ..model_loader import ModelSingleton
from ..preprocessing import preprocess_image
from ..gradcam import make_gradcam_heatmap, create_gradcam_overlay

router = APIRouter()
model_singleton = ModelSingleton()

class PredictionProbability(BaseModel):
    class_name: str
    probability: float

class PredictionResult(BaseModel):
    class_name: str
    confidence: float
    risk_level: str

class PredictionResponse(BaseModel):
    success: bool
    prediction: PredictionResult
    probabilities: Dict[str, float]
    model: Dict[str, str]
    processing_time_ms: int
    gradcam_heatmap: Optional[str] = None
    gradcam_overlay: Optional[str] = None
    original_image: Optional[str] = None

def get_risk_level(class_name: str, confidence: float) -> str:
    if class_name.lower() == "healthy":
        return "Healthy"
    if confidence > 0.8:
        return "High Risk"
    if confidence > 0.5:
        return "Moderate Risk"
    return "Low Risk"

@router.post("/api/predict")
async def predict(file: UploadFile = File(...), generate_gradcam: bool = False):
    if not model_singleton.is_healthy():
        raise HTTPException(status_code=503, detail="Model is not loaded properly.")
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    try:
        start_time = time.time()
        
        # Read file
        image_bytes = await file.read()
        
        # Preprocess
        image_array = preprocess_image(image_bytes)
        
        # Predict
        predictions = model_singleton.model.predict(image_array, verbose=0)[0]
        
        predicted_index = int(np.argmax(predictions))
        predicted_class = model_singleton.class_names[predicted_index]
        confidence = float(predictions[predicted_index])
        
        # Probabilities
        probabilities = {}
        for idx, name in enumerate(model_singleton.class_names):
            probabilities[name] = float(predictions[idx])
            
        processing_time_ms = int((time.time() - start_time) * 1000)
        
        risk_level = get_risk_level(predicted_class, confidence)
        
        response = {
            "success": True,
            "prediction": {
                "class_name": predicted_class,
                "confidence": confidence,
                "risk_level": risk_level
            },
            "probabilities": probabilities,
            "model": {
                "name": "ChilliFusionNet",
                "architecture": "EfficientNetB4 + CBAM + BiLSTM"
            },
            "processing_time_ms": processing_time_ms
        }
        
        if generate_gradcam:
            try:
                heatmap = make_gradcam_heatmap(image_array, model_singleton.model, predicted_index)
                overlay_b64, heatmap_b64 = create_gradcam_overlay(image_bytes, heatmap)
                
                response["gradcam_heatmap"] = f"data:image/jpeg;base64,{heatmap_b64}"
                response["gradcam_overlay"] = f"data:image/jpeg;base64,{overlay_b64}"
                
                # Also send back original for frontend comparison
                original_b64 = base64.b64encode(image_bytes).decode('utf-8')
                response["original_image"] = f"data:{file.content_type};base64,{original_b64}"
            except Exception as e:
                import logging
                logging.error(f"Grad-CAM error: {e}")
                # Don't fail the whole request if Grad-CAM fails
                pass
                
        return JSONResponse(content=response)
        
    except Exception as e:
        import logging
        logging.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
