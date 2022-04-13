const express = require('express');
const router = express.Router();

const accessControl = require('../middlewares/accessControl');
const correspondanceController =  require('../controllers/correspondance');

router.route('/:role').post(accessControl, correspondanceController.createCorrespondance);
router.route('/').get(correspondanceController.getCorrespondances);
router.route('/:id').get(correspondanceController.getCorrespondance);
router.route('/courtier/:courtier').get(correspondanceController.getCorrespondanceByCourtier);
router.route('/:id').put(correspondanceController.updateCorrespondance);
router.route('/code/courtier/:courtier').put(correspondanceController.addCodeCourtier);
router.route('/code/courtier/edit/:courtier').put(correspondanceController.editCodeCourtier);
router.route('/').delete(accessControl, correspondanceController.deleteAllCorrespondances);
router.route('/code/courtier/:courtier/code/:code').delete(correspondanceController.deleteCodeCourtier);
router.route('/:id').delete(accessControl, correspondanceController.deleteCorrespondance);


module.exports = router;