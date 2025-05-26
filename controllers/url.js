const { nanoid } = require("nanoid")
const URL = require('../models/url');



async function handleGenerateNewShortURL(req, res) {

    const body = req.body;
    if (!body.url) return res.status(400).json({ message: "URL is required" })
    const shortID = nanoid(8);

    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitedHistory: [],
        createdBy: req.user._id
    });

    return res.json({ id: shortID });
}


async function handleGetAnalytics(req, res) {

    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });

    if (!result) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });

}

async function getAllData(req, res) {
    try {
        const data = await URL.find(); 
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
}

async function deleteData(req, res) {
    try{
        const deleteData = await URL.deleteOne({shortId : req.params.shortID})
        res.status(200).json("Data deleted sucessfull")
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting data', error });
    }
}


module.exports = {
    handleGenerateNewShortURL, handleGetAnalytics, getAllData , deleteData
}