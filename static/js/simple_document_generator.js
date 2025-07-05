/**
 * 簡化版文件生成器
 * 不依賴外部套件，直接生成可下載的文件格式
 */

// 生成CSV格式的試算表
function generateCSV(data) {
    const { title, headers, rows } = data;
    
    let csv = '';
    
    // 添加標題
    if (title) {
        csv += `${title}\n\n`;
    }
    
    // 添加標題行
    if (headers && headers.length > 0) {
        csv += headers.join(',') + '\n';
    }
    
    // 添加數據行
    if (rows && rows.length > 0) {
        rows.forEach(row => {
            csv += row.map(cell => `"${cell}"`).join(',') + '\n';
        });
    }
    
    return csv;
}

// 生成HTML表格格式
function generateHTMLTable(data) {
    const { title, description, headers, rows } = data;
    
    let html = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || '報表'}</title>
    <style>
        body { 
            font-family: 'Microsoft JhengHei', Arial, sans-serif; 
            margin: 20px; 
            background-color: #f8f9fa;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            padding: 30px; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { 
            color: #2c3e50; 
            text-align: center; 
            margin-bottom: 10px;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        .description { 
            text-align: center; 
            color: #7f8c8d; 
            margin-bottom: 30px; 
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        th { 
            background-color: #34495e; 
            color: white; 
            padding: 15px 12px; 
            text-align: left; 
            font-weight: bold;
        }
        td { 
            padding: 12px; 
            border-bottom: 1px solid #ecf0f1; 
        }
        tr:nth-child(even) { 
            background-color: #f8f9fa; 
        }
        tr:hover { 
            background-color: #e8f4fd; 
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #95a5a6;
            font-size: 14px;
        }
        @media print {
            body { background: white; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title || '報表'}</h1>
        ${description ? `<p class="description">${description}</p>` : ''}
        
        <table>
            ${headers && headers.length > 0 ? `
            <thead>
                <tr>
                    ${headers.map(header => `<th>${header}</th>`).join('')}
                </tr>
            </thead>
            ` : ''}
            ${rows && rows.length > 0 ? `
            <tbody>
                ${rows.map(row => `
                    <tr>
                        ${row.map(cell => `<td>${cell}</td>`).join('')}
                    </tr>
                `).join('')}
            </tbody>
            ` : ''}
        </table>
        
        <div class="footer">
            <p>生成時間：${new Date().toLocaleString('zh-TW')}</p>
        </div>
    </div>
</body>
</html>`;
    
    return html;
}

// 生成純文字格式的文件
function generateTextDocument(data) {
    const { title, description, content } = data;
    
    let text = '';
    
    // 添加標題
    if (title) {
        text += `${title}\n`;
        text += '='.repeat(title.length) + '\n\n';
    }
    
    // 添加描述
    if (description) {
        text += `${description}\n\n`;
    }
    
    // 添加內容
    if (content) {
        text += content;
    }
    
    text += `\n\n---\n生成時間：${new Date().toLocaleString('zh-TW')}`;
    
    return text;
}

// 下載文件
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
}

// 從範本生成並下載文件
function generateAndDownloadFromTemplate(templateType, templateName) {
    try {
        const templates = DOCUMENT_TEMPLATES[templateType][templateName];
        
        if (!templates) {
            alert('找不到指定的範本');
            return;
        }
        
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        
        if (templateType === 'spreadsheet') {
            // 生成CSV文件
            const csvContent = generateCSV(templates);
            downloadFile(csvContent, `${templates.title}_${timestamp}.csv`, 'text/csv;charset=utf-8;');
            
            // 同時生成HTML版本以便瀏覽
            const htmlContent = generateHTMLTable(templates);
            downloadFile(htmlContent, `${templates.title}_${timestamp}.html`, 'text/html;charset=utf-8;');
            
            showMessage(`已生成 ${templates.title} (CSV + HTML格式)`, 'success');
            
        } else if (templateType === 'document') {
            // 生成純文字文件
            const textContent = generateTextDocument(templates);
            downloadFile(textContent, `${templates.title}_${timestamp}.txt`, 'text/plain;charset=utf-8;');
            
            // 同時生成HTML版本
            const htmlContent = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${templates.title}</title>
    <style>
        body { 
            font-family: 'Microsoft JhengHei', Arial, sans-serif; 
            max-width: 800px; 
            margin: 40px auto; 
            padding: 30px; 
            line-height: 1.8; 
            background-color: #f8f9fa;
        }
        .document { 
            background: white; 
            padding: 40px; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { 
            color: #2c3e50; 
            border-bottom: 3px solid #3498db; 
            padding-bottom: 10px; 
        }
        h2 { 
            color: #34495e; 
            margin-top: 30px; 
        }
        h3 { 
            color: #7f8c8d; 
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
        }
        th, td { 
            border: 1px solid #bdc3c7; 
            padding: 10px; 
            text-align: left; 
        }
        th { 
            background-color: #ecf0f1; 
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
            text-align: center;
            color: #95a5a6;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="document">
        ${templates.content.replace(/\n/g, '<br>').replace(/## (.*)/g, '<h2>$1</h2>').replace(/### (.*)/g, '<h3>$1</h3>')}
        <div class="footer">
            <p>生成時間：${new Date().toLocaleString('zh-TW')}</p>
        </div>
    </div>
</body>
</html>`;
            
            downloadFile(htmlContent, `${templates.title}_${timestamp}.html`, 'text/html;charset=utf-8;');
            
            showMessage(`已生成 ${templates.title} (TXT + HTML格式)`, 'success');
        }
        
    } catch (error) {
        console.error('生成文件時發生錯誤：', error);
        showMessage('生成文件時發生錯誤', 'error');
    }
}

// 修改原有的範本生成函數，使用簡化版本
function generateFromTemplate(templateType, templateName) {
    // 關閉modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('templateModal'));
    if (modal) {
        modal.hide();
    }
    
    // 使用簡化版生成
    generateAndDownloadFromTemplate(templateType, templateName);
}

// 顯示AI文件生成對話框
function showAIDocumentGenerator() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'aiDocModal';
    modal.setAttribute('tabindex', '-1');
    
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">AI智能文件生成</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="aiDocForm">
                        <div class="mb-3">
                            <label for="docType" class="form-label">文件類型</label>
                            <select class="form-select" id="docType" required>
                                <option value="">請選擇</option>
                                <option value="excel">Excel試算表</option>
                                <option value="word">Word文件</option>
                                <option value="ppt">PowerPoint簡報</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="docDescription" class="form-label">文件描述</label>
                            <textarea class="form-control" id="docDescription" rows="4" 
                                    placeholder="請詳細描述您需要的文件內容、格式和用途..."
                                    required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="docLanguage" class="form-label">語言</label>
                            <select class="form-select" id="docLanguage">
                                <option value="zh-TW">繁體中文</option>
                                <option value="zh-CN">簡體中文</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" onclick="generateAIDocument()">
                        <i class="fas fa-magic"></i> 生成文件
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // 清理DOM
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

// AI文件生成
async function generateAIDocument() {
    const form = document.getElementById('aiDocForm');
    const formData = new FormData(form);
    
    const docType = formData.get('docType') || document.getElementById('docType').value;
    const description = formData.get('docDescription') || document.getElementById('docDescription').value;
    const language = formData.get('docLanguage') || document.getElementById('docLanguage').value;
    
    if (!docType || !description) {
        alert('請填寫所有必要欄位');
        return;
    }
    
    try {
        // 關閉modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('aiDocModal'));
        modal.hide();
        
        // 顯示生成中提示
        showMessage('AI正在生成文件，請稍候...', 'info');
        
        const response = await fetch('/generate_document', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                method: 'ai_generate',
                type: docType,
                description: description,
                language: language
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(`${result.title} 生成成功！`, 'success');
            
            // 顯示下載鏈接
            const downloadHtml = `
                <div class="alert alert-success">
                    <h6><i class="fas fa-check-circle"></i> AI文件生成完成</h6>
                    <p><strong>檔案名稱：</strong>${result.filename}</p>
                    <p><strong>檔案類型：</strong>${result.type}</p>
                    <p><strong>說明：</strong>${result.description}</p>
                    <a href="${result.download_url}" class="btn btn-success" download>
                        <i class="fas fa-download"></i> 下載文件
                    </a>
                </div>
            `;
            
            // 在聊天框中顯示下載連結
            if (window.aiAssistant && window.aiAssistant.addMessage) {
                window.aiAssistant.addMessage(downloadHtml, 'assistant');
            }
        } else {
            showMessage(`生成失敗：${result.error}`, 'error');
        }
    } catch (error) {
        console.error('AI生成文件時發生錯誤：', error);
        showMessage('AI生成文件時發生錯誤', 'error');
    }
}

// 導出函數到全域
window.generateAndDownloadFromTemplate = generateAndDownloadFromTemplate;
window.showAIDocumentGenerator = showAIDocumentGenerator;
window.generateAIDocument = generateAIDocument;