const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        let token = req.headers.authoriation;
        if (token && token.startsWith("Bearer")){
            token = token.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            nect();
        } else {
            res.status(401).json({ message: "Not authorized, no token" });
        }
    } catch (error) {
        res.status(401).json({ message: "Token Failed", error: error.message });
    }
};

module.exports = { protect };