/**
 * Enhanced AI Assistant - Main Application JavaScript
 * 支援所有新功能的增強版 AI 助手
 */

// 統一的模態框管理工具
class ModalManager {
    static showModal(modalElement, modalInstance = null) {
        if (modalInstance && typeof modalInstance.show === 'function') {
            modalInstance.show();
        } else if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            try {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
            } catch (error) {
                console.warn('Bootstrap modal failed, using fallback:', error);
                ModalManager.showModalFallback(modalElement);
            }
        } else {
            ModalManager.showModalFallback(modalElement);
        }
    }
    
    static showModalFallback(modalElement) {
        if (modalElement) {
            modalElement.style.display = 'block';
            modalElement.classList.add('show');
            modalElement.setAttribute('aria-hidden', 'false');
            
            // 添加背景遮罩
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            backdrop.id = 'modal-backdrop-' + modalElement.id;
            document.body.appendChild(backdrop);
            
            // 關閉按鈕事件
            const closeButtons = modalElement.querySelectorAll('[data-bs-dismiss="modal"]');
            closeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    ModalManager.hideModal(modalElement);
                });
            });
            
            // 點擊背景關閉
            backdrop.addEventListener('click', () => {
                ModalManager.hideModal(modalElement);
            });
        }
    }
    
    static hideModal(modalElement) {
        if (modalElement) {
            modalElement.style.display = 'none';
            modalElement.classList.remove('show');
            modalElement.setAttribute('aria-hidden', 'true');
            
            // 移除背景遮罩
            const backdrop = document.getElementById('modal-backdrop-' + modalElement.id);
            if (backdrop) {
                backdrop.remove();
            }
        }
    }
}

class EnhancedAIAssistant {
    constructor() {
        this.settings = {
            theme: 'dark',
            fontSize: 'medium',
            aiTone: 'friendly',
            typingSpeed: 50,
            typewriterEffect: true,
            voiceInput: false,
            voiceOutput: false,
            voiceLanguage: 'zh-TW',
            voiceSpeed: 1.0
        };
        
        this.currentConversationId = null;
        this.chatHistory = [];
        this.fileHandler = null;
        this.voiceHandler = null;
        this.collaboration = null;
        this.socket = null;
        this.currentUser = null;
        this.quickReplies = [];
        
        this.init();
    }

    async init() {
        console.log('初始化增強版 AI 助手...');
        
        try {
            // 載入設定
            await this.loadSettings();
            
            // 初始化事件監聽器
            this.setupEventListeners();
            
            // 初始化子模組
            this.initializeModules();
            
            // 載入對話歷史
            await this.loadChatHistory();
            
            // 載入快速回覆
            await this.loadQuickReplies();
            
            // 應用設定
            this.applySettings();
            
            // 設定定時器
            this.setupTimers();
            
            console.log('AI 助手初始化完成');
            
        } catch (error) {
            console.error('初始化失敗:', error);
            this.showNotification('初始化失敗，請重新整理頁面', 'error');
        }
    }

    setupEventListeners() {
        // 聊天相關事件
        this.setupChatEvents();
        
        // 檔案相關事件
        this.setupFileEvents();
        
        // 設定相關事件
        this.setupSettingsEvents();
        
        // 協作相關事件
        this.setupCollaborationEvents();
        
        // 工具相關事件
        this.setupToolEvents();
        
        // 鍵盤快捷鍵
        this.setupKeyboardShortcuts();
        
        // 響應式設計事件
        this.setupResponsiveEvents();
    }

    setupChatEvents() {
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        const newChatBtn = document.getElementById('newChatBtn');
        const voiceToggleBtn = document.getElementById('voiceToggleBtn');
        const bookmarkBtn = document.getElementById('bookmarkBtn');
        const shareBtn = document.getElementById('shareBtn');
        const exportBtn = document.getElementById('exportBtn');

        // 發送訊息
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        // 輸入框事件
        if (messageInput) {
            messageInput.addEventListener('input', () => this.handleInputChange());
            messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
            messageInput.addEventListener('paste', (e) => this.handlePaste(e));
        }

        // 清除歷史
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        }

        // 新對話
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => this.newChat());
        }

        // 語音切換
        if (voiceToggleBtn) {
            voiceToggleBtn.addEventListener('click', () => this.toggleVoice());
        }

        // 書籤
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', () => this.bookmarkConversation());
        }

        // 分享
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareConversation());
        }

        // 匯出
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportConversation());
        }
    }

    setupFileEvents() {
        const fileUploadBtn = document.getElementById('fileUploadBtn');
        const fileInput = document.getElementById('fileInput');
        const selectFilesBtn = document.getElementById('selectFilesBtn');
        const uploadArea = document.getElementById('uploadArea');

        // 檔案上傳按鈕
        if (fileUploadBtn && fileInput) {
            fileUploadBtn.addEventListener('click', () => fileInput.click());
        }

        if (selectFilesBtn && fileInput) {
            selectFilesBtn.addEventListener('click', () => fileInput.click());
        }

        // 檔案選擇
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        // 拖拽上傳
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            uploadArea.addEventListener('drop', (e) => this.handleFileDrop(e));
        }
    }

    setupSettingsEvents() {
        const themeSelect = document.getElementById('themeSelect');
        const fontSizeSelect = document.getElementById('fontSizeSelect');
        const aiToneSelect = document.getElementById('aiToneSelect');
        const typingSpeedRange = document.getElementById('typingSpeedRange');
        const typewriterEffect = document.getElementById('typewriterEffect');
        const voiceInput = document.getElementById('voiceInput');
        const voiceOutput = document.getElementById('voiceOutput');
        const voiceLanguage = document.getElementById('voiceLanguage');
        const voiceSpeed = document.getElementById('voiceSpeed');

        // 主題設定
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => this.changeTheme(e.target.value));
        }

        // 字體大小
        if (fontSizeSelect) {
            fontSizeSelect.addEventListener('change', (e) => this.changeFontSize(e.target.value));
        }

        // AI 語氣
        if (aiToneSelect) {
            aiToneSelect.addEventListener('change', (e) => this.changeAiTone(e.target.value));
        }

        // 打字速度
        if (typingSpeedRange) {
            typingSpeedRange.addEventListener('input', (e) => this.changeTypingSpeed(e.target.value));
        }

        // 打字機效果
        if (typewriterEffect) {
            typewriterEffect.addEventListener('change', (e) => this.toggleTypewriterEffect(e.target.checked));
        }

        // 語音設定
        if (voiceInput) {
            voiceInput.addEventListener('change', (e) => this.toggleVoiceInput(e.target.checked));
        }

        if (voiceOutput) {
            voiceOutput.addEventListener('change', (e) => this.toggleVoiceOutput(e.target.checked));
        }

        if (voiceLanguage) {
            voiceLanguage.addEventListener('change', (e) => this.changeVoiceLanguage(e.target.value));
        }

        if (voiceSpeed) {
            voiceSpeed.addEventListener('input', (e) => this.changeVoiceSpeed(e.target.value));
        }

        // 快速動作
        const exportSettingsBtn = document.getElementById('exportSettingsBtn');
        const importSettingsBtn = document.getElementById('importSettingsBtn');
        const resetSettingsBtn = document.getElementById('resetSettingsBtn');
        const clearStorageBtn = document.getElementById('clearStorageBtn');

        if (exportSettingsBtn) {
            exportSettingsBtn.addEventListener('click', () => this.exportSettings());
        }

        if (importSettingsBtn) {
            importSettingsBtn.addEventListener('click', () => this.importSettings());
        }

        if (resetSettingsBtn) {
            resetSettingsBtn.addEventListener('click', () => this.resetSettings());
        }

        if (clearStorageBtn) {
            clearStorageBtn.addEventListener('click', () => this.clearStorage());
        }
    }

    setupCollaborationEvents() {
        const createRoomBtn = document.getElementById('createRoomBtn');
        const joinRoomBtn = document.getElementById('joinRoomBtn');
        const roomNameInput = document.getElementById('roomName');
        const roomCodeInput = document.getElementById('roomCode');
        const maxParticipantsSelect = document.getElementById('maxParticipants');

        if (createRoomBtn) {
            createRoomBtn.addEventListener('click', () => this.createRoom());
        }

        if (joinRoomBtn) {
            joinRoomBtn.addEventListener('click', () => this.joinRoom());
        }
    }

    setupToolEvents() {
        // 計算機
        const calculatorBtn = document.getElementById('calculatorBtn');
        if (calculatorBtn) {
            calculatorBtn.addEventListener('click', () => this.openCalculator());
        }

        // QR碼生成器
        const qrCodeBtn = document.getElementById('qrCodeBtn');
        if (qrCodeBtn) {
            qrCodeBtn.addEventListener('click', () => this.openQRCodeGenerator());
        }
        
        // 條碼生成器
        const barcodeBtn = document.getElementById('barcodeBtn');
        if (barcodeBtn) {
            barcodeBtn.addEventListener('click', () => this.openBarcodeGenerator());
        }

        // Canva式設計生成器
        const designBtn = document.getElementById('designBtn');
        if (designBtn) {
            designBtn.addEventListener('click', () => this.openDesignGenerator());
        }

        // 密碼生成器
        const passwordGenBtn = document.getElementById('passwordGenBtn');
        if (passwordGenBtn) {
            passwordGenBtn.addEventListener('click', () => this.openPasswordGenerator());
        }

        // 網址縮短
        const urlShortenerBtn = document.getElementById('urlShortenerBtn');
        if (urlShortenerBtn) {
            urlShortenerBtn.addEventListener('click', () => this.openURLShortener());
        }

        // 時間轉換
        const dateTimeBtn = document.getElementById('dateTimeBtn');
        if (dateTimeBtn) {
            dateTimeBtn.addEventListener('click', () => this.openDateTimeConverter());
        }

        // 顏色選擇器
        const colorPickerBtn = document.getElementById('colorPickerBtn');
        if (colorPickerBtn) {
            colorPickerBtn.addEventListener('click', () => this.openColorPicker());
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter: 發送訊息
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.sendMessage();
            }

            // Ctrl/Cmd + K: 清除對話
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.clearHistory();
            }

            // Ctrl/Cmd + N: 新對話
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.newChat();
            }

            // Ctrl/Cmd + S: 儲存對話
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveConversation();
            }

            // Ctrl/Cmd + /: 顯示快捷鍵說明
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.showShortcutHelp();
            }

            // ESC: 關閉模態框或取消語音
            if (e.key === 'Escape') {
                this.handleEscape();
            }
        });
    }

    setupResponsiveEvents() {
        // 側邊欄切換
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // 視窗大小變化
        window.addEventListener('resize', () => this.handleResize());

        // 方向變化 (移動設備)
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 100);
        });
    }

    initializeModules() {
        // 初始化檔案處理器
        if (typeof FileHandler !== 'undefined') {
            this.fileHandler = new FileHandler(this);
        }

        // 初始化語音處理器
        if (typeof VoiceHandler !== 'undefined') {
            this.voiceHandler = new VoiceHandler(this);
        }

        // 初始化協作功能
        if (typeof Collaboration !== 'undefined') {
            this.collaboration = new Collaboration(this);
        }

        // 初始化遊戲中心
        if (typeof GameCenter !== 'undefined') {
            this.gameCenter = new GameCenter(this);
            this.gameCenter.init();
        }

        // 初始化文件生成器
        if (typeof DocumentGenerator !== 'undefined') {
            this.documentGenerator = new DocumentGenerator(this);
        }

        // 初始化 Socket.IO
        this.initializeSocket();
    }

    initializeSocket() {
        try {
            this.socket = io();
            
            this.socket.on('connect', () => {
                console.log('Socket.IO 連線成功');
                this.updateConnectionStatus(true);
            });

            this.socket.on('disconnect', () => {
                console.log('Socket.IO 連線中斷');
                this.updateConnectionStatus(false);
            });

            this.socket.on('message', (data) => {
                this.handleSocketMessage(data);
            });

            this.socket.on('user_joined', (data) => {
                this.handleUserJoined(data);
            });

            this.socket.on('user_left', (data) => {
                this.handleUserLeft(data);
            });

            this.socket.on('room_update', (data) => {
                this.handleRoomUpdate(data);
            });

        } catch (error) {
            console.warn('Socket.IO 初始化失敗:', error);
        }
    }

    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();

        if (!message) return;

        try {
            // 顯示用戶訊息
            this.addMessage(message, 'user');
            
            // 清空輸入框
            messageInput.value = '';
            this.updateInputHeight();

            // 檢查是否為圖片生成指令
            if (this.isImageGenerationRequest(message)) {
                await this.handleImageGeneration(message);
                return;
            }

            // 顯示載入狀態
            this.showLoading();

            // 發送到後端
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversation_id: this.currentConversationId,
                    tone: this.settings.aiTone,
                    context: this.getContextData()
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // 顯示 AI 回應
                const useTypewriter = this.settings.typewriterEffect;
                this.addMessage(data.response, 'ai', useTypewriter);
                
                // 更新對話 ID
                if (data.conversation_id) {
                    this.currentConversationId = data.conversation_id;
                }

                // 語音輸出
                if (this.settings.voiceOutput && this.voiceHandler) {
                    this.voiceHandler.speak(data.response);
                }

                // 自動儲存對話
                this.autoSaveConversation();

            } else {
                throw new Error(data.error || '發送訊息失敗');
            }

        } catch (error) {
            console.error('發送訊息錯誤:', error);
            this.addMessage('抱歉，發生錯誤。請稍後再試。', 'system');
            this.showNotification('發送訊息失敗', 'error');
        } finally {
            this.hideLoading();
        }
    }

    isImageGenerationRequest(message) {
        const imageKeywords = ['畫', '繪', '生成圖片', '產生圖片', '創作圖片', '畫一個', '畫一張', '繪製', '創建圖片', '製作圖片', 'draw', 'paint', 'create image', 'generate image'];
        return imageKeywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()));
    }

    async handleImageGeneration(message) {
        try {
            this.showLoading();
            this.addMessage('正在生成圖片，請稍候...', 'system');

            // 提取圖片描述
            const prompt = this.extractImagePrompt(message);

            const response = await fetch('/generate_image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt })
            });

            const data = await response.json();

            if (data.success) {
                // 顯示生成的圖片
                this.addImageMessage(data.image_url, prompt);
                this.showNotification('圖片生成成功！', 'success');
            } else {
                this.addMessage(`圖片生成失敗：${data.error}`, 'system');
                this.showNotification(data.error, 'error');
            }

        } catch (error) {
            console.error('圖片生成錯誤:', error);
            this.addMessage('圖片生成過程中發生錯誤', 'system');
            this.showNotification('圖片生成失敗', 'error');
        } finally {
            this.hideLoading();
        }
    }

    extractImagePrompt(message) {
        // 簡單的提示詞提取邏輯
        let prompt = message;
        
        // 移除常見的生成指令詞
        const removeWords = ['畫', '繪', '生成圖片', '產生圖片', '創作圖片', '畫一個', '畫一張', '繪製', '創建圖片', '製作圖片', '請', '幫我'];
        removeWords.forEach(word => {
            prompt = prompt.replace(new RegExp(word, 'gi'), '');
        });

        return prompt.trim() || message;
    }

    addImageMessage(imageUrl, prompt) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageItem = document.createElement('div');
        messageItem.className = 'message-item ai-message';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const icon = '<i class="fas fa-robot me-2"></i>';
        
        const imageHtml = `
            ${icon}
            <div class="generated-image-container mt-2">
                <img src="${imageUrl}" alt="${prompt}" class="generated-image img-fluid rounded" style="max-width: 100%; height: auto;">
                <div class="image-caption mt-2">
                    <small class="text-muted">生成提示：${prompt}</small>
                    <div class="image-actions mt-1">
                        <button class="btn btn-sm btn-outline-primary me-2" onclick="window.aiAssistant.downloadImage('${imageUrl}', '${prompt}')">
                            <i class="fas fa-download"></i> 下載
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="window.aiAssistant.analyzeGeneratedImage('${imageUrl}')">
                            <i class="fas fa-search"></i> 分析
                        </button>
                    </div>
                </div>
            </div>
        `;

        messageContent.innerHTML = imageHtml;
        messageItem.appendChild(messageContent);
        chatMessages.appendChild(messageItem);

        // 滾動到底部
        this.scrollToBottom();
    }

    downloadImage(imageUrl, prompt) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `generated_image_${prompt.substring(0, 20)}_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async analyzeGeneratedImage(imageUrl) {
        try {
            this.showLoading();
            
            // 將 data URL 轉換為 base64
            const base64Data = imageUrl.split(',')[1];
            
            const response = await fetch('/analyze_image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: base64Data })
            });

            const data = await response.json();

            if (data.success) {
                this.addMessage(`圖片分析結果：\n${data.analysis}`, 'ai');
            } else {
                this.showNotification(data.error, 'error');
            }

        } catch (error) {
            console.error('圖片分析錯誤:', error);
            this.showNotification('圖片分析失敗', 'error');
        } finally {
            this.hideLoading();
        }
    }

    addMessage(content, type, useTypewriter = false) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageItem = document.createElement('div');
        messageItem.className = `message-item ${type}-message`;

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        // 添加時間戳
        const timestamp = new Date().toLocaleTimeString();
        
        if (type === 'ai') {
            const icon = '<i class="fas fa-robot me-2"></i>';
            
            if (useTypewriter) {
                messageContent.innerHTML = icon;
                this.typewriterEffect(messageContent, content, icon);
            } else {
                messageContent.innerHTML = icon + this.formatMessage(content);
                this.highlightCode(messageContent);
            }
        } else if (type === 'user') {
            const icon = '<i class="fas fa-user me-2"></i>';
            messageContent.innerHTML = icon + this.escapeHtml(content);
        } else if (type === 'system') {
            const icon = '<i class="fas fa-info-circle me-2"></i>';
            messageContent.innerHTML = icon + this.escapeHtml(content);
        }

        // 添加時間戳
        const timeStamp = document.createElement('div');
        timeStamp.className = 'message-timestamp';
        timeStamp.style.fontSize = '0.75rem';
        timeStamp.style.color = 'var(--text-muted)';
        timeStamp.style.marginTop = '0.5rem';
        timeStamp.textContent = timestamp;
        messageContent.appendChild(timeStamp);

        messageItem.appendChild(messageContent);
        chatMessages.appendChild(messageItem);

        // 滾動到底部
        this.scrollToBottom();

        // 更新聊天歷史
        this.chatHistory.push({
            role: type === 'user' ? 'user' : 'assistant',
            content: content,
            timestamp: new Date().toISOString()
        });
    }

    typewriterEffect(element, text, icon) {
        const speed = parseInt(this.settings.typingSpeed);
        const delay = Math.max(20, Math.min(100, 101 - speed));
        
        let index = 0;
        const cursor = '<span class="typewriter-cursor">|</span>';
        
        const type = () => {
            if (index <= text.length) {
                const currentText = text.substring(0, index);
                const formattedText = this.formatMessage(currentText);
                const showCursor = index < text.length ? cursor : '';
                
                element.innerHTML = icon + formattedText + showCursor;
                
                // 滾動到底部
                this.scrollToBottom();
                
                index++;
                
                if (index <= text.length) {
                    setTimeout(type, delay);
                } else {
                    // 完成後高亮程式碼
                    this.highlightCode(element);
                }
            }
        };
        
        type();
    }

    formatMessage(text) {
        // 處理程式碼區塊
        text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || 'text';
            return `<pre><code class="language-${language}">${this.escapeHtml(code.trim())}</code></pre>`;
        });

        // 處理行內程式碼
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

        // 處理換行
        text = text.replace(/\n/g, '<br>');

        // 處理連結
        text = text.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );

        // 處理粗體
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // 處理斜體
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

        return text;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    highlightCode(element) {
        if (typeof Prism !== 'undefined') {
            Prism.highlightAllUnder(element);
        }
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connectionStatus');
        if (statusElement) {
            if (connected) {
                statusElement.textContent = '已連線';
                statusElement.className = 'badge bg-success';
            } else {
                statusElement.textContent = '未連線';
                statusElement.className = 'badge bg-danger';
            }
        }
    }

    showNotification(message, type = 'info') {
        // 創建通知元素
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification`;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '10000';
        notification.style.minWidth = '300px';
        notification.textContent = message;

        // 添加關閉按鈕
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn-close';
        closeBtn.onclick = () => notification.remove();
        notification.appendChild(closeBtn);

        document.body.appendChild(notification);

        // 自動移除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // 設定相關方法
    async loadSettings() {
        try {
            const saved = localStorage.getItem('aiAssistantSettings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.warn('載入設定失敗:', error);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('aiAssistantSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('儲存設定失敗:', error);
        }
    }

    applySettings() {
        // 應用主題
        this.changeTheme(this.settings.theme);
        
        // 應用字體大小
        this.changeFontSize(this.settings.fontSize);
        
        // 更新設定界面
        this.updateSettingsUI();
    }

    updateSettingsUI() {
        const elements = {
            themeSelect: this.settings.theme,
            fontSizeSelect: this.settings.fontSize,
            aiToneSelect: this.settings.aiTone,
            typingSpeedRange: this.settings.typingSpeed,
            typewriterEffect: this.settings.typewriterEffect,
            voiceInput: this.settings.voiceInput,
            voiceOutput: this.settings.voiceOutput,
            voiceLanguage: this.settings.voiceLanguage,
            voiceSpeed: this.settings.voiceSpeed
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = elements[id];
                } else {
                    element.value = elements[id];
                }
            }
        });
    }

    changeTheme(theme) {
        this.settings.theme = theme;
        document.documentElement.setAttribute('data-bs-theme', theme);
        this.saveSettings();
    }

    changeFontSize(fontSize) {
        this.settings.fontSize = fontSize;
        document.body.className = document.body.className.replace(/font-size-\w+/, '');
        document.body.classList.add(`font-size-${fontSize}`);
        this.saveSettings();
    }

    changeAiTone(tone) {
        this.settings.aiTone = tone;
        this.saveSettings();
    }

    changeTypingSpeed(speed) {
        this.settings.typingSpeed = parseInt(speed);
        this.saveSettings();
    }

    toggleTypewriterEffect(enabled) {
        this.settings.typewriterEffect = enabled;
        this.saveSettings();
    }

    // 更多方法將在後續實現...
    
    handleInputChange() {
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            this.updateInputHeight();
        }
    }

    updateInputHeight() {
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.style.height = 'auto';
            messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
        }
    }

    handleKeyDown(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.sendMessage();
        }
    }

    handlePaste(e) {
        // 處理圖片貼上
        const items = e.clipboardData.items;
        for (let item of items) {
            if (item.type.indexOf('image') !== -1) {
                const file = item.getAsFile();
                this.handleFileUpload([file]);
                e.preventDefault();
                break;
            }
        }
    }

    getContextData() {
        return {
            chatHistory: this.chatHistory.slice(-10), // 最近10條訊息
            settings: this.settings,
            timestamp: new Date().toISOString()
        };
    }

    // 其他工具方法
    async clearHistory() {
        if (confirm('確定要清除所有對話嗎？')) {
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.innerHTML = `
                    <div class="message-item system-message">
                        <div class="message-content">
                            <i class="fas fa-info-circle me-2"></i>
                            對話已清除。請輸入新的問題開始對話。
                        </div>
                    </div>
                `;
            }
            
            this.chatHistory = [];
            this.currentConversationId = null;
            
            try {
                await fetch('/clear_history', { method: 'POST' });
            } catch (error) {
                console.warn('清除伺服器歷史失敗:', error);
            }
        }
    }

    newChat() {
        this.clearHistory();
    }

    async autoSaveConversation() {
        if (this.currentConversationId && this.chatHistory.length > 0) {
            try {
                await fetch('/save_conversation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        conversation_id: this.currentConversationId,
                        messages: this.chatHistory
                    })
                });
            } catch (error) {
                console.warn('自動儲存失敗:', error);
            }
        }
    }

    setupTimers() {
        // 定期自動儲存
        setInterval(() => this.autoSaveConversation(), 30000); // 每30秒

        // 定期更新儲存空間資訊
        setInterval(() => this.updateStorageInfo(), 60000); // 每1分鐘
    }

    async loadChatHistory() {
        // 載入對話歷史列表
        try {
            const response = await fetch('/chat_history');
            if (response.ok) {
                const data = await response.json();
                this.updateChatHistoryUI(data.conversations || []);
            }
        } catch (error) {
            console.warn('載入對話歷史失敗:', error);
        }
    }

    async loadQuickReplies() {
        // 載入快速回覆
        try {
            const response = await fetch('/quick_replies');
            if (response.ok) {
                const data = await response.json();
                this.quickReplies = data.replies || [];
                this.updateQuickRepliesUI();
            }
        } catch (error) {
            console.warn('載入快速回覆失敗:', error);
        }
    }

    updateChatHistoryUI(conversations) {
        const listElement = document.getElementById('chatHistoryList');
        if (!listElement) return;

        if (conversations.length === 0) {
            listElement.innerHTML = '<div class="text-muted text-center">暫無對話記錄</div>';
            return;
        }

        listElement.innerHTML = conversations.map(conv => `
            <div class="chat-history-item" data-id="${conv.id}">
                <div class="chat-title">${conv.title}</div>
                <div class="chat-time">${new Date(conv.updated_at).toLocaleString()}</div>
            </div>
        `).join('');

        // 添加點擊事件
        listElement.querySelectorAll('.chat-history-item').forEach(item => {
            item.addEventListener('click', () => this.loadConversation(item.dataset.id));
        });
    }

    updateQuickRepliesUI() {
        const listElement = document.getElementById('quickRepliesList');
        if (!listElement) return;

        if (this.quickReplies.length === 0) {
            listElement.innerHTML = '<div class="text-muted text-center">暫無快速回覆</div>';
            return;
        }

        listElement.innerHTML = this.quickReplies.map(reply => `
            <div class="quick-reply-item" data-content="${reply.content}">
                ${reply.title}
            </div>
        `).join('');

        // 添加點擊事件
        listElement.querySelectorAll('.quick-reply-item').forEach(item => {
            item.addEventListener('click', () => {
                const messageInput = document.getElementById('messageInput');
                if (messageInput) {
                    messageInput.value = item.dataset.content;
                    messageInput.focus();
                }
            });
        });
    }

    async updateStorageInfo() {
        try {
            const response = await fetch('/storage_info');
            if (response.ok) {
                const data = await response.json();
                this.updateStorageUI(data);
            }
        } catch (error) {
            console.warn('更新儲存空間資訊失敗:', error);
        }
    }

    updateStorageUI(data) {
        const elements = {
            chatStorageUsed: document.getElementById('chatStorageUsed'),
            chatStorageBar: document.getElementById('chatStorageBar'),
            fileStorageUsed: document.getElementById('fileStorageUsed'),
            fileStorageBar: document.getElementById('fileStorageBar')
        };

        if (elements.chatStorageUsed) {
            elements.chatStorageUsed.textContent = `${data.chat_storage_mb || 0} MB`;
        }
        if (elements.chatStorageBar) {
            elements.chatStorageBar.style.width = `${data.chat_storage_percent || 0}%`;
        }
        if (elements.fileStorageUsed) {
            elements.fileStorageUsed.textContent = `${data.file_storage_mb || 0} MB`;
        }
        if (elements.fileStorageBar) {
            elements.fileStorageBar.style.width = `${data.file_storage_percent || 0}%`;
        }
    }

    // QR碼生成器
    openQRCodeGenerator() {
        const modal = new bootstrap.Modal(document.createElement('div'));
        
        const modalContent = `
            <div class="modal fade" id="qrCodeModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-qrcode me-2"></i>QR碼生成器
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="qrText" class="form-label">輸入內容</label>
                                        <textarea class="form-control" id="qrText" rows="6" placeholder="輸入要轉換為QR碼的文字、網址或其他內容..."></textarea>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="qrSize" class="form-label">大小</label>
                                            <select class="form-select" id="qrSize">
                                                <option value="5">小 (5)</option>
                                                <option value="10" selected>中 (10)</option>
                                                <option value="15">大 (15)</option>
                                                <option value="20">特大 (20)</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="qrBorder" class="form-label">邊框</label>
                                            <select class="form-select" id="qrBorder">
                                                <option value="2">小邊框 (2)</option>
                                                <option value="4" selected>標準邊框 (4)</option>
                                                <option value="6">大邊框 (6)</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div class="d-grid gap-2">
                                        <button type="button" class="btn btn-primary" id="generateQRBtn">
                                            <i class="fas fa-magic me-2"></i>生成QR碼
                                        </button>
                                        <button type="button" class="btn btn-success" id="downloadQRBtn" style="display: none;">
                                            <i class="fas fa-download me-2"></i>下載QR碼
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="qr-preview-area">
                                        <div id="qrPreview" class="text-center p-4 border rounded bg-light">
                                            <i class="fas fa-qrcode fa-3x text-muted mb-3"></i>
                                            <p class="text-muted">QR碼將在這裡顯示</p>
                                        </div>
                                        <div id="qrInfo" class="mt-3" style="display: none;">
                                            <h6>QR碼資訊</h6>
                                            <small class="text-muted">
                                                <div><strong>內容：</strong><span id="qrContentInfo"></span></div>
                                                <div><strong>字元數：</strong><span id="qrLengthInfo"></span></div>
                                                <div><strong>尺寸：</strong><span id="qrSizeInfo"></span></div>
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                            <button type="button" class="btn btn-outline-primary" id="clearQRBtn">清除</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalContent);
        // 初始化模態框
        let qrModal;
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            qrModal = new bootstrap.Modal(document.getElementById('qrCodeModal'));
        }
        
        // 事件處理
        let currentQRData = null;
        
        document.getElementById('generateQRBtn').addEventListener('click', async () => {
            const text = document.getElementById('qrText').value.trim();
            const size = parseInt(document.getElementById('qrSize').value);
            const border = parseInt(document.getElementById('qrBorder').value);
            
            if (!text) {
                this.showNotification('請輸入要轉換的內容', 'warning');
                return;
            }
            
            try {
                const generateBtn = document.getElementById('generateQRBtn');
                generateBtn.disabled = true;
                generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>生成中...';
                
                const response = await fetch('/generate_qr', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text, size, border })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // 顯示QR碼
                    const preview = document.getElementById('qrPreview');
                    preview.innerHTML = `<img src="${data.image}" class="img-fluid" alt="QR Code" style="max-width: 100%; border-radius: 8px;">`;
                    
                    // 顯示資訊
                    document.getElementById('qrContentInfo').textContent = text.length > 50 ? text.substring(0, 50) + '...' : text;
                    document.getElementById('qrLengthInfo').textContent = text.length;
                    document.getElementById('qrSizeInfo').textContent = `${size}x${size} 像素`;
                    document.getElementById('qrInfo').style.display = 'block';
                    
                    // 啟用下載按鈕
                    const downloadBtn = document.getElementById('downloadQRBtn');
                    downloadBtn.style.display = 'block';
                    currentQRData = data.download_data;
                    
                    this.showNotification('QR碼生成成功！', 'success');
                } else {
                    this.showNotification('生成失敗：' + (data.error || '未知錯誤'), 'error');
                }
                
            } catch (error) {
                console.error('QR碼生成錯誤:', error);
                this.showNotification('生成失敗，請檢查網路連接', 'error');
            } finally {
                const generateBtn = document.getElementById('generateQRBtn');
                generateBtn.disabled = false;
                generateBtn.innerHTML = '<i class="fas fa-magic me-2"></i>生成QR碼';
            }
        });
        
        // 下載功能
        document.getElementById('downloadQRBtn').addEventListener('click', () => {
            if (currentQRData) {
                const text = document.getElementById('qrText').value.trim();
                const filename = `qrcode_${Date.now()}.png`;
                
                const link = document.createElement('a');
                link.href = `data:image/png;base64,${currentQRData}`;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                this.showNotification('QR碼已下載！', 'success');
            }
        });
        
        // 清除功能
        document.getElementById('clearQRBtn').addEventListener('click', () => {
            document.getElementById('qrText').value = '';
            document.getElementById('qrPreview').innerHTML = `
                <i class="fas fa-qrcode fa-3x text-muted mb-3"></i>
                <p class="text-muted">QR碼將在這裡顯示</p>
            `;
            document.getElementById('qrInfo').style.display = 'none';
            document.getElementById('downloadQRBtn').style.display = 'none';
            currentQRData = null;
        });
        
        // 清理函數
        document.getElementById('qrCodeModal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('qrCodeModal').remove();
        });
        
        ModalManager.showModal(document.getElementById('qrCodeModal'), qrModal);
    }

    // 條碼生成器
    openBarcodeGenerator() {
        const modalContent = `
            <div class="modal fade" id="barcodeModal" tabindex="-1" aria-labelledby="barcodeModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="barcodeModalLabel">
                                <i class="fas fa-barcode me-2"></i>條碼生成器
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-floating mb-3">
                                        <input type="text" class="form-control" id="barcodeText" placeholder="輸入要生成條碼的文字或數字">
                                        <label for="barcodeText">條碼內容</label>
                                    </div>
                                    
                                    <div class="form-floating mb-3">
                                        <select class="form-select" id="barcodeType">
                                            <option value="code128" selected>Code 128 (萬用型)</option>
                                            <option value="code39">Code 39 (字母數字)</option>
                                            <option value="ean13">EAN-13 (商品條碼)</option>
                                            <option value="ean8">EAN-8 (短版商品碼)</option>
                                            <option value="upc">UPC-A (美國商品碼)</option>
                                            <option value="isbn13">ISBN-13 (書籍)</option>
                                            <option value="isbn10">ISBN-10 (舊版書籍)</option>
                                            <option value="issn">ISSN (期刊雜誌)</option>
                                        </select>
                                        <label for="barcodeType">條碼類型</label>
                                    </div>
                                    
                                    <div class="d-grid gap-2">
                                        <button type="button" class="btn btn-primary" id="generateBarcodeBtn">
                                            <i class="fas fa-magic me-2"></i>生成條碼
                                        </button>
                                        <button type="button" class="btn btn-success" id="downloadBarcodeBtn" style="display: none;">
                                            <i class="fas fa-download me-2"></i>下載條碼
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="barcode-preview-area">
                                        <div id="barcodePreview" class="text-center p-4 border rounded bg-light">
                                            <i class="fas fa-barcode fa-3x text-muted mb-3"></i>
                                            <p class="text-muted">條碼將在這裡顯示</p>
                                        </div>
                                        <div id="barcodeInfo" class="mt-3" style="display: none;">
                                            <h6>條碼資訊</h6>
                                            <small class="text-muted">
                                                <div><strong>類型：</strong><span id="barcodeTypeInfo"></span></div>
                                                <div><strong>內容：</strong><span id="barcodeContentInfo"></span></div>
                                                <div><strong>長度：</strong><span id="barcodeLengthInfo"></span></div>
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                            <button type="button" class="btn btn-outline-primary" id="clearBarcodeBtn">清除</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalContent);
        // 初始化模態框
        let barcodeModal;
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            barcodeModal = new bootstrap.Modal(document.getElementById('barcodeModal'));
        }
        
        // 事件處理
        let currentBarcodeData = null;
        
        document.getElementById('generateBarcodeBtn').addEventListener('click', async () => {
            const text = document.getElementById('barcodeText').value.trim();
            const type = document.getElementById('barcodeType').value;
            
            if (!text) {
                this.showNotification('請輸入要轉換的內容', 'warning');
                return;
            }
            
            try {
                const generateBtn = document.getElementById('generateBarcodeBtn');
                generateBtn.disabled = true;
                generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>生成中...';
                
                const response = await fetch('/generate_barcode', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text, type })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // 顯示條碼
                    const preview = document.getElementById('barcodePreview');
                    preview.innerHTML = `<img src="${data.image}" class="img-fluid" alt="Barcode" style="max-width: 100%; border-radius: 8px;">`;
                    
                    // 顯示資訊
                    const typeLabels = {
                        'code128': 'Code 128',
                        'code39': 'Code 39',
                        'ean13': 'EAN-13',
                        'ean8': 'EAN-8',
                        'upc': 'UPC-A',
                        'isbn13': 'ISBN-13',
                        'isbn10': 'ISBN-10',
                        'issn': 'ISSN'
                    };
                    
                    document.getElementById('barcodeTypeInfo').textContent = typeLabels[type] || type;
                    document.getElementById('barcodeContentInfo').textContent = text.length > 30 ? text.substring(0, 30) + '...' : text;
                    document.getElementById('barcodeLengthInfo').textContent = text.length + ' 字元';
                    document.getElementById('barcodeInfo').style.display = 'block';
                    
                    // 啟用下載按鈕
                    const downloadBtn = document.getElementById('downloadBarcodeBtn');
                    downloadBtn.style.display = 'block';
                    currentBarcodeData = data.download_data;
                    
                    this.showNotification('條碼生成成功！', 'success');
                } else {
                    this.showNotification('生成失敗：' + (data.error || '未知錯誤'), 'error');
                }
                
            } catch (error) {
                console.error('條碼生成錯誤:', error);
                this.showNotification('生成失敗，請檢查網路連接', 'error');
            } finally {
                const generateBtn = document.getElementById('generateBarcodeBtn');
                generateBtn.disabled = false;
                generateBtn.innerHTML = '<i class="fas fa-magic me-2"></i>生成條碼';
            }
        });
        
        // 下載功能
        document.getElementById('downloadBarcodeBtn').addEventListener('click', () => {
            if (currentBarcodeData) {
                const text = document.getElementById('barcodeText').value.trim();
                const type = document.getElementById('barcodeType').value;
                const filename = `barcode_${type}_${Date.now()}.png`;
                
                const link = document.createElement('a');
                link.href = `data:image/png;base64,${currentBarcodeData}`;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                this.showNotification('條碼已下載！', 'success');
            }
        });
        
        // 清除功能
        document.getElementById('clearBarcodeBtn').addEventListener('click', () => {
            document.getElementById('barcodeText').value = '';
            document.getElementById('barcodeType').value = 'code128';
            document.getElementById('barcodePreview').innerHTML = `
                <i class="fas fa-barcode fa-3x text-muted mb-3"></i>
                <p class="text-muted">條碼將在這裡顯示</p>
            `;
            document.getElementById('barcodeInfo').style.display = 'none';
            document.getElementById('downloadBarcodeBtn').style.display = 'none';
            currentBarcodeData = null;
        });
        
        // 清理函數
        document.getElementById('barcodeModal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('barcodeModal').remove();
        });
        
        ModalManager.showModal(document.getElementById('barcodeModal'), barcodeModal);
    }

    openDesignGenerator() {
        const modalContent = `
            <div class="modal fade" id="designModal" tabindex="-1" aria-labelledby="designModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="designModalLabel">
                                <i class="fas fa-palette me-2"></i>Canva式設計生成器
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0">設計設定</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label class="form-label">內容文字</label>
                                                <textarea id="designContent" class="form-control" rows="3" placeholder="輸入要顯示的文字內容"></textarea>
                                            </div>
                                            
                                            <div class="row">
                                                <div class="col-md-6 mb-3">
                                                    <label class="form-label">設計類型</label>
                                                    <select id="designType" class="form-select">
                                                        <option value="poster">海報</option>
                                                        <option value="banner">橫幅</option>
                                                        <option value="card">卡片</option>
                                                        <option value="flyer">傳單</option>
                                                        <option value="cover">封面</option>
                                                    </select>
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label class="form-label">設計風格</label>
                                                    <select id="designStyle" class="form-select">
                                                        <option value="modern">現代</option>
                                                        <option value="minimalist">簡約</option>
                                                        <option value="vintage">復古</option>
                                                        <option value="corporate">企業</option>
                                                        <option value="creative">創意</option>
                                                    </select>
                                                </div>
                                            </div>
                                            
                                            <div class="mb-3">
                                                <label class="form-label">色彩主題</label>
                                                <select id="designColor" class="form-select">
                                                    <option value="blue">藍色</option>
                                                    <option value="red">紅色</option>
                                                    <option value="green">綠色</option>
                                                    <option value="purple">紫色</option>
                                                    <option value="orange">橙色</option>
                                                    <option value="pink">粉色</option>
                                                    <option value="black">黑色</option>
                                                    <option value="colorful">多彩</option>
                                                </select>
                                            </div>
                                            
                                            <button type="button" id="generateDesignBtn" class="btn btn-primary w-100">
                                                <i class="fas fa-magic me-2"></i>生成設計
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header d-flex justify-content-between align-items-center">
                                            <h6 class="mb-0">設計預覽</h6>
                                            <button type="button" id="downloadDesignBtn" class="btn btn-outline-success btn-sm" style="display: none;">
                                                <i class="fas fa-download me-1"></i>下載
                                            </button>
                                        </div>
                                        <div class="card-body text-center">
                                            <div id="designPreview" class="design-preview">
                                                <i class="fas fa-palette fa-3x text-muted mb-3"></i>
                                                <p class="text-muted">設計將在這裡顯示</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div id="designInfo" class="card mt-3" style="display: none;">
                                        <div class="card-header">
                                            <h6 class="mb-0">設計信息</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-sm-6">
                                                    <small class="text-muted">類型：</small>
                                                    <span id="designTypeInfo"></span>
                                                </div>
                                                <div class="col-sm-6">
                                                    <small class="text-muted">風格：</small>
                                                    <span id="designStyleInfo"></span>
                                                </div>
                                            </div>
                                            <div class="row mt-2">
                                                <div class="col-sm-6">
                                                    <small class="text-muted">顏色：</small>
                                                    <span id="designColorInfo"></span>
                                                </div>
                                                <div class="col-sm-6">
                                                    <small class="text-muted">尺寸：</small>
                                                    <span id="designSizeInfo">1024x1024</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                            <button type="button" class="btn btn-outline-primary" id="clearDesignBtn">清除</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalContent);
        // 初始化模態框
        let designModal;
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            designModal = new bootstrap.Modal(document.getElementById('designModal'));
        }
        
        // 事件處理
        let currentDesignData = null;
        
        document.getElementById('generateDesignBtn').addEventListener('click', async () => {
            const content = document.getElementById('designContent').value.trim();
            const designType = document.getElementById('designType').value;
            const style = document.getElementById('designStyle').value;
            const color = document.getElementById('designColor').value;
            
            if (!content) {
                this.showNotification('請輸入設計內容', 'warning');
                return;
            }
            
            const generateBtn = document.getElementById('generateDesignBtn');
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>生成中...';
            
            try {
                const response = await fetch('/generate_design', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        content: content,
                        design_type: designType,
                        style: style,
                        color_scheme: color
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    document.getElementById('designPreview').innerHTML = 
                        `<img src="${data.image}" class="img-fluid rounded" style="max-width: 100%; height: auto;" alt="生成的設計">`;
                    
                    // 更新設計信息
                    const typeLabels = {
                        'poster': '海報',
                        'banner': '橫幅',
                        'card': '卡片',
                        'flyer': '傳單',
                        'cover': '封面'
                    };
                    
                    const styleLabels = {
                        'modern': '現代',
                        'minimalist': '簡約',
                        'vintage': '復古',
                        'corporate': '企業',
                        'creative': '創意'
                    };
                    
                    const colorLabels = {
                        'blue': '藍色',
                        'red': '紅色',
                        'green': '綠色',
                        'purple': '紫色',
                        'orange': '橙色',
                        'pink': '粉色',
                        'black': '黑色',
                        'colorful': '多彩'
                    };
                    
                    document.getElementById('designTypeInfo').textContent = typeLabels[designType] || designType;
                    document.getElementById('designStyleInfo').textContent = styleLabels[style] || style;
                    document.getElementById('designColorInfo').textContent = colorLabels[color] || color;
                    document.getElementById('designInfo').style.display = 'block';
                    
                    // 啟用下載按鈕
                    const downloadBtn = document.getElementById('downloadDesignBtn');
                    downloadBtn.style.display = 'block';
                    currentDesignData = data.download_data;
                    
                    this.showNotification('設計生成成功！', 'success');
                } else {
                    this.showNotification('生成失敗：' + (data.error || '未知錯誤'), 'error');
                }
                
            } catch (error) {
                console.error('設計生成錯誤:', error);
                this.showNotification('生成失敗，請檢查網路連接', 'error');
            } finally {
                generateBtn.disabled = false;
                generateBtn.innerHTML = '<i class="fas fa-magic me-2"></i>生成設計';
            }
        });
        
        // 下載功能
        document.getElementById('downloadDesignBtn').addEventListener('click', () => {
            if (currentDesignData) {
                const content = document.getElementById('designContent').value.trim();
                const designType = document.getElementById('designType').value;
                const filename = `design_${designType}_${Date.now()}.png`;
                
                const link = document.createElement('a');
                link.href = `data:image/png;base64,${currentDesignData}`;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                this.showNotification('設計已下載！', 'success');
            }
        });
        
        // 清除功能
        document.getElementById('clearDesignBtn').addEventListener('click', () => {
            document.getElementById('designContent').value = '';
            document.getElementById('designType').value = 'poster';
            document.getElementById('designStyle').value = 'modern';
            document.getElementById('designColor').value = 'blue';
            document.getElementById('designPreview').innerHTML = `
                <i class="fas fa-palette fa-3x text-muted mb-3"></i>
                <p class="text-muted">設計將在這裡顯示</p>
            `;
            document.getElementById('designInfo').style.display = 'none';
            document.getElementById('downloadDesignBtn').style.display = 'none';
            currentDesignData = null;
        });
        
        // 清理函數
        document.getElementById('designModal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('designModal').remove();
        });
        
        ModalManager.showModal(document.getElementById('designModal'), designModal);
    }

    // 添加缺失的工具方法
    openPasswordGenerator() {
        if (typeof openPasswordGenerator === 'function') {
            openPasswordGenerator();
        } else {
            this.showNotification('密碼生成器功能暫時不可用', 'error');
        }
    }

    openCalculator() {
        if (typeof openCalculator === 'function') {
            openCalculator();
        } else {
            this.showNotification('計算器功能暫時不可用', 'error');
        }
    }

    openURLShortener() {
        const url = prompt('請輸入要縮短的網址:');
        if (url) {
            try {
                // 驗證URL格式
                new URL(url);
                
                // 這是一個簡單的縮短器，實際應用中應使用真實的API
                const shortCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                const shortUrl = `https://short.ly/${shortCode}`;
                
                const newWindow = window.open('', '_blank');
                newWindow.document.write(`
                    <html>
                        <head><title>網址縮短器</title></head>
                        <body style="font-family: Arial; text-align: center; padding: 20px;">
                            <h2>網址縮短器</h2>
                            <p><strong>原始網址:</strong></p>
                            <div style="background: #f0f0f0; padding: 10px; margin: 10px; word-break: break-all; border: 1px solid #ccc;">
                                ${url}
                            </div>
                            <p><strong>縮短網址:</strong></p>
                            <div style="background: #e0f0ff; padding: 10px; margin: 10px; font-family: monospace; font-size: 18px; border: 1px solid #ccc;">
                                ${shortUrl}
                            </div>
                            <button onclick="navigator.clipboard.writeText('${shortUrl}')">複製縮短網址</button>
                            <br><br>
                            <p class="text-muted">*這是示例功能，實際應用需要真實的縮短服務</p>
                        </body>
                    </html>
                `);
                
            } catch (error) {
                alert('請輸入有效的網址 (例如: https://example.com)');
            }
        }
    }

    openDateTimeConverter() {
        const dateInput = prompt('請輸入日期時間 (例如: 2024-01-01 或 now):');
        if (dateInput) {
            try {
                let date;
                if (dateInput.toLowerCase() === 'now') {
                    date = new Date();
                } else {
                    date = new Date(dateInput);
                }
                
                if (isNaN(date.getTime())) {
                    throw new Error('無效的日期格式');
                }
                
                const timestamp = date.getTime();
                const unixTimestamp = Math.floor(timestamp / 1000);
                
                const newWindow = window.open('', '_blank');
                newWindow.document.write(`
                    <html>
                        <head><title>時間轉換器</title></head>
                        <body style="font-family: Arial; padding: 20px;">
                            <h2>時間轉換器</h2>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr style="background: #f0f0f0;">
                                    <th style="padding: 10px; border: 1px solid #ccc;">格式</th>
                                    <th style="padding: 10px; border: 1px solid #ccc;">值</th>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #ccc;">完整日期時間</td>
                                    <td style="padding: 10px; border: 1px solid #ccc;">${date.toString()}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #ccc;">ISO 8601</td>
                                    <td style="padding: 10px; border: 1px solid #ccc;">${date.toISOString()}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #ccc;">Unix 時間戳</td>
                                    <td style="padding: 10px; border: 1px solid #ccc;">${unixTimestamp}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #ccc;">毫秒時間戳</td>
                                    <td style="padding: 10px; border: 1px solid #ccc;">${timestamp}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #ccc;">本地時間</td>
                                    <td style="padding: 10px; border: 1px solid #ccc;">${date.toLocaleString()}</td>
                                </tr>
                            </table>
                        </body>
                    </html>
                `);
                
            } catch (error) {
                alert('時間轉換錯誤：' + error.message);
            }
        }
    }

    openColorPicker() {
        if (typeof openColorConverter === 'function') {
            openColorConverter();
        } else {
            this.showNotification('顏色轉換器功能暫時不可用', 'error');
        }
    }
}

// 初始化應用程式
document.addEventListener('DOMContentLoaded', () => {
    window.aiAssistant = new EnhancedAIAssistant();
});

// 確保在 DOM 載入完成後初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.aiAssistant) {
            window.aiAssistant = new EnhancedAIAssistant();
        }
    });
} else {
    if (!window.aiAssistant) {
        window.aiAssistant = new EnhancedAIAssistant();
    }
}