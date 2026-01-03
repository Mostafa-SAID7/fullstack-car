from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.schemas import TrainingRequestDTO, TrainingStatusDTO, TrainingMetric
import logging
import asyncio
import random
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

# Global state for training
training_state = {
    "is_training": False,
    "progress": 0.0,
    "status": "Idle",
    "metrics": [],
    "results": None
}

training_history = []

async def run_training_task(params: TrainingRequestDTO):
    global training_state, training_history
    try:
        training_state["is_training"] = True
        training_state["metrics"] = []
        training_state["status"] = f"Initializing training with {params.base_model}..."
        training_state["progress"] = 5.0
        await asyncio.sleep(2)
        
        training_state["status"] = "Preparing dataset..."
        training_state["progress"] = 15.0
        await asyncio.sleep(2)
        
        training_state["status"] = f"Training for {params.epochs} epochs..."
        
        base_loss = 0.8
        base_acc = 0.4
        
        for epoch in range(1, params.epochs + 1):
            # Generate synthetic metrics
            base_loss *= 0.7 + (random.random() * 0.1)
            base_acc += (1.0 - base_acc) * (0.3 + random.random() * 0.2)
            
            metric = TrainingMetric(
                epoch=epoch,
                loss=round(base_loss, 4),
                accuracy=round(base_acc, 4)
            )
            training_state["metrics"].append(metric)
            
            training_state["progress"] = 15.0 + (epoch / params.epochs) * 75.0
            training_state["status"] = f"Epoch {epoch}/{params.epochs} - Loss: {metric.loss} - Acc: {metric.accuracy}"
            await asyncio.sleep(3)
            
        training_state["status"] = "Saving model..."
        training_state["progress"] = 95.0
        await asyncio.sleep(2)
        
        training_state["is_training"] = False
        training_state["status"] = "Completed"
        training_state["progress"] = 100.0
        training_state["results"] = {
            "loss": training_state["metrics"][-1].loss if training_state["metrics"] else 0.0,
            "accuracy": training_state["metrics"][-1].accuracy if training_state["metrics"] else 0.0,
            "duration": f"{params.epochs * 3 + 6}s",
            "model_path": f"./models/{params.base_model}_fine_tuned_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        }
        
        # Add to history
        training_history.insert(0, {
            "id": f"RUN_{len(training_history) + 1}",
            "timestamp": datetime.now().isoformat(),
            "config": params.dict(),
            "results": training_state["results"]
        })
        
    except Exception as e:
        logger.error(f"Training failed: {e}")
        training_state["is_training"] = False
        training_state["status"] = f"Error: {str(e)}"

@router.post("/start", response_model=TrainingStatusDTO)
async def start_training(params: TrainingRequestDTO, background_tasks: BackgroundTasks):
    if training_state["is_training"]:
        raise HTTPException(status_code=400, detail="Training already in progress")
    
    background_tasks.add_task(run_training_task, params)
    return TrainingStatusDTO(**training_state)

@router.get("/status", response_model=TrainingStatusDTO)
async def get_status():
    return TrainingStatusDTO(**training_state)

@router.get("/history")
async def get_history():
    return {"history": training_history}
