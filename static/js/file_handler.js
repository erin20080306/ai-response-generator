// File Handler Module - Basic file handling functionality
class FileHandler {
    constructor() {
        this.supportedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'text/plain', 'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
    }

    init() {
        console.log('File Handler initialized');
    }

    handleFileUpload(file) {
        if (!this.isValidFile(file)) {
            throw new Error('不支援的檔案格式');
        }
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(file);
        });
    }

    isValidFile(file) {
        return this.supportedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
    }
}

// Export for global use
window.FileHandler = FileHandler;