const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function authenticate(req, res, next) {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ message: "no token" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token", token });
    }
}

module.exports = authenticate;
