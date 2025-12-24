
from fastapi import FastAPI, UploadFile, File
import google.generativeai as genai
import os

app = FastAPI()
genai.configure(api_key=os.environ.get("GOOGLE_AI_STUDIO_KEY"))
model = genai.GenerativeModel("gemini-1.5-pro")

@app.get("/api/status")
def status(): return {"status": "IA CONNECTÉ", "domain": "tryonyou.app"}

@app.post("/api/process")
async def process_biometry(file: UploadFile = File(...)):
    content = await file.read()
    # Lógica para analizar la imagen y ajustar la ropa de Lafayette
    response = model.generate_content(["Analyse cette image pour essai virtuel de vêtements.", content])
    return {"data": response.text}
