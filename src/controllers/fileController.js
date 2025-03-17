const FileService = require('../services/fileService');

class FileController {
    constructor() {
        this.fileService = new FileService();
    }

    async uploadChunk(req, res) {
        res.json({
            message: '청크 업로드 완료',
            chunkNumber: parseInt(req.body.chunkNumber)
        });
    }

    async completeUpload(req, res) {
        try {
            const { fileName, totalChunks } = req.body;
            const result = await this.fileService.mergeChunks(fileName, totalChunks);

            res.json({
                message: '파일 병합 완료',
                file_url: result.file_url
            });
        } catch (error) {
            console.error('파일 병합 에러:', error);
            res.status(500).json({
                success: false,
                message: '파일 병합 중 오류가 발생했습니다.'
            });
        }
    }

    async getUploadStatus(req, res) {
        // 업로드 상태 확인 로직 구현
    }
}

module.exports = new FileController(); 