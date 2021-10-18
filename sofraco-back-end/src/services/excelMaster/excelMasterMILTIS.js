const excelFile = require('../utils/excelFile');

exports.getOCRMILTIS = (ocr) => {
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
            infosOCR.push({ company: 'MILTIS', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetMILTIS = (workSheet, dataCourtierOCR) => {
    let rowNumber = 1;
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        excelFile.setSimpleCell(workSheet, rowNumber, cellNumber, header, { bold: true, name: 'Arial', size: 10 });
        cellNumber++;
    });
    rowNumber++;
    
    let debut = rowNumber;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.codeAdherent;
        workSheet.getRow(rowNumber).getCell('B').value = datas.nomAdherent;
        workSheet.getRow(rowNumber).getCell('C').value = datas.typeAdherent;
        workSheet.getRow(rowNumber).getCell('D').value = datas.garantie;
        workSheet.getRow(rowNumber).getCell('E').value = datas.periodeDebut ? new Date(datas.periodeDebut) : '';
        workSheet.getRow(rowNumber).getCell('E').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('F').value = datas.periodeFin ? new Date(datas.periodeFin) : '';
        workSheet.getRow(rowNumber).getCell('F').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('G').value = datas.periodicite;
        workSheet.getRow(rowNumber).getCell('H').value = datas.typeCommission;
        workSheet.getRow(rowNumber).getCell('I').value = datas.primeHT;
        workSheet.getRow(rowNumber).getCell('I').numFmt = '#,##0.00"";\-#,##0.00""';
        workSheet.getRow(rowNumber).getCell('J').value = datas.taux;
        workSheet.getRow(rowNumber).getCell('K').value = datas.Commission;
        workSheet.getRow(rowNumber).getCell('K').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('L').value = datas.dateDeCalcul ? new Date(datas.dateDeCalcul) : '';
        workSheet.getRow(rowNumber).getCell('L').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('M').value = datas.codePostal;
        workSheet.getRow(rowNumber).getCell('N').value = datas.ville;
        workSheet.getRow(rowNumber).getCell('O').value = datas.raisonSociale;
        workSheet.getRow(rowNumber).getCell('P').value = datas.codeMiltis;
        workSheet.getRow(rowNumber).getCell('Q').value = datas.courtier.result;
        workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('R').value = datas.fondateur;
        workSheet.getRow(rowNumber).getCell('R').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('S').value = datas.pavillon;
        workSheet.getRow(rowNumber).getCell('S').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('T').value = datas.sofraco.result;
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('U').value = datas.sofracoExpertises.result;
        workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('V').value = datas.budget;
        workSheet.getRow(rowNumber).getCell('V').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        rowNumber++;
    }
    rowNumber++;
    excelFile.setSimpleCell(workSheet, rowNumber, 'J', 'TOTAL', { bold: true, name: 'Arial', size: 10 });
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('').value;
    }
    const value =  {
        formula: `SUM(K${debut}:K${rowNumber - 2})`,
        result: result
    };
    excelFile.setStylizedCell(workSheet, rowNumber, 'K', value, false, {}, { bold: true, name: 'Arial', size: 10 }, '#,##0.00"€";\-#,##0.00"€"');
}


