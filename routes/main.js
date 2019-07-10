var express = require('express');
var router = express.Router();

var db=require('../model/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user){
    db.board(req.session.user.classroom,
      function(err, result){
        if(err){
          console.log("Error!");
        }
        if(result){
          console.log('불러오기 성공');

          var posts = result;
        }
        res.render('main', {name: req.session.user.name, status: req.session.identity, posts: posts});
      }
    );
  } else{
    req.session.error = true;
    res.redirect('/users/login');
  }
});

router.post('/', function(req, res, next) {
  req.session.error = false;
  db.post(req.session.identity, req.session.user.classroom, req.body.content, 
    function(err, result){
      if(err){
        console.log("Error!");
        return;
      }
      if(result){
        console.dir(result);
        console.log('포스트 성공');
        return;
      }
      return;
    }
  );
  res.redirect('/');
});

module.exports = router;