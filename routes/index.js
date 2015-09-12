var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var posts = db.get('posts');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/posts');
});

module.exports = router;
