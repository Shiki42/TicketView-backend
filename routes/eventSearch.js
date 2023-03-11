var express = require('express');
const axios = require('axios');
var router = express.Router();
var path = require('path');

var api_key = "94UcyU0cGrWAaWAD6zABpFsfJKNi6znX"

router.get('/', async (req, res) => {
  
  // Get parameters from the URL
  const keyword = req.query.keyword;
  const radius = parseInt(req.query.distance);
  const geoPoint = req.query.geoPoint;
  const category = req.query.category;

  // Map category to segmentId
  const category_to_segmentId = {
    music: 'KZFzniwnSyZfZ7v7nJ',
    sports: 'KZFzniwnSyZfZ7v7nE',
    arts: 'KZFzniwnSyZfZ7v7na',
    film: 'KZFzniwnSyZfZ7v7nn',
    misc: 'KZFzniwnSyZfZ7v7n1',
    default: ''
  };
  const segmentId = category_to_segmentId[category] || '';

  // Send a GET request to the Ticketmaster Event Search API
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${keyword}&radius=${radius}&unit=miles&geoPoint=${geoPoint}&segmentId=${segmentId}&apikey=${api_key}`;
  try {
    const response = await axios.get(url);

    // Return response JSON
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
  
});

module.exports = router;
