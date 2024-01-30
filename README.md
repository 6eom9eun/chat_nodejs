개발 내용

- Node.js와 Express로 RESTful API 만들기
<br>

- 비관계형DB인 MongoDB에 호스팅 받아서 사용
 
  <img width="283" alt="image" src="https://github.com/6eom9eun/chat_nodejs/assets/104510730/5241ce8c-d565-413a-9937-99b369a1fdef">
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
  - REST API로 CRUD 기능 구현, Server-Sent Events(SSE)를 통한 게시물, 댓글 DB 변동사항 실시간으로 받아오기
 
    ![image](https://github.com/6eom9eun/chat_nodejs/assets/104510730/2947e957-856c-4bc3-a3ef-2161e9b3aaa2)
    
    ![image](https://github.com/6eom9eun/chat_nodejs/assets/104510730/41fb4901-aef0-44b5-862a-a8b99e8a761f)

    ![image](https://github.com/6eom9eun/chat_nodejs/assets/104510730/48b9799a-0fc7-493d-ba8c-057c36207de1)
    


<br>

- router 파일로 라우팅 로직 모듈화
  
  <img width="337" alt="image" src="https://github.com/6eom9eun/chat_nodejs/assets/104510730/35e7bc39-c04e-4e63-aec0-283cb7d5c158">

<br>

- Passport.js로 회원기능 만들기 (Session 방식)
  - bcrypt 라이브러리를 통해 해싱 알고리즘 사용
    - salt 자동으로 넣어서 해싱 =>  lookup table attack, rainbow table attack 방지
      
      <img width="532" alt="image" src="https://github.com/6eom9eun/chat_nodejs/assets/104510730/d19f3da3-e9bf-47db-b14c-19cdb35830e3">

      <img width="604" alt="image" src="https://github.com/6eom9eun/chat_nodejs/assets/104510730/56406004-d6a6-4dc3-99b4-cd2233b7c763">

<br>

- AWS 배포
  - Elastic beanstalk 서비스 이용
- AWS S3 이미지 호스팅
  
  <img width="455" alt="image" src="https://github.com/6eom9eun/chat_nodejs/assets/104510730/562d962a-f6b7-41c3-ac3e-04169b80038a">

<br>

- MongoDB에서 search index 생성
  <img width="1157" alt="image" src="https://github.com/6eom9eun/chat_nodejs/assets/104510730/9bc2ed4d-3843-4cdc-aee3-9e1ea3b69ea2">

<br>

- dotenv라이브러리 통해 중요 환경변수 보관
  
  <img width="341" alt="image" src="https://github.com/6eom9eun/chat_nodejs/assets/104510730/c93f135e-e401-4de8-975b-ab7b5046bc9f">

<br>

- Socket.io 채팅기능
  - Socket.io를 사용하여 실시간 양방향 통신을 구현
    
    ![image](https://github.com/6eom9eun/chat_nodejs/assets/104510730/094a9dfc-137b-4a67-a866-5906c299d9d1)

<br>

