const excelFile = require('../utils/excelFile');

exports.getOCRMETLIFE = (ocr) => {
    let infosOCR = []
    for (let info of ocr.infos) {
        const syntheseDesCommissions = info.syntheseDesCommissions;
        const detailDesPolices = info.detailDesPolices;
        infosOCR.push({
            company: 'METLIFE', infosOCR: {
                code: {
                    cabinet: syntheseDesCommissions.codeApporteurEmetteur,
                    code: syntheseDesCommissions.codeApporteurEmetteur
                },
                syntheseDesCommissions,
                detailDesPolices
            }
        });
    }
    return infosOCR;

}

exports.createWorkSheetMETLIFE = (workSheet, dataCourtierOCR) => {
    const font1 = { name: 'Arial', size: 10 };
    const font2 = { name: 'Arial', size: 12, bold: true, color: { argb: '050080' } };
    const font3 = { name: 'Arial', size: 10, color: { argb: '007ac1' } };
    const font4 = { name: 'Arial', size: 10, color: { argb: '002360' } };
    const font5 = { name: 'Arial', size: 11, bold: true, color: { argb: '007ac1' } };
    const font6 = { name: 'Arial', size: 11, color: { argb: '002360' } };
    const font7 = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFF' } };
    const font8 = { name: 'Arial', size: 11, bold: true };

    workSheet.getColumn('A').width = 40;
    const row1 = workSheet.getRow(1);
    row1.font = font1;
    excelFile.setSimpleCell(workSheet, 1, 'A', 'Synthèse de vos commissions', font2);

    excelFile.setSimpleCell(workSheet, 2, 'A', 'Report solde précédent : ', font3);
    excelFile.setStylizedCell(workSheet, 2, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.reportSoldePrecedent, false, {}, font4, '#,##0.00"€";\-#,##0.00"€"');

    excelFile.setSimpleCell(workSheet, 3, 'A', 'Nombre de polices sur la période : ', font3);
    excelFile.setStylizedCell(workSheet, 3, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.nombrePolicesSurLaPeriode, false, {}, font4);

    excelFile.setSimpleCell(workSheet, 4, 'A', 'Total des primes encaissées sur la période : ', font3);
    excelFile.setStylizedCell(workSheet, 4, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.primesEncaisseesSurLaPeriode, false, {}, font4, '#,##0.00"€";\-#,##0.00"€"');

    const row5 = workSheet.getRow(5);
    excelFile.setSimpleCell(workSheet, 5, 'A', 'Sous-total des commissions calculées sur la période : ', font3);
    excelFile.setStylizedCell(workSheet, 5, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.stCommissionsCalculeesSurLaPeriode, false, {}, font4, '#,##0.00"€";\-#,##0.00"€"');

    const row6 = workSheet.getRow(6);
    excelFile.setSimpleCell(workSheet, 6, 'A', 'Sous-total des commissions reprises sur la période : ', font3);
    excelFile.setStylizedCell(workSheet, 6, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.stCommissionsReprisesSurLaPeriode, false, {}, font4, '#,##0.00"€";\-#,##0.00"€"');

    const row7 = workSheet.getRow(7);
    excelFile.setSimpleCell(workSheet, 7, 'A', 'Sous-total des commissions déduites sur la période : ', font3);
    excelFile.setStylizedCell(workSheet, 7, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.stCommissionsDeduitesSurLaPeriode, false, {}, font4, '#,##0.00"€";\-#,##0.00"€"');

    const row8 = workSheet.getRow(8);
    excelFile.setSimpleCell(workSheet, 8, 'A', 'Sous-total des opérations diverses sur la période : ', font3);
    excelFile.setStylizedCell(workSheet, 8, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.stOperationsDiversesSurLaPeriode, false, {}, font4, '#,##0.00"€";\-#,##0.00"€"');

    const row9 = workSheet.getRow(9);
    excelFile.setSimpleCell(workSheet, 9, 'A', 'Total des commissions dues : ', font5);
    excelFile.setStylizedCell(workSheet, 9, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.totalCommissionsDues, false, {}, font6, '#,##0.00"€";\-#,##0.00"€"');

    const cellInfoA = { workSheet, rowNumber: 15, cell: 'A', value: 'CONTRAT', mergedCells: 'A15:C15' };
    excelFile.setMergedCell(cellInfoA, false, {}, font7, '', '050080');

    const cellInfoD = { workSheet, rowNumber: 15, cell: 'D', value: 'PRIME', mergedCells: 'D15:G15' };
    excelFile.setMergedCell(cellInfoD, false, {}, font7, '', '050080');

    const cellInfoH = { workSheet, rowNumber: 15, cell: 'H', value: 'COMMISSIONS', mergedCells: 'H15:K15' };
    excelFile.setMergedCell(cellInfoH, false, {}, font7, '', '050080');

    excelFile.setStylizedCell(workSheet, 16, 'A', 'Police', false, {}, font7, '', '007abc');
    excelFile.setStylizedCell(workSheet, 16, 'B', 'Assuré', false, {}, font7, '', '007abc');
    excelFile.setStylizedCell(workSheet, 16, 'C', 'Produit', false, {}, font7, '', '007abc');
    excelFile.setStylizedCell(workSheet, 16, 'D', 'Fractionnement', false, {}, font7, '', '007abc');
    excelFile.setStylizedCell(workSheet, 16, 'E', 'Période', false, {}, font7, '', '007abc');
    excelFile.setStylizedCell(workSheet, 16, 'F', 'Etat', false, {}, font7, '', '007abc');
    excelFile.setStylizedCell(workSheet, 16, 'G', 'Montant', false, {}, font7, '', '007abc');
    excelFile.setStylizedCell(workSheet, 16, 'H', 'Mode', false, {}, font7, '', '007abc');
    excelFile.setStylizedCell(workSheet, 16, 'I', 'Taux', false, {}, font7, '', '007abc');
    excelFile.setStylizedCell(workSheet, 16, 'j', 'Statut', false, {}, font7, '', '007abc');
    excelFile.setStylizedCell(workSheet, 16, 'K', 'Montant', false, {}, font7, '', '007abc');

    
    let detailDesPolices = dataCourtierOCR.infosOCR.detailDesPolices;

    let rowNumber = 18;
    for (let datas of detailDesPolices) {
        workSheet.getRow(rowNumber).font = font1;
        for (let data of datas.police) {
            workSheet.getRow(rowNumber).font = font1;
            workSheet.getRow(rowNumber).getCell('A').value = datas.sousTotalPolice || data.contrat.police;
            workSheet.getRow(rowNumber).getCell('B').value = data.contrat.assure;
            workSheet.getRow(rowNumber).getCell('C').value = data.contrat.produit;
            workSheet.getRow(rowNumber).getCell('D').value = data.prime.fractionnement;
            workSheet.getRow(rowNumber).getCell('E').value = data.prime.periode;
            workSheet.getRow(rowNumber).getCell('F').value = data.prime.etat;
            workSheet.getRow(rowNumber).getCell('G').value = data.prime.montant;
            workSheet.getRow(rowNumber).getCell('G').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('H').value = data.commissions.mode;
            workSheet.getRow(rowNumber).getCell('I').value = data.commissions.taux;
            workSheet.getRow(rowNumber).getCell('J').value = data.commissions.status;
            workSheet.getRow(rowNumber).getCell('K').value = data.commissions.montant;
            workSheet.getRow(rowNumber).getCell('K').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            if (!data.commissions.verificationMontantCommission) {
                workSheet.getRow(rowNumber).getCell('K').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF0000' }
                };
            }
            rowNumber++;
        }
        workSheet.getRow(rowNumber).getCell('G').value = 'Sous-total police';
        workSheet.getRow(rowNumber).getCell('G').font = font8;
        workSheet.getRow(rowNumber).getCell('I').value = datas.sousTotalPolice;
        workSheet.getRow(rowNumber).getCell('I').font = font8;
        workSheet.getRow(rowNumber).getCell('K').value = datas.sousTotalPoliceMontant;
        workSheet.getRow(rowNumber).getCell('K').font = font8;
        workSheet.getRow(rowNumber).getCell('K').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        if (!datas.verifSousTotalPoliceMonant) {
            workSheet.getRow(rowNumber).getCell('K').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF0000' }
            };
        }
        rowNumber++;
        rowNumber++;
    }

}
