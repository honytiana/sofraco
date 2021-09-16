exports.getOCRUAFLIFE = (ocr) => {
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
            infosOCR.push({ company: 'UAF LIFE PATRIMOINE', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetUAFLIFE = (workSheet, dataCourtierOCR) => {
    let rowNumber = 1;
    for (let details of dataCourtierOCR.infosOCR.detailsBordereau) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = details;
        rowNumber++;
    }
    rowNumber++;
    const row = workSheet.getRow(rowNumber);
    row.font = { bold: true, name: 'Arial', size: 10 };
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        row.getCell(cellNumber).value = header;
        cellNumber++;
    });
    rowNumber++;
    
    let debut = rowNumber;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.codeIntermediaireDestinataireReglements;
        workSheet.getRow(rowNumber).getCell('B').value = datas.nomIntermediaireDestinataireReglements;
        workSheet.getRow(rowNumber).getCell('C').value = datas.codeIntermediaireResponsableContrat;
        workSheet.getRow(rowNumber).getCell('D').value = datas.nomIntermediaireResponsableContrat;
        workSheet.getRow(rowNumber).getCell('E').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('F').value = datas.libelleProduit;
        workSheet.getRow(rowNumber).getCell('G').value = datas.numeroContrat;
        workSheet.getRow(rowNumber).getCell('H').value = datas.nomSouscripteur;
        workSheet.getRow(rowNumber).getCell('I').value = datas.prenomSouscripteur;
        workSheet.getRow(rowNumber).getCell('J').value = datas.libelleProfil;
        workSheet.getRow(rowNumber).getCell('K').value = datas.codeISIN;
        workSheet.getRow(rowNumber).getCell('L').value = datas.libelleSupport;
        workSheet.getRow(rowNumber).getCell('M').value = datas.natureCommissions;
        workSheet.getRow(rowNumber).getCell('N').value = datas.typeCommissions;
        workSheet.getRow(rowNumber).getCell('O').value = datas.libelleOperation;
        workSheet.getRow(rowNumber).getCell('P').value = datas.numeroOperation;
        workSheet.getRow(rowNumber).getCell('Q').value = datas.dateCreationOperation ? new Date(datas.dateCreationOperation) : '';
        workSheet.getRow(rowNumber).getCell('Q').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('R').value = (datas.dateValidationOperation) ? new Date(datas.dateValidationOperation) : '';
        workSheet.getRow(rowNumber).getCell('R').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('S').value = datas.dateValeurOperation ? new Date(datas.dateValeurOperation) : '';
        workSheet.getRow(rowNumber).getCell('S').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('T').value = datas.montantOperationTousSupports;
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('U').value = datas.montantOperationSurSupport;
        workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('V').value = datas.montantAssietteCommission;
        workSheet.getRow(rowNumber).getCell('V').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('W').value = datas.tauxCommissionsIntermediaireTeteReseau;
        workSheet.getRow(rowNumber).getCell('X').value = datas.montantCommissionIntermediaireTeteReseau;
        workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Y').value = datas.tauxCommissionsIntermediaireResponsableContrat;
        workSheet.getRow(rowNumber).getCell('Z').value = datas.montantCommissionsIntermediaireResponsableContrat;
        workSheet.getRow(rowNumber).getCell('Z').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('AA').value = datas.nbPartsAssietteCommission;
        workSheet.getRow(rowNumber).getCell('AB').value = datas.VLUtilisePourCalculFrais;
        workSheet.getRow(rowNumber).getCell('AC').value = datas.dateValeurVL ? new Date(datas.dateValeurVL) : '';
        workSheet.getRow(rowNumber).getCell('AC').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('AD').value = datas.codeBordereau;
        workSheet.getRow(rowNumber).getCell('AE').value = datas.dateGenerationBordereau ? new Date(datas.dateGenerationBordereau) : '';
        workSheet.getRow(rowNumber).getCell('AE').numFmt = 'dd/mm/yyyy';
        rowNumber++;
    }
    rowNumber++;
    workSheet.getRow(rowNumber).getCell('Y').value = 'TOTAL';
    workSheet.getRow(rowNumber).getCell('Y').font = { bold: true, name: 'Arial', size: 10 };
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('Z').value;
    }
    workSheet.getRow(rowNumber).getCell('Z').value = { 
        formula: `SUM(Z${debut}:Z${rowNumber - 2})`,
        result: result
    };
    workSheet.getRow(rowNumber).getCell('Z').font = { bold: true, name: 'Arial', size: 10 };
    workSheet.getRow(rowNumber).getCell('Z').numFmt = '#,##0.00"€";\-#,##0.00"€"';
}


