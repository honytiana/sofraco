const ExcelMaster = require('../models/excelMaster');
const fs = require('fs');

class ExcelMasterHandler {

    constructor() { }

    createExcelMaster(data) {
        let excelMaster = new ExcelMaster();
        excelMaster.courtier = null;
        excelMaster.code_courtier  = data.code_courtier;
        excelMaster.companies = data.companies;
        excelMaster.create_date = Date.now();
        excelMaster.path = data.path;
        excelMaster.is_enabled = true;
        excelMaster.save();
        return excelMaster;
    }

    getExcelMaster(id) {
        return ExcelMaster.findById(id);
    }

    getExcelMasters() {
        return ExcelMaster.find();
    }

    updateExcelMaster(id, data) {
        return ExcelMaster.findByIdAndUpdate(id, data);
    }

    deleteExcelMaster() {

    }

}

module.exports = new ExcelMasterHandler();