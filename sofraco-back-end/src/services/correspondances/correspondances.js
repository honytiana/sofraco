const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const time = require('../time/time');
const fileService = require('../document/files');
const axios = require('axios');
const config = require('../../../config.json');

exports.readExcelTableauCorrespondance = async (authorization, role) => {
    const file = path.join(__dirname, '..', '..', '..', 'documents', `${role}.xlsx`);
    console.log('DEBUT LECTURE DU TABLEAU DE CORRESPONDANCE');
    const excecutionStartTime = performance.now();
    let filePath = file;
    const fileName = fileService.getFileNameWithoutExtension(filePath);
    const extension = fileService.getFileExtension(filePath);
    let correspondance = [];
    try {
        if (extension.toUpperCase() === 'XLS') {
            let originalFile = XLSX.readFile(filePath);
            filePath = path.join(__dirname, '..', '..', '..', 'documents', `${fileName}.xlsx`);
            XLSX.writeFile(originalFile, filePath);
        }
        const workbook = new ExcelJS.Workbook();
        const correspondancefile = fs.readFileSync(filePath);
        await workbook.xlsx.load(correspondancefile);
        const worksheets = workbook.worksheets;
        const resultCourtiers = await axios.get(`${config.nodeUrl}/api/courtier`, {
            headers: {
                'Authorization': `${authorization}`
            }
        });
        const courtiers = resultCourtiers.data;
        const resultCompanies = await axios.get(`${config.nodeUrl}/api/company`, {
            headers: {
                'Authorization': `${authorization}`
            }
        });
        const comp = resultCompanies.data;
        let courtier;
        let role_courtier;
        for (let worksheet of worksheets) {
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    for (let cr of courtiers) {
                        if (row.getCell('C').value !== null &&
                            (row.getCell('A').value.trim() === cr.lastName &&
                                row.getCell('B').value.trim() === cr.firstName &&
                                row.getCell('C').value.trim() === cr.cabinet) ||
                            row.getCell('C').value === null &&
                            (row.getCell('A').value.trim() === cr.lastName &&
                                row.getCell('B').value.trim() === cr.firstName)) {
                            courtier = cr._id;
                            role_courtier = cr.role;
                            let companies = [];
                            for (let i = 4; i <= 72; i++) {
                                for (let c of comp) {
                                    if (worksheet.getRow(1).getCell(i).value !== null) {
                                        if (worksheet.getRow(1).getCell(i).value.toUpperCase().match(c.name)) {
                                            let idCompany;
                                            let company;
                                            let particular;
                                            let code;
                                            if (worksheet.getRow(1).getCell(i).value.toUpperCase() === c.name) {
                                                if (row.getCell(i).value !== null) {
                                                    idCompany = c._id;
                                                    company = c.name;
                                                    particular = '';
                                                    code = row.getCell(i).value;
                                                }
                                            } else {
                                                if (row.getCell(i).value !== null) {
                                                    idCompany = c._id;
                                                    company = c.name;
                                                    particular = worksheet.getRow(1).getCell(i).value.trim().replace(/\n/g, ' ');
                                                    code = row.getCell(i).value;
                                                }
                                            }
                                            if (idCompany && code) {
                                                companies.push({
                                                    idCompany,
                                                    company,
                                                    particular,
                                                    code
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                            correspondance.push({
                                courtier,
                                role_courtier,
                                companies
                            });
                        }
                    }
                }
            });
        }
        console.log('FIN LECTURE DU TABLEAU DE CORRESPONDANCE');
        return correspondance;

    } catch (err) {
        console.log(err);
    }

}
