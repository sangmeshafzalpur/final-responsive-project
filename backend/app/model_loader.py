import json
import logging
import os
import tensorflow as tf

from .config import MODEL_PATH, CLASS_NAMES_PATH

logger = logging.getLogger(__name__)

@tf.keras.utils.register_keras_serializable()
class ChannelAttention(tf.keras.layers.Layer):
    def __init__(self, ratio=8, **kwargs):
        super().__init__(**kwargs)
        self.ratio = ratio
        
    def build(self, input_shape):
        channel = input_shape[-1]
        self.shared_dense_1 = tf.keras.layers.Dense(channel // self.ratio, activation='relu', use_bias=True)
        self.shared_dense_2 = tf.keras.layers.Dense(channel, use_bias=True)
        
    def call(self, inputs):
        avg_pool = tf.reduce_mean(inputs, axis=[1, 2], keepdims=True)
        max_pool = tf.reduce_max(inputs, axis=[1, 2], keepdims=True)
        
        avg_pool = self.shared_dense_2(self.shared_dense_1(avg_pool))
        max_pool = self.shared_dense_2(self.shared_dense_1(max_pool))
        
        attention = tf.keras.activations.sigmoid(avg_pool + max_pool)
        return tf.cast(attention, self.compute_dtype)

@tf.keras.utils.register_keras_serializable()
class SpatialAttention(tf.keras.layers.Layer):
    def __init__(self, kernel_size=7, **kwargs):
        super().__init__(**kwargs)
        self.kernel_size = kernel_size
        
    def build(self, input_shape):
        self.conv = tf.keras.layers.Conv2D(1, (self.kernel_size, self.kernel_size), padding='same', activation='sigmoid', use_bias=False)
        
    def call(self, inputs):
        avg_pool = tf.reduce_mean(inputs, axis=-1, keepdims=True)
        max_pool = tf.reduce_max(inputs, axis=-1, keepdims=True)
        concat = tf.concat([avg_pool, max_pool], axis=-1)
        
        attention = self.conv(concat)
        return tf.cast(attention, self.compute_dtype)

@tf.keras.utils.register_keras_serializable(name="CBAM")
class CBAM(tf.keras.layers.Layer):
    def __init__(self, ratio=8, kernel_size=7, **kwargs):
        super().__init__(**kwargs)
        self.ratio = ratio
        self.kernel_size = kernel_size
        self.channel_attention = ChannelAttention(ratio=ratio)
        self.spatial_attention = SpatialAttention(kernel_size=kernel_size)
        
    def call(self, inputs):
        ca = self.channel_attention(inputs)
        ca = tf.cast(ca, inputs.dtype)
        x = tf.multiply(inputs, ca)
        
        sa = self.spatial_attention(x)
        sa = tf.cast(sa, inputs.dtype)
        return tf.multiply(x, sa)
        
    def get_config(self):
        config = super(CBAM, self).get_config()
        config.update({
            'ratio': self.ratio,
            'kernel_size': self.kernel_size
        })
        return config


class ModelSingleton:
    _instance = None
    model = None
    class_names = []

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelSingleton, cls).__new__(cls)
            cls._instance.load_model()
        return cls._instance

    def load_model(self):
        try:
            logger.info(f"Loading model from {MODEL_PATH}")
            if not os.path.exists(MODEL_PATH):
                raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
            try:
                self.model = tf.keras.models.load_model(
                    MODEL_PATH, 
                    compile=False
                )
            except Exception:
                self.model = tf.keras.models.load_model(
                    MODEL_PATH, 
                    compile=False,
                    custom_objects={'CBAM': CBAM},
                    safe_mode=False
                )
            logger.info("Model loaded successfully.")
            
            logger.info(f"Loading class names from {CLASS_NAMES_PATH}")
            if not os.path.exists(CLASS_NAMES_PATH):
                raise FileNotFoundError(f"Class names file not found at {CLASS_NAMES_PATH}")
            with open(CLASS_NAMES_PATH, "r") as f:
                self.class_names = json.load(f)
            logger.info(f"Class names loaded successfully: {self.class_names}")
        except Exception as e:
            logger.error(f"Failed to load model or class names: {e}")
            self.model = None
            self.class_names = []

    def is_healthy(self):
        return self.model is not None and len(self.class_names) > 0
