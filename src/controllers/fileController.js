const FileService = require('../services/fileService');
const logger = require('../middleware/logger');

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
            logger.error('파일 병합 에러:', error);
            res.status(500).json({
                success: false,
                message: '파일 병합 중 오류가 발생했습니다.'
            });
        }
    }

    async getUploadStatus(req, res) {
        const { fileName } = req.params;
        const status = await this.fileService.getUploadStatus(fileName);
        res.json({
            count: status.count
        });
    }
}

module.exports = new FileController(); 