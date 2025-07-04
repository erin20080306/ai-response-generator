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

// AI行動邏輯
function executeAITurn() {
    const currentPlayerIndex = gameData.mahjong.currentPlayer;
    const aiPlayer = gameData.mahjong.players[currentPlayerIndex];
    
    // AI摸牌
    if (gameData.mahjong.tilePool.length > 0 && aiPlayer.hand.length <= 13) {
        const newTile = gameData.mahjong.tilePool.pop();
        aiPlayer.hand.push(newTile);
        gameData.mahjong.remainingTiles--;
    }
    
    // AI打牌（隨機選擇一張牌）
    if (aiPlayer.hand.length > 0) {
        const randomIndex = Math.floor(Math.random() * aiPlayer.hand.length);
        const discardedTile = aiPlayer.hand.splice(randomIndex, 1)[0];
        gameData.mahjong.discardPile.push(discardedTile);
    }
    
    // 下一個玩家
    nextPlayer();
    
    updateMahjongDisplay();
}



function restartMahjong() {
    // 重置所有玩家分數
    gameData.mahjong.players.forEach(player => {
        player.score = 25600;
    });
    gameData.mahjong.round = 1;
    initMahjongGame();
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('簡化版遊戲系統已載入');
    showGameSelection();
});