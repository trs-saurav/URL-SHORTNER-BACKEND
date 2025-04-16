const express = require('express')
const urlRoute = require("./routes/url")
const {connectDB} = require("./connect")
const URL = require('./models/url')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()


const app = express();
const PORT = process.env.PORT || 8001;


connectDB(process.env.MONGODB)
.then(()=> console.log("DB connected"))
.catch((err) => console.log(err))


app.use(cors())

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())

app.use("/api/url" , urlRoute)

app.get("/:shortID", async (req, res) => {
    try {
        const shortId = req.params.shortID;

        const entry = await URL.findOneAndUpdate(
            { shortId },
            { $push: { visitHistory: { timestamp: Date.now() } } },
            { returnDocument: "after" }
        );

        if (entry) {
            let redirectURL = entry.redirectURL;
            if (!redirectURL.startsWith("http://") && !redirectURL.startsWith("https://")) {
                redirectURL = "https://" + redirectURL;
            }
            console.log("Final Redirect URL:", redirectURL);
            return res.redirect(redirectURL);
        } else {
            console.log("Short ID not found.");
            return res.status(404).send("Short ID not found.");
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal server error.");
    }
});







app.listen(PORT, ()=> console.log('server is listening' , PORT))