/**
 * Canvas特效系統 - 專業遊戲視覺增強
 * 包含粒子系統、天氣效果、動畫增強
 */

class CanvasEffectSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.weatherParticles = [];
        this.isInitialized = false;
        this.animationId = null;
    }

    // 初始化Canvas系統
    init(gameWorldElement) {
        if (this.isInitialized) return;

        // 創建Canvas層
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'game-effects-canvas';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '100';
        
        // 設置Canvas尺寸
        const rect = gameWorldElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        this.ctx = this.canvas.getContext('2d');
        gameWorldElement.appendChild(this.canvas);
        
        this.isInitialized = true;
        this.startAnimationLoop();
        
        console.log('Canvas特效系統初始化完成');
    }

    // 開始動畫循環
    startAnimationLoop() {
        const animate = () => {
            this.update();
            this.render();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    // 更新粒子系統
    update() {
        // 更新普通粒子
        this.particles = this.particles.filter(particle => {
            particle.update();
            return particle.life > 0;
        });

        // 更新天氣粒子
        this.weatherParticles = this.weatherParticles.filter(particle => {
            particle.update();
            return particle.life > 0;
        });

        // 隨機生成環境粒子
        if (Math.random() < 0.1) {
            this.createAmbientParticle();
        }
    }

    // 渲染所有效果
    render() {
        if (!this.ctx) return;

        // 清除畫布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 渲染所有粒子
        [...this.particles, ...this.weatherParticles].forEach(particle => {
            this.renderParticle(particle);
        });
    }

    // 渲染單個粒子
    renderParticle(particle) {
        this.ctx.save();
        
        // 設置透明度
        this.ctx.globalAlpha = particle.life;
        
        // 設置顏色
        this.ctx.fillStyle = particle.color;
        this.ctx.strokeStyle = particle.color;
        
        // 繪製粒子
        switch (particle.type) {
            case 'circle':
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
                break;
                
            case 'star':
                this.drawStar(particle.x, particle.y, particle.size);
                break;
                
            case 'sparkle':
                this.drawSparkle(particle.x, particle.y, particle.size);
                break;
                
            case 'leaf':
                this.drawLeaf(particle.x, particle.y, particle.size, particle.rotation);
                break;
        }
        
        this.ctx.restore();
    }

    // 繪製星星
    drawStar(x, y, size) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size);
        this.ctx.lineTo(x + size * 0.3, y - size * 0.3);
        this.ctx.lineTo(x + size, y);
        this.ctx.lineTo(x + size * 0.3, y + size * 0.3);
        this.ctx.lineTo(x, y + size);
        this.ctx.lineTo(x - size * 0.3, y + size * 0.3);
        this.ctx.lineTo(x - size, y);
        this.ctx.lineTo(x - size * 0.3, y - size * 0.3);
        this.ctx.closePath();
        this.ctx.fill();
    }

    // 繪製閃光效果
    drawSparkle(x, y, size) {
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x - size, y);
        this.ctx.lineTo(x + size, y);
        this.ctx.moveTo(x, y - size);
        this.ctx.lineTo(x, y + size);
        this.ctx.stroke();
    }

    // 繪製葉子
    drawLeaf(x, y, size, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, size, size * 1.5, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    // 創建工具使用特效
    createToolEffect(x, y, toolType) {
        const colors = {
            hoe: ['#8B4513', '#A0522D'],
            watering_can: ['#4169E1', '#87CEEB'],
            axe: ['#FFD700', '#FFA500'],
            pickaxe: ['#C0C0C0', '#696969'],
            seeds: ['#228B22', '#32CD32']
        };

        const toolColors = colors[toolType] || ['#FFD700', '#FFA500'];
        
        for (let i = 0; i < 8; i++) {
            this.particles.push(new Particle({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 4,
                vy: -Math.random() * 3 - 1,
                size: Math.random() * 4 + 2,
                color: toolColors[Math.floor(Math.random() * toolColors.length)],
                type: 'star',
                life: 1,
                decay: 0.02
            }));
        }
    }

    // 創建收穫特效
    createHarvestEffect(x, y, itemType) {
        const colors = {
            carrot: ['#FFA500', '#FF8C00'],
            corn: ['#FFD700', '#FFFF00'],
            potato: ['#DEB887', '#D2B48C'],
            wood: ['#8B4513', '#A0522D'],
            stone: ['#808080', '#696969']
        };

        const itemColors = colors[itemType] || ['#32CD32', '#228B22'];
        
        for (let i = 0; i < 12; i++) {
            this.particles.push(new Particle({
                x: x + (Math.random() - 0.5) * 30,
                y: y + (Math.random() - 0.5) * 30,
                vx: (Math.random() - 0.5) * 6,
                vy: -Math.random() * 4 - 2,
                size: Math.random() * 6 + 3,
                color: itemColors[Math.floor(Math.random() * itemColors.length)],
                type: 'circle',
                life: 1,
                decay: 0.015
            }));
        }
    }

    // 創建升級特效
    createLevelUpEffect(x, y) {
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            this.particles.push(new Particle({
                x: x,
                y: y,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3 - 1,
                size: Math.random() * 8 + 4,
                color: ['#FFD700', '#FFA500', '#FF69B4'][Math.floor(Math.random() * 3)],
                type: 'star',
                life: 1,
                decay: 0.008
            }));
        }
    }

    // 創建環境粒子
    createAmbientParticle() {
        if (this.particles.length > 50) return;

        this.particles.push(new Particle({
            x: Math.random() * this.canvas.width,
            y: this.canvas.height + 10,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -Math.random() * 0.5 - 0.2,
            size: Math.random() * 3 + 1,
            color: ['#98FB98', '#90EE90', '#87CEEB'][Math.floor(Math.random() * 3)],
            type: 'circle',
            life: 1,
            decay: 0.003
        }));
    }

    // 創建天氣效果
    createWeatherEffect(weatherType) {
        this.weatherParticles = []; // 清除現有天氣粒子

        switch (weatherType) {
            case 'rainy':
                this.createRainEffect();
                break;
            case 'stormy':
                this.createStormEffect();
                break;
            case 'cloudy':
                this.createCloudEffect();
                break;
        }
    }

    // 雨天效果
    createRainEffect() {
        for (let i = 0; i < 30; i++) {
            this.weatherParticles.push(new Particle({
                x: Math.random() * this.canvas.width,
                y: -10,
                vx: -1,
                vy: Math.random() * 5 + 5,
                size: Math.random() * 2 + 1,
                color: '#4169E1',
                type: 'circle',
                life: 1,
                decay: 0
            }));
        }
    }

    // 暴風雨效果
    createStormEffect() {
        this.createRainEffect();
        
        // 添加閃電效果
        if (Math.random() < 0.1) {
            this.createLightningEffect();
        }
    }

    // 閃電效果
    createLightningEffect() {
        for (let i = 0; i < 5; i++) {
            this.particles.push(new Particle({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.3,
                vx: 0,
                vy: 0,
                size: Math.random() * 20 + 10,
                color: '#FFFF00',
                type: 'sparkle',
                life: 1,
                decay: 0.1
            }));
        }
    }

    // 多雲效果
    createCloudEffect() {
        for (let i = 0; i < 10; i++) {
            this.particles.push(new Particle({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.3,
                vx: Math.random() * 0.5,
                vy: 0,
                size: Math.random() * 15 + 10,
                color: 'rgba(255, 255, 255, 0.6)',
                type: 'circle',
                life: 1,
                decay: 0.001
            }));
        }
    }

    // 創建NPC互動特效
    createNPCInteractionEffect(x, y) {
        for (let i = 0; i < 6; i++) {
            this.particles.push(new Particle({
                x: x + (Math.random() - 0.5) * 40,
                y: y - 20 + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 2 - 1,
                size: Math.random() * 4 + 2,
                color: ['#FF69B4', '#FFB6C1', '#FFA500'][Math.floor(Math.random() * 3)],
                type: 'star',
                life: 1,
                decay: 0.02
            }));
        }
    }

    // 銷毀系統
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.isInitialized = false;
    }
}

// 粒子類
class Particle {
    constructor(options) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.vx = options.vx || 0;
        this.vy = options.vy || 0;
        this.size = options.size || 2;
        this.color = options.color || '#FFD700';
        this.type = options.type || 'circle';
        this.life = options.life || 1;
        this.decay = options.decay || 0.01;
        this.rotation = options.rotation || 0;
        this.rotationSpeed = options.rotationSpeed || 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // 重力
        this.rotation += this.rotationSpeed;
        this.life -= this.decay;
        
        if (this.life < 0) this.life = 0;
    }
}

// 全域Canvas效果系統實例
window.canvasEffects = new CanvasEffectSystem();