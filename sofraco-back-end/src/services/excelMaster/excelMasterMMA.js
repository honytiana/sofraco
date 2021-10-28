const excelFile = require('../utils/excelFile');

exports.getOCRMMAINCITATION = (ocr) => {
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
            infosOCR.push({ company: 'MMA INCITATION', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.getOCRMMAACQUISITION = (ocr) => {
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
            infosOCR.push({ company: 'MMA ACQUISITION', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.getOCRMMAENCOURS = (ocr) => {
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
            infosOCR.push({ company: 'MMA ENCOURS', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetMMAINCITATION = (workSheet, dataCourtierOCR) => {
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

    excelFile.setSimpleCell(workSheet, 3, 'G', dataCourtierOCR.infosOCR.detailsBordereau.row3G, font2);

    excelFile.setSimpleCell(workSheet, 4, 'A', dataCourtierOCR.infosOCR.detailsBordereau.row4A, font2);
    excelFile.setSimpleCell(workSheet, 4, 'G', dataCourtierOCR.infosOCR.detailsBordereau.row4G, font2);

    excelFile.setSimpleCell(workSheet, 5, 'A', dataCourtierOCR.infosOCR.detailsBordereau.row5A, font2);
    excelFile.setSimpleCell(workSheet, 5, 'G', dataCourtierOCR.infosOCR.detailsBordereau.row5G, font2);

    excelFile.setSimpleCell(workSheet, 6, 'A', dataCourtierOCR.infosOCR.detailsBordereau.row6A, font2);
    excelFile.setSimpleCell(workSheet, 6, 'G', dataCourtierOCR.infosOCR.detailsBordereau.row6G, font2);

    excelFile.setSimpleCell(workSheet, 7, 'A', dataCourtierOCR.infosOCR.detailsBordereau.row7A.text, font2);
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

exports.createWorkSheetMMAACQUISITION = (workSheet, dataCourtierOCR) => {
    const font1 = { bold: true, name: 'Arial', size: 10 };
    const font2 = { name: 'Arial', size: 10 };
    const border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    let rowNumber = 1;
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
        excelFile.setStylizedCell(workSheet, rowNumber, 'A', datas.numCourtier, true, border, font2);
        excelFile.setStylizedCell(workSheet, rowNumber, 'B', datas.souscripteur, true, border, font2);
        excelFile.setStylizedCell(workSheet, rowNumber, 'C', datas.dateEffet ? new Date(datas.dateEffet) : '', true, border, font2, 'dd/mm/yyyy');
        excelFile.setStylizedCell(workSheet, rowNumber, 'D', datas.dateEcheance ? new Date(datas.dateEcheance) : '', true, border, font2, 'dd/mm/yyyy');
        excelFile.setStylizedCell(workSheet, rowNumber, 'E', datas.produit, true, border, font2);
        excelFile.setStylizedCell(workSheet, rowNumber, 'F', datas.numContrat, true, border, font2);
        excelFile.setStylizedCell(workSheet, rowNumber, 'G', datas.montant, true, border, font2, '#,##0.00"€";\-#,##0.00"€"');
        excelFile.setStylizedCell(workSheet, rowNumber, 'H', datas.fr, true, border, font2);
        excelFile.setStylizedCell(workSheet, rowNumber, 'I', datas.encaissement, true, border, font2, '#,##0.00"€";\-#,##0.00"€"');
        excelFile.setStylizedCell(workSheet, rowNumber, 'J', datas.escomptee, true, border, font2, '#,##0.00"€";\-#,##0.00"€"');
        excelFile.setStylizedCell(workSheet, rowNumber, 'K', datas.annuelle, true, border, font2, '#,##0.00"€";\-#,##0.00"€"');
        excelFile.setStylizedCell(workSheet, rowNumber, 'L', datas.commissionsSurArbitrage, true, border, font2, '#,##0.00"€";\-#,##0.00"€"');
        excelFile.setStylizedCell(workSheet, rowNumber, 'M', datas.total, true, border, font2, '#,##0.00"€";\-#,##0.00"€"');
        rowNumber++;
    }
    rowNumber++;
    excelFile.setSimpleCell(workSheet, rowNumber, 'L', 'TOTAL', font1);
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('M').value;
    }
    const value =  {
        formula: `SUM(M${debut}:M${rowNumber - 2})`,
        result: result
    };
    excelFile.setStylizedCell(workSheet, rowNumber, 'M', value, false, {}, font1, '#,##0.00"€";\-#,##0.00"€"');
}

exports.createWorkSheetMMAENCOURS = (workSheet, dataCourtierOCR) => {
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

    excelFile.setSimpleCell(workSheet, 3, 'F', dataCourtierOCR.infosOCR.detailsBordereau.row3F, font2);
    excelFile.setSimpleCell(workSheet, 3, 'G', dataCourtierOCR.infosOCR.detailsBordereau.ref, font2);

    excelFile.setSimpleCell(workSheet, 4, 'A', dataCourtierOCR.infosOCR.detailsBordereau.row4A, font2);
    excelFile.setSimpleCell(workSheet, 4, 'G', dataCourtierOCR.infosOCR.detailsBordereau.row4G, font2);

    excelFile.setSimpleCell(workSheet, 5, 'A', dataCourtierOCR.infosOCR.detailsBordereau.row5A, font2);
    excelFile.setSimpleCell(workSheet, 5, 'G', dataCourtierOCR.infosOCR.detailsBordereau.row5G, font2);

    excelFile.setSimpleCell(workSheet, 6, 'A', dataCourtierOCR.infosOCR.detailsBordereau.row6A.text, font2);
    excelFile.setSimpleCell(workSheet, 6, 'G', dataCourtierOCR.infosOCR.detailsBordereau.row6G, font2);

    excelFile.setSimpleCell(workSheet, 7, 'A', dataCourtierOCR.infosOCR.detailsBordereau.row7A.text, font2);
    excelFile.setSimpleCell(workSheet, 7, 'G', dataCourtierOCR.infosOCR.detailsBordereau.row7G, font2);

    let rowNumber = 9;
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
        excelFile.setStylizedCell(workSheet, rowNumber, 'B', datas.numContrat, true, border, font2);
        excelFile.setStylizedCell(workSheet, rowNumber, 'C', datas.nomSouscripteur, true, border, font2);
        excelFile.setStylizedCell(workSheet, rowNumber, 'D', datas.produit, true, border, font2);
        excelFile.setStylizedCell(workSheet, rowNumber, 'E', datas.libelleSupport, true, border, font2);
        excelFile.setStylizedCell(workSheet, rowNumber, 'F', datas.assieteDeRenumeration, true, border, font2, '#,##0.00"€";\-#,##0.00"€"');
        excelFile.setStylizedCell(workSheet, rowNumber, 'G', datas.taux, true, border, font2);
        excelFile.setStylizedCell(workSheet, rowNumber, 'H', datas.commissionSurEncours, true, border, font2, '#,##0.00"€";\-#,##0.00"€"');
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
