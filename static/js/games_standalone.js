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
    const gameContainer = document.getElementById('gameContainer');
    const gameInfo = document.getElementById('gameInfo');
    const gameControls = document.getElementById('gameControls');
    
    if (!gameContainer || !gameInfo || !gameControls) {
        console.error('遊戲容器元素未找到');
        return;
    }
    
    // 清除目前內容
    gameContainer.innerHTML = '';
    gameInfo.innerHTML = '';
    gameControls.innerHTML = '';
    
    // 根據遊戲類型載入不同的遊戲
    switch(gameType) {
        case 'tetris':
            loadTetrisGame();
            break;
        case 'mahjong':
            loadMahjongGame();
            break;
        case 'farm':
            loadFarmStoryGame();
            break;
        default:
            gameContainer.innerHTML = '<div class="text-center text-muted"><p>遊戲載入失敗</p></div>';
            break;
    }
}

function loadTetrisGame() {
    const gameContainer = document.getElementById('gameContainer');
    const gameInfo = document.getElementById('gameInfo');
    const gameControls = document.getElementById('gameControls');
    
    gameInfo.innerHTML = '<h6>俄羅斯方塊</h6><p>使用方向鍵移動方塊，空白鍵旋轉</p>';
    gameControls.innerHTML = '<button class="btn btn-primary" onclick="startTetrisInPanel()">開始遊戲</button>';
    
    startTetrisInPanel();
}

function loadMahjongGame() {
    const gameContainer = document.getElementById('gameContainer');
    const gameInfo = document.getElementById('gameInfo');
    const gameControls = document.getElementById('gameControls');
    
    gameInfo.innerHTML = '<h6>麻將</h6><p>4人麻將遊戲，點擊牌張進行遊戲</p>';
    gameControls.innerHTML = '<button class="btn btn-primary" onclick="startMahjongInPanel()">開始遊戲</button>';
    
    startMahjongInPanel();
}

function loadFarmStoryGame() {
    const gameContainer = document.getElementById('gameContainer');
    const gameInfo = document.getElementById('gameInfo');
    const gameControls = document.getElementById('gameControls');
    
    gameInfo.innerHTML = `
        <h6>農場物語</h6>
        <p>獨立RPG遊戲</p>
        <div class="game-stats">
            <small>金錢: ${gameData.farmStory.money} | AI次數: ${gameData.farmStory.aiUsesLeft}/10</small>
        </div>
    `;
    gameControls.innerHTML = `
        <button class="btn btn-success" onclick="showGameStats()">查看狀態</button>
        <button class="btn btn-warning" onclick="resetFarmGame()">重新開始</button>
    `;
    
    startFarmStoryInPanel();
}

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
        updateDisplay();
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
            updateDisplay();
            
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
            updateDisplay();
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

function initFarmStoryGame() {
    const board = document.getElementById('farmStoryBoard');
    if (!board) return;
    
    // 遊戲狀態
    let gameState = {
        player: {
            name: '農場主',
            health: 100,
            energy: 100,
            money: 500,
            level: 1,
            experience: 0
        },
        inventory: {
            seeds: { carrot: 5, corn: 3 },
            tools: { hoe: 1, watering_can: 1 },
            crops: { carrot: 0, corn: 0 },
            items: { energy_potion: 2 }
        },
        farm: {
            plots: Array(9).fill(null), // 3x3 農田
            water_status: Array(9).fill(false)
        },
        npcs: {
            mayor_tom: { friendship: 50, quests: [] },
            shop_mary: { friendship: 30, quests: [] },
            blacksmith_jack: { friendship: 20, quests: [] },
            doctor_lily: { friendship: 40, quests: [] }
        },
        aiUsesLeft: 10,
        currentScene: 'village'
    };
    
    function showVillageScene() {
        gameState.currentScene = 'village';
        updateDisplay();
    }
    
    function updateDisplay() {
        let content = '';
        
        if (gameState.currentScene === 'village') {
            content = `
                <div class="farm-story-rpg">
                    <div class="player-status mb-3">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>🧑‍🌾 ${gameState.player.name} (等級 ${gameState.player.level})</h6>
                                <div class="progress mb-1" style="height: 15px;">
                                    <div class="progress-bar bg-success" style="width: ${gameState.player.health}%">${gameState.player.health}/100 ❤️</div>
                                </div>
                                <div class="progress mb-2" style="height: 15px;">
                                    <div class="progress-bar bg-info" style="width: ${gameState.player.energy}%">${gameState.player.energy}/100 ⚡</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <p class="mb-1">💰 金錢: ${gameState.player.money}</p>
                                <p class="mb-1">⭐ 經驗: ${gameState.player.experience}</p>
                                <p class="mb-0">🤖 AI助手剩餘: ${gameState.aiUsesLeft}次</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="scene-content">
                        <h6>🏘️ 村莊廣場</h6>
                        <p>陽光灿爛的一天，村莊裡很熱鬧。你可以拜訪村民或前往其他地點。</p>
                        
                        <div class="npcs-area mb-3">
                            <h6>村民：</h6>
                            <div class="row">
                                <div class="col-6 col-md-3 mb-2">
                                    <button class="btn btn-outline-primary btn-sm w-100" onclick="talkToNPC('村長湯姆')">
                                        👨‍💼 村長湯姆<br><small>友好度: ${gameState.npcs.mayor_tom.friendship}</small>
                                    </button>
                                </div>
                                <div class="col-6 col-md-3 mb-2">
                                    <button class="btn btn-outline-success btn-sm w-100" onclick="talkToNPC('商店瑪麗')">
                                        👩‍💼 商店瑪麗<br><small>友好度: ${gameState.npcs.shop_mary.friendship}</small>
                                    </button>
                                </div>
                                <div class="col-6 col-md-3 mb-2">
                                    <button class="btn btn-outline-warning btn-sm w-100" onclick="talkToNPC('鐵匠傑克')">
                                        🔨 鐵匠傑克<br><small>友好度: ${gameState.npcs.blacksmith_jack.friendship}</small>
                                    </button>
                                </div>
                                <div class="col-6 col-md-3 mb-2">
                                    <button class="btn btn-outline-info btn-sm w-100" onclick="talkToNPC('醫生莉莉')">
                                        👩‍⚕️ 醫生莉莉<br><small>友好度: ${gameState.npcs.doctor_lily.friendship}</small>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="locations-area mb-3">
                            <h6>地點：</h6>
                            <div class="row">
                                <div class="col-6 col-md-4 mb-2">
                                    <button class="btn btn-success w-100" onclick="goToFarm()">🚜 我的農場</button>
                                </div>
                                <div class="col-6 col-md-4 mb-2">
                                    <button class="btn btn-secondary w-100" onclick="goToForest()">🌲 森林</button>
                                </div>
                                <div class="col-6 col-md-4 mb-2">
                                    <button class="btn btn-dark w-100" onclick="goToMine()">⛏️ 礦坑</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="quick-actions">
                            <button class="btn btn-info btn-sm me-2" onclick="showInventory()">🎒 背包</button>
                            <button class="btn btn-warning btn-sm me-2" onclick="useAIHelper()">🤖 AI助手</button>
                            <button class="btn btn-light btn-sm" onclick="showGameStats()">📊 統計</button>
                        </div>
                    </div>
                </div>
            `;
        } else if (gameState.currentScene === 'farm') {
            content = `
                <div class="farm-scene">
                    <h6>🚜 我的農場</h6>
                    <p>這是你的農場，有9塊農田可以種植作物。</p>
                    
                    <div class="farm-grid mb-3">
                        ${gameState.farm.plots.map((plot, index) => `
                            <div class="farm-plot ${plot ? 'planted' : 'empty'} ${gameState.farm.water_status[index] ? 'watered' : ''}" 
                                 onclick="managePlot(${index})">
                                ${plot ? `🌱${plot}` : '⬜'}
                                ${gameState.farm.water_status[index] ? '💧' : ''}
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="farm-actions mb-3">
                        <button class="btn btn-success btn-sm me-2" onclick="plantCrops()">🌱 種植</button>
                        <button class="btn btn-primary btn-sm me-2" onclick="waterCrops()">💧 澆水</button>
                        <button class="btn btn-warning btn-sm me-2" onclick="harvestCrops()">🌾 收穫</button>
                        <button class="btn btn-secondary btn-sm" onclick="showVillageScene()">🔙 回村莊</button>
                    </div>
                    
                    <div class="inventory-display">
                        <small>種子: 🥕${gameState.inventory.seeds.carrot} 🌽${gameState.inventory.seeds.corn}</small>
                    </div>
                </div>
            `;
        }
        
        board.innerHTML = content;
    }
    
    // NPC對話系統
    window.talkToNPC = function(npcName) {
        let dialogue = '';
        
        switch(npcName) {
            case '村長湯姆':
                dialogue = `
                    <div class="dialogue-box">
                        <h6>👨‍💼 村長湯姆</h6>
                        <p>"歡迎回到農場！你祖父會為你感到驕傲的。需要什麼幫助嗎？"</p>
                        <div class="dialogue-options">
                            <button class="btn btn-primary btn-sm me-2" onclick="gainFriendship('mayor_tom', 5); showMessage('村長湯姆對你更友好了！')">💬 聊天 (+5友好度)</button>
                            <button class="btn btn-info btn-sm me-2" onclick="getQuest('mayor_tom')">📋 接受任務</button>
                            <button class="btn btn-secondary btn-sm" onclick="showVillageScene()">👋 離開</button>
                        </div>
                    </div>
                `;
                break;
            case '商店瑪麗':
                dialogue = `
                    <div class="dialogue-box">
                        <h6>👩‍💼 商店瑪麗</h6>
                        <p>"歡迎光臨！我這裡有最新鮮的種子和工具！"</p>
                        <div class="shop-items mb-3">
                            <div class="row">
                                <div class="col-6">
                                    <button class="btn btn-outline-warning btn-sm w-100 mb-1" onclick="buyItem('carrot_seeds', 50)">🥕 蘿蔔種子 (50金)</button>
                                    <button class="btn btn-outline-success btn-sm w-100" onclick="buyItem('corn_seeds', 80)">🌽 玉米種子 (80金)</button>
                                </div>
                                <div class="col-6">
                                    <button class="btn btn-outline-info btn-sm w-100 mb-1" onclick="buyItem('energy_potion', 100)">⚡ 能量藥水 (100金)</button>
                                    <button class="btn btn-outline-primary btn-sm w-100" onclick="sellCrops()">💰 賣出作物</button>
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-secondary btn-sm" onclick="showVillageScene()">🔙 離開商店</button>
                    </div>
                `;
                break;
            case '鐵匠傑克':
                dialogue = `
                    <div class="dialogue-box">
                        <h6>🔨 鐵匠傑克</h6>
                        <p>"需要升級你的農具嗎？好工具能讓工作事半功倍！"</p>
                        <div class="upgrade-options mb-3">
                            <button class="btn btn-warning btn-sm me-2" onclick="upgradeTools('hoe', 200)">⛏️ 升級鋤頭 (200金)</button>
                            <button class="btn btn-info btn-sm me-2" onclick="upgradeTools('watering_can', 150)">🪣 升級澆水器 (150金)</button>
                        </div>
                        <button class="btn btn-secondary btn-sm" onclick="showVillageScene()">🔙 離開</button>
                    </div>
                `;
                break;
            case '醫生莉莉':
                dialogue = `
                    <div class="dialogue-box">
                        <h6>👩‍⚕️ 醫生莉莉</h6>
                        <p>"農場生活辛苦，要記得照顧好身體哦！"</p>
                        <div class="healing-options mb-3">
                            <button class="btn btn-success btn-sm me-2" onclick="restoreHealth(50, 0)">❤️ 免費治療 (+50健康)</button>
                            <button class="btn btn-info btn-sm me-2" onclick="restoreHealth(100, 150)">💊 完全治療 (150金)</button>
                        </div>
                        <button class="btn btn-secondary btn-sm" onclick="showVillageScene()">🔙 離開</button>
                    </div>
                `;
                break;
        }
        
        board.innerHTML = dialogue;
    };
    
    // 地點移動
    window.goToFarm = function() {
        gameState.currentScene = 'farm';
        updateDisplay();
    };
    
    window.goToForest = function() {
        showMessage('🌲 你在森林中散步，發現了一些野果！獲得了50金幣。');
        gameState.player.money += 50;
        gameState.player.energy -= 10;
        updateDisplay();
    };
    
    window.goToMine = function() {
        showMessage('⛏️ 你在礦坑中挖掘，找到了寶石！獲得了100金幣，但消耗了體力。');
        gameState.player.money += 100;
        gameState.player.energy -= 20;
        updateDisplay();
    };
    
    // 農場管理
    window.managePlot = function(plotIndex) {
        const plot = gameState.farm.plots[plotIndex];
        if (plot) {
            if (Math.random() > 0.5) {
                showMessage(`收穫了${plot}！獲得作物和經驗。`);
                gameState.inventory.crops[plot] = (gameState.inventory.crops[plot] || 0) + 1;
                gameState.player.experience += 10;
                gameState.farm.plots[plotIndex] = null;
                gameState.farm.water_status[plotIndex] = false;
            } else {
                showMessage('作物還沒成熟，再等等吧！');
            }
        } else {
            if (gameState.inventory.seeds.carrot > 0) {
                gameState.farm.plots[plotIndex] = 'carrot';
                gameState.inventory.seeds.carrot--;
                showMessage('種下了蘿蔔種子！');
            } else {
                showMessage('沒有種子了！去商店買一些吧。');
            }
        }
        updateDisplay();
    };
    
    // 購買系統
    window.buyItem = function(item, cost) {
        if (gameState.player.money >= cost) {
            gameState.player.money -= cost;
            switch(item) {
                case 'carrot_seeds':
                    gameState.inventory.seeds.carrot += 5;
                    showMessage('購買了5個蘿蔔種子！');
                    break;
                case 'corn_seeds':
                    gameState.inventory.seeds.corn += 3;
                    showMessage('購買了3個玉米種子！');
                    break;
                case 'energy_potion':
                    gameState.inventory.items.energy_potion++;
                    showMessage('購買了能量藥水！');
                    break;
            }
            gainFriendship('shop_mary', 2);
        } else {
            showMessage('金錢不足！');
        }
    };
    
    // AI助手系統
    window.useAIHelper = function() {
        if (gameState.aiUsesLeft > 0) {
            gameState.aiUsesLeft--;
            showMessage(`🤖 AI助手：「建議你先種植作物，然後定期澆水。記得照顧好健康！」\n剩餘使用次數：${gameState.aiUsesLeft}`);
        } else {
            showMessage('AI助手使用次數已用完！');
        }
    };
    
    // 輔助函數
    window.gainFriendship = function(npc, amount) {
        gameState.npcs[npc].friendship = Math.min(100, gameState.npcs[npc].friendship + amount);
    };
    
    window.showMessage = function(message) {
        alert(message);
        updateDisplay();
    };
    
    window.showVillageScene = showVillageScene;
    window.updateGameInfo = updateDisplay;
    
    // 開始遊戲
    showVillageScene();
}

function playTile(tile) {
    tile.style.opacity = '0.5';
    setTimeout(() => {
        alert('已出牌：' + tile.textContent);
        tile.style.opacity = '1';
    }, 300);
}

function initFarmStoryGame() {
    showVillageScene();
}

// 農場物語場景系統
function showVillageScene() {
    const board = document.getElementById('farmStoryBoard');
    if (!board) return;
    
    board.innerHTML = `
        <div class="farm-story-ui">
            <div class="story-panel">
                <h6>村莊</h6>
                <p>你來到了寧靜的小村莊，這裡有友善的村民等著與你見面。</p>
                <div class="scene-actions">
                    <h6>與村民對話：</h6>
                    <div class="npc-area">
                        <button class="btn btn-sm btn-outline-primary me-2" onclick="talkToNPC('村長湯姆')">村長湯姆</button>
                        <button class="btn btn-sm btn-outline-success me-2" onclick="talkToNPC('商店瑪麗')">商店瑪麗</button>
                        <button class="btn btn-sm btn-outline-warning me-2" onclick="talkToNPC('鐵匠傑克')">鐵匠傑克</button>
                        <button class="btn btn-sm btn-outline-info me-2" onclick="talkToNPC('醫生莉莉')">醫生莉莉</button>
                    </div>
                    <hr>
                    <h6>前往其他地點：</h6>
                    <div class="location-area">
                        <button class="btn btn-sm btn-success me-2" onclick="goToFarm()">農場</button>
                        <button class="btn btn-sm btn-info me-2" onclick="goToForest()">森林</button>
                        <button class="btn btn-sm btn-secondary me-2" onclick="goToMine()">礦洞</button>
                    </div>
                    ${gameData.farmStory.aiUsesLeft > 0 ? 
                        '<button class="btn btn-sm btn-danger mt-2" onclick="useAIHelper()">🤖 AI助手 (' + gameData.farmStory.aiUsesLeft + '/10)</button>' 
                        : '<p class="text-muted mt-2">AI助手次數已用完</p>'
                    }
                </div>
            </div>
        </div>
    `;
}

// NPC對話系統（固定劇情）
function talkToNPC(npcName) {
    const board = document.getElementById('farmStoryBoard');
    if (!board) return;
    
    let dialogue = '';
    const relationship = gameData.farmStory.relationships[npcName];
    
    switch(npcName) {
        case '村長湯姆':
            if (relationship === 0) {
                dialogue = `
                    <div class="dialogue-box">
                        <h6>村長湯姆</h6>
                        <p>"歡迎回到村莊！你祖父的農場已經荒廢很久了，需要你的努力才能重新繁榮。要不要先去農場看看？"</p>
                        <button class="btn btn-sm btn-primary" onclick="goToFarm()">去農場</button>
                        <button class="btn btn-sm btn-secondary" onclick="showVillageScene()">稍後再去</button>
                    </div>
                `;
            } else {
                dialogue = `
                    <div class="dialogue-box">
                        <h6>村長湯姆</h6>
                        <p>"你的農場經營得不錯！繼續努力，村莊的未來就靠你了！"</p>
                        <button class="btn btn-sm btn-secondary" onclick="showVillageScene()">回到村莊</button>
                    </div>
                `;
            }
            break;
            
        case '商店瑪麗':
            dialogue = `
                <div class="dialogue-box">
                    <h6>商店瑪麗</h6>
                    <p>"歡迎光臨！我這裡有新鮮的種子。蘿蔔種子20金，玉米種子30金。"</p>
                    <button class="btn btn-sm btn-success" onclick="buySeeds('蘿蔔', 20)">蘿蔔種子(20金)</button>
                    <button class="btn btn-sm btn-warning" onclick="buySeeds('玉米', 30)">玉米種子(30金)</button>
                    <button class="btn btn-sm btn-secondary" onclick="showVillageScene()">離開商店</button>
                </div>
            `;
            break;
            
        case '鐵匠傑克':
            dialogue = `
                <div class="dialogue-box">
                    <h6>鐵匠傑克</h6>
                    <p>"需要升級工具嗎？更好的工具能提高你的農作效率！升級費用50金。"</p>
                    <button class="btn btn-sm btn-warning" onclick="upgradeTools()">升級工具(50金)</button>
                    <button class="btn btn-sm btn-secondary" onclick="showVillageScene()">稍後再來</button>
                </div>
            `;
            break;
            
        case '醫生莉莉':
            dialogue = `
                <div class="dialogue-box">
                    <h6>醫生莉莉</h6>
                    <p>"農場生活很辛苦，記得要照顧好自己！這瓶恢復藥水免費送給你。"</p>
                    <button class="btn btn-sm btn-info" onclick="getHealing()">接受治療</button>
                    <button class="btn btn-sm btn-secondary" onclick="showVillageScene()">謝謝醫生</button>
                </div>
            `;
            break;
    }
    
    board.innerHTML = dialogue;
    
    // 增加關係值
    gameData.farmStory.relationships[npcName]++;
    updateGameInfo();
}

// 場景切換函數
function goToFarm() {
    const board = document.getElementById('farmStoryBoard');
    if (!board) return;
    
    board.innerHTML = `
        <div class="farm-scene">
            <h6>你的農場</h6>
            <p>這是你繼承的農場，土地肥沃但需要細心照料。</p>
            <div class="farm-actions">
                <button class="btn btn-sm btn-success me-2" onclick="plantCrops()">種植作物</button>
                <button class="btn btn-sm btn-primary me-2" onclick="waterCrops()">澆水</button>
                <button class="btn btn-sm btn-warning me-2" onclick="harvestCrops()">收穫</button>
                <button class="btn btn-sm btn-secondary" onclick="showVillageScene()">回村莊</button>
            </div>
            <div id="farmStatus" class="mt-3">
                <p>農場狀態：等待耕作</p>
            </div>
        </div>
    `;
}

function goToForest() {
    const board = document.getElementById('farmStoryBoard');
    if (!board) return;
    
    board.innerHTML = `
        <div class="forest-scene">
            <h6>神秘森林</h6>
            <p>森林裡有各種珍貴的資源等待收集。</p>
            <div class="forest-actions">
                <button class="btn btn-sm btn-success me-2" onclick="collectWood()">收集木材</button>
                <button class="btn btn-sm btn-info me-2" onclick="findBerries()">尋找漿果</button>
                <button class="btn btn-sm btn-secondary" onclick="showVillageScene()">回村莊</button>
            </div>
            <div id="forestStatus" class="mt-3">
                <p>森林狀態：安全可探索</p>
            </div>
        </div>
    `;
}

function goToMine() {
    const board = document.getElementById('farmStoryBoard');
    if (!board) return;
    
    board.innerHTML = `
        <div class="mine-scene">
            <h6>古老礦洞</h6>
            <p>深邃的礦洞裡埋藏著珍貴的礦石。</p>
            <div class="mine-actions">
                <button class="btn btn-sm btn-warning me-2" onclick="mineOre()">挖掘礦石</button>
                <button class="btn btn-sm btn-info me-2" onclick="exploreDeeper()">深入探索</button>
                <button class="btn btn-sm btn-secondary" onclick="showVillageScene()">離開礦洞</button>
            </div>
            <div id="mineStatus" class="mt-3">
                <p>礦洞狀態：入口層</p>
            </div>
        </div>
    `;
}

// 遊戲動作函數
function buySeeds(type, cost) {
    if (gameData.farmStory.money >= cost) {
        gameData.farmStory.money -= cost;
        gameData.farmStory.crops.push(type + '種子');
        showMessage(`購買了${type}種子！剩餘金錢：${gameData.farmStory.money}`);
    } else {
        showMessage('金錢不足！');
    }
}

function upgradeTools() {
    if (gameData.farmStory.money >= 50) {
        gameData.farmStory.money -= 50;
        gameData.farmStory.tools.push('高級工具');
        showMessage('工具升級成功！效率提升！');
    } else {
        showMessage('金錢不足！需要50金。');
    }
}

function getHealing() {
    showMessage('你感到精神百倍！健康值完全恢復！');
}

function plantCrops() {
    if (gameData.farmStory.crops.length > 0) {
        const crop = gameData.farmStory.crops.pop();
        updateFarmStatus('種下了' + crop + '！記得澆水。', 'success');
    } else {
        updateFarmStatus('沒有種子可種植！去商店買一些吧。', 'warning');
    }
}

function waterCrops() {
    updateFarmStatus('澆水完成！作物正在茁壯成長。', 'info');
}

function harvestCrops() {
    const earned = Math.floor(Math.random() * 50) + 30;
    gameData.farmStory.money += earned;
    updateFarmStatus(`收穫成功！獲得${earned}金幣。`, 'warning');
    updateGameInfo();
}

function collectWood() {
    updateForestStatus('收集了一些優質木材！', 'success');
}

function findBerries() {
    updateForestStatus('找到了美味的野生漿果！', 'info');
}

function mineOre() {
    const earned = Math.floor(Math.random() * 80) + 40;
    gameData.farmStory.money += earned;
    updateMineStatus(`挖到了珍貴礦石！獲得${earned}金幣。`, 'warning');
    updateGameInfo();
}

function exploreDeeper() {
    updateMineStatus('深入礦洞，發現了神秘的通道！', 'info');
}

// 狀態更新函數
function updateFarmStatus(message, type) {
    const status = document.getElementById('farmStatus');
    if (status) {
        status.innerHTML = `<p class="text-${type}">${message}</p>`;
    }
}

function updateForestStatus(message, type) {
    const status = document.getElementById('forestStatus');
    if (status) {
        status.innerHTML = `<p class="text-${type}">${message}</p>`;
    }
}

function updateMineStatus(message, type) {
    const status = document.getElementById('mineStatus');
    if (status) {
        status.innerHTML = `<p class="text-${type}">${message}</p>`;
    }
}

function showMessage(message) {
    const board = document.getElementById('farmStoryBoard');
    if (!board) return;
    
    board.innerHTML = `
        <div class="message-box text-center">
            <p>${message}</p>
            <button class="btn btn-primary" onclick="showVillageScene()">繼續</button>
        </div>
    `;
}

// AI助手功能（限制10次使用）
function useAIHelper() {
    if (gameData.farmStory.aiUsesLeft <= 0) {
        showMessage('AI助手次數已用完！');
        return;
    }
    
    gameData.farmStory.aiUsesLeft--;
    
    // 這裡可以接入實際的AI對話功能
    const board = document.getElementById('farmStoryBoard');
    if (!board) return;
    
    board.innerHTML = `
        <div class="ai-helper-panel">
            <h6>🤖 AI農場助手 (剩餘 ${gameData.farmStory.aiUsesLeft}/10 次)</h6>
            <div class="input-group mb-3">
                <input type="text" class="form-control" id="aiQuestion" placeholder="問問AI助手關於農場的建議...">
                <button class="btn btn-primary" onclick="askAI()">詢問</button>
            </div>
            <div id="aiResponse" class="ai-response"></div>
            <button class="btn btn-secondary mt-3" onclick="showVillageScene()">回到村莊</button>
        </div>
    `;
    
    updateGameInfo();
}

async function askAI() {
    const question = document.getElementById('aiQuestion')?.value;
    const response = document.getElementById('aiResponse');
    
    if (!question || !response) return;
    
    if (!question.trim()) {
        response.innerHTML = `
            <div class="alert alert-warning">
                請輸入問題！
            </div>
        `;
        return;
    }
    
    // 顯示載入狀態
    response.innerHTML = `
        <div class="alert alert-info">
            <div class="spinner-border spinner-border-sm me-2"></div>
            AI助手正在思考中...
        </div>
    `;
    
    try {
        // 發送請求到AI聊天端點
        const chatResponse = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `農場遊戲助手：${question}（請給出關於農場物語遊戲的建議，回答要簡潔實用）`
            })
        });
        
        const data = await chatResponse.json();
        
        if (data.response) {
            response.innerHTML = `
                <div class="alert alert-success">
                    <strong>🤖 AI農場助手：</strong><br>
                    ${data.response}
                </div>
            `;
        } else {
            throw new Error('AI回應格式錯誤');
        }
    } catch (error) {
        console.error('AI請求失敗:', error);
        // 使用備用回應
        const fallbackResponses = [
            "建議你先種植蘿蔔，成長快且收益穩定！",
            "記得每天澆水，這樣作物會長得更好！",
            "升級工具可以大幅提升效率，值得投資！",
            "多與村民對話可以獲得有用的建議！",
            "森林裡的木材很珍貴，可以用來建造設施！",
            "與村民建立良好關係可以獲得特殊任務！",
            "合理規劃農場佈局能提高效率！",
            "探索礦洞要小心，但收益很高！"
        ];
        
        const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        
        response.innerHTML = `
            <div class="alert alert-info">
                <strong>🤖 AI農場助手：</strong><br>
                ${randomResponse}
                <small class="d-block mt-2 text-muted">（離線模式回應）</small>
            </div>
        `;
    }
    
    // 清空輸入框
    document.getElementById('aiQuestion').value = '';
}

// 遊戲狀態管理
function showGameStats() {
    const board = document.getElementById('farmStoryBoard');
    if (!board) return;
    
    board.innerHTML = `
        <div class="game-stats-panel">
            <h6>遊戲狀態</h6>
            <div class="stats-grid">
                <p><strong>玩家：</strong> ${gameData.farmStory.playerName}</p>
                <p><strong>金錢：</strong> ${gameData.farmStory.money} 金</p>
                <p><strong>AI次數：</strong> ${gameData.farmStory.aiUsesLeft}/10</p>
                <p><strong>作物：</strong> ${gameData.farmStory.crops.join(', ') || '無'}</p>
                <p><strong>工具：</strong> ${gameData.farmStory.tools.join(', ')}</p>
                <hr>
                <h6>村民關係：</h6>
                ${Object.entries(gameData.farmStory.relationships).map(([name, level]) => 
                    `<p>${name}: ${level} 級</p>`
                ).join('')}
            </div>
            <button class="btn btn-primary" onclick="showVillageScene()">返回遊戲</button>
        </div>
    `;
}

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
    
    showMessage('遊戲已重置！重新開始你的農場冒險！');
    updateGameInfo();
}

function updateGameInfo() {
    const gameInfo = document.getElementById('gameInfo');
    if (gameInfo && gameInfo.innerHTML.includes('農場物語')) {
        gameInfo.innerHTML = `
            <h6>農場物語</h6>
            <p>獨立RPG遊戲</p>
            <div class="game-stats">
                <small>金錢: ${gameData.farmStory.money} | AI次數: ${gameData.farmStory.aiUsesLeft}/10</small>
            </div>
        `;
    }
}

// 確保函數在全域作用域中可用
window.loadGame = loadGame;
window.startTetrisInPanel = startTetrisInPanel;
window.startMahjongInPanel = startMahjongInPanel;
window.startFarmStoryInPanel = startFarmStoryInPanel;
window.initTetrisGame = initTetrisGame;
window.initMahjongGame = initMahjongGame;
window.initFarmStoryGame = initFarmStoryGame;
window.talkToNPC = talkToNPC;
window.goToFarm = goToFarm;
window.goToForest = goToForest;
window.goToMine = goToMine;
window.buySeeds = buySeeds;
window.upgradeTools = upgradeTools;
window.getHealing = getHealing;
window.plantCrops = plantCrops;
window.waterCrops = waterCrops;
window.harvestCrops = harvestCrops;
window.collectWood = collectWood;
window.findBerries = findBerries;
window.mineOre = mineOre;
window.exploreDeeper = exploreDeeper;
window.useAIHelper = useAIHelper;
window.askAI = askAI;
window.showGameStats = showGameStats;
window.resetFarmGame = resetFarmGame;
window.showVillageScene = showVillageScene;
window.playTile = playTile;