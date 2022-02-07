const express = require('express');
const router = express.Router();

const accessControl = require('../middlewares/accessControl');
const courtierController =  require('../controllers/courtier');

router.route('/').get(accessControl, courtierController.getCourtiers);
router.route('/:id').get(accessControl, courtierController.getCourtier);
router.route('/role/:role').get(accessControl, courtierController.getCourtiersByRole);
router.route('/mandataires/:courtier').get(accessControl, courtierController.getMandatairesOfCourtier);
router.route('/courtier/:mandataire').get(accessControl, courtierController.getCourtierOfMandataire);
router.route('/').post(accessControl, courtierController.createCourtier);
router.route('/:id').put(courtierController.updateCourtier);
router.route('/').put(courtierController.updateAllCourtier);
router.route('/courtier/:courtier/emailCopie').put(courtierController.addEmailCopieCourtier);
router.route('/:id').delete(accessControl, courtierController.deleteCourtier);
router.route('/').delete(accessControl, courtierController.deleteAllCourtiers);


module.exports = router;