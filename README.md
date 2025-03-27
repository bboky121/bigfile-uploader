# 대용량 파일 업로더

대용량 파일을 안전하게 업로드하고 관리할 수 있는 웹 애플리케이션입니다.
(README는 ai가 만들어줬어요)

## 주요 기능

- 대용량 파일 업로드 (청크 단위 업로드)
- 파일 목록 조회 및 검색
- 파일 다운로드
- 파일 삭제
- 파일 크기 자동 포맷팅
- 드래그 앤 드롭 지원

## 기술 스택

- **백엔드**
  - Node.js
  - Express.js
  - SQLite3
  - EJS (템플릿 엔진)

- **프론트엔드**
  - HTML5
  - CSS3
  - JavaScript (ES6+)

## 설치 방법

1. 저장소 클론
```bash
git clone https://github.com/bboky121/bigfile-uploader.git
cd bigfile-uploader
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```bash
cp .env.example .env
# .env 파일을 수정하여 필요한 설정을 입력
```

4. 서버 실행
```bash
npm start
```

## 프로젝트 구조

```
project-root/
│
├── src/                   # 소스 코드
│   ├── app.js            # Express 앱 초기화
│   │
│   ├── controllers/      # 라우트 컨트롤러
│   ├── middleware/       # 커스텀 미들웨어
│   ├── models/           # 데이터 모델
│   ├── routes/           # 라우트 정의
│   ├── services/         # 비즈니스 로직
│   ├── utils/            # 유틸리티 함수
│   └── views/            # EJS 템플릿
│
├── public/               # 정적 파일
│   ├── css/
│   ├── js/
│   └── images/
│
├── uploads/             # 업로드된 파일 저장
│   ├── chunk/           # 임시 파일
│   └── files/          # 최종 파일
│
├── db/                  # SQLite 데이터베이스
│
├── .env                 # 환경 변수
├── package.json         # 프로젝트 설정
└── README.md           # 프로젝트 문서
```

## API 엔드포인트

- `GET /files` - 파일 목록 페이지
- `GET /files/upload` - 파일 업로드 페이지
- `GET /files/download/:id` - 파일 다운로드
- `DELETE /files/:id` - 파일 삭제

- `POST /api/upload/chunk` - 파일 chunk 업로드
- `POST /api/upload/complete` - 파일 업로드 완료 처리
- `get /api/upload/status/:filename` - 파일 업로드 상태 확인

## 환경 변수

- `PORT` - 서버 포트 (기본값: 3000)
- `UPLOAD_DIR` - 파일 업로드 디렉토리
- `CHUNK_DIR` - 청크 파일 임시 저장 디렉토리

## 라이선스

MIT License
