const { performance } = require('perf_hooks');
const time = require('../utils/time');
const generals = require('../utils/generals');
const excelFile = require('../utils/excelFile');
const errorHandler = require('../utils/errorHandler');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ cegema: workerData });
}

exports.readExcelCEGEMA = async (file) => {
    console.log(`${new Date()} DEBUT TRAITEMENT CEGEMA`);
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    let headers = [];
    let allContrats = [];
    let errors = [];
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    const arrReg = {
        courtier: /^Courtier$/i,
        nomAdherent: /^Nom\s*adhérent$/i,
        numAdhesion: /^N°\s*adhésion$/i,
        garantie: /^Garantie$/i,
        effetAu: /^Effet\s*au$/i,
        cotisHT: /^Cotis.\s*HT$/i,
        taux: /^Taux$/i,
        commission: /^Commission$/i,
        modeMotif: /^Mode\s*[/]\s*Motif$/i,
    };				

    for (let worksheet of worksheets) {
        if (worksheet.name === 'Tous les mouvements') {
            let indexesHeader = {
                courtier: null,
                nomAdherent: null,
                numAdhesion: null,
                garantie: null,
                effetAu: null,
                cotisHT: null,
                taux: null,
                commission: null,
                modeMotif: null,
            };
            let rowNumberHeader;
            worksheet.eachRow((row, rowNumber) => {
                if (typeof row.getCell('A').value === 'string' && row.getCell('A').value.match(/^Courtier$/i)) {
                    rowNumberHeader = rowNumber;
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value;
                        headers.push(currentCellValue);
                        generals.setIndexHeaders(cell, colNumber, arrReg, indexesHeader);
                    });
                    for (let index in indexesHeader) {
                        if (indexesHeader[index] === null) {
                            errors.push(errorHandler.errorReadExcelC(index));
                        }
                    }
                }
                if (rowNumber > rowNumberHeader) {
                    const {contrat, error} = generals.createContratSimpleHeader(row, indexesHeader);
                    for (let err of error) {
                        errors.push(errorHandler.errorEmptyCell('CEGEMA', err));
                    }
                    allContrats.push(contrat);
                }
            })
        }
    }

    const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'courtier');

    ocr = { headers, allContratsPerCourtier, errors, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log(`${new Date()} FIN TRAITEMENT CEGEMA`);
    return ocr;
};

