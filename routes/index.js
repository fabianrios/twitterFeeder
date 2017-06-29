var express = require('express');
var router = express.Router();
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/twitter/favorites', function(req, res, next) {
  client.get('favorites/list', function(error, tweets, response) {
    if(error) throw error;
    console.log(tweets);  // The favorites. 
    res.status(200).send(JSON.stringify(tweets));
  });
});

router.get('/twitter/trends', function(req, res, next) {
  client.get('trends/place', function(error, tweets, response) {
    if(error) throw error;
    console.log(tweets);  // The favorites. 
    res.status(200).send(JSON.stringify(tweets));
  });
});

router.get('/twitter/search/:q', function(req, res, next) {
  var query = req.params.q;
  client.get('search/tweets', {q: query}, function(error, tweets, response) {
    if(error) throw error;
    console.log(tweets);  // The favorites. 
    res.status(200).send(JSON.stringify(tweets));
  });
});




module.exports = router;
