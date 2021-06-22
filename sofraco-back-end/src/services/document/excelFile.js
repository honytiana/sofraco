const path = require('path');
const ExcelJS = require('exceljs');
const fs = require('fs');


exports.readExcel = async (file, company) => {
    const filePath = file.path;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheets = workbook.worksheets;
    let infos = null;
    switch (company.toUpperCase()) {
        case 'APICIL':
            infos = await readExcelAPICIL(workbook, worksheets);
            break;
        // case 'APREP':
        //     infos = await readExcel(file);
        //     break;
        // case 'AVIVA':
        //     infos = await readExcel(file);
        //     break;
        // case 'AVIVA SURCO':
        //     infos = await readExcel(file);
        //     break;
        // case 'CARDIF':
        //     infos = await readExcel(file);
        //     break;
        // case 'CBP FRANCE':
        //     infos = await readExcel(file);
        //     break;
        // case 'CEGEMA':
        //     infos = await readExcel(file);
        //     break;
        // case 'ERES':
        //     infos = await readExcel(file);
        //     break;
        // case 'GENERALI':
        //     infos = await readExcel(file);
        //     break;
        // case 'HODEVA':
        //     infos = await readExcel(file);
        //     break;
        // case 'METLIFE':
        //     infos = await readExcel(file);
        //     break;
        // case 'SWISSLIFE':
        //     infos = await readExcel(file);
        //     break;
        // case 'SWISSLIFE SURCO':
        //     infos = await readExcel(file);
        //     break;
        default:
            console.log('Pas de compagnie correspondante');
    }
    return infos;


};

const readExcelAPICIL = async (workbook, worksheets) => {
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

