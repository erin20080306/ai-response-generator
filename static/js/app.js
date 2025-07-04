// AI Assistant JavaScript Application
class AIAssistant {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
        
        this.init();
    }

    init() {
        // Event listeners
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        
        // Enter key handling
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 150) + 'px';
        });

        // Focus on input
        this.messageInput.focus();
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Disable input
        this.setInputState(false);
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        
        // Show loading
        this.showLoading();
        
        try {
            // Send message to server
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Add AI response with typewriter effect
                this.addMessage(data.response, 'ai', true);
            } else {
                this.addMessage(`錯誤: ${data.error}`, 'error');
            }
            
        } catch (error) {
            console.error('Error:', error);
            this.addMessage('連線錯誤，請稍後再試。', 'error');
        } finally {
            this.hideLoading();
            this.setInputState(true);
            this.messageInput.focus();
        }
    }

    addMessage(content, type, useTypewriter = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-item ${type}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Add icon based on message type
        let icon = '';
        switch(type) {
            case 'user':
                icon = '<i class="fas fa-user me-2"></i>';
                break;
            case 'ai':
                icon = '<i class="fas fa-robot me-2"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-triangle me-2"></i>';
                messageDiv.className = 'message-item system-message';
                break;
        }
        
        if (useTypewriter && type === 'ai') {
            contentDiv.innerHTML = icon;
            messageDiv.appendChild(contentDiv);
            this.chatMessages.appendChild(messageDiv);
            this.scrollToBottom();
            
            // Apply typewriter effect
            this.typewriterEffect(contentDiv, content, icon);
        } else {
            contentDiv.innerHTML = icon + this.formatMessage(content);
            messageDiv.appendChild(contentDiv);
            this.chatMessages.appendChild(messageDiv);
            this.scrollToBottom();
        }
    }

    typewriterEffect(element, text, icon) {
        // Disable typewriter effect temporarily - show message directly
        element.innerHTML = icon + this.formatMessage(text);
        this.highlightCode(element);
        this.scrollToBottom();
    }

    simpleTypewriter(element, text, icon) {
        // This function is currently disabled to prevent text duplication
        // We'll show the message directly instead
        element.innerHTML = icon + this.formatMessage(text);
        this.highlightCode(element);
        this.scrollToBottom();
    }

    typewriterWithCodeBlocks(element, text, icon) {
        // Disable typewriter effect temporarily - show message directly
        element.innerHTML = icon + this.formatMessage(text);
        this.highlightCode(element);
        this.scrollToBottom();
    }

    formatMessage(text) {
        // Convert markdown-style code blocks to HTML
        text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
            const lang = language || 'plaintext';
            return `<pre><code class="language-${lang}">${this.escapeHtml(code.trim())}</code></pre>`;
        });
        
        // Convert inline code
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Convert line breaks to HTML
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    highlightCode(element) {
        // Apply syntax highlighting to code blocks
        const codeBlocks = element.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            if (typeof Prism !== 'undefined') {
                Prism.highlightElement(block);
            }
        });
    }

    async clearHistory() {
        if (!confirm('確定要清除所有對話記錄嗎？')) {
            return;
        }
        
        try {
            const response = await fetch('/clear_history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Clear chat messages
                this.chatMessages.innerHTML = `
                    <div class="message-item system-message">
                        <div class="message-content">
                            <i class="fas fa-info-circle me-2"></i>
                            對話記錄已清除。歡迎開始新的對話！
                        </div>
                    </div>
                `;
            } else {
                this.addMessage(`清除失敗: ${data.error}`, 'error');
            }
            
        } catch (error) {
            console.error('Error clearing history:', error);
            this.addMessage('清除對話記錄時發生錯誤。', 'error');
        }
    }

    setInputState(enabled) {
        this.messageInput.disabled = !enabled;
        this.sendBtn.disabled = !enabled;
        
        if (enabled) {
            this.sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        } else {
            this.sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }
    }

    showLoading() {
        this.loadingModal.show();
    }

    hideLoading() {
        this.loadingModal.hide();
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIAssistant();
});
