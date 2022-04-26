const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const accessControl = require('../middlewares/accessControl');
const clientController =  require('../controllers/client');
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

router.route('/').get(accessControl, clientController.getClients);
router.route('/:id').get(accessControl, clientController.getClient);
router.route('/').post(accessControl, clientController.createClient);
router.route('/name/:name?').post(accessControl, upload.single('files'), clientController.createClients);
router.route('/courtier/:courtier').get(accessControl, clientController.getClientsOfCourtier);
router.route('/:id').put(accessControl, clientController.updateClient);
router.route('/').delete(clientController.deleteAllClients);
router.route('/:id').delete(accessControl, clientController.deleteClient);


module.exports = router;