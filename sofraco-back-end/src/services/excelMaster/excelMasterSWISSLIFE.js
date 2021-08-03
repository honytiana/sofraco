exports.getOCRSWISSLIFESURCO = (ocr) => {
    const headers = ocr.headers;
    let infosOCR = [];
    ocr.allContratsPerCourtier.forEach((contrat, index) => {
        const dataCourtierOCR = {
            code: {
                cabinet: contrat.courtier.code,
                code: contrat.courtier.code,
            },
            headers,
            datas: contrat.contrats
        };
        infosOCR.push({ company: 'SWISSLIFE SURCO', infosOCR: dataCourtierOCR });
    });
    return infosOCR;
}

exports.createWorkSheetSWISSLIFESURCO = (workSheet, dataCourtierOCR) => {
    workSheet.getColumn('A').width = 10;
    workSheet.getColumn('C').width = 15;
    workSheet.getColumn('D').width = 15;
    workSheet.getColumn('E').width = 25;
    workSheet.getColumn('F').width = 10;
    workSheet.getColumn('G').width = 10;
    workSheet.getColumn('H').width = 10;
    workSheet.getColumn('I').width = 10;
    workSheet.getColumn('J').width = 10;
    workSheet.getColumn('K').width = 5;
    workSheet.getColumn('L').width = 10;
    workSheet.getColumn('M').width = 10;
    workSheet.getColumn('N').width = 10;
    const row1 = workSheet.getRow(1);
    row1.font = { bold: true, name: 'Verdana', size: 8 };
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        row1.getCell(cellNumber).value = header;
        row1.getCell(cellNumber).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '800000' }
        };
        row1.getCell(cellNumber).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        row1.getCell(cellNumber).alignment = { vertical: 'middle' };
        cellNumber++;
    });
    row1.height = 50;

    let rowNumber = 2;
    let debut = 2;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Verdana', size: 8 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.apporteurVente;
        workSheet.getRow(rowNumber).getCell('A').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('B').value = (datas.dateComptabVente) ? new Date(0, 0, datas.dateComptabVente, 0, 0, 0) : '';
        workSheet.getRow(rowNumber).getCell('B').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('B').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('C').value = datas.numeroPolice;
        workSheet.getRow(rowNumber).getCell('C').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('D').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('D').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('E').value = datas.nomClient;
        workSheet.getRow(rowNumber).getCell('E').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('F').value = datas.cotisationPonderee;
        workSheet.getRow(rowNumber).getCell('F').numFmt = '#,##0.00;\-#,##0.00';
        workSheet.getRow(rowNumber).getCell('F').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('G').value = datas.montantPP;
        workSheet.getRow(rowNumber).getCell('G').numFmt = '#,##0.00;\-#,##0.00';
        workSheet.getRow(rowNumber).getCell('G').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('H').value = datas.dontParUCsurPP;
        workSheet.getRow(rowNumber).getCell('H').numFmt = '#,##0.00;\-#,##0.00';
        workSheet.getRow(rowNumber).getCell('H').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('I').value = datas.montantPU;
        workSheet.getRow(rowNumber).getCell('I').numFmt = '#,##0.00;\-#,##0.00';
        workSheet.getRow(rowNumber).getCell('I').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('J').value = datas.dontParUCsurPU;
        workSheet.getRow(rowNumber).getCell('J').numFmt = '#,##0.00;\-#,##0.00';
        workSheet.getRow(rowNumber).getCell('J').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('K').value = datas.tauxChargement;
        workSheet.getRow(rowNumber).getCell('K').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('L').value = datas.avanceSurco;
        workSheet.getRow(rowNumber).getCell('L').numFmt = '#,##0.00;\-#,##0.00';
        workSheet.getRow(rowNumber).getCell('L').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('M').value = datas.incompressible;
        workSheet.getRow(rowNumber).getCell('M').numFmt = '#,##0.00;\-#,##0.00';
        workSheet.getRow(rowNumber).getCell('M').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('N').value = datas.avanceComprisRepriseIncompressible;
        workSheet.getRow(rowNumber).getCell('N').numFmt = '#,##0.00;\-#,##0.00';
        workSheet.getRow(rowNumber).getCell('N').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        rowNumber++;
    }
    rowNumber++;
    workSheet.getRow(rowNumber).getCell('M').value = 'TOTAL';
    workSheet.getRow(rowNumber).getCell('M').font = { bold: true, name: 'Verdana', size: 8, color: { argb: 'ff0000' } };
    workSheet.getRow(rowNumber).getCell('N').value = { formula: `SUM(N${debut}:N${rowNumber - 2})` };
    workSheet.getRow(rowNumber).getCell('N').font = { bold: true, name: 'Verdana', size: 8, color: { argb: 'ff0000' } };
    workSheet.getRow(rowNumber).getCell('N').numFmt = '#,##0.00"€";\-#,##0.00"€"';
}

