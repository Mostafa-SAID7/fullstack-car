from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from typing import List
from app.models.schemas import (
    ImageAnalysisRequestDTO, 
    ImageAnalysisResponseDTO,
    DatasetSampleRequestDTO,
    DatasetSampleResponseDTO
)
from app.services.car_image_service import CarImageAnalysisService
import logging
import os

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize the car image service
car_image_service = CarImageAnalysisService()

@router.post("/analyze", response_model=ImageAnalysisResponseDTO)
async def analyze_car_image(request: ImageAnalysisRequestDTO):
    """Analyze a car image for detection and classification"""
    try:
        if request.image_base64:
            result = await car_image_service.analyze_custom_image(
                request.image_base64, 
                request.analyze_type
            )
        elif request.dataset_index is not None:
            # Analyze a sample from the dataset
            sample_data = await car_image_service.get_dataset_sample(request.dataset_index)
            result = await car_image_service.analyze_custom_image(
                sample_data["image"], 
                request.analyze_type
            )
        else:
            raise HTTPException(status_code=400, detail="Either image_base64 or dataset_index must be provided")
        
        return ImageAnalysisResponseDTO(**result)
        
    except Exception as e:
        logger.error(f"Error analyzing car image: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/dataset/sample", response_model=DatasetSampleResponseDTO)
async def get_dataset_sample(request: DatasetSampleRequestDTO):
    """Get a sample from the Stanford Cars dataset"""
    try:
        sample_data = await car_image_service.get_dataset_sample(
            request.index, 
            request.split
        )
        
        # Create visualization
        viz_path = await car_image_service.visualize_sample_with_bbox(
            request.index, 
            request.split
        )
        
        return DatasetSampleResponseDTO(
            image_url=f"/api/car-images/visualization/{os.path.basename(viz_path)}",
            bbox=sample_data["bbox"],
            car_class=sample_data["car_class"],
            image_info=sample_data["image_info"],
            visualization_path=viz_path
        )
        
    except Exception as e:
        logger.error(f"Error getting dataset sample: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dataset/info")
async def get_dataset_info():
    """Get information about the Stanford Cars dataset"""
    try:
        info = await car_image_service.get_dataset_info()
        return info
        
    except Exception as e:
        logger.error(f"Error getting dataset info: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/dataset/batch-visualize")
async def batch_visualize_samples(indices: List[int], split: str = "train"):
    """Create visualizations for multiple dataset samples"""
    try:
        if len(indices) > 20:
            raise HTTPException(status_code=400, detail="Maximum 20 samples allowed per batch")
        
        paths = await car_image_service.batch_visualize_samples(indices, split)
        
        return {
            "visualization_paths": [f"/api/car-images/visualization/{os.path.basename(path)}" for path in paths],
            "total_created": len(paths),
            "requested": len(indices)
        }
        
    except Exception as e:
        logger.error(f"Error in batch visualization: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/visualization/{filename}")
async def get_visualization(filename: str):
    """Serve visualization images"""
    try:
        file_path = os.path.join(car_image_service.output_dir, filename)
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Visualization not found")
        
        return FileResponse(
            file_path,
            media_type="image/png",
            filename=filename
        )
        
    except Exception as e:
        logger.error(f"Error serving visualization: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-analyze")
async def upload_and_analyze(file: UploadFile = File(...)):
    """Upload an image file and analyze it for car detection"""
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read file content
        file_content = await file.read()
        
        # Analyze the uploaded image
        result = await car_image_service.analyze_custom_image(file_content)
        
        return ImageAnalysisResponseDTO(**result)
        
    except Exception as e:
        logger.error(f"Error analyzing uploaded image: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/demo/stanford-cars/{index}")
async def demo_stanford_cars_visualization(index: int = 100):
    """Demo endpoint to visualize a Stanford Cars dataset sample"""
    try:
        if index < 0 or index > 16000:  # Approximate dataset size
            raise HTTPException(status_code=400, detail="Index must be between 0 and 16000")
        
        # Create visualization
        viz_path = await car_image_service.visualize_sample_with_bbox(index)
        
        # Get sample info
        sample_data = await car_image_service.get_dataset_sample(index)
        
        return {
            "message": f"Visualization created for sample {index}",
            "visualization_url": f"/api/car-images/visualization/{os.path.basename(viz_path)}",
            "car_class": sample_data["car_class"],
            "bbox": sample_data["bbox"],
            "image_info": sample_data["image_info"]
        }
        
    except Exception as e:
        logger.error(f"Error in demo visualization: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))