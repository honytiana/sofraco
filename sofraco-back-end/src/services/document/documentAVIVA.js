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
        codeInter: /^code\s*inter$/i,
        nomApporteur: /^nom\s*de\s*l'apporteur$/i,
        numeroContrat: /^n°\s*de\s*contrat$/i,
        numeroCouverture: /^n°\s*de\s*couverture$/i,
        nomAssure: /^nom\s*de\s*l'assure$/i,
        nomContrat: /^nom\s*contrat$/i,
        nomGarantie: /^nom\s*garantie$/i,
        familleContrat: /^famille\s*contrat$/i,
        typeMVT: /^type\s*mvt$/i,
        dateEffetMVT: /^date\s*effet\s*mvt$/i,
        moisEffetMVT: /^mois\s*effet\s*mvt$/i,
        prodBrute: /^prod\s*brute$/i,
        prodObjectifAE: /^prod\s*pour\s*objectif\s*ae$/i,
        prodCalculAE: /^prod\s*pour\s*calcul\s*ae$/i
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
                        errors.push(errorHandler.errorReadExcelAVIVASURCO(index));
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
