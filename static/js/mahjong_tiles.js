/**
 * 麻將牌圖片對應系統
 * 使用真實的麻將牌圖片替換文字顯示
 */

class MahjongTileMapper {
    constructor() {
        // 建立牌面對應圖片的映射表
        this.tileImageMap = {
            // 萬子 (Characters/Man)
            '1萬': '/static/images/一萬.png',
            '2萬': '/static/images/二萬.png',
            '3萬': '/static/images/三萬.png',
            '4萬': '/static/images/四萬.png',
            '5萬': '/static/images/五萬.png',
            '6萬': '/static/images/六萬.png',
            '7萬': '/static/images/七萬.png',
            '8萬': '/static/images/八萬.png',
            '9萬': '/static/images/九萬.png',
            
            // 筒子 (Circles/Pin)
            '1筒': '/static/images/一筒.png',
            '2筒': '/static/images/二筒.png',
            '3筒': '/static/images/三筒.png',
            '4筒': '/static/images/四筒.png',
            '5筒': '/static/images/五筒.png',
            '6筒': '/static/images/六筒.png',
            '7筒': '/static/images/七筒.png',
            '8筒': '/static/images/八筒.png',
            '9筒': '/static/images/九筒.png',
            
            // 條子 (Bamboo/Sou)
            '1條': '/static/images/一條.png',
            '2條': '/static/images/二條.png',
            '3條': '/static/images/三條.png',
            '4條': '/static/images/四條.png',
            '5條': '/static/images/五條.png',
            '6條': '/static/images/六條.png',
            '7條': '/static/images/七條.png',
            '8條': '/static/images/八條.png',
            '9條': '/static/images/九條.png',
            
            // 風牌 (Wind tiles)
            '東': '/static/images/東風.png',
            '南': '/static/images/南風.png',
            '西': '/static/images/西風.png',
            '北': '/static/images/北風.png',
            
            // 龍牌 (Dragon tiles)
            '中': '/static/images/紅中.png',
            '發': '/static/images/青發.png',
            '白': '/static/images/一萬.png' // 暫時用一萬替代白板
        };
        
        // 牌背圖片
        this.tileBackImage = '/static/images/一萬.png';
    }
    
    /**
     * 獲取牌面圖片URL
     * @param {string} tileName - 牌面名稱 (例: '1萬', '東', '中')
     * @returns {string} 圖片URL
     */
    getTileImage(tileName) {
        return this.tileImageMap[tileName] || this.tileBackImage;
    }
    
    /**
     * 獲取牌背圖片URL
     * @returns {string} 牌背圖片URL
     */
    getTileBackImage() {
        return this.tileBackImage;
    }
    
    /**
     * 創建牌面圖片元素
     * @param {string} tileName - 牌面名稱
     * @param {Object} options - 選項 {width, height, className, onclick}
     * @returns {HTMLElement} 圖片元素
     */
    createTileImageElement(tileName, options = {}) {
        const img = document.createElement('img');
        img.src = this.getTileImage(tileName);
        img.alt = tileName;
        img.className = options.className || 'mahjong-tile-image';
        img.style.width = options.width || '30px';
        img.style.height = options.height || '40px';
        img.style.cursor = options.onclick ? 'pointer' : 'default';
        img.style.borderRadius = '4px';
        img.style.border = '1px solid #333';
        img.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        img.style.objectFit = 'contain';
        img.style.backgroundColor = '#fff';
        
        if (options.onclick) {
            img.onclick = options.onclick;
        }
        
        return img;
    }
    
    /**
     * 創建牌背圖片元素
     * @param {Object} options - 選項 {width, height, className}
     * @returns {HTMLElement} 圖片元素
     */
    createTileBackElement(options = {}) {
        const img = document.createElement('img');
        img.src = this.getTileBackImage();
        img.alt = '牌背';
        img.className = options.className || 'mahjong-tile-back';
        img.style.width = options.width || '20px';
        img.style.height = options.height || '28px';
        img.style.borderRadius = '2px';
        img.style.border = '1px solid #333';
        img.style.boxShadow = '0 1px 2px rgba(0,0,0,0.3)';
        img.style.objectFit = 'contain';
        img.style.backgroundColor = '#4a90e2';
        img.style.margin = options.margin || '1px';
        
        return img;
    }
    
    /**
     * 檢查牌面是否存在對應圖片
     * @param {string} tileName - 牌面名稱
     * @returns {boolean} 是否存在對應圖片
     */
    hasTileImage(tileName) {
        return tileName in this.tileImageMap;
    }
    
    /**
     * 獲取所有可用的牌面名稱
     * @returns {Array} 牌面名稱數組
     */
    getAllTileNames() {
        return Object.keys(this.tileImageMap);
    }
}

// 全局實例
const mahjongTileMapper = new MahjongTileMapper();

// 導出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MahjongTileMapper, mahjongTileMapper };
}