const router = require('express').Router();

const {registerUser, userLogin, deleteUser, forgotPassword} = require('../controllers/authController');

//for all users

//post request
router.post('/register', registerUser);
router.post('/login', userLogin);
router.post('/forgot-password', forgotPassword);

module.exports = router;