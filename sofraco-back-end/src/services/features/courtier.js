const path = require('path');
const excelFile = require('../utils/excelFile');

exports.readExcelCourtiers = async (name) => {
    const file = path.join(__dirname, '..', '..', '..', 'documents', `${name}.xlsx`);
    console.log(`${new Date()} DEBUT LECTURE DU TABLEAU DE COURTIERS`);
    try {
        const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
        let courtiers = [];
        for (let worksheet of worksheets) {
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    const lastName = row.getCell('A').value;
                    const firstName = row.getCell('B').value;
                    const cabinet = row.getCell('C').value;
                    const email = row.getCell('D').value !== null && row.getCell('D').value.text ? row.getCell('D').value.text : row.getCell('D').value;
                    const emailsCopie = row.getCell('E').value;
                    let emailCopie;
                    if (emailsCopie !== null) {
                        if (emailsCopie.richText && emailsCopie.richText.length > 0) {
                            let emails = [];
                            for (let email of emailsCopie.richText) {
                                if (email.text && (email.text.indexOf(',') < 0 && email.text.indexOf(';') < 0)) {
                                    emails.push(email.text.replace(/\s/g, ''));
                                }
                            }
                            emailCopie = emails;
                        } else {
                            const ec = emailsCopie.text ? emailsCopie.text.replace(/\s/g, '') : emailsCopie.replace(/\s/g, '');
                            emailCopie = (ec.match(',') !== null ? ec.split(',') : ec.split(';'));
                        }
                    } else {
                        emailCopie = [];
                    }
                    const phone = row.getCell('F').value;
                    const status = row.getCell('G').value;
                    const role = row.getCell('H').value;
                    const courtier = {
                        lastName,
                        firstName,
                        cabinet,
                        email,
                        emailCopie,
                        phone,
                        role,
                        is_enabled: true
                    };
                    courtiers.push(courtier);
                }
            });
        }
        console.log(`${new Date()} FIN LECTURE DU TABLEAU DE COURTIERS`);
        return courtiers;

    } catch (err) {
        console.log(err);
    }

};

