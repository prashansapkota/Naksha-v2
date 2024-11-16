from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
import numpy as np
from PIL import Image
import io
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model globally so it's only loaded once
model = YOLO('./runs/classify/train7/weights/last.pt')

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    # Read the image file
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # Make prediction
    results = model(image)
    
    # Get the names dictionary and probabilities
    names_dict = results[0].names
    probs = results[0].probs.data.tolist()
    
    # Get the predicted class
    predicted_class = names_dict[np.argmax(probs)]
    
    # Return prediction results
    return {
        "predicted_class": predicted_class,
        "probabilities": {names_dict[i]: prob for i, prob in enumerate(probs)}
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
