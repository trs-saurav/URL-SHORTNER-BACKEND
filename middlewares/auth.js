const {getUser} = require('../service/auth.js');

async function restrictToLoginPerson(req, res, next) {
    const userUid = req.cookies?.uid  
    if (!sessionId) {
        return res.status(401).json({ error: "You are not logged in" });
    }
    const user = getUser(sessionId);
    if (!user) {
        return res.status(401).json({ error: "You are not logged in" });
    }
    req.user = user;
    next();
}