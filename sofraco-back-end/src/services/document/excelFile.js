const path = require('path');
const ExcelJS = require('exceljs');
const fs = require('fs');


exports.readExcelAPICIL = async (file) => {
    const filePath = file.path;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheets = workbook.worksheets;
    let allRows = [];
    let infos = { collective: [], individual: [], totals: { collective: '', individual: '', general: '' } };

    for (let worksheet of worksheets) {
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 4) {
                if (typeof row.getCell('L').value === 'string' &&
                    row.getCell('L').value.trim() === '' &&
                    row.getCell('M').value.trim() === '' &&
                    row.getCell('I').value.trim() !== '') {
                    if (row.getCell('C').value.trim().toUpperCase() === 'TOTAL COLLECTIF') {
                        infos.totals.collective = row.getCell('I').value.trim();
                    }
                    if (row.getCell('C').value.trim().toUpperCase() === 'TOTAL INDIVIDUELS') {
                        infos.totals.individual = row.getCell('I').value.trim();
                    }
                    if (row.getCell('C').value.trim().toUpperCase() === 'TOTAL GENERAL') {
                        infos.totals.general = row.getCell('I').value.trim();
                    }
                }

                const obj = {
                    code: (typeof row.getCell('L').value === 'string') ?
                        row.getCell('L').value.trim() :
                        row.getCell('L').value,
                    cabinet: row.getCell('M').value.trim(),
                    commission: row.getCell('I').value.trim(),
                };
                allRows.push(obj);
            }
        });
    }

    for (let element of allRows) {
        if (element.code === '' &&
            element.cabinet === '' &&
            element.commission === '') {
            infos.collective = allRows.slice(0, allRows.indexOf(element));
            infos.individual = allRows.slice(allRows.indexOf(element) + 1, allRows.length - 1);
            infos.collective.pop();
            infos.individual.pop();
            infos.individual.pop();
            break;
        }
    };

    return infos;
};

