const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = async (req, res, next) => {
    console.log('--- PROTECT MIDDLEWARE EXECUTED ---');

    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            console.log('Extracted Token (from header):', token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const result = await db.query(
                'SELECT id, name, email, role FROM users WHERE id = $1',
                [decoded.id]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ message: 'User not found.' });
            }

            req.user = { id: decoded.id };
            // or req.userId = decoded.id;
            next();
        } catch (error) {
            console.error('JWT Verification Failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    } else {
        console.log('Authorization Header Missing or Malformed (No Bearer).');
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token.' });
    }
};

module.exports = { protect };