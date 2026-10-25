import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_DIR = os.path.dirname(BASE_DIR)

# Canonical single model path
default_model_path = os.path.join(BASE_DIR, "models", "ChilliFusionNet_final.keras")
if not os.path.exists(default_model_path):
    default_model_path = os.path.join(ROOT_DIR, "ChilliFusionNet_final.keras")

default_class_path = os.path.join(BASE_DIR, "class_names.json")
if not os.path.exists(default_class_path):
    default_class_path = os.path.join(ROOT_DIR, "class_names.json")

MODEL_PATH = os.environ.get("MODEL_PATH", default_model_path)
CLASS_NAMES_PATH = os.environ.get("CLASS_NAMES_PATH", default_class_path)
IMAGE_SIZE = (380, 380)
