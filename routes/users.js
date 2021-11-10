var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users/home',{ admin:false});
});

router.get('/checkout', function(req, res, next) {
  res.render('users/checkout',{ admin:false});
});

module.exports = router;
