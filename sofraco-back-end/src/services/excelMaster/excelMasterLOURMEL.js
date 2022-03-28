const excelFile = require('../utils/excelFile');

exports.getOCRLOURMEL = (ocr) => {
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
            infosOCR.push({ companyGlobalName: 'LOURMEL', companyName: 'LOURMEL', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetLOURMEL = (workSheet, dataCourtierOCR, reste = false, rowNumberI = null) => {
    let rowNumber = !reste ? 1 : rowNumberI;
    const font1 = { name: 'Arial', size: 10 };
    const border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
    const row1 = workSheet.getRow(rowNumber);
    row1.font = { bold: true, name: 'Arial', size: 10 };
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        row1.getCell(cellNumber).value = header;
        cellNumber++;
    });
    rowNumber++;

    let debut = rowNumber;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        excelFile.setStylizedCell(workSheet, rowNumber, 'A', datas.a, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'B', datas.b, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'C', datas.courtier, true, border, font1, '', 'ffff00');
        excelFile.setStylizedCell(workSheet, rowNumber, 'D', datas.d, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'E', datas.e, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'F', datas.f, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'G', datas.genre, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'H', datas.nom, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'I', datas.prenom, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'J', datas.nomDeNaissance, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'K', datas.k, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'L', datas.l, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'M', datas.codePostal, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'N', datas.ville, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'O', datas.o, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'P', datas.p, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'Q', datas.q, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'R', datas.r, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'S', datas.s, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'T', datas.dateEffet, true, border, font1, 'dd/mm/yyyy');
        excelFile.setStylizedCell(workSheet, rowNumber, 'U', typeof datas.montantCotisation === 'string' ? parseFloat(datas.montantCotisation.replace(/\s/g, '').replace(',', '.')) : datas.montantCotisation, true, border, font1, '#,##0.00"€";\-#,##0.00"€"');
        excelFile.setStylizedCell(workSheet, rowNumber, 'V', datas.v, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'W', datas.dateDebut, true, border, font1, 'dd/mm/yyyy');
        excelFile.setStylizedCell(workSheet, rowNumber, 'X', datas.dateFin, true, border, font1, 'dd/mm/yyyy');
        excelFile.setStylizedCell(workSheet, rowNumber, 'Y', datas.tauxCommission, true, border, font1);
        excelFile.setStylizedCell(workSheet, rowNumber, 'Z', typeof datas.montantCommission === 'string' ? parseFloat(datas.montantCommission.replace(/\s/g, '').replace(',', '.')) : datas.montantCommission, true, border, font1, '#,##0.00"€";\-#,##0.00"€"', 'ffff00');
        rowNumber++;
    }
    excelFile.setSimpleCell(workSheet, rowNumber, 'Y', 'TOTAL', { bold: true, name: 'Arial', size: 10 });
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('Z').value;
    }
    const value = {
        formula: `SUM(Z${debut}:Z${rowNumber - 1})`,
        result: result
    };
    excelFile.setStylizedCell(workSheet, rowNumber, 'Z', value, false, {}, { bold: true, name: 'Arial', size: 10 }, '#,##0.00"€";\-#,##0.00"€"', 'ffff00');
    if (reste) {
        return rowNumber;
    }
}


