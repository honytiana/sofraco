const express = require('express');
const router = express.Router();

const accessControl = require('../middlewares/accessControl');
const correspondanceController =  require('../controllers/correspondance');

router.route('/:id').get(correspondanceController.getCorrespondance);
router.route('/').get(correspondanceController.getCorrespondances);
router.route('/courtier/:courtier').get(correspondanceController.getCorrespondanceByCourtier);
router.route('/').post(accessControl, correspondanceController.createCorrespondance);
router.route('/:id').put(correspondanceController.updateCorrespondance);


module.exports = router;