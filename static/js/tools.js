/**
 * 實用工具函數集合
 * 包含計算器、QR碼生成器、條碼生成器、密碼生成器等功能
 */

// 計算器功能
function openCalculator() {
    const result = prompt('簡易計算器 - 請輸入運算式 (例如: 2 + 3 * 4):');
    if (result) {
        try {
            // 安全的計算方式，只允許基本運算符
            const sanitized = result.replace(/[^0-9+\-*/().\s]/g, '');
            const answer = Function('"use strict"; return (' + sanitized + ')')();
            alert(`計算結果: ${result} = ${answer}`);
        } catch (error) {
            alert('計算錯誤：請輸入有效的運算式');
        }
    }
}

// QR碼生成器
function openQRGenerator() {
    const text = prompt('請輸入要生成QR碼的文字或網址:');
    if (text) {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`
            <html>
                <head><title>QR碼生成器</title></head>
                <body style="font-family: Arial; text-align: center; padding: 20px;">
                    <h2>QR碼生成器</h2>
                    <p>內容: ${text}</p>
                    <img src="${qrUrl}" alt="QR Code" style="border: 1px solid #ccc;">
                    <br><br>
                    <a href="${qrUrl}" download="qrcode.png">下載QR碼</a>
                </body>
            </html>
        `);
    }
}

// 條碼生成器
function openBarcodeGenerator() {
    const text = prompt('請輸入要生成條碼的數字或文字:');
    if (text) {
        const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(text)}&code=Code128&dpi=96`;
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`
            <html>
                <head><title>條碼生成器</title></head>
                <body style="font-family: Arial; text-align: center; padding: 20px;">
                    <h2>條碼生成器</h2>
                    <p>內容: ${text}</p>
                    <img src="${barcodeUrl}" alt="Barcode" style="border: 1px solid #ccc;">
                    <br><br>
                    <a href="${barcodeUrl}" download="barcode.png">下載條碼</a>
                </body>
            </html>
        `);
    }
}

// 密碼生成器
function openPasswordGenerator() {
    const length = prompt('請輸入密碼長度 (8-50):');
    if (length && length >= 8 && length <= 50) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`
            <html>
                <head><title>密碼生成器</title></head>
                <body style="font-family: Arial; text-align: center; padding: 20px;">
                    <h2>密碼生成器</h2>
                    <p>生成的密碼:</p>
                    <div style="background: #f0f0f0; padding: 10px; margin: 10px; font-family: monospace; font-size: 18px; border: 1px solid #ccc;">
                        ${password}
                    </div>
                    <button onclick="navigator.clipboard.writeText('${password}')">複製密碼</button>
                </body>
            </html>
        `);
    } else {
        alert('請輸入有效的密碼長度 (8-50)');
    }
}

// 單位轉換器
function openUnitConverter() {
    const value = prompt('請輸入要轉換的數值:');
    if (value && !isNaN(value)) {
        const type = prompt('選擇轉換類型:\n1. 公分轉英吋\n2. 公斤轉磅\n3. 攝氏轉華氏', '1');
        let result = '';
        
        switch (type) {
            case '1':
                result = `${value} 公分 = ${(value / 2.54).toFixed(2)} 英吋`;
                break;
            case '2':
                result = `${value} 公斤 = ${(value * 2.20462).toFixed(2)} 磅`;
                break;
            case '3':
                result = `${value}°C = ${(value * 9/5 + 32).toFixed(2)}°F`;
                break;
            default:
                result = '無效的選擇';
        }
        
        alert(result);
    }
}

// 顏色轉換器
function openColorConverter() {
    const color = prompt('請輸入顏色 (例如: #FF0000 或 red):');
    if (color) {
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`
            <html>
                <head><title>顏色轉換器</title></head>
                <body style="font-family: Arial; text-align: center; padding: 20px;">
                    <h2>顏色轉換器</h2>
                    <div style="width: 100px; height: 100px; background: ${color}; margin: 20px auto; border: 1px solid #ccc;"></div>
                    <p>顏色: ${color}</p>
                    <div id="colorInfo"></div>
                    <script>
                        try {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            ctx.fillStyle = '${color}';
                            const computed = ctx.fillStyle;
                            document.getElementById('colorInfo').innerHTML = 
                                '<p>計算結果: ' + computed + '</p>';
                        } catch (e) {
                            document.getElementById('colorInfo').innerHTML = 
                                '<p>無效的顏色格式</p>';
                        }
                    </script>
                </body>
            </html>
        `);
    }
}

// Base64 編碼/解碼器
function openBase64Converter() {
    const action = prompt('選擇操作:\n1. 編碼\n2. 解碼', '1');
    const text = prompt('請輸入文字:');
    
    if (text) {
        let result = '';
        try {
            if (action === '1') {
                result = btoa(unescape(encodeURIComponent(text)));
            } else {
                result = decodeURIComponent(escape(atob(text)));
            }
            
            const newWindow = window.open('', '_blank');
            newWindow.document.write(`
                <html>
                    <head><title>Base64 轉換器</title></head>
                    <body style="font-family: Arial; padding: 20px;">
                        <h2>Base64 轉換器</h2>
                        <p><strong>原始文字:</strong></p>
                        <div style="background: #f0f0f0; padding: 10px; margin: 10px 0; word-break: break-all;">${text}</div>
                        <p><strong>轉換結果:</strong></p>
                        <div style="background: #e0f0ff; padding: 10px; margin: 10px 0; word-break: break-all;">${result}</div>
                        <button onclick="navigator.clipboard.writeText('${result}')">複製結果</button>
                    </body>
                </html>
            `);
        } catch (error) {
            alert('轉換錯誤：' + error.message);
        }
    }
}

// 設計生成器
function openDesignGenerator() {
    const prompt_text = prompt('請描述你想要的設計 (例如: 現代商業名片設計):');
    if (prompt_text) {
        // 這裡會調用設計生成API
        alert(`正在生成設計: ${prompt_text}\n請稍候...`);
        
        // 實際實現會調用後端API
        fetch('/generate_design', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt_text })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const newWindow = window.open('', '_blank');
                newWindow.document.write(`
                    <html>
                        <head><title>設計生成器</title></head>
                        <body style="font-family: Arial; text-align: center; padding: 20px;">
                            <h2>設計生成器</h2>
                            <p>設計主題: ${prompt_text}</p>
                            <img src="${data.image_url}" alt="Generated Design" style="max-width: 100%; border: 1px solid #ccc;">
                            <br><br>
                            <a href="${data.image_url}" download="design.png">下載設計</a>
                        </body>
                    </html>
                `);
            } else {
                alert('設計生成失敗：' + data.error);
            }
        })
        .catch(error => {
            alert('設計生成錯誤：' + error.message);
        });
    }
}

// 匯出所有函數到全域作用域
window.openCalculator = openCalculator;
window.openQRGenerator = openQRGenerator;
window.openBarcodeGenerator = openBarcodeGenerator;
window.openPasswordGenerator = openPasswordGenerator;
window.openUnitConverter = openUnitConverter;
window.openColorConverter = openColorConverter;
window.openBase64Converter = openBase64Converter;
window.openDesignGenerator = openDesignGenerator;

console.log('實用工具已載入完成');