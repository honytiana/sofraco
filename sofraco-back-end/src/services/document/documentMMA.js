const { performance } = require('perf_hooks');
const time = require('../utils/time');
const generals = require('../utils/generals');
const excelFile = require('../utils/excelFile');
const errorHandler = require('../utils/errorHandler');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ mma: workerData });
}

exports.readExcelMMAACQUISITION = async (file) => {
    console.log(`${new Date()} DEBUT TRAITEMENT MMA ACQUISITION`);
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    let headers = [];
    let allContrats = [];
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    let errors = [];
    const arrReg = {
        numCourtier: /^\s*N°\s*Courtier\s*$/i,
        souscripteur: /^\s*Souscripteur\s*$/i,
        dateEffet: /^\s*Date\s*d'effet\s*$/i,
        dateEcheance: /^\s*Date\s*d'échéance\s*$/i,
        produit: /^\s*Produit\s*$/i,
        numContrat: /^\s*N°\s*de\s*contrat\s*$/i,
        montant: /^\s*Montant\s*$/i,
        fr: /^\s*Fr.\s*$/i,
        encaissement: /^\s*Encaissement\s*$/i,
        escomptee: /^\s*Escomptée\s*$/i,
        annuelle: /^\s*Annuelle\s*$/i,
        commissionsSurArbitrage: /^\s*Commissions\s*sur\s*arbitrage\s*$/i,
        total: /^\s*TOTAL\s*$/i
    };

    worksheets.forEach((worksheet, index) => {
        if (index === 0) {
            let indexesHeader = {
                numCourtier: null,
                souscripteur: null,
                dateEffet: null,
                dateEcheance: null,
                produit: null,
                numContrat: null,
                montant: null,
                fr: null,
                encaissement: null,
                escomptee: null,
                annuelle: null,
                commissionsSurArbitrage: null,
                total: null
            };
            let rowNumberHeader;
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    rowNumberHeader = rowNumber;
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim().replace(/\n/g, ' ') : cell.value.replace(/\n/g, ' ');
                        if (headers.indexOf(currentCellValue) < 0) {
                            headers.push(currentCellValue);
                            generals.setIndexHeaders(cell, colNumber, arrReg, indexesHeader);
                        }
                    });
                    for (let index in indexesHeader) {
                        if (indexesHeader[index] === null) {
                            errors.push(errorHandler.errorReadExcelMMAACQUISITION(index));
                        }
                    }
                }
                if (rowNumber > rowNumberHeader && !row.hidden) {
                    const { contrat, error } = generals.createContratSimpleHeader(row, indexesHeader);
                    allContrats.push(contrat);
                }
            })
        }
    });

    const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'numCourtier');

    ocr = { headers, allContratsPerCourtier, errors, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log(`${new Date()} FIN TRAITEMENT MMA ACQUISITION`);
    return ocr;
};

exports.readExcelMMAENCOURS = async (file) => {
    console.log(`${new Date()} DEBUT TRAITEMENT MMA ENCOURS`);
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    let headers = [];
    let allContrats = [];
    let detailsBordereau = {};
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    let errors = [];
    const arrReg = {
        codeApporteur: /^\s*Code\s*Apporteur\s*$/i,
        numContrat: /^\s*N°\s*de\s*contrat\s*$/i,
        nomSouscripteur: /^\s*Nom\s*souscripteur\s*$/i,
        produit: /^\s*Produit\s*$/i,
        libelleSupport: /^\s*Libellé\s*du\s*support\s*$/i,
        assieteDeRenumeration: /^\s*Assiette\s*de\s*Rémunération\s*en\s*€\s*$/i,
        taux: /^\s*Taux\s*$/i,
        commissionSurEncours: /^\s*Commission\s*sur\s*en-cours\s*en\s*€\s*$/i
    };	  		  

    worksheets.forEach((worksheet, index) => {
        if (index === 0) {
            let indexesHeader = {
                codeApporteur: null,
                numContrat: null,
                nomSouscripteur: null,
                produit: null,
                libelleSupport: null,
                assieteDeRenumeration: null,
                taux: null,
                commissionSurEncours: null
            };
            let rowNumberHeader;
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    detailsBordereau.title = row.getCell('C').value;
                    detailsBordereau.dateBordereau = row.getCell('H').value;
                }
                if (rowNumber === 3) {
                    detailsBordereau.row3F = row.getCell('F').value;
                    detailsBordereau.ref = row.getCell('G').value;
                }
                if (rowNumber === 4) {
                    detailsBordereau.row4A = row.getCell('A').value;
                    detailsBordereau.row4G = row.getCell('G').value;
                }
                if (rowNumber === 5) {
                    detailsBordereau.row5A = row.getCell('A').value;
                    detailsBordereau.row5G = row.getCell('G').value;
                }
                if (rowNumber === 6) {
                    detailsBordereau.row6A = row.getCell('A').value;
                    detailsBordereau.row6G = row.getCell('G').value;
                }
                if (rowNumber === 7) {
                    detailsBordereau.row7A = row.getCell('A').value;
                    detailsBordereau.row7G = row.getCell('G').value;
                }
                if (typeof row.getCell('A').value === 'string' && row.getCell('A').value.match(/Code Apporteur/i)) {
                    rowNumberHeader = rowNumber;
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim().replace(/\n/g, ' ') : cell.value.replace(/\n/g, ' ');
                        if (headers.indexOf(currentCellValue) < 0) {
                            headers.push(currentCellValue);
                            generals.setIndexHeaders(cell, colNumber, arrReg, indexesHeader);
                        }
                    });
                    for (let index in indexesHeader) {
                        if (indexesHeader[index] === null) {
                            errors.push(errorHandler.errorReadExcelMMAENCOURS(index));
                        }
                    }
                }
                if (rowNumber > rowNumberHeader) {
                    const { contrat, error } = generals.createContratSimpleHeader(row, indexesHeader);
                    allContrats.push(contrat);
                }
            })
        }
    });

    const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'codeApporteur');

    ocr = { headers, detailsBordereau, allContratsPerCourtier, errors, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log(`${new Date()} FIN TRAITEMENT MMA EN COURS`);
    return ocr;
};

exports.readExcelMMAINCITATION = async (file) => {
    console.log(`${new Date()} DEBUT TRAITEMENT MMA INCITATION`);
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    let headers = [];
    let allContrats = [];
    let detailsBordereau = {};
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    let errors = [];
    const arrReg = {
        codeApporteur: /^\s*Code\s*Apporteur\s*$/i,
        nomSouscripteur: /^\s*Nom\s*du\s*souscripteur\s*$/i,
        numContrat: /^\s*N°\s*de\s*contrat\s*$/i,
        dateMouvement: /^\s*Date\s*du\s*mouvement\s*$/i,
        libelleMouvement: /^\s*Libellé\s*du\s*mouvement\s*$/i,
        montant: /^\s*Montant\s*en\s*€\s*$/i,
        tauxIncitation: /^\s*Taux\s*d'incitation\s*$/i,
        montantIncitation: /^\s*Montant\s*de\s*l'incitation\s*en\s*€\s*$/i
    };

    worksheets.forEach((worksheet, index) => {
        if (index === 0) {
            let rowNumberHeader;
            let indexesHeader = {
                codeApporteur: null,
                nomSouscripteur: null,
                numContrat: null,
                dateMouvement: null,
                libelleMouvement: null,
                montant: null,
                tauxIncitation: null,
                montantIncitation: null
            };
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    detailsBordereau.title = row.getCell('C').value;
                    detailsBordereau.dateBordereau = row.getCell('H').value;
                }
                if (rowNumber === 3) {
                    detailsBordereau.row3G = row.getCell('G').value;
                }
                if (rowNumber === 4) {
                    detailsBordereau.row4A = row.getCell('A').value;
                    detailsBordereau.row4G = row.getCell('G').value;
                }
                if (rowNumber === 5) {
                    detailsBordereau.row5A = row.getCell('A').value;
                    detailsBordereau.row5G = row.getCell('G').value;
                }
                if (rowNumber === 6) {
                    detailsBordereau.row6A = row.getCell('A').value;
                    detailsBordereau.row6G = row.getCell('G').value;
                }
                if (rowNumber === 7) {
                    detailsBordereau.row7A = row.getCell('A').value;
                    detailsBordereau.row7G = row.getCell('G').value;
                }
                if (rowNumber === 8) {
                    detailsBordereau.ref = row.getCell('H').value;
                }
                if (typeof row.getCell('A').value === 'string' && row.getCell('A').value.match(/Code Apporteur/i)) {
                    rowNumberHeader = rowNumber;
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim().replace(/\n/g, ' ') : cell.value.replace(/\n/g, ' ');
                        if (headers.indexOf(currentCellValue) < 0) {
                            headers.push(currentCellValue);
                            generals.setIndexHeaders(cell, colNumber, arrReg, indexesHeader);
                        }
                    });
                    for (let index in indexesHeader) {
                        if (indexesHeader[index] === null) {
                            errors.push(errorHandler.errorReadExcelMMAINCITATION(index));
                        }
                    }
                }
                if (rowNumber > rowNumberHeader) {
                    const { contrat, error } = generals.createContratSimpleHeader(row, indexesHeader);
                    allContrats.push(contrat);
                }
            })
        }
    });

    const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'codeApporteur');

    ocr = { headers, detailsBordereau, allContratsPerCourtier, errors, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log(`${new Date()} FIN TRAITEMENT MMA INCITATION`);
    return ocr;
};
