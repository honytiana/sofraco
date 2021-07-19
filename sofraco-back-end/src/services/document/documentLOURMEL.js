const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const time = require('../time/time');
const fileService = require('./files');

exports.readExcelLOURMEL = async (file) => {
    console.log('DEBUT TRAITEMENT LOURMEL');
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
    const lourmelfile = fs.readFileSync(filePath);
    await workbook.xlsx.load(lourmelfile);
    const worksheets = workbook.worksheets;
    let headers = [];
    let allContrats = [];
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    headers = [
                        'CODE COURTIER',
                        'B',
                        'C',
                        'D',
                        'GENRE',
                        'NOM',
                        'PRENOM',
                        'NOM DE NAISSANCE',
                        'CODE POSTALE',
                        'VILLE',
                        'DATE EFFET',
                        'MONTANT DE LA COTISATION',
                        'M',
                        'DATE DEBUT',
                        'DATE FIN',
                        'TAUX DE COMMISSION',
                        'MONTANT DE LA COMMISSION'
                    ];
                }
                if (rowNumber > 1 && !row.hidden) {
                    const contrat = {
                        courtier: (typeof row.getCell('A').value === 'string') ?
                            row.getCell('A').value.trim() :
                            row.getCell('A').value,
                        b: (typeof row.getCell('B').value === 'string') ?
                            row.getCell('B').value.trim() :
                            row.getCell('B').value,
                        c: (typeof row.getCell('C').value === 'string') ?
                            row.getCell('C').value.trim() :
                            row.getCell('C').value,
                        d: (typeof row.getCell('D').value === 'string') ?
                            row.getCell('D').value.trim() :
                            row.getCell('D').value,
                        genre: (typeof row.getCell('E').value === 'string') ?
                            row.getCell('E').value.trim() :
                            row.getCell('E').value,
                        nom: (typeof row.getCell('F').value === 'string') ?
                            row.getCell('F').value.trim() :
                            row.getCell('F').value,
                        prenom: (typeof row.getCell('G').value === 'string') ?
                            row.getCell('G').value.trim() :
                            row.getCell('G').value,
                        nomDeNaissance: (typeof row.getCell('H').value === 'string') ?
                            row.getCell('H').value.trim() :
                            row.getCell('H').value,
                        codePostal: (typeof row.getCell('I').value === 'string') ?
                            row.getCell('I').value.trim() :
                            row.getCell('I').value,
                        ville: (typeof row.getCell('J').value === 'string') ?
                            row.getCell('J').value.trim() :
                            row.getCell('J').value,
                        dateEffet: (typeof row.getCell('K').value === 'string') ?
                            row.getCell('K').value.trim() :
                            new Date(0, 0, row.getCell('K').value, 0, 0, 0),
                        montantCotisation: (typeof row.getCell('L').value === 'string') ?
                            row.getCell('L').value.trim() :
                            row.getCell('L').value,
                        m: (typeof row.getCell('M').value === 'string') ?
                            row.getCell('M').value.trim() :
                            row.getCell('M').value,
                        dateDebut: (typeof row.getCell('N').value === 'string') ?
                            row.getCell('N').value.trim() :
                            new Date(0, 0, row.getCell('N').value, 0, 0, 0),
                        dateFin: (typeof row.getCell('O').value === 'string') ?
                            row.getCell('O').value.trim() :
                            new Date(0, 0, row.getCell('O').value, 0, 0, 0),
                        tauxCommission: (typeof row.getCell('P').value === 'string') ?
                            row.getCell('P').value.trim() :
                            row.getCell('P').value,
                        montantCommission: (typeof row.getCell('Q').value === 'string') ?
                            row.getCell('Q').value.trim() :
                            row.getCell('Q').value
                    };
                    allContrats.push(contrat);
                }
            })
        }
    });

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
    console.log('FIN TRAITEMENT LOURMEL');
    return ocr;
};

