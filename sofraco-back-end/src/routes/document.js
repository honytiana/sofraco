const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const accessControl = require('../middlewares/accessControl');
const documentController =  require('../controllers/document');

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		const destination = path.join(__dirname, '..', '..', 'documents', 'uploaded');
		callback(null, destination);
	},
	filename: (req, file, callback) => {
		callback(null, file.originalname.replace(/\s/g, '_'));
	},
});

const upload = multer({ storage: storage });

router.route('/').post(accessControl, upload.array('files'), documentController.createDocument);
router.route('/').put(accessControl, documentController.updateDocuments);
router.route('/status/:status').put(accessControl, documentController.setStatusDocument);
router.route('/:company').put(accessControl, documentController.updateDocument);
router.route('/').get(accessControl, documentController.getDocuments);
router.route('/:id').get(accessControl, documentController.getDocument);



module.exports = router;