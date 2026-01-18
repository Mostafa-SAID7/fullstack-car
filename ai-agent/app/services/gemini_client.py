import google.generativeai as genai
import logging
from typing import Optional, List, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

class GeminiClient:
    """Service for interacting with Google's Gemini AI"""
    
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.is_configured = False
        
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-1.5-flash')
                self.is_configured = True
                logger.info("Gemini AI client configured successfully")
            except Exception as e:
                logger.error(f"Failed to configure Gemini AI client: {e}")
        else:
            logger.warning("Gemini API key not found in settings")

    async def generate_response(
        self, 
        prompt: str, 
        history: Optional[List[Dict[str, str]]] = None,
        max_tokens: int = 512,
        temperature: float = 0.7,
        model_id: str = "gemini-1.5-flash",
        system_instruction: Optional[str] = None,
        safety_settings: Optional[List[Dict[str, str]]] = None,
        images: Optional[List[str]] = None,
        tools: Optional[List[Any]] = None,
        tool_config: Optional[Any] = None
    ) -> Optional[str]:
        """Generate response using Gemini with advanced options (Vision, Tools)"""
        if not self.is_configured:
            logger.error("Gemini client not configured")
            return None
            
        try:
            # Initialize model with optional system instruction and tools
            model = genai.GenerativeModel(
                model_name=model_id,
                system_instruction=system_instruction,
                tools=tools,
                tool_config=tool_config
            )
            
            # Prepare content parts (Text + Images)
            content_parts = [prompt]
            if images:
                for img_base64 in images:
                    content_parts.append({
                        "mime_type": "image/jpeg", # Default to jpeg
                        "data": img_base64
                    })
            # Format history for Gemini if provided
            chat_history = []
            if history:
                for entry in history:
                    role = "user" if entry["role"] == "user" else "model"
                    chat_history.append({"role": role, "parts": [entry["content"]]})
            
            # Start chat or single generation
            generation_config = genai.types.GenerationConfig(
                max_output_tokens=max_tokens,
                temperature=temperature
            )
            
            if chat_history:
                chat = model.start_chat(history=chat_history)
                response = await chat.send_message_async(
                    content_parts,
                    generation_config=generation_config,
                    safety_settings=safety_settings
                )
            else:
                response = await model.generate_content_async(
                    content_parts,
                    generation_config=generation_config,
                    safety_settings=safety_settings
                )
            
            # --- Tool Calling Loop (Simple Implementation) ---
            # If the model wants to call a function, it will be in response.candidates[0].content.parts
            # We check for function_call and if it exists, we execute it and send the response back.
            
            # Note: The 'typing' of the response can be tricky.
            # For Gemini 1.5, we can check for function calls.
            
            if response.candidates and response.candidates[0].content.parts:
                part = response.candidates[0].content.parts[0]
                if hasattr(part, 'function_call'):
                    fn_call = part.function_call
                    fn_name = fn_call.name
                    fn_args = dict(fn_call.args)
                    
                    logger.info(f"LLM requested tool: {fn_name} with args {fn_args}")
                    
                    from app.tools.marketplace_tools import TOOL_FUNCTIONS
                    if fn_name in TOOL_FUNCTIONS:
                        try:
                            # Execute the tool
                            result = TOOL_FUNCTIONS[fn_name](**fn_args)
                            
                            # Send result back to Gemini (only if in chat mode)
                            if chat_history:
                                response = await chat.send_message_async(
                                    genai.types.Content(
                                        parts=[genai.types.Part(
                                            function_response=genai.types.FunctionResponse(
                                                name=fn_name,
                                                response={'result': result}
                                            )
                                        )]
                                    )
                                )
                                return response.text
                            else:
                                # For single generation, we'd need to rebuild the prompt with result
                                # For now, we return a combined string or the result info
                                return f"[Tool Result: {result}] Please use this to answer."
                        except Exception as tool_err:
                            logger.error(f"Tool execution failed: {tool_err}")
                            return f"I tried to search the marketplace but encountered an error: {tool_err}"

            return response.text
        except Exception as e:
            logger.error(f"Gemini generation error: {e}")
            return None

# Singleton instance
gemini_client = GeminiClient()
