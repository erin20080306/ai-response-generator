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
        
        // 系統主題監聽器
        this.setupSystemThemeListener();
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

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        
        if (sidebar && mainContent) {
            sidebar.classList.toggle('show');
            
            // 在手機版本上，當側邊欄打開時添加遮罩
            if (window.innerWidth <= 768) {
                if (sidebar.classList.contains('show')) {
                    // 添加遮罩
                    if (!document.querySelector('.sidebar-overlay')) {
                        const overlay = document.createElement('div');
                        overlay.className = 'sidebar-overlay';
                        overlay.style.cssText = `
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.5);
                            z-index: 999;
                        `;
                        overlay.addEventListener('click', () => this.toggleSidebar());
                        document.body.appendChild(overlay);
                    }
                } else {
                    // 移除遮罩
                    const overlay = document.querySelector('.sidebar-overlay');
                    if (overlay) {
                        overlay.remove();
                    }
                }
            }
        }
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

        console.log('發送訊息:', message);

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

            // 檢查是否為文件生成指令
            console.log('檢查文件生成需求:', message);
            if (this.isDocumentGenerationRequest(message)) {
                console.log('檢測到文件生成需求，開始處理...');
                await this.handleDocumentGeneration(message);
                return;
            }
            console.log('非文件生成需求，繼續正常處理');

            // 顯示載入狀態
            this.showLoading();

            console.log('準備發送到後端...');

            // 發送到後端
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message
                })
            });

            console.log('收到後端回應，狀態:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('解析後端數據:', data);

            if (data.success) {
                if (data.is_multi_code && data.responses) {
                    // 多重程式碼回應：依序顯示每個程式碼類型
                    console.log('顯示多重程式碼回應:', data.responses);
                    
                    const useTypewriter = this.settings.typewriterEffect;
                    
                    // 依序顯示每個回應
                    data.responses.forEach((response, index) => {
                        setTimeout(() => {
                            this.addMessage(response, 'ai', useTypewriter);
                        }, index * 1000);
                    });
                    
                    this.showNotification('程式碼分類回應完成', 'success');
                } else if (data.image_generated && data.image_url) {
                    // 圖片生成回應
                    console.log('顯示圖片生成回應:', data.response);
                    const useTypewriter = this.settings.typewriterEffect;
                    this.addMessageWithImage(data.response, data.image_url, useTypewriter);
                    
                    this.showNotification('圖片生成成功', 'success');
                } else {
                    // 一般回應
                    console.log('顯示AI回應:', data.response);
                    const useTypewriter = this.settings.typewriterEffect;
                    this.addMessage(data.response, 'ai', useTypewriter);
                    
                    this.showNotification('AI回應成功', 'success');
                }

            } else {
                throw new Error(data.error || '發送訊息失敗');
            }

        } catch (error) {
            console.error('發送訊息錯誤:', error);
            this.addMessage('抱歉，發生錯誤。請稍後再試。', 'system');
            this.showNotification('發送訊息失敗: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    isImageGenerationRequest(message) {
        const imageKeywords = ['畫', '繪', '生成圖片', '產生圖片', '創作圖片', '畫一個', '畫一張', '繪製', '創建圖片', '製作圖片', 'draw', 'paint', 'create image', 'generate image'];
        return imageKeywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()));
    }

    isDocumentGenerationRequest(message) {
        const docKeywords = [
            // Excel 關鍵詞 - 使用更簡單的檢測邏輯
            'excel檔', 'excel表', 'excel文件', 'excel試算表',
            '試算表', '表格檔', '員工名單excel', '員工清單excel',
            'spreadsheet', 'excel file',
            
            // Word 關鍵詞
            'word檔', 'word文件', 'word文檔', 
            '文件檔', '文檔檔', '報告word', '記錄word',
            'word document', 'document file',
            
            // TXT 關鍵詞
            'txt檔', 'txt文件', '文字檔',
            'text file', 'txt file',
            
            // 包含生成動詞的組合檢測
            '生成.*excel', '創建.*excel', '製作.*excel', '產生.*excel', '建立.*excel',
            '生成.*word', '創建.*word', '製作.*word', '產生.*word', '建立.*word',
            '生成.*txt', '創建.*txt', '製作.*txt', '產生.*txt', '建立.*txt',
            '生成.*檔案', '創建.*檔案', '製作.*檔案', '產生.*檔案', '建立.*檔案',
            '存成.*word', '存成.*excel', '存成.*txt',
            '下載.*excel', '下載.*word', '下載.*txt'
        ];
        
        const msgLower = message.toLowerCase();
        
        // 先檢查簡單關鍵詞
        const simpleKeywords = docKeywords.filter(keyword => !keyword.includes('.*'));
        const simpleFound = simpleKeywords.some(keyword => msgLower.includes(keyword.toLowerCase()));
        
        // 再檢查正則表達式關鍵詞
        const regexKeywords = docKeywords.filter(keyword => keyword.includes('.*'));
        const regexFound = regexKeywords.some(keyword => {
            const regex = new RegExp(keyword.toLowerCase(), 'i');
            return regex.test(msgLower);
        });
        
        const found = simpleFound || regexFound;
        console.log('文件生成檢測結果:', found, '訊息:', message);
        
        if (found) {
            const matchedSimple = simpleKeywords.filter(keyword => msgLower.includes(keyword.toLowerCase()));
            const matchedRegex = regexKeywords.filter(keyword => {
                const regex = new RegExp(keyword.toLowerCase(), 'i');
                return regex.test(msgLower);
            });
            console.log('匹配的簡單關鍵詞:', matchedSimple);
            console.log('匹配的正則關鍵詞:', matchedRegex);
        }
        
        return found;
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

    analyzeDocumentRequest(message) {
        const msgLower = message.toLowerCase();
        
        // 檢測文件類型
        let type = 'excel'; // 默認
        let typeName = 'Excel';
        
        if (msgLower.includes('word') || msgLower.includes('文件') || msgLower.includes('文檔')) {
            type = 'word';
            typeName = 'Word';
        } else if (msgLower.includes('txt') || msgLower.includes('文字檔')) {
            type = 'txt';
            typeName = 'TXT';
        } else if (msgLower.includes('excel') || msgLower.includes('試算表') || msgLower.includes('表格')) {
            type = 'excel';
            typeName = 'Excel';
        }
        
        return {
            type: type,
            typeName: typeName,
            message: message
        };
    }

    async handleDocumentGeneration(message) {
        try {
            this.showLoading();
            this.addMessage('正在分析您的文件需求...', 'system');

            // 分析文件類型和內容
            const docInfo = this.analyzeDocumentRequest(message);
            console.log('分析文件請求結果:', docInfo);
            
            const response = await fetch('/generate_document', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: message,
                    type: docInfo.type,
                    language: 'zh-TW',
                    method: 'ai_generate'
                })
            });

            const data = await response.json();

            if (data.success) {
                // 顯示生成成功訊息
                this.addMessage(`✅ ${docInfo.typeName}文件已生成完成！`, 'system');
                
                // 添加下載連結
                this.addDocumentDownloadMessage(data);
                
                this.showNotification('文件生成成功！', 'success');
            } else {
                this.addMessage(`❌ 文件生成失敗：${data.error}`, 'system');
                this.showNotification(data.error, 'error');
            }

        } catch (error) {
            console.error('文件生成錯誤:', error);
            this.addMessage('文件生成過程中發生錯誤，請稍後再試', 'system');
            this.showNotification('文件生成失敗', 'error');
        } finally {
            this.hideLoading();
        }
    }



    addDocumentDownloadMessage(data) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageItem = document.createElement('div');
        messageItem.className = 'message-item system-message';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const icon = '<i class="fas fa-file-download me-2"></i>';
        
        const downloadHtml = `
            ${icon}
            <div class="document-download-container mt-2">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">📄 文件生成完成</h6>
                        <p class="card-text small">您的文件已準備就緒，可以下載</p>
                        <div class="d-flex gap-2 flex-wrap">
                            <a href="/download/${data.filename}" class="btn btn-primary btn-sm" download>
                                <i class="fas fa-download me-1"></i>下載文件
                            </a>
                            <button class="btn btn-outline-secondary btn-sm" onclick="navigator.clipboard.writeText('${window.location.origin}/download/${data.filename}')">
                                <i class="fas fa-link me-1"></i>複製連結
                            </button>
                        </div>
                        <small class="text-muted d-block mt-2">檔案名稱: ${data.filename}</small>
                    </div>
                </div>
            </div>
        `;

        messageContent.innerHTML = downloadHtml;
        messageItem.appendChild(messageContent);
        chatMessages.appendChild(messageItem);

        // 滾動到底部
        this.scrollToBottom();
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

    addMessageWithImage(content, imageUrl, useTypewriter = false) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageItem = document.createElement('div');
        messageItem.className = 'message-item ai-message';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const icon = '<i class="fas fa-robot me-2"></i>';
        const timestamp = new Date().toLocaleTimeString();

        if (useTypewriter) {
            messageContent.innerHTML = icon;
            this.typewriterEffectWithImage(messageContent, content, imageUrl, icon);
        } else {
            messageContent.innerHTML = icon + this.escapeHtml(content);
            
            // 添加圖片
            const imageDiv = document.createElement('div');
            imageDiv.className = 'generated-image mt-3';
            imageDiv.innerHTML = `
                <img src="${imageUrl}" alt="AI生成圖片" class="img-fluid rounded shadow" style="max-width: 100%; max-height: 400px; cursor: pointer;" onclick="window.open('${imageUrl}', '_blank')">
                <div class="image-actions mt-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="navigator.clipboard.writeText('${imageUrl}')">
                        <i class="fas fa-link me-1"></i>複製連結
                    </button>
                    <a href="${imageUrl}" download="generated-image.png" class="btn btn-sm btn-outline-success ms-2">
                        <i class="fas fa-download me-1"></i>下載圖片
                    </a>
                </div>
            `;
            messageContent.appendChild(imageDiv);
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
            role: 'assistant',
            content: content,
            image_url: imageUrl,
            timestamp: new Date().toISOString()
        });
    }

    typewriterEffectWithImage(element, text, imageUrl, icon) {
        const speed = parseInt(this.settings.typingSpeed) || 50;
        const delay = Math.max(15, Math.min(60, 101 - speed));
        
        let index = 0;
        const cursor = '<span class="typewriter-cursor">|</span>';
        
        element.innerHTML = icon;
        
        const type = () => {
            if (index < text.length) {
                const currentText = text.substring(0, index + 1);
                element.innerHTML = icon + this.escapeHtml(currentText) + cursor;
                this.scrollToBottom();
                index++;
                
                if (index < text.length) {
                    setTimeout(type, delay);
                } else {
                    // 完成時顯示圖片
                    element.innerHTML = icon + this.escapeHtml(text);
                    
                    const imageDiv = document.createElement('div');
                    imageDiv.className = 'generated-image mt-3';
                    imageDiv.innerHTML = `
                        <img src="${imageUrl}" alt="AI生成圖片" class="img-fluid rounded shadow" style="max-width: 100%; max-height: 400px; cursor: pointer;" onclick="window.open('${imageUrl}', '_blank')">
                        <div class="image-actions mt-2">
                            <button class="btn btn-sm btn-outline-primary" onclick="navigator.clipboard.writeText('${imageUrl}')">
                                <i class="fas fa-link me-1"></i>複製連結
                            </button>
                            <a href="${imageUrl}" download="generated-image.png" class="btn btn-sm btn-outline-success ms-2">
                                <i class="fas fa-download me-1"></i>下載圖片
                            </a>
                        </div>
                    `;
                    element.appendChild(imageDiv);
                    this.scrollToBottom();
                }
            }
        };
        
        setTimeout(type, delay);
    }

    typewriterEffect(element, text, icon) {
        const speed = parseInt(this.settings.typingSpeed) || 50;
        const delay = Math.max(15, Math.min(60, 101 - speed));
        
        let index = 0;
        const cursor = '<span class="typewriter-cursor">|</span>';
        
        // 清空元素內容並顯示圖標
        element.innerHTML = icon;
        
        const type = () => {
            try {
                if (index < text.length) {
                    // 每次增加1個字符
                    const currentText = text.substring(0, index + 1);
                    
                    // 直接顯示文本，不格式化以避免中斷
                    element.innerHTML = icon + this.escapeHtml(currentText) + cursor;
                    
                    // 滾動到底部
                    this.scrollToBottom();
                    
                    index++;
                    
                    // 調試信息 - 每100個字符打印一次進度
                    if (index % 100 === 0) {
                        console.log(`打字機進度: ${index}/${text.length}`);
                    }
                    
                    // 繼續下一個字符
                    if (index < text.length) {
                        setTimeout(type, delay);
                    } else {
                        // 完成時格式化並移除游標
                        console.log('打字機效果完成');
                        element.innerHTML = icon + this.formatMessage(text);
                        this.highlightCode(element);
                    }
                } else {
                    // 完成時格式化並移除游標
                    console.log('打字機效果完成 (分支2)');
                    element.innerHTML = icon + this.formatMessage(text);
                    this.highlightCode(element);
                }
            } catch (error) {
                console.error('打字機效果錯誤 (位置:', index, '/', text.length, '):', error);
                // 發生錯誤時直接顯示完整文本
                element.innerHTML = icon + this.formatMessage(text);
                this.highlightCode(element);
            }
        };
        
        // 開始打字效果
        setTimeout(type, delay);
    }

    formatMessage(text) {
        // 首先處理雙換行為段落分隔標記
        text = text.replace(/\n\n/g, '||PARAGRAPH_BREAK||');
        
        // 處理程式碼區塊，添加語言標籤和複製按鈕
        text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || 'text';
            const cleanCode = this.escapeHtml(code.trim());
            const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
            return `
                <div class="code-block-container">
                    <div class="code-header">
                        <span class="code-language">${language}</span>
                        <button class="btn btn-sm btn-outline-light copy-code-btn" onclick="copyCodeToClipboard('${codeId}')">
                            <i class="fas fa-copy me-1"></i>複製
                        </button>
                    </div>
                    <pre data-language="${language}" id="${codeId}"><code class="language-${language}">${cleanCode}</code></pre>
                </div>
            `;
        });

        // 處理行內程式碼（添加複製功能）
        text = text.replace(/`([^`]+)`/g, (match, code) => {
            const codeId = 'inline-code-' + Math.random().toString(36).substr(2, 9);
            return `<span class="inline-code-container">
                <code id="${codeId}">${code}</code>
                <button class="btn btn-sm btn-link inline-copy-btn" onclick="copyCodeToClipboard('${codeId}')" title="複製程式碼">
                    <i class="fas fa-copy"></i>
                </button>
            </span>`;
        });

        // 處理標題 (添加更多間距)
        text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');

        // 處理清單項目
        text = text.replace(/^\- (.*$)/gm, '<li>$1</li>');
        text = text.replace(/^(\d+)\. (.*$)/gm, '<li>$1. $2</li>');

        // 將連續的 <li> 包裝在 <ul> 中
        text = text.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

        // 處理單換行為行內換行
        text = text.replace(/\n/g, '<br>');
        
        // 將段落分隔標記轉換為段落標籤
        const paragraphs = text.split('||PARAGRAPH_BREAK||');
        text = paragraphs.map(p => p.trim() ? `<p>${p.trim()}</p>` : '').filter(p => p).join('');
        
        // 如果沒有段落標籤，包裝整個內容
        if (!text.includes('<p>')) {
            text = `<p>${text}</p>`;
        }

        // 處理連結
        text = text.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );

        // 處理粗體
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // 處理斜體
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // 在段落之間添加間距
        text = text.replace(/(<\/pre>)<br>/g, '$1<div class="code-separator"></div>');
        text = text.replace(/(<\/h[1-6]>)<br>/g, '$1<div class="heading-separator"></div>');

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
        // 創建或顯示載入指示器
        let loadingElement = document.getElementById('chatLoading');
        if (!loadingElement) {
            loadingElement = document.createElement('div');
            loadingElement.id = 'chatLoading';
            loadingElement.className = 'message-item ai-message loading';
            loadingElement.innerHTML = `
                <div class="message-content">
                    <i class="fas fa-robot me-2"></i>
                    <span class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                    正在思考中...
                </div>
            `;
            
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.appendChild(loadingElement);
                this.scrollToBottom();
            }
        }
    }

    hideLoading() {
        const loadingElement = document.getElementById('chatLoading');
        if (loadingElement) {
            loadingElement.remove();
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
        
        // 處理新增的主題選項
        switch(theme) {
            case 'auto':
                // 跟隨系統主題
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
                document.documentElement.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
                break;
            case 'light':
            case 'dark':
                // 經典主題
                document.documentElement.setAttribute('data-theme', theme);
                document.documentElement.setAttribute('data-bs-theme', theme);
                break;
            default:
                // 所有新增的主題變體
                document.documentElement.setAttribute('data-theme', theme);
                // 為新主題選擇適當的Bootstrap主題基礎
                const isLightTheme = theme.startsWith('light-') || theme === 'retro' || theme === 'minimal';
                document.documentElement.setAttribute('data-bs-theme', isLightTheme ? 'light' : 'dark');
                break;
        }
        
        this.saveSettings();
        
        // 顯示主題變更通知
        this.showNotification(`已切換至${this.getThemeDisplayName(theme)}主題`, 'success');
    }
    
    getThemeDisplayName(theme) {
        const themeNames = {
            'dark': '經典深色',
            'light': '經典淺色',
            'auto': '跟隨系統',
            'dark-blue': '深藍',
            'dark-purple': '深紫',
            'dark-green': '深綠',
            'dark-red': '深紅',
            'light-blue': '淺藍',
            'light-purple': '淺紫',
            'light-green': '淺綠',
            'cyberpunk': '賽博龐克',
            'retro': '復古',
            'minimal': '極簡',
            'contrast': '高對比度'
        };
        return themeNames[theme] || theme;
    }
    
    setupSystemThemeListener() {
        // 監聽系統主題變化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (this.settings.theme === 'auto') {
                // 如果當前是跟隨系統主題，則更新
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
                document.documentElement.setAttribute('data-bs-theme', e.matches ? 'dark' : 'light');
            }
        });
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





    // 添加缺失的工具方法
    openPasswordGenerator() {
        const modalContent = `
            <div class="modal fade" id="passwordModal" tabindex="-1" aria-labelledby="passwordModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="passwordModalLabel">
                                <i class="fas fa-key me-2"></i>密碼生成器
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="passwordLength" class="form-label">密碼長度</label>
                                <input type="number" class="form-control" id="passwordLength" min="8" max="50" value="16">
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="includeUppercase" checked>
                                <label class="form-check-label" for="includeUppercase">包含大寫字母</label>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="includeLowercase" checked>
                                <label class="form-check-label" for="includeLowercase">包含小寫字母</label>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="includeNumbers" checked>
                                <label class="form-check-label" for="includeNumbers">包含數字</label>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="includeSymbols">
                                <label class="form-check-label" for="includeSymbols">包含特殊符號</label>
                            </div>
                            <div class="mb-3">
                                <button type="button" class="btn btn-primary" id="generatePasswordBtn">
                                    <i class="fas fa-magic me-2"></i>生成密碼
                                </button>
                                <button type="button" class="btn btn-secondary ms-2" id="copyPasswordBtn" style="display:none;">
                                    <i class="fas fa-copy me-2"></i>複製密碼
                                </button>
                            </div>
                            <div id="passwordResult" class="mt-3" style="display:none;">
                                <label class="form-label">生成的密碼：</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="generatedPassword" readonly>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalContent);
        
        // 生成密碼事件
        document.getElementById('generatePasswordBtn').addEventListener('click', () => {
            const length = parseInt(document.getElementById('passwordLength').value);
            const uppercase = document.getElementById('includeUppercase').checked;
            const lowercase = document.getElementById('includeLowercase').checked;
            const numbers = document.getElementById('includeNumbers').checked;
            const symbols = document.getElementById('includeSymbols').checked;
            
            if (!uppercase && !lowercase && !numbers && !symbols) {
                this.showNotification('請至少選擇一種字符類型', 'error');
                return;
            }
            
            let chars = '';
            if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
            if (numbers) chars += '0123456789';
            if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
            
            let password = '';
            for (let i = 0; i < length; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            
            document.getElementById('generatedPassword').value = password;
            document.getElementById('passwordResult').style.display = 'block';
            document.getElementById('copyPasswordBtn').style.display = 'inline-block';
            
            this.showNotification('密碼生成成功！', 'success');
        });
        
        // 複製密碼事件
        document.getElementById('copyPasswordBtn').addEventListener('click', () => {
            const password = document.getElementById('generatedPassword').value;
            navigator.clipboard.writeText(password).then(() => {
                this.showNotification('密碼已複製到剪貼簿！', 'success');
            });
        });
        
        // 清理函數
        document.getElementById('passwordModal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('passwordModal').remove();
        });
        
        ModalManager.showModal(document.getElementById('passwordModal'));
    }

    openCalculator() {
        const modalContent = `
            <div class="modal fade" id="calculatorModal" tabindex="-1" aria-labelledby="calculatorModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="calculatorModalLabel">
                                <i class="fas fa-calculator me-2"></i>計算器
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="calculatorInput" class="form-label">運算式</label>
                                <input type="text" class="form-control" id="calculatorInput" placeholder="例如: 2 + 3 * 4">
                            </div>
                            <div class="mb-3">
                                <button type="button" class="btn btn-primary" id="calculateBtn">
                                    <i class="fas fa-equals me-2"></i>計算
                                </button>
                                <button type="button" class="btn btn-secondary ms-2" id="clearCalculatorBtn">
                                    <i class="fas fa-trash me-2"></i>清除
                                </button>
                            </div>
                            <div id="calculatorResult" class="mt-3" style="display:none;">
                                <label class="form-label">計算結果：</label>
                                <div class="alert alert-success" id="resultDisplay"></div>
                            </div>
                            <div class="mt-3">
                                <small class="text-muted">支援基本運算符: +, -, *, /, (, )</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalContent);
        
        // 計算事件
        document.getElementById('calculateBtn').addEventListener('click', () => {
            const input = document.getElementById('calculatorInput').value.trim();
            if (!input) {
                this.showNotification('請輸入運算式', 'error');
                return;
            }
            
            try {
                // 安全的計算方式，只允許基本運算符
                const sanitized = input.replace(/[^0-9+\-*/().\s]/g, '');
                if (sanitized !== input) {
                    throw new Error('包含不允許的字符');
                }
                
                const result = Function('"use strict"; return (' + sanitized + ')')();
                
                if (isNaN(result) || !isFinite(result)) {
                    throw new Error('計算結果無效');
                }
                
                document.getElementById('resultDisplay').textContent = `${input} = ${result}`;
                document.getElementById('calculatorResult').style.display = 'block';
                
                this.showNotification('計算完成！', 'success');
            } catch (error) {
                this.showNotification('計算錯誤：請輸入有效的運算式', 'error');
            }
        });
        
        // 清除事件
        document.getElementById('clearCalculatorBtn').addEventListener('click', () => {
            document.getElementById('calculatorInput').value = '';
            document.getElementById('calculatorResult').style.display = 'none';
        });
        
        // Enter鍵計算
        document.getElementById('calculatorInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('calculateBtn').click();
            }
        });
        
        // 清理函數
        document.getElementById('calculatorModal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('calculatorModal').remove();
        });
        
        ModalManager.showModal(document.getElementById('calculatorModal'));
    }

    openURLShortener() {
        const modalContent = `
            <div class="modal fade" id="urlShortenerModal" tabindex="-1" aria-labelledby="urlShortenerModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="urlShortenerModalLabel">
                                <i class="fas fa-link me-2"></i>網址縮短器
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="originalUrl" class="form-label">原始網址</label>
                                <input type="url" class="form-control" id="originalUrl" placeholder="https://example.com">
                            </div>
                            <div class="mb-3">
                                <button type="button" class="btn btn-primary" id="shortenUrlBtn">
                                    <i class="fas fa-compress me-2"></i>縮短網址
                                </button>
                            </div>
                            <div id="urlResult" class="mt-3" style="display:none;">
                                <div class="mb-3">
                                    <label class="form-label">原始網址：</label>
                                    <div class="form-control" id="originalUrlDisplay" style="word-break: break-all;"></div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">縮短網址：</label>
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="shortUrlDisplay" readonly>
                                        <button class="btn btn-outline-secondary" id="copyShortUrlBtn">
                                            <i class="fas fa-copy"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="alert alert-info">
                                    <small><i class="fas fa-info-circle me-1"></i>這是示例功能，實際應用需要真實的縮短服務</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalContent);
        
        // 縮短網址事件
        document.getElementById('shortenUrlBtn').addEventListener('click', () => {
            const url = document.getElementById('originalUrl').value.trim();
            if (!url) {
                this.showNotification('請輸入網址', 'error');
                return;
            }
            
            try {
                // 驗證URL格式
                new URL(url);
                
                // 生成縮短網址
                const shortCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                const shortUrl = `https://short.ly/${shortCode}`;
                
                document.getElementById('originalUrlDisplay').textContent = url;
                document.getElementById('shortUrlDisplay').value = shortUrl;
                document.getElementById('urlResult').style.display = 'block';
                
                this.showNotification('網址縮短成功！', 'success');
            } catch (error) {
                this.showNotification('請輸入有效的網址 (例如: https://example.com)', 'error');
            }
        });
        
        // 複製縮短網址事件
        document.getElementById('copyShortUrlBtn').addEventListener('click', () => {
            const shortUrl = document.getElementById('shortUrlDisplay').value;
            navigator.clipboard.writeText(shortUrl).then(() => {
                this.showNotification('縮短網址已複製到剪貼簿！', 'success');
            });
        });
        
        // Enter鍵縮短
        document.getElementById('originalUrl').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('shortenUrlBtn').click();
            }
        });
        
        // 清理函數
        document.getElementById('urlShortenerModal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('urlShortenerModal').remove();
        });
        
        ModalManager.showModal(document.getElementById('urlShortenerModal'));
    }

    openDateTimeConverter() {
        const modalContent = `
            <div class="modal fade" id="dateTimeModal" tabindex="-1" aria-labelledby="dateTimeModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="dateTimeModalLabel">
                                <i class="fas fa-clock me-2"></i>時間轉換器
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-3">
                                <div class="col-md-8">
                                    <label for="dateTimeInput" class="form-label">日期時間輸入</label>
                                    <input type="text" class="form-control" id="dateTimeInput" placeholder="例如: 2024-01-01, now, 1704067200">
                                </div>
                                <div class="col-md-4">
                                    <label for="inputType" class="form-label">輸入類型</label>
                                    <select class="form-select" id="inputType">
                                        <option value="auto">自動偵測</option>
                                        <option value="date">日期字串</option>
                                        <option value="unix">Unix 時間戳</option>
                                        <option value="millis">毫秒時間戳</option>
                                        <option value="now">當前時間</option>
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3">
                                <button type="button" class="btn btn-primary" id="convertDateTimeBtn">
                                    <i class="fas fa-exchange-alt me-2"></i>轉換時間
                                </button>
                                <button type="button" class="btn btn-secondary ms-2" id="useCurrentTimeBtn">
                                    <i class="fas fa-clock me-2"></i>使用當前時間
                                </button>
                            </div>
                            <div id="dateTimeResult" class="mt-3" style="display:none;">
                                <h6>轉換結果：</h6>
                                <div class="table-responsive">
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th width="30%">格式</th>
                                                <th width="60%">值</th>
                                                <th width="10%">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><strong>完整日期時間</strong></td>
                                                <td id="fullDateTime" class="text-break"></td>
                                                <td><button class="btn btn-sm btn-outline-secondary" onclick="navigator.clipboard.writeText(document.getElementById('fullDateTime').textContent)"><i class="fas fa-copy"></i></button></td>
                                            </tr>
                                            <tr>
                                                <td><strong>ISO 8601</strong></td>
                                                <td id="isoDateTime" class="text-break"></td>
                                                <td><button class="btn btn-sm btn-outline-secondary" onclick="navigator.clipboard.writeText(document.getElementById('isoDateTime').textContent)"><i class="fas fa-copy"></i></button></td>
                                            </tr>
                                            <tr>
                                                <td><strong>Unix 時間戳</strong></td>
                                                <td id="unixTimestamp" class="text-break"></td>
                                                <td><button class="btn btn-sm btn-outline-secondary" onclick="navigator.clipboard.writeText(document.getElementById('unixTimestamp').textContent)"><i class="fas fa-copy"></i></button></td>
                                            </tr>
                                            <tr>
                                                <td><strong>毫秒時間戳</strong></td>
                                                <td id="millisTimestamp" class="text-break"></td>
                                                <td><button class="btn btn-sm btn-outline-secondary" onclick="navigator.clipboard.writeText(document.getElementById('millisTimestamp').textContent)"><i class="fas fa-copy"></i></button></td>
                                            </tr>
                                            <tr>
                                                <td><strong>本地時間</strong></td>
                                                <td id="localDateTime" class="text-break"></td>
                                                <td><button class="btn btn-sm btn-outline-secondary" onclick="navigator.clipboard.writeText(document.getElementById('localDateTime').textContent)"><i class="fas fa-copy"></i></button></td>
                                            </tr>
                                            <tr>
                                                <td><strong>UTC 時間</strong></td>
                                                <td id="utcDateTime" class="text-break"></td>
                                                <td><button class="btn btn-sm btn-outline-secondary" onclick="navigator.clipboard.writeText(document.getElementById('utcDateTime').textContent)"><i class="fas fa-copy"></i></button></td>
                                            </tr>
                                            <tr>
                                                <td><strong>相對時間</strong></td>
                                                <td id="relativeTime" class="text-break"></td>
                                                <td><button class="btn btn-sm btn-outline-secondary" onclick="navigator.clipboard.writeText(document.getElementById('relativeTime').textContent)"><i class="fas fa-copy"></i></button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="mt-3">
                                <small class="text-muted">
                                    <i class="fas fa-info-circle me-1"></i>
                                    支援格式：日期字串 (2024-01-01)、Unix時間戳 (1704067200)、毫秒時間戳、或輸入 "now" 使用當前時間
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalContent);
        
        // 時間轉換功能
        const convertDateTime = (input, type = 'auto') => {
            try {
                let date;
                
                if (type === 'now' || input.toLowerCase() === 'now') {
                    date = new Date();
                } else if (type === 'unix' || (!isNaN(input) && input.toString().length === 10)) {
                    date = new Date(parseInt(input) * 1000);
                } else if (type === 'millis' || (!isNaN(input) && input.toString().length === 13)) {
                    date = new Date(parseInt(input));
                } else {
                    date = new Date(input);
                }
                
                if (isNaN(date.getTime())) {
                    throw new Error('無效的日期時間格式');
                }
                
                // 計算相對時間
                const now = new Date();
                const diffMs = now.getTime() - date.getTime();
                const diffSecs = Math.floor(diffMs / 1000);
                const diffMins = Math.floor(diffSecs / 60);
                const diffHours = Math.floor(diffMins / 60);
                const diffDays = Math.floor(diffHours / 24);
                
                let relativeTimeText;
                if (Math.abs(diffDays) > 0) {
                    relativeTimeText = diffDays > 0 ? `${diffDays} 天前` : `${Math.abs(diffDays)} 天後`;
                } else if (Math.abs(diffHours) > 0) {
                    relativeTimeText = diffHours > 0 ? `${diffHours} 小時前` : `${Math.abs(diffHours)} 小時後`;
                } else if (Math.abs(diffMins) > 0) {
                    relativeTimeText = diffMins > 0 ? `${diffMins} 分鐘前` : `${Math.abs(diffMins)} 分鐘後`;
                } else {
                    relativeTimeText = '剛剛';
                }
                
                // 更新結果
                document.getElementById('fullDateTime').textContent = date.toString();
                document.getElementById('isoDateTime').textContent = date.toISOString();
                document.getElementById('unixTimestamp').textContent = Math.floor(date.getTime() / 1000);
                document.getElementById('millisTimestamp').textContent = date.getTime();
                document.getElementById('localDateTime').textContent = date.toLocaleString();
                document.getElementById('utcDateTime').textContent = date.toUTCString();
                document.getElementById('relativeTime').textContent = relativeTimeText;
                
                document.getElementById('dateTimeResult').style.display = 'block';
                
                return true;
            } catch (error) {
                return false;
            }
        };
        
        // 轉換按鈕事件
        document.getElementById('convertDateTimeBtn').addEventListener('click', () => {
            const input = document.getElementById('dateTimeInput').value.trim();
            const type = document.getElementById('inputType').value;
            
            if (!input && type !== 'now') {
                this.showNotification('請輸入日期時間', 'error');
                return;
            }
            
            if (convertDateTime(input, type)) {
                this.showNotification('時間轉換成功！', 'success');
            } else {
                this.showNotification('時間轉換失敗：請檢查輸入格式', 'error');
            }
        });
        
        // 使用當前時間按鈕
        document.getElementById('useCurrentTimeBtn').addEventListener('click', () => {
            document.getElementById('dateTimeInput').value = 'now';
            document.getElementById('inputType').value = 'now';
            convertDateTime('now', 'now');
        });
        
        // 輸入類型改變事件
        document.getElementById('inputType').addEventListener('change', (e) => {
            const type = e.target.value;
            const input = document.getElementById('dateTimeInput');
            
            switch (type) {
                case 'now':
                    input.placeholder = '將使用當前時間';
                    input.value = 'now';
                    break;
                case 'unix':
                    input.placeholder = '例如: 1704067200';
                    break;
                case 'millis':
                    input.placeholder = '例如: 1704067200000';
                    break;
                case 'date':
                    input.placeholder = '例如: 2024-01-01 12:00:00';
                    break;
                default:
                    input.placeholder = '例如: 2024-01-01, now, 1704067200';
            }
        });
        
        // Enter鍵轉換
        document.getElementById('dateTimeInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('convertDateTimeBtn').click();
            }
        });
        
        // 清理函數
        document.getElementById('dateTimeModal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('dateTimeModal').remove();
        });
        
        ModalManager.showModal(document.getElementById('dateTimeModal'));
    }

    openColorPicker() {
        const modalContent = `
            <div class="modal fade" id="colorPickerModal" tabindex="-1" aria-labelledby="colorPickerModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="colorPickerModalLabel">
                                <i class="fas fa-palette me-2"></i>顏色轉換器
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="colorInput" class="form-label">顏色輸入</label>
                                <input type="text" class="form-control" id="colorInput" placeholder="例如: #FF0000, red, rgb(255,0,0)">
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="colorPicker" class="form-label">或選擇顏色</label>
                                    <input type="color" class="form-control form-control-color" id="colorPicker" value="#ff0000">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">顏色預覽</label>
                                    <div id="colorPreview" style="height: 38px; border: 1px solid #ced4da; border-radius: 0.375rem; background-color: #ff0000;"></div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <button type="button" class="btn btn-primary" id="convertColorBtn">
                                    <i class="fas fa-exchange-alt me-2"></i>轉換顏色
                                </button>
                            </div>
                            <div id="colorResult" class="mt-3" style="display:none;">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">HEX:</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="hexValue" readonly>
                                            <button class="btn btn-outline-secondary" onclick="navigator.clipboard.writeText(document.getElementById('hexValue').value)">
                                                <i class="fas fa-copy"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">RGB:</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="rgbValue" readonly>
                                            <button class="btn btn-outline-secondary" onclick="navigator.clipboard.writeText(document.getElementById('rgbValue').value)">
                                                <i class="fas fa-copy"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">HSL:</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="hslValue" readonly>
                                            <button class="btn btn-outline-secondary" onclick="navigator.clipboard.writeText(document.getElementById('hslValue').value)">
                                                <i class="fas fa-copy"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">HSV:</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="hsvValue" readonly>
                                            <button class="btn btn-outline-secondary" onclick="navigator.clipboard.writeText(document.getElementById('hsvValue').value)">
                                                <i class="fas fa-copy"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalContent);
        
        // 顏色轉換功能
        const convertColor = (color) => {
            try {
                // 創建臨時canvas來解析顏色
                const canvas = document.createElement('canvas');
                canvas.width = canvas.height = 1;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, 1, 1);
                const imageData = ctx.getImageData(0, 0, 1, 1);
                const [r, g, b] = imageData.data;
                
                // 更新預覽
                document.getElementById('colorPreview').style.backgroundColor = color;
                
                // HEX
                const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
                
                // RGB
                const rgb = `rgb(${r}, ${g}, ${b})`;
                
                // HSL
                const hsl = rgbToHsl(r, g, b);
                const hslString = `hsl(${Math.round(hsl[0] * 360)}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%)`;
                
                // HSV
                const hsv = rgbToHsv(r, g, b);
                const hsvString = `hsv(${Math.round(hsv[0] * 360)}, ${Math.round(hsv[1] * 100)}%, ${Math.round(hsv[2] * 100)}%)`;
                
                // 更新結果
                document.getElementById('hexValue').value = hex;
                document.getElementById('rgbValue').value = rgb;
                document.getElementById('hslValue').value = hslString;
                document.getElementById('hsvValue').value = hsvString;
                document.getElementById('colorResult').style.display = 'block';
                
                return true;
            } catch (error) {
                return false;
            }
        };
        
        // RGB to HSL conversion
        function rgbToHsl(r, g, b) {
            r /= 255; g /= 255; b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            
            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return [h, s, l];
        }
        
        // RGB to HSV conversion
        function rgbToHsv(r, g, b) {
            r /= 255; g /= 255; b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, v = max;
            const d = max - min;
            s = max === 0 ? 0 : d / max;
            
            if (max === min) {
                h = 0;
            } else {
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return [h, s, v];
        }
        
        // 轉換按鈕事件
        document.getElementById('convertColorBtn').addEventListener('click', () => {
            const colorInput = document.getElementById('colorInput').value.trim();
            if (!colorInput) {
                this.showNotification('請輸入顏色值', 'error');
                return;
            }
            
            if (convertColor(colorInput)) {
                this.showNotification('顏色轉換成功！', 'success');
            } else {
                this.showNotification('無效的顏色格式', 'error');
            }
        });
        
        // 顏色選擇器事件
        document.getElementById('colorPicker').addEventListener('change', (e) => {
            const color = e.target.value;
            document.getElementById('colorInput').value = color;
            convertColor(color);
        });
        
        // 清理函數
        document.getElementById('colorPickerModal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('colorPickerModal').remove();
        });
        
        ModalManager.showModal(document.getElementById('colorPickerModal'));
    }

    // 添加缺失的函數來修復錯誤
    handleResize() {
        // 響應式處理函數
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (window.innerWidth < 768) {
            // 移動設備處理
            if (sidebar) {
                sidebar.classList.add('sidebar-mobile');
            }
        } else {
            // 桌面設備處理
            if (sidebar) {
                sidebar.classList.remove('sidebar-mobile');
            }
        }
    }

    handleFileSelect(event) {
        // 檔案選擇處理函數
        const files = event.target.files;
        if (files && files.length > 0) {
            for (let file of files) {
                this.processFile(file);
            }
        }
    }

    processFile(file) {
        // 處理上傳的檔案
        console.log('Processing file:', file.name);
        // 這裡可以添加檔案處理邏輯
    }
}

// 初始化應用程式
document.addEventListener('DOMContentLoaded', () => {
    window.aiAssistant = new EnhancedAIAssistant();
});

// 確保在 DOM 載入完成後初始化
// 手機響應式功能
function setupMobileFeatures() {
    // 漢堡選單切換
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
        
        // 點擊側邊欄外部時關閉
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    sidebar.classList.remove('show');
                }
            }
        });
        
        // 側邊欄項目點擊後關閉（手機版）
        const navLinks = sidebar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('show');
                }
            });
        });
    }
    
    // 觸控優化
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
    
    // 螢幕方向變化處理
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            if (sidebar && sidebar.classList.contains('show') && window.innerWidth > 768) {
                sidebar.classList.remove('show');
            }
        }, 100);
    });
    
    // 視窗大小變化處理
    window.addEventListener('resize', () => {
        if (sidebar && sidebar.classList.contains('show') && window.innerWidth > 768) {
            sidebar.classList.remove('show');
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // 設定手機功能
        setupMobileFeatures();
        
        if (!window.aiAssistant) {
            window.aiAssistant = new EnhancedAIAssistant();
        }
    });
} else {
    // 設定手機功能
    setupMobileFeatures();
    
    if (!window.aiAssistant) {
        window.aiAssistant = new EnhancedAIAssistant();
    }
}

// 全域複製程式碼函數
function copyCodeToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('找不到程式碼元素:', elementId);
        return;
    }
    
    // 獲取純文字內容
    const codeText = element.textContent || element.innerText;
    
    // 使用現代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(codeText).then(() => {
            showCopyFeedback(elementId);
        }).catch(err => {
            console.error('複製失敗:', err);
            fallbackCopy(codeText, elementId);
        });
    } else {
        // 舊版瀏覽器的備案方法
        fallbackCopy(codeText, elementId);
    }
}

// 備案複製方法
function fallbackCopy(text, elementId) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback(elementId);
    } catch (err) {
        console.error('複製失敗:', err);
        alert('複製失敗，請手動選取文字複製');
    } finally {
        document.body.removeChild(textArea);
    }
}

// 顯示複製成功回饋
function showCopyFeedback(elementId) {
    // 找到對應的複製按鈕
    const button = document.querySelector(`[onclick*="${elementId}"]`);
    if (button) {
        const originalText = button.innerHTML;
        const originalClass = button.className;
        
        // 顯示成功狀態
        button.innerHTML = '<i class="fas fa-check me-1"></i>已複製';
        button.className = button.className.replace('btn-outline-light', 'btn-success').replace('btn-link', 'btn-success');
        
        // 2秒後恢復原狀
        setTimeout(() => {
            button.innerHTML = originalText;
            button.className = originalClass;
        }, 2000);
    }
    
    console.log('程式碼已複製到剪貼簿');
}