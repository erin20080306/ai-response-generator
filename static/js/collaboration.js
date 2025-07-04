/**
 * 協作功能模組
 * 支援多人即時對話和檔案分享
 */
class CollaborationManager {
    constructor(app) {
        this.app = app;
        this.socket = null;
        this.currentRoom = null;
        this.isConnected = false;
        this.participants = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadRoomHistory();
    }

    setupEventListeners() {
        // 創建房間
        document.getElementById('createRoomBtn')?.addEventListener('click', () => {
            this.createRoom();
        });

        // 加入房間
        document.getElementById('joinRoomBtn')?.addEventListener('click', () => {
            this.joinRoom();
        });

        // 離開房間
        document.getElementById('leaveRoomBtn')?.addEventListener('click', () => {
            this.leaveRoom();
        });

        // 房間消息發送
        document.getElementById('roomMessageInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendRoomMessage();
            }
        });

        document.getElementById('sendRoomMessageBtn')?.addEventListener('click', () => {
            this.sendRoomMessage();
        });
    }

    async createRoom() {
        const roomName = document.getElementById('roomName').value.trim();
        const maxParticipants = document.getElementById('maxParticipants').value;

        if (!roomName) {
            this.app.showNotification('請輸入房間名稱', 'warning');
            return;
        }

        try {
            const response = await fetch('/api/collaboration/create_room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: roomName,
                    max_participants: parseInt(maxParticipants)
                })
            });

            const data = await response.json();

            if (data.success) {
                this.app.showNotification(`房間創建成功！房間代碼：${data.room_code}`, 'success');
                this.joinRoomByCode(data.room_code);
                this.addToRoomHistory(data);
            } else {
                this.app.showNotification(data.error || '創建房間失敗', 'error');
            }

        } catch (error) {
            console.error('創建房間錯誤:', error);
            this.app.showNotification('創建房間時發生錯誤', 'error');
        }
    }

    async joinRoom() {
        const roomCode = document.getElementById('roomCode').value.trim();

        if (!roomCode) {
            this.app.showNotification('請輸入房間代碼', 'warning');
            return;
        }

        try {
            await this.joinRoomByCode(roomCode);
        } catch (error) {
            console.error('加入房間錯誤:', error);
            this.app.showNotification('加入房間時發生錯誤', 'error');
        }
    }

    async joinRoomByCode(roomCode) {
        try {
            const response = await fetch('/api/collaboration/join_room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    room_code: roomCode,
                    username: this.getUserName()
                })
            });

            const data = await response.json();

            if (data.success) {
                this.currentRoom = data.room;
                this.connectToRoom(roomCode);
                this.showRoomInterface();
                this.app.showNotification(`成功加入房間：${data.room.name}`, 'success');
            } else {
                this.app.showNotification(data.error || '加入房間失敗', 'error');
            }

        } catch (error) {
            console.error('加入房間錯誤:', error);
            this.app.showNotification('加入房間時發生錯誤', 'error');
        }
    }

    connectToRoom(roomCode) {
        // 模擬 WebSocket 連接（實際環境中需要 Socket.IO）
        this.isConnected = true;
        
        // 模擬參與者列表
        this.participants = [
            { id: 1, username: this.getUserName(), isActive: true },
            { id: 2, username: '示例用戶1', isActive: true },
            { id: 3, username: '示例用戶2', isActive: false }
        ];
        
        this.updateParticipantsList();
        this.addSystemMessage(`已連接到房間：${roomCode}`);
    }

    leaveRoom() {
        if (this.currentRoom) {
            this.isConnected = false;
            this.currentRoom = null;
            this.participants = [];
            this.hideRoomInterface();
            this.app.showNotification('已離開房間', 'info');
        }
    }

    sendRoomMessage() {
        const messageInput = document.getElementById('roomMessageInput');
        const message = messageInput.value.trim();

        if (!message || !this.isConnected) {
            return;
        }

        // 添加消息到聊天區域
        this.addChatMessage({
            username: this.getUserName(),
            message: message,
            timestamp: new Date().toLocaleTimeString(),
            isOwn: true
        });

        // 模擬其他用戶回應
        setTimeout(() => {
            this.addChatMessage({
                username: '示例用戶1',
                message: `回覆：${message}`,
                timestamp: new Date().toLocaleTimeString(),
                isOwn: false
            });
        }, 1000);

        messageInput.value = '';
    }

    showRoomInterface() {
        const roomInterface = document.getElementById('roomInterface');
        const roomControls = document.getElementById('roomControls');
        
        if (roomInterface) {
            roomInterface.style.display = 'block';
        }
        if (roomControls) {
            roomControls.style.display = 'none';
        }

        // 顯示房間資訊
        if (this.currentRoom) {
            document.getElementById('currentRoomName').textContent = this.currentRoom.name;
            document.getElementById('currentRoomCode').textContent = this.currentRoom.room_code;
        }
    }

    hideRoomInterface() {
        const roomInterface = document.getElementById('roomInterface');
        const roomControls = document.getElementById('roomControls');
        
        if (roomInterface) {
            roomInterface.style.display = 'none';
        }
        if (roomControls) {
            roomControls.style.display = 'block';
        }

        // 清空聊天記錄
        const chatMessages = document.getElementById('roomChatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
    }

    addChatMessage(messageData) {
        const chatMessages = document.getElementById('roomChatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${messageData.isOwn ? 'own' : 'other'}`;
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <strong>${messageData.username}</strong>
                <small class="text-muted">${messageData.timestamp}</small>
            </div>
            <div class="message-content">${this.escapeHtml(messageData.message)}</div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    addSystemMessage(message) {
        const chatMessages = document.getElementById('roomChatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message system';
        messageDiv.innerHTML = `
            <div class="message-content text-center">
                <small class="text-muted"><i class="fas fa-info-circle me-1"></i>${message}</small>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    updateParticipantsList() {
        const participantsList = document.getElementById('roomParticipantsList');
        if (!participantsList) return;

        participantsList.innerHTML = this.participants.map(participant => `
            <div class="participant-item ${participant.isActive ? 'active' : 'inactive'}">
                <i class="fas fa-circle me-2 ${participant.isActive ? 'text-success' : 'text-muted'}"></i>
                ${participant.username}
                ${participant.isActive ? '<span class="badge bg-success ms-2">在線</span>' : '<span class="badge bg-secondary ms-2">離線</span>'}
            </div>
        `).join('');
    }

    getUserName() {
        return localStorage.getItem('collaborationUsername') || '匿名用戶';
    }

    addToRoomHistory(roomData) {
        let history = JSON.parse(localStorage.getItem('roomHistory') || '[]');
        
        // 避免重複
        history = history.filter(room => room.room_code !== roomData.room_code);
        
        history.unshift({
            ...roomData,
            joined_at: new Date().toISOString()
        });

        // 限制歷史記錄數量
        if (history.length > 10) {
            history = history.slice(0, 10);
        }

        localStorage.setItem('roomHistory', JSON.stringify(history));
        this.displayRoomHistory();
    }

    loadRoomHistory() {
        this.displayRoomHistory();
    }

    displayRoomHistory() {
        const historyContainer = document.getElementById('roomHistory');
        if (!historyContainer) return;

        const history = JSON.parse(localStorage.getItem('roomHistory') || '[]');

        if (history.length === 0) {
            historyContainer.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-history fa-2x mb-2"></i>
                    <p>尚未加入任何房間</p>
                </div>
            `;
            return;
        }

        historyContainer.innerHTML = history.map(room => `
            <div class="room-history-item">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${room.name}</strong>
                        <br><small class="text-muted">代碼：${room.room_code}</small>
                        <br><small class="text-muted">時間：${new Date(room.joined_at).toLocaleString()}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-primary" onclick="collaborationManager.joinRoomByCode('${room.room_code}')">
                        <i class="fas fa-sign-in-alt"></i> 重新加入
                    </button>
                </div>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 初始化協作管理器
let collaborationManager;

document.addEventListener('DOMContentLoaded', () => {
    // 等待主應用載入後初始化
    setTimeout(() => {
        if (window.aiAssistant) {
            collaborationManager = new CollaborationManager(window.aiAssistant);
        }
    }, 1000);
});