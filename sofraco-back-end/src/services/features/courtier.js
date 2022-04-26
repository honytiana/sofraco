const path = require('path');
const excelFile = require('../utils/excelFile');

exports.readExcelCourtiers = async (file) => {
    console.log(`${new Date()} DEBUT LECTURE DU TABLEAU DE COURTIERS`);
    try {
        const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
        let courtiers = [];
        worksheets[0].eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                const lastName = row.getCell('A').value;
                const firstName = row.getCell('B').value;
                const cabinet = row.getCell('C').value;
                const email = row.getCell('D').value !== null && row.getCell('D').value.text ? row.getCell('D').value.text : row.getCell('D').value;
                const emailCopie1 = row.getCell('E').value;
                const emailCopie2 = row.getCell('F').value;
                let emailCopie = [];
                if (emailCopie1 !== null) {
                    const email = emailCopie1.text ? emailCopie1.text.replace(/\s/g, '') : emailCopie1.replace(/\s/g, '');
                    emailCopie.push(email);
                }
                if (emailCopie2 !== null) {
                    const email = emailCopie2.text ? emailCopie2.text.replace(/\s/g, '') : emailCopie2.replace(/\s/g, '');
                    emailCopie.push(email);
                }
                const phone = row.getCell('G').value;
                const status = row.getCell('H').value;
                const role = row.getCell('I').value;
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
        console.log(`${new Date()} FIN LECTURE DU TABLEAU DE COURTIERS`);
        return courtiers;

    } catch (err) {
        console.log(err);
    }

};

