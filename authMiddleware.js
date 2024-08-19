// authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('./config');
const pool = require('./db');

const tokenRequired = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token is missing !!' });
    }

    jwt.verify(token, config.SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Token is invalid !!', error: err.message });
        }

        try {
            const [rows] = await pool.query("SELECT * FROM tbluser WHERE ID = ?", [decoded.user_id]);
            if (!rows.length) {
                return res.status(401).json({ success: false, message: 'User not found !!' });
            }
            req.currentUser = rows[0];
            next();
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    });
};

module.exports = tokenRequired;
