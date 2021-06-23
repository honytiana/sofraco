const path = require('path');
const axios = require('axios');
const ExcelJS = require('exceljs');

const config = require('../../../config.json');


exports.create = async () => {
    const ocrInfos = await getOCRInfos();
    await generateExcelMaster(ocrInfos);
};

const getOCRInfos = async () => {
    const res = await axios.get(`${config.nodeUrl}/api/document`);
    const documents = res.data
    let infos = [];
    for (let document of documents) {
        const company = document.companyName;
        const ocr = document.ocr;
        switch (company.toUpperCase()) {
            case 'APICIL':
                infos.push(getOCRAPICIL(ocr));
                break;
            // case 'APREP':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'AVIVA':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'AVIVA SURCO':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'CARDIF':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'CBP FRANCE':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'CEGEMA':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'ERES':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'GENERALI':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'HODEVA':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'METLIFE':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'SWISSLIFE':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'SWISSLIFE SURCO':
            //     infos = await getOCRAPICIL(file);
            //     break;
            default:
                console.log('Pas de compagnie correspondante');
        }
    }
    return infos;

}

const getOCRAPICIL = (ocr) => {
    const headers = ocr.headers;
    const collectives = ocr.collective;
    const individuals = ocr.individual;
    let codesCourtiers = [];
    let infosOCR = [];   // regroupement par courtiers;

    for (let collective of collectives) {
        if (codesCourtiers.indexOf(collective.prescRemu) < 0) {
            codesCourtiers.push(collective.prescRemu);
        }
    }
    for (let individual of individuals) {
        if (codesCourtiers.indexOf(individual.prescRemu) < 0) {
            codesCourtiers.push(individual.prescRemu);
        }
    }

    for (let code of codesCourtiers) {
        let dataCourtierOCR = { code, headers, datas: [] };
        for (let collective of collectives) {

            if (collective.prescRemu === code && !collective.mtEcheance.match(/^-.+/)) {
                let data = {
                    contrat: 'collective',
                    contratJuridique: collective.contratJuridique,
                    no_Adherent: collective.no_Adherent,
                    intitule: collective.intitule,
                    produit: collective.produit,
                    nombre: collective.nombre,
                    exer: collective.exer,
                    mtCotisation: collective.mtCotisation,
                    taux: collective.taux,
                    mtEcheance: collective.mtEcheance,
                    debContr: collective.debContr,
                    finContr: collective.finContr,
                    prescRemu: collective.prescRemu,
                    nomPrescRemu: collective.nomPrescRemu,
                    prenomPrescRemu: collective.prenomPrescRemu,
                    periode: collective.periode
                };
                dataCourtierOCR.datas.push(data);
            }
            if (collective.prescRemu === code && collective.mtEcheance.match(/^-.+/)) {
                let data = {
                    contrat: 'reprise',
                    contratJuridique: collective.contratJuridique,
                    no_Adherent: collective.no_Adherent,
                    intitule: collective.intitule,
                    produit: collective.produit,
                    nombre: collective.nombre,
                    exer: collective.exer,
                    mtCotisation: collective.mtCotisation,
                    taux: collective.taux,
                    mtEcheance: collective.mtEcheance,
                    debContr: collective.debContr,
                    finContr: collective.finContr,
                    prescRemu: collective.prescRemu,
                    nomPrescRemu: collective.nomPrescRemu,
                    prenomPrescRemu: collective.prenomPrescRemu,
                    periode: collective.periode
                };
                dataCourtierOCR.datas.push(data);
            }
        }
        for (let individual of individuals) {
            if (individual.prescRemu === code && !individual.mtEcheance.match(/^-.+/)) {
                let data = {
                    contrat: 'individual',
                    contratJuridique: individual.contratJuridique,
                    no_Adherent: individual.no_Adherent,
                    intitule: individual.intitule,
                    produit: individual.produit,
                    nombre: individual.nombre,
                    exer: individual.exer,
                    mtCotisation: individual.mtCotisation,
                    taux: individual.taux,
                    mtEcheance: individual.mtEcheance,
                    debContr: individual.debContr,
                    finContr: individual.finContr,
                    prescRemu: individual.prescRemu,
                    nomPrescRemu: individual.nomPrescRemu,
                    prenomPrescRemu: individual.prenomPrescRemu,
                    periode: individual.periode
                };
                dataCourtierOCR.datas.push(data);
            }

            if (individual.prescRemu === code && individual.mtEcheance.match(/^-.+/)) {
                let data = {
                    contrat: 'reprise',
                    contratJuridique: individual.contratJuridique,
                    no_Adherent: individual.no_Adherent,
                    intitule: individual.intitule,
                    produit: individual.produit,
                    nombre: individual.nombre,
                    exer: individual.exer,
                    mtCotisation: individual.mtCotisation,
                    taux: individual.taux,
                    mtEcheance: individual.mtEcheance,
                    debContr: individual.debContr,
                    finContr: individual.finContr,
                    prescRemu: individual.prescRemu,
                    nomPrescRemu: individual.nomPrescRemu,
                    prenomPrescRemu: individual.prenomPrescRemu,
                    periode: individual.periode
                };
                dataCourtierOCR.datas.push(data);
            }
        }
        infosOCR.push(dataCourtierOCR);
    }
    const result = { company: 'APICIL', infosOCR };
    return result;

}

const getCompanyNames = async () => {
    const res = await axios.get(`${config.nodeUrl}/api/company`);
    const companies = res.data;
    let names = [];
    for (let company of companies) {
        names.push(company.name);
    }
    return names;
}

const generateExcelMaster = async (ocrInfos) => {
    // Workbook
    for (let ocr of ocrInfos) {
        let num = 1;
        for (let element of ocr.infosOCR) {
            // Worksheet
            const workbook = new ExcelJS.Workbook();
            workbook.addWorksheet('RECAP');
            const workSheet = workbook.addWorksheet(ocr.company);
            workSheet.properties.defaultColWidth = 20;

            const row1 = workSheet.getRow(1);
            row1.getCell('B').value = 'RELEVE';
            row1.getCell('C').value = 'PRESCRIPTEUR';
            row1.getCell('E').value = 'CODE STE';

            const row2 = workSheet.getRow(2);
            row2.getCell('B').value = element.headers.releve;
            row2.getCell('C').value = element.headers.prescripteur;
            row2.getCell('E').value = element.headers.codeSte;

            const row3 = workSheet.getRow(3);
            row3.getCell('B').value = 'ECHEANCE';
            row3.getCell('C').value = new Date(element.headers.echeance);
            row3.getCell('C').numFmt = 'mmm-yy';

            const row4 = workSheet.getRow(4);
            row4.getCell('A').value = 'CONTRAT JURIDIQUE';
            row4.getCell('B').value = 'NO-ADHERENT';
            row4.getCell('C').value = 'INTITULE';
            row4.getCell('D').value = 'PRODUIT';
            row4.getCell('E').value = '';
            row4.getCell('F').value = 'EXER';
            row4.getCell('G').value = 'MT COTISATIONS';
            row4.getCell('H').value = 'TAUX';
            row4.getCell('I').value = 'MT ECHEANCE';
            row4.getCell('J').value = 'DEB CONTR.';
            row4.getCell('K').value = 'FIN CONTR.';
            row4.getCell('L').value = 'PRESC REMU';
            row4.getCell('M').value = 'NOM PRESC REMU';
            row4.getCell('N').value = 'PRENOM PRECR REMU';
            row4.getCell('O').value = 'PERIODE';

            let dataTri = { reprise: [], collective: [], individual: [] };
            element.datas.forEach((e, index) => {
                if (e.contrat === 'reprise') {
                    dataTri.reprise.push(e);
                }
            });
            element.datas.forEach((e, index) => {
                if (e.contrat === 'collective') {
                    dataTri.collective.push(e);
                }
            });
            element.datas.forEach((e, index) => {
                if (e.contrat === 'individual') {
                    dataTri.individual.push(e);
                }
            });

            let debut = 5;
            let rowNumber = 5;
            for (let data of dataTri.reprise) {
                workSheet.getRow(rowNumber).getCell('A').value = data.contratJuridique;
                workSheet.getRow(rowNumber).getCell('B').value = data.no_Adherent;
                workSheet.getRow(rowNumber).getCell('C').value = data.intitule;
                workSheet.getRow(rowNumber).getCell('D').value = data.produit;
                workSheet.getRow(rowNumber).getCell('E').value = data.nombre;
                workSheet.getRow(rowNumber).getCell('F').value = data.exer;
                workSheet.getRow(rowNumber).getCell('G').value = parseFloat(data.mtCotisation);
                workSheet.getRow(rowNumber).getCell('G').numFmt = '####,##0.00"€";\-####,##0.00"€"';
                workSheet.getRow(rowNumber).getCell('H').value = data.taux;
                workSheet.getRow(rowNumber).getCell('I').value = parseFloat(data.mtEcheance);
                workSheet.getRow(rowNumber).getCell('I').numFmt = '####,##0.00"€";\-####,##0.00"€"';
                workSheet.getRow(rowNumber).getCell('J').value = (data.debContr) ? new Date(data.debContr) : '';
                workSheet.getRow(rowNumber).getCell('J').numFmt = 'dd/mm/yyyy';
                workSheet.getRow(rowNumber).getCell('K').value = (data.finContr) ? new Date(data.finContr): '';
                workSheet.getRow(rowNumber).getCell('K').numFmt = 'dd/mm/yyyy';
                workSheet.getRow(rowNumber).getCell('L').value = data.prescRemu;
                workSheet.getRow(rowNumber).getCell('M').value = data.nomPrescRemu;
                workSheet.getRow(rowNumber).getCell('N').value = data.prenomPrescRemu;
                workSheet.getRow(rowNumber).getCell('O').value = data.periode;
                rowNumber++;
            }
            workSheet.getRow(rowNumber).getCell('H').value = 'TOTAL';
            if (workSheet.getRow(rowNumber - 1).getCell('I').value !== '' ||
                workSheet.getRow(rowNumber - 1).getCell('I').value !== 'MT ECHEANCE') {
                workSheet.getRow(rowNumber).getCell('I').value = { formula: `SUM(I${debut}:I${rowNumber - 1})` };
            } else {
                workSheet.getRow(rowNumber).getCell('I').value = 0;
            }
            workSheet.getRow(rowNumber).getCell('I').numFmt = '###,##0.00"€";\-###,##0.00"€"';
            const totalRepriseRowNumber = rowNumber;
            rowNumber++;
            rowNumber++;

            debut = rowNumber;
            for (let data of dataTri.collective) {
                workSheet.getRow(rowNumber).getCell('A').value = data.contratJuridique;
                workSheet.getRow(rowNumber).getCell('B').value = data.no_Adherent;
                workSheet.getRow(rowNumber).getCell('C').value = data.intitule;
                workSheet.getRow(rowNumber).getCell('D').value = data.produit;
                workSheet.getRow(rowNumber).getCell('E').value = data.nombre;
                workSheet.getRow(rowNumber).getCell('F').value = data.exer;
                workSheet.getRow(rowNumber).getCell('G').value = parseFloat(data.mtCotisation);
                workSheet.getRow(rowNumber).getCell('G').numFmt = '####,##0.00"€";\-####,##0.00"€"';
                workSheet.getRow(rowNumber).getCell('H').value = data.taux;
                workSheet.getRow(rowNumber).getCell('I').value = parseFloat(data.mtEcheance);
                workSheet.getRow(rowNumber).getCell('I').numFmt = '####,##0.00"€";\-####,##0.00"€"';
                workSheet.getRow(rowNumber).getCell('J').value = (data.debContr) ? new Date(data.debContr) : '';
                workSheet.getRow(rowNumber).getCell('J').numFmt = 'dd/mm/yyyy';
                workSheet.getRow(rowNumber).getCell('K').value = (data.finContr) ? new Date(data.finContr): '';
                workSheet.getRow(rowNumber).getCell('K').numFmt = 'dd/mm/yyyy';
                workSheet.getRow(rowNumber).getCell('L').value = data.prescRemu;
                workSheet.getRow(rowNumber).getCell('M').value = data.nomPrescRemu;
                workSheet.getRow(rowNumber).getCell('N').value = data.prenomPrescRemu;
                workSheet.getRow(rowNumber).getCell('O').value = data.periode;
                rowNumber++;
            }

            workSheet.getRow(rowNumber).getCell('H').value = 'TOTAL';
            if (workSheet.getRow(rowNumber - 1).getCell('I').value !== '') {
                workSheet.getRow(rowNumber).getCell('I').value = { formula: `SUM(I${debut}:I${rowNumber - 1})` };
            } else {
                workSheet.getRow(rowNumber).getCell('I').value = 0;
            }
            workSheet.getRow(rowNumber).getCell('I').numFmt = '####,##0.00"€";\-####,##0.00"€"';
            const totalCollectiveRowNumber = rowNumber;
            rowNumber++;
            rowNumber++;

            debut = rowNumber;
            for (let data of dataTri.individual) {
                workSheet.getRow(rowNumber).getCell('A').value = data.contratJuridique;
                workSheet.getRow(rowNumber).getCell('B').value = data.no_Adherent;
                workSheet.getRow(rowNumber).getCell('C').value = data.intitule;
                workSheet.getRow(rowNumber).getCell('D').value = data.produit;
                workSheet.getRow(rowNumber).getCell('E').value = data.nombre;
                workSheet.getRow(rowNumber).getCell('F').value = data.exer;
                workSheet.getRow(rowNumber).getCell('G').value = parseFloat(data.mtCotisation);
                workSheet.getRow(rowNumber).getCell('G').numFmt = '####,##0.00"€";\-####,##0.00"€"';
                workSheet.getRow(rowNumber).getCell('H').value = data.taux;
                workSheet.getRow(rowNumber).getCell('I').value = parseFloat(data.mtEcheance);
                workSheet.getRow(rowNumber).getCell('I').numFmt = '####,##0.00"€";\-####,##0.00"€"';
                workSheet.getRow(rowNumber).getCell('J').value = (data.debContr) ? new Date(data.debContr) : '';
                workSheet.getRow(rowNumber).getCell('J').numFmt = 'dd/mm/yyyy';
                workSheet.getRow(rowNumber).getCell('K').value = (data.finContr) ? new Date(data.finContr): '';
                workSheet.getRow(rowNumber).getCell('K').numFmt = 'dd/mm/yyyy';
                workSheet.getRow(rowNumber).getCell('L').value = data.prescRemu;
                workSheet.getRow(rowNumber).getCell('M').value = data.nomPrescRemu;
                workSheet.getRow(rowNumber).getCell('N').value = data.prenomPrescRemu;
                workSheet.getRow(rowNumber).getCell('O').value = data.periode;
                rowNumber++;
            }

            workSheet.getRow(rowNumber).getCell('H').value = 'TOTAL';
            if (workSheet.getRow(rowNumber - 1).getCell('I').value !== '') {
                workSheet.getRow(rowNumber).getCell('I').value = { formula: `SUM(I${debut}:I${rowNumber - 1})` };
            } else {
                workSheet.getRow(rowNumber).getCell('I').value = 0;
            }
            workSheet.getRow(rowNumber).getCell('I').numFmt = '####,##0.00"€";\-####,##0.00"€"';
            const totalIndividualRowNumber = rowNumber;
            rowNumber++;
            rowNumber++;


            workSheet.getRow(rowNumber).getCell('H').value = 'TOTAL';
            workSheet.getRow(rowNumber).getCell('I').value = { formula: `I${totalRepriseRowNumber}+I${totalCollectiveRowNumber}+I${totalIndividualRowNumber}` };
            workSheet.getRow(rowNumber).getCell('I').numFmt = '####,##0.00"€";\-####,##0.00"€"';

            await workbook.xlsx.writeFile(path.join(__dirname, '..', '..', '..', 'documents', 'masterExcel', `excelMaster_${element.code}.xlsx`));
            num++;
        }
    }
    console.log('DONE');
}
