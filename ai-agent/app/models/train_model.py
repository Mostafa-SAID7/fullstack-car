import os
import json
import logging
from typing import List, Dict
try:
    from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer
    from datasets import Dataset
    import torch
except ImportError:
    print("Training dependencies missing. Run: pip install transformers datasets torch")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelTrainer:
    def __init__(self, base_model: str = "gpt2"):
        self.base_model = base_model
        self.tokenizer = AutoTokenizer.from_pretrained(base_model)
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
            
    def prepare_data(self, data_path: str):
        """Load and tokenize automotive dataset"""
        with open(data_path, 'r') as f:
            raw_data = json.load(f)
            
        dataset = Dataset.from_list(raw_data)
        
        def tokenize_func(examples):
            return self.tokenizer(examples["text"], padding="max_length", truncation=True, max_length=512)
            
        return dataset.map(tokenize_func, batched=True)

    def train(self, output_dir: str, dataset):
        """Execute fine-tuning"""
        model = AutoModelForCausalLM.from_pretrained(self.base_model)
        
        training_args = TrainingArguments(
            output_dir=output_dir,
            evaluation_strategy="epoch",
            learning_rate=2e-5,
            weight_decay=0.01,
            num_train_epochs=3,
            push_to_hub=False,
        )
        
        trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=dataset,
        )
        
        logger.info("Starting training...")
        trainer.train()
        model.save_pretrained(output_dir)
        self.tokenizer.save_pretrained(output_dir)
        logger.info(f"Model saved to {output_dir}")

if __name__ == "__main__":
    # Example usage
    # trainer = ModelTrainer()
    # data = trainer.prepare_data("car_knowledge.json")
    # trainer.train("./trained_car_model", data)
    print("AI Model Training Script Initialized. Configure 'car_knowledge.json' to start training.")
