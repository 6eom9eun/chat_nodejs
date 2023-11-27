const express = require('express')
const app = express()
const { MongoClient, ObjectId } = require('mongodb') 
const methodOverride = require('method-override')
const bcrypt = require('bcrypt') // npm i bcrypt : 비번 해싱
const MongoStore = require('connect-mongo') // npm i connect-mongo
require('dotenv').config() // npm u dotenv 환경변수보관

// multer : npm install multer multer-s3 @aws-sdk/client-s3 => S3 쉽게 다룰 수 있도록 하는 라이브러리
const { S3Client } = require('@aws-sdk/client-s3')
const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = new S3Client({
  region : 'ap-northeast-2',
  credentials : {
      accessKeyId : process.env.S3_KEY,
      secretAccessKey : process.env.S3_SECRET
  }
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'beomgeun-bucket',
    key: function (요청, file, cb) {
      cb(null, Date.now().toString()) //업로드시 파일명
    }
  })
})
// ****************************************************

// npm install express-session passport passport-local ********************************************************************
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')

app.use(passport.initialize())
app.use(session({
  secret: process.env.PW,
  resave : false, // 유저가 서버로 요청할 때마다 세션 갱신
  saveUninitialized : false, // 로그인 안해도 세션 만들기
  cookie : {maxAge : 60 * 60 * 1000}, // 세션 유지 시간
  store : MongoStore.create({ // DB에 세션 doc 발행
    mongoUrl : process.env.DB_URL,
    dbName : 'chat'
  })
}))
app.use(passport.session()) 

passport.use(new LocalStrategy(async (입력한아이디, 입력한비번, cb) => {
  let rs = await db.collection('user').findOne({ username : 입력한아이디})
  if (!rs) {
    return cb(null, false, { message: '아이디 DB에 없음' })
  }
  if (await bcrypt.compare(입력한비번, rs.password)) { // 입력한 비번과 DB에 저장된 해싱된 비번 비교
    return cb(null, rs)
  } else {
    return cb(null, false, { message: '비번불일치' });
  }
}))

passport.serializeUser((user, done) => { // 로그인시 세션 생성
  console.log(user)
  process.nextTick(() => { // 내부 코드를 비동기적으로 처리 
    done(null, { id: user._id, username: user.username }) // 세션은 메모리에 저장
  })
})

passport.deserializeUser(async (user, done) => { // 쿠키 확인해보는 역할
  let rs = await db.collection('user').findOne({_id : new ObjectId(user.id)}) // DB 조회 먼저
  delete rs.password
  process.nextTick(() => {
    return done(null, rs)
  })
})
// passport 라이브러리 셋팅 ********************************************************************

app.use(methodOverride('_method')) // form 태그에서 put, delete ~가능 npm install method-override
app.use(express.static(__dirname + '/public')); // 폴더 연결
app.set('view engine', 'ejs') // ejs 세팅
app.use(express.json()) // req.body 사용하기 위해서
app.use(express.urlencoded({extended:true})) // #

let connectDB = require('./database.js')

let db
connectDB.then((client)=>{ // Mongo DB 연결
  console.log('DB연결성공')
  db = client.db('chat')

  app.listen(process.env.PORT, () => {
    console.log('### http://localhost:8080 에서 서버 실행중 ###')
  })

}).catch((err)=>{
  console.log(err)
})

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.get('/time', (req, res) => {
  res.render('time.ejs', {time : new Date()})
})


app.use('/user', require('./routes/user.js'));
app.use('/post', require('./routes/post.js'));
app.use('/shop', require('./routes/shop.js')); // 파일 분리 연습