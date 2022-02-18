const excelFile = require('../utils/excelFile');

exports.getOCRMIEL = (ocr) => { };

exports.createWorkSheetMIEL = (workSheet, dataCourtierOCR) => { };

exports.getOCRMIELMCMS = (ocr) => {
    const headers = ocr.headers;
    let infosOCR = [];
    ocr.allContratsPerCourtier.forEach((contrat, index) => {
        if (contrat.courtier) {
            const dataCourtierOCR = {
                code: {
                    cabinet: contrat.courtier,
                    code: contrat.courtier,
                },
                headers: [
                    "Code Apporteur commissionné",
                    "Code Apporteur d'Affaire",
                    "Nom Apporteur d'Affaire",
                    "N° Adhérent",
                    'date début de contrat',
                    "Nom",
                    "Prénom",
                    "Code postal",
                    "Ville",
                    "Code Poduit",
                    "Nom Produit",
                    "Code Contrat",
                    "Nom Contrat",
                    "Date début échéance",
                    "Date fin échéance",
                    "Montant TTC échéance",
                    "Montant HT échéance",
                    "Code de la Garantie Technique",
                    "Nom de la Garantie Technique",
                    "Base de commisionnement",
                    "Taux de commission",
                    "Montant commissions",
                    "Bordereau du paiement des commissions initiales",
                    'COURTIER'],
                datas: contrat.contrats,
                mielVersion: ocr.mielVersion
            };
            infosOCR.push({ companyGlobalName: 'MIEL MUTUELLE', companyName: `MIEL MCMS`, infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetMIELMCMS = (workSheet, dataCourtierOCR) => {
    let mielCreasio, mielV1, mielV2, mielV3, mielV4 = false;
    switch (dataCourtierOCR.infosOCR.mielVersion) {
        case 'mielCreasio':
            mielCreasio = true;
            break;
        case 'mielV1':
            mielV1 = true;
            break;
        case 'mielV2':
            mielV2 = true;
            break;
        case 'mielV3':
            mielV3 = true;
            break;
        case 'mielV4':
            mielV4 = true;
            break;
    }
    let rowNumber = 1;
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        excelFile.setSimpleCell(workSheet, rowNumber, cellNumber, header, { bold: true, name: 'Arial', size: 10 });
        cellNumber++;
    });
    rowNumber++;

    let debut = rowNumber;
    if (mielCreasio) {
        rowNumber = createPavetMIELCREASIO(dataCourtierOCR, workSheet, rowNumber);
    }
    if (mielV1) {
        rowNumber = createPavetMIELV1(dataCourtierOCR, workSheet, rowNumber);
    }
    if (mielV2) {
        rowNumber = createPavetMIELV2(dataCourtierOCR, workSheet, rowNumber);
    }
    if (mielV3) {
        rowNumber = createPavetMIELV3(dataCourtierOCR, workSheet, rowNumber);
    }
    if (mielV4) {
        rowNumber = createPavetMIELV4(dataCourtierOCR, workSheet, rowNumber);
    }
    rowNumber++;
    excelFile.setSimpleCell(workSheet, rowNumber, 'T', 'TOTAL', { bold: true, name: 'Arial', size: 10 });
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('U').value;
    }
    const value = {
        formula: `SUM(U${debut}:U${rowNumber - 2})`,
        result: result
    };
    excelFile.setStylizedCell(workSheet, rowNumber, 'U', value, false, {}, { bold: true, name: 'Arial', size: 10 }, '#,##0.00"€";\-#,##0.00"€"');
}

const createPavetMIELCREASIO = (dataCourtierOCR, workSheet, rowNumber) => {
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.codeApporteurCommissionne;
        workSheet.getRow(rowNumber).getCell('B').value = datas.codeApporteurAffaire;
        workSheet.getRow(rowNumber).getCell('C').value = datas.nomApporteurAffaire;
        workSheet.getRow(rowNumber).getCell('D').value = datas.numAdherent;
        workSheet.getRow(rowNumber).getCell('F').value = datas.nom;
        workSheet.getRow(rowNumber).getCell('G').value = datas.prenom;
        workSheet.getRow(rowNumber).getCell('H').value = datas.codePostal;
        workSheet.getRow(rowNumber).getCell('I').value = datas.ville;
        workSheet.getRow(rowNumber).getCell('J').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('K').value = datas.nomProduit;
        workSheet.getRow(rowNumber).getCell('L').value = datas.codeContrat;
        workSheet.getRow(rowNumber).getCell('M').value = datas.nomContrat;
        workSheet.getRow(rowNumber).getCell('N').value = datas.dateDebutEcheance ? new Date(datas.dateDebutEcheance) : '';
        workSheet.getRow(rowNumber).getCell('N').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('O').value = datas.dateFinEcheance ? new Date(datas.dateFinEcheance) : '';
        workSheet.getRow(rowNumber).getCell('O').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('P').value = datas.montantTTCEcheance;
        workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Q').value = datas.montantHTEcheance;
        workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('R').value = datas.codeGarantieTechnique;
        workSheet.getRow(rowNumber).getCell('S').value = datas.nomGarantieTechnique;
        workSheet.getRow(rowNumber).getCell('T').value = datas.baseCommisionnement;
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('U').value = datas.tauxCommission;
        workSheet.getRow(rowNumber).getCell('V').value = datas.montantCommissions;
        workSheet.getRow(rowNumber).getCell('V').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('W').value = datas.bordereauPaiementCommissionsInitiales;
        rowNumber++;
    }
    return rowNumber;
};

const createPavetMIELV1 = (dataCourtierOCR, workSheet, rowNumber) => {
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.codeApporteurCommissionne;
        workSheet.getRow(rowNumber).getCell('B').value = datas.codeApporteurAffaire;
        workSheet.getRow(rowNumber).getCell('C').value = datas.nomApporteurAffaire;
        workSheet.getRow(rowNumber).getCell('D').value = datas.numAdherent;
        workSheet.getRow(rowNumber).getCell('F').value = datas.nom;
        workSheet.getRow(rowNumber).getCell('G').value = datas.prenom;
        workSheet.getRow(rowNumber).getCell('H').value = datas.codePostal;
        workSheet.getRow(rowNumber).getCell('I').value = datas.ville;
        workSheet.getRow(rowNumber).getCell('J').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('K').value = datas.nomProduit;
        workSheet.getRow(rowNumber).getCell('L').value = datas.codeContrat;
        workSheet.getRow(rowNumber).getCell('M').value = datas.nomContrat;
        workSheet.getRow(rowNumber).getCell('N').value = datas.dateDebutEcheance ? new Date(datas.dateDebutEcheance) : '';
        workSheet.getRow(rowNumber).getCell('N').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('O').value = datas.dateFinEcheance ? new Date(datas.dateFinEcheance) : '';
        workSheet.getRow(rowNumber).getCell('O').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('P').value = datas.montantTTCEcheance;
        workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Q').value = datas.montantHTEcheance;
        workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('R').value = datas.codeGarantieTechnique;
        workSheet.getRow(rowNumber).getCell('S').value = datas.nomGarantieTechnique;
        workSheet.getRow(rowNumber).getCell('T').value = datas.baseCommisionnement;
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('U').value = datas.tauxCommission;
        workSheet.getRow(rowNumber).getCell('V').value = datas.montantCommissions;
        workSheet.getRow(rowNumber).getCell('V').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('W').value = datas.bordereauPaiementCommissionsInitiales;
        workSheet.getRow(rowNumber).getCell('X').value = datas.courtier;
        workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        // workSheet.getRow(rowNumber).getCell('X').value = datas.fondateur;
        // workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        rowNumber++;
    }
    return rowNumber;

};

const createPavetMIELV2 = (dataCourtierOCR, workSheet, rowNumber) => {
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.codeApporteurCommissionne;
        workSheet.getRow(rowNumber).getCell('B').value = datas.codeApporteurAffaire;
        workSheet.getRow(rowNumber).getCell('C').value = datas.nomApporteurAffaire;
        workSheet.getRow(rowNumber).getCell('D').value = datas.numAdherent;
        workSheet.getRow(rowNumber).getCell('F').value = datas.nom;
        workSheet.getRow(rowNumber).getCell('G').value = datas.prenom;
        workSheet.getRow(rowNumber).getCell('H').value = datas.codePostal;
        workSheet.getRow(rowNumber).getCell('I').value = datas.ville;
        workSheet.getRow(rowNumber).getCell('J').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('K').value = datas.nomProduit;
        workSheet.getRow(rowNumber).getCell('L').value = datas.codeContrat;
        workSheet.getRow(rowNumber).getCell('M').value = datas.nomContrat;
        workSheet.getRow(rowNumber).getCell('N').value = datas.dateDebutEcheance ? new Date(datas.dateDebutEcheance) : '';
        workSheet.getRow(rowNumber).getCell('N').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('O').value = datas.dateFinEcheance ? new Date(datas.dateFinEcheance) : '';
        workSheet.getRow(rowNumber).getCell('O').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('P').value = datas.montantTTCEcheance;
        workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Q').value = datas.montantHTEcheance;
        workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('R').value = datas.codeGarantieTechnique;
        workSheet.getRow(rowNumber).getCell('S').value = datas.nomGarantieTechnique;
        workSheet.getRow(rowNumber).getCell('T').value = datas.baseCommisionnement;
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('U').value = datas.tauxCommission;
        workSheet.getRow(rowNumber).getCell('V').value = datas.montantCommissions;
        workSheet.getRow(rowNumber).getCell('V').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('W').value = datas.bordereauPaiementCommissionsInitiales;
        workSheet.getRow(rowNumber).getCell('X').value = datas.courtier;
        workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        // workSheet.getRow(rowNumber).getCell('X').value = datas.fondateur;
        // workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        // workSheet.getRow(rowNumber).getCell('Y').value = datas.sogeas;
        // workSheet.getRow(rowNumber).getCell('Y').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        // workSheet.getRow(rowNumber).getCell('Z').value = datas.procedure;
        // workSheet.getRow(rowNumber).getCell('Z').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        rowNumber++;
    }
    return rowNumber;

};

const createPavetMIELV3 = (dataCourtierOCR, workSheet, rowNumber) => {
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.codeApporteurCommissionne;
        workSheet.getRow(rowNumber).getCell('B').value = datas.codeApporteurAffaire;
        workSheet.getRow(rowNumber).getCell('C').value = datas.nomApporteurAffaire;
        workSheet.getRow(rowNumber).getCell('D').value = datas.numAdherent;
        workSheet.getRow(rowNumber).getCell('E').value = datas.dateDebutContrat ? new Date(datas.dateDebutContrat) : '';
        workSheet.getRow(rowNumber).getCell('E').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('F').value = datas.nom;
        workSheet.getRow(rowNumber).getCell('G').value = datas.prenom;
        workSheet.getRow(rowNumber).getCell('H').value = datas.codePostal;
        workSheet.getRow(rowNumber).getCell('I').value = datas.ville;
        workSheet.getRow(rowNumber).getCell('J').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('K').value = datas.nomProduit;
        workSheet.getRow(rowNumber).getCell('L').value = datas.codeContrat;
        workSheet.getRow(rowNumber).getCell('M').value = datas.nomContrat;
        workSheet.getRow(rowNumber).getCell('N').value = datas.dateDebutEcheance ? new Date(datas.dateDebutEcheance) : '';
        workSheet.getRow(rowNumber).getCell('N').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('O').value = datas.dateFinEcheance ? new Date(datas.dateFinEcheance) : '';
        workSheet.getRow(rowNumber).getCell('O').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('P').value = datas.montantTTCEcheance;
        workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Q').value = datas.montantHTEcheance;
        workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('R').value = datas.codeGarantieTechnique;
        workSheet.getRow(rowNumber).getCell('S').value = datas.nomGarantieTechnique;
        workSheet.getRow(rowNumber).getCell('T').value = datas.baseCommisionnement;
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('U').value = datas.tauxCommission;
        workSheet.getRow(rowNumber).getCell('V').value = datas.montantCommissions;
        workSheet.getRow(rowNumber).getCell('V').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('W').value = datas.bordereauPaiementCommissionsInitiales;
        workSheet.getRow(rowNumber).getCell('X').value = datas.courtier;
        workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        rowNumber++;
    }
    return rowNumber;

};

const createPavetMIELV4 = (dataCourtierOCR, workSheet, rowNumber) => {
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.codeApporteurCommissionne;
        workSheet.getRow(rowNumber).getCell('B').value = datas.codeApporteurAffaire;
        workSheet.getRow(rowNumber).getCell('C').value = datas.nomApporteurAffaire;
        workSheet.getRow(rowNumber).getCell('D').value = datas.numAdherent;
        workSheet.getRow(rowNumber).getCell('F').value = datas.nom;
        workSheet.getRow(rowNumber).getCell('G').value = datas.prenom;
        workSheet.getRow(rowNumber).getCell('H').value = datas.codePostal;
        workSheet.getRow(rowNumber).getCell('I').value = datas.ville;
        workSheet.getRow(rowNumber).getCell('J').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('K').value = datas.nomProduit;
        workSheet.getRow(rowNumber).getCell('L').value = datas.codeContrat;
        workSheet.getRow(rowNumber).getCell('M').value = datas.nomContrat;
        workSheet.getRow(rowNumber).getCell('N').value = datas.dateDebutEcheance ? new Date(datas.dateDebutEcheance) : '';
        workSheet.getRow(rowNumber).getCell('N').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('O').value = datas.dateFinEcheance ? new Date(datas.dateFinEcheance) : '';
        workSheet.getRow(rowNumber).getCell('O').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('P').value = datas.montantTTCEcheance;
        workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Q').value = datas.montantHTEcheance;
        workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('R').value = datas.codeGarantieTechnique;
        workSheet.getRow(rowNumber).getCell('S').value = datas.nomGarantieTechnique;
        workSheet.getRow(rowNumber).getCell('T').value = datas.baseCommisionnement;
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('U').value = datas.tauxCommission;
        workSheet.getRow(rowNumber).getCell('V').value = datas.montantCommissions;
        workSheet.getRow(rowNumber).getCell('V').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('W').value = datas.bordereauPaiementCommissionsInitiales;
        workSheet.getRow(rowNumber).getCell('X').value = datas.courtier;
        workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        // workSheet.getRow(rowNumber).getCell('X').value = datas.fondateur;
        // workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        // workSheet.getRow(rowNumber).getCell('Y').value = datas.pavillon;
        // workSheet.getRow(rowNumber).getCell('Y').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        // workSheet.getRow(rowNumber).getCell('Z').value = datas.sofracoExpertises;
        // workSheet.getRow(rowNumber).getCell('Z').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        // workSheet.getRow(rowNumber).getCell('AA').value = datas.budget;
        // workSheet.getRow(rowNumber).getCell('AA').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        rowNumber++;
    }
    return rowNumber;

};


