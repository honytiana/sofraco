const excelFile = require('../utils/excelFile');

exports.getOCRAVIVASURCO = (ocr) => {
    const headers = ocr.headers;
    let infosOCR = [];
    ocr.allContratsPerCourtier.forEach((contrat, index) => {
        const dataCourtierOCR = {
            code: {
                cabinet: contrat.courtier,
                code: contrat.courtier,
            },
            headers,
            datas: contrat.contrats
        };
        infosOCR.push({ companyGlobalName: 'AVIVA', companyName: 'AVIVA SURCO', infosOCR: dataCourtierOCR });
    });
    return infosOCR;
}

exports.createWorkSheetAVIVASURCO = (workSheet, dataCourtierOCR, reste = false, rowNumberI = null) => {
    let rowNumber = !reste ? 1 : rowNumberI;
    const border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
    const font1 = { bold: true, color: { argb: '7030a0' }, name: 'Arial', size: 8 };
    const font2 = { name: 'Arial', size: 8 };
    const font3 = { color: { argb: '7030a0' }, name: 'Arial', size: 8 };

    const row1 = workSheet.getRow(rowNumber);
    row1.font = font1;
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        excelFile.setStylizedCell(workSheet, rowNumber, cellNumber, header, true, border, font1, '', 'bfbfbf');
        cellNumber++;
    });
    excelFile.setStylizedCell(workSheet, rowNumber, 'R', 'SURCO FINALE', true, border, font1, '', 'bfbfbf');
    rowNumber++;

    let debut = rowNumber;
    let totalGeneral = false;
    let sousTotal = [];
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        for (let data of datas.contrats) {
            totalGeneral = false;
            if (data.codeInter !== 'Total général') {
                excelFile.setStylizedCell(workSheet, rowNumber, 'A', data.reseau, true, border, font2);
                excelFile.setStylizedCell(workSheet, rowNumber, 'B', data.region, true, border, font2);
                excelFile.setStylizedCell(workSheet, rowNumber, 'C', data.inspecteur, true, border, font2);
                excelFile.setStylizedCell(workSheet, rowNumber, 'D', data.codeInter, true, border, font2);
                excelFile.setStylizedCell(workSheet, rowNumber, 'E', data.nomApporteur, true, border, font2);
                excelFile.setStylizedCell(workSheet, rowNumber, 'F', data.numeroContrat, true, border, font2);
                excelFile.setStylizedCell(workSheet, rowNumber, 'G', data.numeroCouverture, true, border, font2);
                excelFile.setStylizedCell(workSheet, rowNumber, 'H', data.nomAssure, true, border, font2);
                excelFile.setStylizedCell(workSheet, rowNumber, 'I', data.nomContrat, true, border, font2);
                excelFile.setStylizedCell(workSheet, rowNumber, 'J', data.nomGarantie, true, border, font2);
                excelFile.setStylizedCell(workSheet, rowNumber, 'K', data.familleContrat, true, border, font2);
                excelFile.setStylizedCell(workSheet, rowNumber, 'L', data.typeMVT, true, border, font2);
                excelFile.setStylizedCell(workSheet, rowNumber, 'M', (data.dateEffetMVT) ? new Date(data.dateEffetMVT) : '', true, border, font2, 'dd/mm/yyyy');
                excelFile.setStylizedCell(workSheet, rowNumber, 'N', data.moisEffetMVT, true, border, font2);
                excelFile.setStylizedCell(workSheet, rowNumber, 'O', data.prodBrute, true, border, font2, '#,##0.00"€";[Red]\-#,##0.00"€"');
                excelFile.setStylizedCell(workSheet, rowNumber, 'P', data.prodObjectifAE, true, border, font2, '#,##0.00"€";[Red]\-#,##0.00"€"');
                excelFile.setStylizedCell(workSheet, rowNumber, 'Q', data.prodCalculAE, true, border, font2, '#,##0.00"€";[Red]\-#,##0.00"€"');
                excelFile.setStylizedCell(workSheet, rowNumber, 'R', { formula: `Q${rowNumber}*40%` }, true, border, font2, '#,##0.00"€";[Red]\-#,##0.00"€"');

                if (workSheet.getRow(rowNumber).getCell('D').value.match(/Total.+/i)) {
                    const st = (data.prodCalculAE.result * 40) / 100;
                    sousTotal.push(st);
                    workSheet.getRow(rowNumber).font = font3;
                    for (let i = 1; i < 15; i++) {
                        workSheet.getRow(rowNumber).getCell(i).fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'bfbfbf' }
                        };
                    }
                    excelFile.setStylizedCell(workSheet, rowNumber, 'O', { formula: `SUM(O${debut}:O${rowNumber - 1})` }, true, border, font3, '#,##0.00"€";[Red]\-#,##0.00"€"', 'bfbfbf');
                    excelFile.setStylizedCell(workSheet, rowNumber, 'P', { formula: `SUM(P${debut}:P${rowNumber - 1})` }, true, border, font3, '#,##0.00"€";[Red]\-#,##0.00"€"', 'bfbfbf');
                    excelFile.setStylizedCell(workSheet, rowNumber, 'Q', { formula: `SUM(Q${debut}:Q${rowNumber - 1})` }, true, border, font3, '#,##0.00"€";[Red]\-#,##0.00"€"', 'bfbfbf');
                    excelFile.setStylizedCell(workSheet, rowNumber, 'R', { formula: `Q${rowNumber}*40%` }, true, border, font3, '#,##0.00"€";[Red]\-#,##0.00"€"', 'bfbfbf');
                }
                rowNumber++;
            } else {
                totalGeneral = true;
            }
        }
    }

    excelFile.setSimpleCell(workSheet, rowNumber, 'Q', 'TOTAL', font1);
    let surcoFinalValue = 0;
    if(!totalGeneral) {
        surcoFinalValue = sousTotal.reduce((previous, current) => {
            return previous + current;
        });
    }
    excelFile.setStylizedCell(workSheet, rowNumber, 'R', surcoFinalValue, false, {}, font1, '#,##0.00"€";[Red]\-#,##0.00"€"');
    if (reste) {
        return rowNumber;
    }
}

