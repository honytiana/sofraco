const express = require('express');
const router = express.Router();
const mailerControler =  require('../controllers/mailer');

router.post('/', mailerControler.postMail);


module.exports = router;