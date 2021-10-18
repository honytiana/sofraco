const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const time = require('../utils/time');
const fileService = require('../utils/files');

exports.readExcelAVIVASURCO = async (file) => {
    console.log('DEBUT TRAITEMENT AVIVA SURCO');
    const excecutionStartTime = performance.now();
    let filePath = file;
    const fileName = fileService.getFileNameWithoutExtension(filePath);
    const extension = fileService.getFileExtension(filePath);
    if (extension.toUpperCase() === 'XLS') {
        let originalFile  = XLSX.readFile(filePath);
        filePath = path.join(__dirname, '..', '..', '..', 'documents', 'uploaded', `${fileName}.xlsx`);
        XLSX.writeFile(originalFile, filePath);
    }
    const workbook = new ExcelJS.Workbook();
    const avivasurcofile = fs.readFileSync(filePath);
    await workbook.xlsx.load(avivasurcofile);
    const worksheets = workbook.worksheets;
    let headers = [];
    let allContrats = [];
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    for (let worksheet of worksheets) {
        let cabinetCourtier = { apporteur: '', contrats: [] };
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                row.eachCell((cell, colNumber) => {
                    headers.push((typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value);
                });
            }
            if (rowNumber > 1) {
                const contrat = {
                    reseau: (typeof row.getCell('A').value === 'string') ?
                        row.getCell('A').value.trim() :
                        row.getCell('A').value,
                    region: (typeof row.getCell('B').value === 'string') ?
                        row.getCell('B').value.trim() :
                        row.getCell('B').value,
                    inspecteur: (typeof row.getCell('C').value === 'string') ?
                        row.getCell('C').value.trim() :
                        row.getCell('C').value,
                    codeInter: (typeof row.getCell('D').value === 'string') ?
                        row.getCell('D').value.trim() :
                        row.getCell('D').value,
                    nomApporteur: (typeof row.getCell('E').value === 'string') ?
                        row.getCell('E').value.trim() :
                        row.getCell('E').value,
                    numeroContrat: (typeof row.getCell('F').value === 'string') ?
                        row.getCell('F').value.trim() :
                        row.getCell('F').value,
                    numeroCouverture: (typeof row.getCell('G').value === 'string') ?
                        row.getCell('G').value.trim() :
                        row.getCell('G').value,
                    nomAssure: (typeof row.getCell('H').value === 'string') ?
                        row.getCell('H').value.trim() :
                        row.getCell('H').value,
                    nomContrat: (typeof row.getCell('I').value === 'string') ?
                        row.getCell('I').value.trim() :
                        row.getCell('I').value,
                    nomGarantie: (typeof row.getCell('J').value === 'string') ?
                        row.getCell('J').value.trim() :
                        row.getCell('J').value,
                    familleContrat: (typeof row.getCell('K').value === 'string') ?
                        row.getCell('K').value.trim() :
                        row.getCell('K').value,
                    typeMVT: (typeof row.getCell('L').value === 'string') ?
                        row.getCell('L').value.trim() :
                        row.getCell('L').value,
                    dateEffetMVT: (typeof row.getCell('M').value === 'string') ?
                        row.getCell('M').value.trim() :
                        row.getCell('M').value,
                    moisEffetMVT: (typeof row.getCell('N').value === 'string') ?
                        row.getCell('N').value.trim() :
                        row.getCell('N').value,
                    prodBrute: (typeof row.getCell('O').value === 'string') ?
                        row.getCell('O').value.trim() :
                        row.getCell('O').value,
                    prodObjectifAE: (typeof row.getCell('P').value === 'string') ?
                        row.getCell('P').value.trim() :
                        row.getCell('P').value,
                    prodCalculAE: (typeof row.getCell('Q').value === 'string') ?
                        row.getCell('Q').value.trim() :
                        row.getCell('Q').value,
                };
                if (contrat.codeInter && contrat.codeInter.match(/Total.+/i)) {
                    cabinetCourtier.contrats.push(contrat);
                    allContrats.push(cabinetCourtier);
                    cabinetCourtier = { apporteur: '', contrats: [] };

                } else {
                    cabinetCourtier.contrats.push(contrat);
                    cabinetCourtier.apporteur = (typeof row.getCell('E').value === 'string') ?
                        row.getCell('E').value.trim() :
                        row.getCell('E').value;
                }
            }
        })
    }

    let allContratsPerCourtier = [];
    let apporteurs = [];
    allContrats.forEach((element, index) => {
        if (apporteurs.indexOf(element.apporteur) < 0) {
            apporteurs.push(element.apporteur);
        }
    })
    for (let apporteur of apporteurs) {
        let contratCourtier = { apporteur: '', contrats: [] };
        allContrats.forEach((element, index) => {
            contratCourtier.apporteur = apporteur;
            if (element.apporteur === contratCourtier.apporteur) {
                contratCourtier.contrats.push(element.contrats);
            }
        });
        allContratsPerCourtier.push(contratCourtier);
    }

    ocr = { headers, allContratsPerCourtier, executionTime: 0 , executionTimeMS: 0};
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log('FIN TRAITEMENT AVIVA SURCO');
    return ocr;
};

