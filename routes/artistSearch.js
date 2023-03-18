var SpotifyWebApi = require('spotify-web-api-node');
var express = require('express');
const axios = require('axios');
var router = express.Router();
var path = require('path');
var {SpotifyClientId, SpotifyClientSecret} = require('./apikey');
const request = require('request');

var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(SpotifyClientId + ':' + SpotifyClientSecret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

var spotifyApi = new SpotifyWebApi({
  clientId: SpotifyClientId,
  clientSecret: SpotifyClientSecret,
  redirectUri: 'http://www.example.com/callback'
});

var clientCredentialsGrant = () => {
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var token = body.access_token;
      spotifyApi.setAccessToken(token);
      // Perform other operations using spotifyApi object here
    } else {
      console.log(error);
    }
  });
}

clientCredentialsGrant();

router.get('/', async (req, res) => {
  const keyword = req.query.keyword;
  spotifyApi.searchArtists(keyword)
    .then(function(data) {
      if (data.statusCode === 200) {
        res.json(data.body);
      } else if (data.statusCode === 401) {
        clientCredentialsGrant();
        spotifyApi.searchArtists(keyword)
          .then(function(data) {
            res.json(data.body);
          }, function(err) {
            console.error(err);
          });
      }
    }, function(err) {
      console.error(err);
    });
});

module.exports = router;
