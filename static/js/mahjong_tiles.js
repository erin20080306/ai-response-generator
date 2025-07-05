/**
 * 麻將牌圖片對應系統
 * 使用真實的麻將牌圖片替換文字顯示
 */

class MahjongTileMapper {
    constructor() {
        // 建立牌面對應圖片的映射表
        this.tileImageMap = {
            // 萬子 (Characters/Man)
            '1萬': 'attached_assets/60794_man_mahjong_icon_1751722977548.png',
            '2萬': 'attached_assets/60795_mahjong_man_icon_1751722977550.png', 
            '3萬': 'attached_assets/60724_mahjong_man_icon_1751722977551.png',
            '4萬': 'attached_assets/60797_man_mahjong_icon_1751722977552.png',
            '5萬': 'attached_assets/60727_dora_mahjong_man_red_icon_1751722977545.png', // 紅五萬
            '6萬': 'attached_assets/60798_dragon_mahjong_man_icon_1751722977547.png',
            '7萬': 'attached_assets/60800_mahjong_man_icon_1751722977549.png',
            '8萬': 'attached_assets/60794_man_mahjong_icon_1751722977548.png', // 重複使用
            '9萬': 'attached_assets/60795_mahjong_man_icon_1751722977550.png', // 重複使用
            
            // 筒子 (Circles/Pin)
            '1筒': 'attached_assets/60725_mahjong_icon_1751722977552.png',
            '2筒': 'attached_assets/60805_mahjong_pin_icon_1751722977554.png',
            '3筒': 'attached_assets/60725_mahjong_icon_1751722977552.png', // 重複使用
            '4筒': 'attached_assets/60805_mahjong_pin_icon_1751722977554.png', // 重複使用
            '5筒': 'attached_assets/60725_mahjong_icon_1751722977552.png', // 重複使用
            '6筒': 'attached_assets/60805_mahjong_pin_icon_1751722977554.png', // 重複使用
            '7筒': 'attached_assets/60725_mahjong_icon_1751722977552.png', // 重複使用
            '8筒': 'attached_assets/60805_mahjong_pin_icon_1751722977554.png', // 重複使用
            '9筒': 'attached_assets/60725_mahjong_icon_1751722977552.png', // 重複使用
            
            // 條子 (Bamboo/Sou) - 使用現有的竹子圖片
            '1條': 'attached_assets/60720_bamboo_mahjong_icon (1)_1751722936479.png',
            '2條': 'attached_assets/60784_mahjong_bamboo_icon_1751722936473.png',
            '3條': 'attached_assets/60785_mahjong_bamboo_icon_1751722936472.png',
            '4條': 'attached_assets/60786_bamboo_icon_1751722936482.png',
            '5條': 'attached_assets/60726_bamboo_dora_mahjong_red_icon_1751722936480.png', // 紅五條
            '6條': 'attached_assets/60787_bamboo_icon_1751722936481.png',
            '7條': 'attached_assets/60790_mahjong_bamboo_icon (1)_1751722936478.png',
            '8條': 'attached_assets/60791_mahjong_bamboo_icon_1751722936476.png',
            '9條': 'attached_assets/60720_bamboo_mahjong_icon (2)_1751722936474.png',
            
            // 風牌 (Wind tiles)
            '東': 'attached_assets/60729_east_mahjong_wind_icon (1)_1751722936489.png',
            '南': 'attached_assets/60731_mahjong_south_wind_icon_1751722977542.png',
            '西': 'attached_assets/60732_mahjong_west_wind_icon_1751722977543.png',
            '北': 'attached_assets/60730_mahjong_north_wind_icon_1751722977540.png',
            
            // 龍牌 (Dragon tiles)
            '中': 'attached_assets/60721_chun_dragon_mahjong_icon_1751722977555.png',
            '發': 'attached_assets/60722_dragon_green_mahjong_icon_1751722977555.png',
            '白': 'attached_assets/60720_bamboo_mahjong_icon (1)_1751722936479.png' // 使用白色底圖
        };
        
        // 牌背圖片
        this.tileBackImage = 'attached_assets/60799_mahjong_icon_1751722936488.png';
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