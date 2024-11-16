import torch
import torchvision.transforms as transforms
from torchvision.models import resnet50, ResNet50_Weights
from PIL import Image
import json

class BuildingClassifier:
    def __init__(self):
        # Load pre-trained ResNet model
        self.model = resnet50(weights=ResNet50_Weights.DEFAULT)
        self.model.eval()
        
        # Define image transformations
        self.transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        
        # Define your building classes
        self.classes = {
            0: "Main Building",
            1: "Library",
            2: "Science Block",
            3: "Engineering Block",
            4: "Cafeteria",
            # Add more buildings as needed
        }
        
        # Load your fine-tuned weights if available
        # self.model.load_state_dict(torch.load('building_classifier_weights.pth'))

    def predict(self, image_path):
        try:
            # Open and preprocess image
            image = Image.open(image_path).convert('RGB')
            image_tensor = self.transform(image)
            image_tensor = image_tensor.unsqueeze(0)
            
            # Make prediction
            with torch.no_grad():
                outputs = self.model(image_tensor)
                _, predicted = torch.max(outputs, 1)
                
                # Get prediction probabilities
                probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
                
            # Get top 3 predictions
            top_prob, top_class = torch.topk(probabilities, 3)
            
            results = []
            for i in range(3):
                results.append({
                    "building": self.classes[top_class[i].item()],
                    "confidence": float(top_prob[i].item())
                })
            
            return results
            
        except Exception as e:
            return {"error": str(e)}