exports.getOCRPAVILLON = (ocr) => { };

exports.createWorkSheetPAVILLON = (workSheet, dataCourtierOCR) => { };

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
            infosOCR.push({ company: `PAVILLON`, infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetPAVILLONMCMS = (workSheet, dataCourtierOCR) => {
    let pavActio, pavV1, pavV2, pavV3, pavV4, pavV5, pavV6, pavV7, pavV8 = false;
    switch (dataCourtierOCR.pavVersion) {
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
    let rowNumber = 1;
    const row = workSheet.getRow(rowNumber);
    row.font = { bold: true, name: 'Arial', size: 10 };
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        row.getCell(cellNumber).value = header;
        cellNumber++;
    });
    rowNumber++;

    let debut = rowNumber;
    if (pavActio) {
        createPavetPAVILLONACTIO(dataCourtierOCR, workSheet, rowNumber);
    }
    if (pavV1) {
        createPavetPAVILLONV1(dataCourtierOCR, workSheet, rowNumber);
    }
    if (pavV2) {
        createPavetPAVILLONV2(dataCourtierOCR, workSheet, rowNumber);
    }
    if (pavV3) {
        createPavetPAVILLONV3(dataCourtierOCR, workSheet, rowNumber);
    }
    if (pavV4) {
        createPavetPAVILLONV4(dataCourtierOCR, workSheet, rowNumber);
    }
    if (pavV5) {
        createPavetPAVILLONV5(dataCourtierOCR, workSheet, rowNumber);
    }
    if (pavV6) {
        createPavetPAVILLONV6(dataCourtierOCR, workSheet, rowNumber);
    }
    if (pavV7) {
        createPavetPAVILLONV7(dataCourtierOCR, workSheet, rowNumber);
    }
    if (pavV8) {
        createPavetPAVILLONV8(dataCourtierOCR, workSheet, rowNumber);
    }
    rowNumber++;
    workSheet.getRow(rowNumber).getCell('T').value = 'TOTAL';
    workSheet.getRow(rowNumber).getCell('T').font = { bold: true, name: 'Arial', size: 10 };
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('U').value;
    }
    workSheet.getRow(rowNumber).getCell('U').value = {
        formula: `SUM(U${debut}:U${rowNumber - 2})`,
        result: result
    };
    workSheet.getRow(rowNumber).getCell('U').font = { bold: true, name: 'Arial', size: 10 };
    workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"€";\-#,##0.00"€"';
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

};


