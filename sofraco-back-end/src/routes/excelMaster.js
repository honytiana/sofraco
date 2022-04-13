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

router.route('/').post(accessControl, excelMasterController.createExcelMaster);
router.route('/:id').get(accessControl, excelMasterController.getExcelMaster);
router.route('/').get(accessControl, excelMasterController.getExcelMasters);
router.route('/courtier/:courtier').get(accessControl, excelMasterController.getExcelMastersByCourtier);
router.route('/zip/excels').get(accessControl, excelMasterController.getExcelMastersZip);
router.route('/xlsx/:excel').get(accessControl, excelMasterController.getExcelMasterXlsx);
router.route('/year/:year/month/:month').get(accessControl, excelMasterController.getExcelMastersByYearMonth);
router.route('/courtier/:courtier/year/:year/month/:month/type/:type').get(accessControl, excelMasterController.getExcelMastersCourtierByYearMonth);
router.route('/courtier/:courtier/year/month/type/:type').get(accessControl, excelMasterController.getExcelMastersByYearMonthV2);
router.route('/:id').put(accessControl, excelMasterController.updateExcelMaster);
router.route('/').delete(accessControl, excelMasterController.deleteAllExcelMaster);
router.route('/:id').delete(accessControl, excelMasterController.deleteExcelMaster);


module.exports = router;