/**
 * 文件自動生成模組
 * 支援 Google Sheets、Excel 和 Word 文件生成
 */
class DocumentGenerator {
    constructor(app) {
        this.app = app;
        this.templates = {
            spreadsheet: [
                { name: '財務報表', type: 'financial' },
                { name: '專案計劃', type: 'project' },
                { name: '員工清單', type: 'employee' },
                { name: '員工出勤記錄', type: 'hr_attendance' },
                { name: '薪資計算表', type: 'hr_salary' },
                { name: '請假申請記錄', type: 'hr_leave' },
                { name: '員工績效評估', type: 'hr_performance' },
                { name: '招聘管理表', type: 'hr_recruitment' },
                { name: '教育訓練記錄', type: 'hr_training' },
                { name: '銷售統計', type: 'sales' },
                { name: '庫存管理', type: 'inventory' },
                { name: '預算規劃', type: 'budget' },
                { name: '客戶資料', type: 'customer' },
                { name: '學生成績', type: 'grades' }
            ],
            document: [
                { name: '會議紀錄', type: 'meeting' },
                { name: '項目提案', type: 'proposal' },
                { name: '技術文檔', type: 'technical' },
                { name: '合約範本', type: 'contract' },
                { name: '報告書', type: 'report' },
                { name: '履歷表', type: 'resume' },
                { name: '商業計劃', type: 'business_plan' },
                { name: '產品說明', type: 'product_desc' }
            ]
        };
        
        this.init();
    }

    init() {
        this.addDocumentGeneratorPanel();
        this.setupEventListeners();
    }

    addDocumentGeneratorPanel() {
        const toolsPanel = document.getElementById('tools-panel');
        if (toolsPanel) {
            const docSection = document.createElement('div');
            docSection.innerHTML = `
                <div class="row mt-4">
                    <div class="col-12">
                        <h5 class="mb-4"><i class="fas fa-file-alt me-2"></i>文件自動生成</h5>
                        
                        <!-- 快速生成 -->
                        <div class="card mb-4">
                            <div class="card-header">
                                <h6 class="mb-0"><i class="fas fa-magic me-2"></i>AI 智能生成</h6>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <label class="form-label">描述您需要的文件：</label>
                                    <textarea id="docDescription" class="form-control" rows="3" 
                                              placeholder="例如：為一家餐廳創建客戶滿意度調查表，包含評分和建議欄位"></textarea>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">文件類型：</label>
                                        <select id="docType" class="form-select">
                                            <option value="excel">Excel 試算表</option>
                                            <option value="google_sheet">Google Sheets</option>
                                            <option value="word">Word 文件</option>
                                            <option value="ppt">PowerPoint 簡報</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">語言：</label>
                                        <select id="docLanguage" class="form-select">
                                            <option value="zh-TW">繁體中文</option>
                                            <option value="zh-CN">簡體中文</option>
                                            <option value="en">English</option>
                                            <option value="ja">日本語</option>
                                        </select>
                                    </div>
                                </div>
                                <button class="btn btn-primary" id="generateDocBtn">
                                    <i class="fas fa-magic me-2"></i>AI 生成文件
                                </button>
                            </div>
                        </div>

                        <!-- 範本選擇 -->
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h6 class="mb-0"><i class="fas fa-table me-2"></i>試算表範本</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="list-group list-group-flush">
                                            ${this.templates.spreadsheet.map(template => `
                                                <a href="#" class="list-group-item list-group-item-action template-item" 
                                                   data-type="spreadsheet" data-template="${template.type}">
                                                    <i class="fas fa-table me-2"></i>${template.name}
                                                </a>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h6 class="mb-0"><i class="fas fa-file-word me-2"></i>文件範本</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="list-group list-group-flush">
                                            ${this.templates.document.map(template => `
                                                <a href="#" class="list-group-item list-group-item-action template-item" 
                                                   data-type="document" data-template="${template.type}">
                                                    <i class="fas fa-file-alt me-2"></i>${template.name}
                                                </a>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 生成歷史 -->
                        <div class="card mt-4">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h6 class="mb-0"><i class="fas fa-history me-2"></i>生成歷史</h6>
                                <button class="btn btn-sm btn-outline-secondary" id="clearHistoryBtn">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                            <div class="card-body">
                                <div id="generationHistory" class="generation-history">
                                    <div class="text-center text-muted">
                                        <i class="fas fa-clock fa-2x mb-2"></i>
                                        <p>尚未生成任何文件</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            const panelContainer = toolsPanel.querySelector('.panel-container');
            if (panelContainer) {
                panelContainer.appendChild(docSection);
            }
        }
    }

    setupEventListeners() {
        // AI 生成按鈕
        document.getElementById('generateDocBtn')?.addEventListener('click', () => {
            this.generateDocument();
        });

        // 範本選擇
        document.querySelectorAll('.template-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const type = item.dataset.type;
                const template = item.dataset.template;
                this.generateFromTemplate(type, template);
            });
        });

        // 清除歷史
        document.getElementById('clearHistoryBtn')?.addEventListener('click', () => {
            this.clearHistory();
        });
    }

    async generateDocument() {
        const description = document.getElementById('docDescription').value.trim();
        const docType = document.getElementById('docType').value;
        const language = document.getElementById('docLanguage').value;

        if (!description) {
            this.app.showNotification('請描述您需要的文件', 'warning');
            return;
        }

        try {
            this.app.showLoading();

            // PPT使用特殊方法
            const method = docType === 'ppt' ? 'ppt' : 'ai_generate';
            
            const response = await fetch('/generate_document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description: description,
                    type: docType,
                    language: language,
                    method: method
                })
            });

            const data = await response.json();

            if (data.success) {
                this.handleGenerationSuccess(data);
            } else {
                this.app.showNotification(data.error || '生成失敗', 'error');
            }

        } catch (error) {
            console.error('文件生成錯誤:', error);
            this.app.showNotification('生成過程中發生錯誤', 'error');
        } finally {
            this.app.hideLoading();
        }
    }

    async generateFromTemplate(type, template) {
        try {
            this.app.showLoading();

            const response = await fetch('/generate_document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    template_type: type,
                    template_name: template,
                    language: document.getElementById('docLanguage').value,
                    method: 'template'
                })
            });

            const data = await response.json();

            if (data.success) {
                this.handleGenerationSuccess(data);
            } else {
                this.app.showNotification(data.error || '生成失敗', 'error');
            }

        } catch (error) {
            console.error('範本生成錯誤:', error);
            this.app.showNotification('生成過程中發生錯誤', 'error');
        } finally {
            this.app.hideLoading();
        }
    }

    handleGenerationSuccess(data) {
        // 顯示成功訊息
        this.app.showNotification('文件生成成功！', 'success');

        // 創建下載連結
        if (data.download_url) {
            this.downloadFile(data.download_url, data.filename);
        }

        // 如果是 Google Sheets，顯示連結
        if (data.google_sheet_url) {
            this.showGoogleSheetModal(data.google_sheet_url, data.title);
        }

        // 更新歷史記錄
        this.addToHistory(data);

        // 清空輸入框
        document.getElementById('docDescription').value = '';
    }

    downloadFile(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    showGoogleSheetModal(url, title) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Google Sheets 已創建</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <i class="fas fa-check-circle text-success fa-3x mb-3"></i>
                        <h6>${title}</h6>
                        <p class="text-muted">您的 Google Sheets 文件已成功創建</p>
                        <div class="d-grid gap-2">
                            <a href="${url}" target="_blank" class="btn btn-primary">
                                <i class="fab fa-google me-2"></i>開啟 Google Sheets
                            </a>
                            <button type="button" class="btn btn-outline-secondary" onclick="navigator.clipboard.writeText('${url}')">
                                <i class="fas fa-copy me-2"></i>複製連結
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    addToHistory(data) {
        const historyContainer = document.getElementById('generationHistory');
        if (!historyContainer) return;

        // 如果是第一個項目，清除空狀態
        if (historyContainer.querySelector('.text-center.text-muted')) {
            historyContainer.innerHTML = '';
        }

        const historyItem = document.createElement('div');
        historyItem.className = 'history-item border-bottom pb-3 mb-3';
        historyItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <div class="d-flex align-items-center mb-2">
                        <i class="fas ${this.getFileIcon(data.type)} me-2"></i>
                        <strong>${data.title || data.filename}</strong>
                        <span class="badge bg-primary ms-2">${this.getTypeLabel(data.type)}</span>
                    </div>
                    <p class="text-muted mb-2 small">${data.description || '使用範本生成'}</p>
                    <div class="small text-muted">
                        <i class="fas fa-clock me-1"></i>
                        ${new Date().toLocaleString()}
                    </div>
                </div>
                <div class="ms-3">
                    ${data.download_url ? `
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="window.open('${data.download_url}', '_blank')">
                            <i class="fas fa-download"></i>
                        </button>
                    ` : ''}
                    ${data.google_sheet_url ? `
                        <button class="btn btn-sm btn-outline-success" onclick="window.open('${data.google_sheet_url}', '_blank')">
                            <i class="fab fa-google"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        historyContainer.insertBefore(historyItem, historyContainer.firstChild);

        // 只保留最近10項
        const items = historyContainer.querySelectorAll('.history-item');
        if (items.length > 10) {
            items[items.length - 1].remove();
        }
    }

    getFileIcon(type) {
        const icons = {
            'excel': 'fa-file-excel',
            'google_sheet': 'fa-table',
            'word': 'fa-file-word'
        };
        return icons[type] || 'fa-file';
    }

    getTypeLabel(type) {
        const labels = {
            'excel': 'Excel',
            'google_sheet': 'Google Sheets',
            'word': 'Word'
        };
        return labels[type] || type;
    }

    clearHistory() {
        const historyContainer = document.getElementById('generationHistory');
        if (historyContainer) {
            historyContainer.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-clock fa-2x mb-2"></i>
                    <p>尚未生成任何文件</p>
                </div>
            `;
        }
    }

    // 預設範本生成器
    generateSpreadsheetTemplates() {
        return {
            financial: {
                title: "財務報表範本",
                headers: ["項目", "預算", "實際", "差異", "百分比", "備註"],
                rows: [
                    ["收入", "", "", "", "", ""],
                    ["銷售收入", "100000", "", "", "", ""],
                    ["其他收入", "10000", "", "", "", ""],
                    ["支出", "", "", "", "", ""],
                    ["人事費用", "50000", "", "", "", ""],
                    ["營運費用", "30000", "", "", "", ""],
                    ["行銷費用", "15000", "", "", "", ""],
                    ["淨利潤", "", "", "", "", ""]
                ]
            },
            project: {
                title: "專案計劃範本",
                headers: ["任務", "負責人", "開始日期", "結束日期", "狀態", "進度", "備註"],
                rows: [
                    ["需求分析", "", "", "", "未開始", "0%", ""],
                    ["系統設計", "", "", "", "未開始", "0%", ""],
                    ["程式開發", "", "", "", "未開始", "0%", ""],
                    ["測試階段", "", "", "", "未開始", "0%", ""],
                    ["部署上線", "", "", "", "未開始", "0%", ""]
                ]
            },
            employee: {
                title: "員工清單範本",
                headers: ["員工編號", "姓名", "部門", "職位", "入職日期", "聯絡電話", "電子郵件"],
                rows: [
                    ["", "", "", "", "", "", ""],
                    ["", "", "", "", "", "", ""],
                    ["", "", "", "", "", "", ""]
                ]
            },
            hr_attendance: {
                title: "員工出勤記錄",
                headers: ["員工編號", "姓名", "日期", "上班時間", "下班時間", "工作時數", "加班時數", "請假類型", "備註"],
                rows: [
                    ["E001", "張小明", "2025/01/01", "09:00", "18:00", "8", "0", "", ""],
                    ["E002", "李小華", "2025/01/01", "09:00", "18:00", "8", "0", "", ""],
                    ["E003", "王小美", "2025/01/01", "09:00", "18:00", "8", "0", "", ""]
                ]
            },
            hr_salary: {
                title: "薪資計算表",
                headers: ["員工編號", "姓名", "基本薪資", "加班費", "津貼", "獎金", "應發薪資", "勞保", "健保", "所得稅", "實發薪資"],
                rows: [
                    ["E001", "張小明", "35000", "0", "3000", "5000", "43000", "1400", "517", "2100", "38983"],
                    ["E002", "李小華", "40000", "2000", "3000", "8000", "53000", "1600", "620", "3200", "47580"],
                    ["E003", "王小美", "32000", "1500", "3000", "4000", "40500", "1280", "472", "1800", "36948"]
                ]
            },
            hr_performance: {
                title: "員工績效評估表",
                headers: ["員工編號", "姓名", "部門", "評估期間", "工作品質", "工作效率", "團隊合作", "創新能力", "總分", "等級", "改善建議"],
                rows: [
                    ["E001", "張小明", "技術部", "2025Q1", "85", "80", "90", "75", "82.5", "B+", "可加強創新思維"],
                    ["E002", "李小華", "業務部", "2025Q1", "90", "88", "85", "80", "85.8", "A-", "表現優秀，持續保持"],
                    ["E003", "王小美", "人資部", "2025Q1", "92", "85", "95", "78", "87.5", "A", "優秀員工，可考慮晉升"]
                ]
            },
            hr_recruitment: {
                title: "招聘管理表",
                headers: ["職位", "部門", "需求人數", "發布日期", "截止日期", "應徵人數", "面試人數", "錄取人數", "狀態", "負責人"],
                rows: [
                    ["軟體工程師", "技術部", "2", "2025/01/01", "2025/01/31", "15", "8", "2", "已完成", "張經理"],
                    ["業務專員", "業務部", "3", "2025/01/15", "2025/02/15", "12", "6", "1", "進行中", "李經理"],
                    ["會計師", "財務部", "1", "2025/02/01", "2025/02/28", "8", "4", "0", "面試中", "王經理"]
                ]
            },
            inventory: {
                title: "庫存管理表",
                headers: ["商品編號", "商品名稱", "分類", "規格", "單位", "現有庫存", "安全庫存", "進貨價", "售價", "供應商", "最後進貨日"],
                rows: [
                    ["P001", "筆記型電腦", "3C產品", "15吋", "台", "25", "10", "25000", "35000", "華碩", "2025/01/15"],
                    ["P002", "無線滑鼠", "電腦周邊", "2.4GHz", "個", "50", "20", "300", "599", "羅技", "2025/01/20"],
                    ["P003", "機械鍵盤", "電腦周邊", "青軸", "個", "30", "15", "1200", "2200", "Cherry", "2025/01/10"]
                ]
            },
            sales_report: {
                title: "銷售報表",
                headers: ["日期", "業務員", "客戶名稱", "商品", "數量", "單價", "金額", "折扣", "實收金額", "付款方式", "備註"],
                rows: [
                    ["2025/01/15", "張業務", "ABC公司", "筆記型電腦", "5", "35000", "175000", "5%", "166250", "轉帳", "企業採購"],
                    ["2025/01/16", "李業務", "個人客戶", "無線滑鼠", "2", "599", "1198", "0%", "1198", "現金", "零售"],
                    ["2025/01/17", "王業務", "XYZ工作室", "機械鍵盤", "10", "2200", "22000", "10%", "19800", "信用卡", "批發"]
                ]
            },
            budget_planning: {
                title: "年度預算規劃",
                headers: ["部門", "人事費用", "設備採購", "營運費用", "行銷費用", "研發費用", "其他費用", "總預算", "去年實際", "成長率"],
                rows: [
                    ["技術部", "2400000", "500000", "200000", "50000", "800000", "100000", "4050000", "3800000", "6.6%"],
                    ["業務部", "1800000", "150000", "300000", "600000", "0", "80000", "2930000", "2700000", "8.5%"],
                    ["人資部", "800000", "50000", "100000", "20000", "0", "30000", "1000000", "950000", "5.3%"],
                    ["財務部", "600000", "30000", "80000", "10000", "0", "20000", "740000", "720000", "2.8%"]
                ]
            },
            event_planning: {
                title: "活動企劃表",
                headers: ["活動項目", "負責人", "預計開始", "預計結束", "預算", "實際費用", "參與人數", "狀態", "成效評估", "備註"],
                rows: [
                    ["年終聚餐", "人資部-陳經理", "2025/01/20", "2025/01/20", "50000", "", "80", "籌備中", "", "預訂餐廳"],
                    ["產品發表會", "行銷部-林經理", "2025/02/15", "2025/02/15", "200000", "", "150", "規劃中", "", "需要場地"],
                    ["員工培訓", "人資部-陳經理", "2025/03/01", "2025/03/03", "30000", "", "50", "未開始", "", "外部講師"]
                ]
            },
            hr_leave: {
                title: "請假申請記錄",
                headers: ["申請編號", "員工姓名", "請假類型", "開始日期", "結束日期", "請假天數", "申請原因", "主管審核", "HR審核", "狀態"],
                rows: [
                    ["L001", "張小明", "事假", "2025/01/15", "2025/01/15", "1", "個人事務", "已核准", "已核准", "已核准"],
                    ["L002", "李小華", "病假", "2025/01/20", "2025/01/22", "3", "感冒就醫", "已核准", "已核准", "已核准"],
                    ["L003", "王小美", "年假", "2025/02/01", "2025/02/05", "5", "休假旅遊", "已核准", "待審核", "審核中"]
                ]
            },
            hr_performance: {
                title: "員工績效評估",
                headers: ["員工編號", "姓名", "部門", "評估期間", "工作品質", "工作效率", "團隊合作", "創新能力", "總分", "等級", "改善建議"],
                rows: [
                    ["E001", "張小明", "技術部", "2024Q4", "90", "85", "88", "82", "86.25", "A", "持續保持優異表現"],
                    ["E002", "李小華", "行銷部", "2024Q4", "88", "92", "90", "95", "91.25", "A+", "創新思維突出，建議承擔更多專案"],
                    ["E003", "王小美", "人資部", "2024Q4", "85", "88", "95", "80", "87", "A", "團隊合作能力優秀"]
                ]
            },
            hr_recruitment: {
                title: "招聘管理表",
                headers: ["職位編號", "職位名稱", "部門", "需求人數", "發布日期", "應徵人數", "面試人數", "錄取人數", "到職人數", "招聘狀態"],
                rows: [
                    ["J001", "前端工程師", "技術部", "2", "2025/01/01", "25", "8", "2", "2", "已完成"],
                    ["J002", "行銷專員", "行銷部", "1", "2025/01/05", "15", "5", "1", "0", "待到職"],
                    ["J003", "財務分析師", "財務部", "1", "2025/01/10", "8", "3", "0", "0", "面試中"]
                ]
            },
            hr_training: {
                title: "教育訓練記錄",
                headers: ["訓練編號", "訓練名稱", "訓練類型", "開始日期", "結束日期", "時數", "參與人員", "講師", "費用", "效果評估"],
                rows: [
                    ["T001", "新人職前訓練", "內部訓練", "2025/01/15", "2025/01/17", "24", "5人", "HR部門", "0", "良好"],
                    ["T002", "專案管理課程", "外部訓練", "2025/02/01", "2025/02/03", "18", "10人", "外部講師", "50000", "優秀"],
                    ["T003", "資安認知訓練", "線上課程", "2025/02/10", "2025/02/15", "8", "全體員工", "IT部門", "0", "待評估"]
                ]
            }
        };
    }

    generateDocumentTemplates() {
        return {
            meeting: {
                title: "會議紀錄",
                content: `會議紀錄

會議主題：
日期時間：
地點：
主持人：
出席人員：

議程：
1. 
2. 
3. 

討論內容：


決議事項：
1. 
2. 
3. 

待辦事項：
| 項目 | 負責人 | 期限 |
|------|--------|------|
|      |        |      |

下次會議：
日期：
地點：`
            },
            proposal: {
                title: "項目提案",
                content: `項目提案書

提案標題：
提案人：
提案日期：

一、背景與目標
1.1 專案背景

1.2 專案目標

二、解決方案
2.1 方案概述

2.2 實施計劃

三、資源需求
3.1 人力資源

3.2 預算需求

四、效益評估
4.1 預期效益

4.2 風險評估

五、時程規劃
| 階段 | 時間 | 里程碑 |
|------|------|--------|
|      |      |        |

六、結論`
            }
        };
    }
}

// 導出類別
window.DocumentGenerator = DocumentGenerator;

// 初始化文件生成器
document.addEventListener('DOMContentLoaded', function() {
    // 等待主應用載入完成
    setTimeout(() => {
        if (typeof window.app !== 'undefined') {
            window.documentGenerator = new DocumentGenerator(window.app);
            console.log('文件生成器已初始化');
        } else {
            // 如果主應用尚未載入，創建簡單實例
            window.documentGenerator = new DocumentGenerator();
            console.log('文件生成器已初始化（獨立模式）');
        }
    }, 500);
});