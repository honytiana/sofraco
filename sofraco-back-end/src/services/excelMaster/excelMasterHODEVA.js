const excelFile = require('../utils/excelFile');

exports.getOCRHODEVA = (ocr) => {
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
                datas: contrat.contrats,
                totalMontant: contrat.totalMontant.result
            };
            infosOCR.push({ companyGlobalName: 'HODEVA', companyName: 'HODEVA', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetHODEVA = (workSheet, dataCourtierOCR, reste = false, rowNumberI = null) => {
    const font1 = { bold: true, name: 'Arial', size: 10 };
    const font2 = { bold: true, name: 'Arial', size: 10, color: { argb: 'FFFFFF' } };
    const font3 = { name: 'Arial', size: 10 };
    const border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    let rowNumber = !reste ? 1 : rowNumberI;
    const cellInfo = { workSheet, rowNumber, cell: 'A', value: dataCourtierOCR.infosOCR.code.cabinet, mergedCells: `A${rowNumber}:C${rowNumber}` };
    excelFile.setMergedCell(cellInfo, true, border, font1);
    rowNumber++;

    excelFile.setStylizedCell(workSheet, rowNumber, 'A', dataCourtierOCR.infosOCR.headers.adhesion, true, border, font2, '', 'cc0000');
    excelFile.setStylizedCell(workSheet, rowNumber, 'B', dataCourtierOCR.infosOCR.headers.nom, true, border, font2, '', 'cc0000');
    excelFile.setStylizedCell(workSheet, rowNumber, 'C', dataCourtierOCR.infosOCR.headers.prenom, true, border, font2, '', 'cc0000');
    excelFile.setStylizedCell(workSheet, rowNumber, 'D', dataCourtierOCR.infosOCR.headers.dateEffet, true, border, font2, '', 'cc0000');
    excelFile.setStylizedCell(workSheet, rowNumber, 'E', dataCourtierOCR.infosOCR.headers.montantPrimeHT, true, border, font2, '', 'cc0000');
    excelFile.setStylizedCell(workSheet, rowNumber, 'F', dataCourtierOCR.infosOCR.headers.tauxCommissionnement, true, border, font2, '', 'cc0000');
    excelFile.setStylizedCell(workSheet, rowNumber, 'G', dataCourtierOCR.infosOCR.headers.montantCommissionnement, true, border, font2, '', 'cc0000');
    rowNumber++;

    let debut = rowNumber;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        excelFile.setStylizedCell(workSheet, rowNumber, 'A', datas.adhesion, true, border, font3);
        excelFile.setStylizedCell(workSheet, rowNumber, 'B', datas.nom, true, border, font3);
        excelFile.setStylizedCell(workSheet, rowNumber, 'C', datas.prenom, true, border, font3);
        excelFile.setStylizedCell(workSheet, rowNumber, 'D', (datas.dateEffet) ? new Date(datas.dateEffet) : '', true, border, font3, 'dd/mm/yyyy');
        excelFile.setStylizedCell(workSheet, rowNumber, 'E', datas.montantPrimeHT, true, border, font3, '#,##0.00"€";\-#,##0.00"€"');
        excelFile.setStylizedCell(workSheet, rowNumber, 'F', datas.tauxCommissionnement, true, border, font3, '');
        excelFile.setStylizedCell(workSheet, rowNumber, 'G', datas.montantCommissionnement.result, true, border, font3, '#,##0.00"€";\-#,##0.00"€"');
        rowNumber++;
    }
    excelFile.setSimpleCell(workSheet, rowNumber, 'F', 'TOTAL', font2);
    let result = 0;
    for (let i = debut; i <= rowNumber - 1; i++) {
        result += workSheet.getRow(i).getCell('G').value;
    }
    const value = {
        formula: `SUM(G${debut}:G${rowNumber - 1})`,
        result: result
    };
    excelFile.setStylizedCell(workSheet, rowNumber, 'G', value, false, {}, font2, '#,##0.00"€";\-#,##0.00"€"', 'cc0000');

    if (reste) {
        return rowNumber;
    }
};
