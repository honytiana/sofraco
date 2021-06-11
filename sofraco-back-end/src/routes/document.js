const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const documentController =  require('../controllers/document');

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		const destination = path.join(__dirname, '..', '..', 'documents', 'temp');
		callback(null, destination);
	},
	filename: (req, file, callback) => {
		callback(null, file.originalname);
	},
});

const upload = multer({ storage: storage });

router.route('/').post(upload.single('file'), documentController.createDocument);
router.route('/').get(documentController.getDocuments);
router.route('/:id').get(documentController.getDocument);



module.exports = router;