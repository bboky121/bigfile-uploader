const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');


router.get('/', fileController.getFileList.bind(fileController));
router.get('/upload', fileController.getUploadPage.bind(fileController));

/**
 * @swagger
 * /files/download/{id}:
 *   get:
 *     summary: 파일 다운로드
 *     description: 지정된 ID의 파일을 다운로드합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 파일 ID
 *     responses:
 *       200:
 *         description: 파일 다운로드 성공
 *       404:
 *         description: 파일을 찾을 수 없음
 */
router.get('/download/:id', fileController.downloadFile.bind(fileController));

/**
 * @swagger
 * /files/{id}:
 *   delete:
 *     summary: 파일 삭제
 *     description: 지정된 ID의 파일을 삭제합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 파일 ID
 *     responses:
 *       200:
 *         description: 파일 삭제 성공
 *       404:
 *         description: 파일을 찾을 수 없음
 */
router.delete('/:id', fileController.deleteFile.bind(fileController));

module.exports = router; 