exports.getOCRPAVILLON = (ocr, typeCompany) => {
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
            infosOCR.push({ company: `PAVILLON ${typeCompany}`, infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetPAVILLON = (workSheet, dataCourtierOCR) => {
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

exports.createWorkSheetPAVILLONMCMS = (workSheet, dataCourtierOCR) => {
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
    let pavillonMCMSV1;
    if (pavillonMCMSV1) {
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



