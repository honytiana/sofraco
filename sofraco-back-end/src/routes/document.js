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
router.route('/date/:date').get(accessControl, documentController.getDocumentsByDate);
router.route('/year/:year/month/:month').get(accessControl, documentController.getDocumentsByYearMonth);
router.route('/company/:company/year/:year/month/:month').get(accessControl, documentController.getDocumentsCompanyByYearMonth);
router.route('/company/:company').get(accessControl, documentController.getDocumentsCompany);
router.route('/').delete(accessControl, documentController.deleteAllDocuments);


module.exports = router;