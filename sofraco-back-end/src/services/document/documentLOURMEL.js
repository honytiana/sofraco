const { performance } = require('perf_hooks');
const time = require('../utils/time');
const generals = require('../utils/generals');
const excelFile = require('../utils/excelFile');

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
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
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
                }
                if (rowNumber > 1 && !row.hidden) {
                    const contrat = {
                        courtier: (typeof row.getCell('A').value === 'string') ?
                            row.getCell('A').value.trim() :
                            row.getCell('A').value,
                        b: (typeof row.getCell('B').value === 'string') ?
                            row.getCell('B').value.trim() :
                            row.getCell('B').value,
                        c: (typeof row.getCell('C').value === 'string') ?
                            row.getCell('C').value.trim() :
                            row.getCell('C').value,
                        d: (typeof row.getCell('D').value === 'string') ?
                            row.getCell('D').value.trim() :
                            row.getCell('D').value,
                        genre: (typeof row.getCell('E').value === 'string') ?
                            row.getCell('E').value.trim() :
                            row.getCell('E').value,
                        nom: (typeof row.getCell('F').value === 'string') ?
                            row.getCell('F').value.trim() :
                            row.getCell('F').value,
                        prenom: (typeof row.getCell('G').value === 'string') ?
                            row.getCell('G').value.trim() :
                            row.getCell('G').value,
                        nomDeNaissance: (typeof row.getCell('H').value === 'string') ?
                            row.getCell('H').value.trim() :
                            row.getCell('H').value,
                        codePostal: (typeof row.getCell('I').value === 'string') ?
                            row.getCell('I').value.trim() :
                            row.getCell('I').value,
                        ville: (typeof row.getCell('J').value === 'string') ?
                            row.getCell('J').value.trim() :
                            row.getCell('J').value,
                        dateEffet: (typeof row.getCell('K').value === 'string') ?
                            row.getCell('K').value.trim() :
                            new Date(0, 0, row.getCell('K').value, 0, 0, 0),
                        montantCotisation: (typeof row.getCell('L').value === 'string') ?
                            row.getCell('L').value.trim() :
                            row.getCell('L').value,
                        m: (typeof row.getCell('M').value === 'string') ?
                            row.getCell('M').value.trim() :
                            row.getCell('M').value,
                        dateDebut: (typeof row.getCell('N').value === 'string') ?
                            row.getCell('N').value.trim() :
                            new Date(0, 0, row.getCell('N').value, 0, 0, 0),
                        dateFin: (typeof row.getCell('O').value === 'string') ?
                            row.getCell('O').value.trim() :
                            new Date(0, 0, row.getCell('O').value, 0, 0, 0),
                        tauxCommission: (typeof row.getCell('P').value === 'string') ?
                            row.getCell('P').value.trim() :
                            row.getCell('P').value,
                        montantCommission: (typeof row.getCell('Q').value === 'string') ?
                            row.getCell('Q').value.trim() :
                            row.getCell('Q').value
                    };
                    allContrats.push(contrat);
                }
            })
        }
    });

    const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'courtier');

    ocr = { headers, allContratsPerCourtier, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log(`${new Date()} FIN TRAITEMENT LOURMEL`);
    return ocr;
};

