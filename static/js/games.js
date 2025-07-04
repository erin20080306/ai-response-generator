/**
 * 小遊戲模組
 * 包含多種互動小遊戲
 */
class GameCenter {
    constructor(app) {
        this.app = app;
        this.currentGame = null;
        this.gameContainer = null;
        this.gameHistory = {};
        
        this.init();
    }

    init() {
        this.createGamePanel();
        this.setupEventListeners();
    }

    createGamePanel() {
        // 在工具面板中添加遊戲區域
        const toolsPanel = document.getElementById('tools-panel');
        if (toolsPanel) {
            const gameSection = document.createElement('div');
            gameSection.innerHTML = `
                <div class="row mt-4">
                    <div class="col-12">
                        <h5 class="mb-4"><i class="fas fa-gamepad me-2"></i>小遊戲</h5>
                        <div class="row">
                            <!-- 猜數字 -->
                            <div class="col-md-6 col-lg-4 mb-4">
                                <div class="card tool-card">
                                    <div class="card-body text-center">
                                        <i class="fas fa-dice fa-2x mb-3"></i>
                                        <h5>猜數字</h5>
                                        <p class="text-muted">猜出1-100的神秘數字</p>
                                        <button type="button" class="btn btn-primary" id="guessNumberBtn">
                                            開始遊戲
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 記憶卡片 -->
                            <div class="col-md-6 col-lg-4 mb-4">
                                <div class="card tool-card">
                                    <div class="card-body text-center">
                                        <i class="fas fa-clone fa-2x mb-3"></i>
                                        <h5>記憶卡片</h5>
                                        <p class="text-muted">翻卡配對記憶遊戲</p>
                                        <button type="button" class="btn btn-primary" id="memoryCardBtn">
                                            開始遊戲
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 貪吃蛇 -->
                            <div class="col-md-6 col-lg-4 mb-4">
                                <div class="card tool-card">
                                    <div class="card-body text-center">
                                        <i class="fas fa-grip-lines fa-2x mb-3"></i>
                                        <h5>貪吃蛇</h5>
                                        <p class="text-muted">經典貪吃蛇遊戲</p>
                                        <button type="button" class="btn btn-primary" id="snakeGameBtn">
                                            開始遊戲
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 井字遊戲 -->
                            <div class="col-md-6 col-lg-4 mb-4">
                                <div class="card tool-card">
                                    <div class="card-body text-center">
                                        <i class="fas fa-hashtag fa-2x mb-3"></i>
                                        <h5>井字遊戲</h5>
                                        <p class="text-muted">與AI對戰井字遊戲</p>
                                        <button type="button" class="btn btn-primary" id="ticTacToeBtn">
                                            開始遊戲
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 2048 -->
                            <div class="col-md-6 col-lg-4 mb-4">
                                <div class="card tool-card">
                                    <div class="card-body text-center">
                                        <i class="fas fa-th fa-2x mb-3"></i>
                                        <h5>2048</h5>
                                        <p class="text-muted">數字合併益智遊戲</p>
                                        <button type="button" class="btn btn-primary" id="game2048Btn">
                                            開始遊戲
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 打字練習 -->
                            <div class="col-md-6 col-lg-4 mb-4">
                                <div class="card tool-card">
                                    <div class="card-body text-center">
                                        <i class="fas fa-keyboard fa-2x mb-3"></i>
                                        <h5>打字練習</h5>
                                        <p class="text-muted">提升打字速度和準確度</p>
                                        <button type="button" class="btn btn-primary" id="typingGameBtn">
                                            開始遊戲
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 俄羅斯方塊 -->
                            <div class="col-md-6 col-lg-4 mb-4">
                                <div class="card tool-card">
                                    <div class="card-body text-center">
                                        <i class="fas fa-cubes fa-2x mb-3"></i>
                                        <h5>俄羅斯方塊</h5>
                                        <p class="text-muted">經典俄羅斯方塊遊戲</p>
                                        <button type="button" class="btn btn-primary" id="tetrisBtn">
                                            開始遊戲
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 麻將 -->
                            <div class="col-md-6 col-lg-4 mb-4">
                                <div class="card tool-card">
                                    <div class="card-body text-center">
                                        <i class="fas fa-chess-board fa-2x mb-3"></i>
                                        <h5>麻將</h5>
                                        <p class="text-muted">經典麻將配對遊戲</p>
                                        <button type="button" class="btn btn-primary" id="mahjongBtn">
                                            開始遊戲
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 牧場物語 -->
                            <div class="col-md-6 col-lg-4 mb-4">
                                <div class="card tool-card">
                                    <div class="card-body text-center">
                                        <i class="fas fa-seedling fa-2x mb-3"></i>
                                        <h5>牧場物語</h5>
                                        <p class="text-muted">種植作物、餵養動物 (可與AI互動10次)</p>
                                        <button type="button" class="btn btn-primary" id="farmGameBtn">
                                            開始遊戲
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            const panelContainer = toolsPanel.querySelector('.panel-container');
            if (panelContainer) {
                panelContainer.appendChild(gameSection);
            }
        }
    }

    setupEventListeners() {
        document.getElementById('guessNumberBtn')?.addEventListener('click', () => this.startGuessNumber());
        document.getElementById('memoryCardBtn')?.addEventListener('click', () => this.startMemoryCard());
        document.getElementById('snakeGameBtn')?.addEventListener('click', () => this.startSnakeGame());
        document.getElementById('ticTacToeBtn')?.addEventListener('click', () => this.startTicTacToe());
        document.getElementById('game2048Btn')?.addEventListener('click', () => this.start2048());
        document.getElementById('typingGameBtn')?.addEventListener('click', () => this.startTypingGame());
        document.getElementById('tetrisBtn')?.addEventListener('click', () => this.startTetris());
        document.getElementById('mahjongBtn')?.addEventListener('click', () => this.startMahjong());
        document.getElementById('farmGameBtn')?.addEventListener('click', () => this.startFarmGame());
    }

    createGameModal(title, content) {
        const modalId = 'gameModal';
        let modal = document.getElementById(modalId);
        
        if (modal) {
            modal.remove();
        }

        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                        <button type="button" class="btn btn-primary" id="restartGameBtn">重新開始</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        return modal;
    }

    // 猜數字遊戲
    startGuessNumber() {
        const targetNumber = Math.floor(Math.random() * 100) + 1;
        let attempts = 0;
        let gameWon = false;

        const content = `
            <div class="text-center">
                <h4>猜數字遊戲</h4>
                <p>我想了一個1到100之間的數字，你能猜出來嗎？</p>
                <div class="mb-3">
                    <input type="number" class="form-control text-center" id="guessInput" placeholder="輸入你的猜測" min="1" max="100">
                </div>
                <button class="btn btn-primary" id="guessBtn">猜測</button>
                <div id="guessResult" class="mt-3"></div>
                <div id="guessHistory" class="mt-3"></div>
            </div>
        `;

        const modal = this.createGameModal('猜數字', content);
        const guessInput = modal.querySelector('#guessInput');
        const guessBtn = modal.querySelector('#guessBtn');
        const resultDiv = modal.querySelector('#guessResult');
        const historyDiv = modal.querySelector('#guessHistory');
        const restartBtn = modal.querySelector('#restartGameBtn');

        const makeGuess = () => {
            if (gameWon) return;

            const guess = parseInt(guessInput.value);
            if (!guess || guess < 1 || guess > 100) {
                resultDiv.innerHTML = '<div class="alert alert-warning">請輸入1到100之間的數字！</div>';
                return;
            }

            attempts++;
            let message = '';
            let alertClass = '';

            if (guess === targetNumber) {
                message = `🎉 恭喜！你猜對了！數字就是 ${targetNumber}，你用了 ${attempts} 次猜測。`;
                alertClass = 'alert-success';
                gameWon = true;
                guessBtn.disabled = true;
                guessInput.disabled = true;
            } else if (guess < targetNumber) {
                message = '太小了！再試試更大的數字。';
                alertClass = 'alert-info';
            } else {
                message = '太大了！再試試更小的數字。';
                alertClass = 'alert-info';
            }

            resultDiv.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
            
            // 更新歷史記錄
            const historyItem = document.createElement('span');
            historyItem.className = `badge ${guess === targetNumber ? 'bg-success' : guess < targetNumber ? 'bg-info' : 'bg-warning'} me-1`;
            historyItem.textContent = guess;
            historyDiv.appendChild(historyItem);

            guessInput.value = '';
            guessInput.focus();
        };

        guessBtn.addEventListener('click', makeGuess);
        guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') makeGuess();
        });

        restartBtn.addEventListener('click', () => {
            modal.querySelector('.btn-close').click();
            this.startGuessNumber();
        });

        guessInput.focus();
    }

    // 記憶卡片遊戲
    startMemoryCard() {
        const symbols = ['🐱', '🐶', '🦊', '🐰', '🐻', '🐼', '🦁', '🐸'];
        const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
        let flippedCards = [];
        let matchedPairs = 0;
        let moves = 0;

        const content = `
            <div class="text-center">
                <h4>記憶卡片遊戲</h4>
                <p>翻開卡片找到相同的配對！</p>
                <div class="mb-3">
                    <span class="badge bg-primary me-2">移動次數: <span id="moveCount">0</span></span>
                    <span class="badge bg-success">配對: <span id="pairCount">0</span>/8</span>
                </div>
                <div id="cardGrid" class="memory-game-grid">
                    ${cards.map((symbol, index) => `
                        <div class="memory-card" data-index="${index}" data-symbol="${symbol}">
                            <div class="card-front">?</div>
                            <div class="card-back">${symbol}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const modal = this.createGameModal('記憶卡片', content);
        this.addMemoryGameStyles();

        const cardElements = modal.querySelectorAll('.memory-card');
        const moveCountElement = modal.querySelector('#moveCount');
        const pairCountElement = modal.querySelector('#pairCount');

        cardElements.forEach(card => {
            card.addEventListener('click', () => {
                if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length === 2) {
                    return;
                }

                card.classList.add('flipped');
                flippedCards.push(card);

                if (flippedCards.length === 2) {
                    moves++;
                    moveCountElement.textContent = moves;

                    const [card1, card2] = flippedCards;
                    if (card1.dataset.symbol === card2.dataset.symbol) {
                        // 配對成功
                        setTimeout(() => {
                            card1.classList.add('matched');
                            card2.classList.add('matched');
                            matchedPairs++;
                            pairCountElement.textContent = matchedPairs;
                            
                            if (matchedPairs === 8) {
                                setTimeout(() => {
                                    alert(`🎉 恭喜完成！用了 ${moves} 步！`);
                                }, 500);
                            }
                            
                            flippedCards = [];
                        }, 1000);
                    } else {
                        // 配對失敗
                        setTimeout(() => {
                            card1.classList.remove('flipped');
                            card2.classList.remove('flipped');
                            flippedCards = [];
                        }, 1000);
                    }
                }
            });
        });

        modal.querySelector('#restartGameBtn').addEventListener('click', () => {
            modal.querySelector('.btn-close').click();
            this.startMemoryCard();
        });
    }

    addMemoryGameStyles() {
        if (document.getElementById('memoryGameStyles')) return;

        const style = document.createElement('style');
        style.id = 'memoryGameStyles';
        style.textContent = `
            .memory-game-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                max-width: 400px;
                margin: 0 auto;
            }
            
            .memory-card {
                aspect-ratio: 1;
                background: var(--bs-primary);
                border-radius: 8px;
                cursor: pointer;
                position: relative;
                transition: transform 0.3s;
            }
            
            .memory-card:hover {
                transform: scale(1.05);
            }
            
            .memory-card.matched {
                background: var(--bs-success);
            }
            
            .card-front, .card-back {
                position: absolute;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                font-weight: bold;
                color: white;
                border-radius: 8px;
                backface-visibility: hidden;
                transition: transform 0.6s;
            }
            
            .card-back {
                transform: rotateY(180deg);
            }
            
            .memory-card.flipped .card-front {
                transform: rotateY(180deg);
            }
            
            .memory-card.flipped .card-back {
                transform: rotateY(0deg);
            }
        `;
        document.head.appendChild(style);
    }

    // 貪吃蛇遊戲
    startSnakeGame() {
        const content = `
            <div class="text-center">
                <h4>貪吃蛇遊戲</h4>
                <p>使用方向鍵控制蛇的移動，吃到食物讓蛇變長！</p>
                <div class="mb-3">
                    <span class="badge bg-primary me-2">分數: <span id="snakeScore">0</span></span>
                    <span class="badge bg-info">長度: <span id="snakeLength">1</span></span>
                </div>
                <canvas id="snakeCanvas" width="400" height="400" style="border: 2px solid #333; background: #000;"></canvas>
                <div class="mt-3">
                    <button class="btn btn-success" id="startSnakeBtn">開始</button>
                    <button class="btn btn-warning" id="pauseSnakeBtn">暫停</button>
                </div>
                <div class="mt-2">
                    <small class="text-muted">使用方向鍵或 WASD 控制</small>
                </div>
            </div>
        `;

        const modal = this.createGameModal('貪吃蛇', content);
        const canvas = modal.querySelector('#snakeCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = modal.querySelector('#snakeScore');
        const lengthElement = modal.querySelector('#snakeLength');
        const startBtn = modal.querySelector('#startSnakeBtn');
        const pauseBtn = modal.querySelector('#pauseSnakeBtn');

        let snake = [{x: 200, y: 200}];
        let food = {x: 100, y: 100};
        let dx = 0, dy = 0;
        let score = 0;
        let gameRunning = false;
        let gameLoop;

        const drawSnake = () => {
            ctx.fillStyle = '#0f0';
            snake.forEach(segment => {
                ctx.fillRect(segment.x, segment.y, 20, 20);
            });
        };

        const drawFood = () => {
            ctx.fillStyle = '#f00';
            ctx.fillRect(food.x, food.y, 20, 20);
        };

        const moveSnake = () => {
            const head = {x: snake[0].x + dx, y: snake[0].y + dy};
            
            // 檢查碰撞
            if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400 || 
                snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                gameRunning = false;
                clearInterval(gameLoop);
                alert(`遊戲結束！最終分數: ${score}`);
                return;
            }

            snake.unshift(head);

            // 檢查是否吃到食物
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                scoreElement.textContent = score;
                lengthElement.textContent = snake.length;
                
                // 生成新食物
                do {
                    food.x = Math.floor(Math.random() * 20) * 20;
                    food.y = Math.floor(Math.random() * 20) * 20;
                } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
            } else {
                snake.pop();
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, 400, 400);
            drawSnake();
            drawFood();
        };

        const gameStep = () => {
            if (!gameRunning) return;
            moveSnake();
            draw();
        };

        const startGame = () => {
            gameRunning = true;
            gameLoop = setInterval(gameStep, 150);
            startBtn.disabled = true;
            pauseBtn.disabled = false;
        };

        const pauseGame = () => {
            gameRunning = false;
            clearInterval(gameLoop);
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        };

        // 鍵盤控制
        const keyHandler = (e) => {
            if (!gameRunning) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (dy === 0) { dx = 0; dy = -20; }
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (dy === 0) { dx = 0; dy = 20; }
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (dx === 0) { dx = -20; dy = 0; }
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (dx === 0) { dx = 20; dy = 0; }
                    break;
            }
        };

        document.addEventListener('keydown', keyHandler);

        startBtn.addEventListener('click', startGame);
        pauseBtn.addEventListener('click', pauseGame);

        modal.querySelector('#restartGameBtn').addEventListener('click', () => {
            document.removeEventListener('keydown', keyHandler);
            clearInterval(gameLoop);
            modal.querySelector('.btn-close').click();
            this.startSnakeGame();
        });

        // 清理
        modal.addEventListener('hidden.bs.modal', () => {
            document.removeEventListener('keydown', keyHandler);
            clearInterval(gameLoop);
        });

        draw();
    }

    // 井字遊戲
    startTicTacToe() {
        let board = Array(9).fill('');
        let currentPlayer = 'X';
        let gameActive = true;

        const content = `
            <div class="text-center">
                <h4>井字遊戲</h4>
                <p>與AI對戰，先連成三個的勝利！</p>
                <div class="mb-3">
                    <span class="badge bg-primary">當前玩家: <span id="currentPlayerBadge">X (你)</span></span>
                </div>
                <div id="ticTacToeBoard" class="tic-tac-toe-board">
                    ${Array(9).fill(0).map((_, i) => `
                        <div class="tic-tac-toe-cell" data-index="${i}"></div>
                    `).join('')}
                </div>
                <div id="gameStatus" class="mt-3"></div>
            </div>
        `;

        const modal = this.createGameModal('井字遊戲', content);
        this.addTicTacToeStyles();

        const cells = modal.querySelectorAll('.tic-tac-toe-cell');
        const statusElement = modal.querySelector('#gameStatus');
        const playerBadge = modal.querySelector('#currentPlayerBadge');

        const checkWinner = () => {
            const winningCombos = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // 橫排
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // 直排
                [0, 4, 8], [2, 4, 6] // 斜排
            ];

            for (let combo of winningCombos) {
                const [a, b, c] = combo;
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    return board[a];
                }
            }

            return board.includes('') ? null : 'tie';
        };

        const makeAIMove = () => {
            if (!gameActive) return;

            // 簡單AI：隨機選擇空位
            const emptyCells = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
            if (emptyCells.length > 0) {
                const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                board[randomIndex] = 'O';
                cells[randomIndex].textContent = 'O';
                cells[randomIndex].classList.add('taken');

                const winner = checkWinner();
                if (winner) {
                    gameActive = false;
                    if (winner === 'tie') {
                        statusElement.innerHTML = '<div class="alert alert-warning">平手！</div>';
                    } else if (winner === 'O') {
                        statusElement.innerHTML = '<div class="alert alert-danger">AI 獲勝！</div>';
                    }
                } else {
                    currentPlayer = 'X';
                    playerBadge.textContent = 'X (你)';
                }
            }
        };

        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => {
                if (board[index] === '' && gameActive && currentPlayer === 'X') {
                    board[index] = 'X';
                    cell.textContent = 'X';
                    cell.classList.add('taken');

                    const winner = checkWinner();
                    if (winner) {
                        gameActive = false;
                        if (winner === 'tie') {
                            statusElement.innerHTML = '<div class="alert alert-warning">平手！</div>';
                        } else if (winner === 'X') {
                            statusElement.innerHTML = '<div class="alert alert-success">你獲勝了！</div>';
                        }
                    } else {
                        currentPlayer = 'O';
                        playerBadge.textContent = 'O (AI)';
                        setTimeout(makeAIMove, 500);
                    }
                }
            });
        });

        modal.querySelector('#restartGameBtn').addEventListener('click', () => {
            modal.querySelector('.btn-close').click();
            this.startTicTacToe();
        });
    }

    addTicTacToeStyles() {
        if (document.getElementById('ticTacToeStyles')) return;

        const style = document.createElement('style');
        style.id = 'ticTacToeStyles';
        style.textContent = `
            .tic-tac-toe-board {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 5px;
                width: 300px;
                height: 300px;
                margin: 0 auto;
                background: #333;
                padding: 5px;
                border-radius: 8px;
            }
            
            .tic-tac-toe-cell {
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            
            .tic-tac-toe-cell:hover:not(.taken) {
                background: #f0f0f0;
            }
            
            .tic-tac-toe-cell.taken {
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
    }

    // 打字練習遊戲
    startTypingGame() {
        const sentences = [
            "快速的棕色狐狸跳過懶惰的狗。",
            "程式設計是一門藝術也是一門科學。",
            "人工智慧正在改變我們的世界。",
            "學習新技能需要耐心和練習。",
            "今天是美好的一天，適合學習新事物。"
        ];

        const targetText = sentences[Math.floor(Math.random() * sentences.length)];
        let startTime = null;
        let gameFinished = false;

        const content = `
            <div class="text-center">
                <h4>打字練習</h4>
                <p>請準確快速地輸入下面的文字：</p>
                <div class="card mb-3">
                    <div class="card-body">
                        <div id="targetText" class="h5 mb-0">${targetText}</div>
                    </div>
                </div>
                <div class="mb-3">
                    <textarea id="typingInput" class="form-control" placeholder="在這裡開始輸入..." rows="3"></textarea>
                </div>
                <div class="row text-center">
                    <div class="col-4">
                        <div class="badge bg-primary">速度</div>
                        <div id="wpm">0 WPM</div>
                    </div>
                    <div class="col-4">
                        <div class="badge bg-success">準確度</div>
                        <div id="accuracy">100%</div>
                    </div>
                    <div class="col-4">
                        <div class="badge bg-info">時間</div>
                        <div id="timeElapsed">0s</div>
                    </div>
                </div>
            </div>
        `;

        const modal = this.createGameModal('打字練習', content);
        const typingInput = modal.querySelector('#typingInput');
        const targetTextElement = modal.querySelector('#targetText');
        const wpmElement = modal.querySelector('#wpm');
        const accuracyElement = modal.querySelector('#accuracy');
        const timeElement = modal.querySelector('#timeElapsed');

        let updateInterval;

        const updateStats = () => {
            if (!startTime || gameFinished) return;

            const currentTime = Date.now();
            const timeElapsed = (currentTime - startTime) / 1000;
            const inputText = typingInput.value;
            
            // 計算WPM
            const wordsTyped = inputText.length / 5;
            const wpm = Math.round((wordsTyped / timeElapsed) * 60);
            
            // 計算準確度
            let correctChars = 0;
            for (let i = 0; i < inputText.length; i++) {
                if (inputText[i] === targetText[i]) {
                    correctChars++;
                }
            }
            const accuracy = inputText.length > 0 ? Math.round((correctChars / inputText.length) * 100) : 100;
            
            wpmElement.textContent = `${wpm} WPM`;
            accuracyElement.textContent = `${accuracy}%`;
            timeElement.textContent = `${Math.round(timeElapsed)}s`;

            // 高亮正確/錯誤的字符
            let highlightedText = '';
            for (let i = 0; i < targetText.length; i++) {
                if (i < inputText.length) {
                    if (inputText[i] === targetText[i]) {
                        highlightedText += `<span class="text-success">${targetText[i]}</span>`;
                    } else {
                        highlightedText += `<span class="text-danger bg-danger bg-opacity-25">${targetText[i]}</span>`;
                    }
                } else {
                    highlightedText += targetText[i];
                }
            }
            targetTextElement.innerHTML = highlightedText;

            // 檢查是否完成
            if (inputText === targetText && !gameFinished) {
                gameFinished = true;
                clearInterval(updateInterval);
                setTimeout(() => {
                    alert(`🎉 完成！\n速度: ${wpm} WPM\n準確度: ${accuracy}%\n時間: ${Math.round(timeElapsed)}秒`);
                }, 100);
            }
        };

        typingInput.addEventListener('input', () => {
            if (!startTime) {
                startTime = Date.now();
                updateInterval = setInterval(updateStats, 100);
            }
            updateStats();
        });

        modal.querySelector('#restartGameBtn').addEventListener('click', () => {
            clearInterval(updateInterval);
            modal.querySelector('.btn-close').click();
            this.startTypingGame();
        });

        modal.addEventListener('hidden.bs.modal', () => {
            clearInterval(updateInterval);
        });

        typingInput.focus();
    }

    // 2048遊戲 (簡化版)
    start2048() {
        let board = Array(4).fill().map(() => Array(4).fill(0));
        let score = 0;
        let gameWon = false;

        const content = `
            <div class="text-center">
                <h4>2048 遊戲</h4>
                <p>使用方向鍵移動數字，合併相同數字達到2048！</p>
                <div class="mb-3">
                    <span class="badge bg-primary">分數: <span id="game2048Score">0</span></span>
                </div>
                <div id="game2048Board" class="game-2048-board">
                    ${Array(16).fill(0).map((_, i) => `
                        <div class="game-2048-cell" data-row="${Math.floor(i/4)}" data-col="${i%4}">
                            <div class="cell-value"></div>
                        </div>
                    `).join('')}
                </div>
                <div class="mt-3">
                    <small class="text-muted">使用方向鍵控制</small>
                </div>
            </div>
        `;

        const modal = this.createGameModal('2048', content);
        this.add2048Styles();

        const scoreElement = modal.querySelector('#game2048Score');
        const cells = modal.querySelectorAll('.game-2048-cell');

        const addRandomTile = () => {
            const emptyCells = [];
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    if (board[r][c] === 0) {
                        emptyCells.push({r, c});
                    }
                }
            }

            if (emptyCells.length > 0) {
                const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                board[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
            }
        };

        const updateDisplay = () => {
            cells.forEach(cell => {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                const value = board[row][col];
                const valueElement = cell.querySelector('.cell-value');
                
                valueElement.textContent = value || '';
                cell.className = `game-2048-cell ${value ? `tile-${value}` : ''}`;
            });
            scoreElement.textContent = score;
        };

        const move = (direction) => {
            let moved = false;
            const newBoard = board.map(row => [...row]);

            // 簡化的移動邏輯
            if (direction === 'left' || direction === 'right') {
                for (let r = 0; r < 4; r++) {
                    let row = newBoard[r].filter(cell => cell !== 0);
                    if (direction === 'right') row.reverse();
                    
                    for (let i = 0; i < row.length - 1; i++) {
                        if (row[i] === row[i + 1]) {
                            row[i] *= 2;
                            score += row[i];
                            row[i + 1] = 0;
                            if (row[i] === 2048 && !gameWon) {
                                gameWon = true;
                                setTimeout(() => alert('🎉 你達到了2048！'), 100);
                            }
                        }
                    }
                    
                    row = row.filter(cell => cell !== 0);
                    while (row.length < 4) row.push(0);
                    if (direction === 'right') row.reverse();
                    
                    if (JSON.stringify(row) !== JSON.stringify(board[r])) moved = true;
                    newBoard[r] = row;
                }
            }

            if (moved) {
                board = newBoard;
                addRandomTile();
                updateDisplay();
            }
        };

        const keyHandler = (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    move('left');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    move('right');
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    // 簡化版本暫不實現上下移動
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    // 簡化版本暫不實現上下移動
                    break;
            }
        };

        document.addEventListener('keydown', keyHandler);

        modal.addEventListener('hidden.bs.modal', () => {
            document.removeEventListener('keydown', keyHandler);
        });

        modal.querySelector('#restartGameBtn').addEventListener('click', () => {
            document.removeEventListener('keydown', keyHandler);
            modal.querySelector('.btn-close').click();
            this.start2048();
        });

        // 初始化遊戲
        addRandomTile();
        addRandomTile();
        updateDisplay();
    }

    add2048Styles() {
        if (document.getElementById('game2048Styles')) return;

        const style = document.createElement('style');
        style.id = 'game2048Styles';
        style.textContent = `
            .game-2048-board {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 8px;
                width: 320px;
                height: 320px;
                margin: 0 auto;
                background: #bbada0;
                padding: 8px;
                border-radius: 8px;
            }
            
            .game-2048-cell {
                background: #cdc1b4;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 1.5rem;
            }
            
            .tile-2 { background: #eee4da; color: #776e65; }
            .tile-4 { background: #ede0c8; color: #776e65; }
            .tile-8 { background: #f2b179; color: #f9f6f2; }
            .tile-16 { background: #f59563; color: #f9f6f2; }
            .tile-32 { background: #f67c5f; color: #f9f6f2; }
            .tile-64 { background: #f65e3b; color: #f9f6f2; }
            .tile-128 { background: #edcf72; color: #f9f6f2; font-size: 1.2rem; }
            .tile-256 { background: #edcc61; color: #f9f6f2; font-size: 1.2rem; }
            .tile-512 { background: #edc850; color: #f9f6f2; font-size: 1.2rem; }
            .tile-1024 { background: #edc53f; color: #f9f6f2; font-size: 1rem; }
            .tile-2048 { background: #edc22e; color: #f9f6f2; font-size: 1rem; }
        `;
        document.head.appendChild(style);
    }

    // 俄羅斯方塊遊戲
    startTetris() {
        this.addTetrisStyles();
        
        const gameContent = `
            <div class="tetris-game">
                <div class="row">
                    <div class="col-md-8">
                        <canvas id="tetrisCanvas" width="300" height="600" style="border: 2px solid #fff; background: #000;"></canvas>
                    </div>
                    <div class="col-md-4">
                        <div class="game-info">
                            <h5>遊戲資訊</h5>
                            <div class="mb-3">
                                <strong>分數：</strong><span id="tetrisScore">0</span>
                            </div>
                            <div class="mb-3">
                                <strong>等級：</strong><span id="tetrisLevel">1</span>
                            </div>
                            <div class="mb-3">
                                <strong>消除行數：</strong><span id="tetrisLines">0</span>
                            </div>
                            <div class="mt-4">
                                <h6>操作說明：</h6>
                                <p class="small">
                                    ← → 移動<br>
                                    ↓ 加速下落<br>
                                    ↑ 旋轉<br>
                                    空白鍵 暫停
                                </p>
                            </div>
                            <button class="btn btn-warning" id="tetrisPause">暫停</button>
                            <button class="btn btn-secondary" id="tetrisRestart">重新開始</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modal = this.createGameModal('俄羅斯方塊', gameContent);
        modal.show();

        setTimeout(() => {
            this.initTetrisGame();
        }, 100);
    }

    initTetrisGame() {
        const canvas = document.getElementById('tetrisCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const ROWS = 20;
        const COLS = 10;
        const BLOCK_SIZE = 30;
        
        let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
        let score = 0;
        let level = 1;
        let lines = 0;
        let currentPiece = null;
        let gameRunning = true;
        let isPaused = false;
        
        // 方塊形狀
        const SHAPES = [
            [[1,1,1,1]], // I
            [[1,1],[1,1]], // O
            [[0,1,0],[1,1,1]], // T
            [[0,1,1],[1,1,0]], // S
            [[1,1,0],[0,1,1]], // Z
            [[1,0,0],[1,1,1]], // J
            [[0,0,1],[1,1,1]]  // L
        ];
        
        const COLORS = ['#00f', '#ff0', '#f0f', '#0f0', '#f00', '#00f', '#f80'];
        
        class Piece {
            constructor() {
                this.shapeIndex = Math.floor(Math.random() * SHAPES.length);
                this.shape = SHAPES[this.shapeIndex];
                this.color = COLORS[this.shapeIndex];
                this.x = Math.floor(COLS / 2) - Math.floor(this.shape[0].length / 2);
                this.y = 0;
            }
            
            rotate() {
                const rotated = this.shape[0].map((_, i) => 
                    this.shape.map(row => row[i]).reverse()
                );
                return rotated;
            }
        }
        
        function isValidMove(piece, dx, dy, newShape = null) {
            const shape = newShape || piece.shape;
            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < shape[y].length; x++) {
                    if (shape[y][x]) {
                        const newX = piece.x + x + dx;
                        const newY = piece.y + y + dy;
                        if (newX < 0 || newX >= COLS || newY >= ROWS || 
                            (newY >= 0 && board[newY][newX])) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }
        
        function placePiece(piece) {
            for (let y = 0; y < piece.shape.length; y++) {
                for (let x = 0; x < piece.shape[y].length; x++) {
                    if (piece.shape[y][x]) {
                        board[piece.y + y][piece.x + x] = piece.shapeIndex + 1;
                    }
                }
            }
        }
        
        function clearLines() {
            let linesCleared = 0;
            for (let y = ROWS - 1; y >= 0; y--) {
                if (board[y].every(cell => cell !== 0)) {
                    board.splice(y, 1);
                    board.unshift(Array(COLS).fill(0));
                    linesCleared++;
                    y++;
                }
            }
            
            if (linesCleared > 0) {
                lines += linesCleared;
                score += linesCleared * 100 * level;
                level = Math.floor(lines / 10) + 1;
                updateDisplay();
            }
        }
        
        function updateDisplay() {
            document.getElementById('tetrisScore').textContent = score;
            document.getElementById('tetrisLevel').textContent = level;
            document.getElementById('tetrisLines').textContent = lines;
        }
        
        function draw() {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            for (let y = 0; y < ROWS; y++) {
                for (let x = 0; x < COLS; x++) {
                    if (board[y][x]) {
                        ctx.fillStyle = COLORS[board[y][x] - 1];
                        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                        ctx.strokeStyle = '#fff';
                        ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    }
                }
            }
            
            if (currentPiece) {
                ctx.fillStyle = currentPiece.color;
                for (let y = 0; y < currentPiece.shape.length; y++) {
                    for (let x = 0; x < currentPiece.shape[y].length; x++) {
                        if (currentPiece.shape[y][x]) {
                            const drawX = (currentPiece.x + x) * BLOCK_SIZE;
                            const drawY = (currentPiece.y + y) * BLOCK_SIZE;
                            ctx.fillRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
                            ctx.strokeStyle = '#fff';
                            ctx.strokeRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
                        }
                    }
                }
            }
        }
        
        function gameLoop() {
            if (!gameRunning || isPaused) return;
            
            if (!currentPiece) {
                currentPiece = new Piece();
                if (!isValidMove(currentPiece, 0, 0)) {
                    gameRunning = false;
                    alert('遊戲結束！最終分數：' + score);
                    return;
                }
            }
            
            if (isValidMove(currentPiece, 0, 1)) {
                currentPiece.y++;
            } else {
                placePiece(currentPiece);
                clearLines();
                currentPiece = null;
            }
            
            draw();
            setTimeout(gameLoop, Math.max(50, 500 - level * 30));
        }
        
        document.addEventListener('keydown', (e) => {
            if (!gameRunning || isPaused || !currentPiece) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    if (isValidMove(currentPiece, -1, 0)) currentPiece.x--;
                    break;
                case 'ArrowRight':
                    if (isValidMove(currentPiece, 1, 0)) currentPiece.x++;
                    break;
                case 'ArrowDown':
                    if (isValidMove(currentPiece, 0, 1)) currentPiece.y++;
                    break;
                case 'ArrowUp':
                    const rotated = currentPiece.rotate();
                    if (isValidMove(currentPiece, 0, 0, rotated)) {
                        currentPiece.shape = rotated;
                    }
                    break;
                case ' ':
                    isPaused = !isPaused;
                    if (!isPaused) gameLoop();
                    break;
            }
            draw();
        });
        
        document.getElementById('tetrisPause')?.addEventListener('click', () => {
            isPaused = !isPaused;
            document.getElementById('tetrisPause').textContent = isPaused ? '繼續' : '暫停';
            if (!isPaused) gameLoop();
        });
        
        document.getElementById('tetrisRestart')?.addEventListener('click', () => {
            board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
            score = 0;
            level = 1;
            lines = 0;
            currentPiece = null;
            gameRunning = true;
            isPaused = false;
            updateDisplay();
            gameLoop();
        });
        
        updateDisplay();
        gameLoop();
    }

    addTetrisStyles() {
        if (document.getElementById('tetris-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'tetris-styles';
        style.textContent = `
            .tetris-game {
                padding: 20px;
            }
            .game-info {
                background: var(--bs-dark);
                padding: 15px;
                border-radius: 8px;
                color: white;
            }
            #tetrisCanvas {
                border-radius: 8px;
            }
        `;
        document.head.appendChild(style);
    }

    // 麻將遊戲
    startMahjong() {
        this.addMahjongStyles();
        
        const gameContent = `
            <div class="mahjong-game">
                <div class="row">
                    <div class="col-12">
                        <div class="game-header d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <strong>分數：</strong><span id="mahjongScore">0</span>
                                <strong class="ms-3">時間：</strong><span id="mahjongTime">00:00</span>
                            </div>
                            <div>
                                <button class="btn btn-warning btn-sm" id="mahjongHint">提示</button>
                                <button class="btn btn-secondary btn-sm" id="mahjongShuffle">重新洗牌</button>
                                <button class="btn btn-primary btn-sm" id="mahjongRestart">重新開始</button>
                            </div>
                        </div>
                        <div id="mahjongBoard" class="mahjong-board"></div>
                    </div>
                </div>
            </div>
        `;

        const modal = this.createGameModal('麻將', gameContent);
        modal.show();

        setTimeout(() => {
            this.initMahjongGame();
        }, 100);
    }

    initMahjongGame() {
        const board = document.getElementById('mahjongBoard');
        if (!board) return;
        
        let score = 0;
        let startTime = Date.now();
        let gameTimer;
        let selectedTiles = [];
        let tiles = [];
        
        const TILE_TYPES = [
            '🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏',
            '🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗', '🀘',
            '🀙', '🀚', '🀛', '🀜', '🀝', '🀞', '🀟', '🀠', '🀡',
            '🀀', '🀁', '🀂', '🀃', '🀄', '🀅', '🀆'
        ];
        
        function initBoard() {
            tiles = [];
            board.innerHTML = '';
            
            const pairs = [];
            for (let i = 0; i < 18; i++) {
                const tileType = TILE_TYPES[i % TILE_TYPES.length];
                pairs.push(tileType, tileType);
            }
            
            for (let i = pairs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
            }
            
            for (let row = 0; row < 6; row++) {
                for (let col = 0; col < 6; col++) {
                    const index = row * 6 + col;
                    if (index < pairs.length) {
                        const tile = document.createElement('div');
                        tile.className = 'mahjong-tile';
                        tile.textContent = pairs[index];
                        tile.dataset.type = pairs[index];
                        tile.dataset.index = index;
                        tile.style.gridColumn = col + 1;
                        tile.style.gridRow = row + 1;
                        
                        tile.addEventListener('click', () => selectTile(tile));
                        board.appendChild(tile);
                        tiles.push(tile);
                    }
                }
            }
        }
        
        function selectTile(tile) {
            if (tile.classList.contains('matched') || tile.classList.contains('selected')) return;
            
            if (selectedTiles.length < 2) {
                tile.classList.add('selected');
                selectedTiles.push(tile);
                
                if (selectedTiles.length === 2) {
                    setTimeout(checkMatch, 300);
                }
            }
        }
        
        function checkMatch() {
            const [tile1, tile2] = selectedTiles;
            
            if (tile1.dataset.type === tile2.dataset.type) {
                tile1.classList.add('matched');
                tile2.classList.add('matched');
                score += 10;
                document.getElementById('mahjongScore').textContent = score;
                
                if (tiles.every(tile => tile.classList.contains('matched'))) {
                    clearInterval(gameTimer);
                    setTimeout(() => {
                        alert('恭喜完成！分數：' + score);
                    }, 500);
                }
            } else {
                tile1.classList.add('shake');
                tile2.classList.add('shake');
                setTimeout(() => {
                    tile1.classList.remove('shake');
                    tile2.classList.remove('shake');
                }, 500);
            }
            
            tile1.classList.remove('selected');
            tile2.classList.remove('selected');
            selectedTiles = [];
        }
        
        function updateTimer() {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            document.getElementById('mahjongTime').textContent = `${minutes}:${seconds}`;
        }
        
        function showHint() {
            const availableTiles = tiles.filter(tile => !tile.classList.contains('matched'));
            const types = {};
            
            availableTiles.forEach(tile => {
                const type = tile.dataset.type;
                if (!types[type]) types[type] = [];
                types[type].push(tile);
            });
            
            for (let type in types) {
                if (types[type].length >= 2) {
                    types[type].slice(0, 2).forEach(tile => {
                        tile.classList.add('hint');
                        setTimeout(() => tile.classList.remove('hint'), 2000);
                    });
                    return;
                }
            }
        }
        
        document.getElementById('mahjongHint')?.addEventListener('click', showHint);
        document.getElementById('mahjongShuffle')?.addEventListener('click', initBoard);
        document.getElementById('mahjongRestart')?.addEventListener('click', () => {
            score = 0;
            startTime = Date.now();
            document.getElementById('mahjongScore').textContent = score;
            selectedTiles = [];
            initBoard();
        });
        
        initBoard();
        gameTimer = setInterval(updateTimer, 1000);
    }

    addMahjongStyles() {
        if (document.getElementById('mahjong-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'mahjong-styles';
        style.textContent = `
            .mahjong-game {
                padding: 20px;
            }
            .mahjong-board {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                grid-template-rows: repeat(6, 1fr);
                gap: 5px;
                max-width: 360px;
                margin: 0 auto;
            }
            .mahjong-tile {
                width: 50px;
                height: 60px;
                background: linear-gradient(145deg, #f0f0f0, #d0d0d0);
                border: 2px solid #999;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                cursor: pointer;
                transition: all 0.3s ease;
                user-select: none;
            }
            .mahjong-tile:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            .mahjong-tile.selected {
                background: linear-gradient(145deg, #ffd700, #ffed4e);
                border-color: #ff6b6b;
                transform: translateY(-3px);
            }
            .mahjong-tile.matched {
                background: linear-gradient(145deg, #c8e6c9, #a5d6a7);
                opacity: 0.5;
                pointer-events: none;
            }
            .mahjong-tile.hint {
                animation: hint-pulse 1s ease-in-out;
                border-color: #4ecdc4;
            }
            .mahjong-tile.shake {
                animation: shake 0.5s ease-in-out;
            }
            @keyframes hint-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-3px); }
                75% { transform: translateX(3px); }
            }
        `;
        document.head.appendChild(style);
    }

    // 牧場物語遊戲（可與AI互動10次）
    startFarmGame() {
        this.addFarmGameStyles();
        
        const gameContent = `
            <div class="farm-game">
                <div class="row">
                    <div class="col-md-8">
                        <div class="farm-area">
                            <div id="farmGrid" class="farm-grid"></div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="farm-panel">
                            <h5>農場狀態</h5>
                            <div class="mb-3">
                                <strong>金錢：</strong><span id="farmMoney">100</span> 金
                            </div>
                            <div class="mb-3">
                                <strong>等級：</strong><span id="farmLevel">1</span>
                            </div>
                            <div class="mb-3">
                                <strong>經驗：</strong><span id="farmExp">0</span>/100
                            </div>
                            
                            <h6>工具</h6>
                            <div class="btn-group-vertical w-100 mb-3">
                                <button class="btn btn-outline-primary tool-btn active" data-tool="hoe">
                                    🍯 鋤頭
                                </button>
                                <button class="btn btn-outline-primary tool-btn" data-tool="seed">
                                    🌱 種子 (10金)
                                </button>
                                <button class="btn btn-outline-primary tool-btn" data-tool="water">
                                    💧 澆水
                                </button>
                                <button class="btn btn-outline-primary tool-btn" data-tool="harvest">
                                    🌾 收穫
                                </button>
                            </div>
                            
                            <h6>AI 農場助手 <span class="badge bg-warning" id="aiCount">10</span></h6>
                            <div class="ai-chat mb-3">
                                <div id="aiMessages" class="ai-messages"></div>
                                <div class="input-group">
                                    <input type="text" id="aiInput" class="form-control" placeholder="詢問農場助手..." maxlength="100">
                                    <button class="btn btn-primary" id="aiSend">送出</button>
                                </div>
                            </div>
                            
                            <div class="mt-3">
                                <h6>農場日誌</h6>
                                <div id="farmLog" class="farm-log"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modal = this.createGameModal('牧場物語', gameContent);
        modal.show();

        setTimeout(() => {
            this.initFarmGame();
        }, 100);
    }

    initFarmGame() {
        const grid = document.getElementById('farmGrid');
        if (!grid) return;
        
        let gameState = {
            money: 100,
            level: 1,
            exp: 0,
            currentTool: 'hoe',
            aiInteractions: 10,
            farmPlots: Array(36).fill().map(() => ({ state: 'empty', growthStage: 0, watered: false }))
        };
        
        let gameTimer;
        
        function initGrid() {
            grid.innerHTML = '';
            for (let i = 0; i < 36; i++) {
                const plot = document.createElement('div');
                plot.className = 'farm-plot';
                plot.dataset.index = i;
                plot.addEventListener('click', () => useTool(i));
                updatePlotDisplay(plot, i);
                grid.appendChild(plot);
            }
        }
        
        function updatePlotDisplay(plot, index) {
            const plotData = gameState.farmPlots[index];
            plot.className = 'farm-plot';
            
            switch(plotData.state) {
                case 'empty':
                    plot.textContent = '🟫';
                    break;
                case 'tilled':
                    plot.textContent = plotData.watered ? '💧' : '🟤';
                    break;
                case 'planted':
                    const stages = ['🌱', '🌿', '🌾', '🌽'];
                    plot.textContent = stages[plotData.growthStage] || '🌱';
                    if (plotData.watered) plot.classList.add('watered');
                    break;
                case 'ready':
                    plot.textContent = '🌽';
                    plot.classList.add('ready');
                    break;
            }
        }
        
        function useTool(plotIndex) {
            const plot = gameState.farmPlots[plotIndex];
            const plotElement = document.querySelector(`[data-index="${plotIndex}"]`);
            
            switch(gameState.currentTool) {
                case 'hoe':
                    if (plot.state === 'empty') {
                        plot.state = 'tilled';
                        addExp(2);
                        logAction('翻土完成');
                    }
                    break;
                    
                case 'seed':
                    if (plot.state === 'tilled' && gameState.money >= 10) {
                        plot.state = 'planted';
                        plot.growthStage = 0;
                        gameState.money -= 10;
                        addExp(5);
                        logAction('種子已種植');
                    }
                    break;
                    
                case 'water':
                    if (plot.state === 'planted' && !plot.watered) {
                        plot.watered = true;
                        addExp(3);
                        logAction('作物已澆水');
                    }
                    break;
                    
                case 'harvest':
                    if (plot.state === 'ready') {
                        plot.state = 'empty';
                        plot.growthStage = 0;
                        plot.watered = false;
                        const earnings = 20 + Math.floor(Math.random() * 10);
                        gameState.money += earnings;
                        addExp(10);
                        logAction(`收穫作物，獲得 ${earnings} 金`);
                    }
                    break;
            }
            
            updatePlotDisplay(plotElement, plotIndex);
            updateUI();
        }
        
        function addExp(amount) {
            gameState.exp += amount;
            if (gameState.exp >= gameState.level * 100) {
                gameState.level++;
                gameState.exp = 0;
                logAction(`等級提升到 ${gameState.level}！`);
            }
        }
        
        function updateUI() {
            document.getElementById('farmMoney').textContent = gameState.money;
            document.getElementById('farmLevel').textContent = gameState.level;
            document.getElementById('farmExp').textContent = gameState.exp;
            document.getElementById('aiCount').textContent = gameState.aiInteractions;
        }
        
        function logAction(message) {
            const log = document.getElementById('farmLog');
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
            log.insertBefore(entry, log.firstChild);
            
            if (log.children.length > 5) {
                log.removeChild(log.lastChild);
            }
        }
        
        async function askAI(question) {
            if (gameState.aiInteractions <= 0) {
                addAIMessage('AI助手', '對不起，今日AI互動次數已用完！');
                return;
            }
            
            gameState.aiInteractions--;
            updateUI();
            
            // 檢查是否要求金手指
            const cheatRequest = detectCheatRequest(question);
            if (cheatRequest) {
                handleCheatCode(cheatRequest);
                return;
            }
            
            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        message: `作為農場助手，回答這個問題（簡短回答）：${question}。當前農場狀態：等級${gameState.level}，金錢${gameState.money}。提示：如果用戶要求金手指或作弊碼，你可以提供以下選項：加錢、快速成長、最高等級、滿農場。` 
                    })
                });
                
                const data = await response.json();
                addAIMessage('AI助手', data.response || '抱歉，我無法回答這個問題。');
            } catch (error) {
                addAIMessage('AI助手', '連接失敗，請稍後再試。');
            }
        }
        
        function detectCheatRequest(question) {
            const lowerQuestion = question.toLowerCase();
            const cheatKeywords = ['金手指', '作弊', '外掛', '金錢', '加錢', '錢', '升級', '等級', '快速', '成長', '滿農場', '全收穫'];
            
            for (let keyword of cheatKeywords) {
                if (lowerQuestion.includes(keyword)) {
                    if (lowerQuestion.includes('金錢') || lowerQuestion.includes('加錢') || lowerQuestion.includes('錢')) {
                        return 'money';
                    } else if (lowerQuestion.includes('等級') || lowerQuestion.includes('升級')) {
                        return 'level';
                    } else if (lowerQuestion.includes('快速') || lowerQuestion.includes('成長')) {
                        return 'growth';
                    } else if (lowerQuestion.includes('滿農場') || lowerQuestion.includes('全收穫')) {
                        return 'harvest_all';
                    } else {
                        return 'general';
                    }
                }
            }
            return null;
        }
        
        function handleCheatCode(cheatType) {
            switch(cheatType) {
                case 'money':
                    gameState.money += 500;
                    addAIMessage('AI助手', '🎉 金手指啟動！獲得 500 金幣！現在你有足夠的資金來擴展農場了！');
                    logAction('使用金手指獲得 500 金幣');
                    break;
                    
                case 'level':
                    gameState.level += 2;
                    gameState.exp = 0;
                    addAIMessage('AI助手', '⭐ 等級提升金手指！提升 2 個等級！你現在是更有經驗的農夫了！');
                    logAction('使用金手指提升等級');
                    break;
                    
                case 'growth':
                    let grownCrops = 0;
                    gameState.farmPlots.forEach((plot, index) => {
                        if (plot.state === 'planted' && plot.growthStage < 3) {
                            plot.growthStage = 3;
                            plot.state = 'ready';
                            grownCrops++;
                            const plotElement = document.querySelector(`[data-index="${index}"]`);
                            updatePlotDisplay(plotElement, index);
                        }
                    });
                    if (grownCrops > 0) {
                        addAIMessage('AI助手', `🌱 成長加速金手指！${grownCrops} 株作物瞬間成熟！趕快收穫吧！`);
                        logAction(`使用金手指加速 ${grownCrops} 株作物成長`);
                    } else {
                        addAIMessage('AI助手', '🌱 成長加速金手指準備就緒，但農場裡沒有可加速的作物！先種植一些種子吧！');
                    }
                    break;
                    
                case 'harvest_all':
                    let harvested = 0;
                    let totalEarnings = 0;
                    gameState.farmPlots.forEach((plot, index) => {
                        if (plot.state === 'ready') {
                            plot.state = 'empty';
                            plot.growthStage = 0;
                            plot.watered = false;
                            const earnings = 25 + Math.floor(Math.random() * 15);
                            totalEarnings += earnings;
                            harvested++;
                            const plotElement = document.querySelector(`[data-index="${index}"]`);
                            updatePlotDisplay(plotElement, index);
                        }
                    });
                    if (harvested > 0) {
                        gameState.money += totalEarnings;
                        addExp(harvested * 15);
                        addAIMessage('AI助手', `🌾 全收穫金手指！自動收穫 ${harvested} 株作物，獲得 ${totalEarnings} 金幣！`);
                        logAction(`使用金手指全收穫，獲得 ${totalEarnings} 金幣`);
                    } else {
                        addAIMessage('AI助手', '🌾 全收穫金手指準備就緒，但沒有成熟的作物可收穫！');
                    }
                    break;
                    
                case 'general':
                    addAIMessage('AI助手', '🎮 金手指選單：\n1️⃣ 說「加錢」- 獲得 500 金幣\n2️⃣ 說「升級」- 提升 2 個等級\n3️⃣ 說「快速成長」- 所有作物瞬間成熟\n4️⃣ 說「全收穫」- 自動收穫所有成熟作物\n\n選擇你想要的金手指吧！');
                    break;
            }
            updateUI();
        }
        
        function addAIMessage(sender, message) {
            const messages = document.getElementById('aiMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'ai-message';
            messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
            messages.appendChild(messageDiv);
            messages.scrollTop = messages.scrollHeight;
        }
        
        function growCrops() {
            let hasChanges = false;
            gameState.farmPlots.forEach((plot, index) => {
                if (plot.state === 'planted' && plot.watered) {
                    plot.growthStage++;
                    plot.watered = false;
                    
                    if (plot.growthStage >= 3) {
                        plot.state = 'ready';
                    }
                    
                    const plotElement = document.querySelector(`[data-index="${index}"]`);
                    updatePlotDisplay(plotElement, index);
                    hasChanges = true;
                }
            });
            
            if (hasChanges) {
                logAction('作物生長了！');
            }
        }
        
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                gameState.currentTool = btn.dataset.tool;
            });
        });
        
        document.getElementById('aiSend')?.addEventListener('click', () => {
            const input = document.getElementById('aiInput');
            const question = input.value.trim();
            if (question && gameState.aiInteractions > 0) {
                addAIMessage('你', question);
                askAI(question);
                input.value = '';
            }
        });
        
        document.getElementById('aiInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('aiSend').click();
            }
        });
        
        initGrid();
        updateUI();
        logAction('歡迎來到你的農場！');
        addAIMessage('AI助手', '歡迎！我是你的農場助手，有任何農場問題都可以問我喔！(可互動10次)');
        
        gameTimer = setInterval(growCrops, 30000);
    }

    addFarmGameStyles() {
        if (document.getElementById('farm-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'farm-styles';
        style.textContent = `
            .farm-game {
                padding: 20px;
            }
            .farm-grid {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 5px;
                max-width: 480px;
                background: #8BC34A;
                padding: 15px;
                border-radius: 10px;
                border: 3px solid #689F38;
            }
            .farm-plot {
                width: 60px;
                height: 60px;
                background: #A1887F;
                border: 2px solid #6D4C41;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                cursor: pointer;
                transition: all 0.3s ease;
                user-select: none;
            }
            .farm-plot:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            }
            .farm-plot.watered {
                background: #4FC3F7;
            }
            .farm-plot.ready {
                animation: ready-glow 2s ease-in-out infinite;
            }
            .farm-panel {
                background: var(--bs-dark);
                padding: 15px;
                border-radius: 10px;
                color: white;
                max-height: 600px;
                overflow-y: auto;
            }
            .ai-messages {
                max-height: 120px;
                overflow-y: auto;
                background: #2c2c2c;
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 10px;
            }
            .ai-message {
                margin-bottom: 8px;
                font-size: 0.9em;
                line-height: 1.3;
            }
            .farm-log {
                max-height: 100px;
                overflow-y: auto;
                background: #2c2c2c;
                padding: 10px;
                border-radius: 5px;
                font-size: 0.85em;
            }
            .log-entry {
                margin-bottom: 5px;
                color: #ccc;
            }
            @keyframes ready-glow {
                0%, 100% { box-shadow: 0 0 5px #FFD700; }
                50% { box-shadow: 0 0 20px #FFD700, 0 0 30px #FFD700; }
            }
        `;
        document.head.appendChild(style);
    }
}

// 導出類別
window.GameCenter = GameCenter;