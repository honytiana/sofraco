const express = require('express');
const router = express.Router();
const companyController =  require('../controllers/company');

router.get('/:id', companyController.getCompany);
router.get('/name/:name', companyController.getCompanyByName);
router.get('/', companyController.getCompanies);
router.post('/', companyController.createCompany);


module.exports = router;