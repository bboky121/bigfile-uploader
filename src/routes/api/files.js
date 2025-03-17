const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const fileController = require('../../controllers/fileController');

// Multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../../../uploads/chunks')),
    filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage });

// 라우트 정의
router.post('/chunk', upload.single('chunk'), fileController.uploadChunk.bind(fileController));
router.post('/complete', fileController.completeUpload.bind(fileController));
router.get('/status/:fileId', fileController.getUploadStatus.bind(fileController));

module.exports = router; 