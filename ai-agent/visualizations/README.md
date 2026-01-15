# Visualizations Directory

This directory stores generated visualization images from the Car Image Service.

## Purpose

The Car Image Service (`app/services/car_image_service.py`) generates visualizations of car images from the Stanford Cars dataset with bounding boxes and annotations. All generated images are saved here.

## Generated Files

When you use the car image visualization endpoints, files will be created here with the naming pattern:
- `sample_{index}_bbox.png` - Individual car image with bounding box overlay

## API Endpoints

To generate visualizations, use these endpoints:

### Single Visualization
```
GET /api/car-images/demo/stanford-cars/{index}
```
Example: `http://localhost:8003/api/car-images/demo/stanford-cars/100`

### Batch Visualization
```
POST /api/car-images/dataset/batch-visualize
Body: {"indices": [100, 200, 300], "split": "train"}
```

### View Visualization
```
GET /api/car-images/visualization/{filename}
```
Example: `http://localhost:8003/api/car-images/visualization/sample_100_bbox.png`

## Features

Each visualization includes:
- Original car image
- Bounding box overlay (red rectangle)
- Car class/model label
- Image dimensions
- Dataset split information

## Storage

- Directory: `./visualizations`
- Format: PNG images
- DPI: 150
- Auto-created on first use

## Cleanup

You can safely delete files in this directory. They will be regenerated when requested through the API.
