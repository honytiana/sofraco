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
        excelMaster.content = data.content;
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

    getExcelMastersByCourtier(courtier) {
        return ExcelMaster.find({ courtier: courtier, type: 'excel' });
    }

    getExcelMastersByYearMonth(year, month) {
        const myear = parseInt(year);
        const mmonth = parseInt(month);
        return ExcelMaster.find({
            create_date: {
                $gte: new Date(myear, mmonth - 1, 1),
                $lt: new Date(myear, mmonth, 1)
            }
        });
    }

    getExcelMastersCourtierByYearMonth(courtier, year, month, type) {
        const myear = parseInt(year);
        const mmonth = parseInt(month);
        return ExcelMaster.find({
            $and: [
                {
                    create_date: {
                        $gte: new Date(myear, mmonth - 1, 1),
                        $lt: new Date(myear, mmonth, 1)
                    }
                },
                {
                    courtier: courtier
                },
                {
                    type: type
                }
            ]
        }
        );
    }

    updateExcelMaster(id, data) {
        return ExcelMaster.findByIdAndUpdate(id, data);
    }

    deleteAllExcelMaster() {
        return ExcelMaster.deleteMany({});
    }

    deleteExcelMaster() {
        return ExcelMaster.deleteOne({_id: id});
    }

}

module.exports = new ExcelMasterHandler();