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
        case 'farm-story':
            loadFarmStoryGame();
            break;
        default:
            gameContainer.innerHTML = `
                <div class="alert alert-warning">
                    <h5>遊戲類型不支援</h5>
                    <p>請選擇支援的遊戲類型。</p>
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
            <div id="tetrisBoard" class="tetris-board"></div>
        </div>
    `;
    startTetrisInPanel();
}

function loadMahjongGame() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div class="mahjong-container">
            <h5 class="text-center mb-3">麻將</h5>
            <div id="mahjongBoard" class="mahjong-board"></div>
        </div>
    `;
    startMahjongInPanel();
}

function loadFarmStoryGame() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div class="farm-story-container">
            <h5 class="text-center mb-3">農場物語</h5>
            <div id="farmStoryBoard" class="farm-story-board"></div>
        </div>
    `;
    startFarmStoryInPanel();
}

// 全域遊戲變數
let gameData = {
    farmStory: {
        aiUsesLeft: 10,
        playerName: '小農夫',
        money: 100,
        health: 100,
        energy: 100,
        currentTool: 'hoe',
        currentSeed: 'potato',
        currentLocation: 'farm',
        inventory: {
            tools: ['hoe', 'watering_can', 'axe', 'pickaxe', 'fishing_rod'],
            seeds: ['potato', 'carrot', 'tomato', 'corn'],
            items: ['wood', 'stone', 'fish'],
            crops: []
        },
        npcRelations: {
            'Mayor Tom': { level: 1, points: 0 },
            'Shopkeeper Mary': { level: 1, points: 0 },
            'Blacksmith Jack': { level: 1, points: 0 },
            'Doctor Lily': { level: 1, points: 0 }
        },
        farm: {
            crops: {},
            animals: [],
            buildings: []
        },
        gameStarted: false
    },
    tetris: {
        board: [],
        currentPiece: null,
        score: 0,
        level: 1,
        gameStarted: false
    },
    mahjong: {
        tiles: [],
        playerHand: [],
        aiHands: [[], [], []],
        currentPlayer: 0,
        gameStarted: false
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
    
    const farmStoryBoard = document.getElementById('farmStoryBoard');
    if (!farmStoryBoard) {
        console.error('找不到farmStoryBoard元素');
        return;
    }
    
    // 創建農場物語遊戲介面
    farmStoryBoard.innerHTML = `
        <div class="farm-story-game">
            <div class="farm-game-header">
                <div class="player-info">
                    <span>金錢: $<span id="playerMoney">100</span></span>
                    <span>體力: <span id="playerEnergy">100</span></span>
                    <span>健康: <span id="playerHealth">100</span></span>
                </div>
                <div class="ai-counter">
                    AI助手剩餘次數: <span id="aiUsesLeft">10</span>
                </div>
            </div>
            <div class="farm-main-area">
                <div class="game-scene" id="gameScene">
                    <div class="scene-title">農場</div>
                    <div class="scene-description">這是你的農場，你可以在這裡種植作物、照料動物。</div>
                    <div class="scene-actions">
                        <button onclick="farmAction('plant')">種植</button>
                        <button onclick="farmAction('water')">澆水</button>
                        <button onclick="farmAction('harvest')">收穫</button>
                    </div>
                </div>
                <div class="game-inventory">
                    <div class="inventory-title">背包</div>
                    <div class="inventory-items" id="inventoryItems">
                        <div class="item">鋤頭</div>
                        <div class="item">澆水器</div>
                        <div class="item">種子</div>
                    </div>
                </div>
            </div>
            <div class="farm-navigation">
                <button onclick="goToLocation('farm')">農場</button>
                <button onclick="goToLocation('town')">城鎮</button>
                <button onclick="goToLocation('forest')">森林</button>
                <button onclick="goToLocation('mine')">礦場</button>
            </div>
        </div>
    `;
    
    // 初始化遊戲邏輯
    initFarmStoryGameLogic();
}

function initFarmStoryGameLogic() {
    console.log('初始化農場物語遊戲邏輯');
    gameData.farmStory.gameStarted = true;
    updateFarmDisplay();
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
    const energyElement = document.getElementById('playerEnergy');
    const healthElement = document.getElementById('playerHealth');
    const aiUsesElement = document.getElementById('aiUsesLeft');
    
    if (moneyElement) moneyElement.textContent = gameData.farmStory.money;
    if (energyElement) energyElement.textContent = gameData.farmStory.energy;
    if (healthElement) healthElement.textContent = gameData.farmStory.health;
    if (aiUsesElement) aiUsesElement.textContent = gameData.farmStory.aiUsesLeft;
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

// 當頁面載入時初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('遊戲系統已載入');
    initializeGames();
});