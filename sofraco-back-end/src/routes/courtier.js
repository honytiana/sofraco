const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const accessControl = require('../middlewares/accessControl');
const courtierController =  require('../controllers/courtier');

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		const destination = path.join(__dirname, '..', '..', 'documents', 'uploaded');
		callback(null, destination);
	},
	filename: (req, file, callback) => {
		callback(null, file.originalname.replace(/[\s()]/g, '_'));
	},
});

const upload = multer({ 
	storage: storage
});

router.route('/').get(accessControl, courtierController.getCourtiers);
router.route('/:id').get(accessControl, courtierController.getCourtier);
router.route('/search/:name').get(accessControl, courtierController.getGlobalCourtierMandataireCodeLike);
router.route('/role/:role').get(accessControl, courtierController.getCourtiersByRole);
router.route('/mandataires/:courtier').get(accessControl, courtierController.getMandatairesOfCourtier);
router.route('/courtier/:mandataire').get(accessControl, courtierController.getCourtierOfMandataire);
router.route('/').post(accessControl, courtierController.createCourtier);
router.route('/name/:name?').post(accessControl, upload.single('files'), courtierController.createCourtiers);
router.route('/:id').put(courtierController.updateCourtier);
router.route('/').put(courtierController.updateAllCourtier);
router.route('/add/cabinet').put(courtierController.updateCourtierSetCabinets);
router.route('/courtier/:courtier/emailCopie').put(courtierController.addEmailCopieCourtier);
router.route('/courtier/:courtier/emailCopie/edit').put(courtierController.editEmailCopieCourtier);
router.route('/courtier/:courtier/emailCopie/delete').put(courtierController.deleteEmailCopieCourtier);
router.route('/:id').delete(accessControl, courtierController.deleteCourtier);
router.route('/role/:role').delete(accessControl, courtierController.deleteCourtiersByRole);
router.route('/').delete(accessControl, courtierController.deleteAllCourtiers);


module.exports = router;