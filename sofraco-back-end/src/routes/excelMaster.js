const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const accessControl = require('../middlewares/accessControl');
const excelMasterController =  require('../controllers/excelMaster');

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

router.route('/:id').get(accessControl, excelMasterController.getExcelMaster);
router.route('/').get(accessControl, excelMasterController.getExcelMasters);
router.route('/zip/excels').get(accessControl, excelMasterController.getExcelMastersZip);
router.route('/').post(accessControl, excelMasterController.createExcelMaster);
router.route('/:id').put(accessControl, excelMasterController.updateExcelMaster);


module.exports = router;