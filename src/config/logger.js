const winston = require('winston');

const process = require('process');

const { combine, timestamp, label, printf } = winston.format;

//* 로그 파일 저장 경로 → 루트 경로/logs 폴더
const logDir = `${process.cwd()}/logs`;

//* log 출력 포맷 정의 함수
const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`; // 날짜 [시스템이름] 로그레벨 메세지
});

const logger = winston.createLogger({
  //* 로그 출력 형식 정의
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    label({ label: 'Big File Uploader' }), // 어플리케이션 이름
    logFormat, // log 출력 포맷
    //? format: combine() 에서 정의한 timestamp와 label 형식값이 logFormat에 들어가서 정의되게 된다. level이나 message는 콘솔에서 자동 정의
  ),
  transports: [
    new winston.transports.File({ filename: `${logDir}/combined.log` }),
    new winston.transports.File({ filename: `${logDir}/error.log`, level: 'error' }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: `${logDir}/exceptions.log` }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: `${logDir}/rejections.log` }),
  ],
});

//* 로그 레벨 정의
logger.levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

module.exports = logger;