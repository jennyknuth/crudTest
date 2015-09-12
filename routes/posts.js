var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var posts = db.get('posts');
var comments = db.get('comments');

/* GET users listing. */
router.get('/', function(req, res, next) {
  posts.find({}).then(function(docs) {
    console.log(req.body);
    res.render('posts/index', {posts: docs});
  });
  // posts.find({}, function(err, docs) {
  //   console.log(req.body);
  //   res.render('posts/index.hbs', {posts: docs});
  // });
});

router.post('/', function (req, res, next) {
  posts.insert(req.body).then(function (doc) {
    res.redirect('/posts')
  })
  // posts.insert(req.body, function(err, doc) {
  //   res.redirect('/posts')
  // });
});

router.get('/new', function (req, res, next) {
  res.render('posts/new');
});

router.get('/:id', function (req, res, next) {
  var locals = {}
  posts.findOne({_id: req.params.id}).then(function(doc) {
    locals.post = doc
    comments.find({postId: req.params.id}).then(function(docs) {
      locals.comments = docs
      res.render('posts/show', locals)
    });
  });

  // posts.findOne({_id: req.params.id}, function (err, doc) {
  //   if (err) throw error;
  //   comments.find({postId: req.params.id}, function (err, docs) { //this is like the comments show page
  //     res.render('posts/show', {post: doc, comments: docs})
  //   });
  // });
});

router.get('/:id/edit', function (req, res, next) {
  var locals = {}
  posts.findOne({_id: req.params.id}).then(function (doc) {
    locals.post = doc
    comments.find({postId: req.params.id}).then(function (docs) {
      locals.comments = docs
      res.render ('posts/edit', locals)
    })
  })
  // posts.findOne({_id: req.params.id}, function (err, doc){
  //   if (err) throw error;
  //   comments.find({postId: req.params.id}, function (err, docs) { //this is like the comments show page
  //     res.render ('posts/edit', {post: doc, comments: docs})
  //   })
  // });
});

router.post('/:id/update', function (req, res, next) {
  posts.findOne({_id: req.params.id}).then(function () {
    posts.update({_id: req.params.id}, req.body)
    res.redirect('/posts/' + req.params.id)
  })
  // posts.findOne({_id: req.params.id}, function (err, doc) {
  //   if (err) throw err;
  //   posts.update({_id: req.params.id}, req.body, function (err, doc) {
  //     if (err) throw err;
  //     res.redirect('/posts/' + req.params.id);
  //   });
  // });
});

router.post('/:id/delete', function (req, res, next) {
  Promise.all([comments.remove({postId: req.params.id}), posts.remove({_id: req.params.id})])
  res.redirect('/posts')

  // comments.remove({postId: req.params.id}, function (err, docs) {
  //   if (err) throw err;
  //   posts.remove({_id: req.params.id}, function (err, doc) {
  //     if (err) throw err;
  //     res.redirect('/posts');
  //   });
  // });
});

module.exports = router;
