const { performance } = require('perf_hooks');
const time = require('../utils/time');
const excelFile = require('../utils/excelFile');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ hodeva: workerData });
}

exports.readExcelHODEVA = async (file) => {
    console.log('DEBUT TRAITEMENT HODEVA');
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    let headers = [];
    let allContrats = [];
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    worksheets.forEach((worksheet, index) => {
        if (worksheet.name === 'Feuille 1' || index === 0) {
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 9) {
                    const contrat = {
                        adhesion: (typeof row.getCell('A').value === 'string') ?
                            row.getCell('A').value.trim() :
                            row.getCell('A').value,
                        nom: (typeof row.getCell('B').value === 'string') ?
                            row.getCell('B').value.trim() :
                            row.getCell('B').value,
                        prenom: (typeof row.getCell('C').value === 'string') ?
                            row.getCell('C').value.trim() :
                            row.getCell('C').value,
                        dateEffet: (typeof row.getCell('D').value === 'string') ?
                            row.getCell('D').value.trim() :
                            row.getCell('D').value,
                        montantPrimeHT: (typeof row.getCell('E').value === 'string') ?
                            row.getCell('E').value.trim() :
                            row.getCell('E').value,
                        tauxCommissionnement: (typeof row.getCell('F').value === 'string') ?
                            row.getCell('F').value.trim() :
                            row.getCell('F').value,
                        montantCommissionnement: (typeof row.getCell('G').value === 'string') ?
                            row.getCell('G').value.trim() :
                            row.getCell('G').value
                    };
                    allContrats.push(contrat);
                }
            })
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

    ocr = { headers, allContratsPerCourtier, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log('FIN TRAITEMENT HODEVA');
    return ocr;
};

