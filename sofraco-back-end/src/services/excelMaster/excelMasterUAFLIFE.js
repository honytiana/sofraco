const excelFile = require('../utils/excelFile');

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
            infosOCR.push({ companyGlobalName: 'UAF LIFE PATRIMOINE', companyName: 'UAF LIFE PATRIMOINE', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetUAFLIFE = (workSheet, dataCourtierOCR) => {
    const font1 = { bold: true, name: 'Arial', size: 10 };
    const font2 = { name: 'Arial', size: 10 };

    let rowNumber = 1;
    for (let details of dataCourtierOCR.infosOCR.detailsBordereau) {
        excelFile.setSimpleCell(workSheet, rowNumber, 'A', details, font2);
        rowNumber++;
    }
    rowNumber++;
    
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        excelFile.setSimpleCell(workSheet, rowNumber, cellNumber, header, font1);
        cellNumber++;
    });
    rowNumber++;
    
    let debut = rowNumber;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = font2;
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
        workSheet.getRow(rowNumber).getCell('Q').value = datas.dateCreationOperation
        workSheet.getRow(rowNumber).getCell('Q').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('R').value = datas.dateValidationOperation;
        workSheet.getRow(rowNumber).getCell('R').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('S').value = datas.dateValeurOperation;
        workSheet.getRow(rowNumber).getCell('S').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('T').value = (typeof datas.montantOperationTousSupports ==='string' ? parseFloat(datas.montantOperationTousSupports.replace(',', '.')) : datas.montantOperationTousSupports);
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('U').value = (typeof datas.montantOperationSurSupport ==='string' ? parseFloat(datas.montantOperationSurSupport.replace(',', '.')) : datas.montantOperationSurSupport);
        workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('V').value = (typeof datas.montantAssietteCommission ==='string' ? parseFloat(datas.montantAssietteCommission.replace(',', '.')) : datas.montantAssietteCommission);
        workSheet.getRow(rowNumber).getCell('V').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('W').value = datas.tauxCommissionsIntermediaireTeteReseau;
        workSheet.getRow(rowNumber).getCell('X').value = (typeof datas.montantCommissionIntermediaireTeteReseau ==='string' ? parseFloat(datas.montantCommissionIntermediaireTeteReseau.replace(',', '.')) : datas.montantCommissionIntermediaireTeteReseau);
        workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('Y').value = datas.tauxCommissionsIntermediaireResponsableContrat;
        workSheet.getRow(rowNumber).getCell('Z').value = (typeof datas.montantCommissionsIntermediaireResponsableContrat ==='string' ? parseFloat(datas.montantCommissionsIntermediaireResponsableContrat.replace(',', '.')) : datas.montantCommissionsIntermediaireResponsableContrat);
        workSheet.getRow(rowNumber).getCell('Z').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('AA').value = datas.nbPartsAssietteCommission;
        workSheet.getRow(rowNumber).getCell('AB').value = datas.VLUtilisePourCalculFrais;
        workSheet.getRow(rowNumber).getCell('AC').value = datas.dateValeurVL;
        workSheet.getRow(rowNumber).getCell('AC').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('AD').value = datas.codeBordereau;
        workSheet.getRow(rowNumber).getCell('AE').value = datas.dateGenerationBordereau;
        workSheet.getRow(rowNumber).getCell('AE').numFmt = 'dd/mm/yyyy';
        rowNumber++;
    }
    rowNumber++;

    excelFile.setSimpleCell(workSheet, rowNumber, 'Y', 'TOTAL', font1);
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('Z').value;
    }
    const value = {
        formula: `SUM(Z${debut}:Z${rowNumber - 2})`,
        result: result
    };
    excelFile.setStylizedCell(workSheet, rowNumber, 'Z', value, false, {}, font1, '#,##0.00"€";\-#,##0.00"€"');
}


