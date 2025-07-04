// 實用工具模組
console.log('載入實用工具模組...');

// 工具模組主類
class ToolsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupModals();
    }

    setupEventListeners() {
        // 計算機按鈕
        const calculatorBtn = document.getElementById('calculatorBtn');
        if (calculatorBtn) {
            calculatorBtn.addEventListener('click', () => this.openCalculator());
        }

        // QR碼生成器按鈕
        const qrBtn = document.getElementById('qrBtn');
        if (qrBtn) {
            qrBtn.addEventListener('click', () => this.openQRGenerator());
        }

        // 條碼生成器按鈕
        const barcodeBtn = document.getElementById('barcodeBtn');
        if (barcodeBtn) {
            barcodeBtn.addEventListener('click', () => this.openBarcodeGenerator());
        }

        // 密碼生成器按鈕
        const passwordBtn = document.getElementById('passwordBtn');
        if (passwordBtn) {
            passwordBtn.addEventListener('click', () => this.openPasswordGenerator());
        }

        // Canva設計按鈕
        const designBtn = document.getElementById('designBtn');
        if (designBtn) {
            designBtn.addEventListener('click', () => this.openDesignGenerator());
        }

        // QR碼生成事件
        const generateQRBtn = document.getElementById('generateQRBtn');
        if (generateQRBtn) {
            generateQRBtn.addEventListener('click', () => this.generateQRCode());
        }

        // 條碼生成事件
        const generateBarcodeBtn = document.getElementById('generateBarcodeBtn');
        if (generateBarcodeBtn) {
            generateBarcodeBtn.addEventListener('click', () => this.generateBarcode());
        }

        // 密碼生成事件
        const generatePasswordBtn = document.getElementById('generatePasswordBtn');
        if (generatePasswordBtn) {
            generatePasswordBtn.addEventListener('click', () => this.generatePassword());
        }
    }

    setupModals() {
        // 確保模態框存在
        this.ensureModalExists();
    }

    ensureModalExists() {
        // 動態創建計算機模態框
        if (!document.getElementById('calculatorModal')) {
            this.createCalculatorModal();
        }
        
        // 動態創建密碼生成器模態框
        if (!document.getElementById('passwordModal')) {
            this.createPasswordModal();
        }
    }

    // 計算機功能
    openCalculator() {
        this.showCalculatorModal();
    }

    createCalculatorModal() {
        const modalHTML = `
            <div class="modal fade" id="calculatorModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-calculator me-2"></i>計算機
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="calculator">
                                <div class="calculator-display">
                                    <input type="text" id="calculatorDisplay" class="form-control text-end" readonly value="0">
                                </div>
                                <div class="calculator-buttons mt-3">
                                    <div class="row g-2">
                                        <div class="col-3"><button class="btn btn-outline-secondary w-100" onclick="calculatorClear()">C</button></div>
                                        <div class="col-3"><button class="btn btn-outline-secondary w-100" onclick="calculatorClearEntry()">CE</button></div>
                                        <div class="col-3"><button class="btn btn-outline-secondary w-100" onclick="calculatorBackspace()">⌫</button></div>
                                        <div class="col-3"><button class="btn btn-outline-primary w-100" onclick="calculatorInput('/')">/</button></div>
                                    </div>
                                    <div class="row g-2 mt-1">
                                        <div class="col-3"><button class="btn btn-outline-dark w-100" onclick="calculatorInput('7')">7</button></div>
                                        <div class="col-3"><button class="btn btn-outline-dark w-100" onclick="calculatorInput('8')">8</button></div>
                                        <div class="col-3"><button class="btn btn-outline-dark w-100" onclick="calculatorInput('9')">9</button></div>
                                        <div class="col-3"><button class="btn btn-outline-primary w-100" onclick="calculatorInput('*')">×</button></div>
                                    </div>
                                    <div class="row g-2 mt-1">
                                        <div class="col-3"><button class="btn btn-outline-dark w-100" onclick="calculatorInput('4')">4</button></div>
                                        <div class="col-3"><button class="btn btn-outline-dark w-100" onclick="calculatorInput('5')">5</button></div>
                                        <div class="col-3"><button class="btn btn-outline-dark w-100" onclick="calculatorInput('6')">6</button></div>
                                        <div class="col-3"><button class="btn btn-outline-primary w-100" onclick="calculatorInput('-')">-</button></div>
                                    </div>
                                    <div class="row g-2 mt-1">
                                        <div class="col-3"><button class="btn btn-outline-dark w-100" onclick="calculatorInput('1')">1</button></div>
                                        <div class="col-3"><button class="btn btn-outline-dark w-100" onclick="calculatorInput('2')">2</button></div>
                                        <div class="col-3"><button class="btn btn-outline-dark w-100" onclick="calculatorInput('3')">3</button></div>
                                        <div class="col-3"><button class="btn btn-outline-primary w-100" onclick="calculatorInput('+')">+</button></div>
                                    </div>
                                    <div class="row g-2 mt-1">
                                        <div class="col-6"><button class="btn btn-outline-dark w-100" onclick="calculatorInput('0')">0</button></div>
                                        <div class="col-3"><button class="btn btn-outline-dark w-100" onclick="calculatorInput('.')">.</button></div>
                                        <div class="col-3"><button class="btn btn-primary w-100" onclick="calculatorEquals()">=</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    showCalculatorModal() {
        const modal = new bootstrap.Modal(document.getElementById('calculatorModal'));
        modal.show();
        this.resetCalculator();
    }

    resetCalculator() {
        const display = document.getElementById('calculatorDisplay');
        if (display) {
            display.value = '0';
        }
        this.calculatorData = {
            currentValue: '0',
            previousValue: null,
            operator: null,
            waitingForOperand: false
        };
    }

    // QR碼生成器
    openQRGenerator() {
        const modal = new bootstrap.Modal(document.getElementById('qrCodeModal'));
        modal.show();
    }

    async generateQRCode() {
        const text = document.getElementById('qrText').value.trim();
        if (!text) {
            alert('請輸入要生成QR碼的文字');
            return;
        }

        try {
            const response = await fetch('/generate_qr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    size: document.getElementById('qrSize').value,
                    border: document.getElementById('qrBorder').value
                })
            });

            if (response.ok) {
                const data = await response.json();
                const qrResult = document.getElementById('qrResult');
                const qrImage = document.getElementById('qrImage');
                
                qrImage.src = data.qr_code;
                qrResult.style.display = 'block';
                
                // 顯示下載按鈕
                const downloadBtn = document.getElementById('downloadQRBtn');
                downloadBtn.style.display = 'inline-block';
                downloadBtn.onclick = () => this.downloadQRCode(data.qr_code);
            } else {
                alert('生成QR碼失敗');
            }
        } catch (error) {
            console.error('QR碼生成錯誤:', error);
            alert('生成QR碼時發生錯誤');
        }
    }

    downloadQRCode(dataUrl) {
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = dataUrl;
        link.click();
    }

    // 條碼生成器
    openBarcodeGenerator() {
        const modal = new bootstrap.Modal(document.getElementById('barcodeModal'));
        modal.show();
    }

    async generateBarcode() {
        const text = document.getElementById('barcodeText').value.trim();
        const format = document.getElementById('barcodeFormat').value;
        
        if (!text) {
            alert('請輸入要生成條碼的文字');
            return;
        }

        try {
            const response = await fetch('/generate_barcode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    format: format
                })
            });

            if (response.ok) {
                const data = await response.json();
                const barcodeResult = document.getElementById('barcodeResult');
                const barcodeImage = document.getElementById('barcodeImage');
                
                barcodeImage.src = data.barcode;
                barcodeResult.style.display = 'block';
                
                // 顯示下載按鈕
                const downloadBtn = document.getElementById('downloadBarcodeBtn');
                downloadBtn.style.display = 'inline-block';
                downloadBtn.onclick = () => this.downloadBarcode(data.barcode);
            } else {
                alert('生成條碼失敗');
            }
        } catch (error) {
            console.error('條碼生成錯誤:', error);
            alert('生成條碼時發生錯誤');
        }
    }

    downloadBarcode(dataUrl) {
        const link = document.createElement('a');
        link.download = 'barcode.png';
        link.href = dataUrl;
        link.click();
    }

    // 密碼生成器
    openPasswordGenerator() {
        this.showPasswordModal();
    }

    createPasswordModal() {
        const modalHTML = `
            <div class="modal fade" id="passwordModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-key me-2"></i>密碼生成器
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="passwordLength" class="form-label">密碼長度</label>
                                <input type="range" class="form-range" id="passwordLength" min="6" max="50" value="12">
                                <div class="d-flex justify-content-between">
                                    <small>6</small>
                                    <span id="passwordLengthValue">12</span>
                                    <small>50</small>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="includeUppercase" checked>
                                    <label class="form-check-label" for="includeUppercase">包含大寫字母 (A-Z)</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="includeLowercase" checked>
                                    <label class="form-check-label" for="includeLowercase">包含小寫字母 (a-z)</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="includeNumbers" checked>
                                    <label class="form-check-label" for="includeNumbers">包含數字 (0-9)</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="includeSymbols">
                                    <label class="form-check-label" for="includeSymbols">包含特殊符號 (!@#$%^&*)</label>
                                </div>
                            </div>
                            <button type="button" class="btn btn-primary w-100" onclick="toolsManager.generatePassword()">
                                <i class="fas fa-sync-alt me-2"></i>生成密碼
                            </button>
                            <div class="mt-3" id="passwordResult" style="display: none;">
                                <label class="form-label">生成的密碼</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="generatedPassword" readonly>
                                    <button class="btn btn-outline-secondary" type="button" onclick="toolsManager.copyPassword()">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // 添加長度滑桿事件
        const lengthSlider = document.getElementById('passwordLength');
        const lengthValue = document.getElementById('passwordLengthValue');
        lengthSlider.addEventListener('input', () => {
            lengthValue.textContent = lengthSlider.value;
        });
    }

    showPasswordModal() {
        const modal = new bootstrap.Modal(document.getElementById('passwordModal'));
        modal.show();
    }

    generatePassword() {
        const length = parseInt(document.getElementById('passwordLength').value);
        const includeUppercase = document.getElementById('includeUppercase').checked;
        const includeLowercase = document.getElementById('includeLowercase').checked;
        const includeNumbers = document.getElementById('includeNumbers').checked;
        const includeSymbols = document.getElementById('includeSymbols').checked;

        let charset = '';
        if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (includeNumbers) charset += '0123456789';
        if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (!charset) {
            alert('請至少選擇一種字符類型');
            return;
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }

        const passwordResult = document.getElementById('passwordResult');
        const generatedPassword = document.getElementById('generatedPassword');
        
        generatedPassword.value = password;
        passwordResult.style.display = 'block';
    }

    copyPassword() {
        const passwordField = document.getElementById('generatedPassword');
        passwordField.select();
        passwordField.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(passwordField.value);
        
        // 臨時改變按鈕文字
        const copyBtn = event.target.closest('button');
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
        }, 1000);
    }

    // Canva式設計生成器
    openDesignGenerator() {
        // 導航到設計面板
        const designTab = document.querySelector('[data-bs-target="#design-panel"]');
        if (designTab) {
            designTab.click();
        }
    }
}

// 計算機相關函數
let calculatorData = {
    currentValue: '0',
    previousValue: null,
    operator: null,
    waitingForOperand: false
};

function calculatorInput(value) {
    const display = document.getElementById('calculatorDisplay');
    
    if (calculatorData.waitingForOperand) {
        display.value = value;
        calculatorData.waitingForOperand = false;
    } else {
        display.value = display.value === '0' ? value : display.value + value;
    }
    calculatorData.currentValue = display.value;
}

function calculatorClear() {
    const display = document.getElementById('calculatorDisplay');
    display.value = '0';
    calculatorData = {
        currentValue: '0',
        previousValue: null,
        operator: null,
        waitingForOperand: false
    };
}

function calculatorClearEntry() {
    const display = document.getElementById('calculatorDisplay');
    display.value = '0';
    calculatorData.currentValue = '0';
}

function calculatorBackspace() {
    const display = document.getElementById('calculatorDisplay');
    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
    } else {
        display.value = '0';
    }
    calculatorData.currentValue = display.value;
}

function calculatorEquals() {
    const display = document.getElementById('calculatorDisplay');
    
    if (calculatorData.operator && calculatorData.previousValue !== null) {
        const prev = parseFloat(calculatorData.previousValue);
        const current = parseFloat(calculatorData.currentValue);
        let result;
        
        switch (calculatorData.operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = current !== 0 ? prev / current : 'Error';
                break;
            default:
                return;
        }
        
        display.value = result.toString();
        calculatorData = {
            currentValue: result.toString(),
            previousValue: null,
            operator: null,
            waitingForOperand: false
        };
    }
}

// 全域工具管理器實例
let toolsManager;

// 文檔加載完成時初始化
document.addEventListener('DOMContentLoaded', function() {
    toolsManager = new ToolsManager();
    console.log('實用工具模組已初始化');
});