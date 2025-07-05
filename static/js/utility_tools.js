// 實用工具集合
console.log('載入實用工具集合...');

// ====== JSON格式化器 ======
function showJSONFormatter() {
    const modal = createToolModal('JSON格式化器', `
        <div class="row">
            <div class="col-md-6">
                <h6>輸入JSON</h6>
                <textarea id="jsonInput" class="form-control" rows="15" placeholder="在此輸入JSON數據..."></textarea>
                <div class="mt-2">
                    <button class="btn btn-primary btn-sm" onclick="formatJSON()">格式化</button>
                    <button class="btn btn-secondary btn-sm" onclick="validateJSON()">驗證</button>
                    <button class="btn btn-warning btn-sm" onclick="minifyJSON()">壓縮</button>
                </div>
            </div>
            <div class="col-md-6">
                <h6>輸出結果</h6>
                <textarea id="jsonOutput" class="form-control" rows="15" readonly></textarea>
                <div class="mt-2">
                    <button class="btn btn-success btn-sm" onclick="copyJSONResult()">複製結果</button>
                    <span id="jsonStatus" class="ms-2"></span>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    modal.querySelector('.modal').addEventListener('hidden.bs.modal', () => modal.remove());
    new bootstrap.Modal(modal.querySelector('.modal')).show();
}

function formatJSON() {
    const input = document.getElementById('jsonInput').value;
    const output = document.getElementById('jsonOutput');
    const status = document.getElementById('jsonStatus');
    
    try {
        const parsed = JSON.parse(input);
        output.value = JSON.stringify(parsed, null, 2);
        status.innerHTML = '<span class="text-success">✓ JSON格式正確</span>';
    } catch (error) {
        output.value = `錯誤: ${error.message}`;
        status.innerHTML = '<span class="text-danger">✗ JSON格式錯誤</span>';
    }
}

function validateJSON() {
    const input = document.getElementById('jsonInput').value;
    const status = document.getElementById('jsonStatus');
    
    try {
        JSON.parse(input);
        status.innerHTML = '<span class="text-success">✓ JSON格式正確</span>';
    } catch (error) {
        status.innerHTML = `<span class="text-danger">✗ 錯誤: ${error.message}</span>`;
    }
}

function minifyJSON() {
    const input = document.getElementById('jsonInput').value;
    const output = document.getElementById('jsonOutput');
    const status = document.getElementById('jsonStatus');
    
    try {
        const parsed = JSON.parse(input);
        output.value = JSON.stringify(parsed);
        status.innerHTML = '<span class="text-success">✓ JSON已壓縮</span>';
    } catch (error) {
        output.value = `錯誤: ${error.message}`;
        status.innerHTML = '<span class="text-danger">✗ JSON格式錯誤</span>';
    }
}

function copyJSONResult() {
    const output = document.getElementById('jsonOutput');
    output.select();
    document.execCommand('copy');
    document.getElementById('jsonStatus').innerHTML = '<span class="text-info">已複製到剪貼簿</span>';
}

// ====== Base64編碼解碼器 ======
function showBase64Tool() {
    const modal = createToolModal('Base64編碼解碼器', `
        <div class="row">
            <div class="col-md-6">
                <h6>文字編碼/解碼</h6>
                <textarea id="textInput" class="form-control" rows="8" placeholder="輸入要編碼的文字..."></textarea>
                <div class="mt-2">
                    <button class="btn btn-primary btn-sm" onclick="encodeBase64()">編碼</button>
                    <button class="btn btn-secondary btn-sm" onclick="decodeBase64()">解碼</button>
                </div>
                <h6 class="mt-4">圖片編碼</h6>
                <input type="file" id="imageInput" class="form-control" accept="image/*" onchange="encodeImageToBase64()">
            </div>
            <div class="col-md-6">
                <h6>結果</h6>
                <textarea id="base64Output" class="form-control" rows="12" readonly></textarea>
                <div class="mt-2">
                    <button class="btn btn-success btn-sm" onclick="copyBase64Result()">複製結果</button>
                    <span id="base64Status" class="ms-2"></span>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    modal.querySelector('.modal').addEventListener('hidden.bs.modal', () => modal.remove());
    new bootstrap.Modal(modal.querySelector('.modal')).show();
}

function encodeBase64() {
    const input = document.getElementById('textInput').value;
    const output = document.getElementById('base64Output');
    
    try {
        output.value = btoa(unescape(encodeURIComponent(input)));
        document.getElementById('base64Status').innerHTML = '<span class="text-success">✓ 編碼完成</span>';
    } catch (error) {
        output.value = `錯誤: ${error.message}`;
        document.getElementById('base64Status').innerHTML = '<span class="text-danger">✗ 編碼失敗</span>';
    }
}

function decodeBase64() {
    const input = document.getElementById('textInput').value;
    const output = document.getElementById('base64Output');
    
    try {
        output.value = decodeURIComponent(escape(atob(input)));
        document.getElementById('base64Status').innerHTML = '<span class="text-success">✓ 解碼完成</span>';
    } catch (error) {
        output.value = `錯誤: ${error.message}`;
        document.getElementById('base64Status').innerHTML = '<span class="text-danger">✗ 解碼失敗</span>';
    }
}

function encodeImageToBase64() {
    const file = document.getElementById('imageInput').files[0];
    const output = document.getElementById('base64Output');
    
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        output.value = e.target.result;
        document.getElementById('base64Status').innerHTML = '<span class="text-success">✓ 圖片編碼完成</span>';
    };
    reader.readAsDataURL(file);
}

function copyBase64Result() {
    const output = document.getElementById('base64Output');
    output.select();
    document.execCommand('copy');
    document.getElementById('base64Status').innerHTML = '<span class="text-info">已複製到剪貼簿</span>';
}

// ====== Markdown預覽器 ======
function showMarkdownPreviewer() {
    const modal = createToolModal('Markdown預覽器', `
        <div class="row">
            <div class="col-md-6">
                <h6>Markdown編輯器</h6>
                <textarea id="markdownInput" class="form-control" rows="20" placeholder="# 標題1&#10;## 標題2&#10;&#10;**粗體文字**&#10;*斜體文字*&#10;&#10;- 項目1&#10;- 項目2&#10;&#10;[連結](https://example.com)&#10;&#10;\`程式碼\`&#10;&#10;\`\`\`&#10;程式碼區塊&#10;\`\`\`" oninput="updateMarkdownPreview()"></textarea>
            </div>
            <div class="col-md-6">
                <h6>預覽</h6>
                <div id="markdownPreview" class="border p-3" style="height: 500px; overflow-y: auto; background: white; color: black;"></div>
                <div class="mt-2">
                    <button class="btn btn-success btn-sm" onclick="copyMarkdownHTML()">複製HTML</button>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    modal.querySelector('.modal').addEventListener('hidden.bs.modal', () => modal.remove());
    new bootstrap.Modal(modal.querySelector('.modal')).show();
    
    // 初始預覽
    updateMarkdownPreview();
}

function updateMarkdownPreview() {
    const input = document.getElementById('markdownInput').value;
    const preview = document.getElementById('markdownPreview');
    
    // 簡單的Markdown渲染器
    let html = input
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\`(.*?)\`/gim, '<code>$1</code>')
        .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        .replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
        .replace(/\n/gim, '<br>');
    
    preview.innerHTML = html;
}

function copyMarkdownHTML() {
    const preview = document.getElementById('markdownPreview');
    const textArea = document.createElement('textarea');
    textArea.value = preview.innerHTML;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('HTML已複製到剪貼簿');
}

// ====== CSV/Excel轉換器 ======
function showCSVConverter() {
    const modal = createToolModal('CSV/Excel轉換器', `
        <div class="row">
            <div class="col-md-6">
                <h6>輸入資料</h6>
                <div class="mb-3">
                    <label class="form-label">輸入方式</label>
                    <select id="inputMethod" class="form-select" onchange="toggleInputMethod()">
                        <option value="text">手動輸入CSV</option>
                        <option value="file">上傳檔案</option>
                    </select>
                </div>
                
                <div id="textInputSection">
                    <textarea id="csvInput" class="form-control" rows="8" placeholder="輸入CSV資料，例如：&#10;姓名,年齡,城市&#10;張三,25,台北&#10;李四,30,台中"></textarea>
                </div>
                
                <div id="fileInputSection" style="display: none;">
                    <input type="file" id="csvFileInput" class="form-control" accept=".csv,.xlsx,.xls" onchange="handleFileUpload()">
                    <small class="text-muted">支援 CSV, Excel (.xlsx, .xls) 檔案</small>
                </div>
                
                <div class="mt-3">
                    <div class="row">
                        <div class="col-6">
                            <label class="form-label">分隔符號</label>
                            <select id="delimiter" class="form-select">
                                <option value=",">逗號 (,)</option>
                                <option value=";">分號 (;)</option>
                                <option value="|">豎線 (|)</option>
                                <option value=" ">Tab</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <label class="form-label">編碼</label>
                            <select id="encoding" class="form-select">
                                <option value="utf-8">UTF-8</option>
                                <option value="big5">Big5</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="mt-3">
                    <button class="btn btn-primary" onclick="convertCSV()">轉換</button>
                    <button class="btn btn-secondary" onclick="clearCSVData()">清除</button>
                </div>
            </div>
            
            <div class="col-md-6">
                <h6>輸出格式</h6>
                <div class="mb-3">
                    <select id="outputFormat" class="form-select">
                        <option value="table">HTML表格</option>
                        <option value="csv">CSV格式</option>
                        <option value="json">JSON格式</option>
                        <option value="excel">Excel格式</option>
                    </select>
                </div>
                
                <div id="csvOutput" style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; background: #f8f9fa;">
                    <p class="text-muted">請輸入CSV資料並點擊轉換</p>
                </div>
                
                <div class="mt-3">
                    <button class="btn btn-success" onclick="copyCSVResult()">複製結果</button>
                    <button class="btn btn-info" onclick="downloadCSVResult()">下載檔案</button>
                    <span id="csvStatus" class="ms-2"></span>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    modal.querySelector('.modal').addEventListener('hidden.bs.modal', () => modal.remove());
    new bootstrap.Modal(modal.querySelector('.modal')).show();
}

function toggleInputMethod() {
    const method = document.getElementById('inputMethod').value;
    const textSection = document.getElementById('textInputSection');
    const fileSection = document.getElementById('fileInputSection');
    
    if (method === 'text') {
        textSection.style.display = 'block';
        fileSection.style.display = 'none';
    } else {
        textSection.style.display = 'none';
        fileSection.style.display = 'block';
    }
}

function handleFileUpload() {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];
    
    if (!file) return;
    
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.csv')) {
        // 讀取CSV檔案
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('csvInput').value = e.target.result;
            document.getElementById('csvStatus').innerHTML = '<span class="text-success">✓ CSV檔案載入成功</span>';
        };
        reader.readAsText(file);
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        // Excel檔案需要特殊處理
        document.getElementById('csvStatus').innerHTML = '<span class="text-warning">Excel檔案讀取功能開發中，請先轉存為CSV格式</span>';
    } else {
        document.getElementById('csvStatus').innerHTML = '<span class="text-danger">不支援的檔案格式</span>';
    }
}

function convertCSV() {
    const input = document.getElementById('csvInput').value.trim();
    const delimiter = document.getElementById('delimiter').value;
    const outputFormat = document.getElementById('outputFormat').value;
    const output = document.getElementById('csvOutput');
    const status = document.getElementById('csvStatus');
    
    if (!input) {
        status.innerHTML = '<span class="text-warning">請輸入CSV資料</span>';
        return;
    }
    
    try {
        // 解析CSV資料
        const lines = input.split('\n').filter(line => line.trim());
        const data = lines.map(line => parseCSVLine(line, delimiter));
        
        // 驗證資料
        if (data.length === 0) {
            throw new Error('沒有有效的資料行');
        }
        
        // 根據輸出格式轉換
        let result = '';
        
        switch (outputFormat) {
            case 'table':
                result = convertToHTMLTable(data);
                output.innerHTML = result;
                break;
                
            case 'csv':
                result = convertToCSV(data, delimiter);
                output.innerHTML = `<pre>${result}</pre>`;
                break;
                
            case 'json':
                result = convertToJSON(data);
                output.innerHTML = `<pre>${JSON.stringify(JSON.parse(result), null, 2)}</pre>`;
                break;
                
            case 'excel':
                result = convertToExcelFormat(data);
                output.innerHTML = result;
                break;
                
            default:
                throw new Error('不支援的輸出格式');
        }
        
        // 儲存結果供下載使用
        window.csvConvertResult = {
            format: outputFormat,
            data: result,
            rawData: data
        };
        
        status.innerHTML = '<span class="text-success">✓ 轉換完成</span>';
        
    } catch (error) {
        output.innerHTML = `<p class="text-danger">轉換錯誤: ${error.message}</p>`;
        status.innerHTML = '<span class="text-danger">✗ 轉換失敗</span>';
    }
}

function parseCSVLine(line, delimiter) {
    // 簡單的CSV解析器，處理引號包圍的欄位
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

function convertToHTMLTable(data) {
    if (data.length === 0) return '<p>沒有資料</p>';
    
    let html = '<table class="table table-bordered table-sm">';
    
    // 表頭
    html += '<thead class="table-dark"><tr>';
    data[0].forEach(header => {
        html += `<th>${header}</th>`;
    });
    html += '</tr></thead>';
    
    // 資料行
    html += '<tbody>';
    for (let i = 1; i < data.length; i++) {
        html += '<tr>';
        data[i].forEach(cell => {
            html += `<td>${cell}</td>`;
        });
        html += '</tr>';
    }
    html += '</tbody></table>';
    
    return html;
}

function convertToCSV(data, delimiter) {
    return data.map(row => 
        row.map(cell => {
            // 如果欄位包含分隔符號或引號，需要用引號包圍
            if (cell.includes(delimiter) || cell.includes('"') || cell.includes('\n')) {
                return `"${cell.replace(/"/g, '""')}"`;
            }
            return cell;
        }).join(delimiter)
    ).join('\n');
}

function convertToJSON(data) {
    if (data.length < 2) return '[]';
    
    const headers = data[0];
    const rows = data.slice(1);
    
    const jsonData = rows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = row[index] || '';
        });
        return obj;
    });
    
    return JSON.stringify(jsonData);
}

function convertToExcelFormat(data) {
    // 生成Excel相容的HTML格式
    let html = '<table border="1">';
    
    data.forEach((row, index) => {
        html += '<tr>';
        row.forEach(cell => {
            const tag = index === 0 ? 'th' : 'td';
            html += `<${tag}>${cell}</${tag}>`;
        });
        html += '</tr>';
    });
    
    html += '</table>';
    html += '<p class="text-info mt-2">此格式可以直接複製到Excel中</p>';
    
    return html;
}

function clearCSVData() {
    document.getElementById('csvInput').value = '';
    document.getElementById('csvOutput').innerHTML = '<p class="text-muted">請輸入CSV資料並點擊轉換</p>';
    document.getElementById('csvStatus').innerHTML = '';
    
    const fileInput = document.getElementById('csvFileInput');
    if (fileInput) fileInput.value = '';
}

function copyCSVResult() {
    const outputFormat = document.getElementById('outputFormat').value;
    let textToCopy = '';
    
    if (window.csvConvertResult) {
        if (outputFormat === 'table' || outputFormat === 'excel') {
            // 對於表格格式，複製純文字版本
            const data = window.csvConvertResult.rawData;
            textToCopy = convertToCSV(data, '\t'); // 使用Tab分隔便於貼到Excel
        } else {
            textToCopy = window.csvConvertResult.data;
        }
        
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        document.getElementById('csvStatus').innerHTML = '<span class="text-info">已複製到剪貼簿</span>';
    } else {
        document.getElementById('csvStatus').innerHTML = '<span class="text-warning">沒有資料可複製</span>';
    }
}

function downloadCSVResult() {
    if (!window.csvConvertResult) {
        document.getElementById('csvStatus').innerHTML = '<span class="text-warning">沒有資料可下載</span>';
        return;
    }
    
    const format = window.csvConvertResult.format;
    const data = window.csvConvertResult.rawData;
    let content = '';
    let filename = '';
    let mimeType = '';
    
    switch (format) {
        case 'csv':
            content = convertToCSV(data, ',');
            filename = 'converted_data.csv';
            mimeType = 'text/csv';
            break;
            
        case 'json':
            content = convertToJSON(data);
            filename = 'converted_data.json';
            mimeType = 'application/json';
            break;
            
        case 'table':
        case 'excel':
            content = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>轉換資料</title>
    <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    ${convertToHTMLTable(data)}
</body>
</html>`;
            filename = 'converted_data.html';
            mimeType = 'text/html';
            break;
            
        default:
            content = convertToCSV(data, ',');
            filename = 'converted_data.csv';
            mimeType = 'text/csv';
    }
    
    // 創建下載連結
    const blob = new Blob([content], { type: mimeType + ';charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        document.getElementById('csvStatus').innerHTML = '<span class="text-success">檔案下載開始</span>';
    } else {
        document.getElementById('csvStatus').innerHTML = '<span class="text-danger">瀏覽器不支援檔案下載</span>';
    }
}

// ====== 正則表達式測試器 ======
function showRegexTester() {
    const modal = createToolModal('正則表達式測試器', `
        <div class="mb-3">
            <label class="form-label">正則表達式</label>
            <input type="text" id="regexPattern" class="form-control" placeholder="例如: \\d{3}-\\d{3}-\\d{4}" oninput="testRegex()">
            <div class="form-check mt-2">
                <input class="form-check-input" type="checkbox" id="regexGlobal" onchange="testRegex()">
                <label class="form-check-label" for="regexGlobal">全域匹配 (g)</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="regexIgnoreCase" onchange="testRegex()">
                <label class="form-check-label" for="regexIgnoreCase">忽略大小寫 (i)</label>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <h6>測試文字</h6>
                <textarea id="regexTestText" class="form-control" rows="10" placeholder="輸入要測試的文字..." oninput="testRegex()"></textarea>
            </div>
            <div class="col-md-6">
                <h6>匹配結果</h6>
                <div id="regexResults" class="border p-3" style="height: 250px; overflow-y: auto; background: #f8f9fa;"></div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    modal.querySelector('.modal').addEventListener('hidden.bs.modal', () => modal.remove());
    new bootstrap.Modal(modal.querySelector('.modal')).show();
}

function testRegex() {
    const pattern = document.getElementById('regexPattern').value;
    const testText = document.getElementById('regexTestText').value;
    const global = document.getElementById('regexGlobal').checked;
    const ignoreCase = document.getElementById('regexIgnoreCase').checked;
    const results = document.getElementById('regexResults');
    
    if (!pattern || !testText) {
        results.innerHTML = '<p class="text-muted">請輸入正則表達式和測試文字</p>';
        return;
    }
    
    try {
        let flags = '';
        if (global) flags += 'g';
        if (ignoreCase) flags += 'i';
        
        const regex = new RegExp(pattern, flags);
        const matches = testText.match(regex);
        
        if (matches) {
            let html = `<strong>找到 ${matches.length} 個匹配:</strong><br>`;
            matches.forEach((match, index) => {
                html += `<div class="mt-1"><span class="badge bg-success">${index + 1}</span> ${match}</div>`;
            });
            results.innerHTML = html;
        } else {
            results.innerHTML = '<p class="text-warning">沒有找到匹配</p>';
        }
    } catch (error) {
        results.innerHTML = `<p class="text-danger">錯誤: ${error.message}</p>`;
    }
}

// ====== URL編碼解碼器 ======
function showURLEncoder() {
    const modal = createToolModal('URL編碼解碼器', `
        <div class="row">
            <div class="col-md-6">
                <h6>輸入</h6>
                <textarea id="urlInput" class="form-control" rows="8" placeholder="輸入URL或文字..."></textarea>
                <div class="mt-2">
                    <button class="btn btn-primary btn-sm" onclick="encodeURL()">編碼</button>
                    <button class="btn btn-secondary btn-sm" onclick="decodeURL()">解碼</button>
                </div>
            </div>
            <div class="col-md-6">
                <h6>結果</h6>
                <textarea id="urlOutput" class="form-control" rows="8" readonly></textarea>
                <div class="mt-2">
                    <button class="btn btn-success btn-sm" onclick="copyURLResult()">複製結果</button>
                    <span id="urlStatus" class="ms-2"></span>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    modal.querySelector('.modal').addEventListener('hidden.bs.modal', () => modal.remove());
    new bootstrap.Modal(modal.querySelector('.modal')).show();
}

function encodeURL() {
    const input = document.getElementById('urlInput').value;
    const output = document.getElementById('urlOutput');
    
    try {
        output.value = encodeURIComponent(input);
        document.getElementById('urlStatus').innerHTML = '<span class="text-success">✓ 編碼完成</span>';
    } catch (error) {
        output.value = `錯誤: ${error.message}`;
        document.getElementById('urlStatus').innerHTML = '<span class="text-danger">✗ 編碼失敗</span>';
    }
}

function decodeURL() {
    const input = document.getElementById('urlInput').value;
    const output = document.getElementById('urlOutput');
    
    try {
        output.value = decodeURIComponent(input);
        document.getElementById('urlStatus').innerHTML = '<span class="text-success">✓ 解碼完成</span>';
    } catch (error) {
        output.value = `錯誤: ${error.message}`;
        document.getElementById('urlStatus').innerHTML = '<span class="text-danger">✗ 解碼失敗</span>';
    }
}

function copyURLResult() {
    const output = document.getElementById('urlOutput');
    output.select();
    document.execCommand('copy');
    document.getElementById('urlStatus').innerHTML = '<span class="text-info">已複製到剪貼簿</span>';
}

// ====== Hash生成器 ======
function showHashGenerator() {
    const modal = createToolModal('Hash生成器', `
        <div class="mb-3">
            <label class="form-label">輸入文字</label>
            <textarea id="hashInput" class="form-control" rows="5" placeholder="輸入要生成Hash的文字..." oninput="generateHashes()"></textarea>
        </div>
        <div class="row">
            <div class="col-md-4">
                <h6>MD5</h6>
                <input type="text" id="md5Output" class="form-control" readonly>
                <button class="btn btn-sm btn-outline-primary mt-1" onclick="copyHash('md5Output')">複製</button>
            </div>
            <div class="col-md-4">
                <h6>SHA-1</h6>
                <input type="text" id="sha1Output" class="form-control" readonly>
                <button class="btn btn-sm btn-outline-primary mt-1" onclick="copyHash('sha1Output')">複製</button>
            </div>
            <div class="col-md-4">
                <h6>SHA-256</h6>
                <input type="text" id="sha256Output" class="form-control" readonly>
                <button class="btn btn-sm btn-outline-primary mt-1" onclick="copyHash('sha256Output')">複製</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    modal.querySelector('.modal').addEventListener('hidden.bs.modal', () => modal.remove());
    new bootstrap.Modal(modal.querySelector('.modal')).show();
}

async function generateHashes() {
    const input = document.getElementById('hashInput').value;
    
    if (!input) {
        document.getElementById('md5Output').value = '';
        document.getElementById('sha1Output').value = '';
        document.getElementById('sha256Output').value = '';
        return;
    }
    
    // 使用Web Crypto API生成SHA-1和SHA-256
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    
    try {
        // SHA-1
        const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
        const sha1Array = Array.from(new Uint8Array(sha1Buffer));
        const sha1Hex = sha1Array.map(b => b.toString(16).padStart(2, '0')).join('');
        document.getElementById('sha1Output').value = sha1Hex;
        
        // SHA-256
        const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
        const sha256Array = Array.from(new Uint8Array(sha256Buffer));
        const sha256Hex = sha256Array.map(b => b.toString(16).padStart(2, '0')).join('');
        document.getElementById('sha256Output').value = sha256Hex;
        
        // MD5 (簡化實現)
        document.getElementById('md5Output').value = 'MD5需要額外函式庫';
    } catch (error) {
        console.error('Hash生成錯誤:', error);
    }
}

function copyHash(outputId) {
    const output = document.getElementById(outputId);
    output.select();
    document.execCommand('copy');
    alert('Hash值已複製到剪貼簿');
}

// ====== Lorem Ipsum生成器 ======
function showLoremIpsumGenerator() {
    const modal = createToolModal('Lorem Ipsum生成器', `
        <div class="row mb-3">
            <div class="col-md-4">
                <label class="form-label">類型</label>
                <select id="loremType" class="form-select">
                    <option value="paragraphs">段落</option>
                    <option value="words">單詞</option>
                    <option value="sentences">句子</option>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label">數量</label>
                <input type="number" id="loremCount" class="form-control" value="3" min="1" max="50">
            </div>
            <div class="col-md-4">
                <label class="form-label">&nbsp;</label>
                <button class="btn btn-primary d-block" onclick="generateLoremIpsum()">生成</button>
            </div>
        </div>
        <div class="mb-3">
            <textarea id="loremOutput" class="form-control" rows="15" readonly></textarea>
        </div>
        <div>
            <button class="btn btn-success" onclick="copyLoremResult()">複製結果</button>
            <span id="loremStatus" class="ms-2"></span>
        </div>
    `);
    
    document.body.appendChild(modal);
    modal.querySelector('.modal').addEventListener('hidden.bs.modal', () => modal.remove());
    new bootstrap.Modal(modal.querySelector('.modal')).show();
    
    generateLoremIpsum();
}

function generateLoremIpsum() {
    const type = document.getElementById('loremType').value;
    const count = parseInt(document.getElementById('loremCount').value);
    const output = document.getElementById('loremOutput');
    
    const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'];
    
    let result = '';
    
    if (type === 'words') {
        for (let i = 0; i < count; i++) {
            result += words[Math.floor(Math.random() * words.length)];
            if (i < count - 1) result += ' ';
        }
    } else if (type === 'sentences') {
        for (let i = 0; i < count; i++) {
            const sentenceLength = Math.floor(Math.random() * 10) + 5;
            let sentence = '';
            for (let j = 0; j < sentenceLength; j++) {
                sentence += words[Math.floor(Math.random() * words.length)];
                if (j < sentenceLength - 1) sentence += ' ';
            }
            result += sentence.charAt(0).toUpperCase() + sentence.slice(1) + '. ';
        }
    } else {
        for (let i = 0; i < count; i++) {
            const paragraphLength = Math.floor(Math.random() * 5) + 3;
            let paragraph = '';
            for (let j = 0; j < paragraphLength; j++) {
                const sentenceLength = Math.floor(Math.random() * 10) + 5;
                let sentence = '';
                for (let k = 0; k < sentenceLength; k++) {
                    sentence += words[Math.floor(Math.random() * words.length)];
                    if (k < sentenceLength - 1) sentence += ' ';
                }
                paragraph += sentence.charAt(0).toUpperCase() + sentence.slice(1) + '. ';
            }
            result += paragraph + '\n\n';
        }
    }
    
    output.value = result.trim();
    document.getElementById('loremStatus').innerHTML = '<span class="text-success">✓ 生成完成</span>';
}

function copyLoremResult() {
    const output = document.getElementById('loremOutput');
    output.select();
    document.execCommand('copy');
    document.getElementById('loremStatus').innerHTML = '<span class="text-info">已複製到剪貼簿</span>';
}

// ====== BMI計算器 ======
function showBMICalculator() {
    const modal = createToolModal('BMI計算器', `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">身高 (公分)</label>
                    <input type="number" id="height" class="form-control" placeholder="170" oninput="calculateBMI()">
                </div>
                <div class="mb-3">
                    <label class="form-label">體重 (公斤)</label>
                    <input type="number" id="weight" class="form-control" placeholder="70" oninput="calculateBMI()">
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body text-center">
                        <h5>BMI結果</h5>
                        <h2 id="bmiValue" class="text-primary">--</h2>
                        <p id="bmiCategory" class="mb-0">請輸入身高和體重</p>
                    </div>
                </div>
                <div class="mt-3">
                    <h6>BMI分類標準</h6>
                    <small>
                        <div>過輕: &lt; 18.5</div>
                        <div>正常: 18.5 - 24.9</div>
                        <div>過重: 25.0 - 29.9</div>
                        <div>肥胖: ≥ 30.0</div>
                    </small>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    modal.querySelector('.modal').addEventListener('hidden.bs.modal', () => modal.remove());
    new bootstrap.Modal(modal.querySelector('.modal')).show();
}

function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const bmiValue = document.getElementById('bmiValue');
    const bmiCategory = document.getElementById('bmiCategory');
    
    if (!height || !weight || height <= 0 || weight <= 0) {
        bmiValue.textContent = '--';
        bmiCategory.textContent = '請輸入有效的身高和體重';
        return;
    }
    
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    bmiValue.textContent = bmi.toFixed(1);
    
    if (bmi < 18.5) {
        bmiCategory.innerHTML = '<span class="text-info">過輕</span>';
    } else if (bmi < 25) {
        bmiCategory.innerHTML = '<span class="text-success">正常</span>';
    } else if (bmi < 30) {
        bmiCategory.innerHTML = '<span class="text-warning">過重</span>';
    } else {
        bmiCategory.innerHTML = '<span class="text-danger">肥胖</span>';
    }
}

// ====== 匯率轉換器 ======
function showCurrencyConverter() {
    const modal = createToolModal('匯率轉換器', `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">金額</label>
                    <input type="number" id="amount" class="form-control" placeholder="100" oninput="convertCurrency()">
                </div>
                <div class="mb-3">
                    <label class="form-label">從</label>
                    <select id="fromCurrency" class="form-select" onchange="convertCurrency()">
                        <option value="USD">美元 (USD)</option>
                        <option value="EUR">歐元 (EUR)</option>
                        <option value="TWD" selected>新台幣 (TWD)</option>
                        <option value="JPY">日圓 (JPY)</option>
                        <option value="KRW">韓圓 (KRW)</option>
                        <option value="CNY">人民幣 (CNY)</option>
                        <option value="HKD">港幣 (HKD)</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">到</label>
                    <select id="toCurrency" class="form-select" onchange="convertCurrency()">
                        <option value="USD" selected>美元 (USD)</option>
                        <option value="EUR">歐元 (EUR)</option>
                        <option value="TWD">新台幣 (TWD)</option>
                        <option value="JPY">日圓 (JPY)</option>
                        <option value="KRW">韓圓 (KRW)</option>
                        <option value="CNY">人民幣 (CNY)</option>
                        <option value="HKD">港幣 (HKD)</option>
                    </select>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body text-center">
                        <h5>轉換結果</h5>
                        <h3 id="conversionResult" class="text-primary">--</h3>
                        <p id="exchangeRate" class="text-muted">匯率: --</p>
                    </div>
                </div>
                <div class="mt-3">
                    <small class="text-muted">
                        注意: 此為示範匯率，實際匯率請參考銀行或金融機構
                    </small>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    modal.querySelector('.modal').addEventListener('hidden.bs.modal', () => modal.remove());
    new bootstrap.Modal(modal.querySelector('.modal')).show();
}

function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const result = document.getElementById('conversionResult');
    const rateDisplay = document.getElementById('exchangeRate');
    
    // 示範匯率（實際應用應該從API獲取）
    const rates = {
        'USD': { 'TWD': 31.5, 'EUR': 0.85, 'JPY': 110, 'KRW': 1200, 'CNY': 6.4, 'HKD': 7.8 },
        'TWD': { 'USD': 0.032, 'EUR': 0.027, 'JPY': 3.5, 'KRW': 38, 'CNY': 0.2, 'HKD': 0.25 },
        'EUR': { 'USD': 1.18, 'TWD': 37, 'JPY': 130, 'KRW': 1400, 'CNY': 7.5, 'HKD': 9.2 }
    };
    
    if (!amount || amount <= 0) {
        result.textContent = '--';
        rateDisplay.textContent = '匯率: --';
        return;
    }
    
    if (fromCurrency === toCurrency) {
        result.textContent = amount.toFixed(2);
        rateDisplay.textContent = '匯率: 1.00';
        return;
    }
    
    let rate = 1;
    if (rates[fromCurrency] && rates[fromCurrency][toCurrency]) {
        rate = rates[fromCurrency][toCurrency];
    } else if (rates[toCurrency] && rates[toCurrency][fromCurrency]) {
        rate = 1 / rates[toCurrency][fromCurrency];
    } else {
        // 通過USD轉換
        const toUsdRate = rates['USD'][fromCurrency] ? 1/rates['USD'][fromCurrency] : 1;
        const fromUsdRate = rates['USD'][toCurrency] || 1;
        rate = toUsdRate * fromUsdRate;
    }
    
    const convertedAmount = amount * rate;
    result.textContent = convertedAmount.toFixed(2);
    rateDisplay.textContent = `匯率: 1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
}

// ====== IP位址查詢器 ======
function showIPLookup() {
    const modal = createToolModal('IP位址查詢器', `
        <div class="mb-3">
            <label class="form-label">IP位址</label>
            <div class="input-group">
                <input type="text" id="ipAddress" class="form-control" placeholder="輸入IP位址或留空查詢本機IP">
                <button class="btn btn-primary" onclick="lookupIP()">查詢</button>
            </div>
        </div>
        <div id="ipResults" class="border p-3" style="min-height: 200px; background: #f8f9fa;">
            <p class="text-muted">輸入IP位址並點擊查詢</p>
        </div>
    `);
    
    document.body.appendChild(modal);
    modal.querySelector('.modal').addEventListener('hidden.bs.modal', () => modal.remove());
    new bootstrap.Modal(modal.querySelector('.modal')).show();
}

function lookupIP() {
    const ipAddress = document.getElementById('ipAddress').value.trim();
    const results = document.getElementById('ipResults');
    
    results.innerHTML = '<p class="text-info">查詢中...</p>';
    
    if (!ipAddress) {
        // 查詢本機IP
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                results.innerHTML = `
                    <h6>您的公共IP位址</h6>
                    <p><strong>IP:</strong> ${data.ip}</p>
                    <p class="text-muted">這是您的公共IP位址</p>
                `;
            })
            .catch(error => {
                results.innerHTML = '<p class="text-danger">無法獲取IP資訊</p>';
            });
    } else {
        // 驗證IP格式
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!ipRegex.test(ipAddress)) {
            results.innerHTML = '<p class="text-danger">IP位址格式不正確</p>';
            return;
        }
        
        // 示範IP資訊（實際應用需要使用IP地理位置API）
        results.innerHTML = `
            <h6>IP位址資訊</h6>
            <p><strong>IP:</strong> ${ipAddress}</p>
            <p><strong>類型:</strong> IPv4</p>
            <p><strong>位置:</strong> 需要API服務查詢詳細位置</p>
            <p class="text-muted">詳細地理位置資訊需要集成第三方API服務</p>
        `;
    }
}

// ====== 通用工具模態框創建函數 ======
function createToolModal(title, content) {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        </div>
    `;
    return modal;
}

// ====== 事件監聽器綁定 ======
document.addEventListener('DOMContentLoaded', function() {
    // JSON格式化器
    const jsonFormatterBtn = document.getElementById('jsonFormatterBtn');
    if (jsonFormatterBtn) {
        jsonFormatterBtn.addEventListener('click', showJSONFormatter);
    }
    
    // Base64編碼解碼器
    const base64Btn = document.getElementById('base64Btn');
    if (base64Btn) {
        base64Btn.addEventListener('click', showBase64Tool);
    }
    
    // Markdown預覽器
    const markdownBtn = document.getElementById('markdownBtn');
    if (markdownBtn) {
        markdownBtn.addEventListener('click', showMarkdownPreviewer);
    }
    
    // 正則表達式測試器
    const regexTesterBtn = document.getElementById('regexTesterBtn');
    if (regexTesterBtn) {
        regexTesterBtn.addEventListener('click', showRegexTester);
    }
    
    // URL編碼解碼器
    const urlEncoderBtn = document.getElementById('urlEncoderBtn');
    if (urlEncoderBtn) {
        urlEncoderBtn.addEventListener('click', showURLEncoder);
    }
    
    // Hash生成器
    const hashGeneratorBtn = document.getElementById('hashGeneratorBtn');
    if (hashGeneratorBtn) {
        hashGeneratorBtn.addEventListener('click', showHashGenerator);
    }
    
    // Lorem Ipsum生成器
    const loremIpsumBtn = document.getElementById('loremIpsumBtn');
    if (loremIpsumBtn) {
        loremIpsumBtn.addEventListener('click', showLoremIpsumGenerator);
    }
    
    // BMI計算器
    const bmiCalculatorBtn = document.getElementById('bmiCalculatorBtn');
    if (bmiCalculatorBtn) {
        bmiCalculatorBtn.addEventListener('click', showBMICalculator);
    }
    
    // 匯率轉換器
    const currencyConverterBtn = document.getElementById('currencyConverterBtn');
    if (currencyConverterBtn) {
        currencyConverterBtn.addEventListener('click', showCurrencyConverter);
    }
    
    // IP位址查詢器
    const ipLookupBtn = document.getElementById('ipLookupBtn');
    if (ipLookupBtn) {
        ipLookupBtn.addEventListener('click', showIPLookup);
    }
    
    // CSV/Excel轉換器
    const csvConverterBtn = document.getElementById('csvConverterBtn');
    if (csvConverterBtn) {
        csvConverterBtn.addEventListener('click', showCSVConverter);
    }
    
    console.log('實用工具集合載入完成');
});