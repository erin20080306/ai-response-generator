import os
import logging
from openai import OpenAI
from web_search import WebSearcher
import re

class OpenAIClient:
    def __init__(self):
        """Initialize OpenAI client with API key from environment"""
        self.api_key = os.environ.get("OPENAI_API_KEY", "")
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None
        
        # 初始化網路搜尋器
        self.web_searcher = WebSearcher()
        
        if not self.api_key:
            logging.warning("OPENAI_API_KEY not found in environment variables")
    
    def is_configured(self):
        """Check if OpenAI client is properly configured"""
        return bool(self.api_key and self.client)
    
    def needs_web_search(self, user_message):
        """檢查是否需要網路搜尋"""
        # 天氣相關關鍵詞
        weather_keywords = ['天氣', '氣溫', '下雨', '晴天', '陰天', '颱風', '溫度', '濕度', '氣象']
        # 法律相關關鍵詞  
        legal_keywords = ['法律', '法規', '條文', '法條', '刑法', '民法', '勞基法', '著作權法', '憲法']
        # 新聞相關關鍵詞
        news_keywords = ['新聞', '最新', '時事', '消息', '報導']
        # 即時資訊關鍵詞
        realtime_keywords = ['現在', '目前', '今天', '最新', '即時', '股價', '匯率']
        
        message_lower = user_message.lower()
        
        for keyword in weather_keywords + legal_keywords + news_keywords + realtime_keywords:
            if keyword in message_lower:
                return True
        
        return False
    
    def get_search_type(self, user_message):
        """判斷搜尋類型"""
        message_lower = user_message.lower()
        
        if any(keyword in message_lower for keyword in ['天氣', '氣溫', '下雨', '晴天', '陰天', '颱風', '溫度', '濕度', '氣象']):
            return 'weather'
        elif any(keyword in message_lower for keyword in ['法律', '法規', '條文', '法條', '刑法', '民法', '勞基法', '著作權法', '憲法']):
            return 'legal'
        elif any(keyword in message_lower for keyword in ['新聞', '時事', '消息', '報導']):
            return 'news'
        else:
            return 'general'
    
    def perform_web_search(self, user_message, search_type):
        """執行網路搜尋"""
        try:
            if search_type == 'weather':
                # 提取地點信息
                location = self.extract_location(user_message) or "台北"
                return self.web_searcher.get_weather_info(location)
            elif search_type == 'legal':
                return self.web_searcher.search_legal_info(user_message)
            elif search_type == 'news':
                topic = self.extract_news_topic(user_message) or "台灣"
                return self.web_searcher.search_news(topic)
            else:
                return self.web_searcher.general_search(user_message)
        except Exception as e:
            logging.error(f"網路搜尋失敗: {e}")
            return None
    
    def extract_location(self, message):
        """從訊息中提取地點"""
        # 常見台灣城市
        cities = ['台北', '新北', '桃園', '新竹', '苗栗', '台中', '彰化', '南投', '雲林', '嘉義', '台南', '高雄', '屏東', '宜蘭', '花蓮', '台東']
        for city in cities:
            if city in message:
                return city
        return None
    
    def extract_news_topic(self, message):
        """從訊息中提取新聞主題"""
        # 移除常見詞彙，提取核心主題
        common_words = ['新聞', '最新', '消息', '報導', '的', '了', '是', '有', '在', '和', '與']
        words = message.split()
        topic_words = [word for word in words if word not in common_words and len(word) > 1]
        return ' '.join(topic_words[:3]) if topic_words else None
    
    def format_search_results(self, search_results, search_type):
        """格式化搜尋結果"""
        if not search_results:
            return "搜尋結果為空，請稍後再試。"
        
        if search_type == 'weather':
            if search_results.get('status') == 'success':
                location = search_results.get('location', '未知地點')
                if 'summary' in search_results and search_results['summary']:
                    return f"📍 {location} 天氣資訊：\n{search_results['summary']}\n\n💡 建議查看中央氣象局官方網站獲取最新精確天氣資訊"
                elif 'data' in search_results and search_results['data']:
                    # 從搜尋結果格式化天氣資訊
                    weather_text = ""
                    for result in search_results['data'][:2]:
                        weather_text += f"• {result['title']}\n  {result['snippet']}\n\n"
                    return f"📍 {location} 天氣資訊：\n{weather_text}💡 建議查看中央氣象局官方網站獲取最新精確天氣資訊"
                else:
                    return f"📍 {location} 天氣資訊：\n建議查看中央氣象局官方網站獲取最新天氣資訊"
            else:
                return f"天氣查詢失敗：{search_results.get('message', '建議查看中央氣象局官方網站獲取最新天氣資訊')}"
        
        elif search_type == 'legal':
            if search_results.get('results'):
                legal_info = "⚖️ **法律資訊搜尋結果**：\n\n"
                for i, result in enumerate(search_results['results'][:2], 1):
                    legal_info += f"{i}. **{result['title']}**\n   {result['snippet']}\n\n"
                legal_info += "⚠️ " + search_results.get('disclaimer', '')
                return legal_info
            else:
                return "抱歉，無法找到相關法律資訊。"
        
        elif search_type == 'news':
            if search_results.get('news'):
                news_info = "📰 **最新新聞**：\n\n"
                for i, news in enumerate(search_results['news'][:3], 1):
                    news_info += f"{i}. **{news['title']}**\n   {news['snippet']}\n\n"
                return news_info
            else:
                return "抱歉，無法獲取最新新聞。"
        
        else:
            if search_results.get('results'):
                general_info = "🔍 **搜尋結果**：\n\n"
                for i, result in enumerate(search_results['results'][:3], 1):
                    general_info += f"{i}. **{result['title']}**\n   {result['snippet']}\n\n"
                return general_info
            else:
                return "抱歉，無法找到相關資訊。"
    
    def get_response(self, chat_history):
        """Get AI response from OpenAI API with web search capability"""
        if not self.is_configured():
            raise Exception("OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
        
        try:
            # 獲取最新的用戶訊息
            latest_message = ""
            if chat_history:
                for msg in reversed(chat_history):
                    if msg.get("role") == "user":
                        latest_message = msg.get("content", "")
                        break
            
            # 檢查是否需要網路搜尋
            search_results = None
            web_info = ""
            
            if latest_message and self.needs_web_search(latest_message):
                search_type = self.get_search_type(latest_message)
                search_results = self.perform_web_search(latest_message, search_type)
                
                if search_results:
                    web_info = self.format_search_results(search_results, search_type)
            
            # 準備系統提示詞，整合網路搜尋功能
            system_content = """You are a helpful AI assistant with web search capabilities. Respond with maximum precision and simplicity:

            FOR CODE/FORMULAS:
            - Give the exact code/formula with single backticks only
            - Format: `=SUM(A1:A10)` (no triple backticks)
            - Add 1-2 sentence explanation after
            - Keep code display clean and minimal

            FOR APPS SCRIPT QUESTIONS:
            - When asked for only GS code: provide GS code with brief setup tutorial
            - When asked for only HTML code: provide HTML code with usage tutorial
            - Include step-by-step instructions for each part
            - Explain where to paste the code and how to use it

            FOR TECHNICAL QUESTIONS:
            - Direct answer first
            - Minimal explanation
            - No unnecessary background

            FOR REAL-TIME INFORMATION (Weather, Legal, News):
            - If web search results are provided, integrate them into your response
            - Provide accurate, up-to-date information
            - For legal questions, remind users to consult professional lawyers for specific cases

            TAIWAN SPECIAL LEAVE LAW (最新版本):
            - 工作滿6個月以上，未滿1年者：3日特休
            - 工作滿1年以上，未滿2年者：7日特休
            - 工作滿2年以上，未滿3年者：10日特休
            - 工作滿3年以上，未滿5年者：每年14日特休
            - 工作滿5年以上，未滿10年者：每年15日特休
            - 工作滿10年以上者：每一年再加給1日，加至30日為止
            
            FOR SPECIAL LEAVE CALCULATIONS:
            - Always use the above Taiwan law standards
            - Provide exact formulas for spreadsheet calculations
            - Include step-by-step calculation examples

            STYLE REQUIREMENTS:
            - Be extremely concise
            - Accuracy over length
            - Use Traditional Chinese when responding in Chinese
            - Code blocks should be clean and focused
            - Separate different types of code clearly"""
            
            if web_info:
                system_content += f"\n\nCURRENT WEB SEARCH RESULTS:\n{web_info}\n\nPlease integrate this information into your response appropriately."
            
            # Add system message for better AI behavior
            messages = [
                {
                    "role": "system",
                    "content": system_content
                }
            ]
            
            # Add chat history
            messages.extend(chat_history)
            
            # the newest OpenAI model is "gpt-4o" which was released May 13, 2024.
            # do not change this unless explicitly requested by the user
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                max_tokens=1200,  # 降低最大token數以提高回應速度
                temperature=0.5   # 降低溫度以提高回應一致性和速度
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logging.error(f"OpenAI API error: {str(e)}")
            raise Exception(f"Failed to get AI response: {str(e)}")