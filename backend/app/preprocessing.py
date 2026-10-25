import numpy as np
import tensorflow as tf
import io
from PIL import Image

from .config import IMAGE_SIZE

import tempfile
import os

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Preprocess the image bytes exactly like training."""
    
    # Save bytes to a temporary file to use load_img exactly like app.py
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
        temp_file.write(image_bytes)
        temp_file_path = temp_file.name
        
    try:
        # Exact same logic as app.py
        image = tf.keras.utils.load_img(
            temp_file_path,
            target_size=IMAGE_SIZE
        )
        
        image_array = tf.keras.utils.img_to_array(image)
        # EfficientNetB4 expects raw [0..255] range as trained
        image_array = np.expand_dims(image_array, axis=0)
        
        return image_array
    finally:
        # Cleanup
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
