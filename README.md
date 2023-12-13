# chat_nodejs

개발 내용

- Node.js와 Express로 RESTful API 만들기
<br>

- 비관계형DB인 MongoDB에 호스팅 받아서 사용
<br>

- 템플릿 엔진 EJS(Embedded JavaScript)사용해서 서버사이드 렌더링
  - 서버에서 동적인 HTML 생성하여 클라이언트에게 전달
<br>

- 비동기 서버 작동 방식
- AJAX를 이용한 클라이언트사이드 렌더링
  - 비동기적으로 서버와 통신하면서 클라이언트사이드에서 동적으로 데이터 렌더링
<br>

- 서버와 브러우저간 데이터 주고 받기 (HTTP 요청)
  - GET, POST, PUT, DELETE
-  API로 CRUD 기능 구현
<br>

- router 파일로 라우팅 로직 모듈화
<br>

- Passport.js로 회원기능 만들기 (Session 방식)
  - bcrypt 라이브러리를 통해 해싱 알고리즘 사용
    - salt 자동으로 넣어서 해싱 =>  lookup table attack, rainbow table attack 방지
<br>

- AWS 배포
- AWS S3 이미지 호스팅
<br>

- MongoDB에서 search index 생성
<br>

- dotenv라이브러리 통해 중요 환경변수 보관
<br>

- Socket.io 채팅기능
  - Socket.io를 사용하여 실시간 양방향 통신을 구현
<br>

- Server-Sent Events(SSE)를 통한 DB 변동사항 실시간으로 받아오기
<br>
