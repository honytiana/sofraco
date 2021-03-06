const excelFile = require('../utils/excelFile');

exports.getOCRMIE = (ocr) => { };

exports.createWorkSheetMIE = (workSheet, dataCourtierOCR, reste = false, rowNumberI = null) => { };

exports.getOCRMIEMCMS = (ocr) => {
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
                mieVersion: ocr.mieVersion
            };
            infosOCR.push({ companyGlobalName: 'MIE', companyName: `MIE MCMS`, infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetMIEMCMS = (workSheet, dataCourtierOCR, reste = false, rowNumberI = null) => {
    let rowNumber = !reste ? 1 : rowNumberI;
    let mieAxiom, mieV1 = false;
    switch (dataCourtierOCR.infosOCR.mieVersion) {
        case 'mieAxiom':
            mieAxiom = true;
            break;
        case 'mieV1':
            mieV1 = true;
            break;
    }
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        excelFile.setSimpleCell(workSheet, rowNumber, cellNumber, header, { bold: true, name: 'Arial', size: 10 });
        cellNumber++;
    });
    rowNumber++;

    let debut = rowNumber;
    if (mieAxiom) {
        rowNumber = createPavetMIEAXIOM(dataCourtierOCR, workSheet, rowNumber);
    }
    if (mieV1) {
        rowNumber = createPavetMIEV1(dataCourtierOCR, workSheet, rowNumber);
    }
    rowNumber++;
    excelFile.setSimpleCell(workSheet, rowNumber, 'N', 'TOTAL', { bold: true, name: 'Arial', size: 10 });
    let result = 0;
    for (let i = debut; i <= rowNumber - 2; i++) {
        result += workSheet.getRow(i).getCell('O').value;
    }
    const value =  {
        formula: `SUM(O${debut}:O${rowNumber - 2})`,
        result: result
    };
    excelFile.setStylizedCell(workSheet, rowNumber, 'O', value, false, {}, { bold: true, name: 'Arial', size: 10 }, '#,##0.00"???";\-#,##0.00"???"');
    if (reste) {
        return rowNumber;
    }
}

const createPavetMIEAXIOM = (dataCourtierOCR, workSheet, rowNumber) => {
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.dateComptable;
        workSheet.getRow(rowNumber).getCell('A').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('B').value = datas.numAdherent;
        workSheet.getRow(rowNumber).getCell('C').value = datas.codeCourtier;
        workSheet.getRow(rowNumber).getCell('D').value = datas.raisonSocialeApporteur;
        workSheet.getRow(rowNumber).getCell('E').value = datas.nom;
        workSheet.getRow(rowNumber).getCell('F').value = datas.prenom;
        workSheet.getRow(rowNumber).getCell('G').value = datas.tel;
        workSheet.getRow(rowNumber).getCell('H').value = datas.mail;
        workSheet.getRow(rowNumber).getCell('I').value = datas.codePostal;
        workSheet.getRow(rowNumber).getCell('J').value = datas.ville;
        workSheet.getRow(rowNumber).getCell('K').value = datas.dateEffetContrat;
        workSheet.getRow(rowNumber).getCell('K').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('L').value = datas.dateFinContrat;
        workSheet.getRow(rowNumber).getCell('L').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('M').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('N').value = datas.libelleProduit;
        workSheet.getRow(rowNumber).getCell('O').value = datas.mtCommission;
        workSheet.getRow(rowNumber).getCell('O').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('P').value = datas.totalEncaisse;
        workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('Q').value = datas.assieteSanteHTEncaisse;
        workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('R').value = datas.taxesEncaisses;
        workSheet.getRow(rowNumber).getCell('R').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('S').value = datas.obsActionMutac;
        workSheet.getRow(rowNumber).getCell('S').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('T').value = datas.spheria;
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('U').value = datas.cotisationARepartir && datas.cotisationARepartir.result ? datas.cotisationARepartir.result : 0;
        workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('V').value = datas.courtier && datas.courtier.result ? datas.courtier.result : 0;
        workSheet.getRow(rowNumber).getCell('V').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('W').value = datas.fondateur && datas.fondateur.result ? datas.fondateur.result : 0;
        workSheet.getRow(rowNumber).getCell('W').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('X').value = datas.pavillon && datas.pavillon.result ? datas.pavillon.result : 0;
        workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('Y').value = datas.sofraco && datas.sofraco.result ? datas.sofraco.result : 0;
        workSheet.getRow(rowNumber).getCell('Y').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('Z').value = datas.sofracoExpertises && datas.sofracoExpertises.result ? datas.sofracoExpertises.result : 0;
        workSheet.getRow(rowNumber).getCell('Z').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('AA').value = datas.resteAVerser && datas.resteAVerser.result ? datas.resteAVerser.result : 0;
        workSheet.getRow(rowNumber).getCell('AA').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        rowNumber++;
    }
    return rowNumber;
};

const createPavetMIEV1 = (dataCourtierOCR, workSheet, rowNumber) => {
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.dateComptable;
        workSheet.getRow(rowNumber).getCell('A').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('B').value = datas.codeCourtier;
        workSheet.getRow(rowNumber).getCell('C').value = datas.raisonSocialeApporteur;
        workSheet.getRow(rowNumber).getCell('D').value = datas.numAdherent;
        workSheet.getRow(rowNumber).getCell('E').value = datas.nom;
        workSheet.getRow(rowNumber).getCell('F').value = datas.prenom;
        workSheet.getRow(rowNumber).getCell('G').value = datas.tel;
        workSheet.getRow(rowNumber).getCell('H').value = datas.mail;
        workSheet.getRow(rowNumber).getCell('I').value = datas.codePostal;
        workSheet.getRow(rowNumber).getCell('J').value = datas.ville;
        workSheet.getRow(rowNumber).getCell('K').value = datas.dateEffetContrat;
        workSheet.getRow(rowNumber).getCell('K').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('L').value = datas.dateFinContrat;
        workSheet.getRow(rowNumber).getCell('L').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('M').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('N').value = datas.libelleProduit;
        workSheet.getRow(rowNumber).getCell('O').value = datas.mtCommission;
        workSheet.getRow(rowNumber).getCell('O').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('P').value = datas.totalEncaisse;
        workSheet.getRow(rowNumber).getCell('P').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('Q').value = datas.assieteSanteHTEncaisse;
        workSheet.getRow(rowNumber).getCell('Q').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('R').value = datas.trfObs;
        workSheet.getRow(rowNumber).getCell('R').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('S').value = datas.trfMat;
        workSheet.getRow(rowNumber).getCell('S').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('T').value = datas.taxesEncaisses;
        workSheet.getRow(rowNumber).getCell('T').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('U').value = datas.courtier && datas.courtier.result ? datas.courtier.result : 0;
        workSheet.getRow(rowNumber).getCell('U').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('V').value = datas.fondateur && datas.fondateur.result ? datas.fondateur.result : 0;
        workSheet.getRow(rowNumber).getCell('V').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('W').value = datas.pavillon && datas.pavillon.result ? datas.pavillon.result : 0;
        workSheet.getRow(rowNumber).getCell('W').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('X').value = datas.sofraco && datas.sofraco.result ? datas.sofraco.result : 0;
        workSheet.getRow(rowNumber).getCell('X').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('Y').value = datas.sofracoExpertises && datas.sofracoExpertises.result ? datas.sofracoExpertises.result : 0;
        workSheet.getRow(rowNumber).getCell('Y').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        workSheet.getRow(rowNumber).getCell('Z').value = datas.budget && datas.budget.result ? datas.budget.result : 0;
        workSheet.getRow(rowNumber).getCell('Z').numFmt = '#,##0.00"???";\-#,##0.00"???"';
        rowNumber++;
    }
    return rowNumber;

};

