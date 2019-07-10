var express = require('express');
var router = express.Router();

var db=require('../model/db');

//수신함 페이지 렌더링
router.get('/inbox', function(req, res, next) {
  if(req.session.user){
    db.inbox(req.session.user.name,
      function(err, result){
        if(err){
          console.log("Error!");
        }
        if(result){
          console.log('불러오기 성공');

          var mails = result;
        }
        res.render('inbox', {name: req.session.user.name, status: req.session.identity, mails: mails});
      }
    );
  } else{
    req.session.error = true;
    res.redirect('/users/login');
  }
});

//발신함 페이지 렌더링
router.get('/outbox', function(req, res, next) {
  if(req.session.user){
    db.outbox(req.session.user.name,
      function(err, result){
        if(err){
          console.log("Error!");
        }
        if(result){
          console.log('불러오기 성공');

          var mails = result;
        }
        res.render('outbox', {name: req.session.user.name, status: req.session.identity, mails: mails});
      }
    );
  } else{
    req.session.error = true;
    res.redirect('/users/login');
  }
});

//메일 발송 페이지 렌더링(학생)
router.get('/send', function(req, res, next) {
  if(req.session.user){
    res.render('send', {name: req.session.user.name, status: req.session.identity});
  } else{
    req.session.error = true;
    res.redirect('/users/login');
  }
});

router.post('/send', function(req, res, next){
  req.session.error = false;
  db.sendMail(req.body.to, req.session.user.name, req.body.title, req.body.content, 
    function(err, result){
      if(err){
        console.log("Error!");
        return;
      }
      if(result){
        console.dir(result);
        console.log('메일 보내기 성공');
        return;
      }
      return;
    }
  );
  res.redirect('./outbox');
});


module.exports = router;