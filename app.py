import os
import logging
import base64
import requests
from io import BytesIO
from PIL import Image
from flask import Flask, render_template, request, jsonify, session, send_file
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix
from openai_client import OpenAIClient

# Configure logging
logging.basicConfig(level=logging.INFO)

# Disable HTTP and OpenAI debug logs
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("openai").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

class Base(DeclarativeBase):
    pass

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    'pool_pre_ping': True,
    "pool_recycle": 300,
}

# Initialize database
db = SQLAlchemy(app, model_class=Base)

# Initialize OpenAI client
openai_client = OpenAIClient()

# Create database tables
with app.app_context():
    import models
    models.init_db(db)
    db.create_all()

@app.route('/')
def index():
    """Render the enhanced main chat interface"""
    return render_template('enhanced_index.html')

@app.route('/simple')
def simple_index():
    """Render the simple chat interface"""
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat messages and return AI responses"""
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        # Get chat history from session
        if 'chat_history' not in session:
            session['chat_history'] = []
        
        # Add user message to history
        session['chat_history'].append({
            'role': 'user',
            'content': user_message
        })
        
        # Get AI response
        ai_response = openai_client.get_response(session['chat_history'])
        
        # Add AI response to history
        session['chat_history'].append({
            'role': 'assistant',
            'content': ai_response
        })
        
        # Save session
        session.modified = True
        
        return jsonify({
            'response': ai_response,
            'success': True
        })
        
    except Exception as e:
        logging.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            'error': f'AI service error: {str(e)}',
            'success': False
        }), 500

@app.route('/generate_image', methods=['POST'])
def generate_image():
    """Generate image using AI"""
    try:
        data = request.get_json()
        prompt = data.get('prompt', '').strip()
        
        if not prompt:
            return jsonify({'success': False, 'error': '請提供圖片描述'})
        
        if not openai_client.is_configured():
            return jsonify({'success': False, 'error': 'OpenAI API 未配置'})
        
        # 使用 OpenAI DALL-E 生成圖片
        response = openai_client.client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        
        image_url = response.data[0].url
        
        # 下載圖片並轉換為 base64
        img_response = requests.get(image_url)
        if img_response.status_code == 200:
            img = Image.open(BytesIO(img_response.content))
            
            # 轉換為 base64
            buffer = BytesIO()
            img.save(buffer, format='PNG')
            img_base64 = base64.b64encode(buffer.getvalue()).decode()
            
            return jsonify({
                'success': True,
                'image_url': f"data:image/png;base64,{img_base64}",
                'original_url': image_url,
                'prompt': prompt
            })
        else:
            return jsonify({'success': False, 'error': '無法下載生成的圖片'})
            
    except Exception as e:
        logging.error(f"圖片生成錯誤: {e}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/analyze_image', methods=['POST'])
def analyze_image():
    """Analyze uploaded image using AI"""
    try:
        data = request.get_json()
        image_base64 = data.get('image', '').strip()
        
        if not image_base64:
            return jsonify({'success': False, 'error': '請提供圖片'})
        
        if not openai_client.is_configured():
            return jsonify({'success': False, 'error': 'OpenAI API 未配置'})
        
        # 使用 OpenAI GPT-4o 分析圖片
        response = openai_client.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "請詳細分析這張圖片，描述其內容、風格、顏色、構圖等元素。"
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=500
        )
        
        analysis = response.choices[0].message.content
        
        return jsonify({
            'success': True,
            'analysis': analysis
        })
        
    except Exception as e:
        logging.error(f"圖片分析錯誤: {e}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/voice_to_text', methods=['POST'])
def voice_to_text():
    """Convert voice to text using AI"""
    try:
        if 'audio' not in request.files:
            return jsonify({'success': False, 'error': '請提供音頻檔案'})
        
        audio_file = request.files['audio']
        
        if not openai_client.is_configured():
            return jsonify({'success': False, 'error': 'OpenAI API 未配置'})
        
        # 使用 OpenAI Whisper 轉錄音頻
        transcript = openai_client.client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file
        )
        
        return jsonify({
            'success': True,
            'text': transcript.text
        })
        
    except Exception as e:
        logging.error(f"語音轉文字錯誤: {e}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/text_to_speech', methods=['POST'])
def text_to_speech():
    """Convert text to speech using AI"""
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        voice = data.get('voice', 'alloy')  # alloy, echo, fable, onyx, nova, shimmer
        
        if not text:
            return jsonify({'success': False, 'error': '請提供文字'})
        
        if not openai_client.is_configured():
            return jsonify({'success': False, 'error': 'OpenAI API 未配置'})
        
        # 使用 OpenAI TTS 生成語音
        response = openai_client.client.audio.speech.create(
            model="tts-1",
            voice=voice,
            input=text,
        )
        
        # 將音頻轉換為 base64
        audio_base64 = base64.b64encode(response.content).decode()
        
        return jsonify({
            'success': True,
            'audio_url': f"data:audio/mp3;base64,{audio_base64}"
        })
        
    except Exception as e:
        logging.error(f"文字轉語音錯誤: {e}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/clear_history', methods=['POST'])
def clear_history():
    """Clear chat history"""
    try:
        session.pop('chat_history', None)
        return jsonify({'success': True, 'message': 'Chat history cleared'})
    except Exception as e:
        logging.error(f"Error clearing history: {str(e)}")
        return jsonify({'error': 'Failed to clear history', 'success': False}), 500

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'openai_configured': openai_client.is_configured()})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
