import os
import logging
import base64
import requests
import tempfile
import json
import qrcode
import barcode
from barcode.writer import ImageWriter
from datetime import datetime
from io import BytesIO
from PIL import Image
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from flask import Flask, render_template, request, jsonify, session, send_file, make_response, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix
from openai_client import OpenAIClient

# 文件生成相關導入
import openpyxl
from openpyxl.styles import Font, Alignment, PatternFill
import xlsxwriter
from docx import Document
from docx.shared import Inches
import gspread
from google.auth.exceptions import GoogleAuthError

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
    return render_template('simple_enhanced.html')

@app.route('/simple')
def simple_index():
    """Render the simple chat interface"""
    return render_template('index.html')

@app.route('/test')
def test_page():
    """Test page to check if server is running"""
    return render_template('test.html')

@app.route('/simple-enhanced')
def simple_enhanced():
    """Simple enhanced version of the app"""
    return render_template('simple_enhanced.html')

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

@app.route('/save_game_score', methods=['POST'])
def save_game_score():
    """Save game score"""
    try:
        data = request.get_json()
        game_name = data.get('game_name')
        score = data.get('score')
        details = data.get('details', {})
        
        # 初始化遊戲分數記錄
        if 'game_scores' not in session:
            session['game_scores'] = {}
        
        if game_name not in session['game_scores']:
            session['game_scores'][game_name] = []
        
        # 記錄分數
        score_record = {
            'score': score,
            'details': details,
            'timestamp': datetime.now().isoformat(),
            'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        session['game_scores'][game_name].append(score_record)
        
        # 只保留最近10次記錄
        session['game_scores'][game_name] = session['game_scores'][game_name][-10:]
        
        return jsonify({
            'success': True,
            'message': '分數已記錄',
            'best_score': max([r['score'] for r in session['game_scores'][game_name]])
        })
        
    except Exception as e:
        logging.error(f"Error saving game score: {str(e)}")
        return jsonify({'error': 'Failed to save score', 'success': False}), 500

@app.route('/get_game_scores', methods=['GET'])
def get_game_scores():
    """Get game scores"""
    try:
        game_name = request.args.get('game_name')
        
        if 'game_scores' not in session:
            session['game_scores'] = {}
        
        if game_name:
            scores = session['game_scores'].get(game_name, [])
            best_score = max([r['score'] for r in scores]) if scores else 0
            return jsonify({
                'success': True,
                'scores': scores,
                'best_score': best_score,
                'total_games': len(scores)
            })
        else:
            # 返回所有遊戲統計
            all_stats = {}
            for game, scores in session['game_scores'].items():
                all_stats[game] = {
                    'best_score': max([r['score'] for r in scores]) if scores else 0,
                    'total_games': len(scores),
                    'latest_score': scores[-1]['score'] if scores else 0
                }
            
            return jsonify({
                'success': True,
                'game_stats': all_stats
            })
        
    except Exception as e:
        logging.error(f"Error getting game scores: {str(e)}")
        return jsonify({'error': 'Failed to get scores', 'success': False}), 500

@app.route('/generate_document', methods=['POST'])
def generate_document():
    """Generate documents (Excel, Google Sheets, Word)"""
    try:
        data = request.get_json()
        method = data.get('method', 'ai_generate')
        
        if method == 'ai_generate':
            return generate_ai_document(data)
        elif method == 'template':
            return generate_template_document(data)
        elif method == 'ppt':
            return generate_ppt_document(data)
        else:
            return jsonify({'success': False, 'error': '無效的生成方法'})
            
    except Exception as e:
        logging.error(f"文件生成錯誤: {e}")
        return jsonify({'success': False, 'error': str(e)})

def generate_ai_document(data):
    """使用 AI 生成文件"""
    description = data.get('description', '')
    doc_type = data.get('type', 'excel')
    language = data.get('language', 'zh-TW')
    
    if not openai_client.is_configured():
        return jsonify({'success': False, 'error': 'OpenAI API 未配置'})
    
    # 使用 AI 生成文件結構
    prompt = f"""
    請根據以下描述生成一個{doc_type}文件的結構：
    描述：{description}
    語言：{language}
    
    請返回JSON格式，包含以下內容：
    - title: 文件標題
    - description: 文件說明
    - structure: 文件結構（對於試算表是columns和rows，對於文件是sections）
    
    確保內容實用且符合需求。
    """
    
    try:
        response = openai_client.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "你是一個專業的文件生成助手，擅長創建各種商業和學術文件。"},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        ai_structure = json.loads(response.choices[0].message.content)
        
        # 根據類型生成對應文件
        if doc_type in ['excel', 'google_sheet']:
            return create_spreadsheet(ai_structure, doc_type, language)
        elif doc_type == 'word':
            return create_word_document(ai_structure, language)
            
    except Exception as e:
        logging.error(f"AI 生成錯誤: {e}")
        return jsonify({'success': False, 'error': f'AI 生成失敗: {str(e)}'})

def generate_template_document(data):
    """使用範本生成文件"""
    template_type = data.get('template_type')
    template_name = data.get('template_name')
    language = data.get('language', 'zh-TW')
    
    templates = get_document_templates(language)
    
    if template_type == 'spreadsheet':
        template_data = templates['spreadsheet'].get(template_name)
        if template_data:
            return create_spreadsheet(template_data, 'excel', language)
    elif template_type == 'document':
        template_data = templates['document'].get(template_name)
        if template_data:
            return create_word_document(template_data, language)
    
    return jsonify({'success': False, 'error': '找不到指定的範本'})

def create_spreadsheet(structure, file_type, language):
    """創建試算表"""
    try:
        # 創建臨時檔案
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx')
        
        # 使用 openpyxl 創建 Excel 檔案
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = structure.get('title', '工作表1')
        
        # 設置標題樣式
        title_font = Font(size=14, bold=True)
        header_font = Font(size=12, bold=True)
        header_fill = PatternFill(start_color="DDDDDD", end_color="DDDDDD", fill_type="solid")
        
        # 添加標題
        if 'title' in structure:
            ws['A1'] = structure['title']
            ws['A1'].font = title_font
            ws.merge_cells('A1:F1')
        
        # 添加標題行
        headers = structure.get('headers', structure.get('columns', []))
        if headers:
            start_row = 3 if 'title' in structure else 1
            for col, header in enumerate(headers, 1):
                cell = ws.cell(row=start_row, column=col, value=header)
                cell.font = header_font
                cell.fill = header_fill
                cell.alignment = Alignment(horizontal='center')
        
        # 添加數據行
        rows = structure.get('rows', structure.get('data', []))
        if rows:
            start_row = 4 if 'title' in structure else 2
            for row_idx, row in enumerate(rows, start_row):
                for col_idx, value in enumerate(row, 1):
                    ws.cell(row=row_idx, column=col_idx, value=value)
        
        # 自動調整列寬
        for column_cells in ws.columns:
            max_length = 0
            column_letter = None
            for cell in column_cells:
                try:
                    if hasattr(cell, 'column_letter'):
                        column_letter = cell.column_letter
                        if cell.value and len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                except:
                    pass
            if column_letter and max_length > 0:
                adjusted_width = min(max_length + 2, 50)
                ws.column_dimensions[column_letter].width = adjusted_width
        
        # 保存檔案
        wb.save(temp_file.name)
        temp_file.close()
        
        filename = f"{structure.get('title', 'document')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        
        # 如果是 Google Sheets，嘗試上傳
        if file_type == 'google_sheet':
            try:
                google_url = upload_to_google_sheets(temp_file.name, structure.get('title', 'Document'))
                return jsonify({
                    'success': True,
                    'google_sheet_url': google_url,
                    'title': structure.get('title', 'Document'),
                    'type': 'google_sheet',
                    'description': structure.get('description', '')
                })
            except Exception as e:
                logging.warning(f"Google Sheets 上傳失敗，改為下載檔案: {e}")
        
        # 將檔案保存到靜態目錄以便下載
        import uuid
        file_id = str(uuid.uuid4())
        static_path = f'static/downloads/{file_id}_{filename}'
        os.makedirs('static/downloads', exist_ok=True)
        
        import shutil
        shutil.copy2(temp_file.name, static_path)
        
        # 返回下載資訊
        return jsonify({
            'success': True,
            'download_url': f'/download/{file_id}_{filename}',
            'filename': filename,
            'title': structure.get('title', 'Document'),
            'type': file_type,
            'description': structure.get('description', '')
        })
        
    except Exception as e:
        logging.error(f"試算表創建錯誤: {e}")
        return jsonify({'success': False, 'error': f'試算表創建失敗: {str(e)}'})

def create_word_document(structure, language):
    """創建 Word 文件"""
    try:
        # 創建臨時檔案
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.docx')
        
        # 創建文件
        doc = Document()
        
        # 添加標題
        if 'title' in structure:
            title = doc.add_heading(structure['title'], 0)
            title.alignment = 1  # 置中
        
        # 添加描述
        if 'description' in structure:
            doc.add_paragraph(structure['description'])
            doc.add_paragraph()  # 空行
        
        # 添加內容
        content = structure.get('content', '')
        if content:
            # 處理內容格式
            paragraphs = content.split('\n\n')
            for para in paragraphs:
                if para.strip():
                    if para.startswith('#'):
                        # 標題
                        level = len(para) - len(para.lstrip('#'))
                        title_text = para.lstrip('# ').strip()
                        doc.add_heading(title_text, level)
                    elif para.startswith('|'):
                        # 表格
                        lines = para.strip().split('\n')
                        if len(lines) > 1:
                            headers = [cell.strip() for cell in lines[0].split('|')[1:-1]]
                            table = doc.add_table(rows=1, cols=len(headers))
                            table.style = 'Table Grid'
                            
                            # 添加標題行
                            hdr_cells = table.rows[0].cells
                            for i, header in enumerate(headers):
                                hdr_cells[i].text = header
                            
                            # 添加數據行
                            for line in lines[2:]:  # 跳過分隔行
                                if line.strip() and not line.strip().startswith('|---'):
                                    cells = [cell.strip() for cell in line.split('|')[1:-1]]
                                    row_cells = table.add_row().cells
                                    for i, cell_value in enumerate(cells):
                                        if i < len(row_cells):
                                            row_cells[i].text = cell_value
                    else:
                        # 普通段落
                        doc.add_paragraph(para)
        
        # 添加sections（如果有）
        sections = structure.get('sections', [])
        for section in sections:
            if isinstance(section, dict):
                if 'title' in section:
                    doc.add_heading(section['title'], 1)
                if 'content' in section:
                    doc.add_paragraph(section['content'])
            else:
                doc.add_paragraph(str(section))
        
        # 保存檔案
        doc.save(temp_file.name)
        temp_file.close()
        
        filename = f"{structure.get('title', 'document')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.docx"
        
        # 將檔案保存到靜態目錄以便下載
        import uuid
        file_id = str(uuid.uuid4())
        static_path = f'static/downloads/{file_id}_{filename}'
        os.makedirs('static/downloads', exist_ok=True)
        
        import shutil
        shutil.copy2(temp_file.name, static_path)
        
        # 返回下載資訊
        return jsonify({
            'success': True,
            'download_url': f'/download/{file_id}_{filename}',
            'filename': filename,
            'title': structure.get('title', 'Document'),
            'type': 'word',
            'description': structure.get('description', '')
        })
        
    except Exception as e:
        logging.error(f"Word 文件創建錯誤: {e}")
        return jsonify({'success': False, 'error': f'Word 文件創建失敗: {str(e)}'})

def generate_ppt_document(data):
    """生成PowerPoint文件"""
    try:
        description = data.get('description', '')
        language = data.get('language', 'zh-TW')
        
        if not openai_client.is_configured():
            return jsonify({'success': False, 'error': 'OpenAI API 未配置'})
        
        # 使用AI生成PPT結構
        prompt = f"""
        請根據以下描述生成一個PowerPoint簡報的結構：
        描述：{description}
        語言：{language}
        
        請返回JSON格式，包含以下內容：
        {{
            "title": "簡報標題",
            "slides": [
                {{
                    "title": "投影片標題",
                    "content": "投影片內容（支援換行符號\\n）",
                    "bullets": ["要點1", "要點2", "要點3"]
                }}
            ]
        }}
        請確保投影片數量不超過10張，每張投影片要點不超過5個。
        """
        
        response = openai_client.get_response([{'role': 'user', 'content': prompt}])
        structure = json.loads(response)
        
        # 創建PPT
        prs = Presentation()
        
        # 標題頁
        title_slide = prs.slides.add_slide(prs.slide_layouts[0])
        title = title_slide.shapes.title
        subtitle = title_slide.placeholders[1]
        
        title.text = structure.get('title', '未命名簡報')
        subtitle.text = f"Generated on {datetime.now().strftime('%Y-%m-%d')}"
        
        # 內容頁
        for slide_data in structure.get('slides', []):
            slide = prs.slides.add_slide(prs.slide_layouts[1])
            
            # 標題
            title_shape = slide.shapes.title
            title_shape.text = slide_data.get('title', '')
            
            # 內容
            content_placeholder = slide.placeholders[1]
            text_frame = content_placeholder.text_frame
            text_frame.clear()
            
            # 添加內容段落
            content = slide_data.get('content', '')
            if content:
                p = text_frame.paragraphs[0]
                p.text = content
                p.font.size = Pt(18)
            
            # 添加要點
            bullets = slide_data.get('bullets', [])
            for bullet in bullets:
                p = text_frame.add_paragraph()
                p.text = bullet
                p.level = 1
                p.font.size = Pt(16)
        
        # 保存文件
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pptx')
        prs.save(temp_file.name)
        temp_file.close()
        
        filename = f"{structure.get('title', 'presentation')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pptx"
        
        # 將檔案保存到靜態目錄以便下載
        import uuid
        file_id = str(uuid.uuid4())
        static_path = f'static/downloads/{file_id}_{filename}'
        os.makedirs('static/downloads', exist_ok=True)
        
        import shutil
        shutil.copy2(temp_file.name, static_path)
        
        # 返回下載資訊
        return jsonify({
            'success': True,
            'download_url': f'/download/{file_id}_{filename}',
            'filename': filename,
            'title': structure.get('title', 'Presentation'),
            'type': 'ppt',
            'description': description,
            'slide_count': len(structure.get('slides', [])) + 1
        })
        
    except Exception as e:
        logging.error(f"PPT生成錯誤: {e}")
        return jsonify({'success': False, 'error': f'PPT生成失敗: {str(e)}'})

def upload_to_google_sheets(file_path, title):
    """上傳到 Google Sheets"""
    # 注意：這需要 Google API 憑證
    # 目前返回模擬連結，實際使用時需要配置 Google API
    logging.info("Google Sheets 功能需要配置 API 憑證")
    raise Exception("Google Sheets 功能需要配置 Google API 憑證")

def get_document_templates(language='zh-TW'):
    """獲取文件範本"""
    if language == 'zh-TW':
        return {
            'spreadsheet': {
                'financial': {
                    'title': '財務報表',
                    'description': '公司財務收支統計表',
                    'headers': ['項目', '預算', '實際', '差異', '百分比', '備註'],
                    'rows': [
                        ['收入', '', '', '', '', ''],
                        ['銷售收入', '100000', '', '', '', ''],
                        ['其他收入', '10000', '', '', '', ''],
                        ['支出', '', '', '', '', ''],
                        ['人事費用', '50000', '', '', '', ''],
                        ['營運費用', '30000', '', '', '', ''],
                        ['行銷費用', '15000', '', '', '', ''],
                        ['淨利潤', '', '', '', '', '']
                    ]
                },
                'project': {
                    'title': '專案計劃',
                    'description': '專案任務規劃與追蹤表',
                    'headers': ['任務', '負責人', '開始日期', '結束日期', '狀態', '進度', '備註'],
                    'rows': [
                        ['需求分析', '', '', '', '未開始', '0%', ''],
                        ['系統設計', '', '', '', '未開始', '0%', ''],
                        ['程式開發', '', '', '', '未開始', '0%', ''],
                        ['測試階段', '', '', '', '未開始', '0%', ''],
                        ['部署上線', '', '', '', '未開始', '0%', '']
                    ]
                },
                'employee': {
                    'title': '員工清單',
                    'description': '公司員工基本資料表',
                    'headers': ['員工編號', '姓名', '部門', '職位', '入職日期', '聯絡電話', '電子郵件'],
                    'rows': [
                        ['', '', '', '', '', '', ''],
                        ['', '', '', '', '', '', ''],
                        ['', '', '', '', '', '', '']
                    ]
                },
                'sales': {
                    'title': '銷售統計',
                    'description': '月度銷售業績統計表',
                    'headers': ['日期', '產品', '數量', '單價', '總額', '業務員', '備註'],
                    'rows': [
                        ['', '', '', '', '', '', ''],
                        ['', '', '', '', '', '', ''],
                        ['', '', '', '', '', '', '']
                    ]
                }
            },
            'document': {
                'meeting': {
                    'title': '會議紀錄',
                    'description': '標準會議紀錄範本',
                    'content': '''會議紀錄

會議主題：
日期時間：
地點：
主持人：
出席人員：

## 議程
1. 
2. 
3. 

## 討論內容


## 決議事項
1. 
2. 
3. 

## 待辦事項
| 項目 | 負責人 | 期限 |
|------|--------|------|
|      |        |      |

## 下次會議
日期：
地點：'''
                },
                'proposal': {
                    'title': '項目提案',
                    'description': '標準項目提案書範本',
                    'content': '''項目提案書

提案標題：
提案人：
提案日期：

## 一、背景與目標
### 1.1 專案背景

### 1.2 專案目標

## 二、解決方案
### 2.1 方案概述

### 2.2 實施計劃

## 三、資源需求
### 3.1 人力資源

### 3.2 預算需求

## 四、效益評估
### 4.1 預期效益

### 4.2 風險評估

## 五、時程規劃
| 階段 | 時間 | 里程碑 |
|------|------|--------|
|      |      |        |

## 六、結論'''
                }
            }
        }
    
    # 英文版本
    return {
        'spreadsheet': {
            'financial': {
                'title': 'Financial Report',
                'description': 'Company financial income and expense statement',
                'headers': ['Item', 'Budget', 'Actual', 'Variance', 'Percentage', 'Notes'],
                'rows': [
                    ['Income', '', '', '', '', ''],
                    ['Sales Revenue', '100000', '', '', '', ''],
                    ['Other Income', '10000', '', '', '', ''],
                    ['Expenses', '', '', '', '', ''],
                    ['Personnel Costs', '50000', '', '', '', ''],
                    ['Operating Expenses', '30000', '', '', '', ''],
                    ['Marketing Costs', '15000', '', '', '', ''],
                    ['Net Profit', '', '', '', '', '']
                ]
            }
        },
        'document': {
            'meeting': {
                'title': 'Meeting Minutes',
                'description': 'Standard meeting minutes template',
                'content': '''Meeting Minutes

Meeting Topic:
Date & Time:
Location:
Chairperson:
Attendees:

## Agenda
1. 
2. 
3. 

## Discussion


## Decisions
1. 
2. 
3. 

## Action Items
| Item | Responsible | Deadline |
|------|-------------|----------|
|      |             |          |

## Next Meeting
Date:
Location:'''
            }
        }
    }

@app.route('/clear_history', methods=['POST'])
def clear_history():
    """Clear chat history"""
    try:
        session.pop('chat_history', None)
        return jsonify({'success': True, 'message': 'Chat history cleared'})
    except Exception as e:
        logging.error(f"Error clearing history: {str(e)}")
        return jsonify({'error': 'Failed to clear history', 'success': False}), 500

@app.route('/generate_qr', methods=['POST'])
def generate_qr():
    """Generate QR code"""
    try:
        data = request.json
        text = data.get('text', '')
        size = data.get('size', 10)
        border = data.get('border', 4)
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # 創建QR碼
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=size,
            border=border,
        )
        qr.add_data(text)
        qr.make(fit=True)
        
        # 生成圖片
        img = qr.make_image(fill_color="black", back_color="white")
        
        # 轉換為base64
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        img_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        return jsonify({
            'success': True,
            'image': f'data:image/png;base64,{img_base64}',
            'download_data': img_base64
        })
        
    except Exception as e:
        logging.error(f"Error generating QR code: {str(e)}")
        return jsonify({'error': 'Failed to generate QR code'}), 500

@app.route('/generate_barcode', methods=['POST'])
def generate_barcode():
    """Generate barcode"""
    try:
        data = request.json
        text = data.get('text', '')
        barcode_type = data.get('type', 'code128')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # 支援的條碼類型
        from barcode import get_barcode_class
        try:
            barcode_types = {
                'code128': get_barcode_class('code128'),
                'code39': get_barcode_class('code39'),
                'ean13': get_barcode_class('ean13'),
                'ean8': get_barcode_class('ean8'),
                'upc': get_barcode_class('upca'),
                'isbn13': get_barcode_class('isbn13'),
                'isbn10': get_barcode_class('isbn10'),
                'issn': get_barcode_class('issn')
            }
        except Exception as e:
            logging.error(f"Barcode class loading error: {str(e)}")
            return jsonify({'error': 'Barcode generation not available'}), 500
        
        if barcode_type not in barcode_types:
            return jsonify({'error': 'Invalid barcode type'}), 400
        
        # 生成條碼
        barcode_class = barcode_types[barcode_type]
        code = barcode_class(text, writer=ImageWriter())
        
        buffer = BytesIO()
        code.write(buffer)
        buffer.seek(0)
        
        img_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        return jsonify({
            'success': True,
            'image': f'data:image/png;base64,{img_base64}',
            'download_data': img_base64,
            'type': barcode_type
        })
        
    except Exception as e:
        logging.error(f"Error generating barcode: {str(e)}")
        return jsonify({'error': f'Failed to generate barcode: {str(e)}'}), 500

@app.route('/generate_design', methods=['POST'])
def generate_design():
    """Canva式設計圖片生成"""
    try:
        data = request.json
        design_type = data.get('design_type', 'poster')
        content = data.get('content', '')
        style = data.get('style', 'modern')
        color_scheme = data.get('color_scheme', 'blue')
        
        if not content:
            return jsonify({'error': 'Content is required'}), 400
        
        if not openai_client.is_configured():
            return jsonify({'error': 'OpenAI API not configured'}), 500
        
        # 設計類型對應的尺寸
        dimensions = {
            'poster': '1080x1350',
            'banner': '1920x1080', 
            'card': '1080x1080',
            'flyer': '816x1056',
            'cover': '1640x924'
        }
        
        # 生成詳細的設計提示
        design_prompt = f"""
        Create a professional {design_type} design with the following specifications:
        
        Content: {content}
        Style: {style}
        Color scheme: {color_scheme}
        Dimensions: {dimensions.get(design_type, '1080x1080')}
        
        Design requirements:
        - Clean, modern layout
        - Professional typography
        - Appropriate use of white space
        - {color_scheme} color palette
        - {style} aesthetic
        - High-quality, print-ready design
        - Include the content text prominently
        - Add relevant visual elements or icons
        - Ensure good contrast and readability
        """
        
        # 使用DALL-E生成圖片
        try:
            response = openai_client.client.images.generate(
                model="dall-e-3",
                prompt=design_prompt,
                size="1024x1024",
                quality="standard",
                n=1
            )
            
            image_url = response.data[0].url
            
            # 下載圖片並轉換為base64
            img_response = requests.get(image_url)
            img_base64 = base64.b64encode(img_response.content).decode()
            
            return jsonify({
                'success': True,
                'image': f'data:image/png;base64,{img_base64}',
                'download_data': img_base64,
                'design_type': design_type,
                'style': style,
                'color_scheme': color_scheme
            })
            
        except Exception as e:
            logging.error(f"DALL-E generation error: {str(e)}")
            return jsonify({'error': f'Failed to generate design: {str(e)}'}), 500
            
    except Exception as e:
        logging.error(f"Design generation error: {str(e)}")
        return jsonify({'error': f'Failed to generate design: {str(e)}'}), 500

@app.route('/modify_design', methods=['POST'])
def modify_design():
    """修改現有設計"""
    try:
        data = request.json
        original_image = data.get('original_image', '')
        modifications = data.get('modifications', '')
        
        if not modifications:
            return jsonify({'error': '請描述需要修改的內容'}), 400
        
        if not openai_client.is_configured():
            return jsonify({'error': 'OpenAI API not configured'}), 500
        
        # 生成修改提示
        modify_prompt = f"""
        Based on the existing design, make the following modifications:
        {modifications}
        
        Maintain the overall design quality and professional appearance while implementing the requested changes.
        Keep the same dimensions and ensure the design remains cohesive and visually appealing.
        """
        
        try:
            response = openai_client.client.images.generate(
                model="dall-e-3",
                prompt=modify_prompt,
                size="1024x1024",
                quality="standard",
                n=1
            )
            
            image_url = response.data[0].url
            
            # 下載並轉換圖片
            img_response = requests.get(image_url)
            img_base64 = base64.b64encode(img_response.content).decode()
            
            return jsonify({
                'success': True,
                'image': f'data:image/png;base64,{img_base64}',
                'download_data': img_base64,
                'modifications': modifications
            })
            
        except Exception as e:
            logging.error(f"Design modification error: {str(e)}")
            return jsonify({'error': f'修改設計失敗: {str(e)}'}), 500
            
    except Exception as e:
        logging.error(f"Modify design error: {str(e)}")
        return jsonify({'error': f'修改設計失敗: {str(e)}'}), 500

@app.route('/download/<filename>')
def download_file(filename):
    """通用文件下載端點"""
    try:
        file_path = f'static/downloads/{filename}'
        if os.path.exists(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        logging.error(f"Download error: {str(e)}")
        return jsonify({'error': 'Download failed'}), 500

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'openai_configured': openai_client.is_configured()})



if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
