var express = require('express');
var router = express.Router();

//수신함 페이지 렌더링
router.get('/inbox', function(req, res, next) {
  if(req.session.user){
    res.render('inbox', {name: req.session.user.name, status: '0'});
  } else{
    req.session.error = true;
    res.redirect('/users/login');
  }
});

//발신함 페이지 렌더링
router.get('/outbox', function(req, res, next) {
  if(req.session.user){
    res.render('outbox', {name: req.session.user.name, status: '0'});
  } else{
    req.session.error = true;
    res.redirect('/users/login');
  }
});

//메일 발송 페이지 렌더링(학생)
router.get('/send', function(req, res, next) {
  if(req.session.user){
    res.render('send', {name: req.session.user.name, status: '0'});
  } else{
    req.session.error = true;
    res.redirect('/users/login');
  }
});

router.post('/send', function(req, res, next) {
    res.redirect('/main');
});


module.exports = router;