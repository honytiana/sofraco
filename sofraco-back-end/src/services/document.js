const path = require('path');
const ExcelJS = require('exceljs');

const config = require('../../config.json');
const Document = require('../models/document');


exports.readExcel = async (filePaht) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePaht);
};

