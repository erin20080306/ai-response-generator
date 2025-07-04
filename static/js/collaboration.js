// Collaboration Module - Basic collaboration functionality
class Collaboration {
    constructor() {
        this.isConnected = false;
        this.roomId = null;
        this.socket = null;
    }

    init() {
        console.log('Collaboration module initialized');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Basic collaboration event setup
        const createRoomBtn = document.getElementById('createRoomBtn');
        const joinRoomBtn = document.getElementById('joinRoomBtn');
        
        if (createRoomBtn) {
            createRoomBtn.addEventListener('click', () => this.createRoom());
        }
        
        if (joinRoomBtn) {
            joinRoomBtn.addEventListener('click', () => this.joinRoom());
        }
    }

    createRoom() {
        console.log('Creating collaboration room...');
        // Basic room creation functionality
        this.roomId = this.generateRoomId();
        this.showMessage('房間已創建：' + this.roomId);
    }

    joinRoom() {
        console.log('Joining collaboration room...');
        // Basic room joining functionality
        this.showMessage('正在加入房間...');
    }

    generateRoomId() {
        return Math.random().toString(36).substr(2, 9);
    }

    showMessage(message) {
        console.log('Collaboration: ' + message);
    }
}

// Export for global use
window.Collaboration = Collaboration;