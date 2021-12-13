exports.getWorkSheets = (workbook) => {
    const ws = workbook.worksheets;
    let workSheets = [];
    for (let workSheet of ws) {
        if (workSheet.name !== 'RECAP') {
            workSheets.push(workSheet);
        }
    }
    return workSheets;
}

exports.createWorkSheetRECAP = (workSheetRecap, workSheets) => {
    workSheetRecap.getColumn('B').width = 40;
    workSheetRecap.getColumn('C').width = 40;
    const row2 = workSheetRecap.getRow(2);
    row2.font = { bold: true, name: 'Arial', size: 11 };
    row2.getCell('B').value = 'Nom de la compagnie';
    row2.getCell('C').value = 'Montant de la commission';

    let rowNumber = 3;
    let debut = 3;
    for (let worksheet of workSheets) {
        workSheetRecap.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheetRecap.getRow(rowNumber).getCell('B').value = { text: `${worksheet.name}`, hyperlink: `#${worksheet.name}.A1` };
        let total;
        if (worksheet.name === 'METLIFE') {
            total = worksheet.getRow(9).getCell('B').value;
            if(total < 25) {
                total = 'Montant inférieur à 25€';
            }
        } else if (worksheet.name === 'SLADE') {
            total = worksheet.getRow(7).getCell('B').value;
        } else if (worksheet.name === 'APREP ENCOURS') {
            worksheet.eachRow((row, rowNumber) => {
                if (row.getCell('A').value.match(/TOTAL/i)) {
                    total = row.getCell('I').value;
                }
            });
        } else {
            worksheet.eachRow((row, rowNumber) => {
                row.eachCell((cell, colNumber) => {
                    if (rowNumber > 1) {
                        if (cell.value === 'TOTAL') {
                            total = (row.getCell(colNumber + 1).value.result ?
                                row.getCell(colNumber + 1).value.result :
                                row.getCell(colNumber + 1).value);
                        }
                    }
                });
            });
        }
        workSheetRecap.getRow(rowNumber).getCell('C').value = total;
        workSheetRecap.getRow(rowNumber).getCell('C').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        rowNumber++;
    }
    workSheetRecap.getRow(rowNumber).getCell('B').value = 'TOTAL';
    workSheetRecap.getRow(rowNumber).getCell('B').font = { bold: true, name: 'Arial', size: 10 };
    workSheetRecap.getRow(rowNumber).getCell('B').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ed7d31' }
    };
    workSheetRecap.getRow(rowNumber).getCell('C').value = { formula: `SUM(C${debut}:C${rowNumber - 1})` };
    workSheetRecap.getRow(rowNumber).getCell('C').font = { bold: true, name: 'Arial', size: 10 };
    workSheetRecap.getRow(rowNumber).getCell('C').numFmt = '#,##0.00"€";\-#,##0.00"€"';
    workSheetRecap.getRow(rowNumber).getCell('C').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ed7d31' }
    };
}
