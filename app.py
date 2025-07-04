import os
import logging
from flask import Flask, render_template, request, jsonify, session
from openai_client import OpenAIClient

# Configure logging
logging.basicConfig(level=logging.INFO)

# Disable HTTP and OpenAI debug logs
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("openai").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

# Initialize OpenAI client
openai_client = OpenAIClient()

@app.route('/')
def index():
    """Render the main chat interface"""
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
