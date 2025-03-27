const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const uploadRouter = require('./routes/api/upload');
const fileRouter = require('./routes/files');
const logger = require('./middleware/logger');
const swaggerUi = require('swagger-ui-express');
const specs = require('./config/swagger');

// 환경 변수 설정
const app = express();
const PORT = process.env.PORT || 3333;
const publicPath = path.join(process.cwd(), 'public');

if (process.env.NODE_ENV === 'development') {
  app.use(cors());
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicPath));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: '서버가 정상적으로 실행중입니다.' });
});

// API router
app.use('/api/upload', uploadRouter);

// file list router
app.use('/files', fileRouter);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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