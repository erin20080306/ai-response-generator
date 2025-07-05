/**
 * AI智能文件生成器
 * 支援Excel、Word、PowerPoint自動生成，並包含AI圖片生成功能
 */

class AIDocumentGenerator {
    constructor() {
        this.apiEndpoint = '/generate_ai_document';
        this.currentDownloadUrl = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 開啟AI文件生成器模態框
        window.showAIDocumentGenerator = () => {
            const modal = new bootstrap.Modal(document.getElementById('aiDocumentModal'));
            modal.show();
        };

        // 生成按鈕事件
        const generateBtn = document.getElementById('generateAIDocumentBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateDocument());
        }

        // 下載按鈕事件
        const downloadBtn = document.getElementById('downloadAIDocumentBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadDocument());
        }

        // 文件類型變更事件
        const typeSelect = document.getElementById('aiDocumentType');
        if (typeSelect) {
            typeSelect.addEventListener('change', () => this.updateImageOption());
        }
    }

    updateImageOption() {
        const docType = document.getElementById('aiDocumentType').value;
        const imageOption = document.getElementById('aiIncludeImages');
        const imageLabel = imageOption.parentElement;
        
        if (docType === 'excel') {
            imageOption.checked = false;
            imageOption.disabled = true;
            imageLabel.style.opacity = '0.5';
        } else {
            imageOption.disabled = false;
            imageLabel.style.opacity = '1';
        }
    }

    async generateDocument() {
        const docType = document.getElementById('aiDocumentType').value;
        const description = document.getElementById('aiDocumentDescription').value.trim();
        const style = document.getElementById('aiDocumentStyle').value;
        const language = document.getElementById('aiDocumentLanguage').value;
        const includeImages = document.getElementById('aiIncludeImages').checked;

        // 驗證輸入
        if (!description) {
            this.showError('請輸入文件描述');
            return;
        }

        if (description.length < 10) {
            this.showError('請提供更詳細的文件描述（至少10個字符）');
            return;
        }

        // 顯示進度條
        this.showProgress(true);
        this.updateProgress(10, '正在分析您的需求...');

        try {
            const requestData = {
                document_type: docType,
                description: description,
                style: style,
                language: language,
                include_images: includeImages && docType !== 'excel'
            };

            this.updateProgress(30, '正在使用AI生成文件結構...');

            // 設定較長的超時時間以處理圖片生成
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 120000); // 2分鐘超時

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`伺服器錯誤 (${response.status}): ${errorText}`);
            }

            const result = await response.json();

            if (result.success) {
                this.updateProgress(100, '文件生成完成！');
                this.showResult(result);
            } else {
                throw new Error(result.error || '文件生成失敗');
            }

        } catch (error) {
            console.error('AI文件生成錯誤:', error);
            
            let errorMessage = '文件生成失敗';
            if (error.name === 'AbortError') {
                errorMessage = '請求超時，請簡化文件描述後重試';
            } else if (error.message.includes('500')) {
                errorMessage = '伺服器處理錯誤，可能是圖片生成失敗，請嘗試不使用圖片或簡化描述';
            } else {
                errorMessage = `文件生成失敗: ${error.message}`;
            }
            
            this.showError(errorMessage);
            this.showProgress(false);
        }
    }

    showProgress(show) {
        const progressDiv = document.getElementById('aiDocumentProgress');
        const resultDiv = document.getElementById('aiDocumentResult');
        const generateBtn = document.getElementById('generateAIDocumentBtn');
        const downloadBtn = document.getElementById('downloadAIDocumentBtn');

        if (show) {
            progressDiv.style.display = 'block';
            resultDiv.style.display = 'none';
            generateBtn.disabled = true;
            downloadBtn.style.display = 'none';
        } else {
            progressDiv.style.display = 'none';
            generateBtn.disabled = false;
        }
    }

    updateProgress(percent, text) {
        const progressBar = document.querySelector('#aiDocumentProgress .progress-bar');
        const progressText = document.getElementById('aiDocumentProgressText');
        
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
        
        if (progressText) {
            progressText.textContent = text;
        }
    }

    showResult(result) {
        this.showProgress(false);
        
        const resultDiv = document.getElementById('aiDocumentResult');
        const resultContent = document.getElementById('aiDocumentResultContent');
        const downloadBtn = document.getElementById('downloadAIDocumentBtn');

        // 儲存下載URL
        this.currentDownloadUrl = result.download_url;

        // 顯示結果
        let resultHTML = `
            <div class="d-flex align-items-center mb-3">
                <i class="fas fa-check-circle text-success me-2"></i>
                <h6 class="mb-0">文件生成成功！</h6>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <strong>文件名稱：</strong> ${result.filename || '未知文件'}<br>
                    <strong>文件類型：</strong> ${this.getDocumentTypeText(result.type)}<br>
                    <strong>生成時間：</strong> ${new Date().toLocaleString('zh-TW')}
                </div>
                <div class="col-md-6">
                    <strong>文件大小：</strong> ${result.file_size || '未知'}<br>
                    <strong>頁面/工作表數：</strong> ${result.pages || result.sheets || '1'}
                </div>
            </div>
        `;

        if (result.images_generated && result.images_generated.length > 0) {
            resultHTML += `
                <div class="mt-3">
                    <strong>已生成 ${result.images_generated.length} 張相關圖片</strong>
                    <div class="row mt-2">
            `;
            
            result.images_generated.forEach((image, index) => {
                resultHTML += `
                    <div class="col-md-4 mb-2">
                        <img src="${image.url}" alt="${image.description}" class="img-fluid rounded" style="max-height: 100px;">
                        <small class="d-block text-muted">${image.description}</small>
                    </div>
                `;
            });
            
            resultHTML += `
                    </div>
                </div>
            `;
        }

        if (result.description) {
            resultHTML += `
                <div class="mt-3">
                    <strong>文件描述：</strong><br>
                    <small class="text-muted">${result.description}</small>
                </div>
            `;
        }

        resultContent.innerHTML = resultHTML;
        resultDiv.style.display = 'block';
        downloadBtn.style.display = 'inline-block';

        // 顯示成功通知
        this.showNotification('AI文件生成完成！', 'success');
    }

    downloadDocument() {
        if (this.currentDownloadUrl) {
            // 創建隱藏的下載連結
            const link = document.createElement('a');
            link.href = this.currentDownloadUrl;
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('文件下載開始！', 'info');
        } else {
            this.showError('沒有可下載的文件');
        }
    }

    getDocumentTypeText(type) {
        const types = {
            'excel': 'Excel 試算表',
            'word': 'Word 文件',
            'ppt': 'PowerPoint 簡報',
            'powerpoint': 'PowerPoint 簡報'
        };
        return types[type] || type;
    }

    showError(message) {
        const resultDiv = document.getElementById('aiDocumentResult');
        const resultContent = document.getElementById('aiDocumentResultContent');
        
        resultContent.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
            </div>
        `;
        
        resultDiv.style.display = 'block';
        this.showProgress(false);
    }

    showNotification(message, type = 'info') {
        // 如果有全域通知系統就使用，否則使用alert
        if (window.showNotification) {
            window.showNotification(message, type);
        } else if (window.showMessage) {
            window.showMessage(message, type);
        } else {
            alert(message);
        }
    }
}

// 初始化AI文件生成器
document.addEventListener('DOMContentLoaded', function() {
    window.aiDocumentGenerator = new AIDocumentGenerator();
});