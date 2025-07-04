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
            
            <div class="mahjong-table-horizontal">
                <!-- 上方玩家 (電腦1) -->
                <div class="player-area player-top">
                    <div class="player-info">電腦玩家1</div>
                    <div class="player-tiles" id="computer1-tiles"></div>
                </div>
                
                <!-- 中間區域 -->
                <div class="center-horizontal">
                    <!-- 左方玩家 (電腦2) -->
                    <div class="left-player">
                        <div class="player-info">電腦玩家2</div>
                        <div class="player-tiles vertical-tiles" id="computer2-tiles"></div>
                    </div>
                    
                    <!-- 桌面中央 -->
                    <div class="table-center">
                        <div class="discarded-tiles" id="discarded-tiles"></div>
                        <div class="game-info">
                            <div id="current-turn">輪到: 玩家</div>
                            <div id="game-status">遊戲開始</div>
                        </div>
                    </div>
                    
                    <!-- 右方玩家 (電腦3) -->
                    <div class="right-player">
                        <div class="player-info">電腦玩家3</div>
                        <div class="player-tiles vertical-tiles" id="computer3-tiles"></div>
                    </div>
                </div>
                
                <!-- 下方玩家 (真人玩家) -->
                <div class="player-area player-bottom">
                    <div class="player-info">玩家 (你)</div>
                    <div class="player-tiles large-tiles" id="player-tiles"></div>
                    <div class="player-actions">
                        <button class="btn btn-primary" onclick="mahjongDiscard()" id="discard-btn" disabled>出牌</button>
                        <button class="btn btn-success" onclick="mahjongCall('chi')" id="chi-btn" style="display:none">吃</button>
                        <button class="btn btn-warning" onclick="mahjongCall('pong')" id="pong-btn" style="display:none">碰</button>
                        <button class="btn btn-danger" onclick="mahjongCall('hu')" id="hu-btn" style="display:none">胡</button>
                        <button class="btn btn-secondary" onclick="mahjongCall('pass')" id="pass-btn" style="display:none">過</button>
                        <button class="btn btn-info" onclick="restartMahjong()">重新開始</button>
                    </div>
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

// 麻將遊戲初始化 - 4人版本
function initMahjongGame() {
    // 初始化4人麻將遊戲狀態
    gameData.mahjong = {
        players: [
            { name: '玩家', hand: [], discarded: [], isHuman: true },
            { name: '電腦1', hand: [], discarded: [], isHuman: false },
            { name: '電腦2', hand: [], discarded: [], isHuman: false },
            { name: '電腦3', hand: [], discarded: [], isHuman: false }
        ],
        currentPlayer: 0,
        tiles: generateMahjongTiles(),
        tableCenter: [],
        selectedTile: null,
        waitingForAction: false,
        lastDiscardedTile: null,
        gameStarted: true,
        round: 1,
        score: 0
    };
    
    // 發牌給所有玩家
    dealInitialTiles();
    renderMahjongBoard();
    updateMahjongDisplay();
    
    // 開始遊戲回合
    startPlayerTurn();
}

// 生成麻將牌組
function generateMahjongTiles() {
    const tiles = [];
    
    // 萬子牌 (1-9)
    for (let i = 1; i <= 9; i++) {
        for (let j = 0; j < 4; j++) {
            tiles.push(i + '萬');
        }
    }
    
    // 筒子牌 (1-9)
    for (let i = 1; i <= 9; i++) {
        for (let j = 0; j < 4; j++) {
            tiles.push(i + '筒');
        }
    }
    
    // 條子牌 (1-9)
    for (let i = 1; i <= 9; i++) {
        for (let j = 0; j < 4; j++) {
            tiles.push(i + '條');
        }
    }
    
    // 字牌
    const honors = ['東', '南', '西', '北', '中', '發', '白'];
    for (let honor of honors) {
        for (let j = 0; j < 4; j++) {
            tiles.push(honor);
        }
    }
    
    // 洗牌
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    
    return tiles;
}

// 發牌給所有玩家
function dealInitialTiles() {
    const tiles = gameData.mahjong.tiles;
    let tileIndex = 0;
    
    // 每人發13張牌
    for (let player of gameData.mahjong.players) {
        player.hand = [];
        for (let i = 0; i < 13; i++) {
            if (tileIndex < tiles.length) {
                player.hand.push(tiles[tileIndex++]);
            }
        }
        player.hand.sort();
    }
    
    // 更新剩餘牌堆
    gameData.mahjong.tiles = tiles.slice(tileIndex);
}

function renderMahjongBoard() {
    if (!gameData.mahjong || !gameData.mahjong.players) return;
    
    const players = gameData.mahjong.players;
    
    // 渲染玩家手牌 (下方)
    const playerTiles = document.getElementById('player-tiles');
    if (playerTiles && players[0]) {
        playerTiles.innerHTML = players[0].hand.map((tile, index) => 
            `<div class="mahjong-tile large-tile ${gameData.mahjong.selectedTile === tile ? 'selected' : ''}" 
                  onclick="selectTile('${tile}', ${index})">${tile}</div>`
        ).join('');
    }
    
    // 渲染電腦1手牌 (上方) - 只顯示背面
    const computer1Tiles = document.getElementById('computer1-tiles');
    if (computer1Tiles && players[1]) {
        computer1Tiles.innerHTML = players[1].hand.map(() => 
            `<div class="mahjong-tile back-tile">🀫</div>`
        ).join('');
    }
    
    // 渲染電腦2手牌 (左方) - 只顯示背面
    const computer2Tiles = document.getElementById('computer2-tiles');
    if (computer2Tiles && players[2]) {
        computer2Tiles.innerHTML = players[2].hand.map(() => 
            `<div class="mahjong-tile back-tile vertical">🀫</div>`
        ).join('');
    }
    
    // 渲染電腦3手牌 (右方) - 只顯示背面
    const computer3Tiles = document.getElementById('computer3-tiles');
    if (computer3Tiles && players[3]) {
        computer3Tiles.innerHTML = players[3].hand.map(() => 
            `<div class="mahjong-tile back-tile vertical">🀫</div>`
        ).join('');
    }
    
    // 渲染桌面中央的打出牌
    const discardedTiles = document.getElementById('discarded-tiles');
    if (discardedTiles) {
        discardedTiles.innerHTML = gameData.mahjong.tableCenter.map(tile => 
            `<div class="discarded-tile">${tile}</div>`
        ).join('');
    }
    
    // 更新當前玩家指示
    const currentTurn = document.getElementById('current-turn');
    if (currentTurn) {
        currentTurn.textContent = `輪到: ${players[gameData.mahjong.currentPlayer].name}`;
    }
}

function updateMahjongDisplay() {
    const gameStatus = document.getElementById('game-status');
    if (gameStatus) {
        if (gameData.mahjong.waitingForAction) {
            gameStatus.textContent = '等待玩家動作...';
        } else {
            gameStatus.textContent = `第${gameData.mahjong.round}局`;
        }
    }
}

// 開始玩家回合
function startPlayerTurn() {
    if (!gameData.mahjong.gameStarted) return;
    
    const currentPlayer = gameData.mahjong.players[gameData.mahjong.currentPlayer];
    
    if (currentPlayer.isHuman) {
        // 玩家回合 - 等待玩家動作
        enablePlayerActions(true);
        updateMahjongDisplay();
    } else {
        // 電腦回合 - 自動執行
        setTimeout(() => {
            executeComputerTurn();
        }, 1000);
    }
}

// 啟用/禁用玩家動作按鈕
function enablePlayerActions(enabled) {
    const buttons = ['discard-btn', 'chi-btn', 'pong-btn', 'hu-btn', 'pass-btn'];
    buttons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.disabled = !enabled;
        }
    });
    
    // 只在有選中牌時啟用出牌按鈕
    const discardBtn = document.getElementById('discard-btn');
    if (discardBtn && enabled) {
        discardBtn.disabled = !gameData.mahjong.selectedTile;
    }
}

// 電腦回合執行
function executeComputerTurn() {
    const currentPlayerIndex = gameData.mahjong.currentPlayer;
    const currentPlayer = gameData.mahjong.players[currentPlayerIndex];
    
    if (currentPlayer.isHuman) return;
    
    // 電腦抽牌
    if (gameData.mahjong.tiles.length > 0) {
        const newTile = gameData.mahjong.tiles.shift();
        currentPlayer.hand.push(newTile);
        currentPlayer.hand.sort();
    }
    
    // 電腦智能出牌
    const tileToDiscard = getComputerDiscardChoice(currentPlayer);
    if (tileToDiscard) {
        // 從手牌中移除
        const tileIndex = currentPlayer.hand.indexOf(tileToDiscard);
        if (tileIndex > -1) {
            currentPlayer.hand.splice(tileIndex, 1);
        }
        
        // 添加到桌面中央並高亮顯示
        animateComputerDiscard(tileToDiscard, currentPlayerIndex);
    }
}

// 電腦智能出牌選擇
function getComputerDiscardChoice(player) {
    const hand = [...player.hand];
    
    // 簡單AI邏輯：丟掉最不常見的牌
    const tileCounts = {};
    hand.forEach(tile => {
        const baseType = tile.slice(-1); // 萬、筒、條
        const number = tile.slice(0, -1);
        tileCounts[tile] = (tileCounts[tile] || 0) + 1;
    });
    
    // 優先丟單張牌
    for (let tile of hand) {
        if (tileCounts[tile] === 1) {
            return tile;
        }
    }
    
    // 隨機選擇
    return hand[Math.floor(Math.random() * hand.length)];
}

// 動畫顯示電腦出牌
function animateComputerDiscard(tile, playerIndex) {
    gameData.mahjong.tableCenter.push(tile);
    gameData.mahjong.lastDiscardedTile = tile;
    
    // 更新遊戲界面
    renderMahjongBoard();
    
    // 檢查玩家是否可以吃/碰/胡
    setTimeout(() => {
        checkPlayerActions(tile);
    }, 500);
}

// 檢查玩家可執行的動作
function checkPlayerActions(discardedTile) {
    const player = gameData.mahjong.players[0]; // 玩家
    const canChi = checkCanChi(player.hand, discardedTile);
    const canPong = checkCanPong(player.hand, discardedTile);
    const canHu = checkCanHu(player.hand, discardedTile);
    
    // 顯示/隱藏相應按鈕
    document.getElementById('chi-btn').style.display = canChi ? 'inline-block' : 'none';
    document.getElementById('pong-btn').style.display = canPong ? 'inline-block' : 'none';
    document.getElementById('hu-btn').style.display = canHu ? 'inline-block' : 'none';
    
    if (canChi || canPong || canHu) {
        document.getElementById('pass-btn').style.display = 'inline-block';
        gameData.mahjong.waitingForAction = true;
        updateMahjongDisplay();
    } else {
        // 沒有可執行動作，繼續下一回合
        nextTurn();
    }
}

// 檢查是否可以吃
function checkCanChi(hand, tile) {
    // 簡化邏輯：檢查是否有連續牌
    return hand.length > 1; // 簡化判斷
}

// 檢查是否可以碰
function checkCanPong(hand, tile) {
    let count = 0;
    hand.forEach(handTile => {
        if (handTile === tile) count++;
    });
    return count >= 2;
}

// 檢查是否可以胡
function checkCanHu(hand, tile) {
    // 簡化胡牌判斷
    return hand.length >= 13;
}

// 下一回合
function nextTurn() {
    gameData.mahjong.currentPlayer = (gameData.mahjong.currentPlayer + 1) % 4;
    gameData.mahjong.waitingForAction = false;
    
    // 隱藏所有動作按鈕
    ['chi-btn', 'pong-btn', 'hu-btn', 'pass-btn'].forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    
    startPlayerTurn();
}

// 麻將控制函數
function selectTile(tile, index) {
    gameData.mahjong.selectedTile = tile;
    renderMahjongBoard();
    
    // 啟用出牌按鈕
    const discardBtn = document.getElementById('discard-btn');
    if (discardBtn) {
        discardBtn.disabled = false;
    }
}

// 玩家出牌
function mahjongDiscard() {
    if (!gameData.mahjong.selectedTile) {
        alert('請先選擇要打出的牌！');
        return;
    }
    
    const player = gameData.mahjong.players[0];
    const tileIndex = player.hand.indexOf(gameData.mahjong.selectedTile);
    
    if (tileIndex > -1) {
        // 從手牌移除
        player.hand.splice(tileIndex, 1);
        
        // 添加到桌面中央
        gameData.mahjong.tableCenter.push(gameData.mahjong.selectedTile);
        gameData.mahjong.lastDiscardedTile = gameData.mahjong.selectedTile;
        gameData.mahjong.selectedTile = null;
        
        // 更新顯示
        renderMahjongBoard();
        
        // 下一回合
        nextTurn();
    }
}

// 玩家動作：吃、碰、胡、過
function mahjongCall(action) {
    const player = gameData.mahjong.players[0];
    const discardedTile = gameData.mahjong.lastDiscardedTile;
    
    switch (action) {
        case 'chi':
            alert('吃牌功能！');
            break;
        case 'pong':
            alert('碰牌功能！');
            break;
        case 'hu':
            alert('恭喜胡牌！');
            gameData.mahjong.score += 1000;
            setTimeout(() => {
                initMahjongGame();
            }, 2000);
            break;
        case 'pass':
            // 什麼都不做，繼續下一回合
            break;
    }
    
    gameData.mahjong.waitingForAction = false;
    nextTurn();
}

function restartMahjong() {
    initMahjongGame();
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('簡化版遊戲系統已載入');
    showGameSelection();
});