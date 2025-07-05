// 完整的麻將遊戲實現
class MahjongGame {
    constructor() {
        this.playerHand = [];
        this.discardPile = [];
        this.computerHands = [[], [], []];
        this.playerMelded = [];
        this.computerMelded = [[], [], []];
        this.selectedTile = null;
        this.currentPlayer = 0; // 0=玩家, 1-3=電腦
        this.gameStarted = false;
        this.lastDiscardedTile = null;
        this.lastDiscardedPlayer = null;
        this.waitingForAction = false;
        
        // 創建完整的144張牌
        this.createFullDeck();
        this.shuffleDeck();
    }
    
    createFullDeck() {
        const baseTiles = [
            '1萬', '2萬', '3萬', '4萬', '5萬', '6萬', '7萬', '8萬', '9萬',
            '1筒', '2筒', '3筒', '4筒', '5筒', '6筒', '7筒', '8筒', '9筒',
            '1條', '2條', '3條', '4條', '5條', '6條', '7條', '8條', '9條',
            '東', '南', '西', '北', '中', '發', '白'
        ];
        
        this.deck = [];
        baseTiles.forEach(tile => {
            for (let i = 0; i < 4; i++) {
                this.deck.push(tile);
            }
        });
    }
    
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    
    drawTile() {
        return this.deck.pop();
    }
    
    startGame() {
        this.gameStarted = true;
        
        // 給每個玩家發13張牌
        for (let i = 0; i < 13; i++) {
            this.playerHand.push(this.drawTile());
            for (let j = 0; j < 3; j++) {
                this.computerHands[j].push(this.drawTile());
            }
        }
        
        // 排序玩家手牌
        this.sortPlayerHand();
        this.renderGame();
        
        // 玩家先行
        this.currentPlayer = 0;
        this.playerTurn();
    }
    
    sortPlayerHand() {
        this.playerHand.sort((a, b) => {
            const order = ['萬', '筒', '條', '東', '南', '西', '北', '中', '發', '白'];
            const getOrder = (tile) => {
                for (let i = 0; i < order.length; i++) {
                    if (tile.includes(order[i])) {
                        return i * 10 + (parseInt(tile[0]) || 0);
                    }
                }
                return 999;
            };
            return getOrder(a) - getOrder(b);
        });
    }
    
    playerTurn() {
        if (this.currentPlayer !== 0) return;
        
        // 摸牌
        const newTile = this.drawTile();
        if (newTile) {
            this.playerHand.push(newTile);
            this.sortPlayerHand();
            this.renderGame();
            
            // 檢查是否可以自摸胡牌
            if (this.checkWin(this.playerHand)) {
                this.showActionPrompt(['hu']);
                return;
            }
        }
        
        this.waitingForAction = true;
        console.log('請選擇要打出的牌');
    }
    
    computerTurn(playerIndex) {
        if (playerIndex < 1 || playerIndex > 3) return;
        
        const hand = this.computerHands[playerIndex - 1];
        
        // 摸牌
        const newTile = this.drawTile();
        if (newTile) {
            hand.push(newTile);
        }
        
        // AI打牌邏輯 - 簡單實現
        const discardIndex = Math.floor(Math.random() * hand.length);
        const discardedTile = hand.splice(discardIndex, 1)[0];
        
        this.discardPile.push(discardedTile);
        this.lastDiscardedTile = discardedTile;
        this.lastDiscardedPlayer = playerIndex;
        
        console.log(`電腦${playerIndex}打出：${discardedTile}`);
        
        this.renderGame();
        
        // 檢查玩家是否可以吃碰胡
        this.checkPlayerActions(discardedTile);
    }
    
    checkPlayerActions(discardedTile) {
        const actions = [];
        
        // 檢查胡牌
        if (this.checkWinWithTile(this.playerHand, discardedTile)) {
            actions.push('hu');
        }
        
        // 檢查碰牌
        if (this.checkPong(this.playerHand, discardedTile)) {
            actions.push('pong');
        }
        
        // 檢查吃牌（只能吃上家的牌）
        if (this.lastDiscardedPlayer === 3 && this.checkChi(this.playerHand, discardedTile)) {
            actions.push('chi');
        }
        
        // 檢查槓牌
        if (this.checkKong(this.playerHand, discardedTile)) {
            actions.push('kong');
        }
        
        if (actions.length > 0) {
            this.showActionPrompt(actions);
        } else {
            this.nextPlayer();
        }
    }
    
    checkWin(hand) {
        // 簡化的胡牌檢查 - 檢查是否有7對子或基本胡牌型
        const tileCounts = {};
        hand.forEach(tile => {
            tileCounts[tile] = (tileCounts[tile] || 0) + 1;
        });
        
        // 檢查七對子
        const pairs = Object.values(tileCounts).filter(count => count >= 2).length;
        if (pairs >= 7) return true;
        
        // 檢查基本胡牌型（簡化版）
        const groups = Object.values(tileCounts).filter(count => count >= 3).length;
        const hasPair = Object.values(tileCounts).some(count => count === 2);
        
        return groups >= 4 && hasPair;
    }
    
    checkWinWithTile(hand, tile) {
        const testHand = [...hand, tile];
        return this.checkWin(testHand);
    }
    
    checkPong(hand, tile) {
        const count = hand.filter(t => t === tile).length;
        return count >= 2;
    }
    
    checkChi(hand, tile) {
        // 簡化的吃牌檢查
        if (tile.includes('東') || tile.includes('南') || tile.includes('西') || tile.includes('北') ||
            tile.includes('中') || tile.includes('發') || tile.includes('白')) {
            return false; // 字牌不能吃
        }
        
        const num = parseInt(tile[0]);
        const suit = tile.slice(1);
        
        // 檢查是否有順子
        const hasSequence = (n1, n2) => {
            return hand.some(t => t === `${n1}${suit}`) && hand.some(t => t === `${n2}${suit}`);
        };
        
        return hasSequence(num - 2, num - 1) || 
               hasSequence(num - 1, num + 1) || 
               hasSequence(num + 1, num + 2);
    }
    
    checkKong(hand, tile) {
        const count = hand.filter(t => t === tile).length;
        return count >= 3;
    }
    
    executeAction(action) {
        switch (action) {
            case 'chi':
                this.executeChi();
                break;
            case 'pong':
                this.executePong();
                break;
            case 'kong':
                this.executeKong();
                break;
            case 'hu':
                this.executeHu();
                break;
        }
    }
    
    executeChi() {
        const tile = this.lastDiscardedTile;
        const num = parseInt(tile[0]);
        const suit = tile.slice(1);
        
        // 簡單實現：找到第一個可能的順子
        const sequences = [
            [`${num-2}${suit}`, `${num-1}${suit}`],
            [`${num-1}${suit}`, `${num+1}${suit}`],
            [`${num+1}${suit}`, `${num+2}${suit}`]
        ];
        
        for (let seq of sequences) {
            if (this.playerHand.includes(seq[0]) && this.playerHand.includes(seq[1])) {
                // 移除手牌中的牌
                this.playerHand = this.playerHand.filter(t => t !== seq[0] && t !== seq[1]);
                // 添加到已組合牌
                this.playerMelded.push([seq[0], tile, seq[1]]);
                // 移除桌面上的牌
                this.discardPile.pop();
                break;
            }
        }
        
        this.hideActionPrompt();
        this.renderGame();
        this.waitingForAction = true;
        console.log('吃牌成功，請選擇要打出的牌');
    }
    
    executePong() {
        const tile = this.lastDiscardedTile;
        
        // 從手牌中移除兩張相同的牌
        let removed = 0;
        this.playerHand = this.playerHand.filter(t => {
            if (t === tile && removed < 2) {
                removed++;
                return false;
            }
            return true;
        });
        
        // 添加到已組合牌
        this.playerMelded.push([tile, tile, tile]);
        
        // 移除桌面上的牌
        this.discardPile.pop();
        
        this.hideActionPrompt();
        this.renderGame();
        this.waitingForAction = true;
        console.log('碰牌成功，請選擇要打出的牌');
    }
    
    executeKong() {
        const tile = this.lastDiscardedTile;
        
        // 從手牌中移除三張相同的牌
        let removed = 0;
        this.playerHand = this.playerHand.filter(t => {
            if (t === tile && removed < 3) {
                removed++;
                return false;
            }
            return true;
        });
        
        // 添加到已組合牌
        this.playerMelded.push([tile, tile, tile, tile]);
        
        // 移除桌面上的牌
        this.discardPile.pop();
        
        this.hideActionPrompt();
        this.renderGame();
        
        // 槓牌後補張
        const newTile = this.drawTile();
        if (newTile) {
            this.playerHand.push(newTile);
            this.sortPlayerHand();
            this.renderGame();
        }
        
        this.waitingForAction = true;
        console.log('槓牌成功，請選擇要打出的牌');
    }
    
    executeHu() {
        alert('恭喜胡牌！');
        this.gameStarted = false;
        this.hideActionPrompt();
    }
    
    passAction() {
        this.hideActionPrompt();
        this.nextPlayer();
    }
    
    nextPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % 4;
        
        if (this.currentPlayer === 0) {
            this.playerTurn();
        } else {
            setTimeout(() => {
                this.computerTurn(this.currentPlayer);
            }, 1000);
        }
    }
    
    discardTile(tileIndex) {
        if (!this.waitingForAction || this.currentPlayer !== 0) return;
        
        const discardedTile = this.playerHand.splice(tileIndex, 1)[0];
        this.discardPile.push(discardedTile);
        this.lastDiscardedTile = discardedTile;
        this.lastDiscardedPlayer = 0;
        
        this.waitingForAction = false;
        this.renderGame();
        
        console.log(`你打出：${discardedTile}`);
        
        // 檢查電腦是否可以吃碰胡
        setTimeout(() => {
            this.nextPlayer();
        }, 500);
    }
    
    showActionPrompt(actions) {
        const promptPanel = document.getElementById('actionPromptPanel');
        if (promptPanel) {
            promptPanel.style.display = 'block';
            
            // 重置所有按鈕狀態
            const buttons = promptPanel.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = '1';
            });
            
            // 根據可用動作禁用不可用的按鈕
            const actionMap = {
                'chi': 'chi',
                'pong': 'pong', 
                'kong': 'kong',
                'hu': 'hu'
            };
            
            Object.keys(actionMap).forEach(action => {
                const button = promptPanel.querySelector(`button[onclick*="${action}"]`);
                if (button && !actions.includes(action)) {
                    button.disabled = true;
                    button.style.opacity = '0.5';
                }
            });
        }
    }
    
    hideActionPrompt() {
        const promptPanel = document.getElementById('actionPromptPanel');
        if (promptPanel) {
            promptPanel.style.display = 'none';
        }
    }
    
    renderGame() {
        this.renderPlayerTiles();
        this.renderComputerTiles();
        this.renderDiscardedTiles();
        this.renderMeldedTiles();
    }
    
    renderPlayerTiles() {
        const container = document.getElementById('playerTiles');
        if (!container) return;
        
        container.innerHTML = '';
        this.playerHand.forEach((tile, index) => {
            const tileElement = mahjongTileMapper.createTileImageElement(tile, {
                width: '30px',
                height: '40px',
                className: 'mahjong-tile player-tile',
                onclick: () => this.discardTile(index)
            });
            
            // 添加額外的樣式
            tileElement.style.margin = '1px';
            tileElement.style.transition = 'all 0.2s ease';
            tileElement.style.position = 'relative';
            
            // 滑鼠懸停效果
            tileElement.addEventListener('mouseenter', () => {
                tileElement.style.transform = 'translateY(-3px)';
                tileElement.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)';
            });
            
            tileElement.addEventListener('mouseleave', () => {
                tileElement.style.transform = 'translateY(0)';
                tileElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
            });
            
            container.appendChild(tileElement);
        });
    }
    
    renderComputerTiles() {
        for (let i = 0; i < 3; i++) {
            const container = document.getElementById(`computerTiles${i + 1}`);
            if (!container) continue;
            
            container.innerHTML = '';
            const handSize = this.computerHands[i].length;
            
            for (let j = 0; j < handSize; j++) {
                let tileElement;
                
                // 顯示牌背
                if (i === 0 || i === 2) { // 左右側玩家
                    tileElement = mahjongTileMapper.createTileBackElement({
                        width: '18px',
                        height: '28px',
                        className: 'mahjong-tile computer-tile',
                        margin: '1px 0'
                    });
                } else { // 頂部玩家
                    tileElement = mahjongTileMapper.createTileBackElement({
                        width: '20px',
                        height: '30px',
                        className: 'mahjong-tile computer-tile',
                        margin: '0 1px'
                    });
                }
                
                container.appendChild(tileElement);
            }
        }
    }
    
    renderDiscardedTiles() {
        const container = document.getElementById('discardedTiles');
        if (!container) return;
        
        container.innerHTML = '';
        this.discardPile.forEach(tile => {
            const tileElement = mahjongTileMapper.createTileImageElement(tile, {
                width: '24px',
                height: '32px',
                className: 'discarded-tile'
            });
            
            // 添加打出牌的視覺效果
            tileElement.style.opacity = '0.8';
            tileElement.style.margin = '1px';
            tileElement.style.filter = 'brightness(0.9)';
            
            container.appendChild(tileElement);
        });
    }
    
    renderMeldedTiles() {
        // 渲染玩家已組合的牌
        const playerMeldedContainer = document.getElementById('playerMelded');
        if (playerMeldedContainer) {
            playerMeldedContainer.innerHTML = '';
            this.playerMelded.forEach(meld => {
                const meldGroup = document.createElement('div');
                meldGroup.style.cssText = 'display: flex; gap: 1px; margin: 0 4px;';
                
                meld.forEach(tile => {
                    const tileElement = mahjongTileMapper.createTileImageElement(tile, {
                        width: '24px',
                        height: '32px',
                        className: 'melded-tile'
                    });
                    
                    // 添加已組合牌的視覺效果
                    tileElement.style.border = '2px solid #ffd700';
                    tileElement.style.backgroundColor = '#ffffcc';
                    tileElement.style.boxShadow = '0 2px 4px rgba(255,215,0,0.3)';
                    
                    meldGroup.appendChild(tileElement);
                });
                
                playerMeldedContainer.appendChild(meldGroup);
            });
        }
    }
}

// 全局麻將遊戲實例
let mahjongGame = null;

// 載入麻將遊戲
function loadMahjongGame() {
    console.log('啟動麻將遊戲');
    
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div class="row h-100" style="min-height: 600px;">
            <!-- 左側遊戲控制面板 -->
            <div class="col-md-3 col-lg-3">
                <div class="card h-100" style="background: var(--bs-dark); border: 1px solid #495057;">
                    <div class="card-header border-bottom" style="border-color: #495057 !important;">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="mb-0 text-white">🀄 麻將遊戲</h5>
                            <button onclick="showGameSelection()" class="btn btn-outline-light btn-sm">
                                <i class="fas fa-arrow-left me-1"></i>返回
                            </button>
                        </div>
                        <small class="text-muted">四人對戰模式</small>
                    </div>
                    <div class="card-body p-3" style="overflow-y: auto;">`
                
                <!-- 遊戲控制 -->
                <div class="game-controls-section mb-4">
                    <h6 class="text-light mb-3">遊戲控制</h6>
                    <div class="d-grid gap-2">
                        <button onclick="startMahjongGame()" class="btn btn-primary">
                            <i class="fas fa-play me-2"></i>開始遊戲
                        </button>
                        <button onclick="restartMahjongGame()" class="btn btn-secondary">
                            <i class="fas fa-redo me-2"></i>重新開始
                        </button>
                    </div>
                </div>
                
                <!-- 遊戲狀態 -->
                <div class="game-status-section mb-4">
                    <h6 class="text-light mb-3">遊戲狀態</h6>
                    <div class="status-info" style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 6px;">
                        <div class="d-flex justify-content-between mb-2">
                            <span>當前回合:</span>
                            <span id="currentTurn" class="text-warning">等待開始</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>剩餘牌數:</span>
                            <span id="remainingTiles" class="text-info">144</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>遊戲狀態:</span>
                            <span id="gameStatus" class="text-success">準備中</span>
                        </div>
                    </div>
                </div>
                
                <!-- 玩家積分 -->
                <div class="player-scores-section mb-4">
                    <h6 class="text-light mb-3">玩家積分</h6>
                    <div class="scores-list" style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 6px;">
                        <div class="d-flex justify-content-between mb-2">
                            <span>👤 你:</span>
                            <span class="text-warning fw-bold">25000</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>🤖 電腦1:</span>
                            <span class="text-info">25000</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>🤖 電腦2:</span>
                            <span class="text-info">25000</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>🤖 電腦3:</span>
                            <span class="text-info">25000</span>
                        </div>
                    </div>
                </div>
                
                <!-- 動作提示 -->
                <div class="action-section" id="actionPromptPanel" style="display: none;">
                    <h6 class="text-light mb-3">可選動作</h6>
                    <div class="d-grid gap-2">
                        <button onclick="mahjongGame.executeAction('chi')" class="btn btn-success btn-sm">
                            <i class="fas fa-arrow-right me-2"></i>吃
                        </button>
                        <button onclick="mahjongGame.executeAction('pong')" class="btn btn-warning btn-sm">
                            <i class="fas fa-clone me-2"></i>碰
                        </button>
                        <button onclick="mahjongGame.executeAction('kong')" class="btn btn-danger btn-sm">
                            <i class="fas fa-layer-group me-2"></i>槓
                        </button>
                        <button onclick="mahjongGame.executeAction('hu')" class="btn btn-primary btn-sm">
                            <i class="fas fa-trophy me-2"></i>胡
                        </button>
                        <button onclick="mahjongGame.passAction()" class="btn btn-secondary btn-sm">
                            <i class="fas fa-times me-2"></i>過
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- 右側麻將桌面 -->
            <div class="col-md-9 col-lg-9">
                <div class="card h-100" style="background: #0F5132; border: 1px solid #495057;">
                    <div class="card-body p-3" style="position: relative; min-height: 500px;">
                        <!-- 麻將桌面 -->
                        <div class="mahjong-table" style="width: 100%; height: 100%; position: relative; background: #0F5132; border-radius: 8px; overflow: hidden;">
                    
                    <!-- 桌面中央區域 - 顯示打出的牌 -->
                    <div class="table-center" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 320px; height: 220px; border: 2px solid #666; background: rgba(0,0,0,0.1); border-radius: 8px;">
                        <div class="text-center text-white p-2" style="font-size: 12px; background: rgba(0,0,0,0.5);">打出的牌</div>
                        <div class="discarded-tiles" id="discardedTiles" style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 2px; padding: 8px; height: calc(100% - 30px); overflow: hidden;"></div>
                    </div>
                    
                    <!-- 玩家位置 - 底部(你) -->
                    <div class="player-bottom" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); text-align: center;">
                        <div class="player-info" style="color: #fff; font-size: 14px; margin-bottom: 8px; background: rgba(0,0,0,0.8); padding: 6px 12px; border-radius: 6px;">
                            <span>👤 你 (25000分)</span>
                        </div>
                        <div class="player-tiles" id="playerTiles" style="display: flex; gap: 2px; justify-content: center; flex-wrap: wrap; max-width: 500px;"></div>
                        <div class="player-melded" id="playerMelded" style="display: flex; gap: 4px; justify-content: center; margin-top: 8px;"></div>
                    </div>
                    
                    <!-- 電腦AI玩家 - 右側 -->
                    <div class="player-right" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); text-align: center;">
                        <div class="player-info" style="color: #fff; font-size: 12px; margin-bottom: 8px; background: rgba(0,0,0,0.8); padding: 4px 8px; border-radius: 4px;">
                            <span>🤖 電腦1<br>(25000分)</span>
                        </div>
                        <div class="computer-tiles" id="computerTiles1" style="display: flex; flex-direction: column; gap: 2px; align-items: center;"></div>
                    </div>
                    
                    <!-- 電腦AI玩家 - 頂部 -->
                    <div class="player-top" style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); text-align: center;">
                        <div class="player-info" style="color: #fff; font-size: 12px; margin-bottom: 8px; background: rgba(0,0,0,0.8); padding: 4px 8px; border-radius: 4px;">
                            <span>🤖 電腦2 (25000分)</span>
                        </div>
                        <div class="computer-tiles" id="computerTiles2" style="display: flex; gap: 2px; justify-content: center;"></div>
                    </div>
                    
                    <!-- 電腦AI玩家 - 左側 -->
                    <div class="player-left" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); text-align: center;">
                        <div class="player-info" style="color: #fff; font-size: 12px; margin-bottom: 8px; background: rgba(0,0,0,0.8); padding: 4px 8px; border-radius: 4px;">
                            <span>🤖 電腦3<br>(25000分)</span>
                        </div>
                        <div class="computer-tiles" id="computerTiles3" style="display: flex; flex-direction: column; gap: 2px; align-items: center;"></div>
                    </div>
                    
                    <!-- 隱藏的動作提示面板 (備用) -->
                    <div class="action-prompt" id="actionPrompt" style="display: none;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 創建麻將遊戲實例
    mahjongGame = new MahjongGame();
}

// 遊戲控制函數
function startMahjongGame() {
    if (mahjongGame) {
        mahjongGame.startGame();
    }
}

function restartMahjongGame() {
    mahjongGame = new MahjongGame();
    mahjongGame.renderGame();
}