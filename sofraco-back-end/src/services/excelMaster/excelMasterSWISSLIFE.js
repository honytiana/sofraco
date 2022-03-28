const excelFile = require('../utils/excelFile');

exports.getOCRSLADE = (ocr) => {
    let infosOCR = []
    for (let info of ocr.infos) {
        const syntheseDesCommissions = info.syntheseDesCommissions;
        const detailDesPolices = info.detailDesPolices;
        infosOCR.push({
            companyGlobalName: 'SWISS LIFE', companyName: 'SLADE',
            infosOCR: {
                code: {
                    cabinet: syntheseDesCommissions.codeApporteur,
                    code: syntheseDesCommissions.codeApporteur
                },
                syntheseDesCommissions,
                detailDesPolices
            }
        });
    }
    return infosOCR;

}

exports.createWorkSheetSLADE = (workSheet, dataCourtierOCR, reste = false, rowNumberI = null) => {
    let rowNumber = !reste ? 1 : rowNumberI;
    const font1 = { name: 'Arial', size: 12, bold: true, color: { argb: '960f2f' } };
    const font2 = { name: 'Arial', size: 10 };
    const font3 = { name: 'Arial', size: 10, bold: true, color: { argb: '960f2f' } };
    const font4 = { name: 'Arial', size: 11, bold: true, color: { argb: '960f2f' } };
    const border1 = {
        top: { style: 'thin', color: { argb: '960f2f' } },
        left: { style: 'thin', color: { argb: '960f2f' } },
        bottom: { style: 'thin', color: { argb: '960f2f' } },
        right: { style: 'thin', color: { argb: '960f2f' } }
    };

    workSheet.getColumn('A').width = 40;
    excelFile.setSimpleCell(workSheet, rowNumber, 'A', 'Synthèse de vos commissions', font1);
    rowNumber++;
    rowNumber++;

    excelFile.setStylizedCell(workSheet, rowNumber, 'A', 'Nombre de primes sur la période : ', true, border1, font2);
    excelFile.setStylizedCell(workSheet, rowNumber, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.nombrePrimeSurLaPeriode, true, border1, font2);
    rowNumber++;

    excelFile.setStylizedCell(workSheet, rowNumber, 'A', 'Total des primes encaissées sur la période : ', true, border1, font2);
    excelFile.setStylizedCell(workSheet, rowNumber, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.totalPrimesEncaisseesSurLaPeriode, true, border1, font2, '#,##0.00"€";\-#,##0.00"€"');
    rowNumber++;

    excelFile.setStylizedCell(workSheet, rowNumber, 'A', 'Total des commissions calculées sur la période : ', true, border1, font2);
    excelFile.setStylizedCell(workSheet, rowNumber, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.totalCommissionsCalculeesSurLaPeriode, true, border1, font2, '#,##0.00"€";\-#,##0.00"€"');
    rowNumber++;

    excelFile.setStylizedCell(workSheet, rowNumber, 'A', 'Report solde précédent : ', true, border1, font2);
    excelFile.setStylizedCell(workSheet, rowNumber, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.reportSoldePrecedent, true, border1, font2, '#,##0.00"€";\-#,##0.00"€"');
    rowNumber++;

    excelFile.setStylizedCell(workSheet, rowNumber, 'A', 'Total des commissions dues : ', true, border1, font2);
    excelFile.setStylizedCell(workSheet, rowNumber, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.totalCommissionsDues, true, border1, font2, '#,##0.00"€";\-#,##0.00"€"');
    rowNumber++;
    rowNumber++;

    excelFile.setSimpleCell(workSheet, rowNumber, 'A', 'BORDEREAU DE COMMISSIONS', font3);
    rowNumber++;
    excelFile.setSimpleCell(workSheet, rowNumber, 'A', 'Détail des polices', font3);
    rowNumber++;
    rowNumber++;

    const cellInfoA = { workSheet, rowNumber, cell: 'A', value: 'AGENCE', mergedCells: `A${rowNumber}:B${rowNumber}` };
    excelFile.setMergedCell(cellInfoA, true, border1, font4);

    const cellInfoC = { workSheet, rowNumber, cell: 'C', value: 'CONTRAT', mergedCells: `C${rowNumber}:F${rowNumber}` };
    excelFile.setMergedCell(cellInfoC, true, border1, font4);

    const cellInfoG = { workSheet, rowNumber, cell: 'G', value: 'PRIME', mergedCells: `G${rowNumber}:I${rowNumber}` };
    excelFile.setMergedCell(cellInfoG, true, border1, font4);

    const cellInfoJ = { workSheet, rowNumber, cell: 'J', value: 'COMMISSIONS', mergedCells: `J${rowNumber}:N${rowNumber}` };
    excelFile.setMergedCell(cellInfoJ, true, border1, font4);
    rowNumber++;

    excelFile.setSimpleCell(workSheet, rowNumber, 'A', 'Code', true, border1, font4);
    excelFile.setSimpleCell(workSheet, rowNumber, 'B', 'Nom', true, border1, font4);
    excelFile.setSimpleCell(workSheet, rowNumber, 'C', 'Police', true, border1, font4);
    excelFile.setSimpleCell(workSheet, rowNumber, 'D', 'Assuré', true, border1, font4);
    excelFile.setSimpleCell(workSheet, rowNumber, 'E', 'Produit', true, border1, font4);
    excelFile.setSimpleCell(workSheet, rowNumber, 'F', 'Date d\'effet', true, border1, font4);
    excelFile.setSimpleCell(workSheet, rowNumber, 'G', 'Périodicité', true, border1, font4);
    excelFile.setSimpleCell(workSheet, rowNumber, 'H', 'Période', true, border1, font4);
    excelFile.setSimpleCell(workSheet, rowNumber, 'I', 'Montant prélevé TTC', true, border1, font4);
    excelFile.setSimpleCell(workSheet, rowNumber, 'J', 'Période', true, border1, font4);
    excelFile.setSimpleCell(workSheet, rowNumber, 'K', 'Mode', true, border1, font4);
    excelFile.setSimpleCell(workSheet, rowNumber, 'L', 'Montant Base HT', true, border1, font4);
    excelFile.setSimpleCell(workSheet, rowNumber, 'M', 'Taux', true, border1, font4);
    excelFile.setSimpleCell(workSheet, rowNumber, 'N', 'Montant', true, border1, font4);
    rowNumber++;

    let detailDesPolices = dataCourtierOCR.infosOCR.detailDesPolices;

    const debut = rowNumber;
    for (let datas of detailDesPolices) {
        workSheet.getRow(rowNumber).font = font2;
        workSheet.getRow(rowNumber).getCell('A').value = datas.agence.code;
        workSheet.getRow(rowNumber).getCell('B').value = datas.agence.nom;
        workSheet.getRow(rowNumber).getCell('C').value = datas.contrat.police;
        workSheet.getRow(rowNumber).getCell('D').value = datas.contrat.assure;
        workSheet.getRow(rowNumber).getCell('E').value = datas.contrat.produit;
        workSheet.getRow(rowNumber).getCell('F').value = datas.contrat.dateEffet;
        workSheet.getRow(rowNumber).getCell('G').value = datas.prime.periode;
        workSheet.getRow(rowNumber).getCell('H').value = datas.prime.periodicite;
        workSheet.getRow(rowNumber).getCell('I').value = datas.prime.montantPreleveTTC;
        workSheet.getRow(rowNumber).getCell('I').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('J').value = datas.commissions.periode;
        workSheet.getRow(rowNumber).getCell('K').value = datas.commissions.mode;
        workSheet.getRow(rowNumber).getCell('L').value = datas.commissions.montantBaseHT;
        workSheet.getRow(rowNumber).getCell('L').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('M').value = datas.commissions.taux;
        workSheet.getRow(rowNumber).getCell('N').value = datas.commissions.montant;
        workSheet.getRow(rowNumber).getCell('N').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        // if (!data.commissions.verificationMontantCommission) {
        //     workSheet.getRow(rowNumber).getCell('K').fill = {
        //         type: 'pattern',
        //         pattern: 'solid',
        //         fgColor: { argb: 'FF0000' }
        //     };
        // }
        rowNumber++;
    }
    for (let i = debut; i <= rowNumber; i++) {
        workSheet.getRow(i).eachCell((cell, colNumber) => {
            cell.border = border1;
        });
    }
    if (reste) {
        return rowNumber;
    }

}

exports.getOCRSWISSLIFESURCO = (ocr) => {
    const headers = ocr.headers;
    let infosOCR = [];
    ocr.allContratsPerCourtier.forEach((contrat, index) => {
        const dataCourtierOCR = {
            code: {
                cabinet: contrat.courtier.code,
                code: contrat.courtier.code,
            },
            headers,
            datas: contrat.contrats,
            total: contrat.total
        };
        infosOCR.push({ companyGlobalName: 'SWISS LIFE', companyName: 'SWISS LIFE SURCO', infosOCR: dataCourtierOCR });
    });
    return infosOCR;
}

exports.createWorkSheetSWISSLIFESURCO = (workSheet, dataCourtierOCR, reste = false, rowNumberI = null) => {
    let rowNumber = !reste ? 1 : rowNumberI;
    const font1 = { bold: true, name: 'Verdana', size: 8 };
    const font2 = { bold: true, name: 'Verdana', size: 8, color: { argb: 'ff0000' } };
    const font3 = { name: 'Verdana', size: 8 };
    const border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
    workSheet.getColumn('A').width = 10;
    workSheet.getColumn('C').width = 15;
    workSheet.getColumn('D').width = 15;
    workSheet.getColumn('E').width = 25;
    workSheet.getColumn('F').width = 10;
    workSheet.getColumn('G').width = 10;
    workSheet.getColumn('H').width = 10;
    workSheet.getColumn('I').width = 10;
    workSheet.getColumn('J').width = 10;
    workSheet.getColumn('K').width = 5;
    workSheet.getColumn('L').width = 10;
    workSheet.getColumn('M').width = 10;
    workSheet.getColumn('N').width = 10;

    const row1 = workSheet.getRow(rowNumber);
    row1.font = font1;
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        excelFile.setStylizedCell(workSheet, rowNumber, cellNumber, header, true, border, font1, '', '800000');
        cellNumber++;
    });
    rowNumber++;
    row1.height = 50;

    let debut = rowNumber;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        excelFile.setStylizedCell(workSheet, rowNumber, 'A', datas.apporteurVente, true, border, font3);
        excelFile.setStylizedCell(workSheet, rowNumber, 'B', (datas.dateComptabVente) ? datas.dateComptabVente : '', true, border, font3, 'dd/mm/yyyy');
        excelFile.setStylizedCell(workSheet, rowNumber, 'C', datas.numeroPolice, true, border, font3, '');
        excelFile.setStylizedCell(workSheet, rowNumber, 'D', datas.codeProduit, true, border, font3, '');
        excelFile.setStylizedCell(workSheet, rowNumber, 'E', datas.nomClient, true, border, font3, '');
        excelFile.setStylizedCell(workSheet, rowNumber, 'F', datas.cotisationPonderee, true, border, font3, '#,##0.00;\-#,##0.00');
        excelFile.setStylizedCell(workSheet, rowNumber, 'G', datas.montantPP, true, border, font3, '#,##0.00;\-#,##0.00');
        excelFile.setStylizedCell(workSheet, rowNumber, 'H', datas.dontParUCsurPP, true, border, font3, '#,##0.00;\-#,##0.00');
        excelFile.setStylizedCell(workSheet, rowNumber, 'I', datas.montantPU, true, border, font3, '#,##0.00;\-#,##0.00');
        excelFile.setStylizedCell(workSheet, rowNumber, 'J', datas.dontParUCsurPU, true, border, font3, '#,##0.00;\-#,##0.00');
        excelFile.setStylizedCell(workSheet, rowNumber, 'K', datas.tauxChargement, true, border, font3, '');
        excelFile.setStylizedCell(workSheet, rowNumber, 'L', datas.avanceSurco.result, true, border, font3, '#,##0.00;\-#,##0.00');
        excelFile.setStylizedCell(workSheet, rowNumber, 'M', datas.incompressible, true, border, font3, '#,##0.00;\-#,##0.00');
        excelFile.setStylizedCell(workSheet, rowNumber, 'N', datas.avanceComprisRepriseIncompressible.result, true, border, font3, '#,##0.00;\-#,##0.00');
        rowNumber++;
    }
    rowNumber++;

    excelFile.setSimpleCell(workSheet, rowNumber, 'M', 'TOTAL', font2);
    const value = {
        formula: `SUM(N${debut}:N${rowNumber - 2})`,
        result: dataCourtierOCR.infosOCR.total
    };
    excelFile.setStylizedCell(workSheet, rowNumber, 'N', value, false, {}, font2, '#,##0.00"€";\-#,##0.00"€"');
    if (reste) {
        return rowNumber;
    }
}

