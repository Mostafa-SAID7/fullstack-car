
import sys
import os

print(f"Python executable: {sys.executable}")
print(f"Python version: {sys.version}")

try:
    print("Attempting to import transformers...")
    from transformers import pipeline, AutoTokenizer
    print("Transformers imported successfully!")
    
    print("Attempting to import torch...")
    import torch
    print(f"Torch imported successfully! Version: {torch.__version__}")
    print(f"CUDA available: {torch.cuda.is_available()}")
    
    print("\nAttempting to load GPT-2 model (this may download ~500MB)...")
    model_name = "gpt2"
    
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
        
    generator = pipeline(
        "text-generation", 
        model=model_name, 
        tokenizer=tokenizer,
        max_new_tokens=50
    )
    print("GPT-2 model loaded successfully!")
    
    print("\nGenerating test text...")
    result = generator("Hello, how are you?", do_sample=True)
    print(f"Model output: {result[0]['generated_text']}")
    
    print("\nSUCCESS: Environment is ready for AI Agent!")
    
except ImportError as e:
    print(f"\nERROR: Missing dependencies: {e}")
    print("Please ensure pip install -r requirements.txt completed successfully.")
except Exception as e:
    print(f"\nERROR: {e}")
    import traceback
    traceback.print_exc()
