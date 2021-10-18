const excelFile = require('../utils/excelFile');

exports.getOCRMMA = (ocr) => {
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
                detailsBordereau: ocr.detailsBordereau,
                datas: contrat.contrats
            };
            infosOCR.push({ company: 'MMA', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetMMA = (workSheet, dataCourtierOCR) => {
    const font1 = { bold: true, name: 'Arial', size: 10 };
    const font2 = { name: 'Arial', size: 10 };
    const border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    excelFile.setSimpleCell(workSheet, 1, 'C', dataCourtierOCR.infosOCR.detailsBordereau.title, font1);
    excelFile.setSimpleCell(workSheet, 1, 'H', dataCourtierOCR.infosOCR.detailsBordereau.dateBordereau, font1);

    excelFile.setSimpleCell(workSheet, 4, 'A', dataCourtierOCR.infosOCR.detailsBordereau.row4A, font2);
    excelFile.setSimpleCell(workSheet, 4, 'G', dataCourtierOCR.infosOCR.detailsBordereau.row4G, font2);

    excelFile.setSimpleCell(workSheet, 5, 'A', dataCourtierOCR.infosOCR.detailsBordereau.row5A, font2);
    excelFile.setSimpleCell(workSheet, 5, 'G', dataCourtierOCR.infosOCR.detailsBordereau.row5G, font2);

    excelFile.setSimpleCell(workSheet, 6, 'A', dataCourtierOCR.infosOCR.detailsBordereau.row6A, font2);
    excelFile.setSimpleCell(workSheet, 6, 'G', dataCourtierOCR.infosOCR.detailsBordereau.row6G, font2);

    excelFile.setSimpleCell(workSheet, 7, 'A', dataCourtierOCR.infosOCR.detailsBordereau.row7A, font2);
    excelFile.setSimpleCell(workSheet, 7, 'G', dataCourtierOCR.infosOCR.detailsBordereau.row7G, font2);

    excelFile.setSimpleCell(workSheet, 8, 'H', dataCourtierOCR.infosOCR.detailsBordereau.ref, font2);

    let rowNumber = 10;
    const row = workSheet.getRow(rowNumber);
    row.font = font1;
    row.height = 40;
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        excelFile.setStylizedCell(workSheet, rowNumber, cellNumber, header, true, border, font1, '', 'f2f2f2');
        cellNumber++;
    });
    rowNumber++;

    let debut = rowNumber;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        excelFile.setStylizedCell(workSheet, rowNumber, 'A', datas.codeApporteur, true, border, font2);
        excelFile.setStylizedCell(workSheet, rowNumber, 'B', datas.nomSouscripteur, true, border, font2);
        excelFile.setStylizedCell(workSheet, rowNumber, 'C', datas.numContrat, true, border, font2);
        excelFile.setStylizedCell(workSheet, rowNumber, 'D', datas.dateMouvement ? new Date(datas.dateMouvement) : '', true, border, font2, 'dd/mm/yyyy');
        excelFile.setStylizedCell(workSheet, rowNumber, 'E', datas.libelleMouvement, true, border, font2);
        excelFile.setStylizedCell(workSheet, rowNumber, 'F', datas.montant, true, border, font2, '#,##0.00"€";\-#,##0.00"€"');
        excelFile.setStylizedCell(workSheet, rowNumber, 'G', datas.tauxIncitation, true, border, font2);
        excelFile.setStylizedCell(workSheet, rowNumber, 'H', datas.montantIncitation, true, border, font2, '#,##0.00"€";\-#,##0.00"€"');
        rowNumber++;
    }
    rowNumber++;
    excelFile.setSimpleCell(workSheet, rowNumber, 'G', 'TOTAL', font1);
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('H').value;
    }
    const value =  {
        formula: `SUM(H${debut}:H${rowNumber - 2})`,
        result: result
    };
    excelFile.setStylizedCell(workSheet, rowNumber, 'H', value, false, {}, font1, '#,##0.00"€";\-#,##0.00"€"');
}


