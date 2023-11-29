const router = require('express').Router()
const bcrypt = require('bcrypt');
const passport = require('passport');

let connectDB = require('./../database.js')
let db
connectDB.then((client)=>{ // Mongo DB 연결
  db = client.db('chat')
}).catch((err)=>{
  console.log(err)
})

router.get('/login', async (req, res) => {
  console.log(req.user);
  res.render('login.ejs');
});

router.post('/login', async (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) return res.status(500).json(error);
    if (!user) return res.status(401).json(info.message);
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.redirect('/');
    });
  })(req, res, next);
});

router.get('/register', (req, res) => {
  res.render('register.ejs');
});

router.post('/register', async (req, res) => {
  const chk = await db.collection('user').findOne({ username: req.body.username });

  if (chk) {
    return res.status(409).send('이미 존재하는 사용자 이름입니다.');
  }

  try {
    let hash = await bcrypt.hash(req.body.password, 10);
    await db.collection('user').insertOne({
      username: req.body.username,
      password: hash,
    });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('회원가입 중 오류가 발생했습니다.');
  }
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('로그아웃 중 오류가 발생했습니다.');
    }
    res.redirect('/');
  });
});

module.exports = router;