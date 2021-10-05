exports.getOCRMIEL = (ocr, typeCompany) => {
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
                datas: contrat.contrats
            };
            infosOCR.push({ company: `MIEL ${typeCompany}`, infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetMIELCREASIO = (workSheet, dataCourtierOCR) => {
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
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.codeApporteurCommissionne;
        workSheet.getRow(rowNumber).getCell('B').value = datas.codeApporteurAffaire;
        workSheet.getRow(rowNumber).getCell('C').value = datas.nomApporteurAffaire;
        workSheet.getRow(rowNumber).getCell('D').value = datas.numAdherent;
        workSheet.getRow(rowNumber).getCell('E').value = datas.nom;
        workSheet.getRow(rowNumber).getCell('F').value = datas.prenom;
        workSheet.getRow(rowNumber).getCell('G').value = datas.codePostal;
        workSheet.getRow(rowNumber).getCell('H').value = datas.ville;
        workSheet.getRow(rowNumber).getCell('I').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('J').value = datas.nomProduit;
        workSheet.getRow(rowNumber).getCell('K').value = datas.codeContrat;
        workSheet.getRow(rowNumber).getCell('L').value = datas.nomContrat;
        workSheet.getRow(rowNumber).getCell('M').value = datas.dateDebutEcheance ? new Date(datas.dateDebutEcheance) : '';
        workSheet.getRow(rowNumber).getCell('M').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('N').value = datas.dateFinEcheance ? new Date(datas.dateFinEcheance) : '';
        workSheet.getRow(rowNumber).getCell('N').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('O').value = datas.montantTTCEcheance;
        workSheet.getRow(rowNumber).getCell('O').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('P').value = datas.montantHTEcheance;
        workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Q').value = datas.codeGarantieTechnique;
        workSheet.getRow(rowNumber).getCell('R').value = datas.nomGarantieTechnique;
        workSheet.getRow(rowNumber).getCell('S').value = datas.baseCommisionnement;
        workSheet.getRow(rowNumber).getCell('S').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('T').value = datas.tauxCommission;
        workSheet.getRow(rowNumber).getCell('U').value = datas.montantCommissions;
        workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('V').value = datas.bordereauPaiementCommissionsInitiales;
        rowNumber++;
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

exports.createWorkSheetMIELMCMS = (workSheet, dataCourtierOCR) => {
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
    let mielMCMSV1;
    let mielMCMSV2;
    let mielMCMSV3;
    let mielMCMSV4;
    if (mielMCMSV1) {
        for (let datas of dataCourtierOCR.infosOCR.datas) {
            workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
            workSheet.getRow(rowNumber).getCell('A').value = datas.codeApporteurCommissionne;
            workSheet.getRow(rowNumber).getCell('B').value = datas.codeApporteurAffaire;
            workSheet.getRow(rowNumber).getCell('C').value = datas.nomApporteurAffaire;
            workSheet.getRow(rowNumber).getCell('D').value = datas.numAdherent;
            workSheet.getRow(rowNumber).getCell('E').value = datas.nom;
            workSheet.getRow(rowNumber).getCell('F').value = datas.prenom;
            workSheet.getRow(rowNumber).getCell('G').value = datas.codePostal;
            workSheet.getRow(rowNumber).getCell('H').value = datas.ville;
            workSheet.getRow(rowNumber).getCell('I').value = datas.codeProduit;
            workSheet.getRow(rowNumber).getCell('J').value = datas.nomProduit;
            workSheet.getRow(rowNumber).getCell('K').value = datas.codeContrat;
            workSheet.getRow(rowNumber).getCell('L').value = datas.nomContrat;
            workSheet.getRow(rowNumber).getCell('M').value = datas.dateDebutEcheance ? new Date(datas.dateDebutEcheance) : '';
            workSheet.getRow(rowNumber).getCell('M').numFmt = 'dd/mm/yyyy';
            workSheet.getRow(rowNumber).getCell('N').value = datas.dateFinEcheance ? new Date(datas.dateFinEcheance) : '';
            workSheet.getRow(rowNumber).getCell('N').numFmt = 'dd/mm/yyyy';
            workSheet.getRow(rowNumber).getCell('O').value = datas.montantTTCEcheance;
            workSheet.getRow(rowNumber).getCell('O').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('P').value = datas.montantHTEcheance;
            workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('Q').value = datas.codeGarantieTechnique;
            workSheet.getRow(rowNumber).getCell('R').value = datas.nomGarantieTechnique;
            workSheet.getRow(rowNumber).getCell('S').value = datas.baseCommisionnement;
            workSheet.getRow(rowNumber).getCell('S').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('T').value = datas.tauxCommission;
            workSheet.getRow(rowNumber).getCell('U').value = datas.montantCommissions;
            workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('V').value = datas.bordereauPaiementCommissionsInitiales;
            workSheet.getRow(rowNumber).getCell('W').value = datas.courtier;
            workSheet.getRow(rowNumber).getCell('W').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('X').value = datas.fondateur;
            workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            rowNumber++;
        }
    }
    if (mielMCMSV2) {
        for (let datas of dataCourtierOCR.infosOCR.datas) {
            workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
            workSheet.getRow(rowNumber).getCell('A').value = datas.codeApporteurCommissionne;
            workSheet.getRow(rowNumber).getCell('B').value = datas.codeApporteurAffaire;
            workSheet.getRow(rowNumber).getCell('C').value = datas.nomApporteurAffaire;
            workSheet.getRow(rowNumber).getCell('D').value = datas.numAdherent;
            workSheet.getRow(rowNumber).getCell('E').value = datas.nom;
            workSheet.getRow(rowNumber).getCell('F').value = datas.prenom;
            workSheet.getRow(rowNumber).getCell('G').value = datas.codePostal;
            workSheet.getRow(rowNumber).getCell('H').value = datas.ville;
            workSheet.getRow(rowNumber).getCell('I').value = datas.codeProduit;
            workSheet.getRow(rowNumber).getCell('J').value = datas.nomProduit;
            workSheet.getRow(rowNumber).getCell('K').value = datas.codeContrat;
            workSheet.getRow(rowNumber).getCell('L').value = datas.nomContrat;
            workSheet.getRow(rowNumber).getCell('M').value = datas.dateDebutEcheance ? new Date(datas.dateDebutEcheance) : '';
            workSheet.getRow(rowNumber).getCell('M').numFmt = 'dd/mm/yyyy';
            workSheet.getRow(rowNumber).getCell('N').value = datas.dateFinEcheance ? new Date(datas.dateFinEcheance) : '';
            workSheet.getRow(rowNumber).getCell('N').numFmt = 'dd/mm/yyyy';
            workSheet.getRow(rowNumber).getCell('O').value = datas.montantTTCEcheance;
            workSheet.getRow(rowNumber).getCell('O').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('P').value = datas.montantHTEcheance;
            workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('Q').value = datas.codeGarantieTechnique;
            workSheet.getRow(rowNumber).getCell('R').value = datas.nomGarantieTechnique;
            workSheet.getRow(rowNumber).getCell('S').value = datas.baseCommisionnement;
            workSheet.getRow(rowNumber).getCell('S').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('T').value = datas.tauxCommission;
            workSheet.getRow(rowNumber).getCell('U').value = datas.montantCommissions;
            workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('V').value = datas.bordereauPaiementCommissionsInitiales;
            workSheet.getRow(rowNumber).getCell('W').value = datas.courtier;
            workSheet.getRow(rowNumber).getCell('W').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('X').value = datas.fondateur;
            workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('Y').value = datas.sogeas;
            workSheet.getRow(rowNumber).getCell('Y').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('Z').value = datas.procedure;
            workSheet.getRow(rowNumber).getCell('Z').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            rowNumber++;
        }
    }
    if (mielMCMSV3) {
        for (let datas of dataCourtierOCR.infosOCR.datas) {
            workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
            workSheet.getRow(rowNumber).getCell('A').value = datas.codeApporteurCommissionne;
            workSheet.getRow(rowNumber).getCell('B').value = datas.codeApporteurAffaire;
            workSheet.getRow(rowNumber).getCell('C').value = datas.nomApporteurAffaire;
            workSheet.getRow(rowNumber).getCell('D').value = datas.numAdherent;
            workSheet.getRow(rowNumber).getCell('E').value = datas.nom;
            workSheet.getRow(rowNumber).getCell('F').value = datas.prenom;
            workSheet.getRow(rowNumber).getCell('G').value = datas.codePostal;
            workSheet.getRow(rowNumber).getCell('H').value = datas.ville;
            workSheet.getRow(rowNumber).getCell('I').value = datas.codeProduit;
            workSheet.getRow(rowNumber).getCell('J').value = datas.nomProduit;
            workSheet.getRow(rowNumber).getCell('K').value = datas.codeContrat;
            workSheet.getRow(rowNumber).getCell('L').value = datas.nomContrat;
            workSheet.getRow(rowNumber).getCell('M').value = datas.dateDebutEcheance ? new Date(datas.dateDebutEcheance) : '';
            workSheet.getRow(rowNumber).getCell('M').numFmt = 'dd/mm/yyyy';
            workSheet.getRow(rowNumber).getCell('N').value = datas.dateFinEcheance ? new Date(datas.dateFinEcheance) : '';
            workSheet.getRow(rowNumber).getCell('N').numFmt = 'dd/mm/yyyy';
            workSheet.getRow(rowNumber).getCell('O').value = datas.montantTTCEcheance;
            workSheet.getRow(rowNumber).getCell('O').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('P').value = datas.montantHTEcheance;
            workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('Q').value = datas.codeGarantieTechnique;
            workSheet.getRow(rowNumber).getCell('R').value = datas.nomGarantieTechnique;
            workSheet.getRow(rowNumber).getCell('S').value = datas.baseCommisionnement;
            workSheet.getRow(rowNumber).getCell('S').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('T').value = datas.tauxCommission;
            workSheet.getRow(rowNumber).getCell('U').value = datas.montantCommissions;
            workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('V').value = datas.bordereauPaiementCommissionsInitiales;
            workSheet.getRow(rowNumber).getCell('W').value = datas.courtier;
            workSheet.getRow(rowNumber).getCell('W').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('X').value = datas.fondateur;
            workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('Y').value = datas.sogeas;
            workSheet.getRow(rowNumber).getCell('Y').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('Z').value = datas.sofraco;
            workSheet.getRow(rowNumber).getCell('Z').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('AA').value = datas.procedure;
            workSheet.getRow(rowNumber).getCell('AA').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('AB').value = datas.bordereauPaiementCommissionsInitiales;
            workSheet.getRow(rowNumber).getCell('AB').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('AC').value = datas.bordereauPaiementCommissionsInitiales;
            workSheet.getRow(rowNumber).getCell('AC').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            rowNumber++;
        }
    }
    if (mielMCMSV4) {
        for (let datas of dataCourtierOCR.infosOCR.datas) {
            workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
            workSheet.getRow(rowNumber).getCell('A').value = datas.codeApporteurCommissionne;
            workSheet.getRow(rowNumber).getCell('B').value = datas.codeApporteurAffaire;
            workSheet.getRow(rowNumber).getCell('C').value = datas.nomApporteurAffaire;
            workSheet.getRow(rowNumber).getCell('D').value = datas.numAdherent;
            workSheet.getRow(rowNumber).getCell('E').value = datas.nom;
            workSheet.getRow(rowNumber).getCell('F').value = datas.prenom;
            workSheet.getRow(rowNumber).getCell('G').value = datas.codePostal;
            workSheet.getRow(rowNumber).getCell('H').value = datas.ville;
            workSheet.getRow(rowNumber).getCell('I').value = datas.codeProduit;
            workSheet.getRow(rowNumber).getCell('J').value = datas.nomProduit;
            workSheet.getRow(rowNumber).getCell('K').value = datas.codeContrat;
            workSheet.getRow(rowNumber).getCell('L').value = datas.nomContrat;
            workSheet.getRow(rowNumber).getCell('M').value = datas.dateDebutEcheance ? new Date(datas.dateDebutEcheance) : '';
            workSheet.getRow(rowNumber).getCell('M').numFmt = 'dd/mm/yyyy';
            workSheet.getRow(rowNumber).getCell('N').value = datas.dateFinEcheance ? new Date(datas.dateFinEcheance) : '';
            workSheet.getRow(rowNumber).getCell('N').numFmt = 'dd/mm/yyyy';
            workSheet.getRow(rowNumber).getCell('O').value = datas.montantTTCEcheance;
            workSheet.getRow(rowNumber).getCell('O').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('P').value = datas.montantHTEcheance;
            workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('Q').value = datas.codeGarantieTechnique;
            workSheet.getRow(rowNumber).getCell('R').value = datas.nomGarantieTechnique;
            workSheet.getRow(rowNumber).getCell('S').value = datas.baseCommisionnement;
            workSheet.getRow(rowNumber).getCell('S').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('T').value = datas.tauxCommission;
            workSheet.getRow(rowNumber).getCell('U').value = datas.montantCommissions;
            workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('V').value = datas.bordereauPaiementCommissionsInitiales;
            workSheet.getRow(rowNumber).getCell('W').value = datas.courtier;
            workSheet.getRow(rowNumber).getCell('W').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('X').value = datas.fondateur;
            workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('Y').value = datas.pavillon;
            workSheet.getRow(rowNumber).getCell('Y').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('Z').value = datas.sofracoExpertises;
            workSheet.getRow(rowNumber).getCell('Z').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('AA').value = datas.budget;
            workSheet.getRow(rowNumber).getCell('AA').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            rowNumber++;
        }
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



