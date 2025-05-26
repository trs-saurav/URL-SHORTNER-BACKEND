const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const { getUser, setUser } = require('../service/auth');

async function createUser(req, res) {
    const { name, email, password } = req.body;
    await User.create({
        name,
        email,
        password

    })
    return res.status(201).json({ message: "Successfully created User" })
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({
        email,
        password
    });
    const sessionId = uuidv4();
    if (!user) {
        res.status(401).json({ error: "email or pwd error " })
    }
    setUser(sessionId, user);
    res.cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: "production",
        sameSite: "Strict",
        maxAge: 3600000
    })
        .status(201)
        .json({ message: "signed in successfull" })

}

module.exports = { createUser, loginUser }