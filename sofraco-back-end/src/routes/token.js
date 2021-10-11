const express = require('express');
const router = express.Router();

const accessControl = require('../middlewares/accessControl');
const tokenController =  require('../controllers/token');

router.route('/').get(tokenController.getTokens);
router.route('/user/:userId/token/:token').get(tokenController.checkToken);
router.route('/user/:userId').get(tokenController.getTokenByUser);
router.route('/:id').delete(tokenController.removeTokenById);
router.route('/user/:userId').delete(tokenController.removeTokenByUser);


module.exports = router;