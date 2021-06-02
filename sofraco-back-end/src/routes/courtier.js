const express = require('express');
const router = express.Router();
const courtierController =  require('../controllers/courtier');

router.get('/', courtierController.getCourtiers);
router.post('/', courtierController.createCourtier);


module.exports = router;