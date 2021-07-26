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


