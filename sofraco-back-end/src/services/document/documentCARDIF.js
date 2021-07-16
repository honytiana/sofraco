const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const time = require('../time/time');
const fileService = require('./files');

exports.readExcelCARDIF = async (file) => {
    console.log('DEBUT TRAITEMENT CARDIF');
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
    const cardiffile = fs.readFileSync(filePath);
    await workbook.xlsx.load(cardiffile);
    const worksheets = workbook.worksheets;
    let firstHeaders = [];
    let secondHeaders = [];
    let headers = {firstHeaders, secondHeaders};
    let allContrats = [];
    let ocr = { headers: null, allContratsPerCourtier: [], executionTime: 0 };
    for (let worksheet of worksheets) {
        if (worksheet.name === 'CommissionsDetaillees') {
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value;
                        if (firstHeaders.indexOf(currentCellValue) < 0) {
                            firstHeaders.push(currentCellValue);
                        }
                    });
                    headers.firstHeaders = firstHeaders;
                }
                if (rowNumber === 2) {
                    row.eachCell((cell, colNumber) => {
                        secondHeaders.push((typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value);
                    });
                    headers.secondHeaders = secondHeaders;
                }
                if (rowNumber > 2) {
                    const contrat = {
                        courtier: {
                            code: (typeof row.getCell('A').value === 'string') ?
                                row.getCell('A').value.trim() :
                                row.getCell('A').value,
                            libelle: (typeof row.getCell('B').value === 'string') ?
                                row.getCell('B').value.trim() :
                                row.getCell('B').value,
                        },
                        commission: {
                            reference: (typeof row.getCell('C').value === 'string') ?
                                row.getCell('C').value.trim() :
                                row.getCell('C').value,
                            type: (typeof row.getCell('D').value === 'string') ?
                                row.getCell('D').value.trim() :
                                row.getCell('D').value,
                            sousType: (typeof row.getCell('E').value === 'string') ?
                                row.getCell('E').value.trim() :
                                row.getCell('E').value,
                            datePriseEnCompte: (typeof row.getCell('F').value === 'string') ?
                                row.getCell('F').value.trim() :
                                row.getCell('F').value,
                            dateEffet: (typeof row.getCell('G').value === 'string') ?
                                row.getCell('G').value.trim() :
                                row.getCell('G').value,
                        },
                        client: {
                            numero: (typeof row.getCell('H').value === 'string') ?
                                row.getCell('H').value.trim() :
                                row.getCell('H').value,
                            nom: (typeof row.getCell('I').value === 'string') ?
                                row.getCell('I').value.trim() :
                                row.getCell('I').value,
                            prenom: (typeof row.getCell('J').value === 'string') ?
                                row.getCell('J').value.trim() :
                                row.getCell('J').value,
                        },
                        contrat: {
                            numero: (typeof row.getCell('K').value === 'string') ?
                                row.getCell('K').value.trim() :
                                row.getCell('K').value,
                            produit: (typeof row.getCell('L').value === 'string') ?
                                row.getCell('L').value.trim() :
                                row.getCell('L').value,
                        },
                        supportFinancier: {
                            codeISIN: (typeof row.getCell('M').value === 'string') ?
                                row.getCell('M').value.trim() :
                                row.getCell('M').value,
                            libelleSupportFinancier: (typeof row.getCell('N').value === 'string') ?
                                row.getCell('N').value.trim() :
                                row.getCell('N').value,
                            classification: (typeof row.getCell('O').value === 'string') ?
                                row.getCell('O').value.trim() :
                                row.getCell('O').value,
                        },
                        montantsCommission: {
                            assiette: (typeof row.getCell('P').value === 'string') ?
                                row.getCell('P').value.trim() :
                                row.getCell('P').value,
                            taux: (typeof row.getCell('Q').value === 'string') ?
                                row.getCell('Q').value.trim() :
                                row.getCell('Q').value,
                            montant: (typeof row.getCell('R').value === 'string') ?
                                row.getCell('R').value.trim() :
                                row.getCell('R').value,
                        }
                    };
                    allContrats.push(contrat);
                }
            })
        }
    }

    let allContratsPerCourtier = [];
    let courtiers = [];
    allContrats.forEach((element, index) => {
        const courtier = {code: element.courtier.code, libelle: element.courtier.libelle};
        if (!courtiers.some(c => { return c.code === courtier.code})) {
            courtiers.push(courtier);
        }
    })
    for (let courtier of courtiers) {
        let contratCourtier = {
            courtier: courtier,
            contrats: []
        };
        allContrats.forEach((element, index) => {
            if (element.courtier.code === contratCourtier.courtier.code) {
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
    console.log('FIN TRAITEMENT CARDIF');
    return ocr;
};

