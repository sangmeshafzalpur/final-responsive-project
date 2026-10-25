import numpy as np
import tensorflow as tf
import cv2
import io
import base64
from PIL import Image
from .config import IMAGE_SIZE

def find_last_conv_layer(model):
    """Attempt to find the last convolutional layer in the model."""
    for layer in reversed(model.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            return layer.name
        # If it's a Functional model (like EfficientNet), we might need to look inside
        if isinstance(layer, tf.keras.Model):
            for inner_layer in reversed(layer.layers):
                if isinstance(inner_layer, tf.keras.layers.Conv2D):
                    return inner_layer.name
    return None

def make_gradcam_heatmap(img_array, model, pred_index=None):
    # Try to find the last conv layer dynamically if possible, or use a default
    # For EfficientNetB4, the last conv layer is often 'top_conv'
    last_conv_layer_name = find_last_conv_layer(model)
    
    if not last_conv_layer_name:
        raise ValueError("Could not find a convolutional layer for Grad-CAM.")
        
    grad_model = tf.keras.models.Model(
        [model.inputs], [model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        last_conv_layer_output, preds = grad_model(img_array)
        if pred_index is None:
            pred_index = tf.argmax(preds[0])
        class_channel = preds[:, pred_index]

    grads = tape.gradient(class_channel, last_conv_layer_output)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    
    # Handle NaN or negative values robustly
    heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-10)
    return heatmap.numpy()

def create_gradcam_overlay(image_bytes: bytes, heatmap: np.ndarray, alpha=0.4):
    """Creates a blended image with Grad-CAM heatmap."""
    # Load original image
    original_img = Image.open(io.BytesIO(image_bytes))
    if original_img.mode != "RGB":
        original_img = original_img.convert("RGB")
    original_img = original_img.resize(IMAGE_SIZE)
    img_array = np.array(original_img)

    # Rescale heatmap to a range 0-255
    heatmap = np.uint8(255 * heatmap)

    # Use jet colormap to colorize heatmap
    jet = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    # Resize colormap to the same size as the original image
    jet = cv2.resize(jet, (img_array.shape[1], img_array.shape[0]))

    # Convert BGR to RGB (OpenCV uses BGR)
    jet = cv2.cvtColor(jet, cv2.COLOR_BGR2RGB)

    # Superimpose the heatmap on original image
    superimposed_img = jet * alpha + img_array * (1 - alpha)
    superimposed_img = np.clip(superimposed_img, 0, 255).astype(np.uint8)

    # Convert to PIL Image
    final_img = Image.fromarray(superimposed_img)
    
    # Also create just the heatmap image for the UI
    heatmap_img = Image.fromarray(jet)

    # Convert to base64 for frontend
    overlay_buffer = io.BytesIO()
    final_img.save(overlay_buffer, format="JPEG")
    overlay_b64 = base64.b64encode(overlay_buffer.getvalue()).decode("utf-8")
    
    heatmap_buffer = io.BytesIO()
    heatmap_img.save(heatmap_buffer, format="JPEG")
    heatmap_b64 = base64.b64encode(heatmap_buffer.getvalue()).decode("utf-8")

    return overlay_b64, heatmap_b64
