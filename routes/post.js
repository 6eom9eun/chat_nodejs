const router = require('express').Router()
const { ObjectId } = require('mongodb');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const bcrypt = require('bcrypt');
const passport = require('passport');

const connectDB = require('./../database.js');
let db;
let changeStream

connectDB.then((client) => {
  db = client.db('chat');

  let 조건 = [
    { $match : { operationType : 'insert'}} // 글 발행 시에만 감시
 // { $match : { 'fullDocument.title' : '안녕'}} // '안녕' 타이틀만 변동 감지
  ]

  changeStream = db.collection('post').watch(조건) // collection 변동사항 감시
  
}).catch((err) => {
  console.log(err);
});

// AWS S3 설정
const s3 = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'beomgeun-bucket',
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

router.get('/list/:id', async (req, res) => {
  let posts = await db.collection('post').find().skip((req.params.id - 1) * 5).limit(5).toArray();
  res.render('list.ejs', { posts });
});

router.get('/list/next/:id', async (req, res) => {
  let posts = await db.collection('post').find({ _id: { $gt: new ObjectId(req.params.id) } }).limit(5).toArray();
  res.render('list.ejs', { posts });
});

router.get('/write', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('write.ejs');
  } else {
    res.redirect('/user/login');
  }
});

router.post('/add', upload.single('img1'), async (req, res) => {
    console.log(req.body);
    try {
      if (req.body.title === '') {
        res.send('제목 입력 X');
      } else {
        await db.collection('post').insertOne({ 
          title: req.body.title, 
          content: req.body.content, 
          img: req.file ? req.file.location : '',
          user : req.user._id,
          username : req.user.username});
        
        res.redirect('/post/list/:id');
      }
    } catch (e) {
      console.log(e);
      res.status(500).send('서버에러');
    }
  });
  

router.get('/detail/:id', async (req, res) => {
  try {
    let rs2 = await db.collection('comment').find({parentId : new ObjectId(req.params.id)}).toArray()
    let rs = await db.collection('post').findOne({ _id: new ObjectId(req.params.id) });
    console.log(req.params);
    if (rs == null) {
      res.status(400).send('이상한 url');
    }
    res.render('detail.ejs', { rs: rs, rs2 : rs2 });
  } catch (e) {
    console.log(e);
    res.status(400).send('이상한 url');
  }
});

router.get('/edit/:id', async (req, res) => {
  let rs = await db.collection('post').findOne({ _id: new ObjectId(req.params.id) });
  console.log(rs);
  res.render('edit.ejs', { post: rs });
});

router.put('/edit', async (req, res) => {
  await db.collection('post').updateOne({ _id: new ObjectId(req.body.id) },
    { $set: { title: req.body.title, content: req.body.content } }
  );
  console.log(req.body);
  res.redirect('/post/list');
});

router.delete('/delete', async (req, res) => {
  try {
    const result = await db.collection('post').findOneAndDelete({
      _id: new ObjectId(req.query.docid),
      user: new ObjectId(req.user._id)
    });

    if (result.value) {
      res.status(200).send('삭제완료');
    } else {
      res.status(404).send('해당 문서를 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('삭제 오류:', error);
    res.status(500).send('삭제 중에 오류가 발생했습니다.');
  }
});


router.get('/search', async (req, res)=>{
  console.log(req.query.val)
  // let rs = await db.collection('post').find({title: {$regex : req.query.val}}).toArray()

  // let rs = await db.collection('post').find({$text : {$search : req.query.val}}).explain('executionStats') // 인덱스로 검색, 성능평가.
  // console.log(rs)

  // search index 사용 !
  let 검색조건 = [
    {$search : {
      index : 'title_index',
      text : { query : req.query.val, path : 'title' } // index 인덱스 이름, query 검색어, path db필드
    }},
    // { $sort : { _id : 1 }},  // 정렬 - {db필드: 1&-1}
    // { $limit : 10 }, // 결과 수 제한
    // { $skip : 10 }, // 건너뛰기
    // { $project : { title : 1 }} // 필드 숨기기, 0이면 숨기고 1이면 보여주기
    // 등등
  ]
  let rs = await db.collection('post').aggregate(검색조건).toArray()
  res.render('search.ejs', { posts :rs })
})

router.post('/comment', async(req, res)=>{
  let rs = await db.collection('comment').insertOne({
    content : req.body.content,
    writerId : new ObjectId(req.user._id),
    writer : req.user.username,
    parentId : new ObjectId(req.body.parentId)
  })
  res.redirect('back')
})

router.get('/stream/list', (req,res)=>{ // Server sent events
  res.writeHead(200, {
    "Connection": "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });
  
  // setInterval(()=>{ // 1초마다 계속 보내줌
  //   res.write('event: msg\n')
  //   res.write('data: ㅎ2\n\n')
  // }, 1000)

  changeStream.on('change', (rs)=>{
    console.log(rs.fullDocument) // 변동시 변동사항 볼 수 있음.
    res.write('event: msg\n')
    res.write(`data: ${JSON.stringify(rs.fullDocument)}\n\n`)
  })
})

module.exports = router;