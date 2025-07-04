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
        
        // 使用統一的模態框管理工具
        if (typeof ModalManager !== 'undefined') {
            ModalManager.showModal(modal);
        } else {
            // 備用方案
            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                try {
                    const bsModal = new bootstrap.Modal(modal);
                    bsModal.show();
                } catch (error) {
                    console.warn('Bootstrap modal failed:', error);
                    modal.style.display = 'block';
                    modal.classList.add('show');
                }
            } else {
                modal.style.display = 'block';
                modal.classList.add('show');
            }
        }

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
        // modal.show() 已經在 createGameModal 中處理

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

    // 4人麻將遊戲
    startMahjong() {
        this.addMahjongStyles();
        
        const gameContent = `
            <div class="mahjong-game">
                <div class="game-header mb-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>當前玩家：</strong><span id="currentPlayer">玩家1 (你)</span>
                            <strong class="ms-3">圈風：</strong><span id="roundWind">東</span>
                            <strong class="ms-3">局數：</strong><span id="gameRound">東1局</span>
                        </div>
                        <div>
                            <button class="btn btn-info btn-sm" id="mahjongRules">規則說明</button>
                            <button class="btn btn-primary btn-sm" id="mahjongRestart">重新開始</button>
                        </div>
                    </div>
                </div>
                
                <!-- 遊戲提示區域 -->
                <div id="gamePrompt" style="display: none; margin-bottom: 15px;"></div>
                
                <!-- 對手手牌顯示 -->
                <div class="opponents-area mb-3">
                    <!-- 上家 (對面) -->
                    <div class="opponent-top text-center mb-2">
                        <div class="player-name">玩家3 (上家)</div>
                        <div class="opponent-tiles" id="opponent2Cards"></div>
                        <div class="exposed-tiles" id="opponent2Exposed"></div>
                    </div>
                    
                    <div class="row">
                        <!-- 左家 -->
                        <div class="col-3">
                            <div class="opponent-left">
                                <div class="player-name">玩家4 (左家)</div>
                                <div class="opponent-tiles vertical" id="opponent3Cards"></div>
                                <div class="exposed-tiles" id="opponent3Exposed"></div>
                            </div>
                        </div>
                        
                        <!-- 中央牌桌 -->
                        <div class="col-6">
                            <div class="table-center">
                                <div class="discarded-tiles" id="discardedTiles">
                                    <div class="text-center mb-2"><small>牌桌中央</small></div>
                                </div>
                                <div class="game-actions mt-3" id="gameActions">
                                    <button class="btn btn-success btn-sm me-2" id="drawTileBtn" style="display:none;">摸牌</button>
                                    <button class="btn btn-warning btn-sm me-2" id="chiBtn" style="display:none;">吃</button>
                                    <button class="btn btn-info btn-sm me-2" id="pengBtn" style="display:none;">碰</button>
                                    <button class="btn btn-secondary btn-sm me-2" id="gangBtn" style="display:none;">槓</button>
                                    <button class="btn btn-danger btn-sm" id="huBtn" style="display:none;">胡</button>
                                    <button class="btn btn-light btn-sm" id="passBtn" style="display:none;">過</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 右家 -->
                        <div class="col-3">
                            <div class="opponent-right">
                                <div class="player-name">玩家2 (右家)</div>
                                <div class="opponent-tiles vertical" id="opponent1Cards"></div>
                                <div class="exposed-tiles" id="opponent1Exposed"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 玩家手牌和控制區 -->
                <div class="d-flex player-control-area">
                    <div class="player-area flex-grow-1">
                        <div class="player-name text-center mb-2">玩家1 (你) - <span id="playerWind">東</span>風</div>
                        <div class="exposed-tiles mb-2" id="playerExposed"></div>
                        <div class="player-tiles" id="playerTiles"></div>
                        <div class="drawn-tile mt-2" id="drawnTile"></div>
                    </div>
                    
                    <!-- 遊戲控制面板 -->
                    <div class="game-control-panel ms-3" style="min-width: 180px;">
                        <!-- 動作按鈕區 -->
                        <div class="action-buttons mb-3">
                            <div class="d-grid gap-2">
                                <button class="btn btn-success btn-sm" id="drawTileBtn" style="display: none;">摸牌</button>
                                <button class="btn btn-warning btn-sm" id="chiBtn" style="display: none;">吃</button>
                                <button class="btn btn-info btn-sm" id="pengBtn" style="display: none;">碰</button>
                                <button class="btn btn-secondary btn-sm" id="gangBtn" style="display: none;">槓</button>
                                <button class="btn btn-danger btn-sm" id="huBtn" style="display: none;">胡</button>
                            </div>
                        </div>
                        
                        <!-- 操作說明 -->
                        <div class="operation-tips">
                            <small class="text-muted">
                                <strong>操作提示：</strong><br>
                                • 點擊手牌可打出<br>
                                • 按鈕會自動顯示<br>
                                • 跟隨遊戲提示操作
                            </small>
                        </div>
                    </div>
                </div>
                
                <!-- 動作選擇模態框 -->
                <div class="action-modal" id="actionModal" style="display:none;">
                    <div class="action-content">
                        <h5>選擇動作</h5>
                        <div id="actionButtons"></div>
                    </div>
                </div>
            </div>
        `;

        const modal = this.createGameModal('4人麻將', gameContent);

        setTimeout(() => {
            this.init4PlayerMahjong();
        }, 100);
    }

    initMahjongGame() {
        const board = document.getElementById('mahjongBoard');
        if (!board) return;
        
        // Clear any existing timers
        if (window.mahjongTimer) {
            clearInterval(window.mahjongTimer);
            window.mahjongTimer = null;
        }
        
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
                const scoreElement = document.getElementById('mahjongScore');
                if (scoreElement) {
                    scoreElement.textContent = score;
                }
                
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
            const timeElement = document.getElementById('mahjongTime');
            if (timeElement) {
                timeElement.textContent = `${minutes}:${seconds}`;
            }
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
            const scoreElement = document.getElementById('mahjongScore');
            if (scoreElement) {
                scoreElement.textContent = score;
            }
            selectedTiles = [];
            initBoard();
        });
        
        initBoard();
        window.mahjongTimer = setInterval(updateTimer, 1000);
    }

    // 新的4人麻將遊戲初始化
    init4PlayerMahjong() {
        console.log('初始化4人麻將遊戲...');
        
        // Clear any existing timers
        if (window.mahjongTimer) {
            clearInterval(window.mahjongTimer);
            window.mahjongTimer = null;
        }
        
        // 初始化遊戲狀態
        window.gameState = {
            currentPlayer: 0, // 0=玩家, 1-3=AI
            round: 0, // 東南西北圈
            game: 0, // 1-4局
            wind: ['東', '南', '西', '北'],
            players: [
                { name: '玩家1 (你)', wind: '東', hand: [], exposed: [], discarded: [] },
                { name: '玩家2 (右家)', wind: '南', hand: [], exposed: [], discarded: [] },
                { name: '玩家3 (上家)', wind: '西', hand: [], exposed: [], discarded: [] },
                { name: '玩家4 (左家)', wind: '北', hand: [], exposed: [], discarded: [] }
            ],
            tiles: [],
            wallTiles: [],
            lastDiscarded: null,
            gameOver: false,
            playerCanChi: false,
            playerCanPeng: false,
            playerCanGang: false,
            playerCanHu: false
        };
        
        console.log('遊戲狀態初始化完成:', window.gameState);
        
        // 為所有內部函數創建gameState的快捷引用
        const gameState = window.gameState;
        
        // 麻將牌組
        const MAHJONG_TILES = {
            // 萬字牌 (1-9)
            wan: ['一萬', '二萬', '三萬', '四萬', '五萬', '六萬', '七萬', '八萬', '九萬'],
            // 筒子牌 (1-9)  
            tong: ['一筒', '二筒', '三筒', '四筒', '五筒', '六筒', '七筒', '八筒', '九筒'],
            // 條子牌 (1-9)
            tiao: ['一條', '二條', '三條', '四條', '五條', '六條', '七條', '八條', '九條'],
            // 風牌
            feng: ['東風', '南風', '西風', '北風'],
            // 三元牌
            sanyuan: ['紅中', '發財', '白板']
        };
        
        // 初始化牌堆
        function initTiles() {
            console.log('初始化牌堆...');
            gameState.wallTiles = [];
            
            // 每種數字牌4張
            [...MAHJONG_TILES.wan, ...MAHJONG_TILES.tong, ...MAHJONG_TILES.tiao].forEach(tile => {
                for (let i = 0; i < 4; i++) {
                    gameState.wallTiles.push(tile);
                }
            });
            
            // 風牌和三元牌各4張
            [...MAHJONG_TILES.feng, ...MAHJONG_TILES.sanyuan].forEach(tile => {
                for (let i = 0; i < 4; i++) {
                    gameState.wallTiles.push(tile);
                }
            });
            
            // 洗牌
            for (let i = gameState.wallTiles.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [gameState.wallTiles[i], gameState.wallTiles[j]] = [gameState.wallTiles[j], gameState.wallTiles[i]];
            }
        }
        
        // 發牌
        function dealTiles() {
            // 清空所有玩家手牌
            gameState.players.forEach(player => {
                player.hand = [];
                player.exposed = [];
                player.discarded = [];
            });
            
            // 每人發13張牌
            for (let round = 0; round < 13; round++) {
                gameState.players.forEach(player => {
                    if (gameState.wallTiles.length > 0) {
                        player.hand.push(gameState.wallTiles.pop());
                    }
                });
            }
            
            // 玩家手牌排序
            gameState.players[0].hand.sort();
        }
        
        // 摸牌
        function drawTile(playerIndex) {
            if (gameState.wallTiles.length > 0) {
                const tile = gameState.wallTiles.pop();
                gameState.players[playerIndex].hand.push(tile);
                if (playerIndex === 0) {
                    gameState.players[0].hand.sort();
                }
                return tile;
            }
            return null;
        }
        
        // 打牌
        function discardTile(playerIndex, tileIndex) {
            console.log(`打牌: 玩家${playerIndex}, 牌索引${tileIndex}`);
            
            if (!gameState.players || !gameState.players[playerIndex]) {
                console.error(`玩家 ${playerIndex} 不存在`);
                return null;
            }
            
            const player = gameState.players[playerIndex];
            console.log(`玩家手牌:`, player.hand);
            
            if (!player.hand || tileIndex >= player.hand.length || tileIndex < 0) {
                console.error(`無效的牌索引: ${tileIndex}, 手牌長度: ${player.hand ? player.hand.length : 0}`);
                return null;
            }
            
            const discardedTile = player.hand.splice(tileIndex, 1)[0];
            player.discarded.push(discardedTile);
            gameState.lastDiscarded = discardedTile;
            
            console.log(`玩家 ${playerIndex} 打出了 ${discardedTile}`);
            
            // 檢查其他玩家是否可以吃碰槓胡
            checkPlayerActions();
            
            return discardedTile;
        }
        
        // 檢查玩家可以進行的動作（這個函數已棄用，改用checkSpecialActions）
        function checkPlayerActions() {
            console.log('checkPlayerActions函數已棄用，請使用checkSpecialActions');
            return;
        }
            
            // 檢查吃 (只能吃上家的牌，形成順子)
            if (gameState.currentPlayer === 3) { // 上家是左家 (player 3)
                gameState.playerCanChi = canFormSequence(playerHand, lastTile);
            }
            
            // 檢查胡 (簡化版胡牌檢查)
            gameState.playerCanHu = canWin([...playerHand, lastTile]);
            
            // 顯示動作按鈕
            showActionButtons();
        }
        
        // 檢查是否可以形成順子
        function canFormSequence(hand, tile) {
            // 簡化版順子檢查 - 只檢查數字牌
            if (!tile.includes('萬') && !tile.includes('筒') && !tile.includes('條')) {
                return false;
            }
            
            const tileNum = parseInt(tile.charAt(0)) || getTileNumber(tile.charAt(0));
            if (!tileNum || tileNum < 1 || tileNum > 9) return false;
            
            const suitTiles = hand.filter(t => t.includes(tile.slice(-1)));
            const numbers = suitTiles.map(t => parseInt(t.charAt(0)) || getTileNumber(t.charAt(0)));
            
            // 檢查能否形成順子
            return (numbers.includes(tileNum - 1) && numbers.includes(tileNum + 1)) ||
                   (numbers.includes(tileNum - 2) && numbers.includes(tileNum - 1)) ||
                   (numbers.includes(tileNum + 1) && numbers.includes(tileNum + 2));
        }
        
        // 轉換中文數字
        function getTileNumber(char) {
            const nums = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9};
            return nums[char];
        }
        
        // 簡化版胡牌檢查
        function canWin(hand) {
            if (hand.length !== 14) return false;
            
            const tileCounts = {};
            hand.forEach(tile => {
                tileCounts[tile] = (tileCounts[tile] || 0) + 1;
            });
            
            // 檢查是否有將牌 (一對)
            let pairs = 0;
            let triplets = 0;
            
            Object.values(tileCounts).forEach(count => {
                if (count === 2) pairs++;
                if (count === 3) triplets++;
                if (count === 4) triplets++; // 槓算作刻子
            });
            
            // 簡化版：4個刻子+1個對子 = 胡牌
            return pairs === 1 && triplets === 4;
        }
        
        // 顯示動作按鈕
        function showActionButtons() {
            const actions = ['chiBtn', 'pengBtn', 'gangBtn', 'huBtn', 'passBtn'];
            const canDo = [gameState.playerCanChi, gameState.playerCanPeng, gameState.playerCanGang, gameState.playerCanHu, true];
            
            actions.forEach((btnId, index) => {
                const btn = document.getElementById(btnId);
                if (btn) {
                    btn.style.display = canDo[index] ? 'inline-block' : 'none';
                }
            });
        }
        
        // 隱藏動作按鈕
        function hideActionButtons() {
            const actions = ['chiBtn', 'pengBtn', 'gangBtn', 'huBtn', 'passBtn', 'drawTileBtn'];
            actions.forEach(btnId => {
                const btn = document.getElementById(btnId);
                if (btn) {
                    btn.style.display = 'none';
                }
            });
        }
        
        // AI玩家自動打牌
        function aiPlay(playerIndex) {
            console.log(`AI玩家 ${playerIndex} 開始行動`);
            if (!gameState.players || !gameState.players[playerIndex]) {
                console.error(`AI玩家 ${playerIndex} 不存在`);
                return;
            }
            
            const player = gameState.players[playerIndex];
            console.log(`AI玩家當前手牌:`, player.hand);
            
            // AI摸牌
            drawTile(playerIndex);
            
            if (gameState.wallTiles.length === 0) {
                gameState.gameOver = true;
                alert('牌摸完了，平局！');
                return;
            }
            
            // AI隨機打牌 (簡化版AI邏輯)
            setTimeout(() => {
                if (player.hand.length === 0) {
                    console.log(`AI玩家 ${playerIndex} 沒有手牌`);
                    nextTurn();
                    return;
                }
                
                const randomIndex = Math.floor(Math.random() * player.hand.length);
                console.log(`AI玩家 ${playerIndex} 打出第 ${randomIndex} 張牌`);
                const discardedTile = discardTile(playerIndex, randomIndex);
                
                updateDisplay();
                console.log(`AI玩家 ${playerIndex} 打出了 ${discardedTile}`);
                
                // 檢查玩家是否可以執行特殊動作
                const hasSpecialActions = checkSpecialActions(discardedTile, playerIndex);
                
                // 等待一下再檢查是否需要下一輪
                setTimeout(() => {
                    console.log(`AI玩家 ${playerIndex} 動作完成，檢查是否繼續`);
                    
                    if (!hasSpecialActions) {
                        console.log(`沒有特殊動作，輪到下一位玩家`);
                        nextTurn();
                    } else {
                        console.log(`有特殊動作可執行，等待玩家選擇`);
                    }
                }, 800);
            }, 1200);
        }
        
        // 下一回合
        function nextTurn() {
            if (gameState.gameOver) return;
            
            gameState.currentPlayer = (gameState.currentPlayer + 1) % 4;
            updateCurrentPlayer();
            
            if (gameState.currentPlayer === 0) {
                // 玩家回合 - 顯示摸牌按鈕
                const drawBtn = document.getElementById('drawTileBtn');
                if (drawBtn) {
                    drawBtn.style.display = 'inline-block';
                }
                hideActionButtons();
            } else {
                // AI回合
                hideActionButtons();
                aiPlay(gameState.currentPlayer);
            }
        }
        
        // 更新當前玩家顯示
        function updateCurrentPlayer() {
            const currentPlayerElement = document.getElementById('currentPlayer');
            if (currentPlayerElement) {
                currentPlayerElement.textContent = gameState.players[gameState.currentPlayer].name;
                
                // 如果輪到玩家，顯示摸牌提示
                if (gameState.currentPlayer === 0) {
                    showPlayerActionPrompt();
                }
            }
        }
        
        // 顯示玩家動作提示
        function showPlayerActionPrompt() {
            const controlPanel = document.querySelector('.game-control-panel');
            if (controlPanel) {
                // 移除舊的提示
                const oldPrompt = controlPanel.querySelector('.game-prompt');
                if (oldPrompt) oldPrompt.remove();
                
                // 創建新提示
                const promptDiv = document.createElement('div');
                promptDiv.className = 'game-prompt alert alert-info alert-sm mb-2';
                promptDiv.innerHTML = '<small><strong>輪到你了！</strong><br>點擊「摸牌」按鈕摸牌</small>';
                
                // 插入到按鈕區域前面
                const actionButtons = controlPanel.querySelector('.action-buttons');
                if (actionButtons) {
                    controlPanel.insertBefore(promptDiv, actionButtons);
                }
            }
        }
        
        // 檢查特殊動作提示（吃、碰、胡）
        function checkSpecialActions(discardedTile, discardingPlayer) {
            console.log('檢查特殊動作:', discardedTile, '來自玩家', discardingPlayer);
            
            if (!gameState.players || !gameState.players[0] || !gameState.players[0].hand) {
                console.error('玩家手牌不存在');
                return false;
            }
            
            const player = gameState.players[0]; // 玩家
            const actions = [];
            
            // 檢查胡牌
            if (canWin(0, discardedTile)) {
                actions.push('胡');
            }
            
            // 檢查碰牌
            if (canPong(0, discardedTile)) {
                actions.push('碰');
            }
            
            // 檢查吃牌（只能吃上家的牌）
            if (discardingPlayer === 3 && canChow(0, discardedTile)) {
                actions.push('吃');
            }
            
            console.log('可執行動作:', actions);
            
            if (actions.length > 0) {
                showSpecialActionPrompt(actions, discardedTile);
                return true; // 有特殊動作
            }
            
            return false; // 沒有特殊動作
        }
        
        // 顯示特殊動作提示
        function showSpecialActionPrompt(actions, tile) {
            const controlPanel = document.querySelector('.game-control-panel');
            if (controlPanel) {
                // 移除舊的提示
                const oldPrompt = controlPanel.querySelector('.game-prompt');
                if (oldPrompt) oldPrompt.remove();
                
                // 創建新提示
                const promptDiv = document.createElement('div');
                promptDiv.className = 'game-prompt alert alert-warning mb-2';
                
                let promptHTML = '<small><strong>可以執行動作：</strong></small><br>';
                
                actions.forEach(action => {
                    let buttonClass = 'btn-warning';
                    if (action === '胡') buttonClass = 'btn-danger';
                    else if (action === '碰') buttonClass = 'btn-success';
                    else if (action === '吃') buttonClass = 'btn-info';
                    
                    promptHTML += `<button class="btn ${buttonClass} btn-sm me-1 mb-1" onclick="executeSpecialAction('${action}', '${tile}')">${action}</button>`;
                });
                
                promptHTML += '<br><button class="btn btn-secondary btn-sm mt-1" onclick="passAction()">跳過</button>';
                
                promptDiv.innerHTML = promptHTML;
                
                // 插入到按鈕區域前面
                const actionButtons = controlPanel.querySelector('.action-buttons');
                if (actionButtons) {
                    controlPanel.insertBefore(promptDiv, actionButtons);
                }
            }
        }
        
        // 執行特殊動作
        function executeSpecialAction(action, tile) {
            const controlPanel = document.querySelector('.game-control-panel');
            if (controlPanel) {
                const oldPrompt = controlPanel.querySelector('.game-prompt');
                if (oldPrompt) oldPrompt.remove();
            }
            
            switch(action) {
                case '胡':
                    gameState.gameOver = true;
                    showGameResult('恭喜！你胡牌了！');
                    break;
                case '碰':
                    pongTile(0, tile);
                    break;
                case '吃':
                    chowTile(0, tile);
                    break;
            }
            
            updateDisplay();
        }
        
        // 跳過動作
        function passAction() {
            console.log('玩家選擇跳過特殊動作');
            
            const controlPanel = document.querySelector('.game-control-panel');
            if (controlPanel) {
                const oldPrompt = controlPanel.querySelector('.game-prompt');
                if (oldPrompt) oldPrompt.remove();
            }
            
            hideActionButtons();
            nextTurn();
        }
        
        // 顯示遊戲結果
        function showGameResult(message) {
            const promptArea = document.getElementById('gamePrompt');
            if (promptArea) {
                promptArea.innerHTML = `<div class="alert alert-success">${message}</div>`;
                promptArea.style.display = 'block';
            }
        }
        
        // 檢查是否可以胡牌
        function canWin(playerIndex, newTile = null) {
            if (!gameState.players || !gameState.players[playerIndex] || !gameState.players[playerIndex].hand) {
                console.error('canWin: 玩家手牌不存在', playerIndex);
                return false;
            }
            
            const player = gameState.players[playerIndex];
            let hand = [...player.hand];
            if (newTile) hand.push(newTile);
            
            // 簡化胡牌檢查：14張牌，至少有一個對子
            if (hand.length !== 14) return false;
            
            // 統計牌型
            const counts = {};
            hand.forEach(tile => {
                counts[tile] = (counts[tile] || 0) + 1;
            });
            
            // 檢查是否有對子
            let pairs = 0;
            for (let tile in counts) {
                if (counts[tile] >= 2) pairs++;
            }
            
            return pairs >= 1; // 簡化版：只要有對子就可以胡
        }
        
        // 檢查是否可以碰牌
        function canPong(playerIndex, tile) {
            if (!gameState.players || !gameState.players[playerIndex] || !gameState.players[playerIndex].hand) {
                console.error('canPong: 玩家手牌不存在', playerIndex);
                return false;
            }
            
            const player = gameState.players[playerIndex];
            let count = 0;
            player.hand.forEach(handTile => {
                if (handTile === tile) count++;
            });
            return count >= 2;
        }
        
        // 檢查是否可以吃牌
        function canChow(playerIndex, tile) {
            if (!gameState.players || !gameState.players[playerIndex] || !gameState.players[playerIndex].hand) {
                console.error('canChow: 玩家手牌不存在', playerIndex);
                return false;
            }
            
            const player = gameState.players[playerIndex];
            
            // 簡化版：檢查是否有相鄰的牌
            const numbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
            const suits = ['萬', '條', '筒'];
            
            for (let suit of suits) {
                if (tile.includes(suit)) {
                    const num = tile.replace(suit, '');
                    const numIndex = numbers.indexOf(num);
                    
                    if (numIndex >= 0) {
                        // 檢查順子可能性
                        const prev = numIndex > 0 ? numbers[numIndex - 1] + suit : null;
                        const next = numIndex < 8 ? numbers[numIndex + 1] + suit : null;
                        const prevPrev = numIndex > 1 ? numbers[numIndex - 2] + suit : null;
                        const nextNext = numIndex < 7 ? numbers[numIndex + 2] + suit : null;
                        
                        // 檢查手牌中是否有組成順子的牌
                        const hasSeq1 = prev && next && player.hand.includes(prev) && player.hand.includes(next);
                        const hasSeq2 = prevPrev && prev && player.hand.includes(prevPrev) && player.hand.includes(prev);
                        const hasSeq3 = next && nextNext && player.hand.includes(next) && player.hand.includes(nextNext);
                        
                        if (hasSeq1 || hasSeq2 || hasSeq3) return true;
                    }
                }
            }
            
            return false;
        }
        
        // 執行碰牌
        function pongTile(playerIndex, tile) {
            const player = gameState.players[playerIndex];
            
            // 移除手牌中的兩張相同牌
            let removed = 0;
            for (let i = player.hand.length - 1; i >= 0 && removed < 2; i--) {
                if (player.hand[i] === tile) {
                    player.hand.splice(i, 1);
                    removed++;
                }
            }
            
            // 添加到副露區
            player.exposed.push([tile, tile, tile]);
            
            // 碰牌後輪到該玩家打牌
            gameState.currentPlayer = playerIndex;
            updateCurrentPlayer();
        }
        
        // 執行吃牌
        function chowTile(playerIndex, tile) {
            const player = gameState.players[playerIndex];
            // 簡化版：隨機移除兩張牌組成順子
            const numbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
            const suits = ['萬', '條', '筒'];
            
            for (let suit of suits) {
                if (tile.includes(suit)) {
                    const num = tile.replace(suit, '');
                    const numIndex = numbers.indexOf(num);
                    
                    if (numIndex >= 1 && numIndex <= 7) {
                        const prev = numbers[numIndex - 1] + suit;
                        const next = numbers[numIndex + 1] + suit;
                        
                        if (player.hand.includes(prev) && player.hand.includes(next)) {
                            // 移除手牌
                            player.hand.splice(player.hand.indexOf(prev), 1);
                            player.hand.splice(player.hand.indexOf(next), 1);
                            
                            // 添加到副露區
                            player.exposed.push([prev, tile, next]);
                            break;
                        }
                    }
                }
            }
            
            // 吃牌後輪到該玩家打牌
            gameState.currentPlayer = playerIndex;
            updateCurrentPlayer();
        }
        
        // 更新遊戲顯示
        function updateDisplay() {
            console.log('更新遊戲顯示');
            // 更新玩家手牌
            updatePlayerHand();
            // 更新對手手牌（背面）
            updateOpponentHands();
            // 更新棄牌區
            updateDiscardedTiles();
            // 更新副露區
            updateExposedTiles();
            // 更新遊戲信息
            updateGameInfo();
        }
        
        // 更新遊戲信息
        function updateGameInfo() {
            const remainingElement = document.getElementById('remainingTiles');
            if (remainingElement) {
                remainingElement.textContent = gameState.wallTiles.length;
            }
            
            const currentPlayerElement = document.getElementById('currentPlayer');
            if (currentPlayerElement) {
                currentPlayerElement.textContent = gameState.players[gameState.currentPlayer].name;
            }
        }
        
        // 更新玩家手牌顯示
        function updatePlayerHand() {
            const playerTilesElement = document.getElementById('playerTiles');
            if (!playerTilesElement || !window.gameState || !gameState.players || !gameState.players[0]) {
                return;
            }
            playerTilesElement.innerHTML = '';
            gameState.players[0].hand.forEach((tile, index) => {
                const tileElement = document.createElement('div');
                tileElement.className = 'mahjong-tile';
                tileElement.textContent = tile;
                tileElement.onclick = () => {
                    if (gameState.currentPlayer === 0) {
                        // 玩家打牌
                        discardTile(0, index);
                        updateDisplay();
                        nextTurn();
                    }
                };
                playerTilesElement.appendChild(tileElement);
            });
        }
        
        // 更新對手手牌顯示（背面）
        function updateOpponentHands() {
            // 更新玩家2 (右家)
            const player2Element = document.getElementById('opponent1Cards');
            if (player2Element && gameState.players[1]) {
                player2Element.innerHTML = '';
                gameState.players[1].hand.forEach(() => {
                    const tileElement = document.createElement('div');
                    tileElement.className = 'mahjong-tile opponent-back';
                    tileElement.textContent = '🀫';
                    player2Element.appendChild(tileElement);
                });
            }
            
            // 更新玩家3 (上家)
            const player3Element = document.getElementById('opponent2Cards');
            if (player3Element && gameState.players[2]) {
                player3Element.innerHTML = '';
                gameState.players[2].hand.forEach(() => {
                    const tileElement = document.createElement('div');
                    tileElement.className = 'mahjong-tile opponent-back';
                    tileElement.textContent = '🀫';
                    player3Element.appendChild(tileElement);
                });
            }
            
            // 更新玩家4 (左家)
            const player4Element = document.getElementById('opponent3Cards');
            if (player4Element && gameState.players[3]) {
                player4Element.innerHTML = '';
                gameState.players[3].hand.forEach(() => {
                    const tileElement = document.createElement('div');
                    tileElement.className = 'mahjong-tile opponent-back';
                    tileElement.textContent = '🀫';
                    player4Element.appendChild(tileElement);
                });
            }
        }
        
        // 更新棄牌區顯示
        function updateDiscardedTiles() {
            const discardedElement = document.getElementById('discardedTiles');
            if (!discardedElement) return;
            
            // 保留標題
            discardedElement.innerHTML = '<div class="text-center mb-2"><small>牌桌中央</small></div>';
            
            gameState.players.forEach(player => {
                player.discarded.forEach(tile => {
                    const tileElement = document.createElement('div');
                    tileElement.className = 'mahjong-tile discarded';
                    tileElement.textContent = tile;
                    discardedElement.appendChild(tileElement);
                });
            });
        }
        
        // 更新副露區顯示
        function updateExposedTiles() {
            gameState.players.forEach((player, index) => {
                const elementId = index === 0 ? 'playerExposed' : `opponent${index-1}Exposed`;
                const element = document.getElementById(elementId);
                if (!element) return;
                
                element.innerHTML = '';
                player.exposed.forEach(meld => {
                    const meldElement = document.createElement('div');
                    meldElement.className = 'meld-group';
                    meld.forEach(tile => {
                        const tileElement = document.createElement('div');
                        tileElement.className = 'mahjong-tile exposed';
                        tileElement.textContent = tile;
                        meldElement.appendChild(tileElement);
                    });
                    element.appendChild(meldElement);
                });
            });
        }
        
        // 遊戲按鈕事件處理
        function setupEventListeners() {
            // 摸牌按鈕
            document.getElementById('drawTileBtn')?.addEventListener('click', () => {
                if (gameState.currentPlayer === 0) {
                    const drawnTile = drawTile(0);
                    if (drawnTile) {
                        updateDisplay();
                        // 顯示摸到的牌
                        const drawnTileElement = document.getElementById('drawnTile');
                        if (drawnTileElement) {
                            drawnTileElement.innerHTML = `<div class="mahjong-tile drawn">剛摸到: ${drawnTile}</div>`;
                        }
                    }
                    document.getElementById('drawTileBtn').style.display = 'none';
                }
            });
            
            // 吃牌按鈕
            document.getElementById('chiBtn')?.addEventListener('click', () => {
                // 簡化版吃牌邏輯
                alert('吃牌功能（簡化版）');
                hideActionButtons();
                nextTurn();
            });
            
            // 碰牌按鈕
            document.getElementById('pengBtn')?.addEventListener('click', () => {
                const lastTile = gameState.lastDiscarded;
                const playerHand = gameState.players[0].hand;
                
                // 移除兩張相同的牌
                const indices = [];
                playerHand.forEach((tile, index) => {
                    if (tile === lastTile && indices.length < 2) {
                        indices.push(index);
                    }
                });
                
                // 從後往前移除，避免索引問題
                indices.reverse().forEach(index => playerHand.splice(index, 1));
                
                // 添加到副露區
                gameState.players[0].exposed.push([lastTile, lastTile, lastTile]);
                
                updateDisplay();
                hideActionButtons();
                
                // 碰牌後玩家繼續打牌
                gameState.currentPlayer = 0;
                updateCurrentPlayer();
            });
            
            // 槓牌按鈕
            document.getElementById('gangBtn')?.addEventListener('click', () => {
                alert('槓牌功能（簡化版）');
                hideActionButtons();
                nextTurn();
            });
            
            // 胡牌按鈕
            document.getElementById('huBtn')?.addEventListener('click', () => {
                alert('恭喜胡牌！遊戲結束！');
                gameState.gameOver = true;
            });
            
            // 過按鈕
            document.getElementById('passBtn')?.addEventListener('click', () => {
                hideActionButtons();
                nextTurn();
            });
            
            // 重新開始按鈕
            document.getElementById('mahjongRestart')?.addEventListener('click', () => {
                startNewGame();
            });
            
            // 規則說明按鈕
            document.getElementById('mahjongRules')?.addEventListener('click', () => {
                const rules = `
                4人麻將基本規則：
                
                1. 目標：組成4個順子/刻子 + 1個對子 = 胡牌
                2. 順子：同花色連續3張牌（如一二三萬）
                3. 刻子：3張相同的牌
                4. 對子：2張相同的牌（將牌）
                
                動作說明：
                - 吃：上家打的牌可以與手牌組成順子
                - 碰：任何人打的牌在手牌中有2張相同的
                - 槓：任何人打的牌在手牌中有3張相同的
                - 胡：可以組成胡牌組合
                
                這是簡化版麻將，重點體驗遊戲流程！
                `;
                alert(rules);
            });
        }
        
        // 開始新遊戲
        function startNewGame() {
            console.log('開始新遊戲...');
            if (!window.gameState) {
                console.error('gameState未初始化');
                return;
            }
            
            gameState.currentPlayer = 0;
            gameState.gameOver = false;
            initTiles();
            dealTiles();
            updateDisplay();
            updateCurrentPlayer();
            hideActionButtons();
            
            // 顯示摸牌按鈕
            const drawBtn = document.getElementById('drawTileBtn');
            if (drawBtn) {
                drawBtn.style.display = 'inline-block';
                console.log('摸牌按鈕已顯示');
            } else {
                console.error('找不到摸牌按鈕');
            }
        }
        
        // 初始化遊戲
        setupEventListeners();
        startNewGame();
    }

    addMahjongStyles() {
        if (document.getElementById('mahjong-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'mahjong-styles';
        style.textContent = `
            /* 橫向麻將桌面設計 */
            .mahjong-game {
                padding: 20px;
                background: linear-gradient(135deg, #1a5f3f 0%, #2d4a3e 100%);
                border-radius: 12px;
                min-height: 700px;
                color: white;
            }
            
            .mahjong-table-horizontal {
                display: flex;
                flex-direction: column;
                height: 600px;
                background: radial-gradient(ellipse at center, #2d5a42 0%, #1a4a32 100%);
                border-radius: 15px;
                padding: 15px;
                border: 3px solid #8B4513;
                box-shadow: inset 0 0 20px rgba(0,0,0,0.3);
            }
            
            /* 上家區域 */
            .opponent-top-area {
                height: 120px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: rgba(255,255,255,0.1);
                border-radius: 8px;
                margin-bottom: 10px;
                border: 1px solid rgba(255,255,255,0.2);
            }
            
            .player-info-top {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 8px;
                color: #fff;
            }
            
            .opponent-tiles-horizontal {
                display: flex;
                gap: 2px;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            /* 中間區域 - 左家、桌面、右家 */
            .middle-table-area {
                flex: 1;
                display: flex;
                gap: 15px;
            }
            
            .opponent-left-area,
            .opponent-right-area {
                width: 120px;
                display: flex;
                flex-direction: column;
                align-items: center;
                background: rgba(255,255,255,0.1);
                border-radius: 8px;
                padding: 10px;
                border: 1px solid rgba(255,255,255,0.2);
            }
            
            .player-info-vertical {
                height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 10px;
            }
            
            .text-rotate {
                writing-mode: vertical-lr;
                text-orientation: mixed;
                font-size: 12px;
                font-weight: bold;
                text-align: center;
                line-height: 1.2;
            }
            
            .opponent-tiles-vertical {
                display: flex;
                flex-direction: column;
                gap: 2px;
                align-items: center;
                flex: 1;
                overflow-y: auto;
            }
            
            /* 中央桌面 */
            .center-table {
                flex: 1;
                display: flex;
                flex-direction: column;
                background: rgba(255,255,255,0.05);
                border-radius: 10px;
                padding: 15px;
                border: 2px dashed rgba(255,255,255,0.3);
            }
            
            .table-info {
                text-align: center;
                margin-bottom: 15px;
            }
            
            .game-status {
                display: flex;
                justify-content: space-around;
                align-items: center;
                background: rgba(255,255,255,0.1);
                padding: 8px;
                border-radius: 6px;
                font-size: 12px;
            }
            
            .center-discard-area {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 200px;
            }
            
            .discard-label {
                font-size: 14px;
                margin-bottom: 10px;
                color: rgba(255,255,255,0.7);
            }
            
            .center-tiles-grid {
                display: grid;
                grid-template-columns: repeat(8, 1fr);
                gap: 3px;
                max-width: 300px;
            }
            
            /* 下方玩家區域 */
            .player-bottom-area {
                height: 150px;
                display: flex;
                gap: 15px;
                margin-top: 10px;
            }
            
            .player-hand-section {
                flex: 1;
                background: rgba(255,255,255,0.15);
                border-radius: 8px;
                padding: 12px;
                border: 1px solid rgba(255,255,255,0.3);
            }
            
            .player-info-bottom {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: bold;
            }
            
            .player-tiles-container {
                display: flex;
                gap: 3px;
                overflow-x: auto;
                padding: 5px 0;
            }
            
            .control-panel-right {
                width: 180px;
            }
            
            .game-control-panel {
                background: rgba(255,255,255,0.1);
                border-radius: 8px;
                padding: 12px;
                border: 1px solid rgba(255,255,255,0.2);
                height: 100%;
            }
            
            .action-buttons {
                display: flex;
                flex-direction: column;
                gap: 5px;
                margin-bottom: 15px;
            }
            
            .action-buttons .btn {
                font-size: 12px;
                padding: 6px 10px;
                transition: all 0.2s ease;
            }
            
            .action-buttons .btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 3px 6px rgba(0,0,0,0.3);
            }
            
            .operation-tips {
                background: rgba(255,255,255,0.1);
                border-radius: 6px;
                padding: 8px;
                font-size: 11px;
            }
            
            .tip-title {
                font-weight: bold;
                margin-bottom: 5px;
                color: #fff;
            }
            
            .tip-content {
                line-height: 1.4;
                color: rgba(255,255,255,0.8);
            }
            
            /* 麻將牌樣式 */
            .mahjong-tile {
                width: 28px;
                height: 38px;
                background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
                border: 2px solid #6c757d;
                border-radius: 4px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: bold;
                color: #333;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .mahjong-tile:hover {
                background: linear-gradient(145deg, #e9ecef 0%, #dee2e6 100%);
                border-color: #495057;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            
            .mahjong-tile.selected {
                background: linear-gradient(145deg, #007bff 0%, #0056b3 100%);
                color: white;
                border-color: #004085;
                transform: translateY(-3px);
            }
            
            .mahjong-tile.opponent-back {
                background: linear-gradient(145deg, #6c757d 0%, #495057 100%);
                color: #fff;
                font-size: 12px;
            }
            
            .mahjong-tile.discarded {
                opacity: 0.7;
                transform: scale(0.9);
                background: linear-gradient(145deg, #dc3545 0%, #c82333 100%);
                color: white;
                border-color: #bd2130;
            }
            
            /* 副露區域 */
            .exposed-discarded-area,
            .side-exposed-discarded {
                margin-top: 8px;
                display: flex;
                flex-direction: column;
                gap: 3px;
            }
            
            .mini-exposed,
            .mini-discarded {
                display: flex;
                gap: 1px;
                flex-wrap: wrap;
                justify-content: center;
                min-height: 20px;
                background: rgba(255,255,255,0.05);
                border-radius: 3px;
                padding: 2px;
                font-size: 9px;
            }
            
            /* 響應式設計 */
            @media (max-width: 1200px) {
                .mahjong-game {
                    padding: 10px;
                }
                
                .mahjong-table-horizontal {
                    min-height: 500px;
                }
                
                .opponent-left-area,
                .opponent-right-area {
                    width: 100px;
                }
                
                .control-panel-right {
                    width: 150px;
                }
                
                .mahjong-tile {
                    width: 24px;
                    height: 32px;
                    font-size: 9px;
                }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .game-prompt {
                animation: fadeIn 0.3s ease-in-out;
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
        // modal.show() 已經在 createGameModal 中處理

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