const FileService = require('../services/fileService');
const logger = require('../middleware/logger');

class FileController {
    constructor() {
        this.fileService = new FileService();
    }

    // 업로드 페이지 렌더링
    getUploadPage(req, res) {
        res.render('upload');
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
                file_url: result.file_url,
                fileId: result.fileId
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

    async getFileList(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const search = req.query.search || '';

            const { files, total } = await this.fileService.getFiles(page, limit, search);
            const totalPages = Math.ceil(total / limit);

            // 파일 크기 포맷팅
            const formattedFiles = files.map(file => ({
                ...file,
                formattedSize: this.fileService.fileSizeFormat(file.file_size)
            }));

            res.render('file-list', {
                files: formattedFiles,
                currentPage: page,
                totalPages,
                search
            });
        } catch (error) {
            console.error('파일 목록 조회 실패:', error);
            res.status(500).render('error', { message: '파일 목록을 불러오는데 실패했습니다.' });
        }
    }

    async deleteFile(req, res) {
        try {
            const fileId = req.params.id;
            await this.fileService.deleteFile(fileId);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('파일 삭제 실패:', error);
            res.status(500).json({ success: false, error: '파일 삭제에 실패했습니다.' });
        }
    }

    async downloadFile(req, res) {
        try {
            const fileId = req.params.id;
            const { file, filePath } = await this.fileService.getFileById(fileId);

            if (!file) {
                return res.status(404).send('파일을 찾을 수 없습니다.');
            }

            res.download(filePath, file.original_name);
        } catch (error) {
            console.error('파일 다운로드 실패:', error);
            res.status(500).send('파일 다운로드에 실패했습니다.');
        }
    }
}

module.exports = new FileController(); 