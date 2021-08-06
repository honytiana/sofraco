const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const accessControl = require('../middlewares/accessControl');
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

router.route('/:id').get(accessControl, companyController.getCompany);
router.route('/name/:name').get(accessControl, companyController.getCompanyByName);
router.route('/').get(accessControl, companyController.getCompanies);
router.route('/').post(accessControl, upload.single('file'), companyController.createCompany);
router.route('/:id').put(accessControl, companyController.updateCompany);


module.exports = router;