/**
 * Node.js Express 版本農場物語遊戲伺服器
 * 包含即時多人功能、Canvas效果、AI整合
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('rate-limiter-flexible');
require('dotenv').config();

// 初始化Express應用
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// 中間件配置
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rate Limiting
const rateLimiter = new rateLimit.RateLimiterMemory({
    keyPrefix: 'api',
    points: 100,
    duration: 60,
});

// Session配置
app.use(session({
    secret: process.env.SESSION_SECRET || 'farm-story-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/farm-story'
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7天
    }
}));

// MongoDB連接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/farm-story', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// 遊戲數據模型
const GameStateSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    player: {
        x: { type: Number, default: 300 },
        y: { type: Number, default: 250 },
        health: { type: Number, default: 100 },
        energy: { type: Number, default: 100 },
        money: { type: Number, default: 500 },
        level: { type: Number, default: 1 },
        experience: { type: Number, default: 0 }
    },
    inventory: {
        seeds: {
            carrot: { type: Number, default: 10 },
            corn: { type: Number, default: 5 },
            potato: { type: Number, default: 3 }
        },
        crops: {
            carrot: { type: Number, default: 0 },
            corn: { type: Number, default: 0 },
            potato: { type: Number, default: 0 }
        },
        tools: {
            hoe: { type: Number, default: 1 },
            watering_can: { type: Number, default: 1 },
            axe: { type: Number, default: 1 },
            pickaxe: { type: Number, default: 1 }
        },
        items: {
            energy_potion: { type: Number, default: 3 },
            health_potion: { type: Number, default: 2 }
        }
    },
    npcs: {
        mayor_tom: { friendship: { type: Number, default: 50 }, lastTalk: Date },
        shop_mary: { friendship: { type: Number, default: 30 }, lastTalk: Date },
        blacksmith_jack: { friendship: { type: Number, default: 40 }, lastTalk: Date },
        doctor_lily: { friendship: { type: Number, default: 20 }, lastTalk: Date }
    },
    weather: { type: String, default: 'sunny' },
    season: { type: String, default: '春季' },
    day: { type: Number, default: 1 },
    aiUsesLeft: { type: Number, default: 10 },
    lastUpdated: { type: Date, default: Date.now }
});

const GameState = mongoose.model('GameState', GameStateSchema);

// 用戶模型
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: String,
    createdAt: { type: Date, default: Date.now },
    lastLogin: Date,
    isActive: { type: Boolean, default: true }
});

const User = mongoose.model('User', UserSchema);

// 房間模型（多人遊戲）
const RoomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    owner: { type: String, required: true },
    players: [String],
    maxPlayers: { type: Number, default: 4 },
    isPrivate: { type: Boolean, default: false },
    password: String,
    gameSettings: {
        difficulty: { type: String, default: 'normal' },
        weatherEnabled: { type: Boolean, default: true },
        aiAssistEnabled: { type: Boolean, default: true }
    },
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
});

const Room = mongoose.model('Room', RoomSchema);

// API路由

// 用戶註冊
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // 檢查用戶是否已存在
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ error: '用戶已存在' });
        }
        
        // 加密密碼
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // 創建新用戶
        const user = new User({
            username,
            email,
            password: hashedPassword
        });
        
        await user.save();
        
        // 創建初始遊戲狀態
        const gameState = new GameState({ userId: user._id });
        await gameState.save();
        
        // 生成JWT
        const token = jwt.sign(
            { userId: user._id, username },
            process.env.JWT_SECRET || 'jwt-secret',
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            token,
            user: { id: user._id, username, email }
        });
        
    } catch (error) {
        console.error('註冊錯誤:', error);
        res.status(500).json({ error: '伺服器錯誤' });
    }
});

// 用戶登入
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 查找用戶
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: '用戶不存在' });
        }
        
        // 驗證密碼
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: '密碼錯誤' });
        }
        
        // 更新最後登入時間
        user.lastLogin = new Date();
        await user.save();
        
        // 生成JWT
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'jwt-secret',
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            token,
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email 
            }
        });
        
    } catch (error) {
        console.error('登入錯誤:', error);
        res.status(500).json({ error: '伺服器錯誤' });
    }
});

// 獲取遊戲狀態
app.get('/api/game-state', authenticateToken, async (req, res) => {
    try {
        let gameState = await GameState.findOne({ userId: req.user.userId });
        
        if (!gameState) {
            gameState = new GameState({ userId: req.user.userId });
            await gameState.save();
        }
        
        res.json({ success: true, gameState });
        
    } catch (error) {
        console.error('獲取遊戲狀態錯誤:', error);
        res.status(500).json({ error: '伺服器錯誤' });
    }
});

// 保存遊戲狀態
app.post('/api/save-game', authenticateToken, async (req, res) => {
    try {
        const { gameState } = req.body;
        
        await GameState.findOneAndUpdate(
            { userId: req.user.userId },
            { 
                ...gameState,
                lastUpdated: new Date()
            },
            { upsert: true, new: true }
        );
        
        res.json({ success: true, message: '遊戲狀態已保存' });
        
    } catch (error) {
        console.error('保存遊戲狀態錯誤:', error);
        res.status(500).json({ error: '伺服器錯誤' });
    }
});

// AI聊天端點
app.post('/api/ai-chat', authenticateToken, async (req, res) => {
    try {
        const { message, gameContext } = req.body;
        
        // 檢查AI使用次數
        const gameState = await GameState.findOne({ userId: req.user.userId });
        if (gameState.aiUsesLeft <= 0) {
            return res.status(400).json({ 
                error: 'AI使用次數已用完',
                aiUsesLeft: 0 
            });
        }
        
        // 這裡整合OpenAI API
        const aiResponse = await generateAIResponse(message, gameContext);
        
        // 減少AI使用次數
        gameState.aiUsesLeft -= 1;
        await gameState.save();
        
        res.json({
            success: true,
            response: aiResponse,
            aiUsesLeft: gameState.aiUsesLeft
        });
        
    } catch (error) {
        console.error('AI聊天錯誤:', error);
        res.status(500).json({ error: '伺服器錯誤' });
    }
});

// 創建房間
app.post('/api/rooms', authenticateToken, async (req, res) => {
    try {
        const { name, maxPlayers, isPrivate, password, gameSettings } = req.body;
        
        const roomId = generateRoomId();
        const room = new Room({
            roomId,
            name,
            owner: req.user.userId,
            players: [req.user.userId],
            maxPlayers,
            isPrivate,
            password: password ? await bcrypt.hash(password, 10) : undefined,
            gameSettings
        });
        
        await room.save();
        
        res.json({ success: true, room });
        
    } catch (error) {
        console.error('創建房間錯誤:', error);
        res.status(500).json({ error: '伺服器錯誤' });
    }
});

// Socket.IO事件處理
io.on('connection', (socket) => {
    console.log('用戶連接:', socket.id);
    
    // 加入房間
    socket.on('join-room', async (data) => {
        try {
            const { roomId, userId } = data;
            const room = await Room.findOne({ roomId });
            
            if (!room) {
                socket.emit('error', '房間不存在');
                return;
            }
            
            if (room.players.length >= room.maxPlayers) {
                socket.emit('error', '房間已滿');
                return;
            }
            
            // 加入房間
            socket.join(roomId);
            
            if (!room.players.includes(userId)) {
                room.players.push(userId);
                await room.save();
            }
            
            // 通知房間內其他玩家
            socket.to(roomId).emit('player-joined', {
                userId,
                playersCount: room.players.length
            });
            
            socket.emit('room-joined', { room });
            
        } catch (error) {
            console.error('加入房間錯誤:', error);
            socket.emit('error', '加入房間失敗');
        }
    });
    
    // 玩家移動
    socket.on('player-move', (data) => {
        socket.to(data.roomId).emit('player-moved', {
            userId: data.userId,
            x: data.x,
            y: data.y
        });
    });
    
    // 遊戲動作
    socket.on('game-action', (data) => {
        socket.to(data.roomId).emit('game-action-broadcast', data);
    });
    
    // Canvas效果同步
    socket.on('canvas-effect', (data) => {
        socket.to(data.roomId).emit('canvas-effect-sync', data);
    });
    
    // 斷線處理
    socket.on('disconnect', () => {
        console.log('用戶斷線:', socket.id);
    });
});

// 中間件函數
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: '需要認證' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET || 'jwt-secret', (err, user) => {
        if (err) {
            return res.status(403).json({ error: '無效的token' });
        }
        req.user = user;
        next();
    });
}

// 輔助函數
function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function generateAIResponse(message, gameContext) {
    // 這裡整合OpenAI API
    // 暫時返回模擬回應
    const responses = [
        '建議先種植蘿蔔，成長快速且利潤不錯！',
        '記得定期澆水，作物才會健康成長。',
        '去森林收集木材可以賺取額外金錢。',
        '升級工具可以提高工作效率。',
        '與村民多互動可以提升友好度。'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// 啟動伺服器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`伺服器運行在端口 ${PORT}`);
});

// 錯誤處理
process.on('uncaughtException', (error) => {
    console.error('未捕獲的異常:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('未處理的Promise拒絕:', reason);
    process.exit(1);
});

module.exports = { app, server, io };