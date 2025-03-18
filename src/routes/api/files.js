const router = require('express').Router();
const multer = require('multer');
const fileController = require('../../controllers/fileController');

// Multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, process.env.CHUNK_DIR),
    filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage });

// 라우트 정의
router.post('/chunk', upload.single('chunk'), fileController.uploadChunk.bind(fileController));
router.post('/complete', fileController.completeUpload.bind(fileController));
router.get('/status/:fileName', fileController.getUploadStatus.bind(fileController));

module.exports = router; 