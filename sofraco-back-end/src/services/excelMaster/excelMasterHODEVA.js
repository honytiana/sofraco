exports.getOCRHODEVA = (ocr) => {
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
                datas: contrat.contrats,
                totalMontant: contrat.totalMontant.result
            };
            infosOCR.push({ company: 'HODEVA', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetHODEVA = (workSheet, dataCourtierOCR) => {
    const row1 = workSheet.getRow(1);
    row1.font = { bold: true, name: 'Arial', size: 10 };
    workSheet.mergeCells('A1:C1');
    row1.getCell('A').value = dataCourtierOCR.infosOCR.code.cabinet;
    row1.getCell('A').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    const row2 = workSheet.getRow(2);
    row2.font = { bold: true, name: 'Arial', size: 10, color: { argb: 'FFFFFF' } };
    row2.getCell('A').value = dataCourtierOCR.infosOCR.headers.adhesion;
    row2.getCell('A').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
    row2.getCell('A').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cc0000' }
    };

    row2.getCell('B').value = dataCourtierOCR.infosOCR.headers.nom;
    row2.getCell('B').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
    row2.getCell('B').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cc0000' }
    };

    row2.getCell('C').value = dataCourtierOCR.infosOCR.headers.prenom;
    row2.getCell('C').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
    row2.getCell('C').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cc0000' }
    };

    row2.getCell('D').value = dataCourtierOCR.infosOCR.headers.dateEffet;
    row2.getCell('D').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
    row2.getCell('D').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cc0000' }
    };

    row2.getCell('E').value = dataCourtierOCR.infosOCR.headers.montantPrimeHT;
    row2.getCell('E').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
    row2.getCell('E').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cc0000' }
    };

    row2.getCell('F').value = dataCourtierOCR.infosOCR.headers.tauxCommissionnement;
    row2.getCell('F').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
    row2.getCell('F').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cc0000' }
    };

    row2.getCell('G').value = dataCourtierOCR.infosOCR.headers.montantCommissionnement;
    row2.getCell('G').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
    row2.getCell('G').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cc0000' }
    };

    let rowNumber = 3;
    let debut = 3;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.adhesion;
        workSheet.getRow(rowNumber).getCell('A').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('B').value = datas.nom;
        workSheet.getRow(rowNumber).getCell('B').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('C').value = datas.prenom;
        workSheet.getRow(rowNumber).getCell('C').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('D').value = (datas.dateEffet) ? new Date(datas.dateEffet) : '';
        workSheet.getRow(rowNumber).getCell('D').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('D').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('E').value = datas.montantPrimeHT;
        workSheet.getRow(rowNumber).getCell('E').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('E').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('F').value = datas.tauxCommissionnement;
        workSheet.getRow(rowNumber).getCell('F').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('G').value = datas.montantCommissionnement.result;
        workSheet.getRow(rowNumber).getCell('G').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('G').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        rowNumber++;
    }
    workSheet.getRow(rowNumber).getCell('G').value = dataCourtierOCR.infosOCR.totalMontant;
    workSheet.getRow(rowNumber).getCell('G').font = { bold: true, name: 'Arial', size: 10, color: { argb: 'FFFFFF' } };
    workSheet.getRow(rowNumber).getCell('G').numFmt = '#,##0.00"€";\-#,##0.00"€"';
    workSheet.getRow(rowNumber).getCell('A').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cc0000' }
    };
    workSheet.getRow(rowNumber).getCell('B').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cc0000' }
    };
    workSheet.getRow(rowNumber).getCell('C').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cc0000' }
    };
    workSheet.getRow(rowNumber).getCell('D').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cc0000' }
    };
    workSheet.getRow(rowNumber).getCell('E').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cc0000' }
    };
    workSheet.getRow(rowNumber).getCell('F').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cc0000' }
    };
    workSheet.getRow(rowNumber).getCell('G').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cc0000' }
    };
}


