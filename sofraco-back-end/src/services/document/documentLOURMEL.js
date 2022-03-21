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
        a: /^\s*a\s*$/i,
        b: /^\s*b\s*$/i,
        courtier: /^\s*c\s*$/i,
        d: /^\s*d\s*$/i,
        e: /^\s*e\s*$/i,
        f: /^\s*f\s*$/i,
        genre: /^\s*g\s*$/i,
        nom: /^\s*h\s*$/i,
        prenom: /^\s*i\s*$/i,
        nomDeNaissance: /^\s*j\s*$/i,
        k: /^\s*k\s*$/i,
        l: /^\s*l\s*$/i,
        codePostal: /^\s*m\s*$/i,
        ville: /^\s*n\s*$/i,
        o: /^\s*o\s*$/i,
        p: /^\s*p\s*$/i,
        q: /^\s*q\s*$/i,
        r: /^\s*r\s*$/i,
        s: /^\s*s\s*$/i,
        dateEffet: /^\s*t\s*$/i,
        montantCotisation: /^\s*u\s*$/i,
        v: /^\s*v\s*$/i,
        dateDebut: /^\s*w\s*$/i,
        dateFin: /^\s*x\s*$/i,
        tauxCommission: /^\s*y\s*$/i,
        montantCommission: /^\s*z\s*$/i,
    };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let indexesHeader = {
                a: null,
                b: null,
                courtier: null,
                d: null,
                e: null,
                f: null,
                genre: null,
                nom: null,
                prenom: null,
                nomDeNaissance: null,
                k: null,
                l: null,
                codePostal: null,
                ville: null,
                o: null,
                p: null,
                q: null,
                r: null,
                s: null,
                dateEffet: null,
                montantCotisation: null,
                v: null,
                dateDebut: null,
                dateFin: null,
                tauxCommission: null,
                montantCommission: null,
            };
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    headers = [
                        'A',
                        'B',
                        'CODE COURTIER',
                        'D',
                        'E',
                        'F',
                        'GENRE',
                        'NOM',
                        'PRENOM',
                        'NOM DE NAISSANCE',
                        'K',
                        'L',
                        'CODE POSTALE',
                        'VILLE',
                        'O',
                        'P',
                        'Q',
                        'R',
                        'S',
                        'DATE EFFET',
                        'MONTANT DE LA COTISATION',
                        'V',
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

