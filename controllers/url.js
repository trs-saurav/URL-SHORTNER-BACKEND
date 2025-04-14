const {nanoid} = require("nanoid")
const URL = require('../models/url');



async function handleGenerateNewShortURL(req,res) {

    const body = req.body;
    if(!body.url) return res.status(400).json({message: "URL is required"})
    const shortID = nanoid(8);

    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitedHistory: [],
    });

    return res.json({id: shortID});
}


async function handleGetAnalytics(req, res) {

        const shortId = req.params.shortId; 

        const result = await URL.findOne({ shortId }); // Ensure you use 'result' here for database lookup

        if (!result) {
            return res.status(404).json({ error: "Short URL not found" });
        }

        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory, // Correct capitalization
        });
   
    }



module.exports = {
    handleGenerateNewShortURL, handleGetAnalytics
}