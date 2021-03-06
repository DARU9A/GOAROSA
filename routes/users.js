var express = require('express');
var router = express.Router();
var fs = require('fs');
var crypro = require('crypto');

var db=require('../model/db');

function hashPW(pwd){
  return crypro.createHash('sha256').update(pwd).digest('base64').toString();
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/users/login');
});

//회원가입

//학생
router.get('/register/student', function(req, res, next) {
  fs.readFile('./public/studentRegister.html', function(err, data){
    if(err){
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.end(data);
  });
});

router.post('/register/student', function(req, res, next){
  req.session.error = false;
  db.studentRegister(req.body.name, hashPW(req.body.password), req.body.classroom,
    function(err, result){
      if(err){
        console.log("Error!");
      }
      if(result){
        console.dir(result);
        req.session.error = false;
        res.redirect('/users/login');
      }
      else{
        req.session.error = true;
        res.redirect('/users/login');
      }
    }
  );
});

//선생님
router.get('/register/teacher', function(req, res, next) {
  fs.readFile('./public/teacherRegister.html', function(err, data){
    if(err){
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.end(data);
  });
});

router.post('/register/teacher', function(req, res, next){
  db.teacherRegister(req.body.name, hashPW(req.body.password), req.body.subject, req.body.department, req.body.classroom,
    function(err, result){
      if(err){
        console.log("Error!");
      }
      if(result){
        console.dir(result);
        req.session.error = false;
        res.redirect('/users/login');
      }
      else{
        req.session.error = true;
        res.redirect('/users/login');
      }
    }
  );
});

//로그인
router.get('/logout', function(req, res, next){
  req.session.error = false;
  req.session.destroy(function(){
    res.redirect('./login');
  });
});

router.get('/login', function(req, res, next) {
  fs.readFile('./public/login.html', function(err, data){
    if(err){ 
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    } else if(req.session.user){
      res.redirect('/main');
    } else if(req.session.error){
      data += "<script>alert('Invalid Access');</script>";
    }
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.end(data);
  });
});

router.post('/login', function(req, res, next){
  var user;
  db.existCheck(req.body.identity, req.body.name,
    function(err, result){
      if(err){
        console.log("Error!");
      }
      if(result){
        console.log('불러오기 성공');
        //console.dir(result);

        user = result;
        console.log(user[0].name);

        if(user[0].password === hashPW(req.body.password)){
          req.session.regenerate(function(){
            req.session.user = user[0];
            req.session.identity = req.body.identity;
            req.session.error = false;
            res.redirect('/main');
          });
        } else{
          req.session.regenerate(function(){
            req.session.error = true;
            res.redirect('/main');
          });
        }
      }
      else{
        req.session.regenerate(function(){
          req.session.error = true;
          res.redirect('/main');
        });
      }
    }
  );
});

module.exports = router;