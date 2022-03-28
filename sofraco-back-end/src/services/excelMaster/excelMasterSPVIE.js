const excelFile = require('../utils/excelFile');

exports.getOCRSPVIE = (ocr) => {
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
            infosOCR.push({ companyGlobalName: 'SPVIE', companyName: 'SPVIE', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetSPVIE = (workSheet, dataCourtierOCR, reste = false, rowNumberI = null) => {
    let rowNumber = !reste ? 1 : rowNumberI;
    const font1 = { bold: true, name: 'Arial', size: 10 };
    const font2 = { bold: true, name: 'Arial', size: 10, color: { argb: 'FFFFFF' } };
    const border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    const row1 = workSheet.getRow(rowNumber);
    row1.font = font1;
    
    const cellInfoA = { workSheet, rowNumber, cell: 'A', value: dataCourtierOCR.infosOCR.headers.firstHeaders[0], mergedCells: `A${rowNumber}:F${rowNumber}` };
    excelFile.setMergedCell(cellInfoA, false, {}, font2, '', '000000');

    const cellInfoG = { workSheet, rowNumber, cell: 'G', value: dataCourtierOCR.infosOCR.headers.firstHeaders[1], mergedCells: `G${rowNumber}:M${rowNumber}` };
    excelFile.setMergedCell(cellInfoG, false, {}, font1, '', '66ffcc');

    const cellInfoN = { workSheet, rowNumber, cell: 'N', value: dataCourtierOCR.infosOCR.headers.firstHeaders[2], mergedCells: `N${rowNumber}:O${rowNumber}` };
    excelFile.setMergedCell(cellInfoN, false, {}, font1, '', 'ccffcc');

    const cellInfoP = { workSheet, rowNumber, cell: 'P', value: dataCourtierOCR.infosOCR.headers.firstHeaders[3], mergedCells: `P${rowNumber}:V${rowNumber}` };
    excelFile.setMergedCell(cellInfoP, false, {}, font1, '', 'ffccff');

    const cellInfoW = { workSheet, rowNumber, cell: 'W', value: dataCourtierOCR.infosOCR.headers.firstHeaders[4], mergedCells: `W${rowNumber}:AC${rowNumber}` };
    excelFile.setMergedCell(cellInfoW, false, {}, font1, '', 'fff0c1');

    const cellInfoAD = { workSheet, rowNumber, cell: 'AD', value: dataCourtierOCR.infosOCR.headers.firstHeaders[5], mergedCells: `AD${rowNumber}:AM${rowNumber}` };
    excelFile.setMergedCell(cellInfoAD, false, {}, font1, '', 'ccffff');
    rowNumber++;

    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.secondHeaders.forEach((secondHeader, index) => {
        excelFile.setStylizedCell(workSheet, rowNumber, cellNumber, secondHeader, true, border, font1);
        cellNumber++;
    });
    rowNumber++;
    
    let debut = rowNumber;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.distribution.code;
        workSheet.getRow(rowNumber).getCell('B').value = datas.distribution.codeVendeur;
        workSheet.getRow(rowNumber).getCell('C').value = datas.distribution.nomCourtierVendeur;
        workSheet.getRow(rowNumber).getCell('D').value = datas.distribution.groupe;
        workSheet.getRow(rowNumber).getCell('E').value = datas.distribution.entite;
        workSheet.getRow(rowNumber).getCell('F').value = datas.distribution.vendeur;
        workSheet.getRow(rowNumber).getCell('G').value = datas.produit.compagnie;
        workSheet.getRow(rowNumber).getCell('H').value = datas.produit.branche;
        workSheet.getRow(rowNumber).getCell('I').value = datas.produit.type;
        workSheet.getRow(rowNumber).getCell('J').value = datas.produit.gamme;
        workSheet.getRow(rowNumber).getCell('K').value = datas.produit.produit;
        workSheet.getRow(rowNumber).getCell('L').value = datas.produit.formule;
        workSheet.getRow(rowNumber).getCell('M').value = datas.produit.numContrat;
        workSheet.getRow(rowNumber).getCell('N').value = datas.adherent.nomClient;
        workSheet.getRow(rowNumber).getCell('O').value = datas.adherent.prenomClient;
        workSheet.getRow(rowNumber).getCell('P').value = datas.statutDate.statutContrat;
        workSheet.getRow(rowNumber).getCell('Q').value = datas.statutDate.dateSignature ? new Date(datas.statutDate.dateSignature) : '';
        workSheet.getRow(rowNumber).getCell('Q').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('R').value = (datas.statutDate.dateValidation) ? new Date(datas.statutDate.dateValidation) : '';
        workSheet.getRow(rowNumber).getCell('R').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('S').value = datas.statutDate.dateEffet ? new Date(datas.statutDate.dateEffet) : '';
        workSheet.getRow(rowNumber).getCell('S').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('T').value = datas.statutDate.dateResilliation ? new Date(datas.statutDate.dateResilliation) : '';
        workSheet.getRow(rowNumber).getCell('T').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('U').value = datas.statutDate.debutPeriode ? new Date(datas.statutDate.debutPeriode) : '';
        workSheet.getRow(rowNumber).getCell('U').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('V').value = datas.statutDate.finPeriode ? new Date(datas.statutDate.finPeriode) : '';
        workSheet.getRow(rowNumber).getCell('V').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('W').value = datas.cotisation.cotisationTTCFrais;
        workSheet.getRow(rowNumber).getCell('W').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('X').value = datas.cotisation.dontFraisSpvie;
        workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Y').value = datas.cotisation.dontAutreFrais;
        workSheet.getRow(rowNumber).getCell('Y').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Z').value = datas.cotisation.dontTaxes;
        workSheet.getRow(rowNumber).getCell('Z').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('AA').value = datas.cotisation.dontPrimesHTHorsFrais;
        workSheet.getRow(rowNumber).getCell('AA').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('AB').value = datas.cotisation.tauxTaxes;
        workSheet.getRow(rowNumber).getCell('AC').value = datas.cotisation.primeHTAnnuel;
        workSheet.getRow(rowNumber).getCell('AC').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('AD').value = datas.commissionnementReprise.periodiciteCommission;
        workSheet.getRow(rowNumber).getCell('AE').value = datas.commissionnementReprise.assietteDeCommissionnement;
        workSheet.getRow(rowNumber).getCell('AF').value = datas.commissionnementReprise.structureCommissionnementInitiale;
        workSheet.getRow(rowNumber).getCell('AG').value = datas.commissionnementReprise.commissionAppliquee;
        workSheet.getRow(rowNumber).getCell('AG').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('AH').value = datas.commissionnementReprise.fractionAppliquee;
        workSheet.getRow(rowNumber).getCell('AI').value = datas.commissionnementReprise.commission;
        workSheet.getRow(rowNumber).getCell('AI').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('AJ').value = datas.commissionnementReprise.reprise;
        workSheet.getRow(rowNumber).getCell('AJ').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('AK').value = (datas.commissionnementReprise.solde !== null) ? datas.commissionnementReprise.solde.result : '';
        workSheet.getRow(rowNumber).getCell('AK').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('AL').value = datas.commissionnementReprise.bordereauReference;
        workSheet.getRow(rowNumber).getCell('AM').value = datas.commissionnementReprise.libelle;
        rowNumber++;
    }
    rowNumber++;
    excelFile.setSimpleCell(workSheet, rowNumber, 'AJ', 'TOTAL', font1);
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('AK').value;
    }
    const value =  { 
        formula: `SUM(AK${debut}:AK${rowNumber - 2})`,
        result: result
    };
    excelFile.setStylizedCell(workSheet, rowNumber, 'AK', value, false, {}, font1, '#,##0.00"€";\-#,##0.00"€"');
    if (reste) {
        return rowNumber;
    }
}


