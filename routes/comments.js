var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var comments = db.get('comments');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   comments.find({}, function(err, docs) {
//     console.log(req.body);
//     res.render('comments/index.hbs', {posts: docs});
//   });
// });

router.post('/', function (req, res, next) {
  console.log(req.body);
  comments.insert(req.body, function(err, doc) {
    res.redirect('/posts/' + req.body.postId)
  });
});

// router.get('/new', function (req, res, next) {
//   res.render('comments/new');
// });

// router.get('/:id', function (req, res, next) {
//   comments.findOne({_id: req.params.id}, function (err, doc) {
//     res.render('posts/:id', doc)
//   });
// });

// router.get('/:id/edit', function (req, res, next) {
//   comments.findOne({_id: req.params.id}, function (err, doc){
//     if (err) throw error;
//     res.render('posts/:id/comments/:id/edit', doc)
//   });
// });

// router.post('/:id/update', function (req, res, next) {
//   comments.findOne({postId: req.body.postId}, function (err, doc) {
//     if (err) throw err;
//     comments.update({_id: req.params.id}, req.body, function (err, doc) {
//       if (err) throw err;
//       res.redirect('/posts/' + req.params.id);
//     });
//   })
// });

router.post('/:id/delete', function (req, res, next) {
  console.log('body to delete', req.body);
  console.log('req.params', req.params);
  comments.remove({_id: req.params.id}, function (err, doc) {
    if (err) throw err;
    res.redirect('/posts/' + req.body.postId);
  });
});

module.exports = router;
