const excelFile = require('../utils/excelFile');

exports.getOCRSLADE = (ocr) => {
    let infosOCR = []
    for (let info of ocr.infos) {
        const syntheseDesCommissions = info.syntheseDesCommissions;
        const detailDesPolices = info.detailDesPolices;
        infosOCR.push({
            company: 'SLADE', infosOCR: {
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

exports.createWorkSheetSLADE = (workSheet, dataCourtierOCR) => {
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
    excelFile.setSimpleCell(workSheet, 1, 'A', 'Synthèse de vos commissions', font1);

    excelFile.setStylizedCell(workSheet, 3, 'A', 'Nombre de primes sur la période : ', true, border1, font2);
    excelFile.setStylizedCell(workSheet, 3, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.nombrePrimeSurLaPeriode, true, border1, font2);

    excelFile.setStylizedCell(workSheet, 4, 'A', 'Total des primes encaissées sur la période : ', true, border1, font2);
    excelFile.setStylizedCell(workSheet, 4, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.totalPrimesEncaisseesSurLaPeriode, true, border1, font2, '#,##0.00"€";\-#,##0.00"€"');

    excelFile.setStylizedCell(workSheet, 5, 'A', 'Total des commissions calculées sur la période : ', true, border1, font2);
    excelFile.setStylizedCell(workSheet, 5, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.totalCommissionsCalculeesSurLaPeriode, true, border1, font2, '#,##0.00"€";\-#,##0.00"€"');

    excelFile.setStylizedCell(workSheet, 6, 'A', 'Report solde précédent : ', true, border1, font2);
    excelFile.setStylizedCell(workSheet, 6, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.reportSoldePrecedent, true, border1, font2, '#,##0.00"€";\-#,##0.00"€"');

    excelFile.setStylizedCell(workSheet, 7, 'A', 'Total des commissions dues : ', true, border1, font2);
    excelFile.setStylizedCell(workSheet, 7, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.totalCommissionsDues, true, border1, font2, '#,##0.00"€";\-#,##0.00"€"');

    excelFile.setSimpleCell(workSheet, 9, 'A', 'BORDEREAU DE COMMISSIONS', font3);
    excelFile.setSimpleCell(workSheet, 10, 'A', 'Détail des polices', font3);

    const cellInfoA = { workSheet, rowNumber: 12, cell: 'A', value: 'AGENCE', mergedCells: 'A12:B12' };
    excelFile.setMergedCell(cellInfoA, true, border1, font4);

    const cellInfoC = { workSheet, rowNumber: 12, cell: 'C', value: 'CONTRAT', mergedCells: 'C12:F12' };
    excelFile.setMergedCell(cellInfoC, true, border1, font4);

    const cellInfoG = { workSheet, rowNumber: 12, cell: 'G', value: 'PRIME', mergedCells: 'G12:I12' };
    excelFile.setMergedCell(cellInfoG, true, border1, font4);

    const cellInfoJ = { workSheet, rowNumber: 12, cell: 'J', value: 'COMMISSIONS', mergedCells: 'J12:N12' };
    excelFile.setMergedCell(cellInfoJ, true, border1, font4);

    excelFile.setSimpleCell(workSheet, 13, 'A', 'Code', true, border1, font4);
    excelFile.setSimpleCell(workSheet, 13, 'B', 'Nom', true, border1, font4);
    excelFile.setSimpleCell(workSheet, 13, 'C', 'Police', true, border1, font4);
    excelFile.setSimpleCell(workSheet, 13, 'D', 'Assuré', true, border1, font4);
    excelFile.setSimpleCell(workSheet, 13, 'E', 'Produit', true, border1, font4);
    excelFile.setSimpleCell(workSheet, 13, 'F', 'Date d\'effet', true, border1, font4);
    excelFile.setSimpleCell(workSheet, 13, 'G', 'Périodicité', true, border1, font4);
    excelFile.setSimpleCell(workSheet, 13, 'H', 'Période', true, border1, font4);
    excelFile.setSimpleCell(workSheet, 13, 'I', 'Montant prélevé TTC', true, border1, font4);
    excelFile.setSimpleCell(workSheet, 13, 'J', 'Période', true, border1, font4);
    excelFile.setSimpleCell(workSheet, 13, 'K', 'Mode', true, border1, font4);
    excelFile.setSimpleCell(workSheet, 13, 'L', 'Montant Base HT', true, border1, font4);
    excelFile.setSimpleCell(workSheet, 13, 'M', 'Taux', true, border1, font4);
    excelFile.setSimpleCell(workSheet, 13, 'N', 'Montant', true, border1, font4);

    let detailDesPolices = dataCourtierOCR.infosOCR.detailDesPolices;

    let rowNumber = 14;
    const debut = 14;
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
            datas: contrat.contrats
        };
        infosOCR.push({ company: 'SWISSLIFE SURCO', infosOCR: dataCourtierOCR });
    });
    return infosOCR;
}

exports.createWorkSheetSWISSLIFESURCO = (workSheet, dataCourtierOCR) => {
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

    const row1 = workSheet.getRow(1);
    row1.font = font1;
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        excelFile.setStylizedCell(workSheet, 1, cellNumber, header, true, border, font1, '', '800000');
        cellNumber++;
    });
    row1.height = 50;

    let rowNumber = 2;
    let debut = 2;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        excelFile.setStylizedCell(workSheet, rowNumber, 'A', datas.apporteurVente, true, border, font3);
        excelFile.setStylizedCell(workSheet, rowNumber, 'B', (datas.dateComptabVente) ? new Date(0, 0, datas.dateComptabVente, 0, 0, 0) : '', true, border, font3, 'dd/mm/yyyy');
        excelFile.setStylizedCell(workSheet, rowNumber, 'C', datas.numeroPolice, true, border, font3, '');
        excelFile.setStylizedCell(workSheet, rowNumber, 'D', datas.codeProduit, true, border, font3, '');
        excelFile.setStylizedCell(workSheet, rowNumber, 'E', datas.nomClient, true, border, font3, '');
        excelFile.setStylizedCell(workSheet, rowNumber, 'F', datas.cotisationPonderee, true, border, font3, '#,##0.00;\-#,##0.00');
        excelFile.setStylizedCell(workSheet, rowNumber, 'G', datas.montantPP, true, border, font3, '#,##0.00;\-#,##0.00');
        excelFile.setStylizedCell(workSheet, rowNumber, 'H', datas.dontParUCsurPP, true, border, font3, '#,##0.00;\-#,##0.00');
        excelFile.setStylizedCell(workSheet, rowNumber, 'I', datas.montantPU, true, border, font3, '#,##0.00;\-#,##0.00');
        excelFile.setStylizedCell(workSheet, rowNumber, 'J', datas.dontParUCsurPU, true, border, font3, '#,##0.00;\-#,##0.00');
        excelFile.setStylizedCell(workSheet, rowNumber, 'K', datas.tauxChargement, true, border, font3, '');
        excelFile.setStylizedCell(workSheet, rowNumber, 'L', datas.avanceSurco, true, border, font3, '#,##0.00;\-#,##0.00');
        excelFile.setStylizedCell(workSheet, rowNumber, 'M', datas.incompressible, true, border, font3, '#,##0.00;\-#,##0.00');
        excelFile.setStylizedCell(workSheet, rowNumber, 'N', datas.avanceComprisRepriseIncompressible, true, border, font3, '#,##0.00;\-#,##0.00');
        rowNumber++;
    }
    rowNumber++;

    excelFile.setSimpleCell(workSheet, rowNumber, 'M', 'TOTAL', font2);
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('N').value;
    }
    const value = {
        formula: `SUM(N${debut}:N${rowNumber - 2})`,
        result: result
    };
    excelFile.setStylizedCell(workSheet, rowNumber, 'N', value, false, {}, font2, '#,##0.00"€";\-#,##0.00"€"');
}

