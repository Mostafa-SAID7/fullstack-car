import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from matplotlib.patches import Rectangle
from datasets import load_dataset
import numpy as np
import base64
import io
from PIL import Image
import os
import time
from typing import Dict, List, Any, Optional, Tuple
import logging

logger = logging.getLogger(__name__)

class CarImageAnalysisService:
    def __init__(self):
        self.dataset = None
        self.dataset_name = "SaulLu/Stanford-Cars"
        self.output_dir = "./visualizations"
        os.makedirs(self.output_dir, exist_ok=True)
    
    async def load_dataset(self, dataset_name: str = None) -> bool:
        """Load the Stanford Cars dataset"""
        try:
            if dataset_name:
                self.dataset_name = dataset_name
            
            logger.info(f"Loading dataset: {self.dataset_name}")
            self.dataset = load_dataset(self.dataset_name, trust_remote_code=True)
            logger.info("Dataset loaded successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to load dataset: {str(e)}")
            return False
    
    async def get_dataset_sample(self, index: int = 100, split: str = "train") -> Dict[str, Any]:
        """Get a sample from the dataset with bounding box information"""
        try:
            if not self.dataset:
                await self.load_dataset()
            
            if split not in self.dataset:
                raise ValueError(f"Split '{split}' not found in dataset")
            
            sample = self.dataset[split][index]
            
            # Extract bounding box coordinates
            bbox = sample.get("bbox", [])
            if isinstance(bbox, list) and len(bbox) > 0:
                box_coord = bbox[0] if isinstance(bbox[0], list) else bbox
            else:
                box_coord = [0, 0, 100, 100]  # Default bbox if none found
            
            # Get image information
            image = sample["image"]
            
            result = {
                "image": image,
                "bbox": box_coord,
                "car_class": sample.get("class", "Unknown"),
                "image_info": {
                    "size": image.size if hasattr(image, 'size') else (0, 0),
                    "mode": image.mode if hasattr(image, 'mode') else "RGB",
                    "format": image.format if hasattr(image, 'format') else "Unknown"
                },
                "index": index,
                "split": split
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error getting dataset sample: {str(e)}")
            raise
    
    async def visualize_sample_with_bbox(self, index: int = 100, split: str = "train") -> str:
        """Create visualization of dataset sample with bounding box"""
        try:
            start_time = time.time()
            
            # Get sample data
            sample_data = await self.get_dataset_sample(index, split)
            image = sample_data["image"]
            box_coord = sample_data["bbox"]
            
            # Create matplotlib figure
            fig, ax = plt.subplots(figsize=(10, 8))
            
            # Display image
            ax.imshow(image)
            
            # Add bounding box rectangle
            # Stanford Cars bbox format: [y_min, y_max, x_min, x_max]
            if len(box_coord) >= 4:
                y_min, y_max, x_min, x_max = box_coord[:4]
                width = x_max - x_min
                height = y_max - y_min
                
                rect = Rectangle(
                    (x_min, y_min), 
                    width, 
                    height, 
                    linewidth=2, 
                    edgecolor='red', 
                    facecolor='none'
                )
                ax.add_patch(rect)
            
            # Add title and labels
            ax.set_title(f'Car Detection - Sample {index}\nClass: {sample_data["car_class"]}', 
                        fontsize=14, fontweight='bold')
            ax.axis('off')
            
            # Save visualization
            output_path = os.path.join(self.output_dir, f"sample_{index}_bbox.png")
            plt.savefig(output_path, bbox_inches='tight', dpi=150)
            plt.close()
            
            processing_time = time.time() - start_time
            logger.info(f"Visualization created in {processing_time:.2f}s: {output_path}")
            
            return output_path
            
        except Exception as e:
            logger.error(f"Error creating visualization: {str(e)}")
            raise
    
    async def analyze_custom_image(self, image_data: Any, analyze_type: str = "detection") -> Dict[str, Any]:
        """Analyze a custom image for car detection"""
        try:
            start_time = time.time()
            
            # Convert image data if needed
            if isinstance(image_data, str):
                # Assume base64 encoded image
                image_bytes = base64.b64decode(image_data)
                image = Image.open(io.BytesIO(image_bytes))
            elif hasattr(image_data, 'read'):
                # File-like object
                image = Image.open(image_data)
            else:
                image = image_data
            
            # For now, create a simple mock analysis
            # In a real implementation, you would use a trained model here
            mock_detections = [
                {
                    "bbox": {
                        "x": 100,
                        "y": 50,
                        "width": 200,
                        "height": 150
                    },
                    "confidence": 0.85,
                    "car_class": "sedan",
                    "make": "Toyota",
                    "model": "Camry"
                }
            ]
            
            processing_time = time.time() - start_time
            
            result = {
                "detections": mock_detections,
                "image_info": {
                    "size": image.size if hasattr(image, 'size') else (0, 0),
                    "mode": image.mode if hasattr(image, 'mode') else "RGB",
                    "format": image.format if hasattr(image, 'format') else "Unknown"
                },
                "analysis_summary": f"Detected {len(mock_detections)} car(s) in the image",
                "processing_time": processing_time
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error analyzing custom image: {str(e)}")
            raise
    
    async def get_dataset_info(self) -> Dict[str, Any]:
        """Get information about the loaded dataset"""
        try:
            if not self.dataset:
                await self.load_dataset()
            
            info = {
                "dataset_name": self.dataset_name,
                "splits": list(self.dataset.keys()),
                "total_samples": {split: len(self.dataset[split]) for split in self.dataset.keys()},
                "features": list(self.dataset["train"].features.keys()) if "train" in self.dataset else [],
                "description": "Stanford Cars dataset with car images and bounding boxes"
            }
            
            return info
            
        except Exception as e:
            logger.error(f"Error getting dataset info: {str(e)}")
            raise
    
    async def batch_visualize_samples(self, indices: List[int], split: str = "train") -> List[str]:
        """Create visualizations for multiple samples"""
        try:
            output_paths = []
            
            for index in indices:
                try:
                    path = await self.visualize_sample_with_bbox(index, split)
                    output_paths.append(path)
                except Exception as e:
                    logger.warning(f"Failed to visualize sample {index}: {str(e)}")
                    continue
            
            return output_paths
            
        except Exception as e:
            logger.error(f"Error in batch visualization: {str(e)}")
            raise