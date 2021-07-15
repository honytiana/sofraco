const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

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

router.route('/').post(upload.array('files'), documentController.createDocument);
router.route('/').put(documentController.updateDocuments);
// router.route('/:id').put(documentController.updateDoc);
router.route('/:company').put(documentController.updateDocument);
router.route('/').get(documentController.getDocuments);
router.route('/:id').get(documentController.getDocument);



module.exports = router;