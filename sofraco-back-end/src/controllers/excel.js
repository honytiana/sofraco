
const ExcelJS = require('exceljs');
const path = require('path');

exports.createExcelFile = async () => {
    // Workbook
    const workbook = new ExcelJS.Workbook();

    // Worksheet
    const workSheet = workbook.addWorksheet('Feuille 1');
    workSheet.columns = [
        {header: 'Name', key: 'name', width: 20},
        {header: 'Commission', key: 'commission', width: 25}
    ];

    workSheet.addRow({name: 'Hony', commission: '30'});
    workSheet.addRow({name: 'Tiana', commission: '20'});
    await workbook.xlsx.writeFile(path.join(__dirname, '..', '..', 'files', 'mon_fichier.xlsx'));
};

