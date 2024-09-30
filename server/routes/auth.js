const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authCheck');


router.get('/', authMiddleware,async (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;
