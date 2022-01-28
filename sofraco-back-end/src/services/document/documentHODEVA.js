const { performance } = require('perf_hooks');
const time = require('../utils/time');
const excelFile = require('../utils/excelFile');
const generals = require('../utils/generals');
const errorHandler = require('../utils/errorHandler');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ hodeva: workerData });
}

exports.readExcelHODEVA = async (file) => {
    console.log(`${new Date()} DEBUT TRAITEMENT HODEVA`);
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    let headers = [];
    let allContrats = [];
    let errors = [];
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    const arrReg = {
        adhesion: /^Adhé-sion$/i,
        nom: /^NOM$/i,
        prenom: /^PRENOM$/i,
        dateEffet: /^Date\s*d'effet$/i,
        montantPrimeHT: /^Montant\s*Prime\s*HT$/i,
        tauxCommissionnement: /^Taux\s*de\s*commissionnement$/i,
        montantCommissionnement: /^Montant\s*du\s*commissionnement$/i,
    };
    worksheets.forEach((worksheet, index) => {
        if (worksheet.name === 'Feuille 1' || index === 0) {
            let indexesHeader = {
                adhesion: null,
                nom: null,
                prenom: null,
                dateEffet: null,
                montantPrimeHT: null,
                tauxCommissionnement: null,
                montantCommissionnement: null,
            };

            worksheet.eachRow((row, rowNumber) => {
                if (headers.length === 0) {
                    if (typeof row.getCell('A').value === 'string' && row.getCell('A').value.match(/^Adhé-sion$/i)) {
                        row.eachCell((cell, colNumber) => {
                            const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value;
                            headers.push(currentCellValue);
                            generals.setIndexHeaders(cell, colNumber, arrReg, indexesHeader);
                        });
                        for (let index in indexesHeader) {
                            if (indexesHeader[index] === null) {
                                errors.push(errorHandler.errorReadExcelHODEVA(index));
                            }
                        }
                    }
                }
            });
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 9) {
                    const { contrat, error } = generals.createContratSimpleHeader(row, indexesHeader);
                    // for (let err of error) {
                    //     errors.push(errorHandler.errorEmptyCell('HODEVA', err));
                    // }
                    allContrats.push(contrat);
                }
            });
        }
    })

    let allContratsPerCourtier = [];
    let contratCourtier = { courtier: '', headers: null, contrats: [], totalMontant: 0 };
    allContrats.forEach((element, index) => {
        if (element.adhesion !== null && (element.adhesion === element.nom && element.adhesion === element.prenom)) {
            contratCourtier.courtier = element.adhesion;
            contratCourtier.headers = allContrats[index + 1];
            headers = contratCourtier.headers;
        } else if (element.adhesion === null &&
            element.nom === null &&
            element.prenom === null &&
            element.dateEffet === null &&
            element.montantPrimeHT === null &&
            element.tauxCommissionnement === null &&
            element.montantCommissionnement !== null) {
            contratCourtier.totalMontant = element.montantCommissionnement;
            allContratsPerCourtier.push(contratCourtier);
            contratCourtier = { courtier: '', headers: null, contrats: [], totalMontant: 0 };
        } else if (element.nom === 'NOM' && element.prenom === 'PRENOM') {
            return;
        } else {
            contratCourtier.contrats.push(element);
        }
    })

    ocr = { headers, allContratsPerCourtier, errors, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log(`${new Date()} FIN TRAITEMENT HODEVA`);
    return ocr;
};

