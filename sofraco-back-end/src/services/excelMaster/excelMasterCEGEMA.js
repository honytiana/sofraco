exports.getOCRCEGEMA = (ocr) => {
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
            infosOCR.push({ company: 'CEGEMA', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetCEGEMA = (workSheet, dataCourtierOCR) => {
    const row1 = workSheet.getRow(1);
    row1.font = { bold: true, name: 'Arial', size: 10 };
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        row1.getCell(cellNumber).value = header;
        cellNumber++;
    });

    let rowNumber = 2;
    let debut = 2;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.courtier;
        workSheet.getRow(rowNumber).getCell('B').value = datas.nomAdherent;
        workSheet.getRow(rowNumber).getCell('C').value = datas.numAdhesion;
        workSheet.getRow(rowNumber).getCell('D').value = datas.garantie;
        workSheet.getRow(rowNumber).getCell('E').value = (datas.effetAu) ? new Date(datas.effetAu) : '';
        workSheet.getRow(rowNumber).getCell('E').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('F').value = datas.cotisHT;
        workSheet.getRow(rowNumber).getCell('F').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('G').value = datas.taux;
        workSheet.getRow(rowNumber).getCell('H').value = datas.commission;
        workSheet.getRow(rowNumber).getCell('H').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('I').value = datas.modeMotif;
        rowNumber++;
    }
    workSheet.getRow(rowNumber).getCell('G').value = 'TOTAL';
    workSheet.getRow(rowNumber).getCell('G').font = { bold: true, name: 'Arial', size: 10 };
    workSheet.getRow(rowNumber).getCell('H').value = { formula: `SUM(H${debut}:H${rowNumber - 1})` };
    workSheet.getRow(rowNumber).getCell('H').font = { bold: true, name: 'Arial', size: 10 };
    workSheet.getRow(rowNumber).getCell('H').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';
}


