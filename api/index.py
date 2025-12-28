from fastapi import FastAPI, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os
from PIL import Image
import io
import json
from typing import Dict, Any

# -------------------------
# CONFIG
# -------------------------
# The API key is now checked at the start, which is a good practice.
GOOGLE_KEY = os.environ.get("GOOGLE_AI_STUDIO_KEY")
if not GOOGLE_KEY:
    raise RuntimeError("GOOGLE_AI_STUDIO_KEY not set")

genai.configure(api_key=GOOGLE_KEY)
model = genai.GenerativeModel("gemini-1.5-pro")

app = FastAPI(title="TRYONYOU PILOT API")

# Added CORS middleware to allow cross-origin requests from the frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, this should be restricted to the frontend domain.
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the garment database from the JSON file.
with open("api/garments.json") as f:
    garment_database = json.load(f)

# -------------------------
# HEALTH & STATUS
# -------------------------
@app.get("/api/status")
def status():
    return {
        "status": "IA CONNECTÉ",
        "mode": "PILOT VISUAL",
        "domain": "tryonyou.app"
    }

# -------------------------
# RECOMMENDATION ENGINE
# -------------------------
def calculate_fit_score(user_measurements: Dict[str, float], garment: Dict[str, Any]) -> float:
    """
    Calculates a fit score for a single garment based on user measurements.
    The core logic of the recommendation engine.
    """
    score = 0

    # Basic comparison of measurements
    for key, user_value in user_measurements.items():
        garment_value = garment["measurements"].get(key)
        if garment_value:
            # Simple difference scoring. A smaller difference is better.
            difference = abs(user_value - garment_value)
            score -= difference

    # Adjust score based on fabric elasticity.
    # Higher elasticity allows for more tolerance in fit.
    elasticity_bonus = garment["fabric_properties"]["elasticity_percent"] / 100
    score += elasticity_bonus * 5 # Arbitrary weight for elasticity

    # Future logic could also incorporate drape_score and cut_type.

    return score

@app.post("/api/recommend")
async def recommend_garment(data: Dict[str, Any] = Body(...)):
    """
    Receives user measurements and preferences, and recommends the best garment.
    """
    user_measurements = data.get("measurements", {})
    user_preferences = data.get("preferences", {})

    if not user_measurements:
        return {"ok": False, "error": "No measurements provided"}

    best_garment = None
    best_score = -float('inf')

    for garment in garment_database:
        # Filter by occasion if provided
        if user_preferences.get("occasion") and garment["meta"]["occasion_tag"] != user_preferences["occasion"]:
            continue

        score = calculate_fit_score(user_measurements, garment)

        if score > best_score:
            best_score = score
            best_garment = garment

    if best_garment:
        # Generate a human-readable explanation for the recommendation.
        explanation = f"Based on your proportions, this {best_garment['meta']['name']} is an excellent fit. The fabric's elasticity ensures comfort around the chest and shoulders, aligning with a {user_preferences.get('fit', 'regular')} preference."
        return {
            "ok": True,
            "recommendation": best_garment,
            "explanation": explanation
        }
    else:
        return {"ok": False, "error": "No suitable garment found"}


# -------------------------
# IMAGE ANALYSIS (LEGACY - can be repurposed)
# -------------------------
@app.post("/api/process")
async def process_biometry(file: UploadFile = File(...)):
    """
    This endpoint can be used for secondary analysis or future features.
    For the core pilot, the recommendation engine is primary.
    """
    try:
        raw = await file.read()
        image = Image.open(io.BytesIO(raw)).convert("RGB")

        prompt = """
        You are a fashion stylist for an in-store digital mirror.
        Analyse the person's silhouette visually.
        Do NOT give measurements.
        Do NOT mention body size numbers.
        Do NOT claim biometric accuracy.

        Output:
        - Silhouette description (short)
        - What type of clothing fits best
        - One elegant recommendation sentence for a retail screen
        """

        response = model.generate_content([prompt, image])

        return {
            "ok": True,
            "analysis": response.text,
            "disclaimer": "Visual pilot – no numeric body measurement"
        }

    except Exception as e:
        return {
            "ok": False,
            "error": str(e)
        }
