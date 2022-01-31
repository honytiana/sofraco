const { performance } = require('perf_hooks');
const time = require('../utils/time');
const excelFile = require('../utils/excelFile');
const generals = require('../utils/generals');
const errorHandler = require('../utils/errorHandler');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ lourmel: workerData });
}

exports.readExcelLOURMEL = async (file) => {
    console.log(`${new Date()} DEBUT TRAITEMENT LOURMEL`);
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    let headers = [];
    let allContrats = [];
    let errors = [];
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    const arrReg = {
        courtier: /^a$/i,
        b: /^b$/i,
        c: /^c$/i,
        d: /^d$/i,
        genre: /^e$/i,
        nom: /^f$/i,
        prenom: /^g$/i,
        nomDeNaissance: /^h$/i,
        codePostal: /^i$/i,
        ville: /^j$/i,
        dateEffet: /^k$/i,
        montantCotisation: /^l$/i,
        m: /^m$/i,
        dateDebut: /^n$/i,
        dateFin: /^o$/i,
        tauxCommission: /^p$/i,
        montantCommission: /^q$/i,
    };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let indexesHeader = {
                courtier: null,
                b: null,
                c: null,
                d: null,
                genre: null,
                nom: null,
                prenom: null,
                nomDeNaissance: null,
                codePostal: null,
                ville: null,
                dateEffet: null,
                montantCotisation: null,
                m: null,
                dateDebut: null,
                dateFin: null,
                tauxCommission: null,
                montantCommission: null,
            };
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    headers = [
                        'CODE COURTIER',
                        'B',
                        'C',
                        'D',
                        'GENRE',
                        'NOM',
                        'PRENOM',
                        'NOM DE NAISSANCE',
                        'CODE POSTALE',
                        'VILLE',
                        'DATE EFFET',
                        'MONTANT DE LA COTISATION',
                        'M',
                        'DATE DEBUT',
                        'DATE FIN',
                        'TAUX DE COMMISSION',
                        'MONTANT DE LA COMMISSION'
                    ];
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value;
                        generals.setIndexHeaders(cell, colNumber, arrReg, indexesHeader);
                    });
                    for (let index in indexesHeader) {
                        if (indexesHeader[index] === null) {
                            errors.push(errorHandler.errorReadExcelLOURMEL(index));
                        }
                    }
                }
                if (rowNumber > 1 && !row.hidden) {
                    const { contrat, error } = generals.createContratSimpleHeader(row, indexesHeader);
                    allContrats.push(contrat);
                }
            })
        }
    });

    const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'courtier');

    ocr = { headers, allContratsPerCourtier, errors, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log(`${new Date()} FIN TRAITEMENT LOURMEL`);
    return ocr;
};

