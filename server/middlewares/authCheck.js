const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, please log in' });
    }

    try {
        const decoded = jwt.verify(token, "dfghjkcfgvh");
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is invalid or expired' });
    }
};

module.exports = authMiddleware;