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
    const row1 = workSheet.getRow(1);
    row1.font = { name: 'Arial', size: 10, bold: true };
    row1.getCell('C').value = dataCourtierOCR.infosOCR.detailsBordereau.title;
    row1.getCell('H').value = dataCourtierOCR.infosOCR.detailsBordereau.dateBordereau;

    const row4 = workSheet.getRow(4);
    row4.font = { name: 'Arial', size: 10 };
    row4.getCell('A').value = dataCourtierOCR.infosOCR.detailsBordereau.row4A;
    row4.getCell('G').value = dataCourtierOCR.infosOCR.detailsBordereau.row4G;

    const row5 = workSheet.getRow(5);
    row5.font = { name: 'Arial', size: 10 };
    row5.getCell('A').value = dataCourtierOCR.infosOCR.detailsBordereau.row5A;
    row5.getCell('G').value = dataCourtierOCR.infosOCR.detailsBordereau.row5G;

    const row6 = workSheet.getRow(6);
    row6.font = { name: 'Arial', size: 10 };
    row6.getCell('A').value = dataCourtierOCR.infosOCR.detailsBordereau.row6A;
    row6.getCell('G').value = dataCourtierOCR.infosOCR.detailsBordereau.row6G;

    const row7 = workSheet.getRow(7);
    row7.font = { name: 'Arial', size: 10 };
    row7.getCell('A').value = dataCourtierOCR.infosOCR.detailsBordereau.row7A;
    row7.getCell('G').value = dataCourtierOCR.infosOCR.detailsBordereau.row7G;

    const row8 = workSheet.getRow(8);
    row8.font = { name: 'Arial', size: 10 };
    row8.getCell('H').value = dataCourtierOCR.infosOCR.detailsBordereau.ref;

    let rowNumber = 10;

    const row = workSheet.getRow(rowNumber);
    row.font = { bold: true, name: 'Arial', size: 10 };
    row.height = 40;
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        row.getCell(cellNumber).value = header;
        row.getCell(cellNumber).alignment = { vertical: 'middle', horizontal: 'center' };
        row.getCell(cellNumber).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'f2f2f2' }
        };
        row.getCell(cellNumber).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        cellNumber++;
    });
    rowNumber++;

    let debut = rowNumber;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.codeApporteur;
        workSheet.getRow(rowNumber).getCell('A').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('B').value = datas.nomSouscripteur;
        workSheet.getRow(rowNumber).getCell('B').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('C').value = datas.numContrat;
        workSheet.getRow(rowNumber).getCell('C').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('D').value = datas.dateMouvement ? new Date(datas.dateMouvement) : '';
        workSheet.getRow(rowNumber).getCell('D').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('D').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('E').value = datas.libelleMouvement;
        workSheet.getRow(rowNumber).getCell('E').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('F').value = datas.montant;
        workSheet.getRow(rowNumber).getCell('F').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('F').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('G').value = datas.tauxIncitation;
        workSheet.getRow(rowNumber).getCell('G').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('H').value = datas.montantIncitation;
        workSheet.getRow(rowNumber).getCell('H').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('H').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        rowNumber++;
    }
    rowNumber++;
    workSheet.getRow(rowNumber).getCell('G').value = 'TOTAL';
    workSheet.getRow(rowNumber).getCell('G').font = { bold: true, name: 'Arial', size: 10 };
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('H').value;
    }
    workSheet.getRow(rowNumber).getCell('H').value = {
        formula: `SUM(H${debut}:H${rowNumber - 2})`,
        result: result
    };
    workSheet.getRow(rowNumber).getCell('H').font = { bold: true, name: 'Arial', size: 10 };
    workSheet.getRow(rowNumber).getCell('H').numFmt = '#,##0.00"€";\-#,##0.00"€"';
}


