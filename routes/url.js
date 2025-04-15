const express = require('express')
const {handleGenerateNewShortURL , handleGetAnalytics, getAllData} = require('../controllers/url.js')

const router = express.Router();

router.post('/', handleGenerateNewShortURL)
.get('/analytics/:shortId' , handleGetAnalytics)
.get('/data' , getAllData )

module.exports = router;
