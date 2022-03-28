const excelFile = require('../utils/excelFile');

exports.getOCRMETLIFE = (ocr) => {
    let infosOCR = []
    for (let info of ocr.infos) {
        const syntheseDesCommissions = info.infos.syntheseDesCommissions;
        const detailDesPolices = info.infos.detailDesPolices;
        infosOCR.push({
            companyGlobalName: 'METLIFE', companyName: 'METLIFE',
            infosOCR: {
                code: {
                    cabinet: syntheseDesCommissions.codeApporteurEmetteur,
                    code: syntheseDesCommissions.codeApporteurEmetteur
                },
                syntheseDesCommissions,
                detailDesPolices,
                headers: info.headers
            }
        });
    }
    return infosOCR;

}

exports.createWorkSheetMETLIFE = (workSheet, dataCourtierOCR, reste = false, rowNumberI = null) => {
    let rowNumber = !reste ? 1 : rowNumberI;
    const font1 = { name: 'Arial', size: 10 };
    const font2 = { name: 'Arial', size: 12, bold: true, color: { argb: '050080' } };
    const font3 = { name: 'Arial', size: 10, color: { argb: '007ac1' } };
    const font4 = { name: 'Arial', size: 10, color: { argb: '002360' } };
    const font5 = { name: 'Arial', size: 11, bold: true, color: { argb: '007ac1' } };
    const font6 = { name: 'Arial', size: 11, color: { argb: '002360' } };
    const font7 = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFF' } };
    const font8 = { name: 'Arial', size: 11, bold: true };

    workSheet.getColumn('A').width = 40;
    const row1 = workSheet.getRow(rowNumber);
    row1.font = font1;
    excelFile.setSimpleCell(workSheet, rowNumber, 'A', 'Synthèse de vos commissions', font2);
    rowNumber++;

    excelFile.setSimpleCell(workSheet, rowNumber, 'A', 'Report solde précédent : ', font3);
    excelFile.setStylizedCell(workSheet, rowNumber, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.reportSoldePrecedent, false, {}, font4, '#,##0.00"€";\-#,##0.00"€"');
    rowNumber++;

    excelFile.setSimpleCell(workSheet, rowNumber, 'A', 'Nombre de polices sur la période : ', font3);
    excelFile.setStylizedCell(workSheet, rowNumber, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.nombrePolicesSurLaPeriode, false, {}, font4);
    rowNumber++;

    excelFile.setSimpleCell(workSheet, rowNumber, 'A', 'Total des primes encaissées sur la période : ', font3);
    excelFile.setStylizedCell(workSheet, rowNumber, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.primesEncaisseesSurLaPeriode, false, {}, font4, '#,##0.00"€";\-#,##0.00"€"');
    rowNumber++;

    excelFile.setSimpleCell(workSheet, rowNumber, 'A', 'Sous-total des commissions calculées sur la période : ', font3);
    excelFile.setStylizedCell(workSheet, rowNumber, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.stCommissionsCalculeesSurLaPeriode, false, {}, font4, '#,##0.00"€";\-#,##0.00"€"');
    rowNumber++;

    excelFile.setSimpleCell(workSheet, rowNumber, 'A', 'Sous-total des commissions reprises sur la période : ', font3);
    excelFile.setStylizedCell(workSheet, rowNumber, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.stCommissionsReprisesSurLaPeriode, false, {}, font4, '#,##0.00"€";\-#,##0.00"€"');
    rowNumber++;

    excelFile.setSimpleCell(workSheet, rowNumber, 'A', 'Sous-total des commissions déduites sur la période : ', font3);
    excelFile.setStylizedCell(workSheet, rowNumber, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.stCommissionsDeduitesSurLaPeriode, false, {}, font4, '#,##0.00"€";\-#,##0.00"€"');
    rowNumber++;

    excelFile.setSimpleCell(workSheet, rowNumber, 'A', 'Sous-total des opérations diverses sur la période : ', font3);
    excelFile.setStylizedCell(workSheet, rowNumber, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.stOperationsDiversesSurLaPeriode, false, {}, font4, '#,##0.00"€";\-#,##0.00"€"');
    rowNumber++;

    excelFile.setSimpleCell(workSheet, rowNumber, 'A', 'Total des commissions dues : ', font5);
    excelFile.setStylizedCell(workSheet, rowNumber, 'B', dataCourtierOCR.infosOCR.syntheseDesCommissions.totalCommissionsDues, false, {}, font6, '#,##0.00"€";\-#,##0.00"€"');
    rowNumber++; rowNumber++; rowNumber++; rowNumber++; rowNumber++; rowNumber++;

    const cellInfoA = { workSheet, rowNumber, cell: 'A', value: 'CONTRAT', mergedCells: `A${rowNumber}:C${rowNumber}` };
    excelFile.setMergedCell(cellInfoA, false, {}, font7, '', '050080');

    const cellInfoD = { workSheet, rowNumber, cell: 'D', value: 'PRIME', mergedCells: `D${rowNumber}:G${rowNumber}` };
    excelFile.setMergedCell(cellInfoD, false, {}, font7, '', '050080');

    const cellInfoH = { workSheet, rowNumber, cell: 'H', value: 'COMMISSIONS', mergedCells: `H${rowNumber}:K${rowNumber}` };
    excelFile.setMergedCell(cellInfoH, false, {}, font7, '', '050080');
    rowNumber++;

    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.secondHeader.forEach((header, index) => {
        excelFile.setStylizedCell(workSheet, rowNumber, cellNumber, header, false, {}, font7, '', '007abc');
        cellNumber++;
    });
    rowNumber++; rowNumber++;
    
    let detailDesPolices = dataCourtierOCR.infosOCR.detailDesPolices;

    for (let datas of detailDesPolices) {
        workSheet.getRow(rowNumber).font = font1;
        let police = null;
        for (let data of datas) {
            if (data.contrat && data.prime && data.commission) {
                police = data.contrat.police;
                workSheet.getRow(rowNumber).font = font1;
                workSheet.getRow(rowNumber).getCell('A').value = data.contrat.police;
                workSheet.getRow(rowNumber).getCell('B').value = data.contrat.assure;
                workSheet.getRow(rowNumber).getCell('C').value = data.contrat.produit;
                workSheet.getRow(rowNumber).getCell('D').value = data.prime.fractionnement;
                workSheet.getRow(rowNumber).getCell('E').value = data.prime.periode;
                workSheet.getRow(rowNumber).getCell('F').value = data.prime.etat;
                workSheet.getRow(rowNumber).getCell('G').value = data.prime.montant;
                workSheet.getRow(rowNumber).getCell('G').numFmt = '#,##0.00"€";\-#,##0.00"€"';
                workSheet.getRow(rowNumber).getCell('H').value = data.commission.mode;
                workSheet.getRow(rowNumber).getCell('I').value = data.commission.taux;
                workSheet.getRow(rowNumber).getCell('J').value = data.commission.status;
                workSheet.getRow(rowNumber).getCell('K').value = data.commission.montant;
                workSheet.getRow(rowNumber).getCell('K').numFmt = '#,##0.00"€";\-#,##0.00"€"';
                rowNumber++;
            }
            if (data.police) {
                workSheet.getRow(rowNumber).getCell('G').value = 'Sous-total police';
                workSheet.getRow(rowNumber).getCell('G').font = font8;
                workSheet.getRow(rowNumber).getCell('I').value = police;
                workSheet.getRow(rowNumber).getCell('I').font = font8;
                workSheet.getRow(rowNumber).getCell('K').value = data.sousTotalPolice !== null ? data.sousTotalPolice : '';
                workSheet.getRow(rowNumber).getCell('K').font = font8;
                workSheet.getRow(rowNumber).getCell('K').numFmt = '#,##0.00"€";\-#,##0.00"€"';
                rowNumber++;
                rowNumber++;
            }
        }
    }
    if (reste) {
        return rowNumber;
    }

}
