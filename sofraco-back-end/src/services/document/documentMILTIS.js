const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const time = require('../utils/time');
const fileService = require('../utils/files');
const generals = require('../utils/generals');

exports.readExcelMILTIS = async (file) => {
    console.log('DEBUT TRAITEMENT MILTIS');
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
    const miltisfile = fs.readFileSync(filePath);
    await workbook.xlsx.load(miltisfile);
    const worksheets = workbook.worksheets;
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
                        codeAdherent: (typeof row.getCell('A').value === 'string') ?
                            row.getCell('A').value.trim() :
                            row.getCell('A').value,
                        nomAdherent: (typeof row.getCell('B').value === 'string') ?
                            row.getCell('B').value.trim() :
                            row.getCell('B').value,
                        typeAdherent: (typeof row.getCell('C').value === 'string') ?
                            row.getCell('C').value.trim() :
                            row.getCell('C').value,
                        garantie: (typeof row.getCell('D').value === 'string') ?
                            row.getCell('D').value.trim() :
                            row.getCell('D').value,
                        periodeDebut: (typeof row.getCell('E').value === 'string') ?
                            row.getCell('E').value.trim() :
                            (row.getCell('E').value !== null) ? new Date(0, 0, row.getCell('E').value, 0, 0, 0) : '',
                        periodeFin: (typeof row.getCell('F').value === 'string') ?
                            row.getCell('F').value.trim() :
                            (row.getCell('F').value !== null) ? new Date(0, 0, row.getCell('F').value, 0, 0, 0) : '',
                        periodicite: (typeof row.getCell('G').value === 'string') ?
                            row.getCell('G').value.trim() :
                            row.getCell('G').value,
                        typeCommission: (typeof row.getCell('H').value === 'string') ?
                            row.getCell('H').value.trim() :
                            row.getCell('H').value,
                        primeHT: (typeof row.getCell('I').value === 'string') ?
                            row.getCell('I').value.trim() :
                            row.getCell('I').value,
                        taux: (typeof row.getCell('J').value === 'string') ?
                            row.getCell('J').value.trim() :
                            row.getCell('J').value,
                        Commission: (typeof row.getCell('K').value === 'string') ?
                            row.getCell('K').value.trim() :
                            row.getCell('K').value,
                        dateDeCalcul: (typeof row.getCell('L').value === 'string') ?
                            row.getCell('L').value.trim() :
                            (row.getCell('L').value !== null) ? new Date(0, 0, row.getCell('L').value, 0, 0, 0) : '',
                        codePostal: (typeof row.getCell('M').value === 'string') ?
                            row.getCell('M').value.trim() :
                            row.getCell('M').value,
                        ville: (typeof row.getCell('N').value === 'string') ?
                            row.getCell('N').value.trim() :
                            row.getCell('N').value,
                        raisonSociale: (typeof row.getCell('O').value === 'string') ?
                            row.getCell('O').value.trim() :
                            row.getCell('O').value,
                        codeMiltis: (typeof row.getCell('P').value === 'string') ?
                            row.getCell('P').value.trim() :
                            row.getCell('P').value,
                        courtier: (typeof row.getCell('Q').value === 'string') ?
                            row.getCell('Q').value.trim() :
                            row.getCell('Q').value,
                        fondateur: (typeof row.getCell('R').value === 'string') ?
                            row.getCell('R').value.trim() :
                            row.getCell('R').value !== null,
                        pavillon: (typeof row.getCell('S').value === 'string') ?
                            row.getCell('S').value.trim() :
                            row.getCell('S').value !== null,
                        sofraco: (typeof row.getCell('T').value === 'string') ?
                            row.getCell('T').value.trim() :
                            row.getCell('T').value,
                        sofracoExpertises: (typeof row.getCell('U').value === 'string') ?
                            row.getCell('U').value.trim() :
                            row.getCell('U').value,
                        budget: (typeof row.getCell('V').value === 'string') ?
                            row.getCell('V').value.trim() :
                            row.getCell('V').value,
                    };
                    allContrats.push(contrat);
                }
            })
        }
    });

    const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'codeMiltis');

    ocr = { headers, allContratsPerCourtier, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log('FIN TRAITEMENT MILTIS');
    return ocr;
};

