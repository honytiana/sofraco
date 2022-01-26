const { performance } = require('perf_hooks');
const time = require('../utils/time');
const generals = require('../utils/generals');
const excelFile = require('../utils/excelFile');

const { workerData, parentPort } = require('worker_threads');
const errorHandler = require('../utils/errorHandler');
if (parentPort !== null) {
    parentPort.postMessage({ aviva: workerData });
}

exports.readExcelAVIVASURCO = async (file) => {
    console.log(`${new Date()} DEBUT TRAITEMENT AVIVA SURCO`);
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    let headers = [];
    let errors = [];
    let allContrats = [];
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    const arrReg = {
        reseau: /^reseau$/i,
        region: /^region$/i,
        inspecteur: /^inspecteur$/i,
        codeInter: /^code inter$/i,
        nomApporteur: /^nom de l'apporteur$/i,
        numeroContrat: /^n° de contrat$/i,
        numeroCouverture: /^n° de couverture$/i,
        nomAssure: /^nom de l'assure$/i,
        nomContrat: /^nom contrat$/i,
        nomGarantie: /^nom garantie$/i,
        familleContrat: /^famille contrat$/i,
        typeMVT: /^type mvt$/i,
        dateEffetMVT: /^date effet mvt$/i,
        moisEffetMVT: /^mois effet mvt$/i,
        prodBrute: /^prod brute$/i,
        prodObjectifAE: /^prod pour objectif ae$/i,
        prodCalculAE: /^prod pour calcul ae$/i
    };
    for (let worksheet of worksheets) {
        let cabinetCourtier = { apporteur: '', contrats: [] };
        let indexesHeader = {
            reseau: null,
            region: null,
            inspecteur: null,
            codeInter: null,
            nomApporteur: null,
            numeroContrat: null,
            numeroCouverture: null,
            nomAssure: null,
            nomContrat: null,
            nomGarantie: null,
            familleContrat: null,
            typeMVT: null,
            dateEffetMVT: null,
            moisEffetMVT: null,
            prodBrute: null,
            prodObjectifAE: null,
            prodCalculAE: null,
        };
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                row.eachCell((cell, colNumber) => {
                    headers.push((typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value);
                    generals.setIndexHeaders(cell, colNumber, arrReg, indexesHeader);
                });
                for (let index in indexesHeader) {
                    if (indexesHeader[index] === null) {
                        errors.push(errorHandler.errorReadExcelAVIVA(index));
                    }
                }
            }
            if (rowNumber > 1) {
                const {contrat, error} = generals.createContratSimpleHeader(row, indexesHeader);
                for (let err of error) {
                    errors.push(errorHandler.errorEmptyCell('AVIVA SURCO', err));
                }

                if (contrat.codeInter && contrat.codeInter.match(/Total.+/i)) {
                    cabinetCourtier.contrats.push(contrat);
                    allContrats.push(cabinetCourtier);
                    cabinetCourtier = { apporteur: '', contrats: [] };

                } else {
                    cabinetCourtier.contrats.push(contrat);
                    cabinetCourtier.apporteur = contrat.codeInter;
                }
            }
        })
    }

    const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'apporteur');

    ocr = { headers, allContratsPerCourtier, errors, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log(`${new Date()} FIN TRAITEMENT AVIVA SURCO`);
    return ocr;
};
