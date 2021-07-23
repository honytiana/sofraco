const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

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

router.route('/:id').get(excelMasterController.getExcelMaster);
router.route('/').get(excelMasterController.getExcelMasters);
router.route('/zip/excels').get(excelMasterController.getExcelMastersZip);
router.route('/').post(excelMasterController.createExcelMaster);
router.route('/:id').put(excelMasterController.updateExcelMaster);


module.exports = router;