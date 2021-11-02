const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const time = require('../utils/time');
const fileService = require('../utils/files');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ apicil: workerData });
}

exports.readExcelAPICIL = async (file) => {
    console.log('DEBUT TRAITEMENT APICIL');
    const excecutionStartTime = performance.now();
    let filePath = file;
    const fileName = fileService.getFileNameWithoutExtension(filePath);
    const extension = fileService.getFileExtension(filePath);
    if (extension.toUpperCase() === 'XLS') {
        let originalFile = XLSX.readFile(filePath);
        filePath = path.join(__dirname, '..', '..', '..', 'documents', 'uploaded', `${fileName}.xlsx`);
        XLSX.writeFile(originalFile, filePath);
    }
    const workbook = new ExcelJS.Workbook();
    const apicilfile = fs.readFileSync(filePath);
    await workbook.xlsx.load(apicilfile);
    const worksheets = workbook.worksheets;
    let allRows = [];
    let infos = {
        executionTime: 0,
        headers: {},
        collective: [],
        individual: [],
        totals: { collective: '', individual: '', general: '' }
    };
    let headers = { releve: '', prescripteur: '', codeSte: '', echeance: '' };
    for (let worksheet of worksheets) {
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 2) {
                headers.releve = (typeof row.getCell('B').value === 'string') ?
                    row.getCell('B').value.trim() :
                    row.getCell('B').value;
                headers.prescripteur = row.getCell('C').value.trim();
                headers.codeSte = row.getCell('E').value.trim();
            }
            if (rowNumber === 3) {
                headers.echeance = (typeof row.getCell('C').value === 'string') ?
                    row.getCell('C').value.trim() :
                    row.getCell('C').value;
            }
            if (rowNumber > 4) {
                if (row.getCell('C').value.trim().toUpperCase() === 'TOTAL COLLECTIF') {
                    infos.totals.collective = (typeof row.getCell('I').value === 'string') ?
                        row.getCell('I').value.trim() :
                        row.getCell('I').value;
                }
                if (row.getCell('C').value.trim().toUpperCase() === 'TOTAL INDIVIDUELS') {
                    infos.totals.individual = (typeof row.getCell('I').value === 'string') ?
                        row.getCell('I').value.trim() :
                        row.getCell('I').value;
                }
                if (row.getCell('C').value.trim().toUpperCase() === 'TOTAL GENERAL') {
                    infos.totals.general = (typeof row.getCell('I').value === 'string') ?
                        row.getCell('I').value.trim() :
                        row.getCell('I').value;
                }

                // I: commision (mtEcheance), L: code courtier, M: cabinet du courtier
                const obj = {
                    contratJuridique: (typeof row.getCell('A').value === 'string') ?
                        row.getCell('A').value.trim() :
                        row.getCell('A').value,
                    no_Adherent: (typeof row.getCell('B').value === 'string') ?
                        row.getCell('B').value.trim() :
                        row.getCell('B').value,
                    intitule: (typeof row.getCell('C').value === 'string') ?
                        row.getCell('C').value.trim() :
                        row.getCell('C').value,
                    produit: (typeof row.getCell('D').value === 'string') ?
                        row.getCell('D').value.trim() :
                        row.getCell('D').value,
                    nombre: (typeof row.getCell('E').value === 'string') ?
                        row.getCell('E').value.trim() :
                        row.getCell('E').value,
                    exer: (typeof row.getCell('F').value === 'string') ?
                        row.getCell('F').value.trim() :
                        row.getCell('F').value,
                    mtCotisation: (typeof row.getCell('G').value === 'string') ?
                        row.getCell('G').value.trim() :
                        row.getCell('G').value,
                    taux: (typeof row.getCell('H').value === 'string') ?
                        row.getCell('H').value.trim() :
                        row.getCell('H').value,
                    mtEcheance: (typeof row.getCell('I').value === 'string') ?
                        row.getCell('I').value.trim() :
                        row.getCell('I').value,
                    debContr: (typeof row.getCell('J').value === 'string') ?
                        row.getCell('J').value.trim() :
                        row.getCell('J').value,
                    finContr: (typeof row.getCell('K').value === 'string') ?
                        row.getCell('K').value.trim() :
                        row.getCell('K').value,
                    prescRemu: (typeof row.getCell('L').value === 'string') ?
                        row.getCell('L').value.trim() :
                        row.getCell('L').value,
                    nomPrescRemu: (typeof row.getCell('M').value === 'string') ?
                        row.getCell('M').value.trim() :
                        row.getCell('M').value,
                    prenomPrescRemu: (typeof row.getCell('N').value === 'string') ?
                        row.getCell('N').value.trim() :
                        row.getCell('N').value,
                    periode: (typeof row.getCell('O').value === 'string') ?
                        row.getCell('O').value.trim() :
                        row.getCell('O').value,
                };
                allRows.push(obj);
            }
        });
    }

    infos.headers = headers;
    for (let element of allRows) {
        if (element.prescRemu === '' &&
            element.nomPrescRemu === '' &&
            element.mtEcheance === '') {
            infos.collective = allRows.slice(0, allRows.indexOf(element));
            infos.individual = allRows.slice(allRows.indexOf(element) + 1, allRows.length - 1);
            infos.collective.pop();
            infos.individual.pop();
            infos.individual.pop();
            break;
        }
    };

    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    infos.executionTime = executionTime;
    infos.executionTimeMS = executionTimeMS;
    console.log('FIN TRAITEMENT APICIL');
    return infos;
};

