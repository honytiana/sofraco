const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const time = require('../time/time');
const fileService = require('./files');

exports.readExcelMMA = async (file) => {
    console.log('DEBUT TRAITEMENT MMA');
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
    const mmafile = fs.readFileSync(filePath);
    await workbook.xlsx.load(mmafile);
    const worksheets = workbook.worksheets;
    let headers = [];
    let allContrats = [];
    let detailsBordereau = {};
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    worksheets.forEach((worksheet, index) => {
        if (index === 0) {
            let rowNumberHeader;
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber ===  1) {
                    detailsBordereau.title = row.getCell('C').value;
                    detailsBordereau.dateBordereau = row.getCell('H').value;
                }
                if (rowNumber ===  4) {
                    detailsBordereau.row4A = row.getCell('A').value;
                    detailsBordereau.row4G = row.getCell('G').value;
                }
                if (rowNumber ===  5) {
                    detailsBordereau.row5A = row.getCell('A').value;
                    detailsBordereau.row5G = row.getCell('G').value;
                }
                if (rowNumber ===  6) {
                    detailsBordereau.row6A = row.getCell('A').value;
                    detailsBordereau.row6G = row.getCell('G').value;
                }
                if (rowNumber ===  7) {
                    detailsBordereau.row7A = row.getCell('A').value;
                    detailsBordereau.row7G = row.getCell('G').value;
                }
                if (rowNumber ===  8) {
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

    let allContratsPerCourtier = [];
    let courtiers = [];
    allContrats.forEach((element, index) => {
        if (courtiers.indexOf(element.codeApporteur) < 0) {
            courtiers.push(element.codeApporteur);
        }
    })
    for (let courtier of courtiers) {
        let contratCourtier = { courtier: '', contrats: [] };
        allContrats.forEach((element, index) => {
            contratCourtier.courtier = courtier;
            if (element.codeApporteur === contratCourtier.courtier) {
                contratCourtier.contrats.push(element);
            }
        });
        allContratsPerCourtier.push(contratCourtier);
    }

    ocr = { headers, detailsBordereau, allContratsPerCourtier, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log('FIN TRAITEMENT MMA');
    return ocr;
};

