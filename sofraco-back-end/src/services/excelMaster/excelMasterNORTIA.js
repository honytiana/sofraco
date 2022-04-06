const excelFile = require('../utils/excelFile');

exports.getOCRAPREP = (ocr) => {
    const headers = [
        'Date Prelevement',
        'Numero Contrat',
        'Date payement',
        'Nom',
        'Prenom',
        'Fract',
        'Prime Commissionnee',
        'Taux Commission Apporteur',
        'Commission Apporteur'
    ];
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
                infosBordereau: ocr.infosBordereau
            };
            infosOCR.push({ companyGlobalName: 'NORTIA', companyName: 'APREP PREVOYANCE', infosOCR: dataCourtierOCR });
        }
    });
    return infosOCR;
}

exports.createWorkSheetAPREP = (workSheet, dataCourtierOCR, reste = false, rowNumberI = null) => {
    let rowNumber = !reste ? 1 : rowNumberI;
    const font1 = { name: 'Arial', size: 10 };
    const font2 = { bold: true, name: 'Arial', size: 10 };

    excelFile.setSimpleCell(workSheet, rowNumber, 'A', dataCourtierOCR.infosOCR.infosBordereau.lieu, font1);
    excelFile.setSimpleCell(workSheet, rowNumber, 'B', dataCourtierOCR.infosOCR.infosBordereau.datebordereau, font2);
    rowNumber++;

    excelFile.setSimpleCell(workSheet, rowNumber, 'A', 'N° ORIAS', font1);
    excelFile.setSimpleCell(workSheet, rowNumber, 'B', dataCourtierOCR.infosOCR.infosBordereau.numOrias, font2);
    rowNumber++;

    excelFile.setSimpleCell(workSheet, rowNumber, 'A', 'Objet', font1);
    excelFile.setSimpleCell(workSheet, rowNumber, 'B', dataCourtierOCR.infosOCR.infosBordereau.objet, font2);
    rowNumber++;

    excelFile.setSimpleCell(workSheet, rowNumber, 'A', 'Designation', font1);
    excelFile.setSimpleCell(workSheet, rowNumber, 'B', dataCourtierOCR.infosOCR.infosBordereau.designation, font2);
    rowNumber++;

    excelFile.setSimpleCell(workSheet, rowNumber, 'A', 'Montant HT', font1);
    excelFile.setSimpleCell(workSheet, rowNumber, 'B', dataCourtierOCR.infosOCR.infosBordereau.montantHT, font2);
    rowNumber++;
    rowNumber++;
    rowNumber++;

    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        excelFile.setSimpleCell(workSheet, rowNumber, cellNumber, header, font2);
        cellNumber++;
    });

    rowNumber++;
    let debut = rowNumber;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = font1;
        workSheet.getRow(rowNumber).getCell('A').value = datas.datePrelevement;
        // workSheet.getRow(rowNumber).getCell('A').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('B').value = datas.numeroContrat;
        workSheet.getRow(rowNumber).getCell('C').value = datas.datePaiement;
        // workSheet.getRow(rowNumber).getCell('C').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('D').value = datas.nom;
        workSheet.getRow(rowNumber).getCell('E').value = datas.prenoms;
        workSheet.getRow(rowNumber).getCell('F').value = datas.fract;
        workSheet.getRow(rowNumber).getCell('G').value = datas.primeCommissionnement;
        workSheet.getRow(rowNumber).getCell('G').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('H').value = datas.tauxCommissionApporteur;
        workSheet.getRow(rowNumber).getCell('I').value = datas.commissionApporteur;
        workSheet.getRow(rowNumber).getCell('I').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        if (!datas.verificationCommissionApporteur) {
            workSheet.getRow(rowNumber).getCell('I').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF0000' }
            };
        }
        rowNumber++;
    }
    rowNumber++;
    workSheet.getRow(rowNumber).getCell('H').value = 'TOTAL';
    workSheet.getRow(rowNumber).getCell('H').font = { bold: true, name: 'Arial', size: 10 };
    let result = 0;
    for (let i = debut; i <= rowNumber - 1; i++) {
        result += workSheet.getRow(i).getCell('I').value;
    }
    const value = {
        formula: `SUM(I${debut}:I${rowNumber - 2})`,
        result: result
    };
    excelFile.setStylizedCell(workSheet, rowNumber, 'I', value, false, {}, { bold: true, name: 'Arial', size: 10 }, '#,##0.00"€";\-#,##0.00"€"');
    if (reste) {
        return rowNumber;
    }
}

exports.getOCRAPREPENCOURS = (ocr) => {
    let infosOCR = [];
    for (let contrat of ocr.infos.contrats) {
        const dataCourtierOCR = {
            code: {
                cabinet: contrat.contact,
                code: contrat.contact,
            },
            headers: ocr.infos.infosBordereau.headers,
            datas: contrat,
            infosBordereau: ocr.infos.infosBordereau
        };
        infosOCR.push({ companyGlobalName: 'NORTIA', companyName: 'APREP ENCOURS', infosOCR: dataCourtierOCR });
    }
    return infosOCR;
}

exports.createWorkSheetAPREPENCOURS = (workSheet, dataCourtierOCR, reste = false, rowNumberI = null) => {
    let rowNumber = !reste ? 1 : rowNumberI;
    workSheet.getColumn('A').width = 50;
    const font1 = { bold: true, name: 'Arial', size: 12 };
    const font2 = { name: 'Arial', size: 12 };
    const row1 = workSheet.getRow(rowNumber);
    row1.height = 20;

    const cellInfo = { workSheet, rowNumber, cell: 'A', value: 'Commissions sur encours versées trimestriellement', mergedCells: `A${rowNumber}:I${rowNumber}` };
    excelFile.setMergedCell(cellInfo, false, {}, font2);
    rowNumber++;
    rowNumber++;

    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        excelFile.setSimpleCell(workSheet, rowNumber, cellNumber, header, font2);
        cellNumber++;
    });
    rowNumber++;

    excelFile.setSimpleCell(workSheet, rowNumber, 'A', `CONTACT : ${dataCourtierOCR.infosOCR.code.cabinet}`, font1);
    rowNumber++;

    for (let datas of dataCourtierOCR.infosOCR.datas.contrats) {
        workSheet.getRow(rowNumber).font = font2
        workSheet.getRow(rowNumber).height = 40;
        workSheet.getRow(rowNumber).getCell('A').value = `PRODUIT : ${datas.produit}`;
        workSheet.getRow(rowNumber).getCell('A').alignment = { wrapText: true };
        rowNumber++;
        for (let c of datas.contenu) {
            workSheet.getRow(rowNumber).font = font2;
            workSheet.getRow(rowNumber).getCell('A').value = c.numero;
            workSheet.getRow(rowNumber).getCell('B').value = c.nom;
            workSheet.getRow(rowNumber).getCell('C').value = c.encours1;
            workSheet.getRow(rowNumber).getCell('C').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('D').value = c.encours2;
            workSheet.getRow(rowNumber).getCell('D').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('E').value = c.encours3;
            workSheet.getRow(rowNumber).getCell('E').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('F').value = c.encours4;
            workSheet.getRow(rowNumber).getCell('F').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('G').value = c.moyenne;
            workSheet.getRow(rowNumber).getCell('G').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            workSheet.getRow(rowNumber).getCell('H').value = c.tauxMoyen;
            workSheet.getRow(rowNumber).getCell('I').value = c.totalCommission;
            workSheet.getRow(rowNumber).getCell('I').numFmt = '#,##0.00"€";\-#,##0.00"€"';
            rowNumber++;
        }
        workSheet.getRow(rowNumber).font = font2;
        workSheet.getRow(rowNumber).height = 40;
        // workSheet.getRow(rowNumber).getCell('A').value = datas.totalAprepEncours.nom;
        const border1 = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' }
        };
        const border2 = {
            top: { style: 'thin' },
            bottom: { style: 'thin' }
        };
        excelFile.setStylizedCell(workSheet, rowNumber, 'A', `TOTAL ${datas.produit}`, true, border1, font1, '', 'ffffff', 'center', 'middle', true);
        excelFile.setStylizedCell(workSheet, rowNumber, 'B', '', true, border2, font2);
        excelFile.setStylizedCell(workSheet, rowNumber, 'C', '', true, border2, font2, '#,##0.00"€";\-#,##0.00"€"');
        excelFile.setStylizedCell(workSheet, rowNumber, 'D', datas.totalAprepEncours.encours2, true, border2, font2, '#,##0.00"€";\-#,##0.00"€"');
        excelFile.setStylizedCell(workSheet, rowNumber, 'E', datas.totalAprepEncours.encours3, true, border2, font2, '#,##0.00"€";\-#,##0.00"€"');
        excelFile.setStylizedCell(workSheet, rowNumber, 'F', datas.totalAprepEncours.encours4, true, border2, font2, '#,##0.00"€";\-#,##0.00"€"');
        excelFile.setStylizedCell(workSheet, rowNumber, 'G', datas.totalAprepEncours.moyenne, true, border2, font2, '#,##0.00"€";\-#,##0.00"€"');
        excelFile.setStylizedCell(workSheet, rowNumber, 'H', datas.totalAprepEncours.tauxMoyen, true, border2, font2, '#,##0.00"€";\-#,##0.00"€"');
        excelFile.setStylizedCell(workSheet, rowNumber, 'I', datas.totalAprepEncours.totalCommission, true, border1, font2, '#,##0.00"€";\-#,##0.00"€"');
        rowNumber++;
    }

    excelFile.setStylizedCell(workSheet, rowNumber, 'A', dataCourtierOCR.infosOCR.datas.total.nom, false, {}, { name: 'Arial', size: 12, color: { argb: 'FFFFFF' } }, '', 'ed7d31');
    excelFile.setStylizedCell(workSheet, rowNumber, 'B', '', false, {}, font2, '', 'ed7d31');
    excelFile.setStylizedCell(workSheet, rowNumber, 'C', dataCourtierOCR.infosOCR.datas.total.encours1, false, {}, font2, '#,##0.00"€";\-#,##0.00"€"', 'ed7d31');
    excelFile.setStylizedCell(workSheet, rowNumber, 'D', dataCourtierOCR.infosOCR.datas.total.encours2, false, {}, font2, '#,##0.00"€";\-#,##0.00"€"', 'ed7d31');
    excelFile.setStylizedCell(workSheet, rowNumber, 'E', dataCourtierOCR.infosOCR.datas.total.encours3, false, {}, font2, '#,##0.00"€";\-#,##0.00"€"', 'ed7d31');
    excelFile.setStylizedCell(workSheet, rowNumber, 'F', dataCourtierOCR.infosOCR.datas.total.encours4, false, {}, font2, '#,##0.00"€";\-#,##0.00"€"', 'ed7d31');
    excelFile.setStylizedCell(workSheet, rowNumber, 'G', dataCourtierOCR.infosOCR.datas.total.moyenne, false, {}, font2, '#,##0.00"€";\-#,##0.00"€"', 'ed7d31');
    excelFile.setStylizedCell(workSheet, rowNumber, 'H', '', false, {}, font2, '#,##0.00"€";\-#,##0.00"€"', 'ed7d31');
    excelFile.setStylizedCell(workSheet, rowNumber, 'I', dataCourtierOCR.infosOCR.datas.total.totalCommission, false, {}, font2, '#,##0.00"€";\-#,##0.00"€"', 'ed7d31');
    rowNumber++;
    if (reste) {
        return rowNumber;
    }
}

