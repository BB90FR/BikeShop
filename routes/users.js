var express = require('express');
var router = express.Router();


// SHOP

router.get('/', function(req, res, next) {
  res.render('index', {  });
});

module.exports = router;
