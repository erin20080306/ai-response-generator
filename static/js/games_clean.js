/**
 * 遊戲中心模組 - 清理版本
 * 包含多種互動小遊戲
 */
class GameCenter {
    constructor(app) {
        this.app = app;
        this.games = {};
        this.gameState = null;
        this.npcData = null;
        this.currentDialog = null;
    }

    init() {
        this.createGamePanel();
        this.setupEventListeners();
    }

    createGamePanel() {
        const existingPanel = document.getElementById('gamePanel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const gamePanel = document.createElement('div');
        gamePanel.id = 'gamePanel';
        gamePanel.className = 'card shadow-sm mb-3';
        gamePanel.innerHTML = `
            <div class="card-header bg-primary text-white">
                <h6 class="mb-0">🎮 遊戲中心</h6>
            </div>
            <div class="card-body">
                <div class="row g-2">
                    <div class="col-6 col-md-4">
                        <button id="farmGameBtn" class="btn btn-outline-success btn-sm w-100">
                            🚜 牧場物語
                        </button>
                    </div>
                    <div class="col-6 col-md-4">
                        <button id="tetrisBtn" class="btn btn-outline-primary btn-sm w-100">
                            🧱 俄羅斯方塊
                        </button>
                    </div>
                    <div class="col-6 col-md-4">
                        <button id="mahjongBtn" class="btn btn-outline-warning btn-sm w-100">
                            🀄 麻將
                        </button>
                    </div>
                </div>
            </div>
        `;

        const sidebar = document.querySelector('.sidebar-content');
        if (sidebar) {
            sidebar.appendChild(gamePanel);
        }
    }

    setupEventListeners() {
        document.getElementById('farmGameBtn')?.addEventListener('click', () => this.startFarmGame());
        document.getElementById('tetrisBtn')?.addEventListener('click', () => this.startTetris());
        document.getElementById('mahjongBtn')?.addEventListener('click', () => this.startMahjong());
    }

    createGameModal(title, content) {
        const existingModal = document.getElementById('gameModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'gameModal';
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-0">
                        ${content}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });

        return modal;
    }

    // 牧場物語遊戲（完整RPG版本）
    startFarmGame() {
        this.addFarmGameStyles();
        
        const gameContent = `
            <div class="farm-game-enhanced">
                <!-- 頂部狀態欄 -->
                <div class="farm-status-bar">
                    <div class="player-info">
                        <div class="player-avatar">
                            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGRkM0N0QiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNSIgcj0iOCIgZmlsbD0iI0ZGQUE3RCIvPgo8Y2lyY2xlIGN4PSIxNSIgY3k9IjEyIiByPSIyIiBmaWxsPSIjNjY0RTI3Ii8+CjxjaXJjbGUgY3g9IjI1IiBjeT0iMTIiIHI9IjIiIGZpbGw9IiM2NjRFMjciLz4KPHBhdGggZD0iTTE2IDIwQzE2IDIyIDIwIDI0IDIwIDI0UzI0IDIyIDI0IDIwIiBzdHJva2U9IiM2NjRFMjciIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4K" alt="玩家頭像" class="rounded-circle">
                        </div>
                        <div class="player-stats">
                            <div><strong id="playerName">小農夫</strong> Lv.<span id="farmLevel">1</span></div>
                            <div class="stat-bar">
                                <span>體力:</span>
                                <div class="progress">
                                    <div id="energyBar" class="progress-bar bg-success" style="width: 100%"></div>
                                </div>
                                <span id="energyText">100/100</span>
                            </div>
                        </div>
                    </div>
                    <div class="game-info">
                        <div><strong>第 <span id="currentDay">1</span> 天</strong></div>
                        <div id="currentSeason">春天</div>
                        <div><span id="farmMoney">500</span> 金</div>
                    </div>
                </div>

                <!-- 主要遊戲區域 -->
                <div class="farm-main-area">
                    <!-- 左側：場景和農場 -->
                    <div class="farm-scene-area">
                        <div class="scene-tabs">
                            <button class="scene-tab active" data-scene="farm">🚜 農場</button>
                            <button class="scene-tab" data-scene="town">🏘️ 村莊</button>
                            <button class="scene-tab" data-scene="forest" style="display:none">🌲 森林</button>
                            <button class="scene-tab" data-scene="mine" style="display:none">⛏️ 礦場</button>
                        </div>
                        
                        <!-- 農場場景 -->
                        <div id="farmScene" class="game-scene active">
                            <div class="scene-background farm-bg">
                                <div id="farmGrid" class="farm-grid"></div>
                                <div class="farm-buildings">
                                    <div class="building house" data-building="house">🏠</div>
                                    <div class="building barn" data-building="barn">🏚️</div>
                                    <div class="building coop" data-building="coop">🐔</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 村莊場景 -->
                        <div id="townScene" class="game-scene">
                            <div class="scene-background town-bg">
                                <div class="town-buildings">
                                    <div class="npc-building" data-npc="shopkeeper">
                                        <div class="building-icon">🏪</div>
                                        <div class="building-label">雜貨店</div>
                                    </div>
                                    <div class="npc-building" data-npc="mayor">
                                        <div class="building-icon">🏛️</div>
                                        <div class="building-label">鎮長辦公室</div>
                                    </div>
                                    <div class="npc-building" data-npc="blacksmith">
                                        <div class="building-icon">🔨</div>
                                        <div class="building-label">鐵匠鋪</div>
                                    </div>
                                    <div class="npc-building" data-npc="doctor">
                                        <div class="building-icon">🏥</div>
                                        <div class="building-label">診所</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 森林場景 -->
                        <div id="forestScene" class="game-scene">
                            <div class="scene-background forest-bg">
                                <div class="forest-items">
                                    <div class="collectible" data-item="wood">🪵</div>
                                    <div class="collectible" data-item="berry">🍓</div>
                                    <div class="collectible" data-item="mushroom">🍄</div>
                                    <div class="collectible" data-item="flower">🌸</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 礦場場景 -->
                        <div id="mineScene" class="game-scene">
                            <div class="scene-background mine-bg">
                                <div class="mine-levels">
                                    <div class="mine-entrance" data-level="1">第1層</div>
                                    <div class="mine-entrance" data-level="2">第2層</div>
                                    <div class="mine-entrance" data-level="3">第3層</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 右側：功能面板 -->
                    <div class="farm-control-panel">
                        <!-- 工具欄 -->
                        <div class="tool-section">
                            <h6>🔧 工具</h6>
                            <div class="tool-grid">
                                <button class="tool-btn active" data-tool="hoe" title="鋤頭">🚜</button>
                                <button class="tool-btn" data-tool="seed" title="種子">🌱</button>
                                <button class="tool-btn" data-tool="water" title="澆水壺">💧</button>
                                <button class="tool-btn" data-tool="harvest" title="收穫">🌾</button>
                                <button class="tool-btn" data-tool="axe" title="斧頭">🪓</button>
                                <button class="tool-btn" data-tool="pickaxe" title="十字鎬">⛏️</button>
                            </div>
                        </div>
                        
                        <!-- 背包 -->
                        <div class="inventory-section">
                            <h6>🎒 背包</h6>
                            <div id="inventoryGrid" class="inventory-grid"></div>
                        </div>
                        
                        <!-- 任務系統 -->
                        <div class="quest-section">
                            <h6>📋 任務</h6>
                            <div id="questList" class="quest-list"></div>
                        </div>
                    </div>
                </div>
                
                <!-- 對話系統 -->
                <div id="dialogSystem" class="dialog-system">
                    <div class="dialog-box">
                        <div class="dialog-header">
                            <img id="dialogAvatar" class="dialog-avatar" src="" alt="">
                            <span id="dialogName" class="dialog-name"></span>
                        </div>
                        <div id="dialogText" class="dialog-text"></div>
                        <div class="dialog-choices" id="dialogChoices"></div>
                        <div class="dialog-continue">
                            <button id="dialogNext" class="btn btn-primary">繼續</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modal = this.createGameModal('牧場物語 - 夢想農場', gameContent);
        
        setTimeout(() => {
            this.initFarmGame();
        }, 100);
    }

    // 簡化的俄羅斯方塊
    startTetris() {
        const tetrisContent = `
            <div class="tetris-game bg-dark text-white p-3">
                <div class="d-flex justify-content-between mb-3">
                    <div>分數: <span id="tetrisScore">0</span></div>
                    <div>等級: <span id="tetrisLevel">1</span></div>
                </div>
                <div class="d-flex justify-content-center">
                    <div id="tetrisBoard" class="tetris-board">
                        <div class="text-center p-5">
                            <h4>俄羅斯方塊</h4>
                            <p>使用方向鍵控制方塊</p>
                            <button class="btn btn-primary" onclick="console.log('開始遊戲')">開始遊戲</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.createGameModal('俄羅斯方塊', tetrisContent);
    }

    // 簡化的麻將
    startMahjong() {
        const mahjongContent = `
            <div class="mahjong-game p-3">
                <div class="text-center mb-3">
                    <h4>四人麻將</h4>
                    <div class="mb-3">
                        <button class="btn btn-success me-2">開始遊戲</button>
                        <button class="btn btn-secondary">查看規則</button>
                    </div>
                </div>
                <div class="mahjong-table bg-success rounded p-3">
                    <div class="text-center text-white">
                        <div class="mb-3">牌桌</div>
                        <div class="row">
                            <div class="col-3">
                                <div class="player-area">
                                    <div class="small">玩家1</div>
                                    <div class="tiles-area bg-dark rounded p-2 mt-2">手牌區</div>
                                </div>
                            </div>
                            <div class="col-6 d-flex align-items-center justify-content-center">
                                <div class="center-area bg-dark rounded p-3">
                                    牌池
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="player-area">
                                    <div class="small">玩家2</div>
                                    <div class="tiles-area bg-dark rounded p-2 mt-2">手牌區</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.createGameModal('四人麻將', mahjongContent);
    }

    // 初始化牧場遊戲的完整邏輯
    initFarmGame() {
        // 初始化遊戲狀態
        this.gameState = {
            player: {
                name: '小農夫',
                level: 1,
                exp: 0,
                energy: 100,
                maxEnergy: 100,
                money: 500
            },
            world: {
                day: 1,
                season: 'spring',
                currentScene: 'farm'
            },
            currentTool: 'hoe',
            farmPlots: Array(20).fill().map(() => ({ 
                state: 'empty', 
                crop: null, 
                growthStage: 0, 
                watered: false,
                harvestReady: false 
            })),
            inventory: {
                'turnip_seed': 5,
                'potato_seed': 3,
                'wood': 10,
                'stone': 5
            },
            quests: [
                {
                    id: 1,
                    title: '種植第一片作物',
                    description: '在農場種植5個蘿蔔種子',
                    progress: 0,
                    target: 5,
                    completed: false,
                    reward: { money: 100, exp: 50 }
                },
                {
                    id: 2,
                    title: '拜訪鎮長',
                    description: '去村莊拜訪鎮長了解更多關於這個小鎮的故事',
                    progress: 0,
                    target: 1,
                    completed: false,
                    reward: { money: 50, exp: 25 }
                }
            ],
            relationships: {
                mayor: { level: 0, points: 0 },
                shopkeeper: { level: 0, points: 0 },
                blacksmith: { level: 0, points: 0 },
                doctor: { level: 0, points: 0 }
            }
        };

        // NPC 數據和劇情
        this.npcData = {
            mayor: {
                name: '村長湯姆',
                avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNGRkM4OEEiLz4KPGNpcmNsZSBjeD0iMzAiIGN5PSIyNSIgcj0iMTIiIGZpbGw9IiNGRkI2N0EiLz4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyMiIgcj0iMiIgZmlsbD0iIzMzMzMzMyIvPgo8Y2lyY2xlIGN4PSIzNiIgY3k9IjIyIiByPSIyIiBmaWxsPSIjMzMzMzMzIi8+CjxyZWN0IHg9IjI2IiB5PSIxNSIgd2lkdGg9IjgiIGhlaWdodD0iMyIgZmlsbD0iIzk5OTk5OSIvPgo8cGF0aCBkPSJNMjQgMzJDMjQgMzQgMzAgMzYgMzAgMzZTMzYgMzQgMzYgMzIiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PC9zdmc+',
                dialogs: {
                    first_meeting: [
                        {
                            text: "歡迎來到綠谷小鎮！我是湯姆鎮長，很高興見到你這位新來的農夫。",
                            choices: null
                        },
                        {
                            text: "這個小鎮雖然不大，但是非常溫馨。我們有雜貨店、鐵匠鋪和診所，應該能滿足你的基本需求。",
                            choices: null
                        },
                        {
                            text: "你的祖父留給你的農場有些荒廢，但我相信憑你的努力一定能讓它重現生機！",
                            choices: [
                                { text: "我會努力的！", action: "encourage" },
                                { text: "請告訴我更多關於這裡的事情", action: "learn_more" }
                            ]
                        }
                    ]
                }
            }
        };
        
        // 初始化UI
        this.initFarmUI();
        this.setupFarmEvents();
        this.updateFarmDisplay();
        
        // 顯示開場劇情
        setTimeout(() => {
            this.showDialog('mayor', 'first_meeting');
        }, 1000);
    }

    initFarmUI() {
        // 初始化農場網格
        const grid = document.getElementById('farmGrid');
        if (grid) {
            grid.innerHTML = '';
            for (let i = 0; i < 20; i++) {
                const plot = document.createElement('div');
                plot.className = 'farm-plot';
                plot.dataset.index = i;
                plot.innerHTML = '🟫';
                grid.appendChild(plot);
            }
        }

        // 初始化背包
        this.updateInventory();
        
        // 初始化任務列表
        this.updateQuests();
    }

    setupFarmEvents() {
        // 場景切換
        document.querySelectorAll('.scene-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const scene = e.target.dataset.scene;
                this.switchScene(scene);
            });
        });

        // 工具選擇
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.gameState.currentTool = e.target.dataset.tool;
            });
        });

        // 農場格子點擊
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('farm-plot')) {
                const index = parseInt(e.target.dataset.index);
                this.useTool(index);
            }
        });

        // NPC 對話
        document.addEventListener('click', (e) => {
            if (e.target.closest('.npc-building')) {
                const npc = e.target.closest('.npc-building').dataset.npc;
                this.talkToNPC(npc);
            }
        });
        
        // 對話系統點擊事件
        document.addEventListener('click', (e) => {
            if (e.target.id === 'dialogNext') {
                this.nextDialog();
            }
            if (e.target.classList.contains('dialog-choice')) {
                const action = e.target.dataset.action;
                this.handleDialogChoice(action);
            }
        });
    }

    updateFarmDisplay() {
        const { player, world } = this.gameState;
        
        const levelEl = document.getElementById('farmLevel');
        const moneyEl = document.getElementById('farmMoney');
        const dayEl = document.getElementById('currentDay');
        const seasonEl = document.getElementById('currentSeason');
        const nameEl = document.getElementById('playerName');
        
        if (levelEl) levelEl.textContent = player.level;
        if (moneyEl) moneyEl.textContent = player.money;
        if (dayEl) dayEl.textContent = world.day;
        if (seasonEl) seasonEl.textContent = world.season;
        if (nameEl) nameEl.textContent = player.name;
        
        // 更新體力條
        const energyPercent = (player.energy / player.maxEnergy) * 100;
        const energyBar = document.getElementById('energyBar');
        const energyText = document.getElementById('energyText');
        
        if (energyBar) energyBar.style.width = energyPercent + '%';
        if (energyText) energyText.textContent = `${player.energy}/${player.maxEnergy}`;
    }

    updateInventory() {
        const inventoryGrid = document.getElementById('inventoryGrid');
        if (!inventoryGrid) return;
        
        inventoryGrid.innerHTML = '';
        
        Object.entries(this.gameState.inventory).forEach(([item, count]) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';
            
            const itemName = this.getItemName(item);
            const itemIcon = this.getItemIcon(item);
            
            itemDiv.innerHTML = `
                <div class="item-icon">${itemIcon}</div>
                <div class="item-name">${itemName}</div>
                <div class="item-count">${count}</div>
            `;
            
            inventoryGrid.appendChild(itemDiv);
        });
    }

    updateQuests() {
        const questList = document.getElementById('questList');
        if (!questList) return;
        
        questList.innerHTML = '';
        
        this.gameState.quests.forEach(quest => {
            const questDiv = document.createElement('div');
            questDiv.className = `quest-item ${quest.completed ? 'completed' : ''}`;
            
            questDiv.innerHTML = `
                <div class="quest-title">${quest.title}</div>
                <div class="quest-description">${quest.description}</div>
                <div class="quest-progress">${quest.progress}/${quest.target}</div>
            `;
            
            questList.appendChild(questDiv);
        });
    }

    getItemName(item) {
        const names = {
            'turnip_seed': '蘿蔔種子',
            'potato_seed': '馬鈴薯種子',
            'wood': '木材',
            'stone': '石頭',
            'turnip': '蘿蔔',
            'potato': '馬鈴薯'
        };
        return names[item] || item;
    }

    getItemIcon(item) {
        const icons = {
            'turnip_seed': '🌰',
            'potato_seed': '🟤',
            'wood': '🪵',
            'stone': '🪨',
            'turnip': '🥕',
            'potato': '🥔'
        };
        return icons[item] || '❓';
    }

    useTool(plotIndex) {
        const plot = this.gameState.farmPlots[plotIndex];
        const tool = this.gameState.currentTool;
        
        if (this.gameState.player.energy <= 0) {
            this.showMessage('體力不足！請休息恢復體力。');
            return;
        }

        switch(tool) {
            case 'hoe':
                if (plot.state === 'empty') {
                    plot.state = 'tilled';
                    this.gameState.player.energy -= 2;
                    this.updatePlotDisplay(plotIndex);
                    this.addExp(1);
                }
                break;
            
            case 'seed':
                if (plot.state === 'tilled' && this.gameState.inventory.turnip_seed > 0) {
                    plot.state = 'planted';
                    plot.crop = 'turnip';
                    plot.growthStage = 0;
                    this.gameState.inventory.turnip_seed--;
                    this.gameState.player.energy -= 3;
                    this.updatePlotDisplay(plotIndex);
                    this.updateInventory();
                    this.addExp(2);
                    this.updateQuestProgress(1, 1);
                }
                break;
        }
        
        this.updateFarmDisplay();
    }

    updatePlotDisplay(plotIndex) {
        const plotElement = document.querySelector(`[data-index="${plotIndex}"]`);
        if (!plotElement) return;
        
        const plot = this.gameState.farmPlots[plotIndex];
        
        switch(plot.state) {
            case 'empty':
                plotElement.innerHTML = '🟫';
                break;
            case 'tilled':
                plotElement.innerHTML = '🟤';
                break;
            case 'planted':
                plotElement.innerHTML = plot.watered ? '🌱' : '🌰';
                break;
        }
    }

    addExp(amount) {
        this.gameState.player.exp += amount;
        const expNeeded = this.gameState.player.level * 100;
        
        if (this.gameState.player.exp >= expNeeded) {
            this.gameState.player.level++;
            this.gameState.player.exp = 0;
            this.gameState.player.maxEnergy += 10;
            this.gameState.player.energy = this.gameState.player.maxEnergy;
            this.showMessage(`升級了！現在是 ${this.gameState.player.level} 級！`);
        }
    }

    updateQuestProgress(questId, amount) {
        const quest = this.gameState.quests.find(q => q.id === questId);
        if (quest && !quest.completed) {
            quest.progress += amount;
            if (quest.progress >= quest.target) {
                this.completeQuest(questId);
            }
            this.updateQuests();
        }
    }

    completeQuest(questId) {
        const quest = this.gameState.quests.find(q => q.id === questId);
        if (quest && !quest.completed) {
            quest.completed = true;
            this.gameState.player.money += quest.reward.money;
            this.gameState.player.exp += quest.reward.exp;
            this.showMessage(`任務完成！獲得 ${quest.reward.money} 金和 ${quest.reward.exp} 經驗值`);
            this.updateQuests();
        }
    }

    switchScene(sceneName) {
        document.querySelectorAll('.scene-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.game-scene').forEach(scene => scene.classList.remove('active'));
        
        const sceneTab = document.querySelector(`[data-scene="${sceneName}"]`);
        const sceneDiv = document.getElementById(`${sceneName}Scene`);
        
        if (sceneTab) sceneTab.classList.add('active');
        if (sceneDiv) sceneDiv.classList.add('active');
        
        this.gameState.world.currentScene = sceneName;
    }

    talkToNPC(npcId) {
        const hasMetBefore = this.gameState.relationships[npcId].points > 0;
        const dialogKey = hasMetBefore ? 'regular' : 'first_meeting';
        
        if (npcId === 'mayor' && !hasMetBefore) {
            this.completeQuest(2);
        }
        
        this.gameState.relationships[npcId].points += 5;
        
        this.showDialog(npcId, dialogKey);
    }

    showDialog(npcId, dialogKey) {
        const npc = this.npcData[npcId];
        if (!npc || !npc.dialogs[dialogKey]) return;

        this.currentDialog = {
            npcId: npcId,
            dialogKey: dialogKey,
            dialogs: npc.dialogs[dialogKey],
            currentIndex: 0
        };

        const dialogSystem = document.getElementById('dialogSystem');
        const dialogAvatar = document.getElementById('dialogAvatar');
        const dialogName = document.getElementById('dialogName');

        if (dialogAvatar) dialogAvatar.src = npc.avatar;
        if (dialogName) dialogName.textContent = npc.name;
        if (dialogSystem) dialogSystem.style.display = 'flex';

        this.showCurrentDialog();
    }

    showCurrentDialog() {
        if (!this.currentDialog) return;
        
        const { dialogs, currentIndex } = this.currentDialog;
        const dialog = dialogs[currentIndex];

        const dialogText = document.getElementById('dialogText');
        const dialogChoices = document.getElementById('dialogChoices');
        const dialogNext = document.getElementById('dialogNext');

        if (dialogText) dialogText.textContent = dialog.text;

        if (dialog.choices && dialogChoices) {
            dialogChoices.innerHTML = '';
            dialog.choices.forEach(choice => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-outline-primary me-2 mb-2 dialog-choice';
                btn.textContent = choice.text;
                btn.dataset.action = choice.action;
                dialogChoices.appendChild(btn);
            });
            dialogChoices.style.display = 'block';
            if (dialogNext) dialogNext.style.display = 'none';
        } else {
            if (dialogChoices) dialogChoices.style.display = 'none';
            if (dialogNext) dialogNext.style.display = 'inline-block';
        }
    }

    nextDialog() {
        if (!this.currentDialog) return;
        
        this.currentDialog.currentIndex++;
        if (this.currentDialog.currentIndex >= this.currentDialog.dialogs.length) {
            this.closeDialog();
            return;
        }
        this.showCurrentDialog();
    }

    handleDialogChoice(action) {
        if (action === 'learn_more') {
            const forestTab = document.querySelector('[data-scene="forest"]');
            const mineTab = document.querySelector('[data-scene="mine"]');
            if (forestTab) forestTab.style.display = 'inline-block';
            if (mineTab) mineTab.style.display = 'inline-block';
        }
        this.closeDialog();
    }

    closeDialog() {
        const dialogSystem = document.getElementById('dialogSystem');
        if (dialogSystem) dialogSystem.style.display = 'none';
        this.currentDialog = null;
    }

    showMessage(text) {
        const message = document.createElement('div');
        message.className = 'farm-message';
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    addFarmGameStyles() {
        if (document.getElementById('farmGameStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'farmGameStyles';
        style.textContent = `
            .farm-game-enhanced {
                font-family: 'Arial', sans-serif;
                background: linear-gradient(135deg, #87CEEB, #98FB98);
                min-height: 600px;
                border-radius: 15px;
                overflow: hidden;
                position: relative;
            }
            
            .farm-status-bar {
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .player-info {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .farm-main-area {
                display: flex;
                height: 500px;
            }
            
            .farm-scene-area {
                flex: 2;
                background: #E8F5E8;
                position: relative;
            }
            
            .scene-tabs {
                background: rgba(0,0,0,0.1);
                padding: 8px;
                display: flex;
                gap: 5px;
            }
            
            .scene-tab {
                background: rgba(255,255,255,0.7);
                border: none;
                padding: 8px 15px;
                border-radius: 15px;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 12px;
            }
            
            .scene-tab.active {
                background: #4CAF50;
                color: white;
                transform: scale(1.05);
            }
            
            .game-scene {
                display: none;
                height: calc(100% - 50px);
                position: relative;
            }
            
            .game-scene.active {
                display: block;
            }
            
            .farm-bg {
                background: linear-gradient(180deg, #87CEEB 0%, #90EE90 50%, #8B7355 100%);
                height: 100%;
                position: relative;
            }
            
            .farm-grid {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 8px;
                padding: 20px;
                max-width: 300px;
                margin: 20px auto;
            }
            
            .farm-plot {
                width: 50px;
                height: 50px;
                border: 2px solid #654321;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                cursor: pointer;
                background: #D2B48C;
                transition: all 0.3s;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            
            .farm-plot:hover {
                border-color: #FFD700;
                transform: scale(1.1);
                box-shadow: 0 4px 8px rgba(255,215,0,0.4);
            }
            
            .town-bg {
                background: linear-gradient(180deg, #87CEEB 0%, #F0E68C 100%);
                height: 100%;
                position: relative;
            }
            
            .town-buildings {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                padding: 30px;
                height: 100%;
            }
            
            .npc-building {
                background: rgba(255,255,255,0.9);
                border-radius: 15px;
                padding: 20px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
                border: 3px solid transparent;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            
            .npc-building:hover {
                transform: translateY(-5px);
                border-color: #4CAF50;
                box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            }
            
            .building-icon {
                font-size: 48px;
                margin-bottom: 10px;
            }
            
            .building-label {
                font-weight: bold;
                color: #2C3E50;
            }
            
            .farm-control-panel {
                flex: 1;
                background: rgba(255,255,255,0.95);
                padding: 15px;
                overflow-y: auto;
                border-left: 3px solid #4CAF50;
            }
            
            .tool-section h6,
            .inventory-section h6,
            .quest-section h6 {
                color: #2C3E50;
                border-bottom: 2px solid #4CAF50;
                padding-bottom: 5px;
                margin-bottom: 15px;
            }
            
            .tool-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                margin-bottom: 20px;
            }
            
            .tool-btn {
                background: #f8f9fa;
                border: 2px solid #dee2e6;
                padding: 12px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 20px;
                text-align: center;
            }
            
            .tool-btn:hover {
                border-color: #4CAF50;
                background: #E8F5E8;
                transform: scale(1.05);
            }
            
            .tool-btn.active {
                background: #4CAF50;
                color: white;
                border-color: #45a049;
            }
            
            .inventory-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
                margin-bottom: 20px;
                max-height: 150px;
                overflow-y: auto;
            }
            
            .inventory-item {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 8px;
                text-align: center;
                font-size: 12px;
            }
            
            .item-icon {
                font-size: 20px;
                margin-bottom: 4px;
            }
            
            .item-name {
                font-weight: bold;
                margin-bottom: 2px;
            }
            
            .item-count {
                color: #6c757d;
                font-size: 11px;
            }
            
            .quest-list {
                max-height: 150px;
                overflow-y: auto;
            }
            
            .quest-item {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 10px;
                margin-bottom: 8px;
            }
            
            .quest-item.completed {
                background: #d4edda;
                border-color: #c3e6cb;
            }
            
            .quest-title {
                font-weight: bold;
                color: #2C3E50;
                font-size: 13px;
            }
            
            .quest-description {
                font-size: 11px;
                color: #6c757d;
                margin: 4px 0;
            }
            
            .quest-progress {
                font-size: 12px;
                color: #28a745;
                font-weight: bold;
            }
            
            .dialog-system {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                z-index: 10000;
                justify-content: center;
                align-items: center;
            }
            
            .dialog-box {
                background: white;
                border-radius: 15px;
                padding: 20px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            
            .dialog-header {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 15px;
                border-bottom: 2px solid #4CAF50;
                padding-bottom: 10px;
            }
            
            .dialog-avatar {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: 3px solid #4CAF50;
            }
            
            .dialog-name {
                font-size: 18px;
                font-weight: bold;
                color: #2C3E50;
            }
            
            .dialog-text {
                font-size: 16px;
                line-height: 1.6;
                color: #2C3E50;
                margin-bottom: 20px;
                min-height: 60px;
            }
            
            .dialog-choices {
                display: none;
                margin-bottom: 15px;
            }
            
            .dialog-choice {
                margin-right: 10px;
                margin-bottom: 10px;
            }
            
            .dialog-continue {
                text-align: right;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .farm-message {
                animation: slideIn 0.3s ease-out;
            }
        `;
        document.head.appendChild(style);
    }
}

// 導出類別
window.GameCenter = GameCenter;