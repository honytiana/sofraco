exports.getOCRLOURMEL = (ocr) => {
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
                datas: contrat.contrats
            };
            infosOCR.push({ company: 'LOURMEL', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetLOURMEL = (workSheet, dataCourtierOCR) => {
    const row1 = workSheet.getRow(1);
    row1.font = { bold: true, name: 'Arial', size: 10 };
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        row1.getCell(cellNumber).value = header;
        cellNumber++;
    });

    let rowNumber = 2;
    let debut = 2;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.courtier;
        workSheet.getRow(rowNumber).getCell('A').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ffff00' }
        };
        workSheet.getRow(rowNumber).getCell('B').value = datas.b;
        workSheet.getRow(rowNumber).getCell('C').value = datas.c;
        workSheet.getRow(rowNumber).getCell('D').value = datas.d;
        workSheet.getRow(rowNumber).getCell('E').value = datas.genre;
        workSheet.getRow(rowNumber).getCell('F').value = datas.nom;
        workSheet.getRow(rowNumber).getCell('G').value = datas.prenom;
        workSheet.getRow(rowNumber).getCell('H').value = datas.nomDeNaissance;
        workSheet.getRow(rowNumber).getCell('I').value = datas.codePostal;
        workSheet.getRow(rowNumber).getCell('J').value = datas.ville;
        workSheet.getRow(rowNumber).getCell('K').value = (datas.dateEffet) ? new Date(datas.dateEffet) : '';
        workSheet.getRow(rowNumber).getCell('K').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('L').value = datas.montantCotisation;
        workSheet.getRow(rowNumber).getCell('L').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('M').value = datas.m;
        workSheet.getRow(rowNumber).getCell('N').value = (datas.dateDebut) ? new Date(datas.dateDebut) : '';
        workSheet.getRow(rowNumber).getCell('N').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('O').value = (datas.dateFin) ? new Date(datas.dateFin) : '';
        workSheet.getRow(rowNumber).getCell('O').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('P').value = datas.tauxCommission;
        workSheet.getRow(rowNumber).getCell('Q').value = datas.montantCommission;
        workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Q').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ffff00' }
        };
        rowNumber++;
    }
    workSheet.getRow(rowNumber).getCell('P').value = 'TOTAL';
    workSheet.getRow(rowNumber).getCell('P').font = { bold: true, name: 'Arial', size: 10 };
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('Q').value;
    }
    workSheet.getRow(rowNumber).getCell('Q').value = { 
        formula: `SUM(Q${debut}:Q${rowNumber - 1})`,
        result: result
    };
    workSheet.getRow(rowNumber).getCell('Q').font = { bold: true, name: 'Arial', size: 10 };
    workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"€";\-#,##0.00"€"';
    workSheet.getRow(rowNumber).getCell('Q').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffff00' }
    };
}


