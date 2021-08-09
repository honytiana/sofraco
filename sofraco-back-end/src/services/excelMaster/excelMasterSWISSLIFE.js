
exports.getOCRSLADE = (ocr) => {
    let infosOCR = []
    for (let info of ocr.infos) {
        const syntheseDesCommissions = info.syntheseDesCommissions;
        const detailDesPolices = info.detailDesPolices;
        infosOCR.push({
            company: 'SLADE', infosOCR: {
                code: {
                    cabinet: syntheseDesCommissions.codeApporteur,
                    code: syntheseDesCommissions.codeApporteur
                },
                syntheseDesCommissions,
                detailDesPolices
            }
        });
    }
    return infosOCR;

}

exports.createWorkSheetSLADE = (workSheet, dataCourtierOCR) => {
    workSheet.getColumn('A').width = 40;
    const row1 = workSheet.getRow(1);
    row1.font = { name: 'Arial', size: 10 };
    row1.getCell('A').value = 'Synthèse de vos commissions';
    row1.getCell('A').font = { name: 'Arial', size: 12, bold: true, color: { argb: '960f2f' } };

    const row3 = workSheet.getRow(3);
    row3.getCell('A').value = 'Nombre de primes sur la période : ';
    row3.getCell('A').font = { name: 'Arial', size: 10 };
    row3.getCell('A').border = {
        top: { style: 'thin', color: {argb:'960f2f'} },
        left: { style: 'thin', color: {argb:'960f2f'} },
        bottom: { style: 'thin', color: {argb:'960f2f'} },
        right: { style: 'thin', color: {argb:'960f2f'} }
    };
    row3.getCell('B').value = dataCourtierOCR.infosOCR.syntheseDesCommissions.nombrePrimeSurLaPeriode;
    row3.getCell('B').font = { name: 'Arial', size: 10 };
    row3.getCell('B').border = {
        top: { style: 'thin', color: {argb:'960f2f'} },
        left: { style: 'thin', color: {argb:'960f2f'} },
        bottom: { style: 'thin', color: {argb:'960f2f'} },
        right: { style: 'thin', color: {argb:'960f2f'} }
    };

    const row4 = workSheet.getRow(4);
    row4.getCell('A').value = 'Total des primes encaissées sur la période : ';
    row4.getCell('A').font = { name: 'Arial', size: 10 };
    row4.getCell('A').border = {
        top: { style: 'thin', color: {argb:'960f2f'} },
        left: { style: 'thin', color: {argb:'960f2f'} },
        bottom: { style: 'thin', color: {argb:'960f2f'} },
        right: { style: 'thin', color: {argb:'960f2f'} }
    };
    row4.getCell('B').value = dataCourtierOCR.infosOCR.syntheseDesCommissions.totalPrimesEncaisseesSurLaPeriode;
    row4.getCell('B').numFmt = '#,##0.00"€";\-#,##0.00"€"';
    row4.getCell('B').font = { name: 'Arial', size: 10 };
    row4.getCell('B').border = {
        top: { style: 'thin', color: {argb:'960f2f'} },
        left: { style: 'thin', color: {argb:'960f2f'} },
        bottom: { style: 'thin', color: {argb:'960f2f'} },
        right: { style: 'thin', color: {argb:'960f2f'} }
    };

    const row5 = workSheet.getRow(5);
    row5.getCell('A').value = 'Total des commissions calculées sur la période : ';
    row5.getCell('A').font = { name: 'Arial', size: 10 };
    row5.getCell('A').border = {
        top: { style: 'thin', color: {argb:'960f2f'} },
        left: { style: 'thin', color: {argb:'960f2f'} },
        bottom: { style: 'thin', color: {argb:'960f2f'} },
        right: { style: 'thin', color: {argb:'960f2f'} }
    };
    row5.getCell('B').value = dataCourtierOCR.infosOCR.syntheseDesCommissions.totalCommissionsCalculeesSurLaPeriode;
    row5.getCell('B').numFmt = '#,##0.00"€";\-#,##0.00"€"';
    row5.getCell('B').font = { name: 'Arial', size: 10 };
    row5.getCell('B').border = {
        top: { style: 'thin', color: {argb:'960f2f'} },
        left: { style: 'thin', color: {argb:'960f2f'} },
        bottom: { style: 'thin', color: {argb:'960f2f'} },
        right: { style: 'thin', color: {argb:'960f2f'} }
    };

    const row6 = workSheet.getRow(6);
    row6.getCell('A').value = 'Report solde précédent : ';
    row6.getCell('A').font = { name: 'Arial', size: 10 };
    row6.getCell('A').border = {
        top: { style: 'thin', color: {argb:'960f2f'} },
        left: { style: 'thin', color: {argb:'960f2f'} },
        bottom: { style: 'thin', color: {argb:'960f2f'} },
        right: { style: 'thin', color: {argb:'960f2f'} }
    };
    row6.getCell('B').value = dataCourtierOCR.infosOCR.syntheseDesCommissions.reportSoldePrecedent;
    row6.getCell('B').numFmt = '#,##0.00"€";\-#,##0.00"€"';
    row6.getCell('B').font = { name: 'Arial', size: 10 };
    row6.getCell('B').border = {
        top: { style: 'thin', color: {argb:'960f2f'} },
        left: { style: 'thin', color: {argb:'960f2f'} },
        bottom: { style: 'thin', color: {argb:'960f2f'} },
        right: { style: 'thin', color: {argb:'960f2f'} }
    };

    const row7 = workSheet.getRow(7);
    row7.getCell('A').value = 'Total des commissions dues : ';
    row7.getCell('A').font = { name: 'Arial', size: 10, bold: true, color: { argb: '960f2f' } };
    row7.getCell('A').border = {
        top: { style: 'thin', color: {argb:'960f2f'} },
        left: { style: 'thin', color: {argb:'960f2f'} },
        bottom: { style: 'thin', color: {argb:'960f2f'} },
        right: { style: 'thin', color: {argb:'960f2f'} }
    };
    row7.getCell('B').value = dataCourtierOCR.infosOCR.syntheseDesCommissions.totalCommissionsDues;
    row7.getCell('B').numFmt = '#,##0.00"€";\-#,##0.00"€"';
    row7.getCell('B').font = { name: 'Arial', size: 10, bold: true, color: { argb: '960f2f' } };
    row7.getCell('B').border = {
        top: { style: 'thin', color: {argb:'960f2f'} },
        left: { style: 'thin', color: {argb:'960f2f'} },
        bottom: { style: 'thin', color: {argb:'960f2f'} },
        right: { style: 'thin', color: {argb:'960f2f'} }
    };

    const row9 = workSheet.getRow(9);
    row9.getCell('A').value = 'BORDEREAU DE COMMISSIONS';
    row9.getCell('A').font = { name: 'Arial', size: 10, bold: true, color: { argb: '960f2f' } };

    const row10 = workSheet.getRow(10);
    row10.getCell('A').value = 'Détail des polices';
    row10.getCell('A').font = { name: 'Arial', size: 10, bold: true, color: { argb: '960f2f' } };

    const row12 = workSheet.getRow(12);
    workSheet.mergeCells('A12:B12');
    workSheet.mergeCells('C12:F12');
    workSheet.mergeCells('G12:I12');
    workSheet.mergeCells('J12:N12');
    row12.getCell('A').value = 'AGENCE';
    row12.getCell('A').alignment = { horizontal: 'center' };
    row12.getCell('A').font = { name: 'Arial', size: 11, bold: true, color: { argb: '960f2f' } };
    row12.getCell('A').border = {
        top: { style: 'thin', color: {argb:'960f2f'} },
        left: { style: 'thin', color: {argb:'960f2f'} },
        bottom: { style: 'thin', color: {argb:'960f2f'} },
        right: { style: 'thin', color: {argb:'960f2f'} }
    };

    row12.getCell('C').value = 'CONTRAT';
    row12.getCell('C').alignment = { horizontal: 'center' };
    row12.getCell('C').font = { name: 'Arial', size: 11, bold: true, color: { argb: '960f2f' } };
    row12.getCell('C').border = {
        top: { style: 'thin', color: {argb:'960f2f'} },
        left: { style: 'thin', color: {argb:'960f2f'} },
        bottom: { style: 'thin', color: {argb:'960f2f'} },
        right: { style: 'thin', color: {argb:'960f2f'} }
    };

    row12.getCell('G').value = 'PRIME';
    row12.getCell('G').alignment = { horizontal: 'center' };
    row12.getCell('G').font = { name: 'Arial', size: 11, bold: true, color: { argb: '960f2f' } };
    row12.getCell('G').border = {
        top: { style: 'thin', color: {argb:'960f2f'} },
        left: { style: 'thin', color: {argb:'960f2f'} },
        bottom: { style: 'thin', color: {argb:'960f2f'} },
        right: { style: 'thin', color: {argb:'960f2f'} }
    };

    row12.getCell('J').value = 'COMMISSIONS';
    row12.getCell('J').alignment = { horizontal: 'center' };
    row12.getCell('J').font = { name: 'Arial', size: 11, bold: true, color: { argb: '960f2f' } };
    row12.getCell('J').border = {
        top: { style: 'thin', color: {argb:'960f2f'} },
        left: { style: 'thin', color: {argb:'960f2f'} },
        bottom: { style: 'thin', color: {argb:'960f2f'} },
        right: { style: 'thin', color: {argb:'960f2f'} }
    };

    const row13 = workSheet.getRow(13);
    row13.getCell('A').value = 'Code';
    row13.getCell('A').font = { name: 'Arial', size: 11, bold: true, color: { argb: '960f2f' } };

    row13.getCell('B').value = 'Nom';
    row13.getCell('B').font = { name: 'Arial', size: 11, bold: true, color: { argb: '960f2f' } };

    row13.getCell('C').value = 'Police';
    row13.getCell('C').font = { name: 'Arial', size: 11, bold: true, color: { argb: '960f2f' } };

    row13.getCell('D').value = 'Assuré';
    row13.getCell('D').font = { name: 'Arial', size: 11, bold: true, color: { argb: '960f2f' } };

    row13.getCell('E').value = 'Produit';
    row13.getCell('E').font = { name: 'Arial', size: 11, bold: true, color: { argb: '960f2f' } };

    row13.getCell('F').value = 'Date d\'effet';
    row13.getCell('F').font = { name: 'Arial', size: 11, bold: true, color: { argb: '960f2f' } };

    row13.getCell('G').value = 'Périodicité';
    row13.getCell('G').font = { name: 'Arial', size: 11, bold: true, color: { argb: '960f2f' } };

    row13.getCell('H').value = 'Période';
    row13.getCell('H').font = { name: 'Arial', size: 11, bold: true, color: { argb: '960f2f' } };

    row13.getCell('I').value = 'Montant prélevé TTC';
    row13.getCell('I').font = { name: 'Arial', size: 11, bold: true, color: { argb: '960f2f' } };

    row13.getCell('J').value = 'Période';
    row13.getCell('J').font = { name: 'Arial', size: 11, bold: true, color: { argb: '960f2f' } };

    row13.getCell('K').value = 'Mode';
    row13.getCell('K').font = { name: 'Arial', size: 11, bold: true, color: { argb: '960f2f' } };

    row13.getCell('L').value = 'Montant Base HT';
    row13.getCell('L').font = { name: 'Arial', size: 11, bold: true, color: { argb: '960f2f' } };

    row13.getCell('M').value = 'Taux';
    row13.getCell('M').font = { name: 'Arial', size: 11, bold: true, color: { argb: '960f2f' } };

    row13.getCell('N').value = 'Montant';
    row13.getCell('N').font = { name: 'Arial', size: 11, bold: true, color: { argb: '960f2f' } };
    for (let i = 1; i <= 14; i++) {
        row13.getCell(i).border = {
            top: { style: 'thin', color: {argb:'960f2f'} },
            left: { style: 'thin', color: {argb:'960f2f'} },
            bottom: { style: 'thin', color: {argb:'960f2f'} },
            right: { style: 'thin', color: {argb:'960f2f'} }
        };
    }


    let detailDesPolices = dataCourtierOCR.infosOCR.detailDesPolices;

    let rowNumber = 14;
    const debut = 14;
    for (let datas of detailDesPolices) {
        workSheet.getRow(rowNumber).font = { name: 'Arial', size: 10 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.agence.code;
        workSheet.getRow(rowNumber).getCell('B').value = datas.agence.nom;
        workSheet.getRow(rowNumber).getCell('C').value = datas.contrat.police;
        workSheet.getRow(rowNumber).getCell('D').value = datas.contrat.assure;
        workSheet.getRow(rowNumber).getCell('E').value = datas.contrat.produit;
        workSheet.getRow(rowNumber).getCell('F').value = datas.contrat.dateEffet;
        workSheet.getRow(rowNumber).getCell('G').value = datas.prime.periode;
        workSheet.getRow(rowNumber).getCell('H').value = datas.prime.periodicite;
        workSheet.getRow(rowNumber).getCell('I').value = datas.prime.montantPreleveTTC;
        workSheet.getRow(rowNumber).getCell('I').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('J').value = datas.commissions.periode;
        workSheet.getRow(rowNumber).getCell('K').value = datas.commissions.mode;
        workSheet.getRow(rowNumber).getCell('L').value = datas.commissions.montantBaseHT;
        workSheet.getRow(rowNumber).getCell('L').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        workSheet.getRow(rowNumber).getCell('M').value = datas.commissions.taux;
        workSheet.getRow(rowNumber).getCell('N').value = datas.commissions.montant;
        workSheet.getRow(rowNumber).getCell('N').numFmt = '#,##0.00"€";\-#,##0.00"€"';
        // if (!data.commissions.verificationMontantCommission) {
        //     workSheet.getRow(rowNumber).getCell('K').fill = {
        //         type: 'pattern',
        //         pattern: 'solid',
        //         fgColor: { argb: 'FF0000' }
        //     };
        // }
        rowNumber++;
    }
    for (let i = debut; i <= rowNumber; i++) {
        workSheet.getRow(i).eachCell((cell, colNumber) => {
            cell.border = {
                top: { style: 'thin', color: {argb:'960f2f'} },
                left: { style: 'thin', color: {argb:'960f2f'} },
                bottom: { style: 'thin', color: {argb:'960f2f'} },
                right: { style: 'thin', color: {argb:'960f2f'} }
            };
        });
    }

}


exports.getOCRSWISSLIFESURCO = (ocr) => {
    const headers = ocr.headers;
    let infosOCR = [];
    ocr.allContratsPerCourtier.forEach((contrat, index) => {
        const dataCourtierOCR = {
            code: {
                cabinet: contrat.courtier.code,
                code: contrat.courtier.code,
            },
            headers,
            datas: contrat.contrats
        };
        infosOCR.push({ company: 'SWISSLIFE SURCO', infosOCR: dataCourtierOCR });
    });
    return infosOCR;
}

exports.createWorkSheetSWISSLIFESURCO = (workSheet, dataCourtierOCR) => {
    workSheet.getColumn('A').width = 10;
    workSheet.getColumn('C').width = 15;
    workSheet.getColumn('D').width = 15;
    workSheet.getColumn('E').width = 25;
    workSheet.getColumn('F').width = 10;
    workSheet.getColumn('G').width = 10;
    workSheet.getColumn('H').width = 10;
    workSheet.getColumn('I').width = 10;
    workSheet.getColumn('J').width = 10;
    workSheet.getColumn('K').width = 5;
    workSheet.getColumn('L').width = 10;
    workSheet.getColumn('M').width = 10;
    workSheet.getColumn('N').width = 10;
    const row1 = workSheet.getRow(1);
    row1.font = { bold: true, name: 'Verdana', size: 8 };
    let cellNumber = 1;
    dataCourtierOCR.infosOCR.headers.forEach((header, index) => {
        row1.getCell(cellNumber).value = header;
        row1.getCell(cellNumber).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '800000' }
        };
        row1.getCell(cellNumber).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        row1.getCell(cellNumber).alignment = { vertical: 'middle' };
        cellNumber++;
    });
    row1.height = 50;

    let rowNumber = 2;
    let debut = 2;
    for (let datas of dataCourtierOCR.infosOCR.datas) {
        workSheet.getRow(rowNumber).font = { name: 'Verdana', size: 8 };
        workSheet.getRow(rowNumber).getCell('A').value = datas.apporteurVente;
        workSheet.getRow(rowNumber).getCell('A').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('B').value = (datas.dateComptabVente) ? new Date(0, 0, datas.dateComptabVente, 0, 0, 0) : '';
        workSheet.getRow(rowNumber).getCell('B').numFmt = 'dd/mm/yyyy';
        workSheet.getRow(rowNumber).getCell('B').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('C').value = datas.numeroPolice;
        workSheet.getRow(rowNumber).getCell('C').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('D').value = datas.codeProduit;
        workSheet.getRow(rowNumber).getCell('D').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('E').value = datas.nomClient;
        workSheet.getRow(rowNumber).getCell('E').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('F').value = datas.cotisationPonderee;
        workSheet.getRow(rowNumber).getCell('F').numFmt = '#,##0.00;\-#,##0.00';
        workSheet.getRow(rowNumber).getCell('F').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('G').value = datas.montantPP;
        workSheet.getRow(rowNumber).getCell('G').numFmt = '#,##0.00;\-#,##0.00';
        workSheet.getRow(rowNumber).getCell('G').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('H').value = datas.dontParUCsurPP;
        workSheet.getRow(rowNumber).getCell('H').numFmt = '#,##0.00;\-#,##0.00';
        workSheet.getRow(rowNumber).getCell('H').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('I').value = datas.montantPU;
        workSheet.getRow(rowNumber).getCell('I').numFmt = '#,##0.00;\-#,##0.00';
        workSheet.getRow(rowNumber).getCell('I').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('J').value = datas.dontParUCsurPU;
        workSheet.getRow(rowNumber).getCell('J').numFmt = '#,##0.00;\-#,##0.00';
        workSheet.getRow(rowNumber).getCell('J').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('K').value = datas.tauxChargement;
        workSheet.getRow(rowNumber).getCell('K').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('L').value = datas.avanceSurco;
        workSheet.getRow(rowNumber).getCell('L').numFmt = '#,##0.00;\-#,##0.00';
        workSheet.getRow(rowNumber).getCell('L').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('M').value = datas.incompressible;
        workSheet.getRow(rowNumber).getCell('M').numFmt = '#,##0.00;\-#,##0.00';
        workSheet.getRow(rowNumber).getCell('M').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        workSheet.getRow(rowNumber).getCell('N').value = datas.avanceComprisRepriseIncompressible;
        workSheet.getRow(rowNumber).getCell('N').numFmt = '#,##0.00;\-#,##0.00';
        workSheet.getRow(rowNumber).getCell('N').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        rowNumber++;
    }
    rowNumber++;
    workSheet.getRow(rowNumber).getCell('M').value = 'TOTAL';
    workSheet.getRow(rowNumber).getCell('M').font = { bold: true, name: 'Verdana', size: 8, color: { argb: 'ff0000' } };
    workSheet.getRow(rowNumber).getCell('N').value = { formula: `SUM(N${debut}:N${rowNumber - 2})` };
    workSheet.getRow(rowNumber).getCell('N').font = { bold: true, name: 'Verdana', size: 8, color: { argb: 'ff0000' } };
    workSheet.getRow(rowNumber).getCell('N').numFmt = '#,##0.00"€";\-#,##0.00"€"';
}

