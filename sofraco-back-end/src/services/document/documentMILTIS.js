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
        codeAdherent: /^\s*Code\s*adhérent\s*$/i,
        nomAdherent: /^\s*Nom\s*adhérent\s*$/i,
        typeAdherent: /^\s*Type\s*adhérent\s*$/i,
        garantie: /^\s*Garantie\s*$/i,
        periodeDebut: /^\s*Période\s*début\s*$/i,
        periodeFin: /^\s*Période\s*fin\s*$/i,
        periodicite: /^\s*Périodicité\s*$/i,
        typeCommission: /^\s*Type\s*commission\s*$/i,
        primeHT: /^\s*Prime\s*HT\s*$/i,
        taux: /^\s*Taux\s*$/i,
        commission: /^\s*Commission\s*$/i,
        dateDeCalcul: /^\s*Date\s*de\s*calcul\s*$/i,
        codePostal: /^\s*Code\s*postal\s*$/i,
        ville: /^\s*Ville\s*$/i,
        raisonSociale: /^\s*Raison\s*sociale\s*$/i,
        codeMiltis: /^\s*Code\s*Miltis\s*$/i,
        courtier: /^\s*COURTIER\s*$/i,
        fondateur: /^\s*FONDATEUR\s*$/i,
        pavillon: /^\s*PAVILLON\s*$/i,
        sofraco: /^\s*SOFRACO\s*$/i,
        sofracoExpertises: /^\s*SOFRACO\s*EXPERTISES\s*$/i,
        budget: /^\s*BUDGET\s*$/i
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

