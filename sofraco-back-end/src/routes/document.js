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
		callback(null, file.originalname.replace(/[\s()]/g, '_'));
	},
});

const upload = multer({ 
	storage: storage
});

router.route('/').post(accessControl, upload.array('files'), documentController.createDocument);
router.route('/').get(accessControl, documentController.getDocuments);
router.route('/:id').get(accessControl, documentController.getDocument);
router.route('/date/:date').get(accessControl, documentController.getDocumentsByDate);
router.route('/year/:year/month/:month').get(accessControl, documentController.getDocumentsByYearMonth);
router.route('/company/:company/year/month').get(accessControl, documentController.getDocumentsCompanyByAllYearMonth);
router.route('/company/:company/year/:year/month/:month').get(accessControl, documentController.getDocumentsCompanyByYearMonth);
router.route('/company/:company').get(accessControl, documentController.getDocumentsCompany);
router.route('/status/:status').get(accessControl, documentController.getDocumentsByStatus);
router.route('/').put(accessControl, documentController.updateDocuments);
router.route('/:id').put(accessControl, documentController.updateDocument);
router.route('/status/:status').put(accessControl, documentController.setStatusDocument);
router.route('/').delete(accessControl, documentController.deleteAllDocuments);
router.route('/files').delete(accessControl, documentController.deleteAllDocumentFiles);
router.route('/:id').delete(accessControl, documentController.deleteDocument);


module.exports = router;