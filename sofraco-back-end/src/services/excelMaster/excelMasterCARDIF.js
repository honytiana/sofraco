const excelFile = require('../utils/excelFile');

exports.getOCRCARDIF = (ocr) => {
    const headers = ocr.headers;
    let infosOCR = [];
    ocr.allContratsPerCourtier.forEach((contrat, index) => {
        if (contrat.courtier.code) {
            const dataCourtierOCR = {
                code: {
                    cabinet: contrat.courtier.libelle.replace(/[/]/, '_'),
                    code: contrat.courtier.code,
                },
                headers,
                datas: contrat.contrats
            };
            infosOCR.push({ companyGlobalName: 'CARDIF', companyName: 'CARDIF', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetCARDIF = (workSheet, dataCourtierOCR) => {
    const firstHeaders = dataCourtierOCR.ocr[0].infosOCR.headers.firstHeaders;
    const borderTypeThick = {
        top: { style: 'thick' },
        left: { style: 'thick' },
        bottom: { style: 'thick' },
        right: { style: 'thick' }
    };

    const row1 = workSheet.getRow(1);
    row1.font = { bold: true, name: 'Arial', size: 10 };

    const cellInfos = [
        { workSheet: workSheet, value: firstHeaders[0], rowNumber: 1, cell: 'A', mergedCells: 'A1:B1' },
        { workSheet: workSheet, value: firstHeaders[1], rowNumber: 1, cell: 'C', mergedCells: 'C1:G1' },
        { workSheet: workSheet, value: firstHeaders[2], rowNumber: 1, cell: 'H', mergedCells: 'H1:J1' },
        { workSheet: workSheet, value: firstHeaders[3], rowNumber: 1, cell: 'K', mergedCells: 'K1:L1' },
        { workSheet: workSheet, value: firstHeaders[4], rowNumber: 1, cell: 'M', mergedCells: 'M1:O1' },
        { workSheet: workSheet, value: firstHeaders[5], rowNumber: 1, cell: 'P', mergedCells: 'P1:R1' }
    ];
    cellInfos.forEach((cellInfo, i) => {
        excelFile.setMergedCell(cellInfo, true, borderTypeThick, { bold: true, name: 'Arial', size: 10 }, '', '339966');
    });

    const row2 = workSheet.getRow(2);
    row2.font = { bold: true, name: 'Arial', size: 10 };
    let cellNumber = 1;
    dataCourtierOCR.ocr[0].infosOCR.headers.secondHeaders.forEach((secondHeader, index) => {
        excelFile.setStylizedCell(workSheet, 2, cellNumber, secondHeader, true, borderTypeThick, { bold: true, name: 'Arial', size: 10 }, '', '339966');
        cellNumber++;
    });

    let rowNumber = 3;
    let debut = 3;
    let lignesTotaux = [];
    for (let d of dataCourtierOCR.ocr) {
        for (let datas of d.infosOCR.datas) {
            workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
            workSheet.getRow(rowNumber).getCell('A').value = datas.courtier.code;
            workSheet.getRow(rowNumber).getCell('B').value = datas.courtier.libelle;
            workSheet.getRow(rowNumber).getCell('C').value = datas.commission.reference;
            workSheet.getRow(rowNumber).getCell('D').value = datas.commission.type;
            workSheet.getRow(rowNumber).getCell('E').value = datas.commission.sousType;
            workSheet.getRow(rowNumber).getCell('F').value = (datas.commission.datePriseEnCompte) ? new Date(datas.commission.datePriseEnCompte) : '';
            workSheet.getRow(rowNumber).getCell('F').numFmt = 'dd/mm/yyyy';
            workSheet.getRow(rowNumber).getCell('G').value = (datas.commission.dateEffet) ? new Date(datas.commission.dateEffet) : '';
            workSheet.getRow(rowNumber).getCell('G').numFmt = 'dd/mm/yyyy';
            workSheet.getRow(rowNumber).getCell('H').value = datas.client.numero;
            workSheet.getRow(rowNumber).getCell('I').value = datas.client.nom;
            workSheet.getRow(rowNumber).getCell('J').value = datas.client.prenom;
            workSheet.getRow(rowNumber).getCell('K').value = datas.contrat.numero;
            workSheet.getRow(rowNumber).getCell('L').value = datas.contrat.produit;
            workSheet.getRow(rowNumber).getCell('M').value = datas.supportFinancier.codeISIN;
            workSheet.getRow(rowNumber).getCell('N').value = datas.supportFinancier.libelleSupportFinancier;
            workSheet.getRow(rowNumber).getCell('O').value = datas.supportFinancier.classification;
            workSheet.getRow(rowNumber).getCell('P').value = datas.montantsCommission.assiette;
            workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('Q').value = datas.montantsCommission.taux;
            workSheet.getRow(rowNumber).getCell('R').value = datas.montantsCommission.montant;
            workSheet.getRow(rowNumber).getCell('R').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';
            rowNumber++;
        }
        workSheet.getRow(rowNumber).getCell('Q').value = `TOTAL ${d.particular}`;
        workSheet.getRow(rowNumber).getCell('Q').font = { bold: true, name: 'Arial', size: 10 };
        let result = 0;
        for (let i = debut; i <= rowNumber - 1; i++) {
            result += workSheet.getRow(i).getCell('R').value;
        }
        debut = rowNumber + 1;
        workSheet.getRow(rowNumber).getCell('R').value = {
            formula: `SUM(R${debut}:R${rowNumber - 1})`,
            result: result
        };
        workSheet.getRow(rowNumber).getCell('R').font = { bold: true, name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('R').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';
        lignesTotaux.push({ rowNumber, result });
        rowNumber++;
        rowNumber++;
    }

    excelFile.setSimpleCell(workSheet, rowNumber, 'Q', 'TOTAL', { bold: true, name: 'Arial', size: 10 });
    let result = 0;
    let formula = '';
    for (let total of lignesTotaux) {
        result += total.result;
        if (formula !== '') {
            formula = `${formula}+R${total.rowNumber}`;
        } else {
            formula = `R${total.rowNumber}`;
        }
    }
    const value = {
        formula,
        result
    };
    excelFile.setStylizedCell(workSheet, rowNumber, 'R', value, false, {}, { bold: true, name: 'Arial', size: 10 }, '#,##0.00"€";[Red]\-#,##0.00"€"');
}
