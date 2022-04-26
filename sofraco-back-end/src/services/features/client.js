const path = require('path');
const cabinetHandler = require('../../handlers/cabinetHandler');
const excelFile = require('../utils/excelFile');

exports.readExcelRattachementClient = async (file) => {
    console.log(`${new Date()} DEBUT LECTURE DU TABLEAU DE RATTACHEMENT CLIENT`);
    try {
        const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
        const cabinets = await cabinetHandler.getCabinets();
        let rattachementClient = [];
        worksheets[0].eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                const numeroContrat = row.getCell('A').value;
                const nomClient = row.getCell('B').value;
                const prenomClient = row.getCell('C').value;
                const versementCommissions = row.getCell('D').value;
                const cabinet = row.getCell('E').value;
                for (let cab of cabinets) {
                    if (numeroContrat !== null && cabinet !== null && cabinet.toUpperCase().trim() === cab.cabinet.toUpperCase()) {
                        const client = {
                            numeroContrat,
                            lastName: prenomClient,
                            firstName: nomClient,
                            cabinet: cab._id,
                            cabinetName: cab.cabinet,
                            versementCommissions,
                            is_enabled: true
                        };
                        rattachementClient.push(client);
                    }
                }
            }
        });
        console.log(`${new Date()} FIN LECTURE DU TABLEAU DE RATTACHEMENT CLIENT`);
        return rattachementClient;

    } catch (err) {
        console.log(err);
    }

};

