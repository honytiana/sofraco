const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const companyController =  require('../controllers/company');

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		const destination = path.join(__dirname, '..', '..', 'logos');
		callback(null, destination);
	},
	filename: (req, file, callback) => {
		callback(null, file.originalname);
	},
});

const upload = multer({ storage: storage });

router.route('/:id').get(companyController.getCompany);
router.route('/name/:name').get(companyController.getCompanyByName);
router.route('/').get(companyController.getCompanies);
router.route('/').post(upload.single('file'), companyController.createCompany);
router.route('/:id').put(companyController.updateCompany);


module.exports = router;