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
});

spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);


router.get('/', async (req, res) => {
  const keyword = req.query.keyword;

  const searchArtists = () => {
    return spotifyApi.searchArtists(keyword)
      .then(function (data) {
        res.json(data.body);
      });
  };

  searchArtists()
    .catch(function (err) {
      if (err.statusCode === 401) {
        spotifyApi.clientCredentialsGrant()
          .then(function (data) {
            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);

            // Now you can use the access token to make API calls
            return searchArtists();
          })
          .catch(function (err) {
            // Handle errors in the client credentials grant API call
            console.error('Failed to get client credentials grant:', err);
          });
      } else {
        console.error(err);
      }
    });
});


router.get('/album', async (req, res) => {
  const artistId = req.query.id;

  const getArtistAlbums = () => {
    return spotifyApi.getArtistAlbums(artistId, { limit: 3 })
      .then(function (data) {
        res.json(data.body);
      });
  };

  getArtistAlbums()
    .catch(function (err) {
      if (err.statusCode === 401) {
        spotifyApi.clientCredentialsGrant()
          .then(function (data) {
            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);

            // Now you can use the access token to make API calls
            return getArtistAlbums();
          })
          .catch(function (err) {
            // Handle errors in the client credentials grant API call
            console.error('Failed to get client credentials grant:', err);
          });
      } else {
        console.error(err);
      }
    });
});

module.exports = router;
