// 簡化版遊戲系統 - 只包含俄羅斯方塊和麻將
console.log('載入簡化版遊戲系統...');

// 遊戲選擇函數
function loadGameSelection(gameType) {
    console.log('載入遊戲:', gameType);
    
    const gameContainer = document.getElementById('gameContainer');
    if (!gameContainer) {
        console.error('找不到遊戲容器');
        return;
    }
    
    switch(gameType) {
        case 'tetris':
            loadTetrisGame();
            break;
        case 'mahjong':
            loadMahjongGame();
            break;
        case 'pinball':
            loadPinballGame();
            break;
        case 'farm2d':
            if (typeof load2DFarmGame === 'function') {
                load2DFarmGame();
            } else {
                console.error('2D 牧場遊戲尚未載入');
            }
            break;
        default:
            showGameSelection();
    }
}

// 顯示遊戲選擇畫面
function showGameSelection() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div class="game-selection">
            <h3>🎮 選擇遊戲</h3>
            <div class="game-buttons">
                <button onclick="loadGameSelection('tetris')" class="game-btn tetris-btn">
                    <div class="game-icon">🧩</div>
                    <div class="game-name">俄羅斯方塊</div>
                    <div class="game-desc">經典拼圖遊戲</div>
                </button>
                <button onclick="loadGameSelection('mahjong')" class="game-btn mahjong-btn">
                    <div class="game-icon">🀄</div>
                    <div class="game-name">麻將遊戲</div>
                    <div class="game-desc">傳統麻將對戰</div>
                </button>
                <button onclick="loadGameSelection('pinball')" class="game-btn pinball-btn">
                    <div class="game-icon">🕹️</div>
                    <div class="game-name">彈珠台</div>
                    <div class="game-desc">經典彈珠遊戲</div>
                </button>
                <button onclick="loadGameSelection('farm2d')" class="game-btn farm-btn">
                    <div class="game-icon">🏡</div>
                    <div class="game-name">2D 牧場物語</div>
                    <div class="game-desc">像素風格農場遊戲</div>
                </button>
            </div>
        </div>
    `;
}

// 俄羅斯方塊遊戲
function loadTetrisGame() {
    console.log('啟動俄羅斯方塊遊戲');
    
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div class="tetris-game-container">
            <div class="game-header">
                <h4>🧩 俄羅斯方塊</h4>
                <button onclick="showGameSelection()" class="back-btn">← 返回</button>
            </div>
            
            <div class="tetris-main">
                <div class="tetris-board" id="tetrisBoard"></div>
                
                <div class="tetris-sidebar">
                    <div class="tetris-info">
                        <div class="score-box">
                            <div class="label">分數</div>
                            <div class="value" id="tetrisScore">0</div>
                        </div>
                        <div class="level-box">
                            <div class="label">等級</div>
                            <div class="value" id="tetrisLevel">1</div>
                        </div>
                        <div class="lines-box">
                            <div class="label">消除行數</div>
                            <div class="value" id="tetrisLines">0</div>
                        </div>
                    </div>
                    
                    <div class="tetris-controls">
                        <div class="control-row">
                            <button onclick="moveTetrisLeft()" class="control-btn">←</button>
                            <button onclick="rotateTetrisPiece()" class="control-btn">↻</button>
                            <button onclick="moveTetrisRight()" class="control-btn">→</button>
                        </div>
                        <div class="control-row">
                            <button onclick="dropTetrisPiece()" class="control-btn drop-btn">↓ 快速下降</button>
                        </div>
                        <div class="control-row">
                            <button onclick="restartTetris()" class="control-btn restart-btn">🔄 重新開始</button>
                        </div>
                    </div>
                    
                    <div class="next-piece-box">
                        <div class="label">下一個方塊</div>
                        <div id="nextPiece" class="next-piece"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    initTetrisGame();
}

// 麻將遊戲
function loadMahjongGame() {
    console.log('啟動四人麻將遊戲');
    
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div class="mahjong-game-container">
            <div class="game-header">
                <h4>🀄 四人麻將遊戲</h4>
                <button onclick="showGameSelection()" class="back-btn">← 返回</button>
            </div>
            
            <div class="mahjong-main">
                <!-- 遊戲狀態 -->
                <div class="mahjong-info">
                    <div class="score-display">
                        <span>分數: <strong id="mahjongScore">0</strong></span>
                        <span>回合: <strong id="mahjongRound">1</strong></span>
                        <span>當前: <strong id="currentPlayer">玩家1</strong></span>
                    </div>
                </div>
                
                <!-- 麻將桌 -->
                <div class="mahjong-table">
                    <!-- 北方玩家 (AI) -->
                    <div class="player-area north-player">
                        <div class="player-info">
                            <span class="player-name">玩家3 (AI)</span>
                            <span class="tile-count">手牌: <span id="player3Count">13</span></span>
                        </div>
                        <div class="ai-tiles horizontal" id="player3Display"></div>
                    </div>
                    
                    <!-- 中央區域 -->
                    <div class="table-center">
                        <!-- 西方玩家 -->
                        <div class="player-area west-player">
                            <div class="player-info vertical">
                                <span class="player-name">玩家4 (AI)</span>
                                <span class="tile-count">手牌: <span id="player4Count">13</span></span>
                            </div>
                            <div class="ai-tiles vertical" id="player4Display"></div>
                        </div>
                        
                        <!-- 牌桌中央 -->
                        <div class="center-area">
                            <div class="discard-area">
                                <h6>牌河</h6>
                                <div class="discard-pile" id="discardPile"></div>
                            </div>
                            <div class="game-status" id="gameStatus">請選擇動作</div>
                        </div>
                        
                        <!-- 東方玩家 -->
                        <div class="player-area east-player">
                            <div class="player-info vertical">
                                <span class="player-name">玩家2 (AI)</span>
                                <span class="tile-count">手牌: <span id="player2Count">13</span></span>
                            </div>
                            <div class="ai-tiles vertical" id="player2Display"></div>
                        </div>
                    </div>
                    
                    <!-- 南方玩家 (人類) -->
                    <div class="player-area south-player">
                        <div class="player-info">
                            <span class="player-name">你 (玩家1)</span>
                        </div>
                        <div class="player-hand">
                            <div class="mahjong-tiles" id="playerTiles"></div>
                        </div>
                    </div>
                </div>
                
                <!-- 控制按鈕 -->
                <div class="mahjong-controls">
                    <button onclick="drawMahjongTile()" class="mahjong-btn draw-btn">摸牌</button>
                    <button onclick="discardMahjongTile()" class="mahjong-btn discard-btn">打牌</button>
                    <button onclick="declarePeng()" class="mahjong-btn special-btn">碰</button>
                    <button onclick="declareChi()" class="mahjong-btn special-btn">吃</button>
                    <button onclick="declareGang()" class="mahjong-btn special-btn">槓</button>
                    <button onclick="declareMahjongWin()" class="mahjong-btn win-btn">胡牌</button>
                    <button onclick="passAction()" class="mahjong-btn pass-btn">過</button>
                    <button onclick="restartMahjong()" class="mahjong-btn restart-btn">重新開始</button>
                </div>
            </div>
        </div>
    `;
    
    initMahjongGame();
}

// 遊戲數據
var gameData = {
    tetris: {
        board: [],
        currentPiece: null,
        nextPiece: null,
        score: 0,
        level: 1,
        lines: 0,
        gameStarted: false,
        gameOver: false,
        pieces: [
            { shape: [[[1,1,1,1]]], color: '#ff6b6b' }, // I
            { shape: [[[1,1],[1,1]]], color: '#4ecdc4' }, // O
            { shape: [[[0,1,0],[1,1,1]]], color: '#45b7d1' }, // T
            { shape: [[[0,1,1],[1,1,0]]], color: '#f9ca24' }, // S
            { shape: [[[1,1,0],[0,1,1]]], color: '#6c5ce7' }, // Z
            { shape: [[[1,0,0],[1,1,1]]], color: '#fd79a8' }, // J
            { shape: [[[0,0,1],[1,1,1]]], color: '#fdcb6e' }  // L
        ]
    },
    mahjong: {
        playerHand: [],
        discardPile: [],
        selectedTile: null,
        score: 0,
        round: 1,
        gameStarted: false,
        tileSet: [
            '🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏', // 萬子
            '🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗', '🀘', // 筒子
            '🀙', '🀚', '🀛', '🀜', '🀝', '🀞', '🀟', '🀠', '🀡', // 索子
            '🀀', '🀁', '🀂', '🀃', '🀄', '🀅', '🀆' // 字牌
        ]
    }
};

// 俄羅斯方塊初始化
function initTetrisGame() {
    gameData.tetris.board = Array(20).fill(null).map(() => Array(10).fill(0));
    gameData.tetris.currentPiece = createRandomPiece();
    gameData.tetris.nextPiece = createRandomPiece();
    gameData.tetris.score = 0;
    gameData.tetris.level = 1;
    gameData.tetris.lines = 0;
    gameData.tetris.gameStarted = true;
    gameData.tetris.gameOver = false;
    
    renderTetrisBoard();
    updateTetrisDisplay();
    startTetrisLoop();
}

function createRandomPiece() {
    const pieces = gameData.tetris.pieces;
    const randomIndex = Math.floor(Math.random() * pieces.length);
    const piece = pieces[randomIndex];
    
    return {
        shape: JSON.parse(JSON.stringify(piece.shape[0])),
        color: piece.color,
        x: Math.floor(10 / 2) - Math.floor(piece.shape[0][0].length / 2),
        y: 0
    };
}

function renderTetrisBoard() {
    const boardElement = document.getElementById('tetrisBoard');
    if (!boardElement) return;
    
    boardElement.innerHTML = '';
    
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            const cell = document.createElement('div');
            cell.className = 'tetris-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            if (gameData.tetris.board[row][col]) {
                cell.classList.add('filled');
                cell.style.backgroundColor = gameData.tetris.board[row][col];
            }
            
            boardElement.appendChild(cell);
        }
    }
    
    if (gameData.tetris.currentPiece) {
        renderCurrentPiece();
    }
}

function renderCurrentPiece() {
    const piece = gameData.tetris.currentPiece;
    const shape = piece.shape;
    
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const boardRow = piece.y + row;
                const boardCol = piece.x + col;
                
                if (boardRow >= 0 && boardRow < 20 && boardCol >= 0 && boardCol < 10) {
                    const cell = document.querySelector(`[data-row="${boardRow}"][data-col="${boardCol}"]`);
                    if (cell) {
                        cell.classList.add('current');
                        cell.style.backgroundColor = piece.color;
                    }
                }
            }
        }
    }
}

function updateTetrisDisplay() {
    document.getElementById('tetrisScore').textContent = gameData.tetris.score;
    document.getElementById('tetrisLevel').textContent = gameData.tetris.level;
    document.getElementById('tetrisLines').textContent = gameData.tetris.lines;
}

function startTetrisLoop() {
    if (gameData.tetris.gameOver || !gameData.tetris.gameStarted) return;
    
    setTimeout(() => {
        if (gameData.tetris.gameStarted && !gameData.tetris.gameOver) {
            moveDown();
            startTetrisLoop();
        }
    }, Math.max(100, 1000 - (gameData.tetris.level * 100)));
}

function moveDown() {
    if (canMove(0, 1)) {
        gameData.tetris.currentPiece.y++;
        renderTetrisBoard();
    } else {
        placePiece();
    }
}

function canMove(dx, dy) {
    const piece = gameData.tetris.currentPiece;
    const newX = piece.x + dx;
    const newY = piece.y + dy;
    
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col]) {
                const boardRow = newY + row;
                const boardCol = newX + col;
                
                if (boardRow >= 20 || boardCol < 0 || boardCol >= 10 || 
                    (boardRow >= 0 && gameData.tetris.board[boardRow][boardCol])) {
                    return false;
                }
            }
        }
    }
    return true;
}

function placePiece() {
    const piece = gameData.tetris.currentPiece;
    
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col]) {
                const boardRow = piece.y + row;
                const boardCol = piece.x + col;
                
                if (boardRow >= 0 && boardRow < 20 && boardCol >= 0 && boardCol < 10) {
                    gameData.tetris.board[boardRow][boardCol] = piece.color;
                }
            }
        }
    }
    
    clearLines();
    
    gameData.tetris.currentPiece = gameData.tetris.nextPiece;
    gameData.tetris.nextPiece = createRandomPiece();
    
    if (!canMove(0, 0)) {
        gameData.tetris.gameOver = true;
        alert('遊戲結束！分數：' + gameData.tetris.score);
    }
    
    renderTetrisBoard();
    updateTetrisDisplay();
}

function clearLines() {
    let linesCleared = 0;
    
    for (let row = 19; row >= 0; row--) {
        if (gameData.tetris.board[row].every(cell => cell !== 0)) {
            gameData.tetris.board.splice(row, 1);
            gameData.tetris.board.unshift(Array(10).fill(0));
            linesCleared++;
            row++;
        }
    }
    
    if (linesCleared > 0) {
        gameData.tetris.lines += linesCleared;
        gameData.tetris.score += linesCleared * 100 * gameData.tetris.level;
        gameData.tetris.level = Math.floor(gameData.tetris.lines / 10) + 1;
    }
}

// 俄羅斯方塊控制
function moveTetrisLeft() {
    if (canMove(-1, 0)) {
        gameData.tetris.currentPiece.x--;
        renderTetrisBoard();
    }
}

function moveTetrisRight() {
    if (canMove(1, 0)) {
        gameData.tetris.currentPiece.x++;
        renderTetrisBoard();
    }
}

function rotateTetrisPiece() {
    const piece = gameData.tetris.currentPiece;
    const rotated = rotateMatrix(piece.shape);
    const original = piece.shape;
    
    piece.shape = rotated;
    if (canMove(0, 0)) {
        renderTetrisBoard();
    } else {
        piece.shape = original;
    }
}

function dropTetrisPiece() {
    while (canMove(0, 1)) {
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

function restartTetris() {
    initTetrisGame();
}

// 麻將遊戲初始化
function initMahjongGame() {
    gameData.mahjong = {
        playerHand: [],
        discardPile: [],
        selectedTile: null,
        score: 0,
        round: 1,
        gameStarted: true,
        currentPlayer: 1,
        players: [
            { id: 1, name: '你', hand: [], isHuman: true },
            { id: 2, name: '玩家2', hand: [], isHuman: false },
            { id: 3, name: '玩家3', hand: [], isHuman: false },
            { id: 4, name: '玩家4', hand: [], isHuman: false }
        ],
        tileSet: ['🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏', '🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗', '🀘', '🀙', '🀚', '🀛', '🀜', '🀝', '🀞', '🀟', '🀠', '🀡'],
        deck: []
    };
    
    // 建立牌組 (每種牌4張)
    gameData.mahjong.deck = [];
    gameData.mahjong.tileSet.forEach(tile => {
        for (let i = 0; i < 4; i++) {
            gameData.mahjong.deck.push(tile);
        }
    });
    
    // 洗牌
    shuffleDeck();
    
    // 為每個玩家發13張牌
    gameData.mahjong.players.forEach(player => {
        player.hand = [];
        for (let i = 0; i < 13; i++) {
            if (gameData.mahjong.deck.length > 0) {
                player.hand.push(gameData.mahjong.deck.pop());
            }
        }
        player.hand.sort();
    });
    
    // 設定人類玩家手牌
    gameData.mahjong.playerHand = gameData.mahjong.players[0].hand;
    
    renderMahjongBoard();
    updateMahjongDisplay();
    updateGameStatus('輪到你，請選擇動作');
}

function shuffleDeck() {
    const deck = gameData.mahjong.deck;
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function drawTile() {
    if (gameData.mahjong.deck.length > 0) {
        const newTile = gameData.mahjong.deck.pop();
        gameData.mahjong.playerHand.push(newTile);
        gameData.mahjong.players[0].hand.push(newTile);
        gameData.mahjong.players[0].hand.sort();
        return newTile;
    }
    return null;
}

// 新增函數
function updateGameStatus(message) {
    const statusElement = document.getElementById('gameStatus');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

function declarePeng() {
    updateGameStatus('碰功能開發中...');
}

function declareChi() {
    updateGameStatus('吃功能開發中...');
}

function declareGang() {
    updateGameStatus('槓功能開發中...');
}

function passAction() {
    nextPlayer();
    updateGameStatus('已過，輪到下一位玩家');
}

function nextPlayer() {
    gameData.mahjong.currentPlayer = (gameData.mahjong.currentPlayer % 4) + 1;
    document.getElementById('currentPlayer').textContent = gameData.mahjong.players[gameData.mahjong.currentPlayer - 1].name;
    
    // 如果是AI玩家，自動執行動作
    if (!gameData.mahjong.players[gameData.mahjong.currentPlayer - 1].isHuman) {
        setTimeout(() => aiPlayerAction(), 1000);
    }
}

function aiPlayerAction() {
    const currentPlayer = gameData.mahjong.players[gameData.mahjong.currentPlayer - 1];
    
    // AI簡單邏輯：摸牌並打出一張牌
    if (gameData.mahjong.deck.length > 0) {
        const newTile = gameData.mahjong.deck.pop();
        currentPlayer.hand.push(newTile);
        currentPlayer.hand.sort();
        
        // 打出最不需要的牌（隨機選擇）
        const discardIndex = Math.floor(Math.random() * currentPlayer.hand.length);
        const discardedTile = currentPlayer.hand.splice(discardIndex, 1)[0];
        gameData.mahjong.discardPile.push(discardedTile);
        
        updateGameStatus(`${currentPlayer.name} 摸牌並打出 ${discardedTile}`);
        renderMahjongBoard();
        
        // 回到玩家回合
        setTimeout(() => {
            gameData.mahjong.currentPlayer = 1;
            document.getElementById('currentPlayer').textContent = '你';
            updateGameStatus('輪到你，請選擇動作');
        }, 1500);
    }
}

function renderMahjongBoard() {
    // 渲染玩家手牌
    const playerTiles = document.getElementById('playerTiles');
    if (playerTiles) {
        playerTiles.innerHTML = gameData.mahjong.playerHand.map((tile, index) => 
            `<div class="mahjong-tile ${gameData.mahjong.selectedTile === tile ? 'selected' : ''}" 
                  onclick="selectTile('${tile}', ${index})">${tile}</div>`
        ).join('');
    }
    
    // 渲染棄牌區
    const discardPile = document.getElementById('discardPile');
    if (discardPile) {
        discardPile.innerHTML = gameData.mahjong.discardPile.map(tile => 
            `<span class="discarded-tile">${tile}</span>`
        ).join('');
    }
    
    // 渲染AI玩家牌背
    for (let i = 2; i <= 4; i++) {
        const playerDisplay = document.getElementById(`player${i}Display`);
        const playerCount = document.getElementById(`player${i}Count`);
        
        if (playerDisplay && gameData.mahjong.players[i-1]) {
            const handSize = gameData.mahjong.players[i-1].hand.length;
            playerDisplay.innerHTML = Array(handSize).fill('🀫').map(() => 
                '<div class="ai-tile-back">🀫</div>'
            ).join('');
            
            if (playerCount) {
                playerCount.textContent = handSize;
            }
        }
    }
}

function updateMahjongDisplay() {
    document.getElementById('mahjongScore').textContent = gameData.mahjong.score;
    document.getElementById('mahjongRound').textContent = gameData.mahjong.round;
}

// 麻將控制
function drawMahjongTile() {
    if (gameData.mahjong.playerHand.length < 17) {
        drawTile();
        renderMahjongBoard();
    }
}

function discardMahjongTile() {
    if (gameData.mahjong.selectedTile) {
        const tileIndex = gameData.mahjong.playerHand.indexOf(gameData.mahjong.selectedTile);
        if (tileIndex > -1) {
            gameData.mahjong.playerHand.splice(tileIndex, 1);
            gameData.mahjong.discardPile.push(gameData.mahjong.selectedTile);
            gameData.mahjong.selectedTile = null;
            renderMahjongBoard();
        }
    } else {
        alert('請先選擇要打出的牌！');
    }
}

function declareMahjongWin() {
    if (gameData.mahjong.playerHand.length >= 14) {
        alert('恭喜胡牌！分數 +1000');
        gameData.mahjong.score += 1000;
        gameData.mahjong.round++;
        initMahjongGame();
    } else {
        alert('手牌不足，無法胡牌！');
    }
}

function selectTile(tile, index) {
    gameData.mahjong.selectedTile = tile;
    renderMahjongBoard();
}

function restartMahjong() {
    initMahjongGame();
}

// 彈珠台遊戲
function loadPinballGame() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div class="pinball-game">
            <div class="game-header">
                <h3>🕹️ 彈珠台遊戲</h3>
                <div class="game-controls">
                    <button onclick="showGameSelection()" class="btn btn-secondary">返回</button>
                    <button onclick="restartPinball()" class="btn btn-primary">重新開始</button>
                </div>
            </div>
            <div class="pinball-info">
                <div class="score">分數: <span id="pinballScore">0</span></div>
                <div class="balls">彈珠: <span id="pinballBalls">3</span></div>
                <div class="level">關卡: <span id="pinballLevel">1</span></div>
            </div>
            <div class="pinball-table" id="pinballTable">
                <canvas id="pinballCanvas" width="400" height="600"></canvas>
                <div class="flipper-controls">
                    <button id="leftFlipper" class="flipper-btn">左拍板</button>
                    <button id="rightFlipper" class="flipper-btn">右拍板</button>
                    <button id="launchBall" class="launch-btn">發射</button>
                </div>
            </div>
        </div>
    `;
    
    initPinballGame();
}

function initPinballGame() {
    const canvas = document.getElementById('pinballCanvas');
    const ctx = canvas.getContext('2d');
    
    const game = {
        score: 0,
        balls: 3,
        level: 1,
        ball: null,
        flippers: {
            left: { active: false, angle: -Math.PI/6 },
            right: { active: false, angle: Math.PI/6 }
        },
        obstacles: [],
        bumpers: [],
        gameActive: false
    };

    // 創建遊戲元素
    function createGameElements() {
        // 彈珠
        game.ball = {
            x: canvas.width - 30,
            y: canvas.height - 50,
            radius: 8,
            vx: 0,
            vy: 0,
            launched: false
        };

        // 彈板
        game.flippers = {
            left: {
                x: 100, y: canvas.height - 80,
                length: 60, angle: -Math.PI/6,
                active: false, baseAngle: -Math.PI/6
            },
            right: {
                x: 300, y: canvas.height - 80,
                length: 60, angle: Math.PI/6,
                active: false, baseAngle: Math.PI/6
            }
        };

        // 彈珠台障礙物
        game.obstacles = [
            { x: 50, y: 200, width: 20, height: 100, type: 'wall' },
            { x: 330, y: 200, width: 20, height: 100, type: 'wall' },
            { x: 150, y: 150, width: 100, height: 20, type: 'platform' },
            { x: 200, y: 300, width: 80, height: 20, type: 'platform' }
        ];

        // 撞擊器
        game.bumpers = [
            { x: 120, y: 250, radius: 25, score: 100 },
            { x: 280, y: 250, radius: 25, score: 100 },
            { x: 200, y: 180, radius: 30, score: 200 },
            { x: 100, y: 400, radius: 20, score: 50 },
            { x: 300, y: 400, radius: 20, score: 50 }
        ];
    }

    // 繪製遊戲畫面
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 背景
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 邊界
        ctx.strokeStyle = '#ecf0f1';
        ctx.lineWidth = 3;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
        
        // 障礙物
        ctx.fillStyle = '#34495e';
        game.obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
        
        // 撞擊器
        game.bumpers.forEach(bumper => {
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(bumper.x, bumper.y, bumper.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // 分數標示
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(bumper.score.toString(), bumper.x, bumper.y + 4);
        });
        
        // 彈板
        drawFlipper(game.flippers.left);
        drawFlipper(game.flippers.right);
        
        // 彈珠
        if (game.ball) {
            ctx.fillStyle = '#f39c12';
            ctx.beginPath();
            ctx.arc(game.ball.x, game.ball.y, game.ball.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 發射軌道
        ctx.strokeStyle = '#95a5a6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width - 40, canvas.height - 20);
        ctx.lineTo(canvas.width - 40, canvas.height - 200);
        ctx.stroke();
    }

    function drawFlipper(flipper) {
        ctx.save();
        ctx.translate(flipper.x, flipper.y);
        ctx.rotate(flipper.angle);
        
        ctx.fillStyle = '#3498db';
        ctx.fillRect(-flipper.length/2, -5, flipper.length, 10);
        
        ctx.restore();
    }

    // 物理引擎
    function updatePhysics() {
        if (!game.ball || !game.ball.launched) return;
        
        // 重力
        game.ball.vy += 0.3;
        
        // 移動彈珠
        game.ball.x += game.ball.vx;
        game.ball.y += game.ball.vy;
        
        // 邊界碰撞
        if (game.ball.x <= game.ball.radius || game.ball.x >= canvas.width - game.ball.radius) {
            game.ball.vx *= -0.8;
            game.ball.x = Math.max(game.ball.radius, Math.min(canvas.width - game.ball.radius, game.ball.x));
        }
        
        if (game.ball.y <= game.ball.radius) {
            game.ball.vy *= -0.8;
            game.ball.y = game.ball.radius;
        }
        
        // 掉落檢測
        if (game.ball.y > canvas.height + game.ball.radius) {
            lostBall();
            return;
        }
        
        // 障礙物碰撞
        checkObstacleCollisions();
        
        // 撞擊器碰撞
        checkBumperCollisions();
        
        // 彈板碰撞
        checkFlipperCollisions();
    }

    function checkObstacleCollisions() {
        game.obstacles.forEach(obstacle => {
            if (game.ball.x + game.ball.radius > obstacle.x &&
                game.ball.x - game.ball.radius < obstacle.x + obstacle.width &&
                game.ball.y + game.ball.radius > obstacle.y &&
                game.ball.y - game.ball.radius < obstacle.y + obstacle.height) {
                
                // 簡單反彈
                if (game.ball.x < obstacle.x || game.ball.x > obstacle.x + obstacle.width) {
                    game.ball.vx *= -0.7;
                } else {
                    game.ball.vy *= -0.7;
                }
            }
        });
    }

    function checkBumperCollisions() {
        game.bumpers.forEach(bumper => {
            const dx = game.ball.x - bumper.x;
            const dy = game.ball.y - bumper.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < game.ball.radius + bumper.radius) {
                // 反彈
                const angle = Math.atan2(dy, dx);
                const force = 8;
                game.ball.vx = Math.cos(angle) * force;
                game.ball.vy = Math.sin(angle) * force;
                
                // 加分
                addScore(bumper.score);
                
                // 移動彈珠到安全位置
                game.ball.x = bumper.x + Math.cos(angle) * (bumper.radius + game.ball.radius + 1);
                game.ball.y = bumper.y + Math.sin(angle) * (bumper.radius + game.ball.radius + 1);
            }
        });
    }

    function checkFlipperCollisions() {
        [game.flippers.left, game.flippers.right].forEach(flipper => {
            const dx = game.ball.x - flipper.x;
            const dy = game.ball.y - flipper.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < flipper.length/2 + game.ball.radius && 
                Math.abs(dy) < 10) {
                
                if (flipper.active) {
                    // 強力反彈
                    const angle = flipper.angle + (flipper === game.flippers.left ? Math.PI/4 : -Math.PI/4);
                    game.ball.vx = Math.cos(angle) * 10;
                    game.ball.vy = Math.sin(angle) * 10;
                } else {
                    // 普通反彈
                    game.ball.vy *= -0.5;
                }
            }
        });
    }

    // 遊戲邏輯
    function launchBall() {
        if (!game.ball.launched && game.balls > 0) {
            game.ball.launched = true;
            game.ball.vx = -5 + Math.random() * 2;
            game.ball.vy = -12;
            game.gameActive = true;
        }
    }

    function lostBall() {
        game.balls--;
        updateDisplay();
        
        if (game.balls > 0) {
            resetBall();
        } else {
            gameOver();
        }
    }

    function resetBall() {
        game.ball = {
            x: canvas.width - 30,
            y: canvas.height - 50,
            radius: 8,
            vx: 0,
            vy: 0,
            launched: false
        };
        game.gameActive = false;
    }

    function addScore(points) {
        game.score += points;
        updateDisplay();
    }

    function updateDisplay() {
        document.getElementById('pinballScore').textContent = game.score;
        document.getElementById('pinballBalls').textContent = game.balls;
        document.getElementById('pinballLevel').textContent = game.level;
    }

    function gameOver() {
        game.gameActive = false;
        alert(`遊戲結束！最終分數: ${game.score}`);
    }

    // 控制事件
    function setupControls() {
        const leftFlipperBtn = document.getElementById('leftFlipper');
        const rightFlipperBtn = document.getElementById('rightFlipper');
        const launchBtn = document.getElementById('launchBall');

        // 彈板控制
        leftFlipperBtn.addEventListener('mousedown', () => {
            game.flippers.left.active = true;
            game.flippers.left.angle = game.flippers.left.baseAngle + Math.PI/4;
        });
        
        leftFlipperBtn.addEventListener('mouseup', () => {
            game.flippers.left.active = false;
            game.flippers.left.angle = game.flippers.left.baseAngle;
        });

        rightFlipperBtn.addEventListener('mousedown', () => {
            game.flippers.right.active = true;
            game.flippers.right.angle = game.flippers.right.baseAngle - Math.PI/4;
        });
        
        rightFlipperBtn.addEventListener('mouseup', () => {
            game.flippers.right.active = false;
            game.flippers.right.angle = game.flippers.right.baseAngle;
        });

        // 鍵盤控制
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'z':
                case 'Z':
                    leftFlipperBtn.dispatchEvent(new MouseEvent('mousedown'));
                    break;
                case 'x':
                case 'X':
                    rightFlipperBtn.dispatchEvent(new MouseEvent('mousedown'));
                    break;
                case ' ':
                    e.preventDefault();
                    launchBall();
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'z':
                case 'Z':
                    leftFlipperBtn.dispatchEvent(new MouseEvent('mouseup'));
                    break;
                case 'x':
                case 'X':
                    rightFlipperBtn.dispatchEvent(new MouseEvent('mouseup'));
                    break;
            }
        });

        launchBtn.addEventListener('click', launchBall);
    }

    // 遊戲主循環
    function gameLoop() {
        updatePhysics();
        draw();
        requestAnimationFrame(gameLoop);
    }

    // 初始化遊戲
    createGameElements();
    setupControls();
    updateDisplay();
    gameLoop();
    
    window.pinballGame = game;
}

function restartPinball() {
    initPinballGame();
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('簡化版遊戲系統已載入');
    showGameSelection();
});