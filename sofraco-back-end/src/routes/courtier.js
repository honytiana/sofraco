const express = require('express');
const router = express.Router();
const courtierController =  require('../controllers/courtier');

router.get('/', courtierController.getCourtiers);
router.get('/:id', courtierController.getCourtier);
router.post('/', courtierController.createCourtier);


module.exports = router;