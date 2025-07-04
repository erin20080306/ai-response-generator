/**
 * 獨立遊戲系統 - 不依賴AI的固定劇情遊戲
 */

// 主要遊戲載入函數
function loadGame(gameType) {
    console.log('載入遊戲:', gameType);
    
    const gameContainer = document.getElementById('gameContainer');
    if (!gameContainer) {
        console.error('找不到gameContainer元素');
        return;
    }

    // 清除現有內容
    gameContainer.innerHTML = '';
    
    switch (gameType) {
        case 'tetris':
            loadTetrisGame();
            break;
        case 'mahjong':
            loadMahjongGame();
            break;
        case 'farm':
        case 'farm-story':
            loadFarmStoryGame();
            break;
        default:
            console.warn('未知遊戲類型:', gameType);
            gameContainer.innerHTML = `
                <div class="alert alert-warning">
                    <h5>遊戲類型不支援</h5>
                    <p>請選擇支援的遊戲類型：俄羅斯方塊、麻將、農場物語</p>
                </div>
            `;
    }
}

// 遊戲載入輔助函數
function loadTetrisGame() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div class="tetris-container">
            <h5 class="text-center mb-3">俄羅斯方塊</h5>
            <div class="tetris-game-area">
                <div id="tetrisBoard" class="tetris-board"></div>
                <div class="tetris-controls">
                    <button onclick="moveTetrisLeft()" class="btn btn-primary">←</button>
                    <button onclick="rotateTetrisPiece()" class="btn btn-success">↻</button>
                    <button onclick="moveTetrisRight()" class="btn btn-primary">→</button>
                    <button onclick="dropTetrisPiece()" class="btn btn-warning">↓</button>
                </div>
                <div class="tetris-info">
                    <div>分數: <span id="tetrisScore">0</span></div>
                    <div>等級: <span id="tetrisLevel">1</span></div>
                </div>
            </div>
        </div>
    `;
    setTimeout(() => {
        startTetrisInPanel();
    }, 100);
}

function loadMahjongGame() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div class="mahjong-container">
            <h5 class="text-center mb-3">麻將</h5>
            <div class="mahjong-game-area">
                <div id="mahjongBoard" class="mahjong-board"></div>
                <div class="mahjong-controls">
                    <button onclick="drawMahjongTile()" class="btn btn-primary">摸牌</button>
                    <button onclick="discardMahjongTile()" class="btn btn-secondary">打牌</button>
                    <button onclick="declareMahjongWin()" class="btn btn-success">胡牌</button>
                </div>
                <div class="mahjong-info">
                    <div>分數: <span id="mahjongScore">0</span></div>
                    <div>回合: <span id="mahjongRound">1</span></div>
                </div>
            </div>
        </div>
    `;
    setTimeout(() => {
        startMahjongInPanel();
    }, 100);
}

function loadFarmStoryGame() {
    const gameContainer = document.getElementById('gameContainer');
    
    // 添加農場遊戲專用CSS
    if (!document.getElementById('farmGameCSS')) {
        const link = document.createElement('link');
        link.id = 'farmGameCSS';
        link.rel = 'stylesheet';
        link.href = '/static/css/farm_game.css';
        document.head.appendChild(link);
    }
    
    gameContainer.innerHTML = `
        <div class="farm-story-game" id="farmStoryGame">
            <div class="farm-game-header">
                <div class="player-stats">
                    <div class="money-display">
                        💰 <span id="playerMoney">100</span>G
                    </div>
                    <div class="stat-item">
                        體力: <div class="heart-container" id="energyHearts"></div>
                    </div>
                    <div class="stat-item">
                        健康: <div class="heart-container" id="healthHearts"></div>
                    </div>
                </div>
                <div class="ai-counter">
                    🤖 AI助手: <span id="aiUsesLeft">10</span>/10
                </div>
            </div>
            
            <div class="game-main-area">
                <div class="game-field">
                    <div class="location-buttons">
                        <button class="location-btn active" onclick="changeLocation('farm')">農場</button>
                        <button class="location-btn" onclick="changeLocation('house')">家</button>
                        <button class="location-btn" onclick="changeLocation('town')">城鎮</button>
                        <button class="location-btn" onclick="changeLocation('forest')">森林</button>
                    </div>
                    <div class="farm-grid" id="farmGrid"></div>
                    <div class="player-character" id="playerCharacter">🧑‍🌾</div>
                </div>
                
                <div class="game-sidebar">
                    <div class="sidebar-section">
                        <div class="sidebar-title">🎒 背包</div>
                        <div class="inventory-grid" id="inventoryGrid"></div>
                    </div>
                    
                    <div class="sidebar-section">
                        <div class="sidebar-title">🌱 作物</div>
                        <div class="inventory-grid" id="seedInventory"></div>
                    </div>
                    
                    <div class="sidebar-section">
                        <div class="sidebar-title">👥 村民</div>
                        <div id="npcList">
                            <div style="font-size: 10px; color: #ccc;">
                                市長湯姆: ♥️♥️♡♡♡<br>
                                商店瑪莉: ♥️♡♡♡♡<br>
                                鐵匠傑克: ♥️♡♡♡♡<br>
                                醫生莉莉: ♥️♡♡♡♡
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="game-toolbar">
                <button class="tool-button active" onclick="selectTool('hoe')" id="tool-hoe">
                    🔨 鋤頭
                </button>
                <button class="tool-button" onclick="selectTool('watering')" id="tool-watering">
                    💧 澆水
                </button>
                <button class="tool-button" onclick="selectTool('seeds')" id="tool-seeds">
                    🌱 播種
                </button>
                <button class="tool-button" onclick="selectTool('harvest')" id="tool-harvest">
                    🧺 收穫
                </button>
                <button class="tool-button" onclick="useAIAssistant()" id="ai-assistant">
                    🤖 AI助手
                </button>
            </div>
        </div>
    `;
    
    startFarmStoryInPanel();
    
    // 初始化心形顯示和場景
    setTimeout(() => {
        updateHeartDisplay();
        changeGameLocation('farm');
    }, 200);
}

// 全域遊戲變數 - GBA風格遊戲系統
let gameData = {
    farmStory: {
        aiUsesLeft: 10,
        playerName: '小農夫',
        money: 100,
        currentTool: 'hoe',
        currentSeed: 'potato',
        currentLocation: 'farm',
        gameStarted: false,
        // 玩家物件，包含所有屬性
        player: {
            x: 5,
            y: 5,
            energy: 100,
            health: 100,
            experience: 0,
            level: 1,
            sprite: '🧑‍🌾'
        },
        inventory: {
            tools: ['hoe', 'watering_can', 'axe', 'pickaxe', 'fishing_rod'],
            seeds: ['potato', 'carrot', 'tomato', 'corn'],
            items: ['wood', 'stone', 'fish'],
            crops: []
        },
        npcRelations: {
            'Mayor Tom': { level: 1, points: 0, sprite: '👨‍💼' },
            'Shopkeeper Mary': { level: 1, points: 0, sprite: '👩‍💼' },
            'Blacksmith Jack': { level: 1, points: 0, sprite: '👨‍🔧' },
            'Doctor Lily': { level: 1, points: 0, sprite: '👩‍⚕️' }
        },
        farm: {
            crops: {},
            animals: [],
            buildings: [],
            grid: Array(10).fill(null).map(() => Array(10).fill('grass'))
        },
        // 場景資料
        scenes: {
            farm: {
                name: '農場',
                background: '#90EE90',
                tiles: ['🌱', '🌾', '🥕', '🥔', '🌽'],
                objects: ['🚜', '🏚️', '🌳'],
                npcs: []
            },
            town: {
                name: '小鎮',
                background: '#DDD',
                tiles: ['🏠', '🏪', '🏛️', '⛲'],
                objects: ['🚗', '🛒', '📮'],
                npcs: ['Mayor Tom']
            },
            shop: {
                name: '商店',
                background: '#FFE4B5',
                tiles: ['📦', '🛍️', '💰', '🔧'],
                objects: ['🧮', '⚖️', '💳'],
                npcs: ['Shopkeeper Mary']
            },
            forest: {
                name: '森林',
                background: '#228B22',
                tiles: ['🌳', '🍄', '🌿', '🦌'],
                objects: ['🪓', '🐿️', '🦋'],
                npcs: ['Blacksmith Jack']
            },
            mine: {
                name: '礦山',
                background: '#696969',
                tiles: ['⛏️', '💎', '🪨', '⚒️'],
                objects: ['🔦', '⛰️', '💰'],
                npcs: ['Doctor Lily']
            }
        }
    },
    tetris: {
        board: Array(20).fill(null).map(() => Array(10).fill(0)),
        currentPiece: null,
        nextPiece: null,
        score: 0,
        level: 1,
        linesCleared: 0,
        gameStarted: false,
        gameOver: false,
        dropTime: 0,
        lastTime: 0,
        // 俄羅斯方塊形狀和顏色
        pieces: [
            { shape: [[[1,1,1,1]]], color: '#ff6b6b' }, // I
            { shape: [[[1,1],[1,1]]], color: '#4ecdc4' }, // O
            { shape: [[[0,1,0],[1,1,1]]], color: '#45b7d1' }, // T
            { shape: [[[0,1,1],[1,1,0]]], color: '#f9ca24' }, // S
            { shape: [[[1,1,0],[0,1,1]]], color: '#6c5ce7' }, // Z
            { shape: [[[1,0,0],[1,1,1]]], color: '#fd79a8' }, // J
            { shape: [[[0,0,1],[1,1,1]]], color: '#fdcb6e' } // L
        ]
    },
    mahjong: {
        playerHand: [],
        gameStarted: false,
        currentPlayer: 0,
        score: 0,
        round: 1,
        selectedTile: null,
        tiles: [],
        discardPile: [],
        // 麻將牌組
        tileSet: [
            '🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏', // 一到九萬
            '🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗', '🀘', // 一到九筒
            '🀙', '🀚', '🀛', '🀜', '🀝', '🀞', '🀟', '🀠', '🀡', // 一到九條
            '🀀', '🀁', '🀂', '🀃', '🀄', '🀅', '🀆' // 字牌
        ],
        players: [
            { name: '玩家', hand: [], score: 0, isAI: false },
            { name: 'AI1', hand: [], score: 0, isAI: true },
            { name: 'AI2', hand: [], score: 0, isAI: true },
            { name: 'AI3', hand: [], score: 0, isAI: true }
        ]
    }
};

// 遊戲啟動函數
function startTetrisInPanel() {
    console.log('啟動俄羅斯方塊遊戲');
    initTetrisGame();
}

function startMahjongInPanel() {
    console.log('啟動麻將遊戲');
    initMahjongGame();
}

function startFarmStoryInPanel() {
    console.log('啟動農場物語遊戲');
    initFarmStoryGame();
}

// 俄羅斯方塊遊戲邏輯
function initTetrisGame() {
    console.log('初始化俄羅斯方塊');
    
    const tetrisBoard = document.getElementById('tetrisBoard');
    if (!tetrisBoard) {
        console.error('找不到tetrisBoard元素');
        return;
    }
    
    // 創建俄羅斯方塊遊戲介面
    tetrisBoard.innerHTML = `
        <div class="tetris-game">
            <div class="tetris-info">
                <div>分數: <span id="tetrisScore">0</span></div>
                <div>等級: <span id="tetrisLevel">1</span></div>
            </div>
            <canvas id="tetrisCanvas" width="300" height="600"></canvas>
            <div class="tetris-controls">
                <button onclick="moveTetrisLeft()">←</button>
                <button onclick="rotateTetrisPiece()">↻</button>
                <button onclick="moveTetrisRight()">→</button>
                <button onclick="dropTetrisPiece()">↓</button>
            </div>
        </div>
    `;
    
    // 初始化遊戲邏輯
    initTetrisGameLogic();
}

function initTetrisGameLogic() {
    console.log('初始化俄羅斯方塊遊戲邏輯');
    gameData.tetris.gameStarted = true;
    // 這裡可以添加具體的遊戲邏輯
}

function moveTetrisLeft() {
    console.log('向左移動');
}

function moveTetrisRight() {
    console.log('向右移動');
}

function rotateTetrisPiece() {
    console.log('旋轉方塊');
}

function dropTetrisPiece() {
    console.log('下降方塊');
}

// 麻將遊戲邏輯
function initMahjongGame() {
    console.log('初始化麻將遊戲');
    
    const mahjongBoard = document.getElementById('mahjongBoard');
    if (!mahjongBoard) {
        console.error('找不到mahjongBoard元素');
        return;
    }
    
    // 創建麻將遊戲介面
    mahjongBoard.innerHTML = `
        <div class="mahjong-game">
            <div class="mahjong-info">
                <div>回合: <span id="mahjongTurn">1</span></div>
                <div>玩家: <span id="currentPlayer">1</span></div>
            </div>
            <div class="mahjong-table">
                <div class="player-hand" id="playerHand"></div>
                <div class="game-actions">
                    <button onclick="drawMahjongTile()">摸牌</button>
                    <button onclick="discardMahjongTile()">打牌</button>
                    <button onclick="declareMahjongWin()">胡牌</button>
                </div>
            </div>
        </div>
    `;
    
    // 初始化遊戲邏輯
    initMahjongGameLogic();
}

function initMahjongGameLogic() {
    console.log('初始化麻將遊戲邏輯');
    gameData.mahjong.gameStarted = true;
    // 這裡可以添加具體的遊戲邏輯
}

function drawMahjongTile() {
    console.log('摸牌');
}

function discardMahjongTile() {
    console.log('打牌');
}

function declareMahjongWin() {
    console.log('胡牌');
}

// 農場物語遊戲邏輯
function initFarmStoryGame() {
    console.log('初始化農場物語遊戲');
    
    // 初始化遊戲邏輯
    initFarmStoryGameLogic();
}

function initFarmStoryGameLogic() {
    console.log('初始化農場物語遊戲邏輯');
    gameData.farmStory.gameStarted = true;
    gameData.farmStory.currentLocation = 'farm';
    gameData.farmStory.selectedTool = 'hoe';
    gameData.farmStory.playerPosition = { x: 5, y: 5 };
    
    // 創建農田網格
    createFarmGrid();
    
    // 填充背包
    updateInventory();
    
    // 設置玩家位置
    updatePlayerPosition();
    
    // 添加鍵盤事件監聽
    document.addEventListener('keydown', handleGameKeyPress);
    
    // 更新顯示
    updateFarmDisplay();
    
    // 開始遊戲循環
    startGameLoop();
}

function createFarmGrid() {
    const farmGrid = document.getElementById('farmGrid');
    if (!farmGrid) return;
    
    farmGrid.innerHTML = '';
    
    // 創建12x10的農田網格
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 12; x++) {
            const tile = document.createElement('div');
            tile.className = 'farm-tile';
            tile.dataset.x = x;
            tile.dataset.y = y;
            tile.onclick = () => useTileAction(x, y);
            
            // 初始化土壤狀態
            if (!gameData.farmStory.farm.tiles) {
                gameData.farmStory.farm.tiles = {};
            }
            
            const tileKey = `${x},${y}`;
            if (!gameData.farmStory.farm.tiles[tileKey]) {
                gameData.farmStory.farm.tiles[tileKey] = {
                    tilled: false,
                    watered: false,
                    planted: false,
                    crop: null,
                    growthStage: 0,
                    plantedTime: null
                };
            }
            
            farmGrid.appendChild(tile);
        }
    }
    
    updateFarmGridDisplay();
}

function updateFarmGridDisplay() {
    const farmGrid = document.getElementById('farmGrid');
    if (!farmGrid) return;
    
    const tiles = farmGrid.querySelectorAll('.farm-tile');
    
    tiles.forEach(tile => {
        const x = parseInt(tile.dataset.x);
        const y = parseInt(tile.dataset.y);
        const tileKey = `${x},${y}`;
        const tileData = gameData.farmStory.farm.tiles[tileKey];
        
        // 重置類別
        tile.className = 'farm-tile';
        tile.innerHTML = '';
        
        if (tileData.planted && tileData.crop) {
            tile.classList.add('planted');
            
            // 根據生長階段顯示作物
            const growthStages = {
                potato: ['🟫', '🌱', '🌿', '🥔'],
                carrot: ['🟫', '🌱', '🌿', '🥕'],
                tomato: ['🟫', '🌱', '🌿', '🍅'],
                corn: ['🟫', '🌱', '🌿', '🌽']
            };
            
            const stages = growthStages[tileData.crop] || ['🟫', '🌱', '🌿', '🌾'];
            tile.innerHTML = stages[Math.min(tileData.growthStage, stages.length - 1)];
            
        } else if (tileData.tilled) {
            tile.classList.add('tilled');
            tile.innerHTML = '🟫';
        }
        
        if (tileData.watered && !tileData.planted) {
            tile.classList.add('watered');
        }
    });
}

function updateInventory() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    const seedInventory = document.getElementById('seedInventory');
    
    if (inventoryGrid) {
        inventoryGrid.innerHTML = `
            <div class="inventory-item" onclick="selectTool('hoe')">🔨</div>
            <div class="inventory-item" onclick="selectTool('watering')">💧</div>
            <div class="inventory-item" onclick="selectTool('axe')">🪓</div>
            <div class="inventory-item">🪵 ${gameData.farmStory.inventory.items.filter(i => i === 'wood').length}</div>
            <div class="inventory-item">🪨 ${gameData.farmStory.inventory.items.filter(i => i === 'stone').length}</div>
            <div class="inventory-item">🐟 ${gameData.farmStory.inventory.items.filter(i => i === 'fish').length}</div>
        `;
    }
    
    if (seedInventory) {
        seedInventory.innerHTML = `
            <div class="inventory-item" onclick="selectSeed('potato')">🥔</div>
            <div class="inventory-item" onclick="selectSeed('carrot')">🥕</div>
            <div class="inventory-item" onclick="selectSeed('tomato')">🍅</div>
            <div class="inventory-item" onclick="selectSeed('corn')">🌽</div>
        `;
    }
}

function updatePlayerPosition() {
    const player = document.getElementById('playerCharacter');
    const farmGrid = document.getElementById('farmGrid');
    
    if (!player || !farmGrid) return;
    
    const gridRect = farmGrid.getBoundingClientRect();
    const tileWidth = gridRect.width / 12;
    const tileHeight = gridRect.height / 10;
    
    const x = gameData.farmStory.playerPosition.x * tileWidth + tileWidth / 2 - 16;
    const y = gameData.farmStory.playerPosition.y * tileHeight + tileHeight / 2 - 16;
    
    player.style.left = x + 'px';
    player.style.top = y + 'px';
}

function handleGameKeyPress(event) {
    if (!gameData.farmStory.gameStarted) return;
    
    const player = gameData.farmStory.playerPosition;
    let moved = false;
    
    switch(event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (player.y > 0) {
                player.y--;
                moved = true;
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (player.y < 9) {
                player.y++;
                moved = true;
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (player.x > 0) {
                player.x--;
                moved = true;
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (player.x < 11) {
                player.x++;
                moved = true;
            }
            break;
        case ' ':
        case 'Enter':
            useTileAction(player.x, player.y);
            break;
    }
    
    if (moved) {
        updatePlayerPosition();
        event.preventDefault();
    }
}

function useTileAction(x, y) {
    const tileKey = `${x},${y}`;
    const tileData = gameData.farmStory.farm.tiles[tileKey];
    const tool = gameData.farmStory.selectedTool;
    
    console.log(`使用工具 ${tool} 在位置 (${x}, ${y})`);
    
    switch(tool) {
        case 'hoe':
            if (!tileData.tilled) {
                tileData.tilled = true;
                showNotification('鋤地完成', '土地已準備好種植！');
                playToolAnimation(x, y, '💨');
            }
            break;
            
        case 'watering':
            if (tileData.tilled && !tileData.watered) {
                tileData.watered = true;
                showNotification('澆水完成', '土地濕潤了！');
                playWaterAnimation(x, y);
            } else if (tileData.planted) {
                tileData.watered = true;
                showNotification('作物澆水', '作物得到了水分！');
                playWaterAnimation(x, y);
            }
            break;
            
        case 'seeds':
            if (tileData.tilled && !tileData.planted && gameData.farmStory.selectedSeed) {
                tileData.planted = true;
                tileData.crop = gameData.farmStory.selectedSeed;
                tileData.growthStage = 0;
                tileData.plantedTime = Date.now();
                showNotification('播種完成', `種植了${gameData.farmStory.selectedSeed}！`);
                playPlantAnimation(x, y);
            }
            break;
            
        case 'harvest':
            if (tileData.planted && tileData.growthStage >= 3) {
                const crop = tileData.crop;
                gameData.farmStory.inventory.crops.push(crop);
                gameData.farmStory.money += 10;
                
                // 重置土地
                tileData.planted = false;
                tileData.crop = null;
                tileData.growthStage = 0;
                tileData.watered = false;
                
                showNotification('收穫成功', `收穫了${crop}，獲得$10！`);
                playHarvestAnimation(x, y);
            }
            break;
    }
    
    updateFarmGridDisplay();
    updateFarmDisplay();
}

function selectTool(tool) {
    gameData.farmStory.selectedTool = tool;
    
    // 更新工具按鈕狀態
    document.querySelectorAll('.tool-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const toolButton = document.getElementById(`tool-${tool}`);
    if (toolButton) {
        toolButton.classList.add('active');
    }
    
    console.log('選擇工具:', tool);
}

function selectSeed(seed) {
    gameData.farmStory.selectedSeed = seed;
    gameData.farmStory.selectedTool = 'seeds';
    
    // 更新種子選擇狀態
    document.querySelectorAll('#seedInventory .inventory-item').forEach(item => {
        item.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // 激活播種工具
    selectTool('seeds');
    
    console.log('選擇種子:', seed);
}

function changeLocation(location) {
    gameData.farmStory.currentLocation = location;
    
    // 更新位置按鈕狀態
    document.querySelectorAll('.location-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 播放場景轉換動畫
    playSceneTransition();
    
    setTimeout(() => {
        updateLocationScene(location);
    }, 500);
    
    console.log('切換到:', location);
}

function updateLocationScene(location) {
    const farmGrid = document.getElementById('farmGrid');
    if (!farmGrid) return;
    
    switch(location) {
        case 'farm':
            farmGrid.style.background = '#8BC34A';
            updateFarmGridDisplay();
            break;
        case 'house':
            farmGrid.style.background = '#8D6E63';
            createHouseScene();
            break;
        case 'town':
            farmGrid.style.background = '#FDD835';
            createTownScene();
            break;
        case 'forest':
            farmGrid.style.background = '#4CAF50';
            createForestScene();
            break;
    }
}

function createHouseScene() {
    const farmGrid = document.getElementById('farmGrid');
    farmGrid.innerHTML = `
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
            <h3>🏠 你的家</h3>
            <p>一個溫馨的小屋</p>
            <button onclick="restoreEnergy()" class="tool-button">💤 睡覺恢復體力</button>
            <button onclick="saveGame()" class="tool-button">💾 保存遊戲</button>
        </div>
    `;
}

function createTownScene() {
    const farmGrid = document.getElementById('farmGrid');
    farmGrid.innerHTML = `
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
            <h3>🏘️ 城鎮</h3>
            <p>熱鬧的小鎮中心</p>
            <button onclick="visitShop()" class="tool-button">🏪 商店</button>
            <button onclick="talkToMayor()" class="tool-button">👨‍💼 拜訪市長</button>
            <button onclick="visitBlacksmith()" class="tool-button">⚒️ 鐵匠舖</button>
        </div>
    `;
}

function createForestScene() {
    const farmGrid = document.getElementById('farmGrid');
    farmGrid.innerHTML = `
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
            <h3>🌲 森林</h3>
            <p>神秘的深林</p>
            <button onclick="chopWood()" class="tool-button">🪓 砍伐木材</button>
            <button onclick="forage()" class="tool-button">🍄 採集野果</button>
            <button onclick="hunt()" class="tool-button">🏹 狩獵</button>
        </div>
    `;
}

function startGameLoop() {
    setInterval(() => {
        if (!gameData.farmStory.gameStarted) return;
        
        // 作物生長邏輯
        updateCropGrowth();
        
        // 時間推進
        updateGameTime();
        
    }, 5000); // 每5秒更新一次
}

function updateCropGrowth() {
    const tiles = gameData.farmStory.farm.tiles;
    let hasGrowth = false;
    
    Object.keys(tiles).forEach(tileKey => {
        const tile = tiles[tileKey];
        
        if (tile.planted && tile.watered && tile.growthStage < 3) {
            const timeSincePlanted = Date.now() - tile.plantedTime;
            const growthTime = 15000; // 15秒一個階段
            
            const expectedStage = Math.floor(timeSincePlanted / growthTime);
            
            if (expectedStage > tile.growthStage) {
                tile.growthStage = Math.min(expectedStage, 3);
                tile.watered = false; // 需要重新澆水
                hasGrowth = true;
            }
        }
    });
    
    if (hasGrowth) {
        updateFarmGridDisplay();
        showNotification('作物生長', '有作物長大了！');
    }
}

function farmAction(action) {
    console.log('執行農場動作:', action);
    
    switch(action) {
        case 'plant':
            plantSeeds();
            break;
        case 'water':
            waterCrops();
            break;
        case 'harvest':
            harvestCrops();
            break;
    }
    
    updateFarmDisplay();
}

function plantSeeds() {
    console.log('種植種子');
    // 模擬種植邏輯
}

function waterCrops() {
    console.log('澆水');
    // 模擬澆水邏輯
}

function harvestCrops() {
    console.log('收穫作物');
    // 模擬收穫邏輯
}

function goToLocation(location) {
    console.log('前往:', location);
    gameData.farmStory.currentLocation = location;
    updateLocationDisplay(location);
}

function updateLocationDisplay(location) {
    const gameScene = document.getElementById('gameScene');
    if (!gameScene) return;
    
    const locations = {
        farm: { title: '農場', description: '這是你的農場，你可以在這裡種植作物、照料動物。' },
        town: { title: '城鎮', description: '熱鬧的城鎮，有商店和村民。' },
        forest: { title: '森林', description: '茂密的森林，可以採集木材和野果。' },
        mine: { title: '礦場', description: '深邃的礦場，可以挖掘礦石和寶石。' }
    };
    
    const locationInfo = locations[location];
    gameScene.innerHTML = `
        <div class="scene-title">${locationInfo.title}</div>
        <div class="scene-description">${locationInfo.description}</div>
        <div class="scene-actions">
            <button onclick="exploreLocation('${location}')">探索</button>
            <button onclick="useAIAssistant()">使用AI助手</button>
        </div>
    `;
}

function exploreLocation(location) {
    console.log('探索:', location);
    // 模擬探索邏輯
}

function useAIAssistant() {
    console.log('使用AI助手');
    
    if (gameData.farmStory.aiUsesLeft <= 0) {
        alert('AI助手次數已用完！');
        return;
    }
    
    gameData.farmStory.aiUsesLeft--;
    updateFarmDisplay();
    
    // 模擬AI助手回應
    alert('AI助手: 我建議你先種植一些基本作物，然後賺取金錢來升級工具。');
}

function updateFarmDisplay() {
    // 更新顯示
    const moneyElement = document.getElementById('playerMoney');
    const energyBar = document.getElementById('energyBar');
    const healthBar = document.getElementById('healthBar');
    const aiUsesElement = document.getElementById('aiUsesLeft');
    
    if (moneyElement) moneyElement.textContent = gameData.farmStory.money;
    if (energyBar) energyBar.style.width = gameData.farmStory.energy + '%';
    if (healthBar) healthBar.style.width = gameData.farmStory.health + '%';
    if (aiUsesElement) aiUsesElement.textContent = gameData.farmStory.aiUsesLeft;
}

// 動畫效果函數
function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<strong>${title}</strong><br>${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function playToolAnimation(x, y, effect) {
    const farmGrid = document.getElementById('farmGrid');
    if (!farmGrid) return;
    
    const gridRect = farmGrid.getBoundingClientRect();
    const tileWidth = gridRect.width / 12;
    const tileHeight = gridRect.height / 10;
    
    const animation = document.createElement('div');
    animation.style.position = 'absolute';
    animation.style.left = (x * tileWidth + tileWidth / 2) + 'px';
    animation.style.top = (y * tileHeight + tileHeight / 2) + 'px';
    animation.style.fontSize = '24px';
    animation.style.zIndex = '20';
    animation.style.pointerEvents = 'none';
    animation.textContent = effect;
    
    farmGrid.appendChild(animation);
    
    setTimeout(() => {
        animation.remove();
    }, 1000);
}

function playWaterAnimation(x, y) {
    const farmGrid = document.getElementById('farmGrid');
    if (!farmGrid) return;
    
    const tile = farmGrid.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    if (!tile) return;
    
    const waterEffect = document.createElement('div');
    waterEffect.className = 'water-effect';
    tile.appendChild(waterEffect);
    
    setTimeout(() => {
        waterEffect.remove();
    }, 500);
}

function playPlantAnimation(x, y) {
    playToolAnimation(x, y, '🌱');
}

function playHarvestAnimation(x, y) {
    playToolAnimation(x, y, '✨');
}

function playSceneTransition() {
    const farmGame = document.getElementById('farmStoryGame');
    if (!farmGame) return;
    
    const transition = document.createElement('div');
    transition.className = 'scene-transition';
    farmGame.appendChild(transition);
    
    setTimeout(() => {
        transition.remove();
    }, 1000);
}

// NPC 互動函數
function visitShop() {
    showNotification('商店', '歡迎來到瑪莉的商店！\n種子: $5\n工具升級: $50');
}

function talkToMayor() {
    showNotification('市長湯姆', '歡迎來到我們的小鎮！你的農場經營得如何？');
    gameData.farmStory.npcRelations['Mayor Tom'].points += 1;
    updateNPCRelations();
}

function visitBlacksmith() {
    showNotification('鐵匠傑克', '需要升級工具嗎？我這裡有最好的鐵匠工藝！');
}

function restoreEnergy() {
    gameData.farmStory.energy = 100;
    gameData.farmStory.health = 100;
    showNotification('休息完成', '體力和健康已完全恢復！');
    updateFarmDisplay();
}

function chopWood() {
    if (gameData.farmStory.energy >= 10) {
        gameData.farmStory.energy -= 10;
        gameData.farmStory.inventory.items.push('wood');
        gameData.farmStory.money += 5;
        showNotification('砍伐成功', '獲得了木材，賺了$5！');
        updateFarmDisplay();
        updateInventory();
    } else {
        showNotification('體力不足', '你太累了，需要休息！');
    }
}

function forage() {
    if (gameData.farmStory.energy >= 5) {
        gameData.farmStory.energy -= 5;
        const items = ['berry', 'mushroom', 'herb'];
        const item = items[Math.floor(Math.random() * items.length)];
        gameData.farmStory.inventory.items.push(item);
        showNotification('採集成功', `發現了${item}！`);
        updateFarmDisplay();
        updateInventory();
    } else {
        showNotification('體力不足', '你太累了，需要休息！');
    }
}

function hunt() {
    if (gameData.farmStory.energy >= 15) {
        gameData.farmStory.energy -= 15;
        if (Math.random() > 0.5) {
            gameData.farmStory.inventory.items.push('meat');
            gameData.farmStory.money += 15;
            showNotification('狩獵成功', '捕獲了獵物，賺了$15！');
        } else {
            showNotification('狩獵失敗', '這次沒有收穫...');
        }
        updateFarmDisplay();
        updateInventory();
    } else {
        showNotification('體力不足', '狩獵需要更多體力！');
    }
}

function saveGame() {
    localStorage.setItem('farmStoryData', JSON.stringify(gameData.farmStory));
    showNotification('遊戲已保存', '進度已保存到本地存儲！');
}

function updateNPCRelations() {
    const npcList = document.getElementById('npcList');
    if (!npcList) return;
    
    let html = '<div style="font-size: 10px; color: #ccc;">';
    Object.keys(gameData.farmStory.npcRelations).forEach(npc => {
        const relation = gameData.farmStory.npcRelations[npc];
        const hearts = '♥️'.repeat(relation.level) + '♡'.repeat(5 - relation.level);
        html += `${npc}: ${hearts}<br>`;
    });
    html += '</div>';
    
    npcList.innerHTML = html;
}

function updateGameTime() {
    // 簡單的時間系統
    if (!gameData.farmStory.gameTime) {
        gameData.farmStory.gameTime = { day: 1, hour: 6 };
    }
    
    gameData.farmStory.gameTime.hour += 1;
    if (gameData.farmStory.gameTime.hour >= 24) {
        gameData.farmStory.gameTime.hour = 0;
        gameData.farmStory.gameTime.day += 1;
    }
}

// 初始化函數
function initializeGames() {
    console.log('初始化遊戲系統');
    
    // 確保所有遊戲數據都已初始化
    if (!gameData.farmStory.gameStarted) {
        console.log('農場物語數據已準備');
    }
    if (!gameData.tetris.gameStarted) {
        console.log('俄羅斯方塊數據已準備');
    }
    if (!gameData.mahjong.gameStarted) {
        console.log('麻將數據已準備');
    }
}

// 更新心形體力條顯示
function updateHeartDisplay() {
    const energyContainer = document.getElementById('energyHearts');
    const healthContainer = document.getElementById('healthHearts');
    
    if (!energyContainer || !healthContainer || !gameData?.farmStory) return;
    
    // 更新體力心形
    const energyHearts = Math.ceil(gameData.farmStory.player.energy / 10);
    const maxEnergyHearts = 10;
    energyContainer.innerHTML = '';
    
    for (let i = 0; i < maxEnergyHearts; i++) {
        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.textContent = '♥';
        
        if (i < energyHearts) {
            heart.classList.add('full');
        } else {
            heart.classList.add('empty');
        }
        
        energyContainer.appendChild(heart);
    }
    
    // 更新健康心形
    const healthHearts = Math.ceil(gameData.farmStory.player.health / 10);
    const maxHealthHearts = 10;
    healthContainer.innerHTML = '';
    
    for (let i = 0; i < maxHealthHearts; i++) {
        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.textContent = '♥';
        
        if (i < healthHearts) {
            heart.classList.add('full');
        } else {
            heart.classList.add('empty');
        }
        
        healthContainer.appendChild(heart);
    }
    
    // 更新金錢顯示
    const moneyDisplay = document.getElementById('playerMoney');
    if (moneyDisplay) {
        moneyDisplay.textContent = gameData.farmStory.player.money;
    }
}

// 場景切換系統
function changeGameLocation(location) {
    console.log(`切換到場景: ${location}`);
    
    if (!gameData.farmStory) return;
    
    gameData.farmStory.player.location = location;
    
    // 更新場景顯示
    updateLocationScene(location);
    
    // 更新位置信息
    const locationInfo = document.getElementById('currentLocationInfo');
    if (locationInfo) {
        const locationNames = {
            farm: '農場',
            town: '城鎮',
            shop: '商店',
            forest: '森林',
            mine: '礦山',
            house: '家'
        };
        locationInfo.textContent = locationNames[location] || location;
    }
    
    showNotification('場景切換', `已移動到${locationNames[location] || location}`);
}

// 更新場景內容
function updateLocationScene(location) {
    const gameField = document.querySelector('.game-field');
    if (!gameField) return;
    
    // 清除現有內容
    gameField.innerHTML = '';
    
    switch(location) {
        case 'farm':
            createFarmScene();
            break;
        case 'town':
            createTownScene();
            break;
        case 'shop':
            createShopScene();
            break;
        case 'forest':
            createForestScene();
            break;
        case 'mine':
            createMineScene();
            break;
        case 'house':
            createHouseScene();
            break;
        default:
            createFarmScene();
    }
}

// 創建農場場景
function createFarmScene() {
    const gameField = document.querySelector('.game-field');
    gameField.innerHTML = `
        <div class="scene-container farm-scene">
            <div class="scene-header">
                <h3>🚜 我的農場</h3>
                <div class="weather-info">☀️ 晴天</div>
            </div>
            <div class="farm-grid" id="farmGrid"></div>
            <div class="scene-actions">
                <button onclick="changeGameLocation('town')" class="location-btn">🏘️ 前往城鎮</button>
                <button onclick="changeGameLocation('forest')" class="location-btn">🌲 前往森林</button>
                <button onclick="changeGameLocation('house')" class="location-btn">🏠 回家</button>
            </div>
        </div>
    `;
    createFarmGrid();
}

// 創建城鎮場景
function createTownScene() {
    const gameField = document.querySelector('.game-field');
    gameField.innerHTML = `
        <div class="scene-container town-scene">
            <div class="scene-header">
                <h3>🏘️ 和睦小鎮</h3>
                <div class="time-info">第${gameData.farmStory.gameTime?.day || 1}天</div>
            </div>
            <div class="town-grid">
                <div class="building shop" onclick="changeGameLocation('shop')">
                    <div class="building-icon">🏪</div>
                    <div class="building-name">瑪麗商店</div>
                </div>
                <div class="building blacksmith" onclick="talkToNPC('blacksmith')">
                    <div class="building-icon">🔨</div>
                    <div class="building-name">鐵匠鋪</div>
                </div>
                <div class="building mayor" onclick="talkToNPC('mayor')">
                    <div class="building-icon">🏛️</div>
                    <div class="building-name">市政府</div>
                </div>
                <div class="building clinic" onclick="talkToNPC('doctor')">
                    <div class="building-icon">🏥</div>
                    <div class="building-name">診所</div>
                </div>
                <div class="building fountain">
                    <div class="building-icon">⛲</div>
                    <div class="building-name">許願池</div>
                </div>
                <div class="building library" onclick="showNotification('圖書館', '今天休館中')">
                    <div class="building-icon">📚</div>
                    <div class="building-name">圖書館</div>
                </div>
            </div>
            <div class="scene-actions">
                <button onclick="changeGameLocation('farm')" class="location-btn">🚜 回農場</button>
                <button onclick="changeGameLocation('mine')" class="location-btn">⛏️ 前往礦山</button>
            </div>
        </div>
    `;
}

// 創建商店場景
function createShopScene() {
    const gameField = document.querySelector('.game-field');
    gameField.innerHTML = `
        <div class="scene-container shop-scene">
            <div class="scene-header">
                <h3>🏪 瑪麗商店</h3>
                <div class="shopkeeper">👩‍💼 店主瑪麗</div>
            </div>
            <div class="shop-content">
                <div class="shop-greeting">
                    <p>"歡迎光臨！今天有什麼需要的嗎？"</p>
                </div>
                <div class="shop-categories">
                    <div class="shop-category">
                        <h4>🌱 種子</h4>
                        <div class="shop-items">
                            <div class="shop-item" onclick="buyItem('potato_seeds', 10)">
                                <span>🥔 馬鈴薯種子</span>
                                <span class="price">10G</span>
                            </div>
                            <div class="shop-item" onclick="buyItem('carrot_seeds', 15)">
                                <span>🥕 胡蘿蔔種子</span>
                                <span class="price">15G</span>
                            </div>
                            <div class="shop-item" onclick="buyItem('tomato_seeds', 20)">
                                <span>🍅 番茄種子</span>
                                <span class="price">20G</span>
                            </div>
                        </div>
                    </div>
                    <div class="shop-category">
                        <h4>🔧 工具</h4>
                        <div class="shop-items">
                            <div class="shop-item" onclick="buyItem('watering_can', 50)">
                                <span>💧 澆水壺</span>
                                <span class="price">50G</span>
                            </div>
                            <div class="shop-item" onclick="buyItem('fertilizer', 25)">
                                <span>🌿 肥料</span>
                                <span class="price">25G</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="scene-actions">
                <button onclick="talkToNPC('shopkeeper')" class="npc-btn">💬 和瑪麗聊天</button>
                <button onclick="changeGameLocation('town')" class="location-btn">🏘️ 回城鎮</button>
            </div>
        </div>
    `;
}

// 創建森林場景
function createForestScene() {
    const gameField = document.querySelector('.game-field');
    gameField.innerHTML = `
        <div class="scene-container forest-scene">
            <div class="scene-header">
                <h3>🌲 神祕森林</h3>
                <div class="danger-level">危險度: 低</div>
            </div>
            <div class="forest-content">
                <div class="forest-description">
                    <p>茂密的森林中充滿了各種資源...</p>
                </div>
                <div class="forest-grid">
                    <div class="forest-area" onclick="forageAction('berries')">
                        <div class="area-icon">🫐</div>
                        <div class="area-name">莓果叢</div>
                    </div>
                    <div class="forest-area" onclick="forageAction('mushrooms')">
                        <div class="area-icon">🍄</div>
                        <div class="area-name">蘑菇區</div>
                    </div>
                    <div class="forest-area" onclick="forageAction('herbs')">
                        <div class="area-icon">🌿</div>
                        <div class="area-name">藥草地</div>
                    </div>
                    <div class="forest-area" onclick="forageAction('wood')">
                        <div class="area-icon">🪵</div>
                        <div class="area-name">伐木區</div>
                    </div>
                    <div class="forest-area" onclick="forageAction('spring')">
                        <div class="area-icon">💧</div>
                        <div class="area-name">清泉</div>
                    </div>
                    <div class="forest-area" onclick="forageAction('cave')">
                        <div class="area-icon">🕳️</div>
                        <div class="area-name">神祕洞穴</div>
                    </div>
                </div>
            </div>
            <div class="scene-actions">
                <button onclick="changeGameLocation('town')" class="location-btn">🏘️ 回城鎮</button>
                <button onclick="changeGameLocation('farm')" class="location-btn">🚜 回農場</button>
            </div>
        </div>
    `;
}

// 創建礦山場景
function createMineScene() {
    const gameField = document.querySelector('.game-field');
    gameField.innerHTML = `
        <div class="scene-container mine-scene">
            <div class="scene-header">
                <h3>⛏️ 廢棄礦山</h3>
                <div class="depth-info">深度: 地面層</div>
            </div>
            <div class="mine-content">
                <div class="mine-description">
                    <p>古老的礦山中蘊藏著珍貴的礦物...</p>
                </div>
                <div class="mine-grid">
                    <div class="mine-area" onclick="mineAction('copper')">
                        <div class="area-icon">🟤</div>
                        <div class="area-name">銅礦脈</div>
                    </div>
                    <div class="mine-area" onclick="mineAction('iron')">
                        <div class="area-icon">⚫</div>
                        <div class="area-name">鐵礦脈</div>
                    </div>
                    <div class="mine-area" onclick="mineAction('coal')">
                        <div class="area-icon">⚫</div>
                        <div class="area-name">煤炭層</div>
                    </div>
                    <div class="mine-area" onclick="mineAction('gems')">
                        <div class="area-icon">💎</div>
                        <div class="area-name">寶石區</div>
                    </div>
                </div>
            </div>
            <div class="scene-actions">
                <button onclick="changeGameLocation('town')" class="location-btn">🏘️ 回城鎮</button>
                <button onclick="restoreEnergy()" class="action-btn">💤 休息恢復體力</button>
            </div>
        </div>
    `;
}

// 購買物品
function buyItem(itemType, price) {
    if (!gameData.farmStory || gameData.farmStory.player.money < price) {
        showNotification('購買失敗', '金錢不足！');
        return;
    }
    
    gameData.farmStory.player.money -= price;
    
    // 添加物品到背包
    if (!gameData.farmStory.inventory.items) {
        gameData.farmStory.inventory.items = [];
    }
    gameData.farmStory.inventory.items.push(itemType);
    
    updateHeartDisplay();
    showNotification('購買成功', `獲得了${itemType}！`);
}

// 採集行動
function forageAction(type) {
    if (!gameData.farmStory || gameData.farmStory.player.energy < 10) {
        showNotification('體力不足', '需要休息一下！');
        return;
    }
    
    gameData.farmStory.player.energy -= 10;
    
    const rewards = {
        berries: { item: '野莓', emoji: '🫐', money: 5 },
        mushrooms: { item: '蘑菇', emoji: '🍄', money: 8 },
        herbs: { item: '藥草', emoji: '🌿', money: 12 },
        wood: { item: '木材', emoji: '🪵', money: 3 },
        spring: { item: '清水', emoji: '💧', energy: 20 },
        cave: { item: '神祕寶石', emoji: '💎', money: 50 }
    };
    
    const reward = rewards[type];
    if (reward) {
        if (reward.money) {
            gameData.farmStory.player.money += reward.money;
        }
        if (reward.energy) {
            gameData.farmStory.player.energy = Math.min(100, gameData.farmStory.player.energy + reward.energy);
        }
        
        showNotification('採集成功', `獲得了${reward.emoji} ${reward.item}！`);
        updateHeartDisplay();
    }
}

// 挖礦行動
function mineAction(type) {
    if (!gameData.farmStory || gameData.farmStory.player.energy < 15) {
        showNotification('體力不足', '挖礦需要更多體力！');
        return;
    }
    
    gameData.farmStory.player.energy -= 15;
    
    const ores = {
        copper: { item: '銅礦', emoji: '🟤', money: 10 },
        iron: { item: '鐵礦', emoji: '⚫', money: 20 },
        coal: { item: '煤炭', emoji: '⚫', money: 15 },
        gems: { item: '寶石', emoji: '💎', money: 100 }
    };
    
    const ore = ores[type];
    if (ore) {
        // 隨機成功率
        if (Math.random() > 0.3) {
            gameData.farmStory.player.money += ore.money;
            showNotification('挖礦成功', `獲得了${ore.emoji} ${ore.item}！`);
        } else {
            showNotification('挖礦失敗', '這次沒有找到任何東西...');
        }
        updateHeartDisplay();
    }
}

// 與NPC對話
function talkToNPC(npcType) {
    if (!gameData.farmStory.aiUsesLeft || gameData.farmStory.aiUsesLeft <= 0) {
        showNotification('AI助手', 'AI助手使用次數已用完！');
        return;
    }
    
    const npcs = {
        mayor: {
            name: '市長湯姆',
            emoji: '👨‍💼',
            dialogues: [
                '歡迎來到我們的小鎮！',
                '農場經營得如何？',
                '記得多和鎮民互動哦！'
            ]
        },
        shopkeeper: {
            name: '店主瑪麗',
            emoji: '👩‍💼',
            dialogues: [
                '有什麼需要採購的嗎？',
                '新鮮的種子剛到貨！',
                '努力工作，好好賺錢！'
            ]
        },
        blacksmith: {
            name: '鐵匠傑克',
            emoji: '👨‍🔧',
            dialogues: [
                '需要升級工具嗎？',
                '好的工具能事半功倍！',
                '帶礦石來，我幫你打造裝備！'
            ]
        },
        doctor: {
            name: '醫生莉莉',
            emoji: '👩‍⚕️',
            dialogues: [
                '記得保持健康哦！',
                '累了就要好好休息！',
                '需要治療嗎？'
            ]
        }
    };
    
    const npc = npcs[npcType];
    if (npc) {
        gameData.farmStory.aiUsesLeft--;
        const randomDialogue = npc.dialogues[Math.floor(Math.random() * npc.dialogues.length)];
        
        showNotification(`${npc.emoji} ${npc.name}`, randomDialogue);
        
        // 更新AI使用次數顯示
        const aiCounter = document.getElementById('aiUsesLeft');
        if (aiCounter) {
            aiCounter.textContent = gameData.farmStory.aiUsesLeft;
        }
    }
}

// 俄羅斯方塊控制函數
function moveTetrisLeft() {
    if (gameData.tetris.gameStarted && !gameData.tetris.gameOver && gameData.tetris.currentPiece) {
        if (canMoveTetrisPiece(-1, 0)) {
            gameData.tetris.currentPiece.x--;
            renderTetrisBoard();
        }
    }
}

function moveTetrisRight() {
    if (gameData.tetris.gameStarted && !gameData.tetris.gameOver && gameData.tetris.currentPiece) {
        if (canMoveTetrisPiece(1, 0)) {
            gameData.tetris.currentPiece.x++;
            renderTetrisBoard();
        }
    }
}

function rotateTetrisPiece() {
    if (!gameData.tetris.gameStarted || gameData.tetris.gameOver || !gameData.tetris.currentPiece) return;
    
    const piece = gameData.tetris.currentPiece;
    const rotatedShape = rotateMatrix(piece.shape);
    
    // 暫時應用旋轉
    const originalShape = piece.shape;
    piece.shape = rotatedShape;
    
    // 檢查旋轉是否有效
    if (canMoveTetrisPiece(0, 0)) {
        renderTetrisBoard();
    } else {
        // 恢復原始形狀
        piece.shape = originalShape;
    }
}

function dropTetrisPiece() {
    if (!gameData.tetris.gameStarted || gameData.tetris.gameOver || !gameData.tetris.currentPiece) return;
    
    while (canMoveTetrisPiece(0, 1)) {
        gameData.tetris.currentPiece.y++;
        gameData.tetris.score += 2;
    }
    renderTetrisBoard();
    updateTetrisDisplay();
}

function rotateMatrix(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0));
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            rotated[j][rows - 1 - i] = matrix[i][j];
        }
    }
    
    return rotated;
}

// 麻將控制函數
function drawMahjongTile() {
    console.log('摸牌');
    if (!gameData.mahjong.gameStarted) {
        gameData.mahjong.gameStarted = true;
        initMahjongHand();
    }
    
    const tileSet = gameData.mahjong.tileSet;
    const randomTile = tileSet[Math.floor(Math.random() * tileSet.length)];
    gameData.mahjong.playerHand.push(randomTile);
    renderMahjongHand();
    updateMahjongDisplay();
}

function discardMahjongTile() {
    console.log('打牌');
    if (gameData.mahjong.selectedTile && gameData.mahjong.playerHand.length > 0) {
        const tileIndex = gameData.mahjong.playerHand.indexOf(gameData.mahjong.selectedTile);
        if (tileIndex > -1) {
            gameData.mahjong.playerHand.splice(tileIndex, 1);
            gameData.mahjong.discardPile.push(gameData.mahjong.selectedTile);
            gameData.mahjong.selectedTile = null;
            renderMahjongHand();
            updateMahjongDisplay();
        }
    } else {
        showNotification('打牌', '請先選擇要打出的牌！');
    }
}

function declareMahjongWin() {
    console.log('胡牌');
    if (gameData.mahjong.playerHand.length >= 14) {
        alert('恭喜胡牌！分數 +1000');
        gameData.mahjong.score += 1000;
        gameData.mahjong.round++;
        gameData.mahjong.playerHand = [];
        gameData.mahjong.discardPile = [];
        renderMahjongHand();
        updateMahjongDisplay();
    } else {
        showNotification('胡牌', '手牌不足，無法胡牌！');
    }
}

function initMahjongHand() {
    // 初始化手牌
    for (let i = 0; i < 13; i++) {
        const randomTile = gameData.mahjong.tileSet[Math.floor(Math.random() * gameData.mahjong.tileSet.length)];
        gameData.mahjong.playerHand.push(randomTile);
    }
    renderMahjongHand();
}

function renderMahjongHand() {
    const boardElement = document.getElementById('mahjongBoard');
    if (!boardElement) return;
    
    boardElement.innerHTML = `
        <div class="mahjong-hand">
            <h6>玩家手牌 (${gameData.mahjong.playerHand.length}/17)：</h6>
            <div class="mahjong-tiles">
                ${gameData.mahjong.playerHand.map((tile, index) => 
                    `<div class="mahjong-tile ${gameData.mahjong.selectedTile === tile ? 'selected' : ''}" 
                          onclick="selectMahjongTile('${tile}', ${index})">${tile}</div>`
                ).join('')}
            </div>
        </div>
        <div class="mahjong-discard">
            <h6>牌河 (${gameData.mahjong.discardPile.length})：</h6>
            <div class="discard-tiles">
                ${gameData.mahjong.discardPile.map(tile => 
                    `<span class="discarded-tile">${tile}</span>`
                ).join('')}
            </div>
        </div>
    `;
}

function selectMahjongTile(tile, index) {
    gameData.mahjong.selectedTile = tile;
    renderMahjongHand();
}

function updateMahjongDisplay() {
    const scoreElement = document.getElementById('mahjongScore');
    const roundElement = document.getElementById('mahjongRound');
    
    if (scoreElement) scoreElement.textContent = gameData.mahjong.score;
    if (roundElement) roundElement.textContent = gameData.mahjong.round;
}

// 當頁面載入時初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('遊戲系統已載入');
    initializeGames();
});