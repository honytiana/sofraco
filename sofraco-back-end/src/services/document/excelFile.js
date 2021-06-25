const path = require('path');
const ExcelJS = require('exceljs');
const fs = require('fs');

const documentAPICIL = require('./documentAPICIL');


exports.readExcel = async (file, company) => {
    const filePath = file.path;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheets = workbook.worksheets;
    let infos = null;
    switch (company.toUpperCase()) {
        case 'APICIL':
            infos = await documentAPICIL.readExcelAPICIL(workbook, worksheets);
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

