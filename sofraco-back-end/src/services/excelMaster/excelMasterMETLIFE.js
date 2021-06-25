
exports.getOCRMETLIFE = (ocr) => {
    let infosOCR = []
    const syntheseDesCommissions = ocr.syntheseDesCommissions;
    const detailDesPolices = ocr.detailDesPolices;

    infosOCR.push({ company: 'METLIFE', infosOCR: { syntheseDesCommissions, detailDesPolices } });
    return infosOCR;

}

exports.createWorkSheetMETLIFE = (workSheet, dataCourtierOCR) => {
    workSheet.eachRow((row, rowNumber) => {
        row.font = { name: 'Calibri' };
    });
    workSheet.getColumn('A').width = 40;
    const row1 = workSheet.getRow(1);
    row1.getCell('A').value = 'Synthèse de vos commissions';
    row1.getCell('A').font = { bold: true, color: { argb: '00008B' } };

    const row2 = workSheet.getRow(2);
    row2.getCell('A').value = 'Report solde précédent : ';
    row2.getCell('A').font = { color: { argb: '1E90FF' } };
    row2.getCell('B').value = dataCourtierOCR.infosOCR.syntheseDesCommissions.reportSoldePrecedent;
    row2.getCell('B').numFmt = '####,##0.00"€";\-####,##0.00"€"';
    row2.getCell('B').font = { color: { argb: '00008B' } };

    const row3 = workSheet.getRow(3);
    row3.getCell('A').value = 'Nombre de polices sur la période : ';
    row3.getCell('A').font = { color: { argb: '1E90FF' } };
    row3.getCell('B').value = dataCourtierOCR.infosOCR.syntheseDesCommissions.nombrePolicesSurLaPeriode;
    row3.getCell('B').font = { color: { argb: '00008B' } };

    const row4 = workSheet.getRow(4);
    row4.getCell('A').value = 'Total des primes encaissées sur la période : ';
    row4.getCell('A').font = { color: { argb: '1E90FF' } };
    row4.getCell('B').value = dataCourtierOCR.infosOCR.syntheseDesCommissions.primesEncaisseesSurLaPeriode;
    row4.getCell('B').numFmt = '####,##0.00"€";\-####,##0.00"€"';
    row4.getCell('B').font = { color: { argb: '00008B' } };

    const row5 = workSheet.getRow(5);
    row5.getCell('A').value = 'Sous-total des commissions calculées sur la période : ';
    row5.getCell('A').font = { color: { argb: '1E90FF' } };
    row5.getCell('B').value = dataCourtierOCR.infosOCR.syntheseDesCommissions.stCommissionsCalculeesSurLaPeriode;
    row5.getCell('B').numFmt = '####,##0.00"€";\-####,##0.00"€"';
    row5.getCell('B').font = { color: { argb: '00008B' } };

    const row6 = workSheet.getRow(6);
    row6.getCell('A').value = 'Sous-total des commissions reprises sur la période : ';
    row6.getCell('A').font = { color: { argb: '1E90FF' } };
    row6.getCell('B').value = dataCourtierOCR.infosOCR.syntheseDesCommissions.stCommissionsReprisesSurLaPeriode;
    row6.getCell('B').numFmt = '####,##0.00"€";\-####,##0.00"€"';
    row6.getCell('B').font = { color: { argb: '00008B' } };

    const row7 = workSheet.getRow(7);
    row7.getCell('A').value = 'Sous-total des commissions déduites sur la période : ';
    row7.getCell('A').font = { color: { argb: '1E90FF' } };
    row7.getCell('B').value = dataCourtierOCR.infosOCR.syntheseDesCommissions.stCommissionsDeduitesSurLaPeriode;
    row7.getCell('B').numFmt = '####,##0.00"€";\-####,##0.00"€"';
    row7.getCell('B').font = { color: { argb: '00008B' } };

    const row8 = workSheet.getRow(8);
    row8.getCell('A').value = 'Sous-total des opérations diverses sur la période : ';
    row8.getCell('A').font = { color: { argb: '1E90FF' } };
    row8.getCell('B').value = dataCourtierOCR.infosOCR.syntheseDesCommissions.stOperationsDiversesSurLaPeriode;
    row8.getCell('B').numFmt = '####,##0.00"€";\-####,##0.00"€"';
    row8.getCell('B').font = { color: { argb: '00008B' } };

    const row9 = workSheet.getRow(9);
    row9.getCell('A').value = 'Total des commissions dues : ';
    row9.getCell('A').font = { bold: true, color: { argb: '1E90FF' } };
    row9.getCell('B').value = dataCourtierOCR.infosOCR.syntheseDesCommissions.totalCommissionsDues;
    row9.getCell('B').numFmt = '####,##0.00"€";\-####,##0.00"€"';
    row9.getCell('B').font = { color: { argb: '00008B' } };

    const row15 = workSheet.getRow(15);
    workSheet.mergeCells('A15:C15');
    workSheet.mergeCells('D15:G15');
    workSheet.mergeCells('H15:K15');
    row15.getCell('A').value = 'CONTRAT';
    row15.getCell('A').alignment = { horizontal: 'center' };
    row15.getCell('A').font = { bold: true, color: { argb: 'FFFFFF' } };
    row15.getCell('A').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '00008B' }
    }
    row15.getCell('D').value = 'PRIME';
    row15.getCell('D').alignment = { horizontal: 'center' };
    row15.getCell('D').font = { bold: true, color: { argb: 'FFFFFF' } };
    row15.getCell('D').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '00008B' }
    };
    row15.getCell('H').value = 'COMMISSIONS';
    row15.getCell('H').alignment = { horizontal: 'center' };
    row15.getCell('H').font = { bold: true, color: { argb: 'FFFFFF' } };
    row15.getCell('H').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '00008B' }
    };

    const row16 = workSheet.getRow(16);
    row16.getCell('A').value = 'Police';
    row16.getCell('A').font = { bold: true, color: { argb: 'FFFFFF' } };
    row16.getCell('A').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4169E1' }
    };

    row16.getCell('B').value = 'Assuré';
    row16.getCell('B').font = { bold: true, color: { argb: 'FFFFFF' } };
    row16.getCell('B').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4169E1' }
    };

    row16.getCell('C').value = 'Produit';
    row16.getCell('C').font = { bold: true, color: { argb: 'FFFFFF' } };
    row16.getCell('C').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4169E1' }
    };

    row16.getCell('D').value = 'Fractionnement';
    row16.getCell('D').font = { bold: true, color: { argb: 'FFFFFF' } };
    row16.getCell('D').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4169E1' }
    };

    row16.getCell('E').value = 'Période';
    row16.getCell('E').font = { bold: true, color: { argb: 'FFFFFF' } };
    row16.getCell('E').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4169E1' }
    };

    row16.getCell('F').value = 'Etat';
    row16.getCell('F').font = { bold: true, color: { argb: 'FFFFFF' } };
    row16.getCell('F').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4169E1' }
    };

    row16.getCell('G').value = 'Montant';
    row16.getCell('G').font = { bold: true, color: { argb: 'FFFFFF' } };
    row16.getCell('G').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4169E1' }
    };

    row16.getCell('H').value = 'Mode';
    row16.getCell('H').font = { bold: true, color: { argb: 'FFFFFF' } };
    row16.getCell('H').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4169E1' }
    };

    row16.getCell('I').value = 'Taux';
    row16.getCell('I').font = { bold: true, color: { argb: 'FFFFFF' } };
    row16.getCell('I').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4169E1' }
    };

    row16.getCell('J').value = 'Statut';
    row16.getCell('J').font = { bold: true, color: { argb: 'FFFFFF' } };
    row16.getCell('J').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4169E1' }
    };

    row16.getCell('K').value = 'Montant';
    row16.getCell('K').font = { bold: true, color: { argb: 'FFFFFF' } };
    row16.getCell('K').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4169E1' }
    };


    let detailDesPolices = dataCourtierOCR.infosOCR.detailDesPolices;

    let rowNumber = 18;
    for (let data of detailDesPolices) {
        workSheet.getRow(rowNumber).getCell('A').value = data.sousTotalPolice || data.contrat.police;
        workSheet.getRow(rowNumber).getCell('B').value = data.contrat.assure;
        workSheet.getRow(rowNumber).getCell('C').value = data.contrat.produit;
        workSheet.getRow(rowNumber).getCell('D').value = data.prime.fractionnement;
        workSheet.getRow(rowNumber).getCell('E').value = data.prime.periode;
        workSheet.getRow(rowNumber).getCell('F').value = data.prime.etat;
        workSheet.getRow(rowNumber).getCell('G').value = data.prime.montant;
        workSheet.getRow(rowNumber).getCell('G').numFmt = '####,##0.00"€";\-####,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('H').value = data.commissions.mode;
        workSheet.getRow(rowNumber).getCell('I').value = data.commissions.taux;
        workSheet.getRow(rowNumber).getCell('J').value = data.commissions.status;
        workSheet.getRow(rowNumber).getCell('K').value = data.commissions.montant;
        workSheet.getRow(rowNumber).getCell('K').numFmt = '####,##0.00"€";\-####,##0.00"€"';
        rowNumber++;
        workSheet.getRow(rowNumber).getCell('G').value = 'Sous-total police';
        workSheet.getRow(rowNumber).getCell('I').value = data.sousTotalPolice;
        workSheet.getRow(rowNumber).getCell('K').value = data.sousTotalMontant;
        workSheet.getRow(rowNumber).getCell('K').numFmt = '####,##0.00"€";\-####,##0.00"€"';
        rowNumber++;
        rowNumber++;
    }

}
