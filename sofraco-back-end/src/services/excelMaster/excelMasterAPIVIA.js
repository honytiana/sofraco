const excelFile = require('../utils/excelFile');

exports.getOCRAPIVIA = (ocr) => {
    const headers = ocr.infos.headers;
    let infosOCR = [];
    ocr.infos.allContratsPerCourtier.forEach((contrat, index) => {
        if (contrat.courtier) {
            const dataCourtierOCR = {
                code: {
                    cabinet: contrat.courtier,
                    code: contrat.courtier,
                },
                headers,
                datas: contrat.contrats
            };
            infosOCR.push({ companyGlobalName: 'APIVIA', companyName: 'APIVIA', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetAPIVIA = (workSheet, dataCourtierOCR, reste = false, rowNumberI = null) => {
    let rowNumber = !reste ? 1 : rowNumberI;
    const row = workSheet.getRow(rowNumber);
    row.height = 40;
    row.font = { bold: true, name: 'Arial', size: 10 };
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        excelFile.setStylizedCell(workSheet, rowNumber, cellNumber, header, false, {}, { bold: true, name: 'Arial', size: 10 }, '', 'f2f2f2');
        cellNumber++;
    });
    rowNumber++;
    
    let debut = rowNumber;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.echeance;
        workSheet.getRow(rowNumber).getCell('B').value = datas.numContrat;
        workSheet.getRow(rowNumber).getCell('C').value = datas.reference;
        workSheet.getRow(rowNumber).getCell('D').value = datas.ent;
        workSheet.getRow(rowNumber).getCell('E').value = datas.client;
        workSheet.getRow(rowNumber).getCell('F').value = datas.produit;
        workSheet.getRow(rowNumber).getCell('G').value = datas.dateEffet;
        workSheet.getRow(rowNumber).getCell('H').value = datas.fractionnement;
        workSheet.getRow(rowNumber).getCell('I').value = datas.primeAnnuelClient;
        workSheet.getRow(rowNumber).getCell('I').numFmt = '#,##0.00"€";\-#,##0.00"€';
        workSheet.getRow(rowNumber).getCell('J').value = datas.primeAnnuelCommission;
        workSheet.getRow(rowNumber).getCell('J').numFmt = '#,##0.00"€";\-#,##0.00"€';
        workSheet.getRow(rowNumber).getCell('K').value = datas.taux;
        workSheet.getRow(rowNumber).getCell('L').value = datas.commission;
        workSheet.getRow(rowNumber).getCell('L').numFmt = '#,##0.00"€";\-#,##0.00"€';
        workSheet.getRow(rowNumber).getCell('M').value = datas.fraisDossier;
        workSheet.getRow(rowNumber).getCell('M').numFmt = '#,##0.00"";\-#,##0.00""';
        rowNumber++;
    }
    rowNumber++;
    workSheet.getRow(rowNumber).getCell('K').value = 'TOTAL';
    workSheet.getRow(rowNumber).getCell('K').font = { bold: true, name: 'Arial', size: 10 };
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('L').value;
    }
    workSheet.getRow(rowNumber).getCell('L').value = { 
        formula: `SUM(L${debut}:L${rowNumber - 2})`,
        result: result
    };
    workSheet.getRow(rowNumber).getCell('L').font = { bold: true, name: 'Arial', size: 10 };
    workSheet.getRow(rowNumber).getCell('L').numFmt = '#,##0.00"€";\-#,##0.00"€"';
    if (reste) {
        return rowNumber;
    }
}


