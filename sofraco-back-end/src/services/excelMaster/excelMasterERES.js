const excelFile = require('../utils/excelFile');

exports.getOCRERES = (ocr) => {
    const headers = [
        'Code Entreprise',
        'Raison Sociale',
        'Conseiller',
        'Montants versés en €',
        'Droits d’entrée en €',
        'Commissions à régler en €'
    ];
    let infosOCR = [];
    ocr.infos.allContratsPerConseillers.forEach((contrat, index) => {
        if (contrat.conseiller.code) {
            const dataCourtierOCR = {
                code: {
                    cabinet: contrat.conseiller.code.replace(/[/]/, '_'),
                    code: contrat.conseiller.code,
                },
                headers,
                datas: contrat.contrats
            };
            infosOCR.push({ companyGlobalName: 'ERES', companyName: 'ERES', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetERES = (workSheet, dataCourtierOCR) => {
    const row1 = workSheet.getRow(1);
    row1.font = { bold: true, name: 'Arial', size: 11 };
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        row1.getCell(cellNumber).value = header;
        cellNumber++;
    });

    let rowNumber = 2;
    let debut = 2;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 11 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.codeEntreprise;
        workSheet.getRow(rowNumber).getCell('B').value = datas.raisonSocial;
        workSheet.getRow(rowNumber).getCell('C').value = datas.conseiller;
        workSheet.getRow(rowNumber).getCell('D').value = datas.montantVersee;
        workSheet.getRow(rowNumber).getCell('D').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('E').value = datas.droitEntree;
        workSheet.getRow(rowNumber).getCell('E').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('F').value = datas.commissionARegler;
        workSheet.getRow(rowNumber).getCell('F').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        rowNumber++;
    }
    rowNumber++;
    const font1 = { bold: true, name: 'Arial', size: 11, color: { argb: 'FFFFFF' } };
    const font2 = { bold: true, name: 'Arial', size: 10 };
    workSheet.getRow(rowNumber).font = font1;
    excelFile.setStylizedCell(workSheet, rowNumber, 'A', '', false, {}, font1, '', 'ed7d31');
    excelFile.setStylizedCell(workSheet, rowNumber, 'B', '', false, {}, font1, '', 'ed7d31');
    excelFile.setStylizedCell(workSheet, rowNumber, 'C', '', false, {}, font1, '', 'ed7d31');
    excelFile.setStylizedCell(workSheet, rowNumber, 'D', '', false, {}, font1, '', 'ed7d31');
    excelFile.setStylizedCell(workSheet, rowNumber, 'E', 'TOTAL', false, {}, font2, '', 'ed7d31');
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('F').value;
    }
    const value = {
        formula: `SUM(F${debut}:F${rowNumber - 2})`,
        result: result
    };
    excelFile.setStylizedCell(workSheet, rowNumber, 'F', value, false, {}, font2, '#,##0.00"€";\-#,##0.00"€"', 'ed7d31');
}

