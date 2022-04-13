const express = require('express');
const router = express.Router();

const accessControl = require('../middlewares/accessControl');
const cabinetController =  require('../controllers/cabinet');

router.route('/').get(accessControl, cabinetController.getCabinets);
router.route('/:id').get(accessControl, cabinetController.getCabinet);
router.route('/cabinet/:cabinet').get(accessControl, cabinetController.getCabinetByName);
router.route('/').post(accessControl, cabinetController.createCabinet);
router.route('/:id').put(accessControl, cabinetController.updateCabinet);
router.route('/').put(cabinetController.deleteAllCabinets);
router.route('/:id').delete(accessControl, cabinetController.deleteCabinet);
router.route('/cabinet/:cabinet/name').put(cabinetController.addCabinetName);
router.route('/cabinet/:cabinet/name/edit').put(cabinetController.editCabinetName);
router.route('/cabinet/:cabinet/name/delete').put(cabinetController.deleteCabinetName);


module.exports = router;