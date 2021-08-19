const ExcelMaster = require('../models/excelMaster');
const fs = require('fs');

class ExcelMasterHandler {

    constructor() { }

    createExcelMaster(data) {
        let excelMaster = new ExcelMaster();
        excelMaster.courtier = data.courtier;
        excelMaster.create_date = Date.now();
        excelMaster.path = data.path;
        excelMaster.type = data.type;
        excelMaster.is_enabled = true;
        excelMaster.save();
        return excelMaster;
    }

    getExcelMaster(id) {
        return ExcelMaster.findById(id);
    }

    getExcelMasters() {
        return ExcelMaster.find({ type: 'excel' });
    }

    getExcelMastersZip() {
        return ExcelMaster.find({ type: 'zip' });
    }

    getZipGlobalContainer() {
        let month = new Date().getMonth();
        return ExcelMaster.findOne({ type: 'zip of zip' });
    }

    updateExcelMaster(id, data) {
        return ExcelMaster.findByIdAndUpdate(id, data);
    }

    deleteExcelMaster() {

    }

}

module.exports = new ExcelMasterHandler();