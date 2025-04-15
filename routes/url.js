const express = require('express')
const {handleGenerateNewShortURL , handleGetAnalytics, getAllData, deleteData} = require('../controllers/url.js')

const router = express.Router();

router.post('/', handleGenerateNewShortURL)
.delete('/:shortID', deleteData)
.get('/analytics/:shortId' , handleGetAnalytics)
.get('/data' , getAllData )

module.exports = router;
