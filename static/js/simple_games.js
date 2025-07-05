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
    
    // 確保遊戲容器顯示
    gameContainer.style.display = 'block';
    
    // 隱藏主要內容區域
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.style.display = 'none';
    }
    
    switch(gameType) {
        case 'tetris':
            loadTetrisGame();
            break;
        case 'mahjong':
            // 跳轉到獨立的麻將遊戲頁面
            window.open('/mahjong', '_blank');
            break;
        case 'memory':
            loadMemoryGame();
            break;
        case 'pinball':
            loadPinballGame();
            break;
        case 'gomoku':
            loadGomokuGame();
            break;
        case 'chess':
            loadChessGame();
            break;
        case 'poker':
            loadPokerGame();
            break;
        case 'sudoku':
            loadSudokuGame();
            break;
        case 'tower':
            loadTowerDefenseGame();
            break;
        default:
            showGameSelection();
    }
}

// 顯示遊戲選擇畫面
function showGameSelection() {
    const gameContainer = document.getElementById('gameContainer');
    
    // 清空遊戲容器，返回主畫面
    if (gameContainer) {
        gameContainer.innerHTML = '';
        gameContainer.style.display = 'none';
    }
    
    // 顯示主要內容區域
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.style.display = 'block';
    }
    
    // 確保聊天界面顯示
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
        chatContainer.style.display = 'block';
    }
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
        <div class="mahjong-game-container" style="width: 500px; height: 350px; margin: 0 auto; border: 2px solid #333; position: relative;">
            <div class="game-header" style="height: 30px; background: #333; color: white; display: flex; justify-content: space-between; align-items: center; padding: 0 8px;">
                <h6 style="margin: 0; font-size: 12px;">🀄 麻將遊戲</h6>
                <button onclick="showGameSelection()" class="back-btn btn btn-secondary btn-sm" style="font-size: 10px; padding: 2px 6px;">← 返回</button>
            </div>
            
            <!-- 緊湊的遊戲桌面 -->
            <div class="mahjong-table" style="width: 496px; height: 288px; position: relative; background: #0F5132; margin: 0; padding: 0;">
                
                <!-- 桌面中央區域 - 顯示打出的牌 -->
                <div class="table-center" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 130px; border: 1px solid #666; background: rgba(0,0,0,0.1);">
                    <div class="discarded-tiles" id="discardedTiles" style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 1px; padding: 4px; font-size: 20px; height: 100%; overflow: hidden;"></div>
                </div>
                
                <!-- 玩家位置 - 底部(你) -->
                <div class="player-bottom" style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); text-align: center;">
                    <div class="player-info" style="color: #fff; font-size: 12px; margin-bottom: 5px; background: rgba(0,0,0,0.5); padding: 2px 5px; border-radius: 3px;">
                        <span>你 (25000分)</span>
                    </div>
                    <div class="player-tiles" id="playerTiles" style="display: flex; gap: 1px; justify-content: center; flex-wrap: wrap; max-width: 380px;"></div>
                </div>
                
                <!-- 電腦AI玩家 - 右側 -->
                <div class="player-right" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); text-align: center;">
                    <div class="player-info" style="color: #fff; font-size: 12px; margin-bottom: 5px; writing-mode: vertical-lr; background: rgba(0,0,0,0.5); padding: 2px 5px; border-radius: 3px;">
                        <span>電腦A (25000分)</span>
                    </div>
                    <div class="player-tiles" id="computerTiles1" style="display: flex; flex-direction: column; gap: 2px; align-items: center; max-height: 300px; overflow: hidden;"></div>
                </div>
                
                <!-- 電腦AI玩家 - 頂部 -->
                <div class="player-top" style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); text-align: center;">
                    <div class="player-info" style="color: #fff; font-size: 12px; margin-bottom: 5px; background: rgba(0,0,0,0.5); padding: 2px 5px; border-radius: 3px;">
                        <span>電腦B (25000分)</span>
                    </div>
                    <div class="player-tiles" id="computerTiles2" style="display: flex; gap: 2px; justify-content: center; flex-wrap: wrap; max-width: 400px;"></div>
                </div>
                
                <!-- 電腦AI玩家 - 左側 -->
                <div class="player-left" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); text-align: center;">
                    <div class="player-info" style="color: #fff; font-size: 12px; margin-bottom: 5px; writing-mode: vertical-lr; background: rgba(0,0,0,0.5); padding: 2px 5px; border-radius: 3px;">
                        <span>電腦C (25000分)</span>
                    </div>
                    <div class="player-tiles" id="computerTiles3" style="display: flex; flex-direction: column; gap: 2px; align-items: center; max-height: 300px; overflow: hidden;"></div>
                </div>
                
                <!-- 遊戲資訊 -->
                <div class="game-status" style="position: absolute; top: 10px; left: 10px; color: #fff; font-size: 12px; background: rgba(0,0,0,0.7); padding: 5px; border-radius: 3px; z-index: 10;">
                    <div>東一局</div>
                    <div>剩餘: <span id="tilesLeft">136</span>張</div>
                </div>
                
                <!-- 不阻擋畫面的提示區域 -->
                <div class="action-prompt" id="actionPrompt" style="position: absolute; top: 50px; right: 10px; color: #fff; font-size: 14px; background: rgba(255,165,0,0.95); padding: 8px; border-radius: 5px; display: none; max-width: 120px; z-index: 20; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                    <div id="promptText" style="font-weight: bold;"></div>
                </div>
            </div>
            
            <!-- 控制按鈕 - 在遊戲桌面外側底部 -->
            <div class="control-panel" style="position: absolute; bottom: 5px; left: 10px; right: 10px; display: flex; justify-content: center; gap: 10px; background: #333; padding: 5px; border-radius: 3px;">
                <button onclick="startMahjongGame()" class="btn btn-success btn-sm">🎮 開始遊戲</button>
                <button onclick="restartMahjong()" class="btn btn-secondary btn-sm">🔄 重新開始</button>
                
                <!-- 動作按鈕 - 只在需要時顯示 -->
                <div class="action-buttons" id="actionButtons" style="display: none;">
                    <button onclick="executeSpecialAction('chi')" class="btn btn-warning btn-sm">吃</button>
                    <button onclick="executeSpecialAction('pong')" class="btn btn-warning btn-sm">碰</button>
                    <button onclick="executeSpecialAction('kong')" class="btn btn-warning btn-sm">槓</button>
                    <button onclick="executeSpecialAction('hu')" class="btn btn-danger btn-sm">胡</button>
                    <button onclick="passAction()" class="btn btn-info btn-sm">過</button>
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
    },
    memory: {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        moves: 0,
        gameStarted: false,
        canFlip: true,
        timer: 0,
        timerInterval: null,
        gridSize: 4,
        symbols: ['🎯', '🎲', '🎮', '🎪', '🎨', '🎭', '🎸', '🎺', '🎻', '🎹', '🏆', '🏅', '⭐', '💎', '🔥', '⚡']
    },
    pinball: {
        ball: { x: 300, y: 700, vx: 0, vy: 0, radius: 8 },
        leftPaddle: { x: 200, y: 750, width: 80, height: 15, active: false },
        rightPaddle: { x: 320, y: 750, width: 80, height: 15, active: false },
        score: 0,
        highScore: 0,
        balls: 3,
        combo: 0,
        multiplier: 1,
        power: 0,
        gameStarted: false,
        gameRunning: false,
        chargingPower: false,
        obstacles: [],
        bumpers: [],
        bonuses: [],
        animationId: null,
        canvas: null,
        ctx: null,
        keys: {}
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
    gameData.mahjong.playerHand = [];
    gameData.mahjong.discardPile = [];
    gameData.mahjong.computerHands = [[], [], []]; // 三個電腦玩家
    gameData.mahjong.selectedTile = null;
    gameData.mahjong.score = 0;
    gameData.mahjong.round = 1;
    gameData.mahjong.gameStarted = false;
    gameData.mahjong.currentPlayer = 0; // 0=玩家, 1-3=電腦
    gameData.mahjong.tilesRemaining = 136;
    
    clearMahjongDisplay();
    updateMahjongDisplay();
}

// 開始麻將遊戲
function startMahjongGame() {
    if (gameData.mahjong.gameStarted) return;
    
    gameData.mahjong.gameStarted = true;
    
    // 初始發牌給所有玩家
    dealInitialTiles();
}

// 發初始牌
function dealInitialTiles() {
    // 每個玩家13張牌
    for (let round = 0; round < 13; round++) {
        setTimeout(() => {
            // 玩家
            drawTileToPlayer(0);
            // 三個電腦玩家
            for (let i = 0; i < 3; i++) {
                drawTileToComputer(i);
            }
            
            if (round === 12) {
                // 發牌完成，開始遊戲
                setTimeout(() => {
                    playerTurn();
                }, 500);
            }
        }, round * 300); // 逐一發牌
    }
}

// 給玩家發牌
function drawTileToPlayer(playerIndex) {
    const tileSet = gameData.mahjong.tileSet;
    const randomTile = tileSet[Math.floor(Math.random() * tileSet.length)];
    
    if (playerIndex === 0) {
        gameData.mahjong.playerHand.push(randomTile);
    } else {
        gameData.mahjong.computerHands[playerIndex - 1].push(randomTile);
    }
    
    gameData.mahjong.tilesRemaining--;
    renderMahjongBoard();
    updateMahjongDisplay();
}

// 給電腦發牌
function drawTileToComputer(computerIndex) {
    const tileSet = gameData.mahjong.tileSet;
    const randomTile = tileSet[Math.floor(Math.random() * tileSet.length)];
    gameData.mahjong.computerHands[computerIndex].push(randomTile);
    gameData.mahjong.tilesRemaining--;
}

// 清空顯示
function clearMahjongDisplay() {
    document.getElementById('playerTiles').innerHTML = '';
    document.getElementById('computerTiles1').innerHTML = '';
    document.getElementById('computerTiles2').innerHTML = '';
    document.getElementById('computerTiles3').innerHTML = '';
    document.getElementById('discardedTiles').innerHTML = '';
    hideActionPrompt();
}

// 渲染麻將桌面
function renderMahjongBoard() {
    renderPlayerTiles();
    renderComputerTiles();
    renderDiscardedTiles();
}

// 渲染玩家牌張
function renderPlayerTiles() {
    const playerTiles = document.getElementById('playerTiles');
    if (!playerTiles) return;
    
    playerTiles.innerHTML = '';
    gameData.mahjong.playerHand.forEach((tile, index) => {
        const tileElement = document.createElement('div');
        tileElement.className = 'mahjong-tile player-tile';
        tileElement.style.cssText = `
            width: 26px; height: 34px; background: #fff; border: 1px solid #333; 
            display: flex; align-items: center; justify-content: center; 
            font-size: 22px; font-weight: bold; cursor: pointer; border-radius: 2px;
        `;
        tileElement.textContent = tile;
        tileElement.onclick = () => selectPlayerTile(index);
        
        if (gameData.mahjong.selectedTile === index) {
            tileElement.style.background = '#ffeb3b';
        }
        
        playerTiles.appendChild(tileElement);
    });
}

// 渲染電腦玩家牌張
function renderComputerTiles() {
    // 渲染三個電腦玩家的牌背（不顯示牌面）
    for (let i = 0; i < 3; i++) {
        const computerTiles = document.getElementById(`computerTiles${i + 1}`);
        if (!computerTiles) continue;
        
        computerTiles.innerHTML = '';
        const handSize = gameData.mahjong.computerHands[i].length;
        
        for (let j = 0; j < handSize; j++) {
            const tileElement = document.createElement('div');
            tileElement.className = 'mahjong-tile computer-tile';
            // 不顯示牌面，只顯示牌背
            
            if (i === 0 || i === 2) { // 左右側玩家
                tileElement.style.cssText = `
                    width: 16px; height: 24px; background: #4a90e2; border: 1px solid #333; 
                    margin: 1px 0; border-radius: 1px; 
                `;
            } else { // 頂部玩家
                tileElement.style.cssText = `
                    width: 18px; height: 26px; background: #4a90e2; border: 1px solid #333; 
                    margin: 0 1px; border-radius: 1px;
                `;
            }
            
            computerTiles.appendChild(tileElement);
        }
    }
}

// 渲染打出的牌
function renderDiscardedTiles() {
    const discardedTiles = document.getElementById('discardedTiles');
    if (!discardedTiles) return;
    
    discardedTiles.innerHTML = '';
    gameData.mahjong.discardPile.forEach(tile => {
        const tileElement = document.createElement('div');
        tileElement.className = 'discarded-tile';
        tileElement.style.cssText = `
            width: 22px; height: 30px; background: #fff; border: 1px solid #666; 
            display: flex; align-items: center; justify-content: center; 
            font-size: 20px; font-weight: bold; border-radius: 2px;
        `;
        tileElement.textContent = tile;
        discardedTiles.appendChild(tileElement);
    });
}

// 選擇玩家牌張
function selectPlayerTile(index) {
    gameData.mahjong.selectedTile = index;
    renderPlayerTiles();
    
    // 檢查是否可以執行特殊動作
    checkPossibleActions();
}

// 檢查可能的動作
function checkPossibleActions() {
    const canChi = checkCanChi();
    const canPong = checkCanPong();
    const canKong = checkCanKong();
    const canHu = checkCanHu();
    
    if (canChi || canPong || canKong || canHu) {
        showActionPrompt(canChi, canPong, canKong, canHu);
    } else {
        hideActionPrompt();
    }
}

// 顯示動作提示
function showActionPrompt(canChi, canPong, canKong, canHu) {
    const prompt = document.getElementById('actionPrompt');
    const promptText = document.getElementById('promptText');
    
    let actions = [];
    if (canChi) actions.push('吃');
    if (canPong) actions.push('碰');
    if (canKong) actions.push('槓');
    if (canHu) actions.push('胡');
    
    promptText.textContent = actions.join('/');
    prompt.style.display = 'block';
    
    // 顯示動作按鈕
    document.getElementById('actionButtons').style.display = 'inline-block';
}

// 隱藏動作提示
function hideActionPrompt() {
    document.getElementById('actionPrompt').style.display = 'none';
    document.getElementById('actionButtons').style.display = 'none';
}

// 檢查動作的邏輯版本
function checkCanChi() { 
    // 檢查是否可以吃牌（需要有棄牌堆的最後一張牌）
    if (gameData.mahjong.discardPile.length === 0) return false;
    
    const lastDiscarded = gameData.mahjong.discardPile[gameData.mahjong.discardPile.length - 1];
    
    // 簡化檢查：如果手牌中有與棄牌相近的數字牌就可以吃
    const tileMatch = lastDiscarded.match(/(\d+)([萬條筒])/);
    if (!tileMatch) return false;
    
    const number = parseInt(tileMatch[1]);
    const suit = tileMatch[2];
    
    // 檢查手牌中是否有相鄰的牌
    const hasAdjacent = gameData.mahjong.playerHand.some(tile => {
        const match = tile.match(/(\d+)([萬條筒])/);
        if (!match || match[2] !== suit) return false;
        const tileNum = parseInt(match[1]);
        return Math.abs(tileNum - number) === 1 || Math.abs(tileNum - number) === 2;
    });
    
    return hasAdjacent;
}

function checkCanPong() { 
    // 檢查是否可以碰牌（手牌中需要有兩張相同的牌）
    if (gameData.mahjong.discardPile.length === 0) return false;
    
    const lastDiscarded = gameData.mahjong.discardPile[gameData.mahjong.discardPile.length - 1];
    const matchingTiles = gameData.mahjong.playerHand.filter(tile => tile === lastDiscarded);
    
    return matchingTiles.length >= 2;
}

function checkCanKong() { 
    // 檢查是否可以槓牌（手牌中需要有三張相同的牌）
    if (gameData.mahjong.discardPile.length === 0) return false;
    
    const lastDiscarded = gameData.mahjong.discardPile[gameData.mahjong.discardPile.length - 1];
    const matchingTiles = gameData.mahjong.playerHand.filter(tile => tile === lastDiscarded);
    
    return matchingTiles.length >= 3;
}

function checkCanHu() { 
    // 檢查是否可以胡牌
    return canHu();
}

// 玩家回合
function playerTurn() {
    if (!gameData.mahjong.gameStarted) return;
    
    // 只有在玩家手牌少於14張時才摸牌
    if (gameData.mahjong.playerHand.length < 14) {
        drawTileToPlayer(0);
    }
    
    // 檢查動作（只在有14張牌時）
    if (gameData.mahjong.playerHand.length === 14) {
        checkPossibleActions();
    }
}

// 電腦回合
function computerTurn(computerIndex) {
    setTimeout(() => {
        // 電腦摸牌
        drawTileToComputer(computerIndex);
        
        // 電腦打牌
        setTimeout(() => {
            const hand = gameData.mahjong.computerHands[computerIndex];
            if (hand.length > 0) {
                const discardIndex = Math.floor(Math.random() * hand.length);
                const discardedTile = hand.splice(discardIndex, 1)[0];
                gameData.mahjong.discardPile.push(discardedTile);
                
                // 顯示電腦打出的牌
                console.log(`電腦${computerIndex + 1}打出：${discardedTile}`);
                
                renderMahjongBoard();
                
                // 下一個玩家
                nextPlayer();
            }
        }, 1000);
    }, 500);
}

// 下一個玩家
function nextPlayer() {
    gameData.mahjong.currentPlayer = (gameData.mahjong.currentPlayer + 1) % 4;
    
    if (gameData.mahjong.currentPlayer === 0) {
        playerTurn();
    } else {
        computerTurn(gameData.mahjong.currentPlayer - 1);
    }
}

// 更新顯示
function updateMahjongDisplay() {
    const tilesLeft = document.getElementById('tilesLeft');
    if (tilesLeft) {
        tilesLeft.textContent = gameData.mahjong.tilesRemaining;
    }
}

// 執行特殊動作
function executeSpecialAction(action) {
    console.log(`執行動作: ${action}`);
    hideActionPrompt();
    
    const lastDiscardedTile = gameData.mahjong.discardPile[gameData.mahjong.discardPile.length - 1];
    
    switch(action) {
        case 'chi':
            // 吃牌邏輯 - 取最後一張棄牌形成順子
            if (lastDiscardedTile) {
                gameData.mahjong.playerHand.push(lastDiscardedTile);
                gameData.mahjong.discardPile.pop(); // 移除棄牌堆的最後一張
                
                // 自動找出可以組成順子的牌
                const tileNumber = parseInt(lastDiscardedTile.match(/\d+/)[0]);
                const tileType = lastDiscardedTile.match(/[萬條筒]/)[0];
                
                // 簡化邏輯：假設玩家有相鄰的牌
                gameData.mahjong.playerHand.sort();
                alert(`吃牌成功！獲得${lastDiscardedTile}`);
                renderMahjongBoard();
            }
            break;
            
        case 'pong':
            // 碰牌邏輯 - 用手牌中的兩張相同牌與棄牌組成刻子
            if (lastDiscardedTile) {
                // 檢查手牌中是否有兩張相同的牌
                const matchingTiles = gameData.mahjong.playerHand.filter(tile => tile === lastDiscardedTile);
                if (matchingTiles.length >= 2) {
                    // 移除手牌中的兩張相同牌
                    for (let i = 0; i < 2; i++) {
                        const index = gameData.mahjong.playerHand.indexOf(lastDiscardedTile);
                        if (index > -1) {
                            gameData.mahjong.playerHand.splice(index, 1);
                        }
                    }
                    gameData.mahjong.discardPile.pop(); // 移除棄牌堆的最後一張
                    
                    // 將碰的牌組加入明牌區
                    if (!gameData.mahjong.playerMelds) {
                        gameData.mahjong.playerMelds = [];
                    }
                    gameData.mahjong.playerMelds.push([lastDiscardedTile, lastDiscardedTile, lastDiscardedTile]);
                    
                    alert(`碰牌成功！獲得${lastDiscardedTile}的刻子`);
                    renderMahjongBoard();
                } else {
                    alert('手牌中沒有足夠的相同牌進行碰牌');
                }
            }
            break;
            
        case 'kong':
            // 槓牌邏輯 - 用手牌中的三張相同牌與棄牌組成槓子
            if (lastDiscardedTile) {
                const matchingTiles = gameData.mahjong.playerHand.filter(tile => tile === lastDiscardedTile);
                if (matchingTiles.length >= 3) {
                    // 移除手牌中的三張相同牌
                    for (let i = 0; i < 3; i++) {
                        const index = gameData.mahjong.playerHand.indexOf(lastDiscardedTile);
                        if (index > -1) {
                            gameData.mahjong.playerHand.splice(index, 1);
                        }
                    }
                    gameData.mahjong.discardPile.pop(); // 移除棄牌堆的最後一張
                    
                    // 將槓的牌組加入明牌區
                    if (!gameData.mahjong.playerMelds) {
                        gameData.mahjong.playerMelds = [];
                    }
                    gameData.mahjong.playerMelds.push([lastDiscardedTile, lastDiscardedTile, lastDiscardedTile, lastDiscardedTile]);
                    
                    alert(`槓牌成功！獲得${lastDiscardedTile}的槓子`);
                    renderMahjongBoard();
                    
                    // 槓牌後要補一張牌
                    if (gameData.mahjong.tiles.length > 0) {
                        const newTile = gameData.mahjong.tiles.pop();
                        gameData.mahjong.playerHand.push(newTile);
                    }
                } else {
                    alert('手牌中沒有足夠的相同牌進行槓牌');
                }
            }
            break;
            
        case 'hu':
            // 胡牌邏輯 - 簡化檢查
            if (canHu()) {
                alert('🎉 恭喜胡牌！遊戲結束！');
                gameData.mahjong.gameStarted = false;
                // 顯示最終手牌
                setTimeout(() => {
                    if (confirm('是否要重新開始遊戲？')) {
                        restartMahjong();
                    }
                }, 1000);
            } else {
                alert('現在還不能胡牌，請繼續遊戲');
            }
            break;
    }
}

// 檢查是否可以胡牌（簡化版）
function canHu() {
    const hand = [...gameData.mahjong.playerHand];
    
    // 簡化胡牌條件：手牌數量為14張時就可以胡牌
    if (hand.length === 14) {
        return true;
    }
    
    // 或者手牌數量為13張且有一張相同的牌（即將形成對子）
    if (hand.length === 13) {
        // 檢查是否有重複的牌
        const tileCount = {};
        hand.forEach(tile => {
            tileCount[tile] = (tileCount[tile] || 0) + 1;
        });
        
        // 如果有兩張相同的牌，可以胡牌
        return Object.values(tileCount).some(count => count >= 2);
    }
    
    return false;
}

// 過牌
function passAction() {
    hideActionPrompt();
    
    // 打出選中的牌
    if (gameData.mahjong.selectedTile !== null) {
        const discardedTile = gameData.mahjong.playerHand.splice(gameData.mahjong.selectedTile, 1)[0];
        gameData.mahjong.discardPile.push(discardedTile);
        gameData.mahjong.selectedTile = null;
        
        renderMahjongBoard();
        nextPlayer();
    }
}

// 麻將控制函數
function drawMahjongTile() {
    if (!gameData.mahjong.gameStarted) {
        startMahjongGame();
        return;
    }
    // 玩家摸牌（如果手牌不足14張）
    if (gameData.mahjong.playerHand.length < 14) {
        playerTurn();
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
            
            // 隱藏動作提示
            hideActionPrompt();
            
            // 結束玩家回合，進入下一個玩家
            nextPlayer();
        }
    } else {
        alert('請先選擇要打出的牌！');
    }
}

function declareMahjongWin() {
    executeSpecialAction('hu');
}

function selectTile(tile, index) {
    gameData.mahjong.selectedTile = tile;
    renderMahjongBoard();
}

function restartMahjong() {
    initMahjongGame();
}

// 添加橋接函數以兼容麻將模板
function executeAction(action) {
    executeSpecialAction(action);
}

// 翻牌記憶遊戲
function loadMemoryGame() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div class="memory-game-container">
            <h3>🧠 翻牌記憶遊戲</h3>
            <div class="memory-stats">
                <div class="stat-item">時間: <span id="memoryTimer">0</span>秒</div>
                <div class="stat-item">步數: <span id="memoryMoves">0</span></div>
                <div class="stat-item">配對: <span id="memoryPairs">0</span>/<span id="totalPairs">8</span></div>
            </div>
            <div class="memory-controls">
                <button onclick="startMemoryGame()" class="btn btn-primary">開始遊戲</button>
                <button onclick="resetMemoryGame()" class="btn btn-warning">重新開始</button>
                <button onclick="showGameSelection()" class="btn btn-secondary">返回選單</button>
            </div>
            <div id="memoryBoard" class="memory-board"></div>
            <div class="memory-message" id="memoryMessage"></div>
        </div>
    `;
    
    initMemoryGame();
}

function initMemoryGame() {
    const totalPairs = 8;
    const symbols = gameData.memory.symbols.slice(0, totalPairs);
    const cards = [...symbols, ...symbols]; // 創建配對卡片
    
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
    
    gameData.memory.flippedCards = [];
    gameData.memory.matchedPairs = 0;
    gameData.memory.moves = 0;
    gameData.memory.timer = 0;
    gameData.memory.gameStarted = false;
    gameData.memory.canFlip = true;
    
    renderMemoryBoard();
    updateMemoryStats();
}

function startMemoryGame() {
    gameData.memory.gameStarted = true;
    gameData.memory.timer = 0;
    
    // 開始計時
    if (gameData.memory.timerInterval) {
        clearInterval(gameData.memory.timerInterval);
    }
    
    gameData.memory.timerInterval = setInterval(() => {
        if (gameData.memory.gameStarted) {
            gameData.memory.timer++;
            updateMemoryStats();
        }
    }, 1000);
    
    document.getElementById('memoryMessage').textContent = '遊戲開始！找出所有配對的卡片！';
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
    if (!gameData.memory.gameStarted || !gameData.memory.canFlip) return;
    
    const card = gameData.memory.cards[cardId];
    if (card.isFlipped || card.isMatched) return;
    
    card.isFlipped = true;
    gameData.memory.flippedCards.push(card);
    
    renderMemoryBoard();
    
    if (gameData.memory.flippedCards.length === 2) {
        gameData.memory.canFlip = false;
        gameData.memory.moves++;
        updateMemoryStats();
        
        setTimeout(checkMemoryMatch, 800);
    }
}

function checkMemoryMatch() {
    const [card1, card2] = gameData.memory.flippedCards;
    
    if (card1.symbol === card2.symbol) {
        // 配對成功
        card1.isMatched = true;
        card2.isMatched = true;
        gameData.memory.matchedPairs++;
        
        document.getElementById('memoryMessage').textContent = '配對成功！🎉';
        
        // 檢查是否全部配對完成
        if (gameData.memory.matchedPairs === 8) {
            gameData.memory.gameStarted = false;
            clearInterval(gameData.memory.timerInterval);
            document.getElementById('memoryMessage').textContent = `🏆 恭喜完成！用時${gameData.memory.timer}秒，${gameData.memory.moves}步！`;
        }
    } else {
        // 配對失敗
        card1.isFlipped = false;
        card2.isFlipped = false;
        document.getElementById('memoryMessage').textContent = '配對失敗，繼續嘗試！';
    }
    
    gameData.memory.flippedCards = [];
    gameData.memory.canFlip = true;
    renderMemoryBoard();
    updateMemoryStats();
}

function updateMemoryStats() {
    document.getElementById('memoryTimer').textContent = gameData.memory.timer;
    document.getElementById('memoryMoves').textContent = gameData.memory.moves;
    document.getElementById('memoryPairs').textContent = gameData.memory.matchedPairs;
}

function resetMemoryGame() {
    if (gameData.memory.timerInterval) {
        clearInterval(gameData.memory.timerInterval);
    }
    initMemoryGame();
    document.getElementById('memoryMessage').textContent = '點擊開始遊戲！';
}

// 彈珠檯遊戲
function loadPinballGame() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div class="pinball-game-container">
            <h3>🎯 彈珠檯遊戲</h3>
            <div class="pinball-header">
                <div class="pinball-stats">
                    <div class="stat-box">
                        <div class="stat-label">分數</div>
                        <div class="stat-value" id="pinballScore">0</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">球數</div>
                        <div class="stat-value" id="pinballBalls">3</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">倍數</div>
                        <div class="stat-value" id="pinballMultiplier">1x</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">最高分</div>
                        <div class="stat-value" id="pinballHighScore">0</div>
                    </div>
                </div>
                <div class="pinball-controls">
                    <button onclick="startPinballGame()" class="btn btn-primary" id="startBtn">開始遊戲</button>
                    <button onclick="launchPinball()" class="btn btn-success" id="launchBtn" disabled>發射 (空白鍵)</button>
                    <button onclick="resetPinballGame()" class="btn btn-warning">重新開始</button>
                    <button onclick="showGameSelection()" class="btn btn-secondary">返回選單</button>
                </div>
            </div>
            <div class="pinball-game-area">
                <canvas id="pinballCanvas" width="600" height="800"></canvas>
                <div class="pinball-side-panel">
                    <div class="power-meter">
                        <div class="meter-label">發射力度</div>
                        <div class="meter-bar">
                            <div class="meter-fill" id="powerFill"></div>
                        </div>
                        <div class="meter-text" id="powerText">0%</div>
                    </div>
                    <div class="combo-display">
                        <div class="combo-label">連擊</div>
                        <div class="combo-value" id="comboValue">0</div>
                    </div>
                    <div class="bonus-display">
                        <div class="bonus-label">獎勵區域</div>
                        <div class="bonus-list" id="bonusList">
                            <div class="bonus-item">🎯 撞球器: 200分</div>
                            <div class="bonus-item">🔥 加速器: 500分</div>
                            <div class="bonus-item">⭐ 星星: 1000分</div>
                            <div class="bonus-item">💎 鑽石: 2000分</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pinball-instructions">
                <div class="instruction-row">
                    <span class="key">←→</span> 移動左右擋板
                </div>
                <div class="instruction-row">
                    <span class="key">空白鍵</span> 發射彈珠 (長按蓄力)
                </div>
                <div class="instruction-row">
                    <span class="tip">💡 連續撞擊可獲得額外分數獎勵</span>
                </div>
            </div>
        </div>
    `;
    
    initPinballGame();
}

function initPinballGame() {
    const canvas = document.getElementById('pinballCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    gameData.pinball.canvas = canvas;
    gameData.pinball.ctx = ctx;
    
    // 重置遊戲狀態
    gameData.pinball.ball = { x: 300, y: 700, vx: 0, vy: 0, radius: 8 };
    gameData.pinball.leftPaddle = { x: 200, y: 750, width: 80, height: 15, active: false };
    gameData.pinball.rightPaddle = { x: 320, y: 750, width: 80, height: 15, active: false };
    gameData.pinball.score = 0;
    gameData.pinball.balls = 3;
    gameData.pinball.combo = 0;
    gameData.pinball.multiplier = 1;
    gameData.pinball.power = 0;
    gameData.pinball.gameStarted = false;
    gameData.pinball.gameRunning = false;
    gameData.pinball.chargingPower = false;
    
    // 載入最高分
    gameData.pinball.highScore = localStorage.getItem('pinballHighScore') || 0;
    
    // 創建更豐富的遊戲元素
    gameData.pinball.obstacles = [
        { x: 150, y: 200, width: 100, height: 20, points: 100, type: 'normal' },
        { x: 350, y: 200, width: 100, height: 20, points: 100, type: 'normal' },
        { x: 250, y: 150, width: 100, height: 20, points: 150, type: 'special' },
        { x: 50, y: 400, width: 20, height: 100, points: 50, type: 'normal' },
        { x: 530, y: 400, width: 20, height: 100, points: 50, type: 'normal' }
    ];
    
    gameData.pinball.bumpers = [
        { x: 150, y: 350, radius: 25, points: 200, type: 'bumper' },
        { x: 300, y: 280, radius: 25, points: 200, type: 'bumper' },
        { x: 450, y: 350, radius: 25, points: 200, type: 'bumper' }
    ];
    
    gameData.pinball.bonuses = [
        { x: 100, y: 250, radius: 15, points: 500, type: 'accelerator', active: true },
        { x: 300, y: 180, radius: 15, points: 1000, type: 'star', active: true },
        { x: 500, y: 250, radius: 15, points: 2000, type: 'diamond', active: true }
    ];
    
    renderPinballGame();
    updatePinballStats();
    setupPinballControls();
}

function renderPinballGame() {
    const ctx = gameData.pinball.ctx;
    const canvas = gameData.pinball.canvas;
    if (!ctx || !canvas) return;
    
    // 清空畫布
    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 繪製邊界
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
    
    // 繪製發射器軌道
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width - 30, canvas.height - 100);
    ctx.lineTo(canvas.width - 30, canvas.height - 20);
    ctx.stroke();
    
    // 繪製障礙物
    gameData.pinball.obstacles.forEach(obstacle => {
        if (obstacle.type === 'special') {
            ctx.fillStyle = '#ff6b6b';
            ctx.shadowColor = '#ff6b6b';
            ctx.shadowBlur = 10;
        } else {
            ctx.fillStyle = '#888';
            ctx.shadowBlur = 0;
        }
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
    
    // 繪製撞球器
    gameData.pinball.bumpers.forEach(bumper => {
        ctx.fillStyle = '#4ecdc4';
        ctx.shadowColor = '#4ecdc4';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(bumper.x, bumper.y, bumper.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 繪製撞球器內圈
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(bumper.x, bumper.y, bumper.radius - 8, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // 繪製獎勵道具
    gameData.pinball.bonuses.forEach(bonus => {
        if (!bonus.active) return;
        
        let symbol, color;
        switch(bonus.type) {
            case 'accelerator': symbol = '🔥'; color = '#ff4444'; break;
            case 'star': symbol = '⭐'; color = '#ffdd44'; break;
            case 'diamond': symbol = '💎'; color = '#44ddff'; break;
        }
        
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(bonus.x, bonus.y, bonus.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 使用文字代替emoji以確保兼容性
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(symbol, bonus.x, bonus.y + 5);
    });
    
    // 繪製左右擋板
    const leftPaddle = gameData.pinball.leftPaddle;
    const rightPaddle = gameData.pinball.rightPaddle;
    
    ctx.fillStyle = leftPaddle.active ? '#45b7d1' : '#666';
    ctx.shadowColor = leftPaddle.active ? '#45b7d1' : '#666';
    ctx.shadowBlur = leftPaddle.active ? 10 : 0;
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    
    ctx.fillStyle = rightPaddle.active ? '#45b7d1' : '#666';
    ctx.shadowColor = rightPaddle.active ? '#45b7d1' : '#666';
    ctx.shadowBlur = rightPaddle.active ? 10 : 0;
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    
    // 繪製彈珠
    ctx.fillStyle = '#f9ca24';
    ctx.shadowColor = '#f9ca24';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(gameData.pinball.ball.x, gameData.pinball.ball.y, 
           gameData.pinball.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 重置陰影
    ctx.shadowBlur = 0;
}

function startPinballGame() {
    gameData.pinball.gameStarted = true;
    updateUI('launchBtn', 'disabled', false);
    updateUI('startBtn', 'disabled', true);
}

function launchPinball() {
    if (!gameData.pinball.gameStarted || gameData.pinball.gameRunning) return;
    
    gameData.pinball.gameRunning = true;
    gameData.pinball.ball.x = gameData.pinball.canvas.width - 30;
    gameData.pinball.ball.y = gameData.pinball.canvas.height - 50;
    
    // 根據力度設定發射速度
    const power = gameData.pinball.power / 100;
    gameData.pinball.ball.vx = -3 - power * 5;
    gameData.pinball.ball.vy = -8 - power * 8;
    
    gameData.pinball.power = 0;
    updatePowerMeter();
    updateUI('launchBtn', 'disabled', true);
    
    pinballGameLoop();
}

function pinballGameLoop() {
    if (!gameData.pinball.gameRunning) return;
    
    updatePinballPhysics();
    renderPinballGame();
    
    gameData.pinball.animationId = requestAnimationFrame(pinballGameLoop);
}

function updatePinballPhysics() {
    const ball = gameData.pinball.ball;
    const canvas = gameData.pinball.canvas;
    
    // 重力和阻力
    ball.vy += 0.3;
    ball.vx *= 0.995;
    ball.vy *= 0.995;
    
    // 更新位置
    ball.x += ball.vx;
    ball.y += ball.vy;
    
    // 邊界碰撞
    if (ball.x <= ball.radius + 5) {
        ball.vx = Math.abs(ball.vx) * 0.8;
        ball.x = ball.radius + 5;
    }
    if (ball.x >= canvas.width - ball.radius - 5) {
        ball.vx = -Math.abs(ball.vx) * 0.8;
        ball.x = canvas.width - ball.radius - 5;
    }
    if (ball.y <= ball.radius + 5) {
        ball.vy = Math.abs(ball.vy) * 0.8;
        ball.y = ball.radius + 5;
    }
    
    // 擋板碰撞
    checkPaddleCollision(gameData.pinball.leftPaddle);
    checkPaddleCollision(gameData.pinball.rightPaddle);
    
    // 撞球器碰撞
    gameData.pinball.bumpers.forEach(bumper => {
        const dx = ball.x - bumper.x;
        const dy = ball.y - bumper.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < ball.radius + bumper.radius) {
            const angle = Math.atan2(dy, dx);
            ball.vx = Math.cos(angle) * 12;
            ball.vy = Math.sin(angle) * 12;
            
            addScore(bumper.points);
            gameData.pinball.combo++;
            updateCombo();
        }
    });
    
    // 障礙物碰撞
    gameData.pinball.obstacles.forEach(obstacle => {
        if (ball.x + ball.radius > obstacle.x && 
            ball.x - ball.radius < obstacle.x + obstacle.width &&
            ball.y + ball.radius > obstacle.y && 
            ball.y - ball.radius < obstacle.y + obstacle.height) {
            
            ball.vy = -ball.vy * 0.8;
            addScore(obstacle.points);
        }
    });
    
    // 獎勵道具碰撞
    gameData.pinball.bonuses.forEach(bonus => {
        if (!bonus.active) return;
        
        const dx = ball.x - bonus.x;
        const dy = ball.y - bonus.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < ball.radius + bonus.radius) {
            bonus.active = false;
            addScore(bonus.points);
            gameData.pinball.combo += 2;
            updateCombo();
            
            // 3秒後重新激活
            setTimeout(() => { bonus.active = true; }, 3000);
        }
    });
    
    // 球掉落
    if (ball.y > canvas.height) {
        ballLost();
    }
}

function checkPaddleCollision(paddle) {
    const ball = gameData.pinball.ball;
    
    if (ball.x + ball.radius > paddle.x && 
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.y + ball.radius > paddle.y && 
        ball.y - ball.radius < paddle.y + paddle.height) {
        
        ball.vy = -Math.abs(ball.vy) * 1.1;
        const paddleCenter = paddle.x + paddle.width / 2;
        ball.vx += (ball.x - paddleCenter) * 0.3;
        
        // 限制速度
        const maxSpeed = 15;
        if (Math.abs(ball.vx) > maxSpeed) ball.vx = Math.sign(ball.vx) * maxSpeed;
        if (Math.abs(ball.vy) > maxSpeed) ball.vy = Math.sign(ball.vy) * maxSpeed;
    }
}

function addScore(points) {
    const multipliedPoints = points * gameData.pinball.multiplier;
    gameData.pinball.score += multipliedPoints;
    
    // 更新倍數
    if (gameData.pinball.combo > 5) {
        gameData.pinball.multiplier = Math.min(5, Math.floor(gameData.pinball.combo / 3));
    }
    
    updatePinballStats();
}

function updateCombo() {
    updateUI('comboValue', 'textContent', gameData.pinball.combo);
    updateUI('pinballMultiplier', 'textContent', gameData.pinball.multiplier + 'x');
    
    // 連擊歸零定時器
    clearTimeout(gameData.pinball.comboTimer);
    gameData.pinball.comboTimer = setTimeout(() => {
        gameData.pinball.combo = 0;
        gameData.pinball.multiplier = 1;
        updateUI('comboValue', 'textContent', 0);
        updateUI('pinballMultiplier', 'textContent', '1x');
    }, 2000);
}

function ballLost() {
    gameData.pinball.gameRunning = false;
    gameData.pinball.balls--;
    gameData.pinball.combo = 0;
    gameData.pinball.multiplier = 1;
    
    if (gameData.pinball.balls > 0) {
        // 重置球的位置
        gameData.pinball.ball = { x: 300, y: 700, vx: 0, vy: 0, radius: 8 };
        updateUI('launchBtn', 'disabled', false);
    } else {
        // 遊戲結束
        gameData.pinball.gameStarted = false;
        updateUI('startBtn', 'disabled', false);
        updateUI('launchBtn', 'disabled', true);
        
        // 更新最高分
        if (gameData.pinball.score > gameData.pinball.highScore) {
            gameData.pinball.highScore = gameData.pinball.score;
            localStorage.setItem('pinballHighScore', gameData.pinball.highScore);
        }
    }
    
    updatePinballStats();
    cancelAnimationFrame(gameData.pinball.animationId);
}

function setupPinballControls() {
    // 移除現有監聽器
    document.removeEventListener('keydown', pinballKeyHandler);
    document.removeEventListener('keyup', pinballKeyHandler);
    
    // 添加新監聽器
    document.addEventListener('keydown', pinballKeyHandler);
    document.addEventListener('keyup', pinballKeyHandler);
}

function pinballKeyHandler(e) {
    if (!gameData.pinball.gameStarted) return;
    
    const leftPaddle = gameData.pinball.leftPaddle;
    const rightPaddle = gameData.pinball.rightPaddle;
    const canvas = gameData.pinball.canvas;
    
    if (e.type === 'keydown') {
        gameData.pinball.keys[e.key] = true;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                leftPaddle.active = true;
                // 移動左擋板
                leftPaddle.x = Math.max(10, leftPaddle.x - 15);
                break;
            case 'ArrowRight':
                e.preventDefault();
                rightPaddle.active = true;
                // 移動右擋板
                rightPaddle.x = Math.min(canvas.width - rightPaddle.width - 10, rightPaddle.x + 15);
                break;
            case ' ':
                e.preventDefault();
                if (!gameData.pinball.gameRunning) {
                    chargePower();
                }
                break;
        }
        
        // 即時更新畫面
        if (gameData.pinball.gameRunning || gameData.pinball.gameStarted) {
            renderPinballGame();
        }
    } else if (e.type === 'keyup') {
        gameData.pinball.keys[e.key] = false;
        
        switch(e.key) {
            case 'ArrowLeft':
                leftPaddle.active = false;
                break;
            case 'ArrowRight':
                rightPaddle.active = false;
                break;
            case ' ':
                if (!gameData.pinball.gameRunning && gameData.pinball.chargingPower) {
                    gameData.pinball.chargingPower = false;
                    launchPinball();
                }
                break;
        }
        
        // 即時更新畫面
        if (gameData.pinball.gameRunning || gameData.pinball.gameStarted) {
            renderPinballGame();
        }
    }
}

function chargePower() {
    if (gameData.pinball.chargingPower) return;
    
    gameData.pinball.chargingPower = true;
    gameData.pinball.power = 0;
    
    const chargeInterval = setInterval(() => {
        if (!gameData.pinball.chargingPower) {
            clearInterval(chargeInterval);
            return;
        }
        
        gameData.pinball.power = Math.min(100, gameData.pinball.power + 2);
        updatePowerMeter();
        
        if (gameData.pinball.power >= 100) {
            gameData.pinball.chargingPower = false;
            clearInterval(chargeInterval);
            launchPinball();
        }
    }, 50);
}

function updatePowerMeter() {
    updateUI('powerFill', 'style.width', gameData.pinball.power + '%');
    updateUI('powerText', 'textContent', gameData.pinball.power + '%');
    
    const fill = document.getElementById('powerFill');
    if (fill) {
        if (gameData.pinball.power < 30) {
            fill.style.backgroundColor = '#28a745';
        } else if (gameData.pinball.power < 70) {
            fill.style.backgroundColor = '#ffc107';
        } else {
            fill.style.backgroundColor = '#dc3545';
        }
    }
}

function updatePinballStats() {
    updateUI('pinballScore', 'textContent', gameData.pinball.score);
    updateUI('pinballBalls', 'textContent', gameData.pinball.balls);
    updateUI('pinballHighScore', 'textContent', gameData.pinball.highScore);
    updateUI('pinballMultiplier', 'textContent', gameData.pinball.multiplier + 'x');
}

function resetPinballGame() {
    if (gameData.pinball.animationId) {
        cancelAnimationFrame(gameData.pinball.animationId);
    }
    initPinballGame();
    updateUI('startBtn', 'disabled', false);
    updateUI('launchBtn', 'disabled', true);
}

// 輔助函數：安全更新UI元素
function updateUI(elementId, property, value) {
    const element = document.getElementById(elementId);
    if (element) {
        if (property.includes('.')) {
            const props = property.split('.');
            let obj = element;
            for (let i = 0; i < props.length - 1; i++) {
                obj = obj[props[i]];
            }
            obj[props[props.length - 1]] = value;
        } else {
            element[property] = value;
        }
    }
}

// 添加簡化版麻將的輔助函數
function startGame() {
    startMahjongGame();
}

function drawTile() {
    drawMahjongTile();
}

// 確保所有函數都可以全域訪問
window.executeSpecialAction = executeSpecialAction;
window.executeAction = executeAction;
window.passAction = passAction;
window.startMahjongGame = startMahjongGame;
window.startGame = startGame;
window.drawTile = drawTile;

// ====== 五子棋遊戲 ======
function loadGomokuGame() {
    const gameHTML = `
        <div class="game-header">
            <h3><i class="fas fa-circle"></i> 五子棋</h3>
            <button class="btn btn-secondary btn-sm" onclick="showGameSelection()">
                <i class="fas fa-arrow-left"></i> 返回
            </button>
        </div>
        <div class="gomoku-game">
            <div class="game-info">
                <div class="current-player">當前玩家: <span id="currentPlayer">⚫</span></div>
                <div class="score">黑子: <span id="blackScore">0</span> | 白子: <span id="whiteScore">0</span></div>
                <button class="btn btn-primary btn-sm" onclick="resetGomoku()">重新開始</button>
            </div>
            <div class="gomoku-board" id="gomokuBoard"></div>
            <div class="game-message" id="gomokuMessage">點擊棋盤開始遊戲</div>
        </div>
    `;
    
    document.getElementById('gameContainer').innerHTML = gameHTML;
    initGomoku();
}

let gomokuBoard = [];
let currentPlayer = 'black';
let gomokuGameOver = false;

function initGomoku() {
    gomokuBoard = Array(15).fill(null).map(() => Array(15).fill(null));
    currentPlayer = 'black';
    gomokuGameOver = false;
    
    const board = document.getElementById('gomokuBoard');
    board.innerHTML = '';
    
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            const cell = document.createElement('div');
            cell.className = 'gomoku-cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => makeGomokuMove(i, j));
            board.appendChild(cell);
        }
    }
    
    document.getElementById('currentPlayer').textContent = currentPlayer === 'black' ? '⚫' : '⚪';
    document.getElementById('gomokuMessage').textContent = '點擊棋盤開始遊戲';
}

function makeGomokuMove(row, col) {
    if (gomokuGameOver || gomokuBoard[row][col]) return;
    
    gomokuBoard[row][col] = currentPlayer;
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.textContent = currentPlayer === 'black' ? '⚫' : '⚪';
    cell.classList.add(currentPlayer);
    
    if (checkGomokuWin(row, col)) {
        gomokuGameOver = true;
        document.getElementById('gomokuMessage').textContent = `${currentPlayer === 'black' ? '黑子' : '白子'}獲勝！`;
        updateGomokuScore();
        return;
    }
    
    if (checkGomokuDraw()) {
        gomokuGameOver = true;
        document.getElementById('gomokuMessage').textContent = '平局！';
        return;
    }
    
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    document.getElementById('currentPlayer').textContent = currentPlayer === 'black' ? '⚫' : '⚪';
    
    if (currentPlayer === 'white') {
        setTimeout(makeGomokuAIMove, 500);
    }
}

function makeGomokuAIMove() {
    if (gomokuGameOver) return;
    
    const move = findBestGomokuMove();
    if (move) {
        makeGomokuMove(move.row, move.col);
    }
}

function findBestGomokuMove() {
    // 簡單AI：找最佳位置
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            if (!gomokuBoard[i][j]) {
                // 檢查是否能獲勝
                gomokuBoard[i][j] = 'white';
                if (checkGomokuWin(i, j)) {
                    gomokuBoard[i][j] = null;
                    return { row: i, col: j };
                }
                gomokuBoard[i][j] = null;
                
                // 檢查是否需要阻止對手獲勝
                gomokuBoard[i][j] = 'black';
                if (checkGomokuWin(i, j)) {
                    gomokuBoard[i][j] = null;
                    return { row: i, col: j };
                }
                gomokuBoard[i][j] = null;
            }
        }
    }
    
    // 隨機選擇空位
    const emptyCells = [];
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            if (!gomokuBoard[i][j]) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }
    
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function checkGomokuWin(row, col) {
    const directions = [
        [0, 1], [1, 0], [1, 1], [1, -1]
    ];
    
    for (const [dx, dy] of directions) {
        let count = 1;
        
        // 正方向
        let r = row + dx, c = col + dy;
        while (r >= 0 && r < 15 && c >= 0 && c < 15 && gomokuBoard[r][c] === currentPlayer) {
            count++;
            r += dx;
            c += dy;
        }
        
        // 反方向
        r = row - dx;
        c = col - dy;
        while (r >= 0 && r < 15 && c >= 0 && c < 15 && gomokuBoard[r][c] === currentPlayer) {
            count++;
            r -= dx;
            c -= dy;
        }
        
        if (count >= 5) return true;
    }
    
    return false;
}

function checkGomokuDraw() {
    return gomokuBoard.every(row => row.every(cell => cell !== null));
}

function updateGomokuScore() {
    const scoreElement = document.getElementById(currentPlayer === 'black' ? 'blackScore' : 'whiteScore');
    scoreElement.textContent = parseInt(scoreElement.textContent) + 1;
}

function resetGomoku() {
    initGomoku();
}

// ====== 象棋遊戲 ======
function loadChessGame() {
    const gameHTML = `
        <div class="game-header">
            <h3><i class="fas fa-chess"></i> 象棋</h3>
            <button class="btn btn-secondary btn-sm" onclick="showGameSelection()">
                <i class="fas fa-arrow-left"></i> 返回
            </button>
        </div>
        <div class="chess-game">
            <div class="game-info">
                <div class="current-player">當前玩家: <span id="chessCurrentPlayer">紅方</span></div>
                <div class="score">紅方: <span id="redScore">0</span> | 黑方: <span id="blackChessScore">0</span></div>
                <button class="btn btn-primary btn-sm" onclick="resetChess()">重新開始</button>
            </div>
            <div class="chess-board" id="chessBoard"></div>
            <div class="game-message" id="chessMessage">點擊棋子開始遊戲</div>
        </div>
    `;
    
    document.getElementById('gameContainer').innerHTML = gameHTML;
    initChess();
}

let chessBoard = [];
let chessCurrentPlayer = 'red';
let selectedPiece = null;
let chessGameOver = false;

function initChess() {
    // 初始化象棋棋盤
    chessBoard = [
        ['車','馬','象','仕','將','仕','象','馬','車'],
        ['','','','','','','','',''],
        ['','砲','','','','','','砲',''],
        ['兵','','兵','','兵','','兵','','兵'],
        ['','','','','','','','',''],
        ['','','','','','','','',''],
        ['卒','','卒','','卒','','卒','','卒'],
        ['','炮','','','','','','炮',''],
        ['','','','','','','','',''],
        ['俥','傌','相','士','帥','士','相','傌','俥']
    ];
    
    chessCurrentPlayer = 'red';
    selectedPiece = null;
    chessGameOver = false;
    
    const board = document.getElementById('chessBoard');
    board.innerHTML = '';
    
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'chess-cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => handleChessMove(i, j));
            
            if (chessBoard[i][j]) {
                cell.textContent = chessBoard[i][j];
                cell.classList.add(i < 5 ? 'black-piece' : 'red-piece');
            }
            
            board.appendChild(cell);
        }
    }
    
    document.getElementById('chessCurrentPlayer').textContent = '紅方';
    document.getElementById('chessMessage').textContent = '點擊棋子開始遊戲';
}

function handleChessMove(row, col) {
    if (chessGameOver) return;
    
    if (selectedPiece) {
        // 移動棋子
        if (isValidChessMove(selectedPiece.row, selectedPiece.col, row, col)) {
            const piece = chessBoard[selectedPiece.row][selectedPiece.col];
            chessBoard[selectedPiece.row][selectedPiece.col] = '';
            chessBoard[row][col] = piece;
            
            updateChessDisplay();
            
            if (checkChessWin()) {
                chessGameOver = true;
                document.getElementById('chessMessage').textContent = `${chessCurrentPlayer === 'red' ? '紅方' : '黑方'}獲勝！`;
                updateChessScore();
                return;
            }
            
            chessCurrentPlayer = chessCurrentPlayer === 'red' ? 'black' : 'red';
            document.getElementById('chessCurrentPlayer').textContent = chessCurrentPlayer === 'red' ? '紅方' : '黑方';
            
            if (chessCurrentPlayer === 'black') {
                setTimeout(makeChessAIMove, 500);
            }
        }
        
        clearChessSelection();
    } else {
        // 選擇棋子
        if (chessBoard[row][col] && isPlayerPiece(chessBoard[row][col], chessCurrentPlayer)) {
            selectedPiece = { row, col };
            document.querySelector(`[data-row="${row}"][data-col="${col}"]`).classList.add('selected');
        }
    }
}

function isPlayerPiece(piece, player) {
    const redPieces = ['俥','傌','相','士','帥','炮','卒'];
    const blackPieces = ['車','馬','象','仕','將','砲','兵'];
    
    if (player === 'red') {
        return redPieces.includes(piece);
    } else {
        return blackPieces.includes(piece);
    }
}

function isValidChessMove(fromRow, fromCol, toRow, toCol) {
    // 簡化的移動規則檢查
    if (toRow < 0 || toRow >= 10 || toCol < 0 || toCol >= 9) return false;
    if (fromRow === toRow && fromCol === toCol) return false;
    
    const piece = chessBoard[fromRow][fromCol];
    const targetPiece = chessBoard[toRow][toCol];
    
    // 不能吃自己的棋子
    if (targetPiece && isPlayerPiece(targetPiece, chessCurrentPlayer)) return false;
    
    return true; // 簡化規則
}

function makeChessAIMove() {
    if (chessGameOver) return;
    
    const move = findBestChessMove();
    if (move) {
        handleChessMove(move.fromRow, move.fromCol);
        setTimeout(() => handleChessMove(move.toRow, move.toCol), 100);
    }
}

function findBestChessMove() {
    // 簡單AI：隨機移動
    const pieces = [];
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 9; j++) {
            if (chessBoard[i][j] && isPlayerPiece(chessBoard[i][j], 'black')) {
                pieces.push({ row: i, col: j });
            }
        }
    }
    
    if (pieces.length === 0) return null;
    
    const piece = pieces[Math.floor(Math.random() * pieces.length)];
    const moves = [];
    
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 9; j++) {
            if (isValidChessMove(piece.row, piece.col, i, j)) {
                moves.push({ fromRow: piece.row, fromCol: piece.col, toRow: i, toCol: j });
            }
        }
    }
    
    return moves.length > 0 ? moves[Math.floor(Math.random() * moves.length)] : null;
}

function updateChessDisplay() {
    const board = document.getElementById('chessBoard');
    board.innerHTML = '';
    
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'chess-cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => handleChessMove(i, j));
            
            if (chessBoard[i][j]) {
                cell.textContent = chessBoard[i][j];
                cell.classList.add(i < 5 ? 'black-piece' : 'red-piece');
            }
            
            board.appendChild(cell);
        }
    }
}

function clearChessSelection() {
    selectedPiece = null;
    document.querySelectorAll('.chess-cell').forEach(cell => {
        cell.classList.remove('selected');
    });
}

function checkChessWin() {
    // 檢查將/帥是否被吃
    let redKing = false, blackKing = false;
    
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 9; j++) {
            if (chessBoard[i][j] === '帥') redKing = true;
            if (chessBoard[i][j] === '將') blackKing = true;
        }
    }
    
    return !redKing || !blackKing;
}

function updateChessScore() {
    const scoreElement = document.getElementById(chessCurrentPlayer === 'red' ? 'redScore' : 'blackChessScore');
    scoreElement.textContent = parseInt(scoreElement.textContent) + 1;
}

function resetChess() {
    initChess();
}

// ====== 21點撲克遊戲 ======
function loadPokerGame() {
    const gameHTML = `
        <div class="game-header">
            <h3><i class="fas fa-heart"></i> 21點撲克</h3>
            <button class="btn btn-secondary btn-sm" onclick="showGameSelection()">
                <i class="fas fa-arrow-left"></i> 返回
            </button>
        </div>
        <div class="poker-game">
            <div class="game-info">
                <div class="score">勝利: <span id="pokerWins">0</span> | 失敗: <span id="pokerLosses">0</span></div>
                <div class="game-controls">
                    <button class="btn btn-success btn-sm" onclick="hitCard()" id="hitBtn">要牌</button>
                    <button class="btn btn-warning btn-sm" onclick="stand()" id="standBtn">停牌</button>
                    <button class="btn btn-primary btn-sm" onclick="newPokerGame()">新遊戲</button>
                </div>
            </div>
            <div class="poker-table">
                <div class="dealer-area">
                    <h4>莊家 (點數: <span id="dealerPoints">0</span>)</h4>
                    <div class="cards" id="dealerCards"></div>
                </div>
                <div class="player-area">
                    <h4>玩家 (點數: <span id="playerPoints">0</span>)</h4>
                    <div class="cards" id="playerCards"></div>
                </div>
            </div>
            <div class="game-message" id="pokerMessage">點擊新遊戲開始</div>
        </div>
    `;
    
    document.getElementById('gameContainer').innerHTML = gameHTML;
    initPoker();
}

let pokerDeck = [];
let playerCards = [];
let dealerCards = [];
let pokerGameActive = false;

function initPoker() {
    newPokerGame();
}

function createPokerDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = [];
    
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ suit, rank });
        }
    }
    
    // 洗牌
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    return deck;
}

function newPokerGame() {
    pokerDeck = createPokerDeck();
    playerCards = [];
    dealerCards = [];
    pokerGameActive = true;
    
    // 發初始牌
    playerCards.push(pokerDeck.pop());
    dealerCards.push(pokerDeck.pop());
    playerCards.push(pokerDeck.pop());
    dealerCards.push(pokerDeck.pop());
    
    updatePokerDisplay();
    document.getElementById('pokerMessage').textContent = '選擇要牌或停牌';
    document.getElementById('hitBtn').disabled = false;
    document.getElementById('standBtn').disabled = false;
}

function hitCard() {
    if (!pokerGameActive) return;
    
    playerCards.push(pokerDeck.pop());
    updatePokerDisplay();
    
    const playerPoints = calculatePoints(playerCards);
    if (playerPoints > 21) {
        endPokerGame('爆牌！莊家獲勝');
    } else if (playerPoints === 21) {
        stand();
    }
}

function stand() {
    if (!pokerGameActive) return;
    
    // 莊家抽牌
    while (calculatePoints(dealerCards) < 17) {
        dealerCards.push(pokerDeck.pop());
    }
    
    updatePokerDisplay();
    
    const playerPoints = calculatePoints(playerCards);
    const dealerPoints = calculatePoints(dealerCards);
    
    if (dealerPoints > 21) {
        endPokerGame('莊家爆牌！玩家獲勝');
    } else if (playerPoints > dealerPoints) {
        endPokerGame('玩家獲勝！');
    } else if (dealerPoints > playerPoints) {
        endPokerGame('莊家獲勝！');
    } else {
        endPokerGame('平局！');
    }
}

function calculatePoints(cards) {
    let points = 0;
    let aces = 0;
    
    for (const card of cards) {
        if (card.rank === 'A') {
            aces++;
            points += 11;
        } else if (['J', 'Q', 'K'].includes(card.rank)) {
            points += 10;
        } else {
            points += parseInt(card.rank);
        }
    }
    
    // 處理A的點數
    while (points > 21 && aces > 0) {
        points -= 10;
        aces--;
    }
    
    return points;
}

function updatePokerDisplay() {
    const playerCardsDiv = document.getElementById('playerCards');
    const dealerCardsDiv = document.getElementById('dealerCards');
    
    playerCardsDiv.innerHTML = '';
    dealerCardsDiv.innerHTML = '';
    
    playerCards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'playing-card';
        cardDiv.textContent = card.rank + card.suit;
        if (card.suit === '♥' || card.suit === '♦') {
            cardDiv.classList.add('red-card');
        }
        playerCardsDiv.appendChild(cardDiv);
    });
    
    dealerCards.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'playing-card';
        if (index === 0 && pokerGameActive) {
            cardDiv.textContent = '🂠';
            cardDiv.classList.add('hidden-card');
        } else {
            cardDiv.textContent = card.rank + card.suit;
            if (card.suit === '♥' || card.suit === '♦') {
                cardDiv.classList.add('red-card');
            }
        }
        dealerCardsDiv.appendChild(cardDiv);
    });
    
    document.getElementById('playerPoints').textContent = calculatePoints(playerCards);
    document.getElementById('dealerPoints').textContent = pokerGameActive ? '?' : calculatePoints(dealerCards);
}

function endPokerGame(message) {
    pokerGameActive = false;
    document.getElementById('pokerMessage').textContent = message;
    document.getElementById('hitBtn').disabled = true;
    document.getElementById('standBtn').disabled = true;
    
    updatePokerDisplay();
    
    // 更新分數
    if (message.includes('玩家獲勝')) {
        const winsElement = document.getElementById('pokerWins');
        winsElement.textContent = parseInt(winsElement.textContent) + 1;
    } else if (message.includes('莊家獲勝') || message.includes('爆牌')) {
        const lossesElement = document.getElementById('pokerLosses');
        lossesElement.textContent = parseInt(lossesElement.textContent) + 1;
    }
}

// ====== 數獨遊戲 ======
function loadSudokuGame() {
    const gameHTML = `
        <div class="game-header">
            <h3><i class="fas fa-th"></i> 數獨</h3>
            <button class="btn btn-secondary btn-sm" onclick="showGameSelection()">
                <i class="fas fa-arrow-left"></i> 返回
            </button>
        </div>
        <div class="sudoku-game">
            <div class="game-info">
                <div class="difficulty">
                    <label>難度:</label>
                    <select id="sudokuDifficulty" onchange="generateSudoku()">
                        <option value="easy">簡單</option>
                        <option value="medium">中等</option>
                        <option value="hard">困難</option>
                    </select>
                </div>
                <div class="game-controls">
                    <button class="btn btn-primary btn-sm" onclick="generateSudoku()">新遊戲</button>
                    <button class="btn btn-success btn-sm" onclick="checkSudoku()">檢查</button>
                    <button class="btn btn-warning btn-sm" onclick="solveSudoku()">提示</button>
                </div>
            </div>
            <div class="sudoku-board" id="sudokuBoard"></div>
            <div class="game-message" id="sudokuMessage">選擇難度開始新遊戲</div>
        </div>
    `;
    
    document.getElementById('gameContainer').innerHTML = gameHTML;
    initSudoku();
}

let sudokuBoard = [];
let sudokuSolution = [];

function initSudoku() {
    generateSudoku();
}

function generateSudoku() {
    // 生成完整的數獨解答
    sudokuSolution = generateCompleteSudoku();
    sudokuBoard = JSON.parse(JSON.stringify(sudokuSolution));
    
    // 根據難度移除數字
    const difficulty = document.getElementById('sudokuDifficulty').value;
    const removeCount = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 60;
    
    for (let i = 0; i < removeCount; i++) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        sudokuBoard[row][col] = 0;
    }
    
    displaySudoku();
    document.getElementById('sudokuMessage').textContent = '填入數字完成數獨';
}

function generateCompleteSudoku() {
    const board = Array(9).fill(null).map(() => Array(9).fill(0));
    
    // 簡化的數獨生成
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    // 填入第一行
    for (let i = 0; i < 9; i++) {
        board[0][i] = nums[i];
    }
    
    // 簡單的數獨生成算法
    if (solveSudokuRecursive(board, 1, 0)) {
        return board;
    }
    
    return board;
}

function solveSudokuRecursive(board, row, col) {
    if (row === 9) return true;
    if (col === 9) return solveSudokuRecursive(board, row + 1, 0);
    if (board[row][col] !== 0) return solveSudokuRecursive(board, row, col + 1);
    
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(nums);
    
    for (const num of nums) {
        if (isValidSudokuMove(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudokuRecursive(board, row, col + 1)) {
                return true;
            }
            board[row][col] = 0;
        }
    }
    
    return false;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function isValidSudokuMove(board, row, col, num) {
    // 檢查行
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) return false;
    }
    
    // 檢查列
    for (let i = 0; i < 9; i++) {
        if (board[i][col] === num) return false;
    }
    
    // 檢查3x3格子
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
        for (let j = boxCol; j < boxCol + 3; j++) {
            if (board[i][j] === num) return false;
        }
    }
    
    return true;
}

function displaySudoku() {
    const board = document.getElementById('sudokuBoard');
    board.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('input');
            cell.type = 'number';
            cell.min = '1';
            cell.max = '9';
            cell.className = 'sudoku-cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            if (sudokuBoard[i][j] !== 0) {
                cell.value = sudokuBoard[i][j];
                cell.readOnly = true;
                cell.classList.add('given');
            }
            
            cell.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                if (value >= 1 && value <= 9) {
                    sudokuBoard[i][j] = value;
                } else {
                    sudokuBoard[i][j] = 0;
                    e.target.value = '';
                }
            });
            
            board.appendChild(cell);
        }
    }
}

function checkSudoku() {
    let isComplete = true;
    let isValid = true;
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (sudokuBoard[i][j] === 0) {
                isComplete = false;
            } else if (!isValidSudokuMove(sudokuBoard, i, j, sudokuBoard[i][j])) {
                isValid = false;
            }
        }
    }
    
    if (isComplete && isValid) {
        document.getElementById('sudokuMessage').textContent = '恭喜！數獨完成！';
    } else if (!isValid) {
        document.getElementById('sudokuMessage').textContent = '有錯誤，請檢查';
    } else {
        document.getElementById('sudokuMessage').textContent = '還沒完成，繼續加油！';
    }
}

function solveSudoku() {
    // 提供一個提示
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (sudokuBoard[i][j] === 0) {
                sudokuBoard[i][j] = sudokuSolution[i][j];
                displaySudoku();
                document.getElementById('sudokuMessage').textContent = '提示：已填入一個數字';
                return;
            }
        }
    }
}

// ====== 塔防遊戲 ======
function loadTowerDefenseGame() {
    const gameHTML = `
        <div class="game-header">
            <h3><i class="fas fa-chess-rook"></i> 塔防</h3>
            <button class="btn btn-secondary btn-sm" onclick="showGameSelection()">
                <i class="fas fa-arrow-left"></i> 返回
            </button>
        </div>
        <div class="tower-defense-game">
            <div class="game-info">
                <div class="game-stats">
                    <span>生命: <span id="lives">10</span></span>
                    <span>金幣: <span id="gold">100</span></span>
                    <span>波次: <span id="wave">1</span></span>
                    <span>分數: <span id="tdScore">0</span></span>
                </div>
                <div class="game-controls">
                    <button class="btn btn-primary btn-sm" onclick="startWave()">開始波次</button>
                    <button class="btn btn-success btn-sm" onclick="buildTower()">建造塔 (20金)</button>
                    <button class="btn btn-warning btn-sm" onclick="upgradeTower()">升級塔 (30金)</button>
                </div>
            </div>
            <canvas id="towerDefenseCanvas" width="600" height="400"></canvas>
            <div class="game-message" id="towerDefenseMessage">點擊建造塔防禦敵人</div>
        </div>
    `;
    
    document.getElementById('gameContainer').innerHTML = gameHTML;
    initTowerDefense();
}

let tdCanvas, tdCtx;
let towers = [];
let enemies = [];
let projectiles = [];
let gameStats = { lives: 10, gold: 100, wave: 1, score: 0 };
let waveInProgress = false;
let selectedTower = null;

function initTowerDefense() {
    tdCanvas = document.getElementById('towerDefenseCanvas');
    tdCtx = tdCanvas.getContext('2d');
    
    tdCanvas.addEventListener('click', handleTowerDefenseClick);
    
    // 初始化遊戲
    towers = [];
    enemies = [];
    projectiles = [];
    gameStats = { lives: 10, gold: 100, wave: 1, score: 0 };
    waveInProgress = false;
    selectedTower = null;
    
    updateTowerDefenseDisplay();
    gameLoop();
}

function handleTowerDefenseClick(e) {
    const rect = tdCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 檢查是否點擊已有的塔
    for (let tower of towers) {
        const distance = Math.sqrt((x - tower.x) ** 2 + (y - tower.y) ** 2);
        if (distance < 20) {
            selectedTower = tower;
            return;
        }
    }
    
    selectedTower = null;
}

function buildTower() {
    if (gameStats.gold < 20) {
        document.getElementById('towerDefenseMessage').textContent = '金幣不足！';
        return;
    }
    
    // 隨機位置建塔
    const x = Math.random() * (tdCanvas.width - 40) + 20;
    const y = Math.random() * (tdCanvas.height - 40) + 20;
    
    towers.push({
        x: x,
        y: y,
        level: 1,
        damage: 10,
        range: 80,
        fireRate: 1000,
        lastFire: 0
    });
    
    gameStats.gold -= 20;
    updateTowerDefenseDisplay();
    document.getElementById('towerDefenseMessage').textContent = '建造了一座塔';
}

function upgradeTower() {
    if (!selectedTower) {
        document.getElementById('towerDefenseMessage').textContent = '請先選擇一座塔';
        return;
    }
    
    if (gameStats.gold < 30) {
        document.getElementById('towerDefenseMessage').textContent = '金幣不足！';
        return;
    }
    
    selectedTower.level++;
    selectedTower.damage += 5;
    selectedTower.range += 10;
    selectedTower.fireRate -= 100;
    
    gameStats.gold -= 30;
    updateTowerDefenseDisplay();
    document.getElementById('towerDefenseMessage').textContent = '塔升級成功！';
}

function startWave() {
    if (waveInProgress) return;
    
    waveInProgress = true;
    const enemyCount = 5 + gameStats.wave * 2;
    
    for (let i = 0; i < enemyCount; i++) {
        setTimeout(() => {
            enemies.push({
                x: -20,
                y: Math.random() * tdCanvas.height,
                health: 20 + gameStats.wave * 10,
                maxHealth: 20 + gameStats.wave * 10,
                speed: 1 + gameStats.wave * 0.2,
                reward: 5 + gameStats.wave
            });
        }, i * 500);
    }
    
    setTimeout(() => {
        waveInProgress = false;
        gameStats.wave++;
        updateTowerDefenseDisplay();
    }, enemyCount * 500 + 5000);
}

function updateTowerDefenseDisplay() {
    document.getElementById('lives').textContent = gameStats.lives;
    document.getElementById('gold').textContent = gameStats.gold;
    document.getElementById('wave').textContent = gameStats.wave;
    document.getElementById('tdScore').textContent = gameStats.score;
}

function gameLoop() {
    // 清除畫布
    tdCtx.clearRect(0, 0, tdCanvas.width, tdCanvas.height);
    
    // 繪製背景
    tdCtx.fillStyle = '#228B22';
    tdCtx.fillRect(0, 0, tdCanvas.width, tdCanvas.height);
    
    // 更新敵人
    enemies.forEach((enemy, enemyIndex) => {
        enemy.x += enemy.speed;
        
        // 敵人到達終點
        if (enemy.x > tdCanvas.width) {
            enemies.splice(enemyIndex, 1);
            gameStats.lives--;
            if (gameStats.lives <= 0) {
                document.getElementById('towerDefenseMessage').textContent = '遊戲結束！';
                return;
            }
        }
        
        // 繪製敵人
        tdCtx.fillStyle = '#FF4500';
        tdCtx.fillRect(enemy.x - 10, enemy.y - 10, 20, 20);
        
        // 繪製血條
        tdCtx.fillStyle = '#FF0000';
        tdCtx.fillRect(enemy.x - 10, enemy.y - 15, 20, 3);
        tdCtx.fillStyle = '#00FF00';
        tdCtx.fillRect(enemy.x - 10, enemy.y - 15, 20 * (enemy.health / enemy.maxHealth), 3);
    });
    
    // 更新塔
    towers.forEach(tower => {
        const now = Date.now();
        
        // 尋找範圍內的敵人
        const target = enemies.find(enemy => {
            const distance = Math.sqrt((enemy.x - tower.x) ** 2 + (enemy.y - tower.y) ** 2);
            return distance <= tower.range;
        });
        
        // 開火
        if (target && now - tower.lastFire > tower.fireRate) {
            projectiles.push({
                x: tower.x,
                y: tower.y,
                targetX: target.x,
                targetY: target.y,
                damage: tower.damage,
                speed: 5
            });
            tower.lastFire = now;
        }
        
        // 繪製塔
        tdCtx.fillStyle = tower === selectedTower ? '#FFD700' : '#8B4513';
        tdCtx.fillRect(tower.x - 15, tower.y - 15, 30, 30);
        
        // 繪製等級
        tdCtx.fillStyle = '#FFFFFF';
        tdCtx.font = '12px Arial';
        tdCtx.textAlign = 'center';
        tdCtx.fillText(tower.level, tower.x, tower.y + 4);
        
        // 繪製範圍（僅選中的塔）
        if (tower === selectedTower) {
            tdCtx.strokeStyle = '#FFFFFF';
            tdCtx.beginPath();
            tdCtx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
            tdCtx.stroke();
        }
    });
    
    // 更新炮彈
    projectiles.forEach((projectile, projectileIndex) => {
        const dx = projectile.targetX - projectile.x;
        const dy = projectile.targetY - projectile.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < projectile.speed) {
            // 炮彈到達目標
            const target = enemies.find(enemy => 
                Math.abs(enemy.x - projectile.targetX) < 15 && 
                Math.abs(enemy.y - projectile.targetY) < 15
            );
            
            if (target) {
                target.health -= projectile.damage;
                if (target.health <= 0) {
                    const enemyIndex = enemies.indexOf(target);
                    enemies.splice(enemyIndex, 1);
                    gameStats.gold += target.reward;
                    gameStats.score += target.reward * 10;
                }
            }
            
            projectiles.splice(projectileIndex, 1);
        } else {
            // 移動炮彈
            projectile.x += (dx / distance) * projectile.speed;
            projectile.y += (dy / distance) * projectile.speed;
        }
        
        // 繪製炮彈
        tdCtx.fillStyle = '#FFFF00';
        tdCtx.beginPath();
        tdCtx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2);
        tdCtx.fill();
    });
    
    updateTowerDefenseDisplay();
    requestAnimationFrame(gameLoop);
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('簡化版遊戲系統已載入');
    showGameSelection();
});