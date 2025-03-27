const swaggerJsdoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 3333;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '대용량 파일 업로더 API',
            version: '1.0.0',
            description: '대용량 파일 업로드 및 관리를 위한 API 문서',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: '개발 서버',
            },
        ],
    },
    apis: ['./src/routes/*.js', './src/routes/api/*.js'], // API 라우트 파일 경로
};

const specs = swaggerJsdoc(options);

module.exports = specs; 