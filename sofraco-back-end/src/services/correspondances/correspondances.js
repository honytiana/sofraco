const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const time = require('../utils/time');
const fileService = require('../utils/files');
const config = require('../../../config.json');
const companyHandler = require('../../handlers/companyHandler');
const courtierHandler = require('../../handlers/courtierHandler');

exports.readExcelTableauCorrespondance = async (role) => {
    const file = path.join(__dirname, '..', '..', '..', 'documents', `${role}.xlsx`);
    console.log(`${new Date()} DEBUT LECTURE DU TABLEAU DE CORRESPONDANCE`);
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
        const courtiers = await courtierHandler.getCourtiers();
        const comp = await companyHandler.getCompanies();
        let courtier;
        let role_courtier;
        for (let worksheet of worksheets) {
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    for (let cr of courtiers) {
                        const courtierLastNameSheet = row.getCell('A').value;
                        const courtierFirstNameSheet = row.getCell('B').value;
                        const courtierCabinetSheet = row.getCell('C').value;
                        if (courtierCabinetSheet !== null &&
                            (courtierLastNameSheet.trim() === cr.lastName &&
                                courtierFirstNameSheet.trim() === cr.firstName &&
                                courtierCabinetSheet.trim() === cr.cabinet) ||
                            courtierCabinetSheet === null &&
                            (courtierLastNameSheet.trim() === cr.lastName &&
                                courtierFirstNameSheet.trim() === cr.firstName)) {
                            courtier = cr._id;
                            role_courtier = cr.role;
                            let companies = [];
                            for (let i = 4; i <= 72; i++) {
                                for (let c of comp) {
                                    const companyNameSheet = worksheet.getRow(1).getCell(i).value;
                                    if (c.type !== 'simple') {
                                        continue;
                                    }
                                    if (companyNameSheet !== null) {
                                        if (companyNameSheet.toUpperCase().match(c.globalName)) {
                                            let idCompany;
                                            let company;
                                            let companyGlobalName;
                                            let particular;
                                            let code;
                                            const codeCourtier = row.getCell(i).value;
                                            if (companyNameSheet.toUpperCase() === c.globalName) {
                                                if (codeCourtier !== null) {
                                                    idCompany = c._id;
                                                    company = c.name;
                                                    companyGlobalName = c.globalName;
                                                    particular = '';
                                                    code = codeCourtier;
                                                }
                                            } else {
                                                if (companyNameSheet.toUpperCase() !== 'MIEL MUTUELLE') {
                                                    if (codeCourtier !== null) {
                                                        idCompany = c._id;
                                                        company = c.name;
                                                        companyGlobalName = c.globalName;
                                                        particular = companyNameSheet.trim().replace(/\n/g, ' ');
                                                        code = codeCourtier;
                                                    }
                                                }
                                            }
                                            if (idCompany && code) {
                                                companies.push({
                                                    idCompany,
                                                    companyGlobalName,
                                                    company,
                                                    particular,
                                                    code,
                                                    is_enabled: true
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                            correspondance.push({
                                courtier,
                                role_courtier,
                                companies,
                                is_enabled: true
                            });
                        }
                    }
                }
            });
        }
        console.log(`${new Date()} FIN LECTURE DU TABLEAU DE CORRESPONDANCE`);
        return correspondance;

    } catch (err) {
        console.log(err);
    }

}
