const router = require('express').Router();
const userCtrl = require('../controllers/auth');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.post('/logout' , userCtrl.logout);
module.exports = router;
