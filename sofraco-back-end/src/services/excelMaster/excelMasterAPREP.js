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
    const row1 = workSheet.getRow(1);
    row1.getCell('A').value = dataCourtierOCR.infosOCR.infosBordereau.lieu;
    row1.getCell('A').font = { name: 'Arial', size: 10 };
    row1.getCell('B').value = dataCourtierOCR.infosOCR.infosBordereau.datebordereau;
    row1.getCell('B').font = { bold: true, name: 'Arial', size: 10 };
    // row1.getCell('B').numFmt = 'dd/mm/yyyy';

    const row2 = workSheet.getRow(2);
    row2.getCell('A').value = 'N° ORIAS';
    row2.getCell('A').font = { name: 'Arial', size: 10 };
    row2.getCell('B').value = dataCourtierOCR.infosOCR.infosBordereau.numOrias;
    row2.getCell('B').font = { bold: true, name: 'Arial', size: 10 };

    const row3 = workSheet.getRow(3);
    row3.getCell('A').value = 'Objet';
    row3.getCell('A').font = { name: 'Arial', size: 10 };
    row3.getCell('B').value = dataCourtierOCR.infosOCR.infosBordereau.objet;
    row3.getCell('B').font = { bold: true, name: 'Arial', size: 10 };

    const row4 = workSheet.getRow(4);
    row4.getCell('A').value = 'Designation';
    row4.getCell('A').font = { name: 'Arial', size: 10 };
    row4.getCell('B').value = dataCourtierOCR.infosOCR.infosBordereau.designation;
    row4.getCell('B').font = { bold: true, name: 'Arial', size: 10 };

    const row5 = workSheet.getRow(5);
    row5.getCell('A').value = 'Montant HT';
    row5.getCell('A').font = { name: 'Arial', size: 10 };
    row5.getCell('B').value = dataCourtierOCR.infosOCR.infosBordereau.montantHT;
    row5.getCell('B').font = { bold: true, name: 'Arial', size: 10 };

    const row8 = workSheet.getRow(8);
    row8.font = { bold: true, name: 'Arial', size: 10 };
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        row8.getCell(cellNumber).value = header;
        cellNumber++;
    });

    let rowNumber = 9;
    let debut = 9;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
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
    const row1 = workSheet.getRow(1);
    row1.getCell('A').value = 'Commissions sur encours versées trimestriellement';
    row1.getCell('A').font = { name: 'Arial', size: 15 };
    workSheet.mergeCells('A1:I1');
    row1.getCell('A').alignment = { horizontal: 'center' };
    row1.height = 20;

    const row3 = workSheet.getRow(3);
    row3.font = { name: 'Arial', size: 12 };
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        row3.getCell(cellNumber).value = header;
        cellNumber++;
    });

    const row4 = workSheet.getRow(4);
    row4.getCell('A').value = `CONTACT : ${dataCourtierOCR.infosOCR.code.cabinet}`;
    row4.getCell('A').font = { bold: true, name: 'Arial', size: 12 };

    let rowNumber = 5;
    for (let datas of dataCourtierOCR.infosOCR.datas.contrats) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 12 };
        workSheet.getRow(rowNumber).height = 40;
        workSheet.getRow(rowNumber).getCell('A').value = `PRODUIT : ${datas.produit}`;
        workSheet.getRow(rowNumber).getCell('A').alignment = { wrapText: true };
        rowNumber++;
        for (let c of datas.contenu) {
            workSheet.getRow(rowNumber).font = { name: 'Arial', size: 12 };
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
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 12 };
        workSheet.getRow(rowNumber).height = 40;
        // workSheet.getRow(rowNumber).getCell('A').value = datas.totalAprepEncours.nom;
        workSheet.getRow(rowNumber).getCell('A').value = `TOTAL ${datas.produit}`;
        workSheet.getRow(rowNumber).getCell('A').font = { bold: true, name: 'Arial', size: 12 };
        workSheet.getRow(rowNumber).getCell('A').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' }
        };
        workSheet.getRow(rowNumber).getCell('A').alignment = { wrapText: true };
        workSheet.getRow(rowNumber).getCell('B').value = '';
        workSheet.getRow(rowNumber).getCell('B').border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' }
        };
        workSheet.getRow(rowNumber).getCell('C').value = datas.totalAprepEncours.encours1;
        workSheet.getRow(rowNumber).getCell('C').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('C').border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' }
        };
        workSheet.getRow(rowNumber).getCell('D').value = datas.totalAprepEncours.encours2;
        workSheet.getRow(rowNumber).getCell('D').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('D').border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' }
        };
        workSheet.getRow(rowNumber).getCell('E').value = datas.totalAprepEncours.encours3;
        workSheet.getRow(rowNumber).getCell('E').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('E').border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' }
        };
        workSheet.getRow(rowNumber).getCell('F').value = datas.totalAprepEncours.encours4;
        workSheet.getRow(rowNumber).getCell('F').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('F').border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' }
        };
        workSheet.getRow(rowNumber).getCell('G').value = datas.totalAprepEncours.moyenne;
        workSheet.getRow(rowNumber).getCell('G').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('G').border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' }
        };
        workSheet.getRow(rowNumber).getCell('H').value = datas.totalAprepEncours.tauxMoyen;
        workSheet.getRow(rowNumber).getCell('H').border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' }
        };
        workSheet.getRow(rowNumber).getCell('I').value = datas.totalAprepEncours.totalCommission;
        workSheet.getRow(rowNumber).getCell('I').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('I').border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        rowNumber++;
    }

    workSheet.getRow(rowNumber).font = { name: 'Arial', size: 12, color: { argb: 'FFFFFF' } };
    workSheet.getRow(rowNumber).getCell('A').value = dataCourtierOCR.infosOCR.datas.total.nom;
    workSheet.getRow(rowNumber).getCell('A').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ed7d31' }
    };
    workSheet.getRow(rowNumber).getCell('B').value = '';
    workSheet.getRow(rowNumber).getCell('B').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ed7d31' }
    };
    workSheet.getRow(rowNumber).getCell('C').value = dataCourtierOCR.infosOCR.datas.total.encours1;
    workSheet.getRow(rowNumber).getCell('C').numFmt = '#,##0.00"€";\-#,##0.00"€"';
    workSheet.getRow(rowNumber).getCell('C').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ed7d31' }
    };
    workSheet.getRow(rowNumber).getCell('D').value = dataCourtierOCR.infosOCR.datas.total.encours2;
    workSheet.getRow(rowNumber).getCell('D').numFmt = '#,##0.00"€";\-#,##0.00"€"';
    workSheet.getRow(rowNumber).getCell('D').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ed7d31' }
    };
    workSheet.getRow(rowNumber).getCell('E').value = dataCourtierOCR.infosOCR.datas.total.encours3;
    workSheet.getRow(rowNumber).getCell('E').numFmt = '#,##0.00"€";\-#,##0.00"€"';
    workSheet.getRow(rowNumber).getCell('E').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ed7d31' }
    };
    workSheet.getRow(rowNumber).getCell('F').value = dataCourtierOCR.infosOCR.datas.total.encours4;
    workSheet.getRow(rowNumber).getCell('F').numFmt = '#,##0.00"€";\-#,##0.00"€"';
    workSheet.getRow(rowNumber).getCell('F').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ed7d31' }
    };
    workSheet.getRow(rowNumber).getCell('G').value = dataCourtierOCR.infosOCR.datas.total.moyenne;
    workSheet.getRow(rowNumber).getCell('G').numFmt = '#,##0.00"€";\-#,##0.00"€"';
    workSheet.getRow(rowNumber).getCell('G').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ed7d31' }
    };
    workSheet.getRow(rowNumber).getCell('H').value = '';
    workSheet.getRow(rowNumber).getCell('H').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ed7d31' }
    };
    workSheet.getRow(rowNumber).getCell('I').value = dataCourtierOCR.infosOCR.datas.total.totalCommission;
    workSheet.getRow(rowNumber).getCell('I').numFmt = '#,##0.00"€";\-#,##0.00"€"';
    workSheet.getRow(rowNumber).getCell('I').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ed7d31' }
    };
    rowNumber++;
}

