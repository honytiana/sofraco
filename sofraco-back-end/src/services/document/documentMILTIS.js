const { performance } = require('perf_hooks');
const time = require('../utils/time');
const generals = require('../utils/generals');
const excelFile = require('../utils/excelFile');
const errorHandler = require('../utils/errorHandler');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ miltis: workerData });
}

exports.readExcelMILTIS = async (file) => {
    console.log(`${new Date()} DEBUT TRAITEMENT MILTIS`);
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    let headers = [];
    let allContrats = [];
    let errors = [];
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    const arrReg = {
        codeAdherent: /^Code\s*adhérent$/i,
        nomAdherent: /^Nom\s*adhérent$/i,
        typeAdherent: /^Type\s*adhérent$/i,
        garantie: /^Garantie$/i,
        periodeDebut: /^Période\s*début$/i,
        periodeFin: /^Période\s*fin$/i,
        periodicite: /^Périodicité$/i,
        typeCommission: /^Type\s*commission$/i,
        primeHT: /^Prime\s*HT$/i,
        taux: /^Taux$/i,
        commission: /^Commission$/i,
        dateDeCalcul: /^Date\s*de\s*calcul$/i,
        codePostal: /^Code\s*postal$/i,
        ville: /^Ville$/i,
        raisonSociale: /^Raison\s*sociale$/i,
        codeMiltis: /^Code\s*Miltis$/i,
        courtier: /^COURTIER$/i,
        fondateur: /^FONDATEUR$/i,
        pavillon: /^PAVILLON$/i,
        sofraco: /^SOFRACO$/i,
        sofracoExpertises: /^SOFRACO\s*EXPERTISES$/i,
        budget: /^BUDGET$/i
    };
    																					
    worksheets.forEach((worksheet, index) => {
        if (worksheet.name.toUpperCase() === 'MILTIS') {
            let rowNumberHeader;
            let indexesHeader = {
                codeAdherent: null,
                nomAdherent: null,
                typeAdherent: null,
                garantie: null,
                periodeDebut: null,
                periodeFin: null,
                periodicite: null,
                typeCommission: null,
                primeHT: null,
                taux: null,
                commission: null,
                dateDeCalcul: null,
                codePostal: null,
                ville: null,
                raisonSociale: null,
                codeMiltis: null,
                courtier: null,
                fondateur: null,
                pavillon: null,
                sofraco: null,
                sofracoExpertises: null,
                budget: null
            };
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    rowNumberHeader = rowNumber;
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value;
                        if (headers.indexOf(currentCellValue) < 0) {
                            headers.push(currentCellValue);
                        }
                        generals.setIndexHeaders(cell, colNumber, arrReg, indexesHeader);
                    });
                    for (let index in indexesHeader) {
                        if (indexesHeader[index] === null) {
                            errors.push(errorHandler.errorReadExcelMILTIS(index));
                        }
                    }
                }
                if (rowNumber > rowNumberHeader) {
                    const {contrat, error} = generals.createContratSimpleHeader(row, indexesHeader);
                    // for (let err of error) {
                    //     errors.push(errorHandler.errorEmptyCell('MILTIS', err));
                    // }
                    allContrats.push(contrat);
                }
            })
        }
    });

    const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'codeMiltis');

    ocr = { headers, allContratsPerCourtier, errors, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log(`${new Date()} FIN TRAITEMENT MILTIS`);
    return ocr;
};

