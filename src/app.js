const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fileRouter = require('./routes/api/files');
const logger = require('./config/logger');

// 환경 변수 설정
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

if (process.env.NODE_ENV === 'development') {
  app.use(cors());
}
// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: '서버가 정상적으로 실행중입니다.' });
});

// 업로드 페이지 라우트
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/upload.html'));
});

// 파일 목록 페이지 라우트
app.get('/files', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/file-list.html'));
});

// API 라우트
app.use('/api/upload', fileRouter);

// 서버 시작
app.listen(PORT, () => {
  logger.info(`서버가 http://localhost:${PORT} 에서 실행중입니다.`);
});


// 에러 핸들링
process.on('uncaughtException', (error) => {
  logger.error(`uncaughtException: ${error.message}`);
  logger.error(error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise);
  logger.error('Reason:', reason);
});

module.exports = app; 