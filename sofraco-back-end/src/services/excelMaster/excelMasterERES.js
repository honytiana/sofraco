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
            infosOCR.push({ company: 'ERES', infosOCR: dataCourtierOCR });
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
        workSheet.getRow(rowNumber).getCell('D').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('E').value = datas.droitEntree;
        workSheet.getRow(rowNumber).getCell('E').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('F').value = datas.commissionARegler;
        workSheet.getRow(rowNumber).getCell('F').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';
        rowNumber++;
    }
    rowNumber++;
    workSheet.getRow(rowNumber).font = { bold: true, name: 'Arial', size: 11, color: { argb: 'FFFFFF' } };
    workSheet.getRow(rowNumber).getCell('A').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ed7d31' }
    };
    workSheet.getRow(rowNumber).getCell('B').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ed7d31' }
    };
    workSheet.getRow(rowNumber).getCell('C').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ed7d31' }
    };
    workSheet.getRow(rowNumber).getCell('D').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ed7d31' }
    };
    workSheet.getRow(rowNumber).getCell('E').value = 'TOTAL';
    workSheet.getRow(rowNumber).getCell('E').font = { bold: true, name: 'Arial', size: 10 };
    workSheet.getRow(rowNumber).getCell('E').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ed7d31' }
    };
    workSheet.getRow(rowNumber).getCell('F').value = { formula: `SUM(F${debut}:F${rowNumber - 2})` };
    workSheet.getRow(rowNumber).getCell('F').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';
    workSheet.getRow(rowNumber).getCell('F').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ed7d31' }
    };
}

