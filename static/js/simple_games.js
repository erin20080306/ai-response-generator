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
        case 'memory':
            loadMemoryGame();
            break;
        case 'pinball':
            loadPinballGame();
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
                <button onclick="loadGameSelection('memory')" class="game-btn memory-btn">
                    <div class="game-icon">🃏</div>
                    <div class="game-name">翻牌配對</div>
                    <div class="game-desc">記憶力挑戰</div>
                </button>
                <button onclick="loadGameSelection('pinball')" class="game-btn pinball-btn">
                    <div class="game-icon">🎯</div>
                    <div class="game-name">彈珠台</div>
                    <div class="game-desc">經典彈珠遊戲</div>
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
    console.log('啟動麻將遊戲');
    
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div class="mahjong-game-container">
            <div class="game-header">
                <h4>🀄 四人麻將</h4>
                <button onclick="showGameSelection()" class="back-btn">← 返回</button>
            </div>
            
            <div class="mahjong-table-wrapper">
                <div class="mahjong-table horizontal-layout">
                    <!-- 左側：電腦玩家 -->
                    <div class="opponents-section">
                        <div class="opponent">
                            <div class="opponent-name">電腦A</div>
                            <div class="opponent-tiles">
                                <div class="mini-tile"></div><div class="mini-tile"></div><div class="mini-tile"></div>
                                <div class="mini-tile"></div><div class="mini-tile"></div><div class="mini-tile"></div>
                                <div class="mini-tile"></div><div class="mini-tile"></div><div class="mini-tile"></div>
                                <div class="mini-tile"></div><div class="mini-tile"></div><div class="mini-tile"></div>
                                <div class="mini-tile"></div>
                            </div>
                        </div>
                        <div class="opponent">
                            <div class="opponent-name">電腦B</div>
                            <div class="opponent-tiles">
                                <div class="mini-tile"></div><div class="mini-tile"></div><div class="mini-tile"></div>
                                <div class="mini-tile"></div><div class="mini-tile"></div><div class="mini-tile"></div>
                                <div class="mini-tile"></div><div class="mini-tile"></div><div class="mini-tile"></div>
                                <div class="mini-tile"></div><div class="mini-tile"></div><div class="mini-tile"></div>
                                <div class="mini-tile"></div>
                            </div>
                        </div>
                        <div class="opponent">
                            <div class="opponent-name">電腦C</div>
                            <div class="opponent-tiles">
                                <div class="mini-tile"></div><div class="mini-tile"></div><div class="mini-tile"></div>
                                <div class="mini-tile"></div><div class="mini-tile"></div><div class="mini-tile"></div>
                                <div class="mini-tile"></div><div class="mini-tile"></div><div class="mini-tile"></div>
                                <div class="mini-tile"></div><div class="mini-tile"></div><div class="mini-tile"></div>
                                <div class="mini-tile"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 中央：遊戲信息和牌河 -->
                    <div class="game-center">
                        <div class="game-info">
                            <div class="current-player">輪到: <span id="currentPlayer">玩家</span></div>
                            <div class="tiles-remaining">剩餘: <span id="remainingTiles">144</span>張</div>
                        </div>
                        <div class="game-status" id="mahjongGameInfo">
                            <p>遊戲開始！等待AI玩家行動...</p>
                        </div>
                        <div class="discard-area">
                            <div class="discard-label">牌河</div>
                            <div class="discard-tiles" id="discardPile"></div>
                        </div>
                    </div>
                    
                    <!-- 右側：玩家手牌 -->
                    <div class="player-section">
                        <div class="player-info">
                            <div class="player-name">玩家</div>
                            <div class="player-score">25600</div>
                        </div>
                        <div class="player-hand">
                            <div class="hand-tiles" id="playerTiles"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mahjong-controls">
                <button onclick="drawMahjongTile()" class="mahjong-btn draw-btn">摸牌</button>
                <button onclick="discardMahjongTile()" class="mahjong-btn discard-btn">打牌</button>
                <button onclick="declareMahjongWin()" class="mahjong-btn win-btn">胡牌</button>
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
        players: [
            { name: '玩家', hand: [], score: 25600, isHuman: true },
            { name: '電腦A', hand: [], score: 25600, isHuman: false },
            { name: '電腦B', hand: [], score: 25600, isHuman: false },
            { name: '電腦C', hand: [], score: 25600, isHuman: false }
        ],
        currentPlayer: 0,
        discardPile: [],
        selectedTile: null,
        round: 1,
        gameStarted: false,
        remainingTiles: 70,
        tilePool: [],
        fullTileSet: [
            '🀇', '🀇', '🀇', '🀇', '🀈', '🀈', '🀈', '🀈', '🀉', '🀉', '🀉', '🀉', // 萬子
            '🀊', '🀊', '🀊', '🀊', '🀋', '🀋', '🀋', '🀋', '🀌', '🀌', '🀌', '🀌',
            '🀍', '🀍', '🀍', '🀍', '🀎', '🀎', '🀎', '🀎', '🀏', '🀏', '🀏', '🀏',
            '🀐', '🀐', '🀐', '🀐', '🀑', '🀑', '🀑', '🀑', '🀒', '🀒', '🀒', '🀒', // 筒子
            '🀓', '🀓', '🀓', '🀓', '🀔', '🀔', '🀔', '🀔', '🀕', '🀕', '🀕', '🀕',
            '🀖', '🀖', '🀖', '🀖', '🀗', '🀗', '🀗', '🀗', '🀘', '🀘', '🀘', '🀘',
            '🀙', '🀙', '🀙', '🀙', '🀚', '🀚', '🀚', '🀚', '🀛', '🀛', '🀛', '🀛', // 索子
            '🀜', '🀜', '🀜', '🀜', '🀝', '🀝', '🀝', '🀝', '🀞', '🀞', '🀞', '🀞',
            '🀟', '🀟', '🀟', '🀟', '🀠', '🀠', '🀠', '🀠', '🀡', '🀡', '🀡', '🀡',
            '🀀', '🀀', '🀀', '🀀', '🀁', '🀁', '🀁', '🀁', '🀂', '🀂', '🀂', '🀂', // 字牌
            '🀃', '🀃', '🀃', '🀃', '🀄', '🀄', '🀄', '🀄', '🀅', '🀅', '🀅', '🀅',
            '🀆', '🀆', '🀆', '🀆'
        ]
    },
    memory: {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        flips: 0,
        startTime: 0,
        gameStarted: false,
        isProcessing: false
    },
    pinball: {
        canvas: null,
        ctx: null,
        score: 0,
        balls: 3,
        level: 1,
        ball: null,
        obstacles: [],
        flippers: {
            left: { active: false, angle: 0 },
            right: { active: false, angle: 0 }
        },
        gameRunning: false,
        animationId: null
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
    console.log('開始初始化麻將遊戲');
    
    // 確保gameData.mahjong存在
    if (!gameData.mahjong) {
        gameData.mahjong = {
            players: [
                { name: '玩家', hand: [], score: 25600 },
                { name: '電腦A', hand: [], score: 25600 },
                { name: '電腦B', hand: [], score: 25600 },
                { name: '電腦C', hand: [], score: 25600 }
            ],
            currentPlayer: 0,
            discardPile: [],
            selectedTile: null,
            gameStarted: false,
            remainingTiles: 144,
            tilePool: [],
            fullTileSet: [
                // 萬子
                '一萬', '二萬', '三萬', '四萬', '五萬', '六萬', '七萬', '八萬', '九萬',
                '一萬', '二萬', '三萬', '四萬', '五萬', '六萬', '七萬', '八萬', '九萬',
                '一萬', '二萬', '三萬', '四萬', '五萬', '六萬', '七萬', '八萬', '九萬',
                '一萬', '二萬', '三萬', '四萬', '五萬', '六萬', '七萬', '八萬', '九萬',
                // 筒子
                '一筒', '二筒', '三筒', '四筒', '五筒', '六筒', '七筒', '八筒', '九筒',
                '一筒', '二筒', '三筒', '四筒', '五筒', '六筒', '七筒', '八筒', '九筒',
                '一筒', '二筒', '三筒', '四筒', '五筒', '六筒', '七筒', '八筒', '九筒',
                '一筒', '二筒', '三筒', '四筒', '五筒', '六筒', '七筒', '八筒', '九筒',
                // 條子
                '一條', '二條', '三條', '四條', '五條', '六條', '七條', '八條', '九條',
                '一條', '二條', '三條', '四條', '五條', '六條', '七條', '八條', '九條',
                '一條', '二條', '三條', '四條', '五條', '六條', '七條', '八條', '九條',
                '一條', '二條', '三條', '四條', '五條', '六條', '七條', '八條', '九條',
                // 字牌
                '東', '南', '西', '北', '東', '南', '西', '北', '東', '南', '西', '北', '東', '南', '西', '北',
                '中', '發', '白', '中', '發', '白', '中', '發', '白', '中', '發', '白'
            ]
        };
    }
    
    // 重置遊戲狀態
    gameData.mahjong.currentPlayer = 0;
    gameData.mahjong.discardPile = [];
    gameData.mahjong.selectedTile = null;
    gameData.mahjong.gameStarted = true;
    gameData.mahjong.remainingTiles = 144;
    
    // 重置所有玩家手牌
    gameData.mahjong.players.forEach(player => {
        player.hand = [];
    });
    
    // 初始化牌池
    shuffleTilePool();
    
    // 給每個玩家發13張牌
    for (let i = 0; i < 13; i++) {
        gameData.mahjong.players.forEach(player => {
            if (gameData.mahjong.tilePool.length > 0) {
                player.hand.push(gameData.mahjong.tilePool.pop());
                gameData.mahjong.remainingTiles--;
            }
        });
    }
    
    // 給莊家（玩家）多發一張牌
    if (gameData.mahjong.tilePool.length > 0) {
        gameData.mahjong.players[0].hand.push(gameData.mahjong.tilePool.pop());
        gameData.mahjong.remainingTiles--;
    }
    
    console.log('玩家手牌數量:', gameData.mahjong.players[0].hand.length);
    console.log('玩家手牌:', gameData.mahjong.players[0].hand);
    
    renderMahjongBoard();
    updateMahjongDisplay();
    
    // 自動開始下一個玩家的回合 (AI玩家)
    setTimeout(() => {
        nextPlayer();
    }, 2000);
}

// 洗牌函數
function shuffleTilePool() {
    gameData.mahjong.tilePool = [...gameData.mahjong.fullTileSet];
    for (let i = gameData.mahjong.tilePool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameData.mahjong.tilePool[i], gameData.mahjong.tilePool[j]] = 
        [gameData.mahjong.tilePool[j], gameData.mahjong.tilePool[i]];
    }
}

function renderMahjongBoard() {
    const playerTiles = document.getElementById('playerTiles');
    const discardPile = document.getElementById('discardPile');
    
    // 渲染玩家手牌
    if (playerTiles && gameData.mahjong && gameData.mahjong.players && gameData.mahjong.players[0]) {
        const playerHand = gameData.mahjong.players[0].hand;
        console.log('玩家手牌:', playerHand);
        
        if (playerHand && playerHand.length > 0) {
            playerTiles.innerHTML = playerHand.map((tile, index) => 
                `<div class="mahjong-tile ${gameData.mahjong.selectedTile === tile ? 'selected' : ''}" 
                      onclick="selectTile('${tile}', ${index})">${tile}</div>`
            ).join('');
        } else {
            playerTiles.innerHTML = '<div class="no-tiles">暫無手牌</div>';
        }
    }
    
    // 渲染牌河
    if (discardPile && gameData.mahjong && gameData.mahjong.discardPile) {
        discardPile.innerHTML = gameData.mahjong.discardPile.map(tile => 
            `<span class="discarded-tile">${tile}</span>`
        ).join('');
    }
}

function updateMahjongDisplay() {
    // 更新當前玩家
    const currentPlayerElement = document.getElementById('currentPlayer');
    if (currentPlayerElement && gameData.mahjong.players && gameData.mahjong.players[gameData.mahjong.currentPlayer]) {
        currentPlayerElement.textContent = gameData.mahjong.players[gameData.mahjong.currentPlayer].name;
    }
    
    // 更新剩餘牌數
    const remainingTilesElement = document.getElementById('remainingTiles');
    if (remainingTilesElement) {
        remainingTilesElement.textContent = gameData.mahjong.remainingTiles;
    }
}

// 選擇牌
function selectTile(tile, index) {
    if (gameData.mahjong && gameData.mahjong.currentPlayer === 0) { // 只有玩家回合才能選牌
        gameData.mahjong.selectedTile = tile;
        renderMahjongBoard();
    }
}

// 麻將控制
function drawMahjongTile() {
    if (gameData.mahjong.currentPlayer !== 0) {
        alert('不是你的回合！');
        return;
    }
    
    if (gameData.mahjong.tilePool.length > 0 && gameData.mahjong.players[0].hand.length <= 13) {
        const newTile = gameData.mahjong.tilePool.pop();
        gameData.mahjong.players[0].hand.push(newTile);
        gameData.mahjong.remainingTiles--;
        renderMahjongBoard();
        updateMahjongDisplay();
    } else {
        alert('無法摸牌！');
    }
}

function discardMahjongTile() {
    if (gameData.mahjong.currentPlayer !== 0) {
        alert('不是你的回合！');
        return;
    }
    
    if (gameData.mahjong.selectedTile) {
        const player = gameData.mahjong.players[0];
        const tileIndex = player.hand.indexOf(gameData.mahjong.selectedTile);
        
        if (tileIndex > -1) {
            player.hand.splice(tileIndex, 1);
            gameData.mahjong.discardPile.push(gameData.mahjong.selectedTile);
            gameData.mahjong.selectedTile = null;
            
            // 下一個玩家
            nextPlayer();
            
            renderMahjongBoard();
            updateMahjongDisplay();
        }
    } else {
        alert('請先選擇要打出的牌！');
    }
}

function declareMahjongWin() {
    if (gameData.mahjong.currentPlayer !== 0) {
        alert('不是你的回合！');
        return;
    }
    
    if (gameData.mahjong.players[0].hand.length >= 14) {
        alert('恭喜胡牌！分數 +1000');
        gameData.mahjong.players[0].score += 1000;
        gameData.mahjong.round++;
        initMahjongGame();
    } else {
        alert('手牌不足，無法胡牌！');
    }
}

// 下一個玩家
function nextPlayer() {
    gameData.mahjong.currentPlayer = (gameData.mahjong.currentPlayer + 1) % 4;
    
    // 如果輪到AI玩家，自動執行AI行動
    if (gameData.mahjong.currentPlayer !== 0) {
        setTimeout(() => {
            executeAITurn();
        }, 1000); // 1秒延遲模擬思考時間
    }
}

// AI行動邏輯 - 逐步動畫
function executeAITurn() {
    const currentPlayerIndex = gameData.mahjong.currentPlayer;
    const aiPlayer = gameData.mahjong.players[currentPlayerIndex];
    
    // 顯示AI正在思考
    showAIThinking(currentPlayerIndex);
    
    // 1. AI摸牌動畫
    setTimeout(() => {
        if (gameData.mahjong.tilePool.length > 0 && aiPlayer.hand.length <= 13) {
            const newTile = gameData.mahjong.tilePool.pop();
            aiPlayer.hand.push(newTile);
            gameData.mahjong.remainingTiles--;
            
            // 顯示摸牌動畫
            showDrawTileAnimation(currentPlayerIndex, newTile);
            updateMahjongDisplay();
            
            // 2. 等待一下再打牌
            setTimeout(() => {
                aiDiscardTile(currentPlayerIndex);
            }, 1000);
        } else {
            aiDiscardTile(currentPlayerIndex);
        }
    }, 800);
}

// AI思考提示
function showAIThinking(playerIndex) {
    const gameInfo = document.getElementById('mahjongGameInfo');
    if (gameInfo) {
        gameInfo.innerHTML = `<p class="thinking">💭 ${gameData.mahjong.players[playerIndex].name} 思考中...</p>`;
    }
}

// 摸牌動畫
function showDrawTileAnimation(playerIndex, tile) {
    const gameInfo = document.getElementById('mahjongGameInfo');
    if (gameInfo) {
        gameInfo.innerHTML = `<p class="draw-tile">📥 ${gameData.mahjong.players[playerIndex].name} 摸牌: ${tile}</p>`;
    }
}

// AI打牌邏輯
function aiDiscardTile(playerIndex) {
    const aiPlayer = gameData.mahjong.players[playerIndex];
    
    if (aiPlayer.hand.length > 0) {
        // 智能打牌策略
        const discardIndex = chooseDiscardTile(aiPlayer.hand);
        const discardedTile = aiPlayer.hand.splice(discardIndex, 1)[0];
        gameData.mahjong.discardPile.push(discardedTile);
        
        // 顯示打牌動畫
        showDiscardAnimation(playerIndex, discardedTile);
        updateMahjongDisplay();
        
        // 檢查其他玩家是否可以吃碰胡
        setTimeout(() => {
            checkPlayerActions(discardedTile);
        }, 500);
    } else {
        // 下一個玩家
        nextPlayer();
    }
}

// 智能選擇打牌
function chooseDiscardTile(hand) {
    // 簡單AI策略：優先打出孤張牌
    const tileCounts = {};
    hand.forEach(tile => {
        tileCounts[tile] = (tileCounts[tile] || 0) + 1;
    });
    
    // 尋找孤張牌
    for (let i = 0; i < hand.length; i++) {
        if (tileCounts[hand[i]] === 1) {
            return i;
        }
    }
    
    // 如果沒有孤張，隨機選擇
    return Math.floor(Math.random() * hand.length);
}

// 打牌動畫
function showDiscardAnimation(playerIndex, tile) {
    const gameInfo = document.getElementById('mahjongGameInfo');
    if (gameInfo) {
        gameInfo.innerHTML = `<p class="discard-tile">🎯 ${gameData.mahjong.players[playerIndex].name} 打牌: ${tile}</p>`;
    }
}

// 檢查玩家可執行的動作
function checkPlayerActions(discardedTile) {
    const playerHand = gameData.mahjong.players[0].hand;
    const actions = [];
    
    console.log('檢查動作:', discardedTile, '玩家手牌:', playerHand);
    
    // 檢查胡牌
    const canWinResult = canWin(playerHand, discardedTile);
    console.log('可以胡牌?', canWinResult);
    if (canWinResult) {
        actions.push('胡');
    }
    
    // 檢查碰牌
    const canPengResult = canPeng(playerHand, discardedTile);
    console.log('可以碰牌?', canPengResult);
    if (canPengResult) {
        actions.push('碰');
    }
    
    // 檢查吃牌
    const canChiResult = canChi(playerHand, discardedTile);
    console.log('可以吃牌?', canChiResult);
    if (canChiResult) {
        actions.push('吃');
    }
    
    console.log('可執行動作:', actions);
    
    if (actions.length > 0) {
        showActionPrompt(discardedTile, actions);
    } else {
        // 繼續下一個玩家
        setTimeout(() => {
            nextPlayer();
        }, 1000);
    }
}

// 顯示動作提示
function showActionPrompt(discardedTile, actions) {
    const gameInfo = document.getElementById('mahjongGameInfo');
    if (gameInfo) {
        let buttonHtml = actions.map(action => 
            `<button onclick="executePlayerAction('${action}', '${discardedTile}')" class="action-btn ${action.toLowerCase()}-btn">${action}</button>`
        ).join(' ');
        
        buttonHtml += `<button onclick="skipAction()" class="action-btn skip-btn">跳過</button>`;
        
        gameInfo.innerHTML = `
            <div class="action-prompt">
                <p>🎯 可以對 ${discardedTile} 執行動作：</p>
                <div class="action-buttons">${buttonHtml}</div>
            </div>
        `;
        
        // 5秒後自動跳過
        setTimeout(() => {
            if (document.querySelector('.action-prompt')) {
                skipAction();
            }
        }, 5000);
    }
}

// 執行玩家動作
function executePlayerAction(action, tile) {
    const playerHand = gameData.mahjong.players[0].hand;
    
    switch(action) {
        case '胡':
            playerHand.push(tile);
            alert('恭喜胡牌！分數 +2000');
            gameData.mahjong.players[0].score += 2000;
            initMahjongGame();
            return;
            
        case '碰':
            // 從手牌中移除兩張相同牌，加入打出的牌
            const pengCount = playerHand.filter(t => t === tile).length;
            if (pengCount >= 2) {
                for (let i = 0; i < 2; i++) {
                    const index = playerHand.indexOf(tile);
                    if (index !== -1) playerHand.splice(index, 1);
                }
                playerHand.push(tile, tile, tile);
                // 移除牌河中的牌
                gameData.mahjong.discardPile.pop();
                alert(`碰牌成功：${tile} ${tile} ${tile}`);
            }
            break;
            
        case '吃':
            // 簡化吃牌邏輯
            playerHand.push(tile);
            gameData.mahjong.discardPile.pop();
            alert(`吃牌：${tile}`);
            break;
    }
    
    updateMahjongDisplay();
    
    // 清除提示，繼續遊戲
    const gameInfo = document.getElementById('mahjongGameInfo');
    if (gameInfo) {
        gameInfo.innerHTML = '<p>請選擇要打出的牌</p>';
    }
}

// 跳過動作
function skipAction() {
    const gameInfo = document.getElementById('mahjongGameInfo');
    if (gameInfo) {
        gameInfo.innerHTML = '<p>繼續遊戲...</p>';
    }
    
    setTimeout(() => {
        nextPlayer();
    }, 1000);
}

// 檢查胡牌 - 更精確的邏輯
function canWin(hand, newTile) {
    const testHand = [...hand, newTile];
    
    // 基本條件：手牌數量必須是14張
    if (testHand.length !== 14) return false;
    
    // 檢查是否有對子（將牌）
    const tileCounts = {};
    testHand.forEach(tile => {
        tileCounts[tile] = (tileCounts[tile] || 0) + 1;
    });
    
    // 簡化胡牌檢查：有一對對子，其他都是三張一組
    let pairs = 0;
    let triplets = 0;
    
    for (const tile in tileCounts) {
        const count = tileCounts[tile];
        if (count === 2) pairs++;
        else if (count >= 3) triplets++;
        else if (count === 1) return false; // 有孤張牌
    }
    
    // 胡牌條件：正好一對對子，其他都是三張以上
    return pairs === 1 && triplets >= 4;
}

// 檢查碰牌 - 精確檢查
function canPeng(hand, tile) {
    const count = hand.filter(t => t === tile).length;
    return count >= 2; // 手牌中有至少2張相同牌
}

// 檢查吃牌 - 更精確的檢查
function canChi(hand, tile) {
    // 只能吃數字牌（萬、筒、索），不能吃字牌
    const numberSuits = {
        '萬': ['🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏'],
        '筒': ['🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗', '🀘'],
        '索': ['🀙', '🀚', '🀛', '🀜', '🀝', '🀞', '🀟', '🀠', '🀡']
    };
    
    // 檢查是否為字牌
    const ziPai = ['🀀', '🀁', '🀂', '🀃', '🀄', '🀅', '🀆'];
    if (ziPai.includes(tile)) return false; // 字牌不能吃
    
    // 找出牌的花色和數字
    let tileIndex = -1;
    let tileSuit = null;
    
    for (const suit in numberSuits) {
        const index = numberSuits[suit].indexOf(tile);
        if (index !== -1) {
            tileIndex = index;
            tileSuit = suit;
            break;
        }
    }
    
    if (tileSuit === null) return false;
    
    // 檢查能否組成順子
    const suitTiles = numberSuits[tileSuit];
    const handTilesInSuit = hand.filter(t => suitTiles.includes(t));
    
    // 檢查是否有相鄰的牌可以組成順子
    // 可能的組合：ABC, BCA, CAB
    for (let i = Math.max(0, tileIndex - 2); i <= Math.min(6, tileIndex); i++) {
        if (i + 2 < suitTiles.length) {
            const needed1 = suitTiles[i];
            const needed2 = suitTiles[i + 1];
            const needed3 = suitTiles[i + 2];
            
            // 檢查是否包含目標牌，且手牌中有其他兩張
            if ([needed1, needed2, needed3].includes(tile)) {
                const otherTiles = [needed1, needed2, needed3].filter(t => t !== tile);
                const hasOtherTiles = otherTiles.every(t => handTilesInSuit.includes(t));
                if (hasOtherTiles) return true;
            }
        }
    }
    
    return false;
}

// 檢查是否同花色
function isSameSuit(tile1, tile2) {
    const suits = {
        '萬': ['🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏'],
        '筒': ['🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗', '🀘'],
        '索': ['🀙', '🀚', '🀛', '🀜', '🀝', '🀞', '🀟', '🀠', '🀡'],
        '字': ['🀀', '🀁', '🀂', '🀃', '🀄', '🀅', '🀆']
    };
    
    for (const suit in suits) {
        if (suits[suit].includes(tile1) && suits[suit].includes(tile2)) {
            return true;
        }
    }
    return false;
}



function restartMahjong() {
    // 重置所有玩家分數
    gameData.mahjong.players.forEach(player => {
        player.score = 25600;
    });
    gameData.mahjong.round = 1;
    initMahjongGame();
}

// ===== 翻牌配對遊戲 =====
function loadMemoryGame() {
    console.log('啟動翻牌配對遊戲');
    
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div class="memory-game-container">
            <div class="memory-header">
                <h3>🃏 翻牌配對遊戲</h3>
                <div class="memory-stats">
                    <div class="stat">翻牌: <span id="memoryFlips">0</span></div>
                    <div class="stat">配對: <span id="memoryMatches">0</span>/8</div>
                    <div class="stat">時間: <span id="memoryTime">00:00</span></div>
                </div>
                <button onclick="initMemoryGame()" class="btn btn-primary">重新開始</button>
                <button onclick="showGameSelection()" class="btn btn-secondary">返回選單</button>
            </div>
            <div class="memory-board" id="memoryBoard"></div>
        </div>
    `;
    
    initMemoryGame();
}

function initMemoryGame() {
    gameData.memory = {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        flips: 0,
        startTime: Date.now(),
        gameStarted: false,
        isProcessing: false
    };
    
    // 創建16張卡片（8對）
    const symbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺'];
    const cards = [...symbols, ...symbols];
    
    // 洗牌
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    gameData.memory.cards = cards.map((symbol, index) => ({
        id: index,
        symbol: symbol,
        isFlipped: false,
        isMatched: false
    }));
    
    renderMemoryBoard();
    updateMemoryStats();
    startMemoryTimer();
}

function renderMemoryBoard() {
    const board = document.getElementById('memoryBoard');
    board.innerHTML = '';
    
    gameData.memory.cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = `memory-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`;
        cardElement.onclick = () => flipCard(card.id);
        
        cardElement.innerHTML = `
            <div class="card-front">❓</div>
            <div class="card-back">${card.symbol}</div>
        `;
        
        board.appendChild(cardElement);
    });
}

function flipCard(cardId) {
    if (gameData.memory.isProcessing) return;
    
    const card = gameData.memory.cards[cardId];
    if (card.isFlipped || card.isMatched) return;
    
    if (gameData.memory.flippedCards.length >= 2) return;
    
    // 翻牌
    card.isFlipped = true;
    gameData.memory.flippedCards.push(card);
    gameData.memory.flips++;
    
    if (!gameData.memory.gameStarted) {
        gameData.memory.gameStarted = true;
        gameData.memory.startTime = Date.now();
    }
    
    renderMemoryBoard();
    updateMemoryStats();
    
    // 檢查配對
    if (gameData.memory.flippedCards.length === 2) {
        gameData.memory.isProcessing = true;
        
        setTimeout(() => {
            checkMemoryMatch();
        }, 1000);
    }
}

function checkMemoryMatch() {
    const [card1, card2] = gameData.memory.flippedCards;
    
    if (card1.symbol === card2.symbol) {
        // 配對成功
        card1.isMatched = true;
        card2.isMatched = true;
        gameData.memory.matchedPairs++;
        
        // 檢查遊戲是否完成
        if (gameData.memory.matchedPairs === 8) {
            setTimeout(() => {
                alert(`恭喜完成！用了 ${gameData.memory.flips} 次翻牌，時間 ${formatTime(Date.now() - gameData.memory.startTime)}`);
            }, 500);
        }
    } else {
        // 配對失敗，翻回去
        card1.isFlipped = false;
        card2.isFlipped = false;
    }
    
    gameData.memory.flippedCards = [];
    gameData.memory.isProcessing = false;
    
    renderMemoryBoard();
    updateMemoryStats();
}

function updateMemoryStats() {
    document.getElementById('memoryFlips').textContent = gameData.memory.flips;
    document.getElementById('memoryMatches').textContent = gameData.memory.matchedPairs;
}

function startMemoryTimer() {
    setInterval(() => {
        if (gameData.memory.gameStarted && gameData.memory.matchedPairs < 8) {
            const elapsed = Date.now() - gameData.memory.startTime;
            document.getElementById('memoryTime').textContent = formatTime(elapsed);
        }
    }, 100);
}

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}

// ===== 彈珠台遊戲 =====
function loadPinballGame() {
    console.log('啟動彈珠台遊戲');
    
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div class="pinball-game-container">
            <div class="pinball-header">
                <h3>🎯 彈珠台遊戲</h3>
                <div class="pinball-stats">
                    <div class="stat">分數: <span id="pinballScore">0</span></div>
                    <div class="stat">球數: <span id="pinballBalls">3</span></div>
                    <div class="stat">等級: <span id="pinballLevel">1</span></div>
                </div>
                <button onclick="initPinballGame()" class="btn btn-primary">重新開始</button>
                <button onclick="showGameSelection()" class="btn btn-secondary">返回選單</button>
            </div>
            <div class="pinball-board">
                <canvas id="pinballCanvas" width="400" height="600"></canvas>
                <div class="pinball-controls">
                    <button id="leftFlipper" class="flipper-btn left">左擋板</button>
                    <button id="launchBtn" class="launch-btn">發射</button>
                    <button id="rightFlipper" class="flipper-btn right">右擋板</button>
                </div>
            </div>
        </div>
    `;
    
    initPinballGame();
}

function initPinballGame() {
    const canvas = document.getElementById('pinballCanvas');
    const ctx = canvas.getContext('2d');
    
    gameData.pinball = {
        canvas: canvas,
        ctx: ctx,
        score: 0,
        balls: 3,
        level: 1,
        ball: null,
        obstacles: [],
        flippers: {
            left: { active: false, angle: 0 },
            right: { active: false, angle: 0 }
        },
        gameRunning: false,
        animationId: null
    };
    
    createPinballObstacles();
    resetBall();
    setupPinballControls();
    startPinballGame();
}

function createPinballObstacles() {
    gameData.pinball.obstacles = [
        // 邊界牆
        { x: 0, y: 0, width: 10, height: 600, type: 'wall' },
        { x: 390, y: 0, width: 10, height: 600, type: 'wall' },
        { x: 0, y: 0, width: 400, height: 10, type: 'wall' },
        
        // 圓形障礙物
        { x: 100, y: 150, radius: 20, type: 'bumper', score: 100 },
        { x: 200, y: 120, radius: 20, type: 'bumper', score: 100 },
        { x: 300, y: 150, radius: 20, type: 'bumper', score: 100 },
        { x: 150, y: 250, radius: 15, type: 'bumper', score: 50 },
        { x: 250, y: 250, radius: 15, type: 'bumper', score: 50 },
        
        // 三角形障礙物
        { x: 80, y: 350, width: 40, height: 30, type: 'triangle', score: 200 },
        { x: 280, y: 350, width: 40, height: 30, type: 'triangle', score: 200 },
        
        // 擋板
        { x: 50, y: 520, width: 80, height: 10, type: 'flipper', side: 'left' },
        { x: 270, y: 520, width: 80, height: 10, type: 'flipper', side: 'right' }
    ];
}

function resetBall() {
    gameData.pinball.ball = {
        x: 380,
        y: 550,
        vx: 0,
        vy: 0,
        radius: 8,
        launched: false
    };
}

function setupPinballControls() {
    const leftFlipper = document.getElementById('leftFlipper');
    const rightFlipper = document.getElementById('rightFlipper');
    const launchBtn = document.getElementById('launchBtn');
    
    leftFlipper.onmousedown = () => { gameData.pinball.flippers.left.active = true; };
    leftFlipper.onmouseup = () => { gameData.pinball.flippers.left.active = false; };
    
    rightFlipper.onmousedown = () => { gameData.pinball.flippers.right.active = true; };
    rightFlipper.onmouseup = () => { gameData.pinball.flippers.right.active = false; };
    
    launchBtn.onclick = launchBall;
    
    // 鍵盤控制
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            gameData.pinball.flippers.left.active = true;
        }
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            gameData.pinball.flippers.right.active = true;
        }
        if (e.key === ' ') {
            e.preventDefault();
            launchBall();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            gameData.pinball.flippers.left.active = false;
        }
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            gameData.pinball.flippers.right.active = false;
        }
    });
}

function launchBall() {
    if (!gameData.pinball.ball.launched) {
        gameData.pinball.ball.vx = -8 + Math.random() * 4;
        gameData.pinball.ball.vy = -15;
        gameData.pinball.ball.launched = true;
    }
}

function startPinballGame() {
    gameData.pinball.gameRunning = true;
    updatePinballStats();
    pinballGameLoop();
}

function pinballGameLoop() {
    if (!gameData.pinball.gameRunning) return;
    
    updatePinballPhysics();
    renderPinball();
    
    gameData.pinball.animationId = requestAnimationFrame(pinballGameLoop);
}

function updatePinballPhysics() {
    const ball = gameData.pinball.ball;
    
    if (!ball.launched) return;
    
    // 重力
    ball.vy += 0.3;
    
    // 更新位置
    ball.x += ball.vx;
    ball.y += ball.vy;
    
    // 邊界碰撞
    if (ball.x <= ball.radius || ball.x >= 400 - ball.radius) {
        ball.vx *= -0.8;
        ball.x = Math.max(ball.radius, Math.min(400 - ball.radius, ball.x));
    }
    
    if (ball.y <= ball.radius) {
        ball.vy *= -0.8;
        ball.y = ball.radius;
    }
    
    // 球掉落
    if (ball.y > 600) {
        gameData.pinball.balls--;
        if (gameData.pinball.balls > 0) {
            resetBall();
        } else {
            gameOver();
        }
        updatePinballStats();
        return;
    }
    
    // 障礙物碰撞
    gameData.pinball.obstacles.forEach(obstacle => {
        if (checkPinballCollision(ball, obstacle)) {
            handlePinballCollision(ball, obstacle);
        }
    });
    
    // 摩擦力
    ball.vx *= 0.995;
    ball.vy *= 0.998;
}

function checkPinballCollision(ball, obstacle) {
    if (obstacle.type === 'bumper') {
        const dx = ball.x - obstacle.x;
        const dy = ball.y - obstacle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < ball.radius + obstacle.radius;
    }
    
    if (obstacle.type === 'wall' || obstacle.type === 'triangle' || obstacle.type === 'flipper') {
        return ball.x + ball.radius > obstacle.x && 
               ball.x - ball.radius < obstacle.x + obstacle.width &&
               ball.y + ball.radius > obstacle.y && 
               ball.y - ball.radius < obstacle.y + obstacle.height;
    }
    
    return false;
}

function handlePinballCollision(ball, obstacle) {
    if (obstacle.type === 'bumper') {
        const dx = ball.x - obstacle.x;
        const dy = ball.y - obstacle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const force = 8;
            ball.vx = (dx / distance) * force;
            ball.vy = (dy / distance) * force;
        }
        
        gameData.pinball.score += obstacle.score;
        updatePinballStats();
    }
    
    if (obstacle.type === 'wall') {
        if (ball.x < obstacle.x + obstacle.width/2) {
            ball.vx = Math.abs(ball.vx) * -0.8;
        } else {
            ball.vx = Math.abs(ball.vx) * 0.8;
        }
    }
    
    if (obstacle.type === 'triangle') {
        ball.vy *= -1.2;
        ball.vx += (Math.random() - 0.5) * 4;
        gameData.pinball.score += obstacle.score;
        updatePinballStats();
    }
    
    if (obstacle.type === 'flipper') {
        const flipper = gameData.pinball.flippers[obstacle.side];
        if (flipper.active) {
            ball.vy = -Math.abs(ball.vy) * 1.5;
            ball.vx += obstacle.side === 'left' ? 5 : -5;
        } else {
            ball.vy *= -0.6;
        }
    }
}

function renderPinball() {
    const ctx = gameData.pinball.ctx;
    
    // 清空畫布
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 400, 600);
    
    // 繪製障礙物
    gameData.pinball.obstacles.forEach(obstacle => {
        switch (obstacle.type) {
            case 'wall':
                ctx.fillStyle = '#e74c3c';
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                break;
            case 'bumper':
                ctx.fillStyle = '#f39c12';
                ctx.beginPath();
                ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'triangle':
                ctx.fillStyle = '#9b59b6';
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                break;
            case 'flipper':
                const flipper = gameData.pinball.flippers[obstacle.side];
                ctx.fillStyle = flipper.active ? '#2ecc71' : '#95a5a6';
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                break;
        }
    });
    
    // 繪製球
    ctx.fillStyle = '#ecf0f1';
    ctx.beginPath();
    ctx.arc(gameData.pinball.ball.x, gameData.pinball.ball.y, gameData.pinball.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 繪製發射軌道
    if (!gameData.pinball.ball.launched) {
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(360, 500);
        ctx.lineTo(400, 500);
        ctx.lineTo(400, 600);
        ctx.stroke();
    }
}

function updatePinballStats() {
    document.getElementById('pinballScore').textContent = gameData.pinball.score;
    document.getElementById('pinballBalls').textContent = gameData.pinball.balls;
    document.getElementById('pinballLevel').textContent = gameData.pinball.level;
}

function gameOver() {
    gameData.pinball.gameRunning = false;
    if (gameData.pinball.animationId) {
        cancelAnimationFrame(gameData.pinball.animationId);
    }
    
    setTimeout(() => {
        alert(`遊戲結束！最終分數: ${gameData.pinball.score}`);
    }, 500);
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('簡化版遊戲系統已載入');
    showGameSelection();
});