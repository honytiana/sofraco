const express = require('express');
const router = express.Router();

const accessControl = require('../middlewares/accessControl');
const courtierController =  require('../controllers/courtier');

router.route('/').get(accessControl, courtierController.getCourtiers);
router.route('/:id').get(accessControl, courtierController.getCourtier);
router.route('/').post(accessControl, courtierController.createCourtier);


module.exports = router;