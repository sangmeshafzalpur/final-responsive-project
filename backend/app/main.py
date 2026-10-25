import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize logging
logging.basicConfig(level=logging.INFO)

# Pre-load the model
from .model_loader import ModelSingleton
_ = ModelSingleton()

from .routes import health, prediction, model

app = FastAPI(
    title="ChilliFusionNet API",
    description="API for Chilli Plant Disease Detection",
    version="1.0.0"
)

import os

# Configure CORS (allow dynamic origins from env or allow all by default)
allowed_origins_str = os.environ.get("ALLOWED_ORIGINS", "*")
if allowed_origins_str == "*":
    origins = ["*"]
else:
    origins = [o.strip() for o in allowed_origins_str.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(health.router)
app.include_router(prediction.router)
app.include_router(model.router)

@app.get("/")
@app.get("/health")
def root_health_check():
    singleton = ModelSingleton()
    return {
        "status": "healthy" if singleton.is_healthy() else "unhealthy",
        "service": "ChilliFusionNet Backend API",
        "model_loaded": singleton.is_healthy(),
        "classes": singleton.class_names
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
