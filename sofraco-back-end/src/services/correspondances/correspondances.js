const { performance } = require('perf_hooks');
const path = require('path');
const companyHandler = require('../../handlers/companyHandler');
const courtierHandler = require('../../handlers/courtierHandler');
const excelFile = require('../utils/excelFile');

exports.readExcelTableauCorrespondance = async (role) => {
    const file = path.join(__dirname, '..', '..', '..', 'documents', `${role}.xlsx`);
    console.log(`${new Date()} DEBUT LECTURE DU TABLEAU DE CORRESPONDANCE`);
    try {
        const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
        const courtiers = await courtierHandler.getCourtiers();
        const allCompanies = await companyHandler.getCompanies();
        let correspondance = [];
        for (let worksheet of worksheets) {
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    const courtierLastNameSheet = row.getCell('A').value;
                    const courtierFirstNameSheet = row.getCell('B').value;
                    const courtierCabinetSheet = row.getCell('C').value;
                    for (let cr of courtiers) {
                        if (courtierCabinetSheet !== null &&
                            (courtierLastNameSheet.toUpperCase().trim() === cr.lastName.toUpperCase() && courtierFirstNameSheet.toUpperCase().trim() === cr.firstName.toUpperCase() && courtierCabinetSheet.toUpperCase().trim() === cr.cabinet.toUpperCase()) ||
                            courtierCabinetSheet === null &&
                            (courtierLastNameSheet.toUpperCase().trim() === cr.lastName.toUpperCase() && courtierFirstNameSheet.toUpperCase().trim() === cr.firstName.toUpperCase())) {
                            const courtier = cr._id;
                            const role_courtier = cr.role;
                            let companies = [];
                            for (let i = 4; i <= 72; i++) {
                                const companyNameSheet = worksheet.getRow(1).getCell(i).value;
                                for (let comp of allCompanies) {
                                    if (comp.type !== 'simple') {
                                        continue;
                                    }
                                    if (companyNameSheet !== null) {
                                        if (companyNameSheet.toUpperCase().match(comp.globalName)) {
                                            setCompanyCode(row, rowNumber, i, companies, companyNameSheet, comp);
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

};

const setCompanyCode = (row, rowNumber, colNumber, companies, companyNameSheet, comp) => {
    try {
        let idCompany;
        let company;
        let companyGlobalName;
        let particular;
        let code;
        const codeCourtier = row.getCell(colNumber).value;
        if (companyNameSheet.toUpperCase() === comp.globalName) {
            if (codeCourtier !== null) {
                idCompany = comp._id;
                company = comp.name;
                companyGlobalName = comp.globalName;
                particular = '';
                code = codeCourtier;
            }
        } else {
            if (companyNameSheet.toUpperCase() !== 'MIEL MUTUELLE') {
                if (codeCourtier !== null) {
                    idCompany = comp._id;
                    company = comp.name;
                    companyGlobalName = comp.globalName;
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
    } catch (err) {
        throw err;
    }
};
