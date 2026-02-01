from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
import numpy as np
from PIL import Image
import io
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow all origins for now (frontend + Render domain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://naksha-v2.vercel.app",
        "https://naksha-v2-hcp3079fo-prashansapkotas-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Absolute path to model (critical for deployment)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(
    BASE_DIR,
    "runs",
    "classify",
    "train7",
    "weights",
    "last.pt"
)

model = YOLO(MODEL_PATH)

@app.get("/healthz")
def health_check():
    return {"status": "ok"}

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    results = model(image)

    names_dict = results[0].names
    probs = results[0].probs.data.tolist()
    predicted_class = names_dict[np.argmax(probs)]

    return {
        "predicted_class": predicted_class,
        "probabilities": {
            names_dict[i]: prob for i, prob in enumerate(probs)
        }
    }
