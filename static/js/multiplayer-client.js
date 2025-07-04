/**
 * 多人遊戲Socket.IO客戶端
 * 支援即時多人農場物語遊戲
 */

class MultiplayerClient {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.currentRoom = null;
        this.userId = null;
        this.serverUrl = 'http://localhost:3000'; // Node.js服務器地址
        this.players = new Map();
    }

    // 初始化連接
    async connect(userId, authToken) {
        try {
            this.userId = userId;
            
            this.socket = io(this.serverUrl, {
                auth: {
                    token: authToken,
                    userId: userId
                },
                transports: ['websocket', 'polling']
            });

            this.setupEventListeners();
            
            return new Promise((resolve, reject) => {
                this.socket.on('connect', () => {
                    console.log('已連接到多人遊戲服務器');
                    this.isConnected = true;
                    resolve(true);
                });

                this.socket.on('connect_error', (error) => {
                    console.error('連接失敗:', error);
                    reject(error);
                });

                setTimeout(() => {
                    if (!this.isConnected) {
                        reject(new Error('連接超時'));
                    }
                }, 5000);
            });

        } catch (error) {
            console.error('初始化連接失敗:', error);
            throw error;
        }
    }

    // 設置事件監聽器
    setupEventListeners() {
        // 房間相關事件
        this.socket.on('room-joined', (data) => {
            this.currentRoom = data.room;
            this.onRoomJoined(data.room);
        });

        this.socket.on('player-joined', (data) => {
            this.onPlayerJoined(data);
        });

        this.socket.on('player-left', (data) => {
            this.onPlayerLeft(data);
        });

        // 遊戲同步事件
        this.socket.on('player-moved', (data) => {
            this.onPlayerMoved(data);
        });

        this.socket.on('game-action-broadcast', (data) => {
            this.onGameAction(data);
        });

        this.socket.on('canvas-effect-sync', (data) => {
            this.onCanvasEffect(data);
        });

        // 遊戲狀態同步
        this.socket.on('game-state-sync', (data) => {
            this.onGameStateSync(data);
        });

        // 錯誤處理
        this.socket.on('error', (error) => {
            console.error('Socket錯誤:', error);
            this.onError(error);
        });

        this.socket.on('disconnect', () => {
            console.log('與服務器斷開連接');
            this.isConnected = false;
            this.onDisconnect();
        });
    }

    // 創建房間
    async createRoom(roomData) {
        if (!this.isConnected) {
            throw new Error('未連接到服務器');
        }

        return new Promise((resolve, reject) => {
            this.socket.emit('create-room', roomData, (response) => {
                if (response.success) {
                    resolve(response.room);
                } else {
                    reject(new Error(response.error));
                }
            });
        });
    }

    // 加入房間
    async joinRoom(roomId, password = null) {
        if (!this.isConnected) {
            throw new Error('未連接到服務器');
        }

        return new Promise((resolve, reject) => {
            this.socket.emit('join-room', {
                roomId,
                userId: this.userId,
                password
            }, (response) => {
                if (response.success) {
                    resolve(response.room);
                } else {
                    reject(new Error(response.error));
                }
            });
        });
    }

    // 離開房間
    leaveRoom() {
        if (this.socket && this.currentRoom) {
            this.socket.emit('leave-room', {
                roomId: this.currentRoom.roomId,
                userId: this.userId
            });
            this.currentRoom = null;
        }
    }

    // 同步玩家移動
    sendPlayerMove(x, y) {
        if (this.socket && this.currentRoom) {
            this.socket.emit('player-move', {
                roomId: this.currentRoom.roomId,
                userId: this.userId,
                x,
                y
            });
        }
    }

    // 同步遊戲動作
    sendGameAction(actionType, actionData) {
        if (this.socket && this.currentRoom) {
            this.socket.emit('game-action', {
                roomId: this.currentRoom.roomId,
                userId: this.userId,
                actionType,
                actionData,
                timestamp: Date.now()
            });
        }
    }

    // 同步Canvas特效
    sendCanvasEffect(effectType, effectData) {
        if (this.socket && this.currentRoom) {
            this.socket.emit('canvas-effect', {
                roomId: this.currentRoom.roomId,
                userId: this.userId,
                effectType,
                effectData,
                timestamp: Date.now()
            });
        }
    }

    // 同步遊戲狀態
    sendGameState(gameState) {
        if (this.socket && this.currentRoom) {
            this.socket.emit('game-state-update', {
                roomId: this.currentRoom.roomId,
                userId: this.userId,
                gameState
            });
        }
    }

    // 事件回調函數（可被覆蓋）
    onRoomJoined(room) {
        console.log('成功加入房間:', room);
        this.updateRoomUI(room);
    }

    onPlayerJoined(data) {
        console.log('玩家加入:', data);
        this.addPlayerToGame(data);
    }

    onPlayerLeft(data) {
        console.log('玩家離開:', data);
        this.removePlayerFromGame(data);
    }

    onPlayerMoved(data) {
        this.updatePlayerPosition(data.userId, data.x, data.y);
    }

    onGameAction(data) {
        this.executeGameAction(data);
    }

    onCanvasEffect(data) {
        this.playCanvasEffect(data);
    }

    onGameStateSync(data) {
        this.syncGameState(data);
    }

    onError(error) {
        this.showErrorMessage(error);
    }

    onDisconnect() {
        this.showDisconnectMessage();
    }

    // UI更新方法
    updateRoomUI(room) {
        const roomInfo = document.getElementById('currentRoomInfo');
        if (roomInfo) {
            roomInfo.innerHTML = `
                <div class="room-details">
                    <h6>${room.name}</h6>
                    <p>房間ID: ${room.roomId}</p>
                    <p>玩家數量: ${room.players.length}/${room.maxPlayers}</p>
                    <p>房主: ${room.owner}</p>
                </div>
            `;
        }

        // 顯示房間卡片
        const roomCard = document.getElementById('currentRoomCard');
        if (roomCard) {
            roomCard.style.display = 'block';
        }
    }

    addPlayerToGame(playerData) {
        this.players.set(playerData.userId, playerData);
        
        // 在遊戲世界中添加玩家角色
        if (window.farmGameState) {
            const gameWorld = document.querySelector('.professional-game-world');
            if (gameWorld) {
                const playerElement = this.createPlayerElement(playerData);
                gameWorld.appendChild(playerElement);
            }
        }
    }

    removePlayerFromGame(playerData) {
        this.players.delete(playerData.userId);
        
        // 從遊戲世界中移除玩家角色
        const playerElement = document.getElementById(`player-${playerData.userId}`);
        if (playerElement) {
            playerElement.remove();
        }
    }

    createPlayerElement(playerData) {
        const playerDiv = document.createElement('div');
        playerDiv.id = `player-${playerData.userId}`;
        playerDiv.className = 'multiplayer-player';
        playerDiv.style.cssText = `
            position: absolute;
            left: ${playerData.x || 300}px;
            top: ${playerData.y || 250}px;
            width: 50px;
            height: 60px;
            z-index: 20;
            transition: all 0.3s ease;
        `;

        playerDiv.innerHTML = `
            <div style="
                font-size: 36px;
                text-align: center;
                line-height: 45px;
                filter: drop-shadow(2px 2px 6px rgba(0,0,0,0.4));
                animation: playerIdle 2s infinite ease-in-out;
            ">🧑‍🌾</div>
            <div style="
                position: absolute;
                bottom: -5px;
                left: 50%;
                transform: translateX(-50%);
                width: 30px;
                height: 10px;
                background: radial-gradient(ellipse, rgba(0,0,0,0.3), transparent);
                border-radius: 50%;
            "></div>
            <div style="
                position: absolute;
                top: -20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 2px 6px;
                border-radius: 8px;
                font-size: 10px;
                font-weight: bold;
                white-space: nowrap;
            ">${playerData.username || '玩家'}</div>
        `;

        return playerDiv;
    }

    updatePlayerPosition(userId, x, y) {
        const playerElement = document.getElementById(`player-${userId}`);
        if (playerElement) {
            playerElement.style.left = x + 'px';
            playerElement.style.top = y + 'px';
        }
    }

    executeGameAction(data) {
        console.log('執行遊戲動作:', data);
        
        // 根據動作類型執行相應操作
        switch (data.actionType) {
            case 'farm':
                this.showActionEffect(data.actionData.x, data.actionData.y, '🌱');
                break;
            case 'water':
                this.showActionEffect(data.actionData.x, data.actionData.y, '💧');
                break;
            case 'harvest':
                this.showActionEffect(data.actionData.x, data.actionData.y, '✨');
                break;
        }
    }

    playCanvasEffect(data) {
        if (window.canvasEffects) {
            switch (data.effectType) {
                case 'tool':
                    window.canvasEffects.createToolEffect(
                        data.effectData.x, 
                        data.effectData.y, 
                        data.effectData.toolType
                    );
                    break;
                case 'harvest':
                    window.canvasEffects.createHarvestEffect(
                        data.effectData.x, 
                        data.effectData.y, 
                        data.effectData.itemType
                    );
                    break;
                case 'levelup':
                    window.canvasEffects.createLevelUpEffect(
                        data.effectData.x, 
                        data.effectData.y
                    );
                    break;
            }
        }
    }

    showActionEffect(x, y, emoji) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: 24px;
            pointer-events: none;
            z-index: 100;
            animation: actionEffect 1s ease-out forwards;
        `;
        effect.textContent = emoji;

        const gameWorld = document.querySelector('.professional-game-world');
        if (gameWorld) {
            gameWorld.appendChild(effect);
            setTimeout(() => effect.remove(), 1000);
        }
    }

    syncGameState(data) {
        // 同步遊戲狀態但不覆蓋本地玩家數據
        if (data.userId !== this.userId && window.farmGameState) {
            // 更新其他玩家的狀態
            console.log('同步遊戲狀態:', data);
        }
    }

    showErrorMessage(error) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.textContent = `多人遊戲錯誤: ${error}`;
        
        const container = document.querySelector('.container-fluid');
        if (container) {
            container.insertBefore(errorDiv, container.firstChild);
            setTimeout(() => errorDiv.remove(), 5000);
        }
    }

    showDisconnectMessage() {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'alert alert-warning';
        warningDiv.textContent = '與多人遊戲服務器斷開連接，嘗試重新連接...';
        
        const container = document.querySelector('.container-fluid');
        if (container) {
            container.insertBefore(warningDiv, container.firstChild);
        }
    }

    // 斷開連接
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            this.currentRoom = null;
        }
    }
}

// 全域多人遊戲客戶端實例
window.multiplayerClient = new MultiplayerClient();

// CSS動畫
const style = document.createElement('style');
style.textContent = `
@keyframes actionEffect {
    0% { transform: scale(1) translateY(0); opacity: 1; }
    100% { transform: scale(1.5) translateY(-30px); opacity: 0; }
}

.multiplayer-player {
    transition: all 0.3s ease;
}

.multiplayer-player:hover {
    transform: scale(1.1);
    filter: brightness(1.2);
}
`;
document.head.appendChild(style);