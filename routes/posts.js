var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var posts = db.get('posts');

/* GET users listing. */
router.get('/', function(req, res, next) {
  posts.find({}, function(err, docs) {
    console.log(req.body);
    res.render('posts/index.hbs', {posts: docs});
  });
});

router.post('/', function (req, res, next) {
  req.body.comments = []
  console.log('new post body:', req.body);
  posts.insert(req.body, function(err, doc) {
    res.redirect('/posts')
  });
});

router.get('/new', function (req, res, next) {
  res.render('posts/new');
});

router.get('/:id', function (req, res, next) {
  posts.findOne({_id: req.params.id}, function (err, doc) {
    res.render('posts/show', doc)
  });
});

router.get('/:id/edit', function (req, res, next) {
  posts.findOne({_id: req.params.id}, function (err, doc){
    if (err) throw error;
    res.render('posts/edit', doc)
  });
});

router.post('/:id/update', function (req, res, next) {
  console.log('is there a comment array?', req.body);
  posts.update({_id: req.params.id}, req.body, function (err, doc) {
    if (err) throw err;
    res.redirect('/posts/' + req.params.id);
  });
});

router.post('/:id/delete', function (req, res, next) {
  posts.remove({_id: req.params.id}, function (err, doc) {
    if (err) throw err;
    res.redirect('/posts');
  });
});

var counter = 0
router.post('/:id/comments', function (req, res, next) {
  counter++
  req.body.id = counter
  console.log(req.body);
  console.log(req.params.id);
  posts.findOne({_id: req.params.id}, function (err, doc) {
    if (err) throw err;
    console.log('doc to push to:', doc);
    console.log('hi');
    doc.comments.push(req.body)
    posts.update({_id: req.params.id}, doc, function (err, doc) {
      console.log(doc);
      res.redirect('/posts/' + req.params.id)
    })
  })
})

router.post('/:id/comments/:id/delete', function (req, res, next) {
  console.log('req.body', req.body); // this is the post id, passed in from the hidden field in the form
  console.log('req.params.id', req.params.id); // this is the comment id
  posts.findOne({_id: req.body.postId}, function(err, doc) {
    var comments = doc.comments
    var filteredComments = comments.filter(function(element) {
      return parseInt(element.id) !== parseInt(req.params.id) // return the comments that do not match the comment to delete
    })
    console.log('filteredComments', filteredComments)
    doc.comments = filteredComments
    console.log('doc without comment', doc);
    posts.update({_id: req.body.postId}, doc, function(err, thing) {
      res.redirect('/posts/' + req.body.postId)
    })
  })
})

module.exports = router;
