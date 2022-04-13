const express = require('express');
const router = express.Router();

const accessControl = require('../middlewares/accessControl');
const treatmentController =  require('../controllers/treatment');

router.route('/').post(accessControl, treatmentController.createTreatment);
router.route('/').get(accessControl, treatmentController.getTreatments);
router.route('/:id').get(accessControl, treatmentController.getTreatment);
router.route('/user/:user').get(accessControl, treatmentController.getTreatmentByUser);
router.route('/user/:user/status/processing').get(accessControl, treatmentController.getProcessingTreatmentByUser);
router.route('/status/processing').get(accessControl, treatmentController.getProcessingTreatment);
router.route('/user/:user/status/:status').put(accessControl, treatmentController.updateStatusTreatmentUser);
router.route('/status/:status').put(accessControl, treatmentController.updateStatusTreatment);
router.route('/:id').put(accessControl, treatmentController.updateTreatment);
router.route('/').delete(accessControl, treatmentController.deleteAllTreatment);
router.route('/:id').delete(accessControl, treatmentController.deleteTreatment);


module.exports = router; 