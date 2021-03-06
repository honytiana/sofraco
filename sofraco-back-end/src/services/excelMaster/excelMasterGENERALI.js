const fs = require('fs');
const excelFile = require('../utils/excelFile');

exports.getOCRGENERALI = (ocr) => {
    const headers = ocr.headers;
    const allContratsPerCourtier = JSON.parse(fs.readFileSync(ocr.allContratsPerCourtier)).allContratsPerCourtier;
    let infosOCR = [];
    allContratsPerCourtier.forEach((contrat, index) => {
        if (contrat.courtier.code) {
            const dataCourtierOCR = {
                code: {
                    cabinet: contrat.courtier.code,
                    code: contrat.courtier.code,
                },
                headers,
                datas: contrat.contrats
            };
            infosOCR.push({ companyGlobalName: 'GENERALI', companyName: 'GENERALI', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetGENERALI = (workSheet, dataCourtierOCR, reste = false, rowNumberI = null) => {
    let rowNumber = !reste ? 1 : rowNumberI;
    const font1 = { bold: true, name: 'Arial', size: 10 };
    const row1 = workSheet.getRow(rowNumber);
    row1.font = font1;
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        excelFile.setSimpleCell(workSheet, rowNumber, cellNumber, header, font1);
        cellNumber++;
    });
    rowNumber++;

    let debut = rowNumber;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.reference.result;
        workSheet.getRow(rowNumber).getCell('B').value = datas.numeroReleve.result;
        workSheet.getRow(rowNumber).getCell('C').value = datas.dateReleve;
        workSheet.getRow(rowNumber).getCell('D').value = datas.codeRegroupementIntermediaire;
        workSheet.getRow(rowNumber).getCell('E').value = datas.codeIntermediaire;
        workSheet.getRow(rowNumber).getCell('F').value = datas.codePortefeuille;
        workSheet.getRow(rowNumber).getCell('G').value = datas.libellePortefeuille;
        workSheet.getRow(rowNumber).getCell('H').value = datas.codePortefeuilleExterne;
        workSheet.getRow(rowNumber).getCell('I').value = datas.libelleFamilleCommerciale;
        workSheet.getRow(rowNumber).getCell('J').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('K').value = datas.libelleProduit;
        workSheet.getRow(rowNumber).getCell('L').value = datas.natureOperation;
        workSheet.getRow(rowNumber).getCell('M').value = datas.libelleTypePrime;
        workSheet.getRow(rowNumber).getCell('N').value = datas.numeroContratOunumeroConvention;
        workSheet.getRow(rowNumber).getCell('O').value = datas.raisonSociale;
        workSheet.getRow(rowNumber).getCell('P').value = datas.numeroContratAffilie;
        workSheet.getRow(rowNumber).getCell('Q').value = datas.referenceExterne;
        workSheet.getRow(rowNumber).getCell('R').value = datas.numeroContractant;
        workSheet.getRow(rowNumber).getCell('S').value = datas.nomContractant;
        workSheet.getRow(rowNumber).getCell('T').value = datas.prenomContractant;
        workSheet.getRow(rowNumber).getCell('U').value = datas.numeroAssure;
        workSheet.getRow(rowNumber).getCell('V').value = datas.nomAssure;
        workSheet.getRow(rowNumber).getCell('W').value = datas.prenomAssure;
        workSheet.getRow(rowNumber).getCell('X').value = datas.dateOperation;
        workSheet.getRow(rowNumber).getCell('Y').value = datas.dateDebutPeriode;
        workSheet.getRow(rowNumber).getCell('Z').value = datas.dateFinPeriode;
        workSheet.getRow(rowNumber).getCell('AA').value = datas.libelleGarantie;
        workSheet.getRow(rowNumber).getCell('AB').value = datas.natureSupport;
        workSheet.getRow(rowNumber).getCell('AC').value = datas.codeISIN;
        workSheet.getRow(rowNumber).getCell('AD').value = datas.libelleSupport;
        workSheet.getRow(rowNumber).getCell('AE').value = typeof datas.montantCotisationTTC === 'string' ? parseFloat(datas.montantCotisationTTC.replace(/\s/g, '').replace(',', '.')) : datas.montantCotisationTTC;
        workSheet.getRow(rowNumber).getCell('AE').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('AF').value = typeof datas.montantCotisationHTOuNetInvestiEnEpargne === 'string' ? parseFloat(datas.montantCotisationHTOuNetInvestiEnEpargne.replace(/\s/g, '').replace(',', '.')) : datas.montantCotisationHTOuNetInvestiEnEpargne;
        workSheet.getRow(rowNumber).getCell('AF').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('AG').value = datas.assietteCasCommission;
        workSheet.getRow(rowNumber).getCell('AH').value = datas.tauxCommission;
        workSheet.getRow(rowNumber).getCell('AI').value = datas.typeMontant;
        workSheet.getRow(rowNumber).getCell('AJ').value = datas.natureCommission;
        workSheet.getRow(rowNumber).getCell('AK').value = typeof datas.montantCommission === 'string' ? parseFloat(datas.montantCommission.replace(/\s/g, '').replace(',', '.')) : datas.montantCommission;
        workSheet.getRow(rowNumber).getCell('AK').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('AL').value = datas.deviseMontant;
        workSheet.getRow(rowNumber).getCell('AM').value = datas.qualificationCommission;
        workSheet.getRow(rowNumber).getCell('AN').value = datas.conformiteAdministrative;
        workSheet.getRow(rowNumber).getCell('AO').value = datas.transfertPortefeuille;
        workSheet.getRow(rowNumber).getCell('AP').value = datas.codeOption;
        workSheet.getRow(rowNumber).getCell('AQ').value = datas.complementInformations;
        rowNumber++;
    }
    rowNumber++;
    excelFile.setSimpleCell(workSheet, rowNumber, 'AJ', 'TOTAL', font1);
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('AK').value;
    }
    const value = {
        formula: `SUM(AK${debut}:AK${rowNumber - 2})`,
        result: result
    };
    excelFile.setStylizedCell(workSheet, rowNumber, 'AK', value, false, {}, font1, '#,##0.00"???";[Red]\-#,##0.00"???"');
    for (let i = 1; i <= dataCourtierOCR.infosOCR.headers.length; i++) {
        workSheet.getRow(rowNumber).getCell(i).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ed7d31' }
        };
    }
    if (reste) {
        return rowNumber;
    }
}


