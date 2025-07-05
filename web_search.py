import requests
from bs4 import BeautifulSoup
import urllib.parse
import re
import logging
import os

class WebSearcher:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.weather_api_key = os.environ.get('WEATHER_API_KEY')
        
    def search_web(self, query, max_results=3):
        """
        使用Google搜尋引擎搜尋網路資訊
        """
        try:
            # 使用DuckDuckGo作為搜尋引擎（較寬鬆的使用條件）
            search_url = f"https://html.duckduckgo.com/html/"
            params = {
                'q': query,
                'b': '',
                'kl': 'tw-tzh'  # 台灣中文
            }
            
            response = requests.get(search_url, params=params, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            results = []
            
            # 解析搜尋結果
            for result in soup.find_all('div', class_='result__body')[:max_results]:
                title_elem = result.find('a', class_='result__a')
                snippet_elem = result.find('a', class_='result__snippet')
                
                if title_elem and snippet_elem:
                    title = title_elem.get_text(strip=True)
                    url = title_elem.get('href', '')
                    snippet = snippet_elem.get_text(strip=True)
                    
                    results.append({
                        'title': title,
                        'url': url,
                        'snippet': snippet
                    })
            
            return results
            
        except Exception as e:
            logging.error(f"網路搜尋錯誤: {e}")
            return []
    
    def get_weather_info(self, location="台北"):
        """
        獲取天氣資訊 - 使用真實天氣API
        """
        try:
            if not self.weather_api_key:
                # 如果沒有API金鑰，使用搜尋引擎備案
                return self._get_weather_from_search(location)
            
            # 使用OpenWeatherMap API（假設用戶提供的是OpenWeatherMap API金鑰）
            # 如果是其他服務的API，可以根據需要調整
            base_url = "http://api.openweathermap.org/data/2.5/weather"
            params = {
                'q': location,
                'appid': self.weather_api_key,
                'units': 'metric',  # 攝氏溫度
                'lang': 'zh_tw'     # 繁體中文
            }
            
            response = requests.get(base_url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # 解析天氣資料
            weather_info = {
                'location': data.get('name', location),
                'status': 'success',
                'temperature': round(data['main']['temp']),
                'description': data['weather'][0]['description'],
                'humidity': data['main']['humidity'],
                'wind_speed': data['wind']['speed'],
                'pressure': data['main']['pressure'],
                'feels_like': round(data['main']['feels_like']),
                'summary': f"{data.get('name', location)} 目前氣溫 {round(data['main']['temp'])}°C，{data['weather'][0]['description']}，體感溫度 {round(data['main']['feels_like'])}°C，濕度 {data['main']['humidity']}%，風速 {data['wind']['speed']} m/s"
            }
            
            return weather_info
            
        except requests.exceptions.RequestException as e:
            logging.error(f"天氣API請求錯誤: {e}")
            # API失敗時使用搜尋引擎備案
            return self._get_weather_from_search(location)
        except Exception as e:
            logging.error(f"天氣查詢錯誤: {e}")
            return {
                'location': location,
                'status': 'error',
                'message': f"天氣查詢失敗: {str(e)}"
            }
    
    def _get_weather_from_search(self, location):
        """
        使用搜尋引擎獲取天氣資訊（備案方法）
        """
        try:
            query = f"{location} 天氣 今天"
            results = self.search_web(query, max_results=2)
            
            weather_info = {
                'location': location,
                'status': 'success',
                'data': results,
                'summary': ''
            }
            
            if results:
                # 從搜尋結果提取天氣資訊
                weather_text = ' '.join([r['snippet'] for r in results[:2]])
                weather_info['summary'] = weather_text[:200] + "..." if len(weather_text) > 200 else weather_text
            
            return weather_info
            
        except Exception as e:
            logging.error(f"天氣搜尋錯誤: {e}")
            return {
                'location': location,
                'status': 'error',
                'message': f"天氣查詢失敗: {str(e)}"
            }
    
    def search_legal_info(self, legal_query):
        """
        搜尋法律相關資訊
        """
        try:
            query = f"{legal_query} 法律 條文"
            results = self.search_web(query, max_results=3)
            
            legal_info = {
                'query': legal_query,
                'status': 'success',
                'results': results,
                'disclaimer': '此資訊僅供參考，具體法律問題請諮詢專業律師或查閱官方法規。'
            }
            
            return legal_info
            
        except Exception as e:
            logging.error(f"法律查詢錯誤: {e}")
            return {
                'query': legal_query,
                'status': 'error',
                'message': f"法律查詢失敗: {str(e)}"
            }
    
    def search_news(self, topic, max_results=3):
        """
        搜尋新聞資訊
        """
        try:
            query = f"{topic} 新聞 最新"
            results = self.search_web(query, max_results=max_results)
            
            news_info = {
                'topic': topic,
                'status': 'success',
                'news': results,
                'timestamp': 'real-time search'
            }
            
            return news_info
            
        except Exception as e:
            logging.error(f"新聞查詢錯誤: {e}")
            return {
                'topic': topic,
                'status': 'error',
                'message': f"新聞查詢失敗: {str(e)}"
            }
    
    def general_search(self, query):
        """
        一般網路搜尋
        """
        try:
            results = self.search_web(query, max_results=5)
            
            search_info = {
                'query': query,
                'status': 'success',
                'results': results,
                'count': len(results)
            }
            
            return search_info
            
        except Exception as e:
            logging.error(f"一般搜尋錯誤: {e}")
            return {
                'query': query,
                'status': 'error',
                'message': f"搜尋失敗: {str(e)}"
            }