exports.getOCRCARDIF = (ocr) => {
    const headers = ocr.headers;
    let infosOCR = [];
    ocr.allContratsPerCourtier.forEach((contrat, index) => {
        if (contrat.courtier.code) {
            const dataCourtierOCR = {
                code: {
                    cabinet: contrat.courtier.libelle.replace(/[/]/, '_'),
                    code: contrat.courtier.code,
                },
                headers,
                datas: contrat.contrats
            };
            infosOCR.push({ company: 'CARDIF', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetCARDIF = (workSheet, dataCourtierOCR) => {
    const row1 = workSheet.getRow(1);
    row1.font = { bold: true, name: 'Arial', size: 10 };
    workSheet.mergeCells('A1:B1');
    row1.getCell('A').value = dataCourtierOCR.infosOCR.headers.firstHeaders[0];
    row1.getCell('A').alignment = { horizontal: 'center' };
    row1.getCell('A').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '339966' }
    };
    row1.getCell('A').border = {
        top: { style: 'thick' },
        left: { style: 'thick' },
        bottom: { style: 'thick' },
        right: { style: 'thick' }
    };

    workSheet.mergeCells('C1:G1');
    row1.getCell('C').value = dataCourtierOCR.infosOCR.headers.firstHeaders[1];
    row1.getCell('C').alignment = { horizontal: 'center' };
    row1.getCell('C').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '339966' }
    };
    row1.getCell('C').border = {
        top: { style: 'thick' },
        left: { style: 'thick' },
        bottom: { style: 'thick' },
        right: { style: 'thick' }
    };

    workSheet.mergeCells('H1:J1');
    row1.getCell('H').value = dataCourtierOCR.infosOCR.headers.firstHeaders[2];
    row1.getCell('H').alignment = { horizontal: 'center' };
    row1.getCell('H').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '339966' }
    };
    row1.getCell('H').border = {
        top: { style: 'thick' },
        left: { style: 'thick' },
        bottom: { style: 'thick' },
        right: { style: 'thick' }
    };

    workSheet.mergeCells('K1:L1');
    row1.getCell('K').value = dataCourtierOCR.infosOCR.headers.firstHeaders[3];
    row1.getCell('K').alignment = { horizontal: 'center' };
    row1.getCell('K').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '339966' }
    };
    row1.getCell('K').border = {
        top: { style: 'thick' },
        left: { style: 'thick' },
        bottom: { style: 'thick' },
        right: { style: 'thick' }
    };

    workSheet.mergeCells('M1:O1');
    row1.getCell('M').value = dataCourtierOCR.infosOCR.headers.firstHeaders[4];
    row1.getCell('M').alignment = { horizontal: 'center' };
    row1.getCell('M').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '339966' }
    };
    row1.getCell('M').border = {
        top: { style: 'thick' },
        left: { style: 'thick' },
        bottom: { style: 'thick' },
        right: { style: 'thick' }
    };

    workSheet.mergeCells('P1:R1');
    row1.getCell('P').value = dataCourtierOCR.infosOCR.headers.firstHeaders[5];
    row1.getCell('P').alignment = { horizontal: 'center' };
    row1.getCell('P').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '339966' }
    };
    row1.getCell('P').border = {
        top: { style: 'thick' },
        left: { style: 'thick' },
        bottom: { style: 'thick' },
        right: { style: 'thick' }
    };


    const row2 = workSheet.getRow(2);
    row2.font = { bold: true, name: 'Arial', size: 10 };
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.secondHeaders.forEach((secondHeader, index) => {
        row2.getCell(cellNumber).value = secondHeader;
        row2.getCell(cellNumber).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '339966' }
        };
        row2.getCell(cellNumber).border = {
            top: { style: 'thick' },
            left: { style: 'thick' },
            bottom: { style: 'thick' },
            right: { style: 'thick' }
        };
        cellNumber++;
    });

    let rowNumber = 3;
    let debut = 3;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.courtier.code;
        workSheet.getRow(rowNumber).getCell('B').value = datas.courtier.libelle;
        workSheet.getRow(rowNumber).getCell('C').value = datas.commission.reference;
        workSheet.getRow(rowNumber).getCell('D').value = datas.commission.type;
        workSheet.getRow(rowNumber).getCell('E').value = datas.commission.sousType;
        workSheet.getRow(rowNumber).getCell('F').value = (datas.commission.datePriseEnCompte) ? new Date(datas.commission.datePriseEnCompte) : '';
        workSheet.getRow(rowNumber).getCell('F').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('G').value = (datas.commission.dateEffet) ? new Date(datas.commission.dateEffet) : '';
        workSheet.getRow(rowNumber).getCell('G').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('H').value = datas.client.numero;
        workSheet.getRow(rowNumber).getCell('I').value = datas.client.nom;
        workSheet.getRow(rowNumber).getCell('J').value = datas.client.prenom;
        workSheet.getRow(rowNumber).getCell('K').value = datas.contrat.numero;
        workSheet.getRow(rowNumber).getCell('L').value = datas.contrat.produit;
        workSheet.getRow(rowNumber).getCell('M').value = datas.supportFinancier.codeISIN;
        workSheet.getRow(rowNumber).getCell('N').value = datas.supportFinancier.libelleSupportFinancier;
        workSheet.getRow(rowNumber).getCell('O').value = datas.supportFinancier.classification;
        workSheet.getRow(rowNumber).getCell('P').value = datas.montantsCommission.assiette;
        workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Q').value = datas.montantsCommission.taux;
        workSheet.getRow(rowNumber).getCell('R').value = datas.montantsCommission.montant;
        workSheet.getRow(rowNumber).getCell('R').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';
        rowNumber++;
    }
    rowNumber++;
    workSheet.getRow(rowNumber).getCell('Q').value = 'TOTAL';
    workSheet.getRow(rowNumber).getCell('Q').font = { bold: true, name: 'Arial', size: 10 };
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('R').value;
    }
    workSheet.getRow(rowNumber).getCell('R').value = { 
        formula: `SUM(R${debut}:R${rowNumber - 2})`,
        result: result
    };
    workSheet.getRow(rowNumber).getCell('R').font = { bold: true, name: 'Arial', size: 10 };
    workSheet.getRow(rowNumber).getCell('R').numFmt = '#,##0.00"€";[Red]\-#,##0.00"€"';
}


