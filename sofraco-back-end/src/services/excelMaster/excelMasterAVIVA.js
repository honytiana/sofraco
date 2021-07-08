exports.getOCRAVIVASURCO = (ocr) => {
    const headers = ocr.headers;
    let infosOCR = [];
    ocr.allContratsPerCourtier.forEach((contrat, index) => {
        const dataCourtierOCR = {
            code: {
                cabinet: contrat.apporteur,
                code: contrat.apporteur,
            },
            headers,
            datas: contrat.contrats
        };
        infosOCR.push({ company: 'AVIVA SURCO', infosOCR: dataCourtierOCR });
    });
    return infosOCR;
}

exports.createWorkSheetAVIVASURCO = (workSheet, dataCourtierOCR) => {
    const row1 = workSheet.getRow(1);
    row1.font = { bold: true, color: { argb: '7030a0' }, name: 'Arial', size: 8 };
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        row1.getCell(cellNumber).value = header;
        row1.getCell(cellNumber).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'bfbfbf' }
        };
        row1.getCell(cellNumber).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        cellNumber++;
    });
    row1.getCell('R').value = 'SURCO FINALE';
    row1.getCell('R').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'bfbfbf' }
    };
    row1.getCell('R').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    let rowNumber = 2;
    let debut = 2;
    let sousTotal = [];
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        for (let data of datas) {
            workSheet.getRow(rowNumber).font = { name: 'Arial', size: 8 };
            workSheet.getRow(rowNumber).getCell('A').value = data.reseau;
            workSheet.getRow(rowNumber).getCell('A').border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            workSheet.getRow(rowNumber).getCell('B').value = data.region;
            workSheet.getRow(rowNumber).getCell('B').border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            workSheet.getRow(rowNumber).getCell('C').value = data.inspecteur;
            workSheet.getRow(rowNumber).getCell('C').border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            workSheet.getRow(rowNumber).getCell('D').value = data.codeInter;
            workSheet.getRow(rowNumber).getCell('D').border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            workSheet.getRow(rowNumber).getCell('E').value = data.nomApporteur;
            workSheet.getRow(rowNumber).getCell('E').border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            workSheet.getRow(rowNumber).getCell('F').value = data.numeroContrat;
            workSheet.getRow(rowNumber).getCell('F').border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            workSheet.getRow(rowNumber).getCell('G').value = data.numeroCouverture;
            workSheet.getRow(rowNumber).getCell('G').border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            workSheet.getRow(rowNumber).getCell('H').value = data.nomAssure;
            workSheet.getRow(rowNumber).getCell('H').border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            workSheet.getRow(rowNumber).getCell('I').value = data.nomContrat;
            workSheet.getRow(rowNumber).getCell('I').border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            workSheet.getRow(rowNumber).getCell('J').value = data.nomGarantie;
            workSheet.getRow(rowNumber).getCell('J').border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            workSheet.getRow(rowNumber).getCell('K').value = data.familleContrat;
            workSheet.getRow(rowNumber).getCell('K').border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            workSheet.getRow(rowNumber).getCell('L').value = data.typeMVT;
            workSheet.getRow(rowNumber).getCell('L').border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            workSheet.getRow(rowNumber).getCell('M').value = (data.dateEffetMVT) ? new Date(data.dateEffetMVT) : '';
            workSheet.getRow(rowNumber).getCell('M').numFmt = 'dd/mm/yyyy';
            workSheet.getRow(rowNumber).getCell('M').border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            workSheet.getRow(rowNumber).getCell('N').value = data.moisEffetMVT;
            workSheet.getRow(rowNumber).getCell('N').border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            workSheet.getRow(rowNumber).getCell('O').value = data.prodBrute;
            workSheet.getRow(rowNumber).getCell('O').border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            workSheet.getRow(rowNumber).getCell('O').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';

            workSheet.getRow(rowNumber).getCell('P').value = data.prodObjectifAE;
            workSheet.getRow(rowNumber).getCell('P').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'c6e0b4' }
            };
            workSheet.getRow(rowNumber).getCell('P').border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';

            workSheet.getRow(rowNumber).getCell('Q').value = data.prodCalculAE;
            workSheet.getRow(rowNumber).getCell('Q').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '00b0f0' }
            };
            workSheet.getRow(rowNumber).getCell('Q').border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';

            workSheet.getRow(rowNumber).getCell('R').value = { formula: `Q${rowNumber}*40%` };
            workSheet.getRow(rowNumber).getCell('R').value = { formula: `Q${rowNumber}*40%` };
            workSheet.getRow(rowNumber).getCell('R').value = '#,##0.00"€";[Red]\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('R').border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            if (workSheet.getRow(rowNumber).getCell('D').value.match(/Total.+/i)) {
                const st = (data.prodCalculAE.result * 40) / 100;
                sousTotal.push(st);
                workSheet.getRow(rowNumber).font = { color: { argb: '7030a0' }, name: 'Arial', size: 8 };
                workSheet.getRow(rowNumber).getCell('A').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'bfbfbf' }
                };
                workSheet.getRow(rowNumber).getCell('B').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'bfbfbf' }
                };
                workSheet.getRow(rowNumber).getCell('C').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'bfbfbf' }
                };
                workSheet.getRow(rowNumber).getCell('D').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'bfbfbf' }
                };
                workSheet.getRow(rowNumber).getCell('E').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'bfbfbf' }
                };
                workSheet.getRow(rowNumber).getCell('F').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'bfbfbf' }
                };
                workSheet.getRow(rowNumber).getCell('G').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'bfbfbf' }
                };
                workSheet.getRow(rowNumber).getCell('H').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'bfbfbf' }
                };
                workSheet.getRow(rowNumber).getCell('I').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'bfbfbf' }
                };
                workSheet.getRow(rowNumber).getCell('J').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'bfbfbf' }
                };
                workSheet.getRow(rowNumber).getCell('K').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'bfbfbf' }
                };
                workSheet.getRow(rowNumber).getCell('L').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'bfbfbf' }
                };
                workSheet.getRow(rowNumber).getCell('M').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'bfbfbf' }
                };
                workSheet.getRow(rowNumber).getCell('N').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'bfbfbf' }
                };
                workSheet.getRow(rowNumber).getCell('O').value = { formula: `SUM(O${debut}:O${rowNumber - 1})` };
                workSheet.getRow(rowNumber).getCell('O').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';
                workSheet.getRow(rowNumber).getCell('O').border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                workSheet.getRow(rowNumber).getCell('O').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'bfbfbf' }
                };

                workSheet.getRow(rowNumber).getCell('P').value = { formula: `SUM(P${debut}:P${rowNumber - 1})` };
                workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';
                workSheet.getRow(rowNumber).getCell('P').border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                workSheet.getRow(rowNumber).getCell('P').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'bfbfbf' }
                };

                workSheet.getRow(rowNumber).getCell('Q').value = { formula: `SUM(Q${debut}:Q${rowNumber - 1})` };
                workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';
                workSheet.getRow(rowNumber).getCell('Q').font = { bold: true, color: { argb: '7030a0' }, name: 'Arial', size: 8 };
                workSheet.getRow(rowNumber).getCell('Q').border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                workSheet.getRow(rowNumber).getCell('Q').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'bfbfbf' }
                };

                workSheet.getRow(rowNumber).getCell('R').value = { formula: `Q${rowNumber}*40%` };
                workSheet.getRow(rowNumber).getCell('R').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';
                workSheet.getRow(rowNumber).getCell('R').font = { bold: true, color: { argb: '7030a0' }, name: 'Arial', size: 8 };
                workSheet.getRow(rowNumber).getCell('R').border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                workSheet.getRow(rowNumber).getCell('R').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'bfbfbf' }
                };
            }
            rowNumber++;
        }
    }

    workSheet.getRow(rowNumber).getCell('Q').value = 'TOTAL';
    workSheet.getRow(rowNumber).getCell('Q').font = { bold: true, color: { argb: '7030a0' }, name: 'Arial', size: 8 };
    let surcoFinalValue = sousTotal.reduce((previous, current) => {
        return previous + current;
    });
    workSheet.getRow(rowNumber).getCell('R').value = surcoFinalValue;
    workSheet.getRow(rowNumber).getCell('R').font = { bold: true, color: { argb: '7030a0' }, name: 'Arial', size: 8 };
    workSheet.getRow(rowNumber).getCell('R').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';
}

