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

router.route('/').post(accessControl, upload.single('file'), companyController.createCompany);
router.route('/').get(accessControl, companyController.getCompanies);
router.route('/:id').get(accessControl, companyController.getCompany);
router.route('/name/:name').get(accessControl, companyController.getCompanyByName);
router.route('/search/:name').get(accessControl, companyController.getCompaniesLike);
router.route('/companySurco/:companySurco').get(accessControl, companyController.getCompanyByCompanySurco);
router.route('/:id').put(accessControl, companyController.updateCompany);
router.route('/:id').delete(accessControl, companyController.deleteCompany);


module.exports = router;