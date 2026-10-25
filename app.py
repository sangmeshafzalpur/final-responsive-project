
import os
import json
import numpy as np

from flask import Flask, request, render_template
from tensorflow import keras


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "ChilliFusionNet_final.keras"
)

CLASS_NAMES_PATH = os.path.join(
    BASE_DIR,
    "class_names.json"
)

UPLOAD_FOLDER = os.path.join(
    BASE_DIR,
    "static",
    "uploads"
)

IMAGE_SIZE = (380, 380)

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


# ============================================================
# LOAD MODEL
# ============================================================

print("Loading ChilliFusionNet...")

model = keras.models.load_model(
    MODEL_PATH,
    compile=False
)

print("Model loaded successfully.")


# ============================================================
# LOAD CLASS NAMES
# ============================================================

with open(
    CLASS_NAMES_PATH,
    "r"
) as file:

    class_names = json.load(
        file
    )


# ============================================================
# FLASK APPLICATION
# ============================================================

app = Flask(__name__)

app.config[
    "UPLOAD_FOLDER"
] = UPLOAD_FOLDER


# ============================================================
# PREDICTION FUNCTION
# ============================================================

def predict_disease(image_path):

    image = keras.utils.load_img(
        image_path,
        target_size=IMAGE_SIZE
    )

    image_array = keras.utils.img_to_array(image)

    # EfficientNetB4 internally handles normalization; raw [0..255] is expected by ChilliFusionNet
    image_array = np.expand_dims(
        image_array,
        axis=0
    )

    predictions = model.predict(
        image_array,
        verbose=0
    )[0]

    predicted_index = int(
        np.argmax(
            predictions
        )
    )

    predicted_class = (
        class_names[
            predicted_index
        ]
    )

    confidence = float(
        predictions[
            predicted_index
        ] * 100
    )

    probabilities = []

    for index, name in enumerate(
        class_names
    ):

        probabilities.append({
            "class": name,
            "probability": round(
                float(
                    predictions[index] * 100
                ),
                2
            )
        })

    probabilities.sort(
        key=lambda x: x["probability"],
        reverse=True
    )

    return (
        predicted_class,
        confidence,
        probabilities
    )


# ============================================================
# DISEASE KNOWLEDGE BASE & TREATMENT GUIDE
# ============================================================

DISEASE_INFO = {
    "cercospora": {
        "title": "Cercospora Leaf Spot (Frogeye Spot)",
        "type": "Fungal Pathogen (Cercospora capsici)",
        "severity": "Moderate to High",
        "severity_badge": "border-amber-400 bg-amber-50 text-amber-800",
        "summary": "Circular to oblong lesions with ash-gray centers and distinct dark brown or purple halos on leaves and stems.",
        "symptoms": [
            "Circular necrotic spots with pale gray/white centers",
            "Prominent dark brown or purplish margin halo",
            "Yellowing (chlorosis) around spots leading to premature leaf drop"
        ],
        "organic_remedies": [
            "Foliar spray of 0.5% - 1% Cold-Pressed Neem Oil with mild bio-surfactant every 7-10 days",
            "Apply Copper Oxychloride (Bordeaux mixture 1%) during early morning or sunset",
            "Carefully hand-prune and safely burn or bury infected fallen leaves"
        ],
        "chemical_control": [
            "Mancozeb 75% WP @ 2.5 g/L of water at first symptom appearance",
            "Difenoconazole 25% EC @ 0.5 mL/L or Carbendazim 50% WP in rotating spray cycles",
            "Azoxystrobin 23% SC @ 1 mL/L for curative systemic control"
        ],
        "prevention": [
            "Switch from overhead sprinkler irrigation to drip or furrow watering to keep foliage dry",
            "Maintain optimal row spacing (60 cm x 45 cm) for sunlight penetration and airflow",
            "Practice minimum 2-year crop rotation with non-solanaceous crops (maize, pulses)"
        ]
    },
    "healthy": {
        "title": "Healthy Chilli Leaf",
        "type": "Optimal Plant Health",
        "severity": "Healthy (Optimal)",
        "severity_badge": "border-emerald-400 bg-emerald-50 text-emerald-800",
        "summary": "Leaf demonstrates vigorous chlorophyll distribution, uniform green pigmentation, intact cellular margins, and robust turgor pressure.",
        "symptoms": [
            "Deep, uniform green coloration without mottling or chlorosis",
            "Smooth, intact leaf margins free of necrotic lesions or curling",
            "Sturdy leaf structure and normal venation pattern"
        ],
        "organic_remedies": [
            "Continue applying vermicompost mulch (200g per plant) to retain root moisture",
            "Monthly soil application of Trichoderma viride bio-fertilizer for root protection"
        ],
        "chemical_control": [
            "No fungicidal or chemical pesticide application required",
            "Maintain scheduled balanced macro & micro-nutritional feeding"
        ],
        "prevention": [
            "Maintain regular morning watering schedule avoiding waterlogging",
            "Conduct weekly scouting of underside of leaves for early pest ingress"
        ]
    },
    "mites_and_trips": {
        "title": "Mites & Thrips Infestation",
        "type": "Pest & Vector Stress (Scirtothrips dorsalis / Polyphagotarsonemus latus)",
        "severity": "High (Rapid Spread)",
        "severity_badge": "border-rose-400 bg-rose-50 text-rose-800",
        "summary": "Sap-feeding microscopic pests causing dramatic upward or downward leaf curling, boat-shaped crinkling, and stunted terminal shoot elongation.",
        "symptoms": [
            "Upward boat-shaped curling with elongated leaves (Thrips damage)",
            "Downwards inverted curling with thickened leathery texture (Broad Mite damage)",
            "Silvering or bronzed sheen on lower leaf epidermis, stunted growth"
        ],
        "organic_remedies": [
            "Install yellow and blue sticky traps (15-20 traps per acre) at canopy level",
            "Foliar spray of 10,000 ppm Neem Oil or Pongamia Pinnata oil @ 3 mL/L",
            "Release biological predators such as Amblyseius swirskii predatory mites"
        ],
        "chemical_control": [
            "For Thrips: Spinosad 45% SC @ 0.3 mL/L or Fipronil 5% SC @ 1.5 mL/L",
            "For Mites: Spiromesifen 22.9% SC @ 1 mL/L or Abamectin 1.9% EC @ 0.75 mL/L",
            "Diafenthiuron 50% WP @ 1.25 g/L for simultaneous mite and thrips management"
        ],
        "prevention": [
            "Erect tall border barrier crops (maize, sorghum, or pearl millet 3-4 rows)",
            "Avoid excessive chemical nitrogen fertilizers which attract sucking pests",
            "Keep fields strictly weed-free to eliminate wild alternate host reservoirs"
        ]
    },
    "nutritional": {
        "title": "Nutrient Deficiency Stress",
        "type": "Abiotic Physiological Disorder",
        "severity": "Moderate (Correctable)",
        "severity_badge": "border-amber-400 bg-amber-50 text-amber-800",
        "summary": "Deficiency in essential macro/micro-elements such as Nitrogen, Potassium, Magnesium, or Iron, impeding normal metabolic photosynthesis.",
        "symptoms": [
            "Interveinal chlorosis (yellowing between green veins - Iron/Magnesium)",
            "General pale green to yellowing starting from bottom leaves (Nitrogen)",
            "Marginal scorching, leaf tip necrosis, or purple hues on older leaves"
        ],
        "organic_remedies": [
            "Apply well-decomposed farmyard manure (FYM) or fortified vermicompost",
            "Foliar spray of cold-water liquid seaweed kelp extract @ 2 mL/L",
            "Soil drenching with fermented Jeevamrutha or cow dung slurry"
        ],
        "chemical_control": [
            "Foliar spray of balanced water-soluble 19:19:19 NPK @ 5 g/L",
            "For Magnesium deficiency: Magnesium Sulphate (Epsom salt) foliar spray @ 5 g/L",
            "Chelated Micronutrient mixture (Fe, Zn, B, Mn, Cu) @ 2 g/L during vegetative flush"
        ],
        "prevention": [
            "Conduct pre-season soil test to balance pH between 6.0 and 6.8",
            "Avoid over-irrigation or soil compaction which inhibits nutrient uptake by roots"
        ]
    },
    "powdery mildew": {
        "title": "Powdery Mildew Disease",
        "type": "Obligate Fungal Pathogen (Leveillula taurica)",
        "severity": "High (Dry / Warm Weather)",
        "severity_badge": "border-purple-400 bg-purple-50 text-purple-800",
        "summary": "Characterized by diffuse, white powdery fungal patches predominantly on leaf undersides, matching bright yellow chlorotic spots on the upper surface.",
        "symptoms": [
            "White talcum-powder-like mycelial felt on underside of foliage",
            "Bright yellow chlorotic patches on corresponding upper leaf blade",
            "Upward curling, leaf drying, and severe premature leaf drop"
        ],
        "organic_remedies": [
            "Foliar spray of Potassium Bicarbonate (or baking soda) @ 3-5 g/L with horticultural oil",
            "Milk-water solution (10% unpasteurized milk foliar spray) under direct sunlight",
            "Sulfur-tolerant plant extracts and bio-fungicide Bacillus subtilis"
        ],
        "chemical_control": [
            "Wettable Sulfur 80% WDG @ 2-3 g/L at the very onset of white patches",
            "Hexaconazole 5% EC @ 1 mL/L or Penconazole 10% EC @ 0.5 mL/L",
            "Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 mL/L for advanced curative control"
        ],
        "prevention": [
            "Prune bottom 15 cm of foliage to eliminate soil-contact humidity traps",
            "Avoid warm, dry greenhouse stagnation by ensuring proper ventilation fans",
            "Collect and safely incinerate severely infected leaves to prevent spore dispersion"
        ]
    }
}


# ============================================================
# HEALTH & API ENDPOINTS
# ============================================================

@app.route("/health", methods=["GET"])
def health():
    return {
        "status": "healthy",
        "model": "ChilliFusionNet",
        "architecture": "EfficientNetB4 + CBAM + BiLSTM",
        "classes": class_names
    }


@app.route("/api/predict", methods=["POST"])
def api_predict():
    if "image" not in request.files and "file" not in request.files:
        return {"success": False, "error": "No image uploaded. Use form field 'image' or 'file'."}, 400

    file = request.files.get("image") or request.files.get("file")
    if file.filename == "":
        return {"success": False, "error": "Empty filename."}, 400

    filename = os.path.basename(file.filename)
    image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(image_path)

    try:
        predicted_class, confidence, probabilities = predict_disease(image_path)
        info = DISEASE_INFO.get(predicted_class.lower(), {})
        return {
            "success": True,
            "prediction": {
                "class_name": predicted_class,
                "confidence": confidence,
                "info": info
            },
            "probabilities": probabilities,
            "image_url": f"/static/uploads/{filename}"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}, 500


# ============================================================
# HOME PAGE
# ============================================================

@app.route(
    "/",
    methods=["GET", "POST"]
)
def home():
    result = None
    confidence = None
    probabilities = None
    image_file = None
    disease_info = None
    error = None

    if request.method == "POST":
        if "image" not in request.files:
            error = "Please select or capture a chilli leaf image."
            return render_template("index.html", error=error, class_names=class_names)

        file = request.files["image"]
        if file.filename == "":
            error = "No image selected. Please choose a file or take a photo."
            return render_template("index.html", error=error, class_names=class_names)

        safe_filename = os.path.basename(file.filename).replace(" ", "_")
        image_path = os.path.join(
            app.config["UPLOAD_FOLDER"],
            safe_filename
        )
        file.save(image_path)

        try:
            (
                result,
                confidence,
                probabilities
            ) = predict_disease(image_path)

            image_file = "uploads/" + safe_filename
            disease_info = DISEASE_INFO.get(result.lower(), None)

        except Exception as e:
            error = f"Model prediction error: {str(e)}"

    return render_template(
        "index.html",
        result=result,
        confidence=confidence,
        probabilities=probabilities,
        image_file=image_file,
        disease_info=disease_info,
        error=error,
        class_names=class_names
    )


# ============================================================
# RUN APPLICATION
# ============================================================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting ChilliFusionNet Flask Server on port {port}...")
    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )
