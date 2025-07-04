import os
import logging
from openai import OpenAI

class OpenAIClient:
    def __init__(self):
        """Initialize OpenAI client with API key from environment"""
        self.api_key = os.environ.get("OPENAI_API_KEY", "")
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None
        
        if not self.api_key:
            logging.warning("OPENAI_API_KEY not found in environment variables")
    
    def is_configured(self):
        """Check if OpenAI client is properly configured"""
        return bool(self.api_key and self.client)
    
    def get_response(self, chat_history):
        """Get AI response from OpenAI API"""
        if not self.is_configured():
            raise Exception("OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
        
        try:
            # Add system message for better AI behavior
            messages = [
                {
                    "role": "system",
                    "content": """You are a helpful AI assistant with expertise in programming and general knowledge. 
                    You can answer questions, help with coding problems, generate code, and provide explanations.
                    When providing code, make sure to format it properly and explain what it does.
                    Be concise but thorough in your responses."""
                }
            ]
            
            # Add chat history
            messages.extend(chat_history)
            
            # the newest OpenAI model is "gpt-4o" which was released May 13, 2024.
            # do not change this unless explicitly requested by the user
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                max_tokens=2000,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logging.error(f"OpenAI API error: {str(e)}")
            raise Exception(f"Failed to get AI response: {str(e)}")
