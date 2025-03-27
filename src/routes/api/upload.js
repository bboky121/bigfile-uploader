const router = require('express').Router();
const multer = require('multer');
const fileController = require('../../controllers/fileController');

// Multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, process.env.CHUNK_DIR),
    filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage });

/**
 * @swagger
 * /api/upload/chunk:
 *   post:
 *     summary: 파일 청크 업로드
 *     description: 대용량 파일의 청크를 업로드합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               chunk:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 파일 청크
 *               fileName:
 *                 type: string
 *                 description: 원본 파일명
 *               chunkIndex:
 *                 type: integer
 *                 description: 청크 인덱스
 *               totalChunks:
 *                 type: integer
 *                 description: 전체 청크 수
 *     responses:
 *       200:
 *         description: 청크 업로드 성공
 *       400:
 *         description: 잘못된 요청
 */
router.post('/chunk', upload.single('chunk'), fileController.uploadChunk.bind(fileController));

/**
 * @swagger
 * /api/upload/complete:
 *   post:
 *     summary: 파일 업로드 완료
 *     description: 모든 청크가 업로드된 후 파일 병합을 시작합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileName:
 *                 type: string
 *                 description: 원본 파일명
 *               totalChunks:
 *                 type: integer
 *                 description: 전체 청크 수
 *     responses:
 *       200:
 *         description: 파일 병합 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 file_url:
 *                   type: string
 *                   description: 업로드된 파일의 URL
 *       400:
 *         description: 잘못된 요청
 */
router.post('/complete', fileController.completeUpload.bind(fileController));

/**
 * @swagger
 * /api/upload/status/{fileName}:
 *   get:
 *     summary: 업로드 상태 확인
 *     description: 특정 파일의 업로드 진행 상태를 확인합니다.
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: 확인할 파일명
 *     responses:
 *       200:
 *         description: 업로드 상태 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uploadedChunks:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   description: 업로드된 청크 인덱스 목록
 *                 totalChunks:
 *                   type: integer
 *                   description: 전체 청크 수
 *       404:
 *         description: 파일을 찾을 수 없음
 */
router.get('/status/:fileName', fileController.getUploadStatus.bind(fileController));

module.exports = router; 