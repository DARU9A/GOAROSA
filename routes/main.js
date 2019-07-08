var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user){
    res.render('main', {name: req.session.user.name, status: '0'});
  } else{
    req.session.error = true;
    res.redirect('/users/login');
  }
});

module.exports = router;