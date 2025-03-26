const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

// 파일 업로드 페이지
router.get('/upload', fileController.getUploadPage.bind(fileController));

// 파일 목록 페이지
router.get('/', fileController.getFileList.bind(fileController));

// 파일 다운로드
router.get('/download/:id', fileController.downloadFile.bind(fileController));

// 파일 삭제 API
router.delete('/:id', fileController.deleteFile.bind(fileController));

module.exports = router; 