const { performance } = require('perf_hooks');
const time = require('../utils/time');
const generals = require('../utils/generals');
const excelFile = require('../utils/excelFile');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ mma: workerData });
}

exports.readExcelMMAINCITATION = async (file) => {
    console.log('DEBUT TRAITEMENT MMA INCITATION');
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    let headers = [];
    let allContrats = [];
    let detailsBordereau = {};
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    worksheets.forEach((worksheet, index) => {
        if (index === 0) {
            let rowNumberHeader;
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    detailsBordereau.title = row.getCell('C').value;
                    detailsBordereau.dateBordereau = row.getCell('H').value;
                }
                if (rowNumber === 3) {
                    detailsBordereau.row3G = row.getCell('G').value;
                }
                if (rowNumber === 4) {
                    detailsBordereau.row4A = row.getCell('A').value;
                    detailsBordereau.row4G = row.getCell('G').value;
                }
                if (rowNumber === 5) {
                    detailsBordereau.row5A = row.getCell('A').value;
                    detailsBordereau.row5G = row.getCell('G').value;
                }
                if (rowNumber === 6) {
                    detailsBordereau.row6A = row.getCell('A').value;
                    detailsBordereau.row6G = row.getCell('G').value;
                }
                if (rowNumber === 7) {
                    detailsBordereau.row7A = row.getCell('A').value;
                    detailsBordereau.row7G = row.getCell('G').value;
                }
                if (rowNumber === 8) {
                    detailsBordereau.ref = row.getCell('H').value;
                }
                if (typeof row.getCell('A').value === 'string' && row.getCell('A').value.match(/Code Apporteur/i)) {
                    rowNumberHeader = rowNumber;
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim().replace(/\n/g, ' ') : cell.value.replace(/\n/g, ' ');
                        if (headers.indexOf(currentCellValue) < 0) {
                            headers.push(currentCellValue);
                        }
                    });
                }
                if (rowNumber > rowNumberHeader) {
                    const contrat = {
                        codeApporteur: (typeof row.getCell('A').value === 'string') ?
                            row.getCell('A').value.trim() :
                            row.getCell('A').value,
                        nomSouscripteur: (typeof row.getCell('B').value === 'string') ?
                            row.getCell('B').value.trim() :
                            row.getCell('B').value,
                        numContrat: (typeof row.getCell('C').value === 'string') ?
                            row.getCell('C').value.trim() :
                            row.getCell('C').value,
                        dateMouvement: (typeof row.getCell('D').value === 'string') ?
                            row.getCell('D').value.trim() :
                            (row.getCell('D').value !== null) ? new Date(0, 0, row.getCell('D').value, 0, 0, 0) : '',
                        libelleMouvement: (typeof row.getCell('E').value === 'string') ?
                            row.getCell('E').value.trim() :
                            row.getCell('E').value,
                        montant: (typeof row.getCell('F').value === 'string') ?
                            row.getCell('F').value.trim() :
                            row.getCell('F').value,
                        tauxIncitation: (typeof row.getCell('G').value === 'string') ?
                            row.getCell('G').value.trim() :
                            row.getCell('G').value,
                        montantIncitation: (typeof row.getCell('H').value === 'string') ?
                            row.getCell('H').value.trim() :
                            row.getCell('H').value
                    };
                    allContrats.push(contrat);
                }
            })
        }
    });

    const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'codeApporteur');

    ocr = { headers, detailsBordereau, allContratsPerCourtier, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log('FIN TRAITEMENT MMA INCITATION');
    return ocr;
};

exports.readExcelMMAACQUISITION = async (file) => {
    console.log('DEBUT TRAITEMENT MMA ACQUISITION');
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    let headers = [];
    let allContrats = [];
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    worksheets.forEach((worksheet, index) => {
        if (index === 0) {
            let rowNumberHeader;
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    rowNumberHeader = rowNumber;
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim().replace(/\n/g, ' ') : cell.value.replace(/\n/g, ' ');
                        if (headers.indexOf(currentCellValue) < 0) {
                            headers.push(currentCellValue);
                        }
                    });
                }
                if (rowNumber > rowNumberHeader) {
                    const contrat = {
                        numCourtier: (typeof row.getCell('A').value === 'string') ?
                            row.getCell('A').value.trim() :
                            row.getCell('A').value,
                        souscripteur: (typeof row.getCell('B').value === 'string') ?
                            row.getCell('B').value.trim() :
                            row.getCell('B').value,
                        dateEffet: (typeof row.getCell('C').value === 'string') ?
                            row.getCell('C').value.trim() :
                            (row.getCell('C').value !== null) ? new Date(0, 0, row.getCell('C').value, 0, 0, 0) : '',
                        dateEcheance: (typeof row.getCell('D').value === 'string') ?
                            row.getCell('D').value.trim() :
                            (row.getCell('D').value !== null) ? new Date(0, 0, row.getCell('D').value, 0, 0, 0) : '',
                        produit: (typeof row.getCell('E').value === 'string') ?
                            row.getCell('E').value.trim() :
                            row.getCell('E').value,
                        numContrat: (typeof row.getCell('F').value === 'string') ?
                            row.getCell('F').value.trim() :
                            row.getCell('F').value,
                        montant: (typeof row.getCell('G').value === 'string') ?
                            row.getCell('G').value.trim() :
                            row.getCell('G').value,
                        fr: (typeof row.getCell('H').value === 'string') ?
                            row.getCell('H').value.trim() :
                            row.getCell('H').value,
                        encaissement: (typeof row.getCell('I').value === 'string') ?
                            row.getCell('I').value.trim() :
                            row.getCell('I').value,
                        escomptee: (typeof row.getCell('J').value === 'string') ?
                            row.getCell('J').value.trim() :
                            row.getCell('J').value,
                        annuelle: (typeof row.getCell('K').value === 'string') ?
                            row.getCell('K').value.trim() :
                            row.getCell('K').value,
                        commissionsSurArbitrage: (typeof row.getCell('L').value === 'string') ?
                            row.getCell('L').value.trim() :
                            row.getCell('L').value,
                        total: (typeof row.getCell('M').value === 'string') ?
                            row.getCell('M').value.trim() :
                            row.getCell('M').value
                    };
                    allContrats.push(contrat);
                }
            })
        }
    });

    const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'numCourtier');

    ocr = { headers, allContratsPerCourtier, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log('FIN TRAITEMENT MMA ACQUISITION');
    return ocr;
};

exports.readExcelMMAENCOURS = async (file) => {
    console.log('DEBUT TRAITEMENT MMA ENCOURS');
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    let headers = [];
    let allContrats = [];
    let detailsBordereau = {};
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    worksheets.forEach((worksheet, index) => {
        if (index === 0) {
            let rowNumberHeader;
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    detailsBordereau.title = row.getCell('C').value;
                    detailsBordereau.dateBordereau = row.getCell('H').value;
                }
                if (rowNumber === 3) {
                    detailsBordereau.row3F = row.getCell('F').value;
                    detailsBordereau.ref = row.getCell('G').value;
                }
                if (rowNumber === 4) {
                    detailsBordereau.row4A = row.getCell('A').value;
                    detailsBordereau.row4G = row.getCell('G').value;
                }
                if (rowNumber === 5) {
                    detailsBordereau.row5A = row.getCell('A').value;
                    detailsBordereau.row5G = row.getCell('G').value;
                }
                if (rowNumber === 6) {
                    detailsBordereau.row6A = row.getCell('A').value;
                    detailsBordereau.row6G = row.getCell('G').value;
                }
                if (rowNumber === 7) {
                    detailsBordereau.row7A = row.getCell('A').value;
                    detailsBordereau.row7G = row.getCell('G').value;
                }
                if (typeof row.getCell('A').value === 'string' && row.getCell('A').value.match(/Code Apporteur/i)) {
                    rowNumberHeader = rowNumber;
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim().replace(/\n/g, ' ') : cell.value.replace(/\n/g, ' ');
                        if (headers.indexOf(currentCellValue) < 0) {
                            headers.push(currentCellValue);
                        }
                    });
                }
                if (rowNumber > rowNumberHeader) {
                    const contrat = {
                        codeApporteur: (typeof row.getCell('A').value === 'string') ?
                            row.getCell('A').value.trim() :
                            row.getCell('A').value,
                        numContrat: (typeof row.getCell('B').value === 'string') ?
                            row.getCell('B').value.trim() :
                            row.getCell('B').value,
                        nomSouscripteur: (typeof row.getCell('C').value === 'string') ?
                            row.getCell('C').value.trim() :
                            row.getCell('C').value,
                        produit: (typeof row.getCell('D').value === 'string') ?
                            row.getCell('D').value.trim() :
                            row.getCell('D').value,
                        libelleSupport: (typeof row.getCell('E').value === 'string') ?
                            row.getCell('E').value.trim() :
                            row.getCell('E').value,
                        assieteDeRenumeration: (typeof row.getCell('F').value === 'string') ?
                            row.getCell('F').value.trim() :
                            row.getCell('F').value,
                        taux: (typeof row.getCell('G').value === 'string') ?
                            row.getCell('G').value.trim() :
                            row.getCell('G').value,
                        commissionSurEncours: (typeof row.getCell('H').value === 'string') ?
                            row.getCell('H').value.trim() :
                            row.getCell('H').value
                    };
                    allContrats.push(contrat);
                }
            })
        }
    });

    const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'codeApporteur');

    ocr = { headers, detailsBordereau, allContratsPerCourtier, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log('FIN TRAITEMENT MMA EN COURS');
    return ocr;
};
