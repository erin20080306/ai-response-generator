/**
 * 語音處理模組
 * 支援語音輸入和語音輸出功能
 */
class VoiceHandler {
    constructor(app) {
        this.app = app;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isSupported = this.checkSupport();
        
        this.init();
    }

    checkSupport() {
        return !!(window.SpeechRecognition || window.webkitSpeechRecognition) && 
               !!window.speechSynthesis;
    }

    init() {
        if (!this.isSupported) {
            console.warn('此瀏覽器不支援語音功能');
            return;
        }

        this.setupSpeechRecognition();
        this.setupEventListeners();
    }

    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) return;

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = this.app.settings.voiceLanguage || 'zh-TW';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateVoiceUI(true);
            this.app.showNotification('語音輸入開始...', 'info');
        };

        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            const messageInput = document.getElementById('messageInput');
            if (messageInput) {
                if (finalTranscript) {
                    messageInput.value = finalTranscript;
                    this.app.updateInputHeight();
                } else if (interimTranscript) {
                    const statusElement = document.getElementById('inputStatus');
                    if (statusElement) {
                        statusElement.textContent = `識別中: ${interimTranscript}`;
                    }
                }
            }
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateVoiceUI(false);
            
            const statusElement = document.getElementById('inputStatus');
            if (statusElement) {
                statusElement.textContent = '';
            }
        };

        this.recognition.onerror = (event) => {
            this.isListening = false;
            this.updateVoiceUI(false);
            
            let errorMessage = '語音識別錯誤';
            switch (event.error) {
                case 'no-speech':
                    errorMessage = '沒有檢測到語音';
                    break;
                case 'audio-capture':
                    errorMessage = '無法存取麥克風';
                    break;
                case 'not-allowed':
                    errorMessage = '語音輸入權限被拒絕';
                    break;
                case 'network':
                    errorMessage = '網路錯誤';
                    break;
            }
            
            this.app.showNotification(errorMessage, 'error');
        };
    }

    setupEventListeners() {
        const voiceInputBtn = document.getElementById('voiceInputBtn');
        if (voiceInputBtn) {
            voiceInputBtn.addEventListener('click', () => this.toggleVoiceInput());
        }

        // 長按語音按鈕功能
        let pressTimer;
        if (voiceInputBtn) {
            voiceInputBtn.addEventListener('mousedown', () => {
                pressTimer = setTimeout(() => this.startListening(), 500);
            });

            voiceInputBtn.addEventListener('mouseup', () => {
                clearTimeout(pressTimer);
                if (this.isListening) {
                    this.stopListening();
                }
            });

            voiceInputBtn.addEventListener('mouseleave', () => {
                clearTimeout(pressTimer);
            });
        }
    }

    toggleVoiceInput() {
        if (!this.isSupported) {
            this.app.showNotification('此瀏覽器不支援語音輸入', 'error');
            return;
        }

        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (!this.recognition || this.isListening) return;

        try {
            this.recognition.lang = this.app.settings.voiceLanguage || 'zh-TW';
            this.recognition.start();
        } catch (error) {
            console.error('啟動語音識別失敗:', error);
            this.app.showNotification('啟動語音識別失敗', 'error');
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    speak(text) {
        if (!this.synthesis || !this.app.settings.voiceOutput) return;

        // 停止當前播放
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // 設定語音參數
        utterance.lang = this.app.settings.voiceLanguage || 'zh-TW';
        utterance.rate = this.app.settings.voiceSpeed || 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // 選擇合適的語音
        const voices = this.synthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0])) || voices[0];
        if (voice) {
            utterance.voice = voice;
        }

        utterance.onstart = () => {
            console.log('語音輸出開始');
        };

        utterance.onend = () => {
            console.log('語音輸出結束');
        };

        utterance.onerror = (event) => {
            console.error('語音輸出錯誤:', event.error);
        };

        this.synthesis.speak(utterance);
    }

    stopSpeaking() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
    }

    updateVoiceUI(isListening) {
        const voiceInputBtn = document.getElementById('voiceInputBtn');
        if (voiceInputBtn) {
            const icon = voiceInputBtn.querySelector('i');
            if (icon) {
                if (isListening) {
                    icon.className = 'fas fa-stop text-danger';
                    voiceInputBtn.classList.add('btn-outline-danger');
                    voiceInputBtn.classList.remove('btn-outline-secondary');
                } else {
                    icon.className = 'fas fa-microphone';
                    voiceInputBtn.classList.add('btn-outline-secondary');
                    voiceInputBtn.classList.remove('btn-outline-danger');
                }
            }
        }
    }

    // 語音指令處理
    processVoiceCommand(text) {
        const commands = {
            '清除對話': () => this.app.clearHistory(),
            '新對話': () => this.app.newChat(),
            '發送': () => this.app.sendMessage(),
            '停止語音': () => this.stopSpeaking(),
            '開啟計算機': () => this.app.openCalculator(),
            '開啟設定': () => this.switchToSettings()
        };

        const command = Object.keys(commands).find(cmd => 
            text.toLowerCase().includes(cmd.toLowerCase())
        );

        if (command) {
            commands[command]();
            return true;
        }

        return false;
    }

    switchToSettings() {
        const settingsTab = document.getElementById('settings-tab');
        if (settingsTab) {
            settingsTab.click();
        }
    }

    // 更新語音設定
    updateSettings(settings) {
        if (this.recognition) {
            this.recognition.lang = settings.voiceLanguage || 'zh-TW';
        }
    }

    // 獲取可用語音列表
    getAvailableVoices() {
        if (!this.synthesis) return [];
        
        return this.synthesis.getVoices().map(voice => ({
            name: voice.name,
            lang: voice.lang,
            default: voice.default
        }));
    }

    // 語音合成狀態
    isSpeaking() {
        return this.synthesis && this.synthesis.speaking;
    }

    // 語音識別狀態
    isRecognizing() {
        return this.isListening;
    }
}

// 導出類別
window.VoiceHandler = VoiceHandler;