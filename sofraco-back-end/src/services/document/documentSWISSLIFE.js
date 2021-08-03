const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const time = require('../time/time');
const fileService = require('./files');

exports.readExcelSWISSLIFESURCO = async (file) => {
    console.log('DEBUT TRAITEMENT SWISSLIFE SURCO');
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
    const swisslifefile = fs.readFileSync(filePath);
    await workbook.xlsx.load(swisslifefile);
    const worksheets = workbook.worksheets;
    let headers = [];
    let allContrats = [];
    let ocr = { headers: null, allContratsPerCourtier: [], executionTime: 0 };
    for (let worksheet of worksheets) {
        if (worksheet.name === worksheets[0].name ||
            worksheet.name === worksheets[1].name ||
            worksheet.name === worksheets[2].name ||
            worksheet.name === worksheets[4].name) {
            let rowNumberHeader;
            worksheet.eachRow((row, rowNumber) => {
                if (typeof row.getCell('A').value === 'string' && row.getCell('A').value.match(/Apporteur/i)) {
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
                        apporteurVente: (typeof row.getCell('A').value === 'string') ?
                            row.getCell('A').value.trim() :
                            row.getCell('A').value,
                        dateComptabVente: (typeof row.getCell('B').value === 'string') ?
                            row.getCell('B').value.trim() :
                            row.getCell('B').value,
                        numeroPolice: (typeof row.getCell('C').value === 'string') ?
                            row.getCell('C').value.trim() :
                            row.getCell('C').value,
                        codeProduit: (typeof row.getCell('D').value === 'string') ?
                            row.getCell('D').value.trim() :
                            row.getCell('D').value,
                        nomClient: (typeof row.getCell('E').value === 'string') ?
                            row.getCell('E').value.trim() :
                            row.getCell('E').value,
                        cotisationPonderee: (typeof row.getCell('F').value === 'string') ?
                            row.getCell('F').value.trim() :
                            row.getCell('F').value,
                        montantPP: (typeof row.getCell('G').value === 'string') ?
                            row.getCell('G').value.trim() :
                            row.getCell('G').value,
                        dontParUCsurPP: (typeof row.getCell('H').value === 'string') ?
                            row.getCell('H').value.trim() :
                            row.getCell('H').value,
                        montantPU: (typeof row.getCell('I').value === 'string') ?
                            row.getCell('I').value.trim() :
                            row.getCell('I').value,
                        dontParUCsurPU: (typeof row.getCell('J').value === 'string') ?
                            row.getCell('J').value.trim() :
                            row.getCell('J').value,
                        tauxChargement: (typeof row.getCell('K').value === 'string') ?
                            row.getCell('K').value.trim() :
                            row.getCell('K').value,
                        avanceSurco: (typeof row.getCell('L').value === 'string') ?
                            row.getCell('L').value.trim() :
                            row.getCell('L').value,
                        incompressible: (typeof row.getCell('M').value === 'string') ?
                            row.getCell('M').value.trim() :
                            row.getCell('M').value,
                        avanceComprisRepriseIncompressible: (typeof row.getCell('N').value === 'string') ?
                            row.getCell('N').value.trim() :
                            row.getCell('N').value
                    };
                    allContrats.push(contrat);
                }
            })
        }
    }

    let allContratsPerCourtier = [];
    let courtiers = [];
    allContrats.forEach((element, index) => {
        if(!element.apporteurVente.match(/total/i)) {
            const courtier = { code: element.apporteurVente, libelle: element.apporteurVente};
            if (!courtiers.some(c => { return c.code === courtier.code })) {
                courtiers.push(courtier);
            }
        }
    })
    for (let courtier of courtiers) {
        let contratCourtier = {
            courtier: courtier,
            contrats: []
        };
        allContrats.forEach((element, index) => {
            if (element.apporteurVente === contratCourtier.courtier.code) {
                contratCourtier.contrats.push(element);
            }
        });
        allContratsPerCourtier.push(contratCourtier);
    }

    ocr = { headers, allContratsPerCourtier, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log('FIN TRAITEMENT SWISSLIFE SURCO');
    return ocr;
};

