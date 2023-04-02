const express = require('express');
const axios = require('axios');

const router = express.Router();
const api_key = "94UcyU0cGrWAaWAD6zABpFsfJKNi6znX";

// GET /events endpoint
router.get('/', async (req, res) => {
  // Get keyword parameter from the URL
  const keyword = req.query.keyword;

  // Send a GET request to the Ticketmaster Suggest API
  const url = `https://app.ticketmaster.com/discovery/v2/suggest.json?keyword=${keyword}&apikey=${api_key}`;

  try {
    const response = await axios.get(url);

    // Return response JSON
    res.json(response.data);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
