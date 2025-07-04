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
}

// 導出類別
window.GameCenter = GameCenter;