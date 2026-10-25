import logging
import os
import gc

# 1. Minimize TensorFlow memory footprint before any TF imports
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TF_NUM_INTEROP_THREADS"] = "1"
os.environ["TF_NUM_INTRAOP_THREADS"] = "1"
os.environ["MALLOC_TRIM_THRESHOLD_"] = "100000"

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from .model_loader import ModelSingleton

# Lifespan context: Bind port first, then load model smoothly
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Server starting up. Loading ChilliFusionNet model...")
    try:
        singleton = ModelSingleton()
        logger.info(f"Model loaded status: {singleton.is_healthy()}")
        gc.collect()
    except Exception as e:
        logger.error(f"Error loading model during startup: {e}")
    yield
    logger.info("Server shutting down.")

app = FastAPI(
    title="ChilliFusionNet API",
    description="API for Chilli Plant Disease Detection",
    version="1.0.0",
    lifespan=lifespan
)

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

from .routes import health, prediction, model

# Include routes
app.include_router(health.router)
app.include_router(prediction.router)
app.include_router(model.router)

@app.get("/")
@app.get("/health")
def root_health_check():
    singleton = ModelSingleton()
    return {
        "status": "healthy" if singleton.is_healthy() else "initializing",
        "service": "ChilliFusionNet Backend API",
        "model_loaded": singleton.is_healthy(),
        "classes": singleton.class_names
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
