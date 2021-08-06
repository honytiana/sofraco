const express = require('express');
const router = express.Router();

const accessControl = require('../middlewares/accessControl');
const userController =  require('../controllers/user');

router.route('/').get(userController.getUsers);
router.route('/:id').get(userController.getUser);
router.route('/signup').post(userController.createUser);
router.route('/login').post(userController.login);
// router.route('/token').post();


module.exports = router;