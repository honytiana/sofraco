const excelFile = require('../utils/excelFile');

exports.getOCRSMATIS = (ocr) => {
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
            };
            infosOCR.push({ company: `SMATIS`, infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetSMATIS = (workSheet, dataCourtierOCR) => {

};

exports.getOCRSMATISMCMS = (ocr) => {
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
                smatisVersion: ocr.smatisVersion
            };
            infosOCR.push({ company: `SMATIS`, infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetSMATISMCMS = (workSheet, dataCourtierOCR) => {
    // let smatisAxiom = false;
    // switch (dataCourtierOCR.smatisVersion) {
    //     case 'smatisAxiom':
    //         smatisAxiom = true;
    //         break;
    // }
    excelFile.setSimpleCell(workSheet, 1, 'D', header.firstHeader[0], { bold: true, name: 'Arial', size: 10 });
    excelFile.setSimpleCell(workSheet, 2, 'M', header.firstHeader[1], { bold: true, name: 'Arial', size: 10 });
    
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.secondHeader.forEach((secondHeader, index) => {
        excelFile.setSimpleCell(workSheet, 3, cellNumber, secondHeader, { bold: true, name: 'Arial', size: 10 });
        cellNumber++;
    });
    rowNumber++;

    let debut = rowNumber;
    // if (smatisAxiom) {
    createPavetSMATISMCMS();
    // }
    rowNumber++;
    excelFile.setSimpleCell(workSheet, rowNumber, 'T', 'TOTAL', font1);
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('H').value;
    }
    const value =  {
        formula: `SUM(U${debut}:U${rowNumber - 2})`,
        result: result
    };
    excelFile.setStylizedCell(workSheet, rowNumber, 'U', value, false, {}, font1, '#,##0.00"€";\-#,##0.00"€"');
}

const createPavetSMATISMCMS = (dataCourtierOCR, workSheet, rowNumber) => {
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.debutPeriodeCotisation ? new Date(datas.debutPeriodeCotisation) : '';
        workSheet.getRow(rowNumber).getCell('A').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('B').value = datas.finDePeriodeCotisation ? new Date(datas.finDePeriodeCotisation) : '';
        workSheet.getRow(rowNumber).getCell('B').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('C').value = datas.nomGarantie;
        workSheet.getRow(rowNumber).getCell('D').value = datas.souscripteurContratGroupe;
        workSheet.getRow(rowNumber).getCell('E').value = datas.numPayeur;
        workSheet.getRow(rowNumber).getCell('F').value = datas.nomPayeur;
        workSheet.getRow(rowNumber).getCell('G').value = datas.codeCourtier;
        workSheet.getRow(rowNumber).getCell('H').value = datas.nomCourtier;
        workSheet.getRow(rowNumber).getCell('I').value = datas.numContratGroupe;
        workSheet.getRow(rowNumber).getCell('J').value = datas.dateDebutContratAdhesion ? new Date(datas.dateDebutContratAdhesion) : '';
        workSheet.getRow(rowNumber).getCell('J').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('K').value = datas.statusContratAdhesion;
        workSheet.getRow(rowNumber).getCell('L').value = datas.dateFinContratAdhesion ? new Date(datas.dateEffetContrat) : '';
        workSheet.getRow(rowNumber).getCell('L').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('M').value = datas.etapeImpaye;
        workSheet.getRow(rowNumber).getCell('N').value = datas.periodiciteCotisation;
        workSheet.getRow(rowNumber).getCell('O').value = datas.cotisationPayeePeriodeTTC;
        workSheet.getRow(rowNumber).getCell('O').numFmt = '#,##0.00"";\-#,##0.00""';
        workSheet.getRow(rowNumber).getCell('P').value = datas.cotisationPayeePeriodeHT;
        workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"";\-#,##0.00""';
        workSheet.getRow(rowNumber).getCell('Q').value = datas.taux;
        workSheet.getRow(rowNumber).getCell('R').value = datas.typeCommission;
        workSheet.getRow(rowNumber).getCell('S').value = datas.montantCommission;
        workSheet.getRow(rowNumber).getCell('S').numFmt = '#,##0.00"";\-#,##0.00""';
        workSheet.getRow(rowNumber).getCell('T').value = datas.courtier;
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('U').value = datas.fondateur;
        workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('V').value = datas.sogeas;
        workSheet.getRow(rowNumber).getCell('V').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('W').value = datas.procedure;
        workSheet.getRow(rowNumber).getCell('W').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        rowNumber++;
    }
};

