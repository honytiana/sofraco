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
            infosOCR.push({ company: 'SPVIE', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetSPVIE = (workSheet, dataCourtierOCR) => {
    const row1 = workSheet.getRow(1);
    row1.font = { bold: true, name: 'Arial', size: 10 };
    workSheet.mergeCells('A1:F1');
    row1.getCell('A').value = dataCourtierOCR.infosOCR.headers.firstHeaders[0];
    row1.getCell('A').alignment = { horizontal: 'center' };
    row1.getCell('A').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '000000' }
    };
    row1.getCell('A').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    workSheet.mergeCells('G1:M1');
    row1.getCell('G').value = dataCourtierOCR.infosOCR.headers.firstHeaders[1];
    row1.getCell('G').alignment = { horizontal: 'center' };
    row1.getCell('G').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '66ffcc' }
    };
    row1.getCell('G').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    workSheet.mergeCells('N1:O1');
    row1.getCell('N').value = dataCourtierOCR.infosOCR.headers.firstHeaders[2];
    row1.getCell('N').alignment = { horizontal: 'center' };
    row1.getCell('N').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ccffcc' }
    };
    row1.getCell('N').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    workSheet.mergeCells('P1:V1');
    row1.getCell('P').value = dataCourtierOCR.infosOCR.headers.firstHeaders[3];
    row1.getCell('P').alignment = { horizontal: 'center' };
    row1.getCell('P').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffccff' }
    };
    row1.getCell('P').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    workSheet.mergeCells('W1:AC1');
    row1.getCell('W').value = dataCourtierOCR.infosOCR.headers.firstHeaders[4];
    row1.getCell('W').alignment = { horizontal: 'center' };
    row1.getCell('W').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'fff0c1' }
    };
    row1.getCell('W').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    workSheet.mergeCells('AD1:AM1');
    row1.getCell('AD').value = dataCourtierOCR.infosOCR.headers.firstHeaders[5];
    row1.getCell('AD').alignment = { horizontal: 'center' };
    row1.getCell('AD').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ccffff' }
    };
    row1.getCell('AD').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };


    const row2 = workSheet.getRow(2);
    row2.font = { bold: true, name: 'Arial', size: 10 };
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.secondHeaders.forEach((secondHeader, index) => {
        row2.getCell(cellNumber).value = secondHeader;
        row2.getCell(cellNumber).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        cellNumber++;
    });
    
    let rowNumber = 3;
    let debut = 3;
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
        workSheet.getRow(rowNumber).getCell('AK').value = datas.commissionnementReprise.solde.result;
        workSheet.getRow(rowNumber).getCell('AK').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('AL').value = datas.commissionnementReprise.bordereauReference;
        workSheet.getRow(rowNumber).getCell('AM').value = datas.commissionnementReprise.libelle;
        rowNumber++;
    }
    rowNumber++;
    workSheet.getRow(rowNumber).getCell('AJ').value = 'TOTAL';
    workSheet.getRow(rowNumber).getCell('AJ').font = { bold: true, name: 'Arial', size: 10 };
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('AK').value;
    }
    workSheet.getRow(rowNumber).getCell('AK').value = { 
        formula: `SUM(AK${debut}:AK${rowNumber - 2})`,
        result: result
    };
    workSheet.getRow(rowNumber).getCell('AK').font = { bold: true, name: 'Arial', size: 10 };
    workSheet.getRow(rowNumber).getCell('AK').numFmt = '#,##0.00"€";\-#,##0.00"€"';
}

