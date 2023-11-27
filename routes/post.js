const router = require('express').Router()
const { ObjectId } = require('mongodb');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const bcrypt = require('bcrypt');
const passport = require('passport');

const connectDB = require('./../database.js');
let db;
connectDB.then((client) => {
  db = client.db('chat');
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
  res.render('write.ejs');
});

router.post('/add', upload.single('img1'), async (req, res) => {
    console.log(req.body);
    try {
      if (req.body.title === '') {
        res.send('제목 입력 X');
      } else {
        let imgLocation = req.file ? req.file.location : null;
        
        await db.collection('post').insertOne({ title: req.body.title, content: req.body.content, img: imgLocation });
        
        res.redirect('/post/list/:id');
      }
    } catch (e) {
      console.log(e);
      res.status(500).send('서버에러');
    }
  });
  

router.get('/detail/:id', async (req, res) => {
  try {
    let rs = await db.collection('post').findOne({ _id: new ObjectId(req.params.id) });
    console.log(req.params);
    if (rs == null) {
      res.status(400).send('이상한 url');
    }
    res.render('detail.ejs', { rs: rs });
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
  console.log(req.query);
  await db.collection('post').deleteOne({ _id: new ObjectId(req.query.docid) });
  res.send('삭제완료');
});

module.exports = router;