var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
var moment = require('moment');

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

function addNewlines(str) {
  var result = '';
  var array;
  if(str.length > 70){
    array = str.split(" ");
    for(var i = 0; i < array.length; i++){
      if (i == array.length/2){
        result += '\n';
      }else {
        result += array[i]+' ';
      }
    }
    return result;
  }else{
    return str;
  }
  
  
}

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


router.get('/twitter/search/:q/:ln/:geo', function(req, res, next) {
  var query = req.params.q;
  var ln = req.params.ln;
  var geo = req.params.geo;
  var search = {
    q: query,
  }
  
  if(geo)
    search.geocode = geo;
  if(ln)
    search.lang = ln;
  
  client.get('search/tweets', search, function(error, tweets, response) {
    if(error) throw error;
    console.log(tweets);  // The favorites. 
    
    var final = {
      statuses: [],
      tweets
    };
    
    for(var i = 0; i < tweets["statuses"].length; i++){
      var texto = tweets["statuses"][i].text;
      texto = addNewlines(texto.replace(/(\r?\n|\r)/gm, " "));
      var fecha = moment(tweets["statuses"][i].created_at).format('DD MMMM, h:mm a');
      var media = tweets["statuses"][i].extended_entities ? tweets["statuses"][i].extended_entities.media : "";
      var video = media != "" && media[0].video_info ? media[0].video_info.variants : [];
      var video_url; 
      for (var k = 0; k < video.length; k++){
        if(video[k].content_type == "video/mp4" && video[k].bitrate >= 832000){
          video_url = video[k].url;
        }
      }
      
      final["statuses"].push({
        text: texto,
        created_at: fecha,
        media: media,
        video: video,
        video_url: video_url
      });
    }
    
    res.status(200).send(JSON.stringify(final));
  });
});




module.exports = router;
