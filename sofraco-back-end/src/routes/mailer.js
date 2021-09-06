const express = require('express');
const router = express.Router();

const accessControl = require('../middlewares/accessControl');
const mailerControler =  require('../controllers/mailer');

router.route('/').post(accessControl, mailerControler.postMail);
router.route('/').get(mailerControler.find);


module.exports = router;