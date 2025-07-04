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
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('俄羅斯方塊', 80, 50);
        ctx.fillText('準備開始！', 90, 100);
    }
}

function initMahjongGame() {
    const board = document.getElementById('mahjongBoard');
    if (board) {
        board.innerHTML = `
            <div class="text-center">
                <p>4人麻將遊戲準備中...</p>
                <div class="mahjong-tiles">
                    <div class="tile" onclick="playTile(this)">🀄</div>
                    <div class="tile" onclick="playTile(this)">🀅</div>
                    <div class="tile" onclick="playTile(this)">🀆</div>
                    <div class="tile" onclick="playTile(this)">🀇</div>
                </div>
                <p class="mt-3">點擊牌張進行遊戲</p>
            </div>
        `;
    }
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