/**
 * 獨立遊戲系統 - 不依賴AI的固定劇情遊戲
 */

// 全域遊戲變數
let gameData = {
    farmStory: {
        aiUsesLeft: 10,
        playerName: '小農夫',
        money: 100,
        crops: [],
        tools: ['基礎鋤頭', '基礎澆水壺'],
        currentScene: 'village',
        relationships: {
            '村長湯姆': 0,
            '商店瑪麗': 0,
            '鐵匠傑克': 0,
            '醫生莉莉': 0
        }
    }
};

// 全域遊戲載入函數
function loadGame(gameType) {
    const gameInfo = document.getElementById('gameInfo');
    const gameControls = document.getElementById('gameControls');
    
    // 隱藏歡迎畫面
    const gameWelcome = document.getElementById('gameWelcome');
    if (gameWelcome) gameWelcome.style.display = 'none';
    
    // 隱藏所有遊戲容器
    const allGames = ['tetrisGame', 'mahjongGame', 'farmStoryGame'];
    allGames.forEach(gameId => {
        const gameElement = document.getElementById(gameId);
        if (gameElement) gameElement.style.display = 'none';
    });
    
    // 根據遊戲類型載入不同的遊戲
    switch(gameType) {
        case 'tetris':
            document.getElementById('tetrisGame').style.display = 'block';
            loadTetrisGame();
            break;
        case 'mahjong':
            document.getElementById('mahjongGame').style.display = 'block';
            loadMahjongGame();
            break;
        case 'farm':
            document.getElementById('farmStoryGame').style.display = 'block';
            loadFarmStoryGame();
            break;
        default:
            gameContainer.innerHTML = '<div class="text-center text-muted"><p>遊戲載入失敗</p></div>';
            break;
    }
}

function loadTetrisGame() {
    const gameInfo = document.getElementById('gameInfo');
    const gameControls = document.getElementById('gameControls');
    
    if (gameInfo) {
        gameInfo.innerHTML = `
            <h6>🎮 俄羅斯方塊</h6>
            <p><strong>目標：</strong>消除水平線獲得分數</p>
            <p><strong>控制：</strong></p>
            <ul class="small">
                <li>← → 移動方塊</li>
                <li>↓ 快速下降</li>
                <li>↑ 或 空白鍵 旋轉</li>
            </ul>
        `;
    }
    
    if (gameControls) {
        gameControls.innerHTML = `
            <button class="btn btn-success btn-sm w-100 mb-2" onclick="initTetrisGame()">
                <i class="fas fa-play me-2"></i>開始新遊戲
            </button>
            <button class="btn btn-secondary btn-sm w-100" onclick="showGameWelcome()">
                <i class="fas fa-arrow-left me-2"></i>返回遊戲選擇
            </button>
        `;
    }
    
    setTimeout(() => {
        initTetrisGame();
    }, 100);
}

function loadMahjongGame() {
    const gameInfo = document.getElementById('gameInfo');
    const gameControls = document.getElementById('gameControls');
    
    if (gameInfo) {
        gameInfo.innerHTML = `
            <h6>🀄 麻將遊戲</h6>
            <p><strong>目標：</strong>收集牌組胡牌</p>
            <p><strong>操作：</strong></p>
            <ul class="small">
                <li>點擊牌張出牌</li>
                <li>點擊"摸牌"獲得新牌</li>
                <li>保持14張牌胡牌</li>
            </ul>
        `;
    }
    
    if (gameControls) {
        gameControls.innerHTML = `
            <button class="btn btn-success btn-sm w-100 mb-2" onclick="initMahjongGame()">
                <i class="fas fa-play me-2"></i>開始新遊戲
            </button>
            <button class="btn btn-secondary btn-sm w-100" onclick="showGameWelcome()">
                <i class="fas fa-arrow-left me-2"></i>返回遊戲選擇
            </button>
        `;
    }
    
    setTimeout(() => {
        initMahjongGame();
    }, 100);
}

function loadFarmStoryGame() {
    const gameInfo = document.getElementById('gameInfo');
    const gameControls = document.getElementById('gameControls');
    
    if (gameInfo) {
        gameInfo.innerHTML = `
            <h6>🚜 農場物語 RPG</h6>
            <p><strong>角色扮演農場遊戲</strong></p>
            <div class="game-stats">
                <small>金錢: ${gameData.farmStory.money} | AI助手: ${gameData.farmStory.aiUsesLeft}/10次</small>
            </div>
            <p><strong>特色：</strong></p>
            <ul class="small">
                <li>4個NPC角色互動</li>
                <li>3x3農田經營</li>
                <li>商店、鐵匠、醫院</li>
                <li>有限AI助手系統</li>
            </ul>
        `;
    }
    
    if (gameControls) {
        gameControls.innerHTML = `
            <button class="btn btn-success btn-sm w-100 mb-2" onclick="initFarmStoryGame()">
                <i class="fas fa-play me-2"></i>開始遊戲
            </button>
            <button class="btn btn-warning btn-sm w-100 mb-2" onclick="resetFarmGame()">
                <i class="fas fa-redo me-2"></i>重新開始
            </button>
            <button class="btn btn-secondary btn-sm w-100" onclick="showGameWelcome()">
                <i class="fas fa-arrow-left me-2"></i>返回遊戲選擇
            </button>
        `;
    }
    
    setTimeout(() => {
        initFarmStoryGame();
    }, 100);
}

// 返回遊戲歡迎畫面
function showGameWelcome() {
    // 隱藏所有遊戲容器
    const allGames = ['tetrisGame', 'mahjongGame', 'farmStoryGame'];
    allGames.forEach(gameId => {
        const gameElement = document.getElementById(gameId);
        if (gameElement) gameElement.style.display = 'none';
    });
    
    // 顯示歡迎畫面
    const gameWelcome = document.getElementById('gameWelcome');
    if (gameWelcome) gameWelcome.style.display = 'block';
    
    // 清除遊戲資訊和控制
    const gameInfo = document.getElementById('gameInfo');
    const gameControls = document.getElementById('gameControls');
    
    if (gameInfo) {
        gameInfo.innerHTML = '<p>選擇遊戲後將顯示相關資訊</p>';
    }
    
    if (gameControls) {
        gameControls.innerHTML = '<p>遊戲載入後將顯示控制選項</p>';
    }
}

// 重置農場遊戲
function resetFarmGame() {
    gameData.farmStory = {
        aiUsesLeft: 10,
        playerName: '小農夫',
        money: 100,
        crops: [],
        tools: ['基礎鋤頭', '基礎澆水壺'],
        currentScene: 'village',
        relationships: {
            '村長湯姆': 0,
            '商店瑪麗': 0,
            '鐵匠傑克': 0,
            '醫生莉莉': 0
        }
    };
    
    // 重新載入農場遊戲
    loadFarmStoryGame();
}

// 森林場景互動功能
window.collectForestItems = function() {
    const earnings = Math.floor(Math.random() * 50) + 30;
    farmGameState.player.money += earnings;
    farmGameState.player.energy -= 5;
    showMessage(`🌰 在森林中採集到野果和堅果！獲得 ${earnings} 金幣。`);
    window.updateDisplay();
};

window.restInForest = function() {
    const recovery = Math.floor(Math.random() * 30) + 20;
    farmGameState.player.energy = Math.min(100, farmGameState.player.energy + recovery);
    showMessage(`🛀 在清澈的溪水邊休息，恢復了 ${recovery} 點體力。`);
    window.updateDisplay();
};

window.exploreForest = function() {
    const treasureChance = Math.random();
    farmGameState.player.energy -= 15;
    
    if (treasureChance > 0.7) {
        const treasure = Math.floor(Math.random() * 100) + 50;
        farmGameState.player.money += treasure;
        showMessage(`🔍 深入探索森林，發現了古老的寶箱！獲得 ${treasure} 金幣。`);
    } else if (treasureChance > 0.4) {
        showMessage(`🔍 在森林深處發現了美麗的瀑布，但沒有找到特別的東西。`);
    } else {
        showMessage(`🔍 在茂密的樹林中迷路了一會兒，幸好找到了回去的路。`);
    }
    
    window.updateDisplay();
};

// 礦坑場景互動功能
window.digForOre = function() {
    const oreValue = Math.floor(Math.random() * 80) + 40;
    farmGameState.player.money += oreValue;
    farmGameState.player.energy -= 20;
    showMessage(`⛏️ 辛苦挖掘後找到了有價值的礦石！獲得 ${oreValue} 金幣。`);
    window.updateDisplay();
};

window.searchForGems = function() {
    const gemChance = Math.random();
    farmGameState.player.energy -= 25;
    
    if (gemChance > 0.6) {
        const gemValue = Math.floor(Math.random() * 200) + 100;
        farmGameState.player.money += gemValue;
        showMessage(`💎 幸運地發現了閃亮的寶石！獲得 ${gemValue} 金幣。`);
    } else {
        showMessage(`💎 在岩石中搜尋了很久，但只找到了一些普通的石頭。`);
    }
    
    window.updateDisplay();
};

window.useMinecart = function() {
    const rideOutcome = Math.random();
    farmGameState.player.energy -= 10;
    
    if (rideOutcome > 0.5) {
        const bonus = Math.floor(Math.random() * 60) + 30;
        farmGameState.player.money += bonus;
        showMessage(`🚗 礦車帶你到了一個新的區域，發現了遺留的金幣！獲得 ${bonus} 金幣。`);
    } else {
        showMessage(`🚗 礦車搖搖晃晃地在軌道上行駛，給你帶來了刺激的體驗。`);
    }
    
    window.updateDisplay();
};

// 遊戲啟動函數
function startTetrisInPanel() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div class="tetris-container text-center">
            <h5>俄羅斯方塊</h5>
            <canvas id="tetrisCanvas" width="300" height="600" style="border: 1px solid #ccc; background: #000;"></canvas>
            <div class="mt-3">
                <p>使用方向鍵控制：← → ↓ 移動，↑ 旋轉</p>
                <button class="btn btn-success" onclick="initTetrisGame()">重新開始</button>
            </div>
        </div>
    `;
    initTetrisGame();
}

function startMahjongInPanel() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div class="mahjong-container">
            <h5 class="text-center mb-3">麻將遊戲</h5>
            <div id="mahjongBoard" class="mahjong-board"></div>
            <div class="text-center mt-3">
                <button class="btn btn-success" onclick="initMahjongGame()">開始新局</button>
            </div>
        </div>
    `;
    initMahjongGame();
}

function startFarmStoryInPanel() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div class="farm-story-container">
            <h5 class="text-center mb-3">農場物語</h5>
            <div id="farmStoryBoard" class="farm-story-board"></div>
        </div>
    `;
    initFarmStoryGame();
}

// 遊戲初始化函數
function initTetrisGame() {
    console.log('初始化俄羅斯方塊遊戲');
    const canvas = document.getElementById('tetrisCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const BLOCK_SIZE = 20;
    const BOARD_WIDTH = 15;
    const BOARD_HEIGHT = 30;
    
    // 遊戲狀態
    let gameBoard = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
    let currentPiece = null;
    let currentX = 0;
    let currentY = 0;
    let score = 0;
    let gameRunning = false;
    
    // 方塊形狀
    const pieces = [
        [[1,1,1,1]], // I
        [[1,1],[1,1]], // O
        [[0,1,0],[1,1,1]], // T
        [[0,1,1],[1,1,0]], // S
        [[1,1,0],[0,1,1]], // Z
        [[1,0,0],[1,1,1]], // J
        [[0,0,1],[1,1,1]]  // L
    ];
    
    const colors = ['#000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'];
    
    function drawBlock(x, y, color) {
        ctx.fillStyle = colors[color];
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
    
    function drawBoard() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                if (gameBoard[y][x]) {
                    drawBlock(x, y, gameBoard[y][x]);
                }
            }
        }
        
        // 繪製當前方塊
        if (currentPiece) {
            for (let y = 0; y < currentPiece.length; y++) {
                for (let x = 0; x < currentPiece[y].length; x++) {
                    if (currentPiece[y][x]) {
                        drawBlock(currentX + x, currentY + y, 1);
                    }
                }
            }
        }
        
        // 顯示分數
        ctx.fillStyle = '#FFF';
        ctx.font = '16px Arial';
        ctx.fillText(`分數: ${score}`, 10, canvas.height - 10);
    }
    
    function newPiece() {
        const pieceIndex = Math.floor(Math.random() * pieces.length);
        currentPiece = pieces[pieceIndex];
        currentX = Math.floor(BOARD_WIDTH / 2) - Math.floor(currentPiece[0].length / 2);
        currentY = 0;
        
        if (collision()) {
            gameRunning = false;
            alert('遊戲結束！分數：' + score);
        }
    }
    
    function collision() {
        for (let y = 0; y < currentPiece.length; y++) {
            for (let x = 0; x < currentPiece[y].length; x++) {
                if (currentPiece[y][x]) {
                    const newX = currentX + x;
                    const newY = currentY + y;
                    
                    if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
                        return true;
                    }
                    if (newY >= 0 && gameBoard[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    function placePiece() {
        for (let y = 0; y < currentPiece.length; y++) {
            for (let x = 0; x < currentPiece[y].length; x++) {
                if (currentPiece[y][x]) {
                    gameBoard[currentY + y][currentX + x] = 1;
                }
            }
        }
        
        // 檢查並清除完整行
        for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
            if (gameBoard[y].every(cell => cell !== 0)) {
                gameBoard.splice(y, 1);
                gameBoard.unshift(Array(BOARD_WIDTH).fill(0));
                score += 100;
                y++; // 重新檢查同一行
            }
        }
        
        newPiece();
    }
    
    function moveDown() {
        currentY++;
        if (collision()) {
            currentY--;
            placePiece();
        }
    }
    
    function moveLeft() {
        currentX--;
        if (collision()) {
            currentX++;
        }
    }
    
    function moveRight() {
        currentX++;
        if (collision()) {
            currentX--;
        }
    }
    
    function rotatePiece() {
        const rotated = currentPiece[0].map((_, i) => 
            currentPiece.map(row => row[i]).reverse()
        );
        const originalPiece = currentPiece;
        currentPiece = rotated;
        
        if (collision()) {
            currentPiece = originalPiece;
        }
    }
    
    // 鍵盤控制
    document.addEventListener('keydown', function(e) {
        if (!gameRunning) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowRight':
                moveRight();
                break;
            case 'ArrowDown':
                moveDown();
                break;
            case 'ArrowUp':
            case ' ':
                rotatePiece();
                break;
        }
        drawBoard();
    });
    
    // 開始遊戲
    gameRunning = true;
    newPiece();
    
    // 遊戲循環
    const gameLoop = setInterval(() => {
        if (!gameRunning) {
            clearInterval(gameLoop);
            return;
        }
        moveDown();
        drawBoard();
    }, 500);
    
    drawBoard();
}

function initMahjongGame() {
    const board = document.getElementById('mahjongBoard');
    if (!board) return;
    
    // 麻將牌組
    const tiles = [
        '🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏', // 萬子
        '🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗', '🀘', // 筒子
        '🀙', '🀚', '🀛', '🀜', '🀝', '🀞', '🀟', '🀠', '🀡', // 索子
        '🀄', '🀅', '🀆', // 三元牌
        '🀀', '🀁', '🀂', '🀃' // 四風牌
    ];
    
    // 遊戲狀態
    let playerHand = [];
    let discardPile = [];
    let currentPlayer = 0;
    let gameStarted = false;
    
    // 初始化牌組
    function shuffleTiles() {
        const shuffled = [];
        tiles.forEach(tile => {
            for (let i = 0; i < 4; i++) {
                shuffled.push(tile);
            }
        });
        return shuffled.sort(() => Math.random() - 0.5);
    }
    
    // 發牌
    function dealCards() {
        const deck = shuffleTiles();
        playerHand = deck.slice(0, 13);
        gameStarted = true;
        window.updateDisplay();
    }
    
    // 更新顯示
    function updateDisplay() {
        board.innerHTML = `
            <div class="mahjong-game">
                <div class="game-status mb-3">
                    <h6>麻將遊戲 - 玩家手牌</h6>
                    <p class="text-info">點擊牌張出牌，空位摸牌</p>
                </div>
                
                <div class="player-hand mb-3">
                    <div class="hand-label">您的手牌 (${playerHand.length}張)：</div>
                    <div class="tiles-container">
                        ${playerHand.map((tile, index) => 
                            `<div class="mahjong-tile" onclick="discardTile(${index})">${tile}</div>`
                        ).join('')}
                        <div class="mahjong-tile draw-tile" onclick="drawTile()">摸牌</div>
                    </div>
                </div>
                
                <div class="discard-area mb-3">
                    <div class="discard-label">棄牌區：</div>
                    <div class="discard-tiles">
                        ${discardPile.map(tile => 
                            `<div class="discarded-tile">${tile}</div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="game-actions">
                    <button class="btn btn-success me-2" onclick="checkWin()">檢查胡牌</button>
                    <button class="btn btn-warning me-2" onclick="restartMahjong()">重新開始</button>
                    <button class="btn btn-info" onclick="showMahjongHelp()">遊戲說明</button>
                </div>
                
                <div class="game-info mt-3">
                    <small class="text-muted">
                        目標：收集相同或順序的牌組成胡牌
                    </small>
                </div>
            </div>
        `;
    }
    
    // 棄牌
    window.discardTile = function(index) {
        if (index >= 0 && index < playerHand.length) {
            const discardedTile = playerHand.splice(index, 1)[0];
            discardPile.push(discardedTile);
            window.updateDisplay();
            
            if (playerHand.length === 0) {
                alert('恭喜！您已出完所有牌！');
            }
        }
    };
    
    // 摸牌
    window.drawTile = function() {
        if (playerHand.length < 14) {
            const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
            playerHand.push(randomTile);
            window.updateDisplay();
        } else {
            alert('手牌已滿！請先出牌。');
        }
    };
    
    // 檢查胡牌
    window.checkWin = function() {
        if (playerHand.length === 14) {
            alert('恭喜可能胡牌！（簡化版本）');
        } else {
            alert('需要14張牌才能胡牌。目前：' + playerHand.length + '張');
        }
    };
    
    // 重新開始
    window.restartMahjong = function() {
        playerHand = [];
        discardPile = [];
        dealCards();
    };
    
    // 遊戲說明
    window.showMahjongHelp = function() {
        alert('麻將遊戲說明：\n' +
              '1. 點擊手牌出牌到棄牌區\n' +
              '2. 點擊"摸牌"從牌堆摸新牌\n' +
              '3. 保持手牌14張並組成胡牌\n' +
              '4. 這是簡化版本，主要體驗出牌摸牌');
    };
    
    // 開始遊戲
    dealCards();
}

// 全域農場遊戲狀態
let farmGameState = null;

function initFarmStoryGame() {
    // 載入專業遊戲UI樣式
    const farmUILink = document.createElement('link');
    farmUILink.rel = 'stylesheet';
    farmUILink.href = '/static/css/farm_story_ui.css';
    document.head.appendChild(farmUILink);
    
    // 清除全域變數衝突
    window.farmGameState = null;
    window.currentTool = null;
    
    // 創建專業遊戲介面
    createProfessionalFarmUI();
    
    // 初始化Canvas特效系統
    setTimeout(() => {
        const gameWorld = document.querySelector('.game-world');
        if (gameWorld && window.canvasEffects) {
            window.canvasEffects.init(gameWorld);
            console.log('Canvas特效系統已整合到農場物語遊戲');
        }
    }, 1000);
}

function createProfessionalFarmUI() {
    const board = document.getElementById('farmStoryBoard');
    if (!board) return;
    
    // 初始化遊戲狀態
    initializeFarmGameState();
    
    // 創建載入畫面
    showLoadingScreen();
    
    // 延遲載入主遊戲介面
    setTimeout(() => {
        createMainGameInterface();
        hideLoadingScreen();
    }, 2000);
}

function initializeFarmGameState() {
    window.farmGameState = {
        player: {
            name: '農夫小明',
            level: 1,
            health: 100,
            energy: 100,
            money: 500,
            experience: 0,
            x: 300,
            y: 250,
            currentScene: 'village',
            currentTool: 'hoe',
            inventory: {
                seeds: 5,
                water: 10,
                crops: 0,
                wood: 0,
                stone: 0
            }
        },
        inventory: {
            seeds: { carrot: 5, corn: 3, potato: 2 },
            crops: { carrot: 8, corn: 5, potato: 3 },
            tools: { hoe: 1, watering_can: 1, axe: 1, pickaxe: 1 },
            items: { energy_potion: 3, health_potion: 2 }
        },
        npcs: {
            mayor_tom: { friendship: 50, dialogue_count: 0 },
            shop_mary: { friendship: 30, dialogue_count: 0 },
            blacksmith_jack: { friendship: 40, dialogue_count: 0 },
            doctor_lily: { friendship: 25, dialogue_count: 0 }
        },
        aiUsesLeft: 10,
        currentWeather: 'sunny',
        weather: 'sunny',
        timeOfDay: 'morning',
        season: 'spring',
        day: 1
    };
    
    console.log('農場遊戲狀態初始化完成:', window.farmGameState);
}

function showLoadingScreen() {
    const board = document.getElementById('farmStoryBoard');
    board.innerHTML = `
        <div class="game-loading">
            <div class="loading-logo">🌱 農場物語</div>
            <div class="loading-bar">
                <div class="loading-progress" style="width: 0%"></div>
            </div>
            <div style="margin-top: 20px; color: #8B4513; font-weight: bold;">載入中...</div>
        </div>
    `;
    
    // 模擬載入進度
    let progress = 0;
    const loadInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
        }
        document.querySelector('.loading-progress').style.width = progress + '%';
    }, 100);
}

function hideLoadingScreen() {
    try {
        // 確保遊戲狀態已初始化
        if (!window.farmGameState) {
            initializeFarmGameState();
        }
        
        document.querySelector('.game-loading').style.opacity = '0';
        setTimeout(() => {
            createMainGameInterface();
        }, 500);
    } catch (error) {
        console.error('遊戲載入錯誤:', error);
        
        // 顯示錯誤訊息並提供重試選項
        const board = document.getElementById('farmStoryBoard');
        board.innerHTML = `
            <div class="game-error">
                <div class="error-icon">⚠️</div>
                <div class="error-message">遊戲載入失敗</div>
                <div class="error-description">請重新嘗試載入遊戲</div>
                <button class="btn btn-primary" onclick="startFarmStoryInPanel()">重新載入</button>
            </div>
        `;
    }
}

function createMainGameInterface() {
    try {
        const board = document.getElementById('farmStoryBoard');
        if (!board) {
            console.error('找不到farmStoryBoard元素');
            return;
        }
        
        // 確保遊戲狀態存在
        if (!window.farmGameState) {
            console.error('遊戲狀態未初始化');
            initializeFarmGameState();
        }
        
        const gameState = window.farmGameState;
        
        board.innerHTML = `
            <div class="farm-story-container" style="padding: 10px;">
                <!-- 遊戲狀態欄 -->
                <div class="game-status-bar" style="display: flex; gap: 15px; margin-bottom: 10px; padding: 10px; background: rgba(0,0,0,0.1); border-radius: 8px;">
                    <div class="status-item" style="display: flex; align-items: center; gap: 5px;">
                        <span>❤️</span>
                        <span>${gameState.player.health}/100</span>
                    </div>
                    <div class="status-item" style="display: flex; align-items: center; gap: 5px;">
                        <span>⚡</span>
                        <span>${gameState.player.energy}/100</span>
                    </div>
                    <div class="status-item" style="display: flex; align-items: center; gap: 5px;">
                        <span>💰</span>
                        <span>${gameState.player.money}G</span>
                    </div>
                    <div class="status-item" style="display: flex; align-items: center; gap: 5px;">
                        <span>⭐</span>
                        <span>Lv.${gameState.player.level}</span>
                    </div>
                    <div class="status-item" style="display: flex; align-items: center; gap: 5px;">
                        <span>🤖</span>
                        <span>AI: ${gameState.aiUsesLeft}/10</span>
                    </div>
                </div>

                <!-- 簡化的遊戲世界 -->
                <div class="game-world" style="position: relative; width: 100%; height: 400px; background: linear-gradient(to bottom, #87CEEB 0%, #98FB98 50%, #90EE90 100%); border-radius: 10px; overflow: hidden; margin-bottom: 10px;">
                    
                    <!-- 玩家角色 -->
                    <div id="playerCharacter" style="position: absolute; left: 300px; top: 250px; font-size: 30px; z-index: 10;">🧑‍🌾</div>
                    
                    <!-- 村莊建築 -->
                    <div style="position: absolute; left: 80px; top: 120px; cursor: pointer; text-align: center;" onclick="enterBuilding('townhall')">
                        <div style="font-size: 40px;">🏛️</div>
                        <div style="font-size: 12px; background: rgba(0,0,0,0.7); color: white; padding: 2px; border-radius: 4px;">村公所</div>
                    </div>
                    
                    <div style="position: absolute; left: 220px; top: 100px; cursor: pointer; text-align: center;" onclick="enterBuilding('shop')">
                        <div style="font-size: 40px;">🏪</div>
                        <div style="font-size: 12px; background: rgba(0,0,0,0.7); color: white; padding: 2px; border-radius: 4px;">商店</div>
                    </div>
                    
                    <div style="position: absolute; left: 360px; top: 140px; cursor: pointer; text-align: center;" onclick="enterBuilding('blacksmith')">
                        <div style="font-size: 40px;">🔨</div>
                        <div style="font-size: 12px; background: rgba(0,0,0,0.7); color: white; padding: 2px; border-radius: 4px;">鐵匠鋪</div>
                    </div>
                    
                    <div style="position: absolute; left: 500px; top: 110px; cursor: pointer; text-align: center;" onclick="enterBuilding('clinic')">
                        <div style="font-size: 40px;">🏥</div>
                        <div style="font-size: 12px; background: rgba(0,0,0,0.7); color: white; padding: 2px; border-radius: 4px;">診療所</div>
                    </div>
                    
                    <!-- 農場區域 -->
                    <div style="position: absolute; left: 50px; top: 300px; cursor: pointer; text-align: center;" onclick="goToFarm()">
                        <div style="font-size: 40px;">🌾</div>
                        <div style="font-size: 12px; background: rgba(0,0,0,0.7); color: white; padding: 2px; border-radius: 4px;">農場</div>
                    </div>
                </div>

                <!-- 工具欄 -->
                <div class="tool-bar" style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <button class="btn btn-success btn-sm" onclick="selectTool('hoe')">🪓 鋤頭</button>
                    <button class="btn btn-info btn-sm" onclick="selectTool('water')">🪣 澆水</button>
                    <button class="btn btn-warning btn-sm" onclick="selectTool('axe')">🪓 斧頭</button>
                    <button class="btn btn-danger btn-sm" onclick="useAIAssistant()">🤖 AI助手</button>
                </div>

                <!-- 動作按鈕 -->
                <div class="action-buttons" style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="btn btn-primary btn-sm" onclick="farmTile()">翻土</button>
                    <button class="btn btn-success btn-sm" onclick="plantSeeds()">種植</button>
                    <button class="btn btn-info btn-sm" onclick="waterCrops()">澆水</button>
                    <button class="btn btn-warning btn-sm" onclick="chopWood()">砍柴</button>
                    <button class="btn btn-danger btn-sm" onclick="mineStone()">挖礦</button>
                </div>
            </div>
        `;
        
        // 初始化遊戲邏輯
        initializeGameLogic();
        console.log('農場物語主介面創建完成');
        
    } catch (error) {
        console.error('創建主遊戲介面錯誤:', error);
    }
}
            </div>

            <!-- 右側邊欄 -->
            <div class="game-sidebar">
                <div class="sidebar-section">
                    <div class="sidebar-title">🎒 背包</div>
                    <div class="inventory-grid" id="inventoryGrid">
                        ${createInventoryHTML()}
                    </div>
                </div>
                
                <div class="sidebar-section">
                    <div class="sidebar-title">🗺️ 迷你地圖</div>
                    <div class="mini-map" id="miniMap">
                        ${createMiniMapHTML()}
                    </div>
                </div>
                
                <div class="sidebar-section">
                    <div class="sidebar-title">👥 村民關係</div>
                    <div id="npcRelations">
                        ${createNPCRelationsHTML()}
                    </div>
                </div>
                
                <div class="sidebar-section">
                    <div class="sidebar-title">📋 任務</div>
                    <div id="questList">
                        <div style="text-align: center; color: #666;">暂无任务</div>
                    </div>
                </div>
            </div>

            <!-- 底部工具欄 -->
            <div class="game-toolbar">
                <div class="tool-slot active" onclick="selectTool('hoe')" title="鋤頭">
                    <div class="tool-icon">🔨</div>
                </div>
                <div class="tool-slot" onclick="selectTool('watering_can')" title="澆水器">
                    <div class="tool-icon">🪣</div>
                </div>
                <div class="tool-slot" onclick="selectTool('axe')" title="斧頭">
                    <div class="tool-icon">🪓</div>
                </div>
                <div class="tool-slot" onclick="selectTool('pickaxe')" title="鎬子">
                    <div class="tool-icon">⛏️</div>
                </div>
                <div class="tool-slot" onclick="selectTool('seeds')" title="種子">
                    <div class="tool-icon">🌱</div>
                </div>
                <div class="tool-slot" onclick="openMenu()" title="選單">
                    <div class="tool-icon">📋</div>
                </div>
                <div class="tool-slot" onclick="useAIAssistant()" title="AI助手">
                    <div class="tool-icon">🤖</div>
                </div>
            </div>

            <!-- 對話框 (預設隱藏) -->
            <div class="dialogue-box" id="dialogueBox">
                <div class="dialogue-speaker" id="dialogueSpeaker"></div>
                <div class="dialogue-text" id="dialogueText"></div>
                <div class="dialogue-options" id="dialogueOptions"></div>
            </div>
        </div>
    `;
    
    // 初始化遊戲邏輯
    initializeGameLogic();
    startGameLoop();
}

// 輔助函數
function getWeatherIcon() {
    const weather = window.farmGameState?.weather || 'sunny';
    const icons = {
        'sunny': '☀️',
        'rainy': '🌧️',
        'cloudy': '☁️',
        'stormy': '⛈️'
    };
    return icons[weather] || '☀️';
}

function createGameWorldHTML() {
    try {
        return `
            <div class="professional-game-world">
                <!-- 簡化的村莊場景 -->
                <div class="village-background" style="position: relative; width: 100%; height: 400px; background: linear-gradient(to bottom, #87CEEB 0%, #98FB98 50%, #90EE90 100%); border-radius: 10px; overflow: hidden;">
                    
                    <!-- 村莊建築群 -->
                    <div class="building town-hall" style="position: absolute; left: 80px; top: 120px; cursor: pointer;" onclick="enterBuilding('townhall')">
                        <div style="font-size: 40px;">🏛️</div>
                        <div style="font-size: 12px; text-align: center; background: rgba(0,0,0,0.7); color: white; padding: 2px; border-radius: 4px;">村公所</div>
                    </div>
                    
                    <div class="building shop" style="position: absolute; left: 220px; top: 100px; cursor: pointer;" onclick="enterBuilding('shop')">
                        <div style="font-size: 40px;">🏪</div>
                        <div style="font-size: 12px; text-align: center; background: rgba(0,0,0,0.7); color: white; padding: 2px; border-radius: 4px;">商店</div>
                    <div class="building-glow"></div>
                </div>
                
                <div class="building blacksmith" style="left: 360px; top: 140px;" onclick="enterBuilding('blacksmith')">
                    <div class="building-sprite">⚒️</div>
                    <div class="building-name">鐵匠鋪</div>
                    <div class="building-glow"></div>
                </div>
                
                <div class="building clinic" style="left: 500px; top: 80px;" onclick="enterBuilding('clinic')">
                    <div class="building-sprite">🏥</div>
                    <div class="building-name">診所</div>
                    <div class="building-glow"></div>
                </div>
                
                <!-- 互動式NPC -->
                <div class="npc mayor" style="left: 120px; top: 200px;" onclick="talkToNPC('村長湯姆')">
                    <div class="npc-sprite">👨‍💼</div>
                    <div class="npc-name">村長湯姆</div>
                    <div class="friendship-hearts">
                        <span class="heart filled">❤️</span>
                        <span class="heart filled">❤️</span>
                        <span class="heart">🤍</span>
                    </div>
                    <div class="speech-bubble" id="mayor-bubble">你好！歡迎來到我們的村莊！</div>
                </div>
                
                <div class="npc shopkeeper" style="left: 260px; top: 180px;" onclick="talkToNPC('商店瑪麗')">
                    <div class="npc-sprite">👩‍💼</div>
                    <div class="npc-name">商店瑪麗</div>
                    <div class="friendship-hearts">
                        <span class="heart filled">❤️</span>
                        <span class="heart">🤍</span>
                        <span class="heart">🤍</span>
                    </div>
                    <div class="speech-bubble" id="mary-bubble">需要買點什麼嗎？</div>
                </div>
                
                <div class="npc blacksmith" style="left: 400px; top: 220px;" onclick="talkToNPC('鐵匠傑克')">
                    <div class="npc-sprite">🔨</div>
                    <div class="npc-name">鐵匠傑克</div>
                    <div class="friendship-hearts">
                        <span class="heart filled">❤️</span>
                        <span class="heart filled">❤️</span>
                        <span class="heart">🤍</span>
                    </div>
                    <div class="speech-bubble" id="jack-bubble">我可以升級你的工具！</div>
                    <div class="work-effect">✨</div>
                </div>
                
                <div class="npc doctor" style="left: 540px; top: 160px;" onclick="talkToNPC('醫生莉莉')">
                    <div class="npc-sprite">👩‍⚕️</div>
                    <div class="npc-name">醫生莉莉</div>
                    <div class="friendship-hearts">
                        <span class="heart filled">❤️</span>
                        <span class="heart">🤍</span>
                        <span class="heart">🤍</span>
                    </div>
                    <div class="speech-bubble" id="lily-bubble">感覺如何？需要治療嗎？</div>
                </div>
                
                <!-- 玩家角色 -->
                <div class="player-character" style="left: ${window.farmGameState.player.x}px; top: ${window.farmGameState.player.y}px;" id="playerCharacter">
                    <div class="player-sprite">🧑‍🌾</div>
                    <div class="player-shadow"></div>
                    <div class="level-indicator">Lv.${window.farmGameState.player.level}</div>
                </div>
                
                <!-- 農田區域 -->
                <div class="farm-area" style="left: 50px; top: 300px;" onclick="goToFarm()">
                    <div class="farm-plots">
                        <div class="plot plot-1">🌱</div>
                        <div class="plot plot-2">🌾</div>
                        <div class="plot plot-3">🥕</div>
                        <div class="plot plot-4">🌽</div>
                    </div>
                    <div class="area-name">我的農場</div>
                </div>
                
                <!-- 森林區域 -->
                <div class="forest-area" style="right: 50px; top: 280px;" onclick="goToForest()">
                    <div class="forest-trees">🌲🌳🌲</div>
                    <div class="area-name">神秘森林</div>
                </div>
                
                <!-- 礦山入口 -->
                <div class="mine-entrance" style="left: 400px; top: 350px;" onclick="goToMine()">
                    <div class="mine-sprite">⛰️</div>
                    <div class="area-name">地下礦坑</div>
                </div>
                
                <!-- 環境裝飾 -->
                <div class="decoration flowers" style="left: 150px; top: 280px;">🌸🌺🌻</div>
                <div class="decoration fountain" style="left: 300px; top: 250px;">⛲</div>
                <div class="decoration trees" style="right: 100px; top: 200px;">🌳🌲</div>
            </div>
        </div>
    `;
}

function createInventoryHTML() {
    let html = '';
    const inventory = farmGameState.inventory;
    
    // 種子
    Object.entries(inventory.seeds).forEach(([item, count]) => {
        if (count > 0) {
            const icons = { carrot: '🥕', corn: '🌽', potato: '🥔' };
            html += `<div class="inventory-slot has-item" title="${item}種子">
                <div class="item-icon">${icons[item]}</div>
                <div class="item-count">${count}</div>
            </div>`;
        }
    });
    
    // 作物
    Object.entries(inventory.crops).forEach(([item, count]) => {
        if (count > 0) {
            const icons = { carrot: '🥕', corn: '🌽', potato: '🥔' };
            html += `<div class="inventory-slot has-item" title="${item}">
                <div class="item-icon">${icons[item]}</div>
                <div class="item-count">${count}</div>
            </div>`;
        }
    });
    
    // 工具
    Object.entries(inventory.tools).forEach(([tool, count]) => {
        if (count > 0) {
            const icons = { hoe: '🔨', watering_can: '🪣', axe: '🪓', pickaxe: '⛏️' };
            html += `<div class="inventory-slot has-item" title="${tool}">
                <div class="item-icon">${icons[tool]}</div>
                <div class="item-count">${count}</div>
            </div>`;
        }
    });
    
    // 道具
    Object.entries(inventory.items).forEach(([item, count]) => {
        if (count > 0) {
            const icons = { energy_potion: '⚡', health_potion: '❤️' };
            html += `<div class="inventory-slot has-item" title="${item}">
                <div class="item-icon">${icons[item]}</div>
                <div class="item-count">${count}</div>
            </div>`;
        }
    });
    
    // 填充空格子
    while (html.split('inventory-slot').length - 1 < 16) {
        html += '<div class="inventory-slot"></div>';
    }
    
    return html;
}

function createMiniMapHTML() {
    return `
        <div style="position: relative; width: 100%; height: 100%; background: rgba(0,0,0,0.3); border-radius: 8px;">
            <!-- 村莊區域 -->
            <div class="mini-map-area" style="left: 20%; top: 30%; width: 60%; height: 40%; background: #90EE90;"></div>
            <!-- 農田區域 -->
            <div class="mini-map-area" style="left: 10%; top: 70%; width: 30%; height: 20%; background: #8FBC8F;"></div>
            <!-- 玩家位置 -->
            <div class="mini-map-player" style="left: 50%; top: 60%;"></div>
        </div>
    `;
}

function createNPCRelationsHTML() {
    const npcs = farmGameState.npcs;
    let html = '';
    
    Object.entries(npcs).forEach(([npc, data]) => {
        const names = {
            mayor_tom: '村長湯姆',
            shop_mary: '商店瑪麗', 
            blacksmith_jack: '鐵匠傑克',
            doctor_lily: '醫生莉莉'
        };
        
        const hearts = Math.floor(data.friendship / 20);
        const heartDisplay = '❤️'.repeat(hearts) + '🤍'.repeat(5 - hearts);
        
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 5px; background: rgba(255,255,255,0.5); border-radius: 5px;">
                <span style="font-size: 12px; font-weight: bold;">${names[npc]}</span>
                <span style="font-size: 12px;">${heartDisplay}</span>
            </div>
        `;
    });
    
    return html;
}

function initializeGameLogic() {
    // 初始化全域變數
    window.farmGameState = {
        player: {
            x: 300,
            y: 250,
            health: 100,
            energy: 100,
            money: 500,
            level: 1,
            experience: 0
        },
        inventory: {
            seeds: { carrot: 10, corn: 5, potato: 3 },
            crops: { carrot: 0, corn: 0, potato: 0 },
            tools: { hoe: 1, watering_can: 1, axe: 1, pickaxe: 1 },
            items: { energy_potion: 3, health_potion: 2 }
        },
        npcs: {
            mayor_tom: { friendship: 50, lastTalk: null },
            shop_mary: { friendship: 30, lastTalk: null },
            blacksmith_jack: { friendship: 40, lastTalk: null },
            doctor_lily: { friendship: 20, lastTalk: null }
        },
        currentScene: 'village',
        weather: 'sunny',
        season: '春季',
        day: 1,
        time: '上午',
        aiUsesLeft: 10
    };
    
    // 設置工具選擇
    window.currentTool = 'hoe';
    
    // 設置鍵盤控制
    document.addEventListener('keydown', handleKeyPress);
    
    // 設置點擊移動
    const gameWorld = document.getElementById('gameWorld') || document.querySelector('.game-world');
    if (gameWorld) {
        gameWorld.addEventListener('click', handleWorldClick);
    }
    
    // 初始化UI顯示
    setTimeout(() => {
        updateStatusDisplay();
        updateInventoryDisplay();
    }, 100);
    
    console.log('農場遊戲邏輯初始化完成', window.farmGameState);
}

function startGameLoop() {
    // 每秒更新一次遊戲狀態
    setInterval(updateGameState, 1000);
}

function updateGameState() {
    // 更新狀態欄顯示
    updateStatusBar();
    
    // 隨機事件
    if (Math.random() < 0.01) { // 1%概率
        randomEvent();
    }
}

function updateStatusBar() {
    // 更新顯示的數值 (如果需要動態更新)
}

// 遊戲互動功能
function selectTool(tool) {
    window.currentTool = tool;
    // 更新工具欄視覺效果
    document.querySelectorAll('.tool-slot').forEach(slot => slot.classList.remove('active'));
    event.target.closest('.tool-slot').classList.add('active');
    showNotification('工具選擇', `選擇了${getToolName(tool)}`);
}

function getToolName(tool) {
    const names = {
        'hoe': '鋤頭',
        'watering_can': '澆水器', 
        'axe': '斧頭',
        'pickaxe': '鎬子',
        'seeds': '種子'
    };
    return names[tool] || tool;
}

function handleKeyPress(event) {
    const player = farmGameState.player;
    const speed = 10;
    
    switch(event.key) {
        case 'ArrowUp':
        case 'w':
            movePlayer(player.x, Math.max(80, player.y - speed));
            break;
        case 'ArrowDown':
        case 's':
            movePlayer(player.x, Math.min(350, player.y + speed));
            break;
        case 'ArrowLeft':
        case 'a':
            movePlayer(Math.max(0, player.x - speed), player.y);
            break;
        case 'ArrowRight':
        case 'd':
            movePlayer(Math.min(600, player.x + speed), player.y);
            break;
        case 'Space':
        case ' ':
            event.preventDefault();
            useCurrentTool();
            break;
    }
}

function handleWorldClick(event) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    movePlayer(x - 24, y - 24); // 調整到角色中心
}

function movePlayer(x, y) {
    farmGameState.player.x = x;
    farmGameState.player.y = y;
    
    const playerElement = document.getElementById('playerCharacter');
    if (playerElement) {
        playerElement.style.left = x + 'px';
        playerElement.style.top = y + 'px';
    }
}

function useCurrentTool() {
    const tool = window.currentTool;
    const energy = farmGameState.player.energy;
    
    if (energy <= 0) {
        showNotification('精力不足', '需要休息或使用能量藥水！');
        return;
    }
    
    switch(tool) {
        case 'hoe':
            farmTile();
            break;
        case 'watering_can':
            waterCrops();
            break;
        case 'seeds':
            plantSeeds();
            break;
        case 'axe':
            chopWood();
            break;
        case 'pickaxe':
            mineStone();
            break;
    }
}

function farmTile() {
    farmGameState.player.energy -= 5;
    showNotification('農作', '翻土完成！準備種植種子。');
}

function waterCrops() {
    if (farmGameState.player.energy >= 10) {
        farmGameState.player.energy -= 10;
        showNotification('澆水', '作物正在茁壯成長！');
    } else {
        showNotification('精力不足', '需要休息！');
    }
}

function plantSeeds() {
    if (farmGameState.inventory.seeds.carrot > 0) {
        farmGameState.inventory.seeds.carrot--;
        farmGameState.player.energy -= 5;
        showNotification('種植', '種下了蘿蔔種子！記得澆水。');
        updateInventoryDisplay();
    } else {
        showNotification('沒有種子', '去商店購買種子吧！');
    }
}

function chopWood() {
    farmGameState.player.energy -= 15;
    const wood = Math.floor(Math.random() * 3) + 1;
    farmGameState.player.money += wood * 10;
    showNotification('砍柴', `收集了${wood}塊木材！獲得${wood * 10}金幣。`);
}

function mineStone() {
    farmGameState.player.energy -= 20;
    const ore = Math.floor(Math.random() * 2) + 1;
    farmGameState.player.money += ore * 25;
    showNotification('挖礦', `挖到了${ore}塊礦石！獲得${ore * 25}金幣。`);
}

function talkToNPC(npcName) {
    const dialogue = getNPCDialogue(npcName);
    showDialogue(npcName, dialogue.text, dialogue.options);
    
    // 增加友好度
    const npcKey = getNPCKey(npcName);
    if (farmGameState.npcs[npcKey]) {
        farmGameState.npcs[npcKey].friendship += 5;
        farmGameState.npcs[npcKey].dialogue_count++;
    }
}

function getNPCKey(npcName) {
    const mapping = {
        '村長湯姆': 'mayor_tom',
        '商店瑪麗': 'shop_mary',
        '鐵匠傑克': 'blacksmith_jack',
        '醫生莉莉': 'doctor_lily'
    };
    return mapping[npcName];
}

function getNPCDialogue(npcName) {
    const dialogues = {
        '村長湯姆': {
            text: '歡迎來到我們美麗的村莊！這裡有很多友善的村民和豐富的資源。你可以種植作物、與村民交朋友，建造屬於自己的農場。',
            options: [
                { text: '謝謝您的歡迎！', action: () => closeDialogue() },
                { text: '有什麼任務嗎？', action: () => showQuest() },
                { text: '請介紹一下村莊', action: () => showVillageInfo() }
            ]
        },
        '商店瑪麗': {
            text: '歡迎光臨我的商店！這裡有新鮮的種子、工具和各種有用的物品。需要什麼嗎？',
            options: [
                { text: '我想買種子', action: () => openShop('seeds') },
                { text: '我想賣作物', action: () => openShop('sell') },
                { text: '只是看看', action: () => closeDialogue() }
            ]
        },
        '鐵匠傑克': {
            text: '嘿！我是村裡的鐵匠。我可以幫你升級工具，讓你的農場工作更有效率！',
            options: [
                { text: '升級我的工具', action: () => upgradeTools() },
                { text: '修理工具', action: () => repairTools() },
                { text: '改天再來', action: () => closeDialogue() }
            ]
        },
        '醫生莉莉': {
            text: '你好！我是村裡的醫生。如果你感到疲憊或需要恢復健康，我可以幫助你。',
            options: [
                { text: '治療健康', action: () => restoreHealth() },
                { text: '購買藥水', action: () => buyPotions() },
                { text: '我很健康', action: () => closeDialogue() }
            ]
        }
    };
    
    return dialogues[npcName] || {
        text: '你好！',
        options: [{ text: '你好', action: () => closeDialogue() }]
    };
}

function showDialogue(speaker, text, options) {
    const dialogueBox = document.getElementById('dialogueBox');
    const speakerElement = document.getElementById('dialogueSpeaker');
    const textElement = document.getElementById('dialogueText');
    const optionsElement = document.getElementById('dialogueOptions');
    
    speakerElement.textContent = speaker;
    textElement.textContent = text;
    
    optionsElement.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'dialogue-option';
        button.textContent = option.text;
        button.onclick = option.action;
        optionsElement.appendChild(button);
    });
    
    dialogueBox.style.display = 'block';
}

function closeDialogue() {
    document.getElementById('dialogueBox').style.display = 'none';
}

function showNotification(title, text) {
    // 移除現有通知
    const existing = document.querySelector('.game-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'game-notification';
    notification.innerHTML = `
        <div class="notification-title">${title}</div>
        <div class="notification-text">${text}</div>
    `;
    
    document.body.appendChild(notification);
    
    // 3秒後自動移除
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

function updateInventoryDisplay() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    if (inventoryGrid) {
        inventoryGrid.innerHTML = createInventoryHTML();
    }
}

function openMenu() {
    showNotification('選單', '遊戲選單功能開發中...');
}

function useAIAssistant() {
    if (farmGameState.aiUsesLeft > 0) {
        farmGameState.aiUsesLeft--;
        showNotification('AI助手', `AI助手已啟用！剩餘 ${farmGameState.aiUsesLeft}/10 次使用。`);
        // 這裡可以整合實際的AI對話功能
    } else {
        showNotification('AI使用完畢', '今天的AI助手使用次數已用完！');
    }
}

function randomEvent() {
    const events = [
        { title: '天氣變化', text: '天氣轉為多雲' },
        { title: '野生動物', text: '一隻小鳥飛過農場' },
        { title: '意外收穫', text: '在農田裡發現了額外的作物！' }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    showNotification(event.title, event.text);
}

// 商店和其他功能的占位符
function openShop(type) {
    showNotification('商店', `${type} 商店功能開發中...`);
    closeDialogue();
}

function showQuest() {
    showNotification('任務', '任務系統開發中...');
    closeDialogue();
}

function showVillageInfo() {
    showNotification('村莊資訊', '這是一個美麗的農業村莊，有四位主要居民樂意幫助您。');
    closeDialogue();
}

function upgradeTools() {
    showNotification('工具升級', '工具升級功能開發中...');
    closeDialogue();
}

function repairTools() {
    showNotification('工具修理', '你的工具看起來很好，不需要修理！');
    closeDialogue();
}

function restoreHealth() {
    farmGameState.player.health = 100;
    farmGameState.player.energy = 100;
    showNotification('治療完成', '健康和精力已完全恢復！');
    closeDialogue();
}

function buyPotions() {
    showNotification('藥水商店', '藥水購買功能開發中...');
    closeDialogue();
}

// 新增遊戲功能函數
function enterBuilding(buildingType) {
    const buildingNames = {
        'townhall': '村公所',
        'shop': '商店', 
        'blacksmith': '鐵匠鋪',
        'clinic': '診所'
    };
    
    showNotification('進入建築', `進入${buildingNames[buildingType]}中...`);
    
    // 模擬進入不同建築的功能
    switch(buildingType) {
        case 'shop':
            openShop('general');
            break;
        case 'blacksmith':
            upgradeTools();
            break;
        case 'clinic':
            restoreHealth();
            break;
        default:
            showNotification('建築功能', '此建築功能開發中...');
    }
}

function goToFarm() {
    showNotification('農場', '前往農場管理作物...');
    // 可以擴展為切換到農場場景
}

function goToForest() {
    showNotification('森林', '探索神秘森林，收集材料...');
    if (window.farmGameState.player.energy >= 20) {
        window.farmGameState.player.energy -= 20;
        const wood = Math.floor(Math.random() * 5) + 3;
        window.farmGameState.player.money += wood * 15;
        showNotification('森林收穫', `收集了${wood}塊珍貴木材！獲得${wood * 15}金幣。`);
        updateInventoryDisplay();
    } else {
        showNotification('精力不足', '需要更多精力才能探索森林！');
    }
}

function goToMine() {
    showNotification('礦坑', '深入地下礦坑挖掘礦石...');
    if (window.farmGameState.player.energy >= 30) {
        window.farmGameState.player.energy -= 30;
        const minerals = Math.floor(Math.random() * 3) + 2;
        window.farmGameState.player.money += minerals * 50;
        showNotification('礦坑收穫', `挖掘了${minerals}塊稀有礦石！獲得${minerals * 50}金幣。`);
        updateInventoryDisplay();
    } else {
        showNotification('精力不足', '挖礦需要充足的精力！');
    }
}

// 修復變數引用問題
function createInventoryHTML() {
    let html = '';
    const inventory = window.farmGameState.inventory;
    
    // 種子
    Object.entries(inventory.seeds).forEach(([item, count]) => {
        if (count > 0) {
            const icons = { carrot: '🥕', corn: '🌽', potato: '🥔' };
            html += `<div class="inventory-slot has-item" title="${item}種子">
                <div class="item-icon">${icons[item]}</div>
                <div class="item-count">${count}</div>
            </div>`;
        }
    });
    
    // 作物
    Object.entries(inventory.crops).forEach(([item, count]) => {
        if (count > 0) {
            const icons = { carrot: '🥕', corn: '🌽', potato: '🥔' };
            html += `<div class="inventory-slot has-item" title="${item}">
                <div class="item-icon">${icons[item]}</div>
                <div class="item-count">${count}</div>
            </div>`;
        }
    });
    
    // 工具
    Object.entries(inventory.tools).forEach(([tool, count]) => {
        if (count > 0) {
            const icons = { hoe: '🔨', watering_can: '🪣', axe: '🪓', pickaxe: '⛏️' };
            html += `<div class="inventory-slot has-item" title="${tool}">
                <div class="item-icon">${icons[tool]}</div>
                <div class="item-count">${count}</div>
            </div>`;
        }
    });
    
    // 道具
    Object.entries(inventory.items).forEach(([item, count]) => {
        if (count > 0) {
            const icons = { energy_potion: '⚡', health_potion: '❤️' };
            html += `<div class="inventory-slot has-item" title="${item}">
                <div class="item-icon">${icons[item]}</div>
                <div class="item-count">${count}</div>
            </div>`;
        }
    });
    
    // 填充空格子
    while (html.split('inventory-slot').length - 1 < 16) {
        html += '<div class="inventory-slot"></div>';
    }
    
    return html;
}

function createNPCRelationsHTML() {
    const npcs = window.farmGameState.npcs;
    let html = '';
    
    Object.entries(npcs).forEach(([npc, data]) => {
        const names = {
            mayor_tom: '村長湯姆',
            shop_mary: '商店瑪麗', 
            blacksmith_jack: '鐵匠傑克',
            doctor_lily: '醫生莉莉'
        };
        
        const hearts = Math.floor(data.friendship / 20);
        const heartDisplay = '❤️'.repeat(hearts) + '🤍'.repeat(5 - hearts);
        
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 5px; background: rgba(255,255,255,0.5); border-radius: 5px;">
                <span style="font-size: 12px; font-weight: bold;">${names[npc]}</span>
                <span style="font-size: 12px;">${heartDisplay}</span>
            </div>
        `;
    });
    
    return html;
}

// 修復玩家移動函數
function movePlayer(x, y) {
    window.farmGameState.player.x = x;
    window.farmGameState.player.y = y;
    
    const playerElement = document.getElementById('playerCharacter');
    if (playerElement) {
        playerElement.style.left = x + 'px';
        playerElement.style.top = y + 'px';
    }
}

function handleKeyPress(event) {
    const player = window.farmGameState.player;
    const speed = 10;
    
    switch(event.key) {
        case 'ArrowUp':
        case 'w':
            movePlayer(player.x, Math.max(80, player.y - speed));
            break;
        case 'ArrowDown':
        case 's':
            movePlayer(player.x, Math.min(350, player.y + speed));
            break;
        case 'ArrowLeft':
        case 'a':
            movePlayer(Math.max(0, player.x - speed), player.y);
            break;
        case 'ArrowRight':
        case 'd':
            movePlayer(Math.min(600, player.x + speed), player.y);
            break;
        case 'Space':
        case ' ':
            event.preventDefault();
            useCurrentTool();
            break;
    }
}

function useCurrentTool() {
    const tool = window.currentTool;
    const energy = window.farmGameState.player.energy;
    
    if (energy <= 0) {
        showNotification('精力不足', '需要休息或使用能量藥水！');
        return;
    }
    
    switch(tool) {
        case 'hoe':
            farmTile();
            break;
        case 'watering_can':
            waterCrops();
            break;
        case 'seeds':
            plantSeeds();
            break;
        case 'axe':
            chopWood();
            break;
        case 'pickaxe':
            mineStone();
            break;
    }
}

function farmTile() {
    window.farmGameState.player.energy -= 5;
    showNotification('農作', '翻土完成！準備種植種子。');
    updateStatusDisplay();
    
    // 添加Canvas特效
    if (window.canvasEffects) {
        const player = window.farmGameState.player;
        window.canvasEffects.createToolEffect(player.x, player.y, 'hoe');
    }
}

function waterCrops() {
    if (window.farmGameState.player.energy >= 10) {
        window.farmGameState.player.energy -= 10;
        showNotification('澆水', '作物正在茁壯成長！');
        updateStatusDisplay();
    } else {
        showNotification('精力不足', '需要休息！');
    }
}

function plantSeeds() {
    if (window.farmGameState.inventory.seeds.carrot > 0) {
        window.farmGameState.inventory.seeds.carrot--;
        window.farmGameState.player.energy -= 5;
        showNotification('種植', '種下了蘿蔔種子！記得澆水。');
        updateInventoryDisplay();
        updateStatusDisplay();
    } else {
        showNotification('沒有種子', '去商店購買種子吧！');
    }
}

function chopWood() {
    window.farmGameState.player.energy -= 15;
    const wood = Math.floor(Math.random() * 3) + 1;
    window.farmGameState.player.money += wood * 10;
    showNotification('砍柴', `收集了${wood}塊木材！獲得${wood * 10}金幣。`);
    updateStatusDisplay();
    
    // 添加Canvas特效
    if (window.canvasEffects) {
        const player = window.farmGameState.player;
        window.canvasEffects.createToolEffect(player.x, player.y, 'axe');
        window.canvasEffects.createHarvestEffect(player.x + 20, player.y - 10, 'wood');
    }
}

function mineStone() {
    window.farmGameState.player.energy -= 20;
    const ore = Math.floor(Math.random() * 2) + 1;
    window.farmGameState.player.money += ore * 25;
    showNotification('挖礦', `挖到了${ore}塊礦石！獲得${ore * 25}金幣。`);
    updateStatusDisplay();
}

function updateStatusDisplay() {
    // 更新狀態欄顯示
    const statusElements = document.querySelectorAll('.status-value');
    if (statusElements.length >= 7) {
        statusElements[0].textContent = `${window.farmGameState.player.health}/100`;
        statusElements[1].textContent = `${window.farmGameState.player.energy}/100`;
        statusElements[2].textContent = `${window.farmGameState.player.money}G`;
        statusElements[3].textContent = `Lv.${window.farmGameState.player.level}`;
        statusElements[4].textContent = `AI: ${window.farmGameState.aiUsesLeft}/10`;
    }
}

// 修復 updateDisplay 函數缺失問題
function updateDisplay() {
    if (window.farmGameState) {
        updateStatusDisplay();
        updateInventoryDisplay();
    }
}

// 修復背包顯示函數
function updateInventoryDisplay() {
    const inventoryContainer = document.querySelector('.inventory-items');
    if (inventoryContainer && window.farmGameState) {
        inventoryContainer.innerHTML = createInventoryHTML();
    }
}

// 建築物互動功能
function enterBuilding(buildingType) {
    if (!window.farmGameState) return;
    
    switch (buildingType) {
        case 'townhall':
            talkToNPC('Mayor Tom');
            break;
        case 'shop':
            talkToNPC('Shopkeeper Mary');
            break;
        case 'blacksmith':
            talkToNPC('Blacksmith Jack');
            break;
        case 'clinic':
            talkToNPC('Doctor Lily');
            break;
        default:
            showNotification('建築', '這個建築還在建設中...');
    }
}

// 工具選擇功能
function selectTool(tool) {
    if (!window.farmGameState) return;
    
    window.farmGameState.player.currentTool = tool;
    let toolName = '';
    switch (tool) {
        case 'hoe': toolName = '鋤頭'; break;
        case 'water': toolName = '澆水壺'; break;
        case 'axe': toolName = '斧頭'; break;
        default: toolName = tool;
    }
    showNotification('工具選擇', `已選擇 ${toolName}`);
}

// 前往農場
function goToFarm() {
    showNotification('場景切換', '來到了你的農場');
    // 這裡可以添加場景切換邏輯
}

// NPC對話功能（簡化版）
function talkToNPC(npcName) {
    if (!window.farmGameState) return;
    
    if (window.farmGameState.aiUsesLeft > 0) {
        window.farmGameState.aiUsesLeft--;
        showDialogue(npcName, `你好！我是${npcName}。今天過得怎麼樣？`, [
            { text: '很好！', action: () => closeDialogue() },
            { text: '需要幫助', action: () => useAIAssistant() }
        ]);
    } else {
        // 固定對話回應
        const dialogues = {
            'Mayor Tom': '歡迎來到我們的村莊！記得要照顧好你的農場。',
            'Shopkeeper Mary': '歡迎光臨！需要購買種子或工具嗎？',
            'Blacksmith Jack': '你的工具需要修理嗎？我可以幫你升級！',
            'Doctor Lily': '記得要保持健康！需要治療的話來找我。'
        };
        showDialogue(npcName, dialogues[npcName] || '你好！', [
            { text: '好的', action: () => closeDialogue() }
        ]);
    }
    updateStatusDisplay();
}

// 對話框顯示
function showDialogue(speaker, text, options = []) {
    const dialogueDiv = document.createElement('div');
    dialogueDiv.className = 'dialogue-overlay';
    dialogueDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    dialogueDiv.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 10px; max-width: 400px; text-align: center;">
            <h5>${speaker}</h5>
            <p>${text}</p>
            <div style="margin-top: 15px;">
                ${options.map((option, index) => 
                    `<button class="btn btn-primary btn-sm me-2" onclick="dialogueOption(${index})">${option.text}</button>`
                ).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(dialogueDiv);
    
    // 儲存選項動作
    window.currentDialogueOptions = options;
}

// 對話選項處理
function dialogueOption(index) {
    if (window.currentDialogueOptions && window.currentDialogueOptions[index]) {
        window.currentDialogueOptions[index].action();
    }
}

// 關閉對話框
function closeDialogue() {
    const dialogue = document.querySelector('.dialogue-overlay');
    if (dialogue) {
        dialogue.remove();
    }
    window.currentDialogueOptions = null;
}

// 通知顯示
function showNotification(title, text) {
    const notification = document.createElement('div');
    notification.className = 'game-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        z-index: 999;
        max-width: 250px;
    `;
    
    notification.innerHTML = `
        <strong>${title}</strong><br>
        ${text}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function useAIAssistant() {
    if (window.farmGameState.aiUsesLeft > 0) {
        window.farmGameState.aiUsesLeft--;
        showNotification('AI助手', `AI助手已啟用！剩餘 ${window.farmGameState.aiUsesLeft}/10 次使用。`);
        updateStatusDisplay();
        
        // 模擬AI互動 - 提供有用的遊戲建議
        const aiAdvice = [
            '建議先種植蘿蔔，成長快速且利潤不錯！',
            '記得定期澆水，作物才會健康成長。',
            '去森林收集木材可以賺取額外金錢。',
            '升級工具可以提高工作效率。',
            '與村民多互動可以提升友好度。',
            '保持充足的精力，避免過度勞累。',
            '礦坑雖然危險，但礦石價值很高。',
            '多樣化種植可以分散風險。'
        ];
        
        setTimeout(() => {
            const advice = aiAdvice[Math.floor(Math.random() * aiAdvice.length)];
            showNotification('AI建議', advice);
        }, 1000);
        
    } else {
        showNotification('AI使用完畢', '今天的AI助手使用次數已用完！明天再來吧。');
    }
}
