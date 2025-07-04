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
            return "AI服務需要設定API金鑰才能使用。"
        
        try:
            # Simple system message
            messages = [
                {
                    "role": "system",
                    "content": "你是一個友善的AI助手，請提供有用的回答。"
                }
            ]
            
            # Add only last 3 messages to reduce complexity
            messages.extend(chat_history[-3:] if chat_history else [])
            
            # the newest OpenAI model is "gpt-4o" which was released May 13, 2024.
            # do not change this unless explicitly requested by the user
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                max_tokens=500,
                temperature=0.7,
                timeout=20
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logging.error(f"OpenAI API error: {str(e)}")
            return "抱歉，AI服務暫時無法回應。請稍後再試。"
