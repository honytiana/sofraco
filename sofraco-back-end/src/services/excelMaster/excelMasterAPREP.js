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
    const dataCourtierOCR = {
        code: {
            cabinet: ocr.infos.infosBordereau.numOrias,
            code: ocr.infos.infosBordereau.numOrias,
        },
        headers,
        datas: ocr.infos.contrats,
        infosBordereau: ocr.infos.infosBordereau
    };
    infosOCR.push({ company: 'APREP', infosOCR: dataCourtierOCR });
    return infosOCR;
}

exports.createWorkSheetAPREP = (workSheet, dataCourtierOCR) => {
    const font1 = { name: 'Arial', size: 10 };
    const font2 = { bold: true, name: 'Arial', size: 10 };

    excelFile.setSimpleCell(workSheet, 1, 'A', dataCourtierOCR.infosOCR.infosBordereau.lieu, font1);
    excelFile.setSimpleCell(workSheet, 1, 'B', dataCourtierOCR.infosOCR.infosBordereau.datebordereau, font2);

    excelFile.setSimpleCell(workSheet, 2, 'A', 'N° ORIAS', font1);
    excelFile.setSimpleCell(workSheet, 2, 'B', dataCourtierOCR.infosOCR.infosBordereau.numOrias, font2);

    excelFile.setSimpleCell(workSheet, 3, 'A', 'Objet', font1);
    excelFile.setSimpleCell(workSheet, 3, 'B', dataCourtierOCR.infosOCR.infosBordereau.objet, font2);

    excelFile.setSimpleCell(workSheet, 4, 'A', 'Designation', font1);
    excelFile.setSimpleCell(workSheet, 4, 'B', dataCourtierOCR.infosOCR.infosBordereau.designation, font2);

    excelFile.setSimpleCell(workSheet, 5, 'A', 'Montant HT', font1);
    excelFile.setSimpleCell(workSheet, 5, 'B', dataCourtierOCR.infosOCR.infosBordereau.montantHT, font2);

    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        excelFile.setSimpleCell(workSheet, 8, cellNumber, header, font2);
        cellNumber++;
    });

    let rowNumber = 9;
    let debut = 9;
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
    workSheet.getRow(rowNumber).getCell('I').value = dataCourtierOCR.infosOCR.infosBordereau.montantHT;
    workSheet.getRow(rowNumber).getCell('I').font = { bold: true, name: 'Arial', size: 10 };
    workSheet.getRow(rowNumber).getCell('I').numFmt = '#,##0.00"€";\-#,##0.00"€"';
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
        infosOCR.push({ company: 'APREP ENCOURS', infosOCR: dataCourtierOCR });
    }
    return infosOCR;
}

exports.createWorkSheetAPREPENCOURS = (workSheet, dataCourtierOCR) => {
    workSheet.getColumn('A').width = 50;
    const font1 = { bold: true, name: 'Arial', size: 12 };
    const font2 = { name: 'Arial', size: 12 };
    const row1 = workSheet.getRow(1);
    row1.height = 20;

    const cellInfo = { workSheet, rowNumber: 1, cell: 'A', value: 'Commissions sur encours versées trimestriellement', mergedCells: 'A1:I1' };
    excelFile.setMergedCell(cellInfo, false, {}, font2);

    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        excelFile.setSimpleCell(workSheet, 3, cellNumber, header, font2);
        cellNumber++;
    });

    excelFile.setSimpleCell(workSheet, 4, 'A', `CONTACT : ${dataCourtierOCR.infosOCR.code.cabinet}`, font1);

    let rowNumber = 5;
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
}

