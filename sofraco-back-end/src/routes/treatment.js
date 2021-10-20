const express = require('express');
const router = express.Router();

const accessControl = require('../middlewares/accessControl');
const treatmentController =  require('../controllers/treatment');

router.route('/').get(accessControl, treatmentController.getTreatment);
router.route('/:id').get(accessControl, treatmentController.getTreatment);
router.route('/user/:user').get(accessControl, treatmentController.getTreatmentByUser);
router.route('/user/:user/status/processing').get(accessControl, treatmentController.getProcessingTreatmentByUser);
router.route('/').post(accessControl, treatmentController.createTreatment);
router.route('/:id').put(accessControl, treatmentController.updateTreatment);
router.route('/:id').delete(accessControl, treatmentController.deleteTreatment);


module.exports = router;