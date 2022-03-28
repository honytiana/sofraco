const excelFile = require('../utils/excelFile');

exports.getOCRPAVILLON = (ocr) => { };

exports.createWorkSheetPAVILLON = (workSheet, dataCourtierOCR, reste = false, rowNumberI = null) => { };

exports.getOCRPAVILLONMCMS = (ocr) => {
    const headers = ocr.headers;
    let infosOCR = [];
    ocr.allContratsPerCourtier.forEach((contrat, index) => {
        if (contrat.courtier) {
            const dataCourtierOCR = {
                code: {
                    cabinet: contrat.courtier,
                    code: contrat.courtier,
                },
                headers,
                datas: contrat.contrats,
                pavVersion: ocr.pavVersion
            };
            infosOCR.push({ companyGlobalName: 'PAVILLON PREVOYANCE', companyName: `PAVILLON MCMS`, infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetPAVILLONMCMS = (workSheet, dataCourtierOCR, reste = false, rowNumberI = null) => {
    let rowNumber = !reste ? 1 : rowNumberI;
    const font1 = { bold: true, name: 'Arial', size: 10 };
    let pavActio, pavV1, pavV2, pavV3, pavV4, pavV5, pavV6, pavV7, pavV8 = false;
    switch (dataCourtierOCR.infosOCR.pavVersion) {
        case 'pavActio':
            pavActio = true;
            break;
        case 'pavV1':
            pavV1 = true;
            break;
        case 'pavV2':
            pavV2 = true;
            break;
        case 'pavV3':
            pavV3 = true;
            break;
        case 'pavV4':
            pavV4 = true;
            break;
        case 'pavV5':
            pavV5 = true;
            break;
        case 'pavV6':
            pavV6 = true;
            break;
        case 'pavV7':
            pavV7 = true;
            break;
        case 'pavV8':
            pavV8 = true;
            break;
    }
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        excelFile.setSimpleCell(workSheet, rowNumber, cellNumber, header, font1);
        cellNumber++;
    });
    rowNumber++;

    let debut = rowNumber;
    if (pavActio) {
        rowNumber = createPavetPAVILLONACTIO(dataCourtierOCR, workSheet, rowNumber);
    }
    if (pavV1) {
        rowNumber = createPavetPAVILLONV1(dataCourtierOCR, workSheet, rowNumber);
    }
    if (pavV2) {
        rowNumber = createPavetPAVILLONV2(dataCourtierOCR, workSheet, rowNumber);
    }
    if (pavV3) {
        rowNumber = createPavetPAVILLONV3(dataCourtierOCR, workSheet, rowNumber);
    }
    if (pavV4) {
        rowNumber = createPavetPAVILLONV4(dataCourtierOCR, workSheet, rowNumber);
    }
    if (pavV5) {
        rowNumber = createPavetPAVILLONV5(dataCourtierOCR, workSheet, rowNumber);
    }
    if (pavV6) {
        rowNumber = createPavetPAVILLONV6(dataCourtierOCR, workSheet, rowNumber);
    }
    if (pavV7) {
        rowNumber = createPavetPAVILLONV7(dataCourtierOCR, workSheet, rowNumber);
    }
    if (pavV8) {
        rowNumber = createPavetPAVILLONV8(dataCourtierOCR, workSheet, rowNumber);
    }
    rowNumber++;

    excelFile.setSimpleCell(workSheet, rowNumber, 'R', 'TOTAL', font1);
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('S').value;
    }
    const value =  {
        formula: `SUM(S${debut}:S${rowNumber - 2})`,
        result: result
    };
    excelFile.setStylizedCell(workSheet, rowNumber, 'S', value, false, {}, font1, '#,##0.00"€";\-#,##0.00"€"');
    if (reste) {
        return rowNumber;
    }
}

const createPavetPAVILLONACTIO = (dataCourtierOCR, workSheet, rowNumber) => {
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.dateGeneration ? new Date(datas.dateDebutEcheance) : '';
        workSheet.getRow(rowNumber).getCell('A').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('B').value = datas.codeCompagnie;
        workSheet.getRow(rowNumber).getCell('C').value = datas.codeCourtier;
        workSheet.getRow(rowNumber).getCell('D').value = datas.raisonSocialeApporteur;
        workSheet.getRow(rowNumber).getCell('E').value = datas.dateArrete ? new Date(datas.dateArrete) : '';
        workSheet.getRow(rowNumber).getCell('E').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('F').value = datas.identifiant;
        workSheet.getRow(rowNumber).getCell('G').value = datas.codePostal;
        workSheet.getRow(rowNumber).getCell('H').value = datas.commune;
        workSheet.getRow(rowNumber).getCell('I').value = datas.dateEffetContrat ? new Date(datas.dateEffetContrat) : '';
        workSheet.getRow(rowNumber).getCell('I').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('J').value = datas.debutPeriode ? new Date(datas.debutPeriode) : '';
        workSheet.getRow(rowNumber).getCell('J').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('K').value = datas.finPeriode ? new Date(datas.finPeriode) : '';
        workSheet.getRow(rowNumber).getCell('K').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('L').value = datas.raisonSociale;
        workSheet.getRow(rowNumber).getCell('M').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('N').value = datas.nomProduit;
        workSheet.getRow(rowNumber).getCell('O').value = datas.emissionTTC;
        workSheet.getRow(rowNumber).getCell('O').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('P').value = datas.reglementTTC;
        workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Q').value = datas.reglementHT;
        workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('R').value = datas.taux;
        workSheet.getRow(rowNumber).getCell('S').value = datas.montantPaiement;
        workSheet.getRow(rowNumber).getCell('S').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('T').value = datas.courtier;
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('U').value = datas.fondateur;
        workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        rowNumber++;
    }
    return rowNumber;
};

const createPavetPAVILLONV1 = (dataCourtierOCR, workSheet, rowNumber) => {
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.dateGeneration ? new Date(datas.dateDebutEcheance) : '';
        workSheet.getRow(rowNumber).getCell('A').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('B').value = datas.codeCompagnie;
        workSheet.getRow(rowNumber).getCell('C').value = datas.codeCourtier;
        workSheet.getRow(rowNumber).getCell('D').value = datas.raisonSocialeApporteur;
        workSheet.getRow(rowNumber).getCell('E').value = datas.dateArrete ? new Date(datas.dateArrete) : '';
        workSheet.getRow(rowNumber).getCell('E').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('F').value = datas.identifiant;
        workSheet.getRow(rowNumber).getCell('G').value = datas.codePostal;
        workSheet.getRow(rowNumber).getCell('H').value = datas.commune;
        workSheet.getRow(rowNumber).getCell('I').value = datas.dateEffetContrat ? new Date(datas.dateEffetContrat) : '';
        workSheet.getRow(rowNumber).getCell('I').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('J').value = datas.debutPeriode ? new Date(datas.debutPeriode) : '';
        workSheet.getRow(rowNumber).getCell('J').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('K').value = datas.finPeriode ? new Date(datas.finPeriode) : '';
        workSheet.getRow(rowNumber).getCell('K').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('L').value = datas.raisonSociale;
        workSheet.getRow(rowNumber).getCell('M').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('N').value = datas.nomProduit;
        workSheet.getRow(rowNumber).getCell('O').value = datas.emissionTTC;
        workSheet.getRow(rowNumber).getCell('O').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('P').value = datas.reglementTTC;
        workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Q').value = datas.reglementHT;
        workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('R').value = datas.taux;
        workSheet.getRow(rowNumber).getCell('S').value = datas.montantPaiement;
        workSheet.getRow(rowNumber).getCell('S').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('T').value = datas.courtier;
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('U').value = datas.fondateur;
        workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        rowNumber++;
    }
    return rowNumber;

};

const createPavetPAVILLONV2 = (dataCourtierOCR, workSheet, rowNumber) => {
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.dateGeneration ? new Date(datas.dateDebutEcheance) : '';
        workSheet.getRow(rowNumber).getCell('A').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('B').value = datas.codeCompagnie;
        workSheet.getRow(rowNumber).getCell('C').value = datas.codeCourtier;
        workSheet.getRow(rowNumber).getCell('D').value = datas.raisonSocialeApporteur;
        workSheet.getRow(rowNumber).getCell('E').value = datas.dateArrete ? new Date(datas.dateArrete) : '';
        workSheet.getRow(rowNumber).getCell('E').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('F').value = datas.identifiant;
        workSheet.getRow(rowNumber).getCell('G').value = datas.codePostal;
        workSheet.getRow(rowNumber).getCell('H').value = datas.commune;
        workSheet.getRow(rowNumber).getCell('I').value = datas.dateEffetContrat ? new Date(datas.dateEffetContrat) : '';
        workSheet.getRow(rowNumber).getCell('I').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('J').value = datas.debutPeriode ? new Date(datas.debutPeriode) : '';
        workSheet.getRow(rowNumber).getCell('J').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('K').value = datas.finPeriode ? new Date(datas.finPeriode) : '';
        workSheet.getRow(rowNumber).getCell('K').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('L').value = datas.raisonSociale;
        workSheet.getRow(rowNumber).getCell('M').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('N').value = datas.nomProduit;
        workSheet.getRow(rowNumber).getCell('O').value = datas.emissionTTC;
        workSheet.getRow(rowNumber).getCell('O').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('P').value = datas.reglementTTC;
        workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Q').value = datas.reglementHT;
        workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('R').value = datas.taux;
        workSheet.getRow(rowNumber).getCell('S').value = datas.montantPaiement;
        workSheet.getRow(rowNumber).getCell('S').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('T').value = datas.courtier;
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('U').value = datas.fondateur;
        workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('V').value = datas.sogeas;
        workSheet.getRow(rowNumber).getCell('V').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('W').value = datas.procedure;
        workSheet.getRow(rowNumber).getCell('W').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        rowNumber++;
    }
    return rowNumber;

};

const createPavetPAVILLONV3 = (dataCourtierOCR, workSheet, rowNumber) => {
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.dateGeneration ? new Date(datas.dateDebutEcheance) : '';
        workSheet.getRow(rowNumber).getCell('A').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('B').value = datas.codeCompagnie;
        workSheet.getRow(rowNumber).getCell('C').value = datas.codeCourtier;
        workSheet.getRow(rowNumber).getCell('D').value = datas.raisonSocialeApporteur;
        workSheet.getRow(rowNumber).getCell('E').value = datas.dateArrete ? new Date(datas.dateArrete) : '';
        workSheet.getRow(rowNumber).getCell('E').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('F').value = datas.identifiant;
        workSheet.getRow(rowNumber).getCell('G').value = datas.codePostal;
        workSheet.getRow(rowNumber).getCell('H').value = datas.commune;
        workSheet.getRow(rowNumber).getCell('I').value = datas.dateEffetContrat ? new Date(datas.dateEffetContrat) : '';
        workSheet.getRow(rowNumber).getCell('I').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('J').value = datas.debutPeriode ? new Date(datas.debutPeriode) : '';
        workSheet.getRow(rowNumber).getCell('J').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('K').value = datas.finPeriode ? new Date(datas.finPeriode) : '';
        workSheet.getRow(rowNumber).getCell('K').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('L').value = datas.raisonSociale;
        workSheet.getRow(rowNumber).getCell('M').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('N').value = datas.nomProduit;
        workSheet.getRow(rowNumber).getCell('O').value = datas.emissionTTC;
        workSheet.getRow(rowNumber).getCell('O').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('P').value = datas.reglementTTC;
        workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Q').value = datas.reglementHT;
        workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('R').value = datas.taux;
        workSheet.getRow(rowNumber).getCell('S').value = datas.montantPaiement;
        workSheet.getRow(rowNumber).getCell('S').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('T').value = datas.courtier;
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('U').value = datas.fondateur;
        workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        rowNumber++;
    }
    return rowNumber;

};

const createPavetPAVILLONV4 = (dataCourtierOCR, workSheet, rowNumber) => {
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.dateGeneration ? new Date(datas.dateDebutEcheance) : '';
        workSheet.getRow(rowNumber).getCell('A').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('B').value = datas.codeCompagnie;
        workSheet.getRow(rowNumber).getCell('C').value = datas.codeCourtier;
        workSheet.getRow(rowNumber).getCell('D').value = datas.raisonSocialeApporteur;
        workSheet.getRow(rowNumber).getCell('E').value = datas.dateArrete ? new Date(datas.dateArrete) : '';
        workSheet.getRow(rowNumber).getCell('E').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('F').value = datas.identifiant;
        workSheet.getRow(rowNumber).getCell('G').value = datas.codePostal;
        workSheet.getRow(rowNumber).getCell('H').value = datas.commune;
        workSheet.getRow(rowNumber).getCell('I').value = datas.dateEffetContrat ? new Date(datas.dateEffetContrat) : '';
        workSheet.getRow(rowNumber).getCell('I').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('J').value = datas.debutPeriode ? new Date(datas.debutPeriode) : '';
        workSheet.getRow(rowNumber).getCell('J').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('K').value = datas.finPeriode ? new Date(datas.finPeriode) : '';
        workSheet.getRow(rowNumber).getCell('K').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('L').value = datas.raisonSociale;
        workSheet.getRow(rowNumber).getCell('M').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('N').value = datas.nomProduit;
        workSheet.getRow(rowNumber).getCell('O').value = datas.emissionTTC;
        workSheet.getRow(rowNumber).getCell('O').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('P').value = datas.reglementTTC;
        workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Q').value = datas.reglementHT;
        workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('R').value = datas.taux;
        workSheet.getRow(rowNumber).getCell('S').value = datas.montantPaiement;
        workSheet.getRow(rowNumber).getCell('S').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('T').value = datas.courtier;
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('U').value = datas.fondateur;
        workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('V').value = datas.pavillon;
        workSheet.getRow(rowNumber).getCell('V').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('W').value = datas.sofraco;
        workSheet.getRow(rowNumber).getCell('W').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('X').value = datas.sofracoExpertise;
        workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Y').value = datas.budget;
        workSheet.getRow(rowNumber).getCell('Y').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        rowNumber++;
    }
    return rowNumber;

};

const createPavetPAVILLONV5 = (dataCourtierOCR, workSheet, rowNumber) => {
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.dateGeneration ? new Date(datas.dateDebutEcheance) : '';
        workSheet.getRow(rowNumber).getCell('A').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('B').value = datas.codeCompagnie;
        workSheet.getRow(rowNumber).getCell('C').value = datas.codeCourtier;
        workSheet.getRow(rowNumber).getCell('D').value = datas.raisonSocialeApporteur;
        workSheet.getRow(rowNumber).getCell('E').value = datas.dateArrete ? new Date(datas.dateArrete) : '';
        workSheet.getRow(rowNumber).getCell('E').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('F').value = datas.identifiant;
        workSheet.getRow(rowNumber).getCell('G').value = datas.codePostal;
        workSheet.getRow(rowNumber).getCell('H').value = datas.commune;
        workSheet.getRow(rowNumber).getCell('I').value = datas.dateEffetContrat ? new Date(datas.dateEffetContrat) : '';
        workSheet.getRow(rowNumber).getCell('I').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('J').value = datas.debutPeriode ? new Date(datas.debutPeriode) : '';
        workSheet.getRow(rowNumber).getCell('J').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('K').value = datas.finPeriode ? new Date(datas.finPeriode) : '';
        workSheet.getRow(rowNumber).getCell('K').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('L').value = datas.raisonSociale;
        workSheet.getRow(rowNumber).getCell('M').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('N').value = datas.nomProduit;
        workSheet.getRow(rowNumber).getCell('O').value = datas.emissionTTC;
        workSheet.getRow(rowNumber).getCell('O').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('P').value = datas.reglementTTC;
        workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Q').value = datas.reglementHT;
        workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('R').value = datas.taux;
        workSheet.getRow(rowNumber).getCell('S').value = datas.montantPaiement;
        workSheet.getRow(rowNumber).getCell('S').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('T').value = datas.courtier;
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('U').value = datas.fondateur;
        workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('V').value = datas.pavillon;
        workSheet.getRow(rowNumber).getCell('V').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('W').value = datas.sofraco;
        workSheet.getRow(rowNumber).getCell('W').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('X').value = datas.sofracoExpertise;
        workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        rowNumber++;
    }
    return rowNumber;

};

const createPavetPAVILLONV6 = (dataCourtierOCR, workSheet, rowNumber) => {
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.dateGeneration ? new Date(datas.dateDebutEcheance) : '';
        workSheet.getRow(rowNumber).getCell('A').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('B').value = datas.codeCompagnie;
        workSheet.getRow(rowNumber).getCell('C').value = datas.codeCourtier;
        workSheet.getRow(rowNumber).getCell('D').value = datas.raisonSocialeApporteur;
        workSheet.getRow(rowNumber).getCell('E').value = datas.dateArrete ? new Date(datas.dateArrete) : '';
        workSheet.getRow(rowNumber).getCell('E').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('F').value = datas.identifiant;
        workSheet.getRow(rowNumber).getCell('G').value = datas.codePostal;
        workSheet.getRow(rowNumber).getCell('H').value = datas.commune;
        workSheet.getRow(rowNumber).getCell('I').value = datas.dateEffetContrat ? new Date(datas.dateEffetContrat) : '';
        workSheet.getRow(rowNumber).getCell('I').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('J').value = datas.debutPeriode ? new Date(datas.debutPeriode) : '';
        workSheet.getRow(rowNumber).getCell('J').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('K').value = datas.finPeriode ? new Date(datas.finPeriode) : '';
        workSheet.getRow(rowNumber).getCell('K').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('L').value = datas.raisonSociale;
        workSheet.getRow(rowNumber).getCell('M').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('N').value = datas.nomProduit;
        workSheet.getRow(rowNumber).getCell('O').value = datas.emissionTTC;
        workSheet.getRow(rowNumber).getCell('O').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('P').value = datas.reglementTTC;
        workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Q').value = datas.reglementHT;
        workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('R').value = datas.taux;
        workSheet.getRow(rowNumber).getCell('S').value = datas.montantPaiement;
        workSheet.getRow(rowNumber).getCell('S').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('T').value = datas.courtier;
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('U').value = datas.fondateur;
        workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('V').value = datas.sofracoExpertise;
        workSheet.getRow(rowNumber).getCell('V').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        rowNumber++;
    }
    return rowNumber;

};

const createPavetPAVILLONV7 = (dataCourtierOCR, workSheet, rowNumber) => {
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.dateGeneration ? new Date(datas.dateDebutEcheance) : '';
        workSheet.getRow(rowNumber).getCell('A').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('B').value = datas.codeCompagnie;
        workSheet.getRow(rowNumber).getCell('C').value = datas.codeCourtier;
        workSheet.getRow(rowNumber).getCell('D').value = datas.raisonSocialeApporteur;
        workSheet.getRow(rowNumber).getCell('E').value = datas.dateArrete ? new Date(datas.dateArrete) : '';
        workSheet.getRow(rowNumber).getCell('E').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('F').value = datas.identifiant;
        workSheet.getRow(rowNumber).getCell('G').value = datas.codePostal;
        workSheet.getRow(rowNumber).getCell('H').value = datas.commune;
        workSheet.getRow(rowNumber).getCell('I').value = datas.dateEffetContrat ? new Date(datas.dateEffetContrat) : '';
        workSheet.getRow(rowNumber).getCell('I').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('J').value = datas.debutPeriode ? new Date(datas.debutPeriode) : '';
        workSheet.getRow(rowNumber).getCell('J').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('K').value = datas.finPeriode ? new Date(datas.finPeriode) : '';
        workSheet.getRow(rowNumber).getCell('K').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('L').value = datas.raisonSociale;
        workSheet.getRow(rowNumber).getCell('M').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('N').value = datas.nomProduit;
        workSheet.getRow(rowNumber).getCell('O').value = datas.emissionTTC;
        workSheet.getRow(rowNumber).getCell('O').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('P').value = datas.reglementTTC;
        workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Q').value = datas.reglementHT;
        workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('R').value = datas.taux;
        workSheet.getRow(rowNumber).getCell('S').value = datas.montantPaiement;
        workSheet.getRow(rowNumber).getCell('S').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('T').value = datas.courtier;
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('U').value = datas.fondateur;
        workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('V').value = datas.pavillon;
        workSheet.getRow(rowNumber).getCell('V').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('W').value = datas.sofraco;
        workSheet.getRow(rowNumber).getCell('W').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('X').value = datas.sofracoExpertise;
        workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Y').value = datas.budget;
        workSheet.getRow(rowNumber).getCell('Y').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        rowNumber++;
    }
    return rowNumber;

};

const createPavetPAVILLONV8 = (dataCourtierOCR, workSheet, rowNumber) => {
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.dateGeneration ? new Date(datas.dateDebutEcheance) : '';
        workSheet.getRow(rowNumber).getCell('A').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('B').value = datas.codeCompagnie;
        workSheet.getRow(rowNumber).getCell('C').value = datas.codeCourtier;
        workSheet.getRow(rowNumber).getCell('D').value = datas.raisonSocialeApporteur;
        workSheet.getRow(rowNumber).getCell('E').value = datas.dateArrete ? new Date(datas.dateArrete) : '';
        workSheet.getRow(rowNumber).getCell('E').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('F').value = datas.identifiant;
        workSheet.getRow(rowNumber).getCell('G').value = datas.codePostal;
        workSheet.getRow(rowNumber).getCell('H').value = datas.commune;
        workSheet.getRow(rowNumber).getCell('I').value = datas.dateEffetContrat ? new Date(datas.dateEffetContrat) : '';
        workSheet.getRow(rowNumber).getCell('I').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('J').value = datas.debutPeriode ? new Date(datas.debutPeriode) : '';
        workSheet.getRow(rowNumber).getCell('J').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('K').value = datas.finPeriode ? new Date(datas.finPeriode) : '';
        workSheet.getRow(rowNumber).getCell('K').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('L').value = datas.raisonSociale;
        workSheet.getRow(rowNumber).getCell('M').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('N').value = datas.nomProduit;
        workSheet.getRow(rowNumber).getCell('O').value = datas.emissionTTC;
        workSheet.getRow(rowNumber).getCell('O').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('P').value = datas.reglementTTC;
        workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Q').value = datas.reglementHT;
        workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('R').value = datas.taux;
        workSheet.getRow(rowNumber).getCell('S').value = datas.montantPaiement;
        workSheet.getRow(rowNumber).getCell('S').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('T').value = datas.courtier;
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('U').value = datas.fondateur;
        workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('V').value = datas.pavillon;
        workSheet.getRow(rowNumber).getCell('V').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('W').value = datas.sofraco;
        workSheet.getRow(rowNumber).getCell('W').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('X').value = datas.sofracoExpertise;
        workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        rowNumber++;
    }
    return rowNumber;

};


