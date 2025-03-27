const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '..', 'logs');

try {
    // logs 디렉토리가 존재하는지 확인
    if (fs.existsSync(logsDir)) {
        // 디렉토리 내의 모든 파일 삭제
        fs.readdirSync(logsDir).forEach(file => {
            const filePath = path.join(logsDir, file);
            fs.unlinkSync(filePath);
        });
        console.log('로그 파일이 성공적으로 삭제되었습니다.');
    } else {
        console.log('logs 디렉토리가 존재하지 않습니다.');
    }
} catch (error) {
    console.error('로그 파일 삭제 중 오류 발생:', error);
    process.exit(1);
} 