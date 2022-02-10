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
        numCourtier: /^N°\s*Courtier$/i,
        souscripteur: /^Souscripteur$/i,
        dateEffet: /^Date\s*d'effet$/i,
        dateEcheance: /^Date\s*d'échéance$/i,
        produit: /^Produit$/i,
        numContrat: /^N°\s*de\s*contrat$/i,
        montant: /^Montant$/i,
        fr: /^Fr.$/i,
        encaissement: /^Encaissement$/i,
        escomptee: /^Escomptée$/i,
        annuelle: /^Annuelle$/i,
        commissionsSurArbitrage: /^Commissions\s*sur\s*arbitrage$/i,
        total: /^TOTAL$/i
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
        codeApporteur: /^Code\s*Apporteur$/i,
        numContrat: /^N°\s*de\s*contrat$/i,
        nomSouscripteur: /^Nom\s*souscripteur$/i,
        produit: /^Produit$/i,
        libelleSupport: /^Libellé\s*du\s*support$/i,
        assieteDeRenumeration: /^Assiette\s*de\s*Rémunération\s*en\s*€$/i,
        taux: /^Taux$/i,
        commissionSurEncours: /^Commission\s*sur\s*en-cours\s*en\s*€$/i
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
        codeApporteur: /^Code\s*Apporteur$/i,
        nomSouscripteur: /^Nom\s*du\s*souscripteur$/i,
        numContrat: /^N°\s*de\s*contrat$/i,
        dateMouvement: /^Date\s*du\s*mouvement$/i,
        libelleMouvement: /^Libellé\s*du\s*mouvement$/i,
        montant: /^Montant\s*en\s*€$/i,
        tauxIncitation: /^Taux\s*d'incitation$/i,
        montantIncitation: /^Montant\s*de\s*l'incitation\s*en\s*€$/i
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
