// 2D 像素風格牧場物語遊戲
console.log('載入 2D 牧場物語遊戲...');

class FarmStory2D {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameState = {
            player: {
                x: 400,
                y: 300,
                width: 32,
                height: 32,
                speed: 4,
                direction: 'down',
                animFrame: 0,
                animTimer: 0
            },
            camera: {
                x: 0,
                y: 0
            },
            map: {
                width: 40,
                height: 30,
                tileSize: 32
            },
            keys: {},
            gameLoop: null,
            tools: {
                current: 'hand',
                watering_can: true,
                hoe: true,
                seeds: 10
            },
            crops: [],
            animals: [
                { type: 'cow', x: 200, y: 150, animFrame: 0 },
                { type: 'chicken', x: 350, y: 180, animFrame: 0 },
                { type: 'sheep', x: 180, y: 200, animFrame: 0 }
            ],
            time: 0,
            money: 500
        };
        
        // 地圖數據 (0=草地, 1=泥土, 2=石頭, 3=水, 4=房屋, 5=農田)
        this.generateMap();
        this.init();
    }
    
    generateMap() {
        this.gameState.mapData = [];
        for (let y = 0; y < this.gameState.map.height; y++) {
            this.gameState.mapData[y] = [];
            for (let x = 0; x < this.gameState.map.width; x++) {
                if (x < 2 || x > 37 || y < 2 || y > 27) {
                    this.gameState.mapData[y][x] = 3; // 邊界水域
                } else if (x > 10 && x < 20 && y > 10 && y < 20) {
                    this.gameState.mapData[y][x] = 5; // 農田區域
                } else if (Math.random() < 0.1) {
                    this.gameState.mapData[y][x] = 2; // 隨機石頭
                } else if (x > 5 && x < 15 && y > 5 && y < 10) {
                    this.gameState.mapData[y][x] = 1; // 泥土區域
                } else {
                    this.gameState.mapData[y][x] = 0; // 草地
                }
            }
        }
        
        // 添加房屋
        this.gameState.mapData[8][8] = 4;
        this.gameState.mapData[8][9] = 4;
        this.gameState.mapData[9][8] = 4;
        this.gameState.mapData[9][9] = 4;
    }
    
    init() {
        this.createGameInterface();
        this.setupEventListeners();
        this.startGameLoop();
    }
    
    createGameInterface() {
        const gameContainer = document.getElementById('gameContainer');
        if (!gameContainer) {
            console.error('找不到遊戲容器');
            return;
        }
        
        gameContainer.innerHTML = `
            <div class="farm-game-container">
                <div class="game-header">
                    <h4>🏡 2D 像素牧場物語</h4>
                    <div class="game-stats">
                        <span>💰 <span id="money">${this.gameState.money}</span></span>
                        <span>🌱 種子: <span id="seeds">${this.gameState.tools.seeds}</span></span>
                        <span>⏰ <span id="gameTime">06:00</span></span>
                    </div>
                    <button onclick="showGameSelection()" class="back-btn">← 返回</button>
                </div>
                
                <div class="game-main">
                    <canvas id="farmCanvas" width="800" height="600"></canvas>
                    
                    <div class="game-controls">
                        <div class="controls-section">
                            <h6>控制方式</h6>
                            <div class="control-keys">
                                <div class="key-row">
                                    <span class="key">↑</span>
                                </div>
                                <div class="key-row">
                                    <span class="key">←</span>
                                    <span class="key">↓</span>
                                    <span class="key">→</span>
                                </div>
                            </div>
                            <p>方向鍵：移動角色</p>
                            <p>空白鍵：使用工具</p>
                            <p>E鍵：互動</p>
                        </div>
                        
                        <div class="tools-section">
                            <h6>工具欄</h6>
                            <div class="tool-buttons">
                                <button class="tool-btn active" onclick="farmGame.selectTool('hand')" data-tool="hand">
                                    🤚 手
                                </button>
                                <button class="tool-btn" onclick="farmGame.selectTool('hoe')" data-tool="hoe">
                                    🔨 鋤頭
                                </button>
                                <button class="tool-btn" onclick="farmGame.selectTool('watering_can')" data-tool="watering_can">
                                    🚿 澆水壺
                                </button>
                                <button class="tool-btn" onclick="farmGame.selectTool('seeds')" data-tool="seeds">
                                    🌱 種子
                                </button>
                            </div>
                        </div>
                        
                        <div class="info-section">
                            <h6>遊戲提示</h6>
                            <div id="gameInfo" class="game-info">
                                歡迎來到牧場！使用方向鍵移動，空白鍵使用工具。
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.canvas = document.getElementById('farmCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 設置像素風格渲染
        this.ctx.imageSmoothingEnabled = false;
        this.canvas.style.imageRendering = 'pixelated';
    }
    
    setupEventListeners() {
        // 鍵盤事件
        document.addEventListener('keydown', (e) => {
            this.gameState.keys[e.code] = true;
            
            // 防止方向鍵滾動頁面
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
            
            // 工具使用
            if (e.code === 'Space') {
                this.useTool();
            }
            
            // 互動
            if (e.code === 'KeyE') {
                this.interact();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.gameState.keys[e.code] = false;
        });
        
        // Canvas 點擊事件
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handleCanvasClick(x, y);
        });
    }
    
    handleCanvasClick(x, y) {
        // 將畫面座標轉換為世界座標
        const worldX = x + this.gameState.camera.x;
        const worldY = y + this.gameState.camera.y;
        const tileX = Math.floor(worldX / 32);
        const tileY = Math.floor(worldY / 32);
        
        // 檢查是否點擊動物
        this.gameState.animals.forEach(animal => {
            if (Math.abs(animal.x - worldX) < 32 && Math.abs(animal.y - worldY) < 32) {
                this.interactWithAnimal(animal);
            }
        });
    }
    
    startGameLoop() {
        this.gameState.gameLoop = setInterval(() => {
            this.update();
            this.render();
        }, 1000 / 60); // 60 FPS
    }
    
    update() {
        this.updatePlayer();
        this.updateCamera();
        this.updateTime();
        this.updateCrops();
        this.updateAnimals();
    }
    
    updatePlayer() {
        const player = this.gameState.player;
        let moved = false;
        
        // 移動處理
        if (this.gameState.keys['ArrowUp']) {
            player.y -= player.speed;
            player.direction = 'up';
            moved = true;
        }
        if (this.gameState.keys['ArrowDown']) {
            player.y += player.speed;
            player.direction = 'down';
            moved = true;
        }
        if (this.gameState.keys['ArrowLeft']) {
            player.x -= player.speed;
            player.direction = 'left';
            moved = true;
        }
        if (this.gameState.keys['ArrowRight']) {
            player.x += player.speed;
            player.direction = 'right';
            moved = true;
        }
        
        // 邊界檢查
        const mapWidth = this.gameState.map.width * this.gameState.map.tileSize;
        const mapHeight = this.gameState.map.height * this.gameState.map.tileSize;
        
        player.x = Math.max(32, Math.min(mapWidth - 64, player.x));
        player.y = Math.max(32, Math.min(mapHeight - 64, player.y));
        
        // 碰撞檢測
        this.checkCollisions();
        
        // 動畫更新
        if (moved) {
            player.animTimer++;
            if (player.animTimer > 10) {
                player.animFrame = (player.animFrame + 1) % 4;
                player.animTimer = 0;
            }
        } else {
            player.animFrame = 0;
        }
    }
    
    checkCollisions() {
        const player = this.gameState.player;
        const tileX = Math.floor(player.x / 32);
        const tileY = Math.floor(player.y / 32);
        
        // 檢查當前瓦片
        if (this.gameState.mapData[tileY] && this.gameState.mapData[tileY][tileX] === 3) {
            // 如果踩到水，退回上一個位置
            if (this.gameState.keys['ArrowUp']) player.y += player.speed;
            if (this.gameState.keys['ArrowDown']) player.y -= player.speed;
            if (this.gameState.keys['ArrowLeft']) player.x += player.speed;
            if (this.gameState.keys['ArrowRight']) player.x -= player.speed;
        }
    }
    
    updateCamera() {
        const player = this.gameState.player;
        this.gameState.camera.x = player.x - 400;
        this.gameState.camera.y = player.y - 300;
        
        // 相機邊界限制
        const mapWidth = this.gameState.map.width * this.gameState.map.tileSize;
        const mapHeight = this.gameState.map.height * this.gameState.map.tileSize;
        
        this.gameState.camera.x = Math.max(0, Math.min(mapWidth - 800, this.gameState.camera.x));
        this.gameState.camera.y = Math.max(0, Math.min(mapHeight - 600, this.gameState.camera.y));
    }
    
    updateTime() {
        this.gameState.time += 1/60;
        const hours = Math.floor(this.gameState.time * 24 / 3600) % 24 + 6;
        const minutes = Math.floor((this.gameState.time * 24 * 60 / 3600) % 60);
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        const timeElement = document.getElementById('gameTime');
        if (timeElement) {
            timeElement.textContent = timeStr;
        }
    }
    
    updateCrops() {
        this.gameState.crops.forEach(crop => {
            crop.growthTime++;
            if (crop.growthTime >= crop.maxGrowthTime && !crop.ready) {
                crop.ready = true;
                this.showInfo('🌾 作物成熟了！');
            }
        });
    }
    
    updateAnimals() {
        this.gameState.animals.forEach(animal => {
            animal.animFrame = Math.floor(this.gameState.time * 2) % 2;
        });
    }
    
    render() {
        // 清空畫布
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, 800, 600);
        
        this.renderMap();
        this.renderCrops();
        this.renderAnimals();
        this.renderPlayer();
        this.renderUI();
    }
    
    renderMap() {
        const startX = Math.floor(this.gameState.camera.x / 32);
        const startY = Math.floor(this.gameState.camera.y / 32);
        const endX = Math.min(startX + 26, this.gameState.map.width);
        const endY = Math.min(startY + 20, this.gameState.map.height);
        
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                if (this.gameState.mapData[y] && this.gameState.mapData[y][x] !== undefined) {
                    this.renderTile(x, y, this.gameState.mapData[y][x]);
                }
            }
        }
    }
    
    renderTile(x, y, tileType) {
        const screenX = x * 32 - this.gameState.camera.x;
        const screenY = y * 32 - this.gameState.camera.y;
        
        switch (tileType) {
            case 0: // 草地
                this.ctx.fillStyle = '#32CD32';
                this.ctx.fillRect(screenX, screenY, 32, 32);
                // 添加草地紋理
                this.ctx.fillStyle = '#228B22';
                for (let i = 0; i < 8; i++) {
                    const px = screenX + Math.random() * 32;
                    const py = screenY + Math.random() * 32;
                    this.ctx.fillRect(px, py, 2, 2);
                }
                break;
                
            case 1: // 泥土
                this.ctx.fillStyle = '#8B4513';
                this.ctx.fillRect(screenX, screenY, 32, 32);
                break;
                
            case 2: // 石頭
                this.ctx.fillStyle = '#696969';
                this.ctx.fillRect(screenX, screenY, 32, 32);
                this.ctx.fillStyle = '#A9A9A9';
                this.ctx.fillRect(screenX + 4, screenY + 4, 24, 24);
                break;
                
            case 3: // 水
                this.ctx.fillStyle = '#4169E1';
                this.ctx.fillRect(screenX, screenY, 32, 32);
                // 水波效果
                this.ctx.fillStyle = '#87CEEB';
                const wave = Math.sin(this.gameState.time * 2) * 4;
                this.ctx.fillRect(screenX + wave, screenY + 8, 32 - wave * 2, 8);
                break;
                
            case 4: // 房屋
                this.ctx.fillStyle = '#CD853F';
                this.ctx.fillRect(screenX, screenY, 32, 32);
                this.ctx.fillStyle = '#8B0000';
                this.ctx.fillRect(screenX + 4, screenY, 24, 16);
                break;
                
            case 5: // 農田
                this.ctx.fillStyle = '#654321';
                this.ctx.fillRect(screenX, screenY, 32, 32);
                // 農田溝壑
                this.ctx.fillStyle = '#4A4A4A';
                for (let i = 0; i < 4; i++) {
                    this.ctx.fillRect(screenX, screenY + i * 8, 32, 2);
                }
                break;
        }
    }
    
    renderPlayer() {
        const player = this.gameState.player;
        const screenX = player.x - this.gameState.camera.x;
        const screenY = player.y - this.gameState.camera.y;
        
        // 玩家身體
        this.ctx.fillStyle = '#FFE4C4';
        this.ctx.fillRect(screenX + 8, screenY + 8, 16, 20);
        
        // 玩家頭部
        this.ctx.fillStyle = '#FDBCB4';
        this.ctx.fillRect(screenX + 10, screenY + 4, 12, 12);
        
        // 玩家頭髮
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(screenX + 8, screenY, 16, 8);
        
        // 玩家眼睛
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(screenX + 12, screenY + 8, 2, 2);
        this.ctx.fillRect(screenX + 18, screenY + 8, 2, 2);
        
        // 根據方向調整外觀
        switch (player.direction) {
            case 'left':
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(screenX + 11, screenY + 8, 2, 2);
                break;
            case 'right':
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(screenX + 19, screenY + 8, 2, 2);
                break;
        }
        
        // 腿部動畫
        this.ctx.fillStyle = '#0000FF';
        if (player.animFrame % 2 === 0) {
            this.ctx.fillRect(screenX + 10, screenY + 24, 4, 8);
            this.ctx.fillRect(screenX + 18, screenY + 24, 4, 8);
        } else {
            this.ctx.fillRect(screenX + 8, screenY + 24, 4, 8);
            this.ctx.fillRect(screenX + 20, screenY + 24, 4, 8);
        }
    }
    
    renderAnimals() {
        this.gameState.animals.forEach(animal => {
            const screenX = animal.x - this.gameState.camera.x;
            const screenY = animal.y - this.gameState.camera.y;
            
            if (screenX > -32 && screenX < 832 && screenY > -32 && screenY < 632) {
                this.renderAnimal(screenX, screenY, animal);
            }
        });
    }
    
    renderAnimal(x, y, animal) {
        switch (animal.type) {
            case 'cow':
                // 牛身體
                this.ctx.fillStyle = '#FFFACD';
                this.ctx.fillRect(x, y + 8, 32, 20);
                // 牛頭
                this.ctx.fillStyle = '#F5DEB3';
                this.ctx.fillRect(x + 8, y, 16, 16);
                // 斑點
                this.ctx.fillStyle = '#8B4513';
                this.ctx.fillRect(x + 4, y + 12, 4, 4);
                this.ctx.fillRect(x + 20, y + 16, 4, 4);
                break;
                
            case 'chicken':
                // 雞身體
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.fillRect(x + 4, y + 8, 24, 16);
                // 雞頭
                this.ctx.fillStyle = '#FFE4E1';
                this.ctx.fillRect(x + 8, y + 4, 12, 8);
                // 雞冠
                this.ctx.fillStyle = '#FF0000';
                this.ctx.fillRect(x + 12, y, 8, 4);
                break;
                
            case 'sheep':
                // 羊身體（毛茸茸）
                this.ctx.fillStyle = '#F5F5F5';
                this.ctx.fillRect(x, y + 8, 32, 20);
                // 羊頭
                this.ctx.fillStyle = '#DCDCDC';
                this.ctx.fillRect(x + 8, y + 4, 16, 12);
                // 羊腿
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(x + 4, y + 24, 4, 8);
                this.ctx.fillRect(x + 12, y + 24, 4, 8);
                this.ctx.fillRect(x + 16, y + 24, 4, 8);
                this.ctx.fillRect(x + 24, y + 24, 4, 8);
                break;
        }
    }
    
    renderCrops() {
        this.gameState.crops.forEach(crop => {
            const screenX = crop.x - this.gameState.camera.x;
            const screenY = crop.y - this.gameState.camera.y;
            
            if (screenX > -32 && screenX < 832 && screenY > -32 && screenY < 632) {
                if (crop.ready) {
                    this.ctx.fillStyle = '#FFD700';
                } else {
                    this.ctx.fillStyle = '#32CD32';
                }
                
                const growthStage = Math.min(3, Math.floor(crop.growthTime / (crop.maxGrowthTime / 4)));
                const height = 4 + growthStage * 4;
                
                this.ctx.fillRect(screenX + 14, screenY + 32 - height, 4, height);
                
                if (crop.ready) {
                    // 成熟的作物有花朵
                    this.ctx.fillStyle = '#FFD700';
                    this.ctx.fillRect(screenX + 12, screenY + 16, 8, 8);
                }
            }
        });
    }
    
    renderUI() {
        // 工具提示
        if (this.gameState.tools.current !== 'hand') {
            this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
            this.ctx.fillRect(10, 10, 200, 30);
            this.ctx.fillStyle = '#FFF';
            this.ctx.font = '16px monospace';
            this.ctx.fillText(`當前工具: ${this.getToolName()}`, 20, 30);
        }
        
        // 迷你地圖
        this.renderMiniMap();
    }
    
    renderMiniMap() {
        const miniMapSize = 120;
        const miniMapX = 800 - miniMapSize - 10;
        const miniMapY = 10;
        
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(miniMapX, miniMapY, miniMapSize, miniMapSize);
        
        const scaleX = miniMapSize / (this.gameState.map.width * 32);
        const scaleY = miniMapSize / (this.gameState.map.height * 32);
        
        // 玩家位置
        const playerMiniX = miniMapX + this.gameState.player.x * scaleX;
        const playerMiniY = miniMapY + this.gameState.player.y * scaleY;
        
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(playerMiniX - 2, playerMiniY - 2, 4, 4);
        
        // 動物位置
        this.ctx.fillStyle = '#FFFF00';
        this.gameState.animals.forEach(animal => {
            const animalMiniX = miniMapX + animal.x * scaleX;
            const animalMiniY = miniMapY + animal.y * scaleY;
            this.ctx.fillRect(animalMiniX - 1, animalMiniY - 1, 2, 2);
        });
    }
    
    selectTool(tool) {
        this.gameState.tools.current = tool;
        
        // 更新UI
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tool="${tool}"]`).classList.add('active');
        
        this.showInfo(`選擇了: ${this.getToolName()}`);
    }
    
    getToolName() {
        const names = {
            'hand': '手',
            'hoe': '鋤頭',
            'watering_can': '澆水壺',
            'seeds': '種子'
        };
        return names[this.gameState.tools.current] || '未知';
    }
    
    useTool() {
        const player = this.gameState.player;
        const tileX = Math.floor(player.x / 32);
        const tileY = Math.floor(player.y / 32);
        
        switch (this.gameState.tools.current) {
            case 'hoe':
                this.hoeTile(tileX, tileY);
                break;
            case 'watering_can':
                this.waterCrops(tileX, tileY);
                break;
            case 'seeds':
                this.plantSeeds(tileX, tileY);
                break;
        }
    }
    
    hoeTile(x, y) {
        if (this.gameState.mapData[y] && this.gameState.mapData[y][x] === 0) {
            this.gameState.mapData[y][x] = 5; // 轉換為農田
            this.showInfo('整地完成！');
        }
    }
    
    plantSeeds(x, y) {
        if (this.gameState.tools.seeds > 0 && 
            this.gameState.mapData[y] && 
            this.gameState.mapData[y][x] === 5) {
            
            // 檢查是否已有作物
            const existingCrop = this.gameState.crops.find(crop => 
                Math.floor(crop.x / 32) === x && Math.floor(crop.y / 32) === y
            );
            
            if (!existingCrop) {
                this.gameState.crops.push({
                    x: x * 32 + 16,
                    y: y * 32 + 16,
                    growthTime: 0,
                    maxGrowthTime: 1800, // 30秒
                    ready: false
                });
                
                this.gameState.tools.seeds--;
                this.updateUI();
                this.showInfo('種子已種植！');
            } else {
                this.showInfo('這裡已經有作物了！');
            }
        } else if (this.gameState.tools.seeds <= 0) {
            this.showInfo('沒有種子了！');
        } else {
            this.showInfo('需要在農田上種植！');
        }
    }
    
    waterCrops(x, y) {
        const crop = this.gameState.crops.find(crop => 
            Math.floor(crop.x / 32) === x && Math.floor(crop.y / 32) === y
        );
        
        if (crop && !crop.ready) {
            crop.growthTime += 300; // 加速成長
            this.showInfo('澆水完成！');
        } else {
            this.showInfo('這裡沒有需要澆水的作物！');
        }
    }
    
    interact() {
        const player = this.gameState.player;
        
        // 檢查是否與動物互動
        this.gameState.animals.forEach(animal => {
            const distance = Math.sqrt(
                Math.pow(player.x - animal.x, 2) + 
                Math.pow(player.y - animal.y, 2)
            );
            
            if (distance < 50) {
                this.interactWithAnimal(animal);
            }
        });
        
        // 檢查是否收割作物
        this.gameState.crops.forEach((crop, index) => {
            const distance = Math.sqrt(
                Math.pow(player.x - crop.x, 2) + 
                Math.pow(player.y - crop.y, 2)
            );
            
            if (distance < 32 && crop.ready) {
                this.harvestCrop(index);
            }
        });
    }
    
    interactWithAnimal(animal) {
        const messages = {
            'cow': ['🐄 哞～', '🥛 牛兒很開心！', '🐄 牛兒想要更多草料'],
            'chicken': ['🐔 咯咯咯～', '🥚 下了一顆蛋！', '🐔 雞雞很活潑'],
            'sheep': ['🐑 咩～', '🧶 羊毛很蓬鬆！', '🐑 羊咩咩很溫順']
        };
        
        const animalMessages = messages[animal.type] || ['🐾 動物很友好！'];
        const randomMessage = animalMessages[Math.floor(Math.random() * animalMessages.length)];
        
        this.showInfo(randomMessage);
        
        // 獲得金錢
        this.gameState.money += 10;
        this.updateUI();
    }
    
    harvestCrop(index) {
        this.gameState.crops.splice(index, 1);
        this.gameState.money += 50;
        this.gameState.tools.seeds += 2; // 收成時獲得種子
        this.updateUI();
        this.showInfo('🌾 收成成功！獲得 50 金幣和 2 顆種子');
    }
    
    showInfo(message) {
        const infoElement = document.getElementById('gameInfo');
        if (infoElement) {
            infoElement.textContent = message;
            setTimeout(() => {
                infoElement.textContent = '使用方向鍵移動，空白鍵使用工具，E鍵互動。';
            }, 3000);
        }
    }
    
    updateUI() {
        const moneyElement = document.getElementById('money');
        const seedsElement = document.getElementById('seeds');
        
        if (moneyElement) moneyElement.textContent = this.gameState.money;
        if (seedsElement) seedsElement.textContent = this.gameState.tools.seeds;
    }
    
    destroy() {
        if (this.gameState.gameLoop) {
            clearInterval(this.gameState.gameLoop);
        }
    }
}

// 全域變數
let farmGame = null;

// 載入 2D 牧場遊戲
function load2DFarmGame() {
    console.log('載入 2D 牧場遊戲');
    
    if (farmGame) {
        farmGame.destroy();
    }
    
    farmGame = new FarmStory2D();
}

// 在遊戲選擇中加入此遊戲
function loadGameSelection(gameType) {
    console.log('載入遊戲:', gameType);
    
    const gameContainer = document.getElementById('gameContainer');
    if (!gameContainer) {
        console.error('找不到遊戲容器');
        return;
    }
    
    if (gameType === 'farm2d') {
        load2DFarmGame();
        return;
    }
    
    // 原有的遊戲選擇邏輯
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

// 修改遊戲選擇畫面
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
                <button onclick="loadGameSelection('farm2d')" class="game-btn farm-btn">
                    <div class="game-icon">🏡</div>
                    <div class="game-name">2D 牧場物語</div>
                    <div class="game-desc">像素風格農場遊戲</div>
                </button>
            </div>
        </div>
    `;
}

console.log('2D 牧場物語遊戲載入完成');