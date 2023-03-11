var express = require('express');
const axios = require('axios');
var router = express.Router();
var path = require('path');
/* GET home page. */


router.get('/', function(req, res, next) {
  const filePath = path.join(__dirname, '../public/index.html');
  res.sendFile(filePath);
});



module.exports = router;
