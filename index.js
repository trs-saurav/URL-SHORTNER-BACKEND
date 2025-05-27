const express = require('express')
const urlRoute = require("./routes/url")
const {connectDB} = require("./connect")
const URL = require('./models/url')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const cron = require("node-cron")

const userRoute = require('./routes/user')

const app = express();
const PORT = process.env.PORT || 8001;


connectDB(process.env.MONGODB)
.then(()=> console.log("DB connected"))
.catch((err) => console.log(err))



const allowedOrigins = [
    "http://localhost:5173",
    "https://urldummy.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true 
}));

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())

cron.schedule("*/10 * * * *", async () => {
    console.log("Running task every 10 minutes");
    await fetch("https://urldummy.onrender.com/ping");
});


app.use("/api/url" , urlRoute)
app.use("/api/user", userRoute)

app.get("/ping", (req, res) => {
    res.status(200).send("Server is alive!");
});

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