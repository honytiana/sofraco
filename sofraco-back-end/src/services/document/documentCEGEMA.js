const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const time = require('../time/time');

exports.readExcelCEGEMA = async (file) => {
    console.log('DEBUT TRAITEMENT CEGEMA');
    const excecutionStartTime = performance.now();
    let filePath = file;
    const filePathArr = filePath.split('/');
    const fileNameWithExtension = filePathArr[filePathArr.length - 1];
    const fileNameArr = fileNameWithExtension.split('.');
    const fileName = fileNameArr[0];
    const extension = fileNameArr[1];
    if (extension.toUpperCase() === 'XLS') {
        let originalFile  = XLSX.readFile(filePath);
        filePath = path.join(__dirname, '..', '..', '..', 'documents', 'uploaded', `${fileName}.xlsx`);
        XLSX.writeFile(originalFile, filePath);
    }
    const workbook = new ExcelJS.Workbook();
    const cegemafile = fs.readFileSync(filePath);
    await workbook.xlsx.load(cegemafile);
    const worksheets = workbook.worksheets;
    let headers = [];
    let allContrats = [];
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    for (let worksheet of worksheets) {
        if (worksheet.name === 'Tous les mouvements') {
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    row.eachCell((cell, colNumber) => {
                        headers.push((typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value);
                    });
                }
                if (rowNumber > 1) {
                    const contrat = {
                        courtier: (typeof row.getCell('A').value === 'string') ?
                            row.getCell('A').value.trim() :
                            row.getCell('A').value,
                        nomAdherent: (typeof row.getCell('B').value === 'string') ?
                            row.getCell('B').value.trim() :
                            row.getCell('B').value,
                        numAdhesion: (typeof row.getCell('C').value === 'string') ?
                            row.getCell('C').value.trim() :
                            row.getCell('C').value,
                        garantie: (typeof row.getCell('D').value === 'string') ?
                            row.getCell('D').value.trim() :
                            row.getCell('D').value,
                        effetAu: (typeof row.getCell('E').value === 'string') ?
                            row.getCell('E').value.trim() :
                            row.getCell('E').value,
                        cotisHT: (typeof row.getCell('F').value === 'string') ?
                            row.getCell('F').value.trim() :
                            row.getCell('F').value,
                        taux: (typeof row.getCell('G').value === 'string') ?
                            row.getCell('G').value.trim() :
                            row.getCell('G').value,
                        commission: (typeof row.getCell('H').value === 'string') ?
                            row.getCell('H').value.trim() :
                            row.getCell('H').value,
                        modeMotif: (typeof row.getCell('I').value === 'string') ?
                            row.getCell('I').value.trim() :
                            row.getCell('I').value
                    };
                    allContrats.push(contrat);
                }
            })
        }
    }

    let allContratsPerCourtier = [];
    let courtiers = [];
    allContrats.forEach((element, index) => {
        if (courtiers.indexOf(element.courtier) < 0) {
            courtiers.push(element.courtier);
        }
    })
    for (let courtier of courtiers) {
        let contratCourtier = { courtier: '', contrats: [] };
        allContrats.forEach((element, index) => {
            contratCourtier.courtier = courtier;
            if (element.courtier === contratCourtier.courtier) {
                contratCourtier.contrats.push(element);
            }
        });
        allContratsPerCourtier.push(contratCourtier);
    }

    ocr = { headers, allContratsPerCourtier, executionTime: 0 };
    const excecutionStopTime = performance.now();
    let executionTime = excecutionStopTime - excecutionStartTime;
    executionTime = time.millisecondToTime(executionTime);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    console.log('FIN TRAITEMENT CEGEMA');
    return ocr;
};

