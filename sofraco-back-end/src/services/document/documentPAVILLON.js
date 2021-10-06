const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const time = require('../time/time');
const fileService = require('./files');

exports.readExcelPAVILLON = async (file) => {
    console.log('DEBUT TRAITEMENT PAVILLON PREVOYANCE');
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
    const mielfile = fs.readFileSync(filePath);
    await workbook.xlsx.load(mielfile);
    const worksheets = workbook.worksheets;
    let headers = [];
    let allContrats = [];
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
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
                        dateGeneration: (typeof row.getCell('A').value === 'string') ?
                            row.getCell('A').value.trim() :
                            (row.getCell('A').value !== null) ? new Date(0, 0, row.getCell('N').value, 0, 0, 0) : '',
                        codeCompagnie: (typeof row.getCell('B').value === 'string') ?
                            row.getCell('B').value.trim() :
                            row.getCell('B').value,
                        codeCourtier: (typeof row.getCell('C').value === 'string') ?
                            row.getCell('C').value.trim() :
                            row.getCell('C').value,
                        raisonSocialeApporteur: (typeof row.getCell('D').value === 'string') ?
                            row.getCell('D').value.trim() :
                            row.getCell('D').value,
                        dateArrete: (typeof row.getCell('E').value === 'string') ?
                            row.getCell('E').value.trim() :
                            (row.getCell('E').value !== null) ? new Date(0, 0, row.getCell('N').value, 0, 0, 0) : '',
                        identifiant: (typeof row.getCell('F').value === 'string') ?
                            row.getCell('F').value.trim() :
                            row.getCell('F').value,
                        codePostal: (typeof row.getCell('G').value === 'string') ?
                            row.getCell('G').value.trim() :
                            row.getCell('G').value,
                        commune: (typeof row.getCell('H').value === 'string') ?
                            row.getCell('H').value.trim() :
                            row.getCell('H').value,
                        dateEffetContrat: (typeof row.getCell('I').value === 'string') ?
                            row.getCell('I').value.trim() :
                            (row.getCell('I').value !== null) ? new Date(0, 0, row.getCell('N').value, 0, 0, 0) : '',
                        debutPeriode: (typeof row.getCell('J').value === 'string') ?
                            row.getCell('J').value.trim() :
                            (row.getCell('J').value !== null) ? new Date(0, 0, row.getCell('N').value, 0, 0, 0) : '',
                        finPeriode: (typeof row.getCell('K').value === 'string') ?
                            row.getCell('K').value.trim() :
                            (row.getCell('K').value !== null) ? new Date(0, 0, row.getCell('N').value, 0, 0, 0) : '',
                        raisonSociale: (typeof row.getCell('L').value === 'string') ?
                            row.getCell('L').value.trim() :
                            row.getCell('L').value,
                        codeProduit: (typeof row.getCell('M').value === 'string') ?
                            row.getCell('M').value.trim() :
                            row.getCell('M').value,
                        nomProduit: (typeof row.getCell('N').value === 'string') ?
                            row.getCell('N').value.trim() :
                            row.getCell('N').value,
                        emissionTTC: (typeof row.getCell('O').value === 'string') ?
                            row.getCell('O').value.trim() :
                            row.getCell('O').value,
                        reglementTTC: (typeof row.getCell('P').value === 'string') ?
                            row.getCell('P').value.trim() :
                            row.getCell('P').value,
                        reglementHT: (typeof row.getCell('Q').value === 'string') ?
                            row.getCell('Q').value.trim() :
                            row.getCell('Q').value,
                        taux: (typeof row.getCell('R').value === 'string') ?
                            row.getCell('R').value.trim() :
                            row.getCell('R').value,
                        montantPaiement: (typeof row.getCell('S').value === 'string') ?
                            row.getCell('S').value.trim() :
                            row.getCell('S').value,
                        courtier: (typeof row.getCell('T').value === 'string') ?
                            row.getCell('T').value.trim() :
                            row.getCell('T').value,
                        fondateur: (typeof row.getCell('U').value === 'string') ?
                            row.getCell('U').value.trim() :
                            row.getCell('U').value
                    };
                    allContrats.push(contrat);
                }
            })
        }
    });

    let allContratsPerCourtier = [];
    let courtiers = [];
    allContrats.forEach((element, index) => {
        if (courtiers.indexOf(element.codeCourtier) < 0) {
            courtiers.push(element.codeCourtier);
        }
    })
    for (let courtier of courtiers) {
        let contratCourtier = { courtier: '', contrats: [] };
        allContrats.forEach((element, index) => {
            contratCourtier.courtier = courtier;
            if (element.codeCourtier === contratCourtier.courtier) {
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
    console.log('FIN TRAITEMENT PAVILLON PREVOYANCE');
    return ocr;
};

exports.readExcelPAVILLONMCMS = async (file) => {
    console.log('DEBUT TRAITEMENT PAVILLON MCMS');
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
    const mielfile = fs.readFileSync(filePath);
    await workbook.xlsx.load(mielfile);
    const worksheets = workbook.worksheets;
    let headers = [];
    let allContrats = [];
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    let pavillonMCMSV1;
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
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
                    let contrat;
                    if (pavillonMCMSV1) {
                        contrat = {
                            dateGeneration: (typeof row.getCell('A').value === 'string') ?
                                row.getCell('A').value.trim() :
                                (row.getCell('A').value !== null) ? new Date(0, 0, row.getCell('N').value, 0, 0, 0) : '',
                            codeCompagnie: (typeof row.getCell('B').value === 'string') ?
                                row.getCell('B').value.trim() :
                                row.getCell('B').value,
                            codeCourtier: (typeof row.getCell('C').value === 'string') ?
                                row.getCell('C').value.trim() :
                                row.getCell('C').value,
                            raisonSocialeApporteur: (typeof row.getCell('D').value === 'string') ?
                                row.getCell('D').value.trim() :
                                row.getCell('D').value,
                            dateArrete: (typeof row.getCell('E').value === 'string') ?
                                row.getCell('E').value.trim() :
                                (row.getCell('E').value !== null) ? new Date(0, 0, row.getCell('N').value, 0, 0, 0) : '',
                            identifiant: (typeof row.getCell('F').value === 'string') ?
                                row.getCell('F').value.trim() :
                                row.getCell('F').value,
                            codePostal: (typeof row.getCell('G').value === 'string') ?
                                row.getCell('G').value.trim() :
                                row.getCell('G').value,
                            commune: (typeof row.getCell('H').value === 'string') ?
                                row.getCell('H').value.trim() :
                                row.getCell('H').value,
                            dateEffetContrat: (typeof row.getCell('I').value === 'string') ?
                                row.getCell('I').value.trim() :
                                (row.getCell('I').value !== null) ? new Date(0, 0, row.getCell('N').value, 0, 0, 0) : '',
                            debutPeriode: (typeof row.getCell('J').value === 'string') ?
                                row.getCell('J').value.trim() :
                                (row.getCell('J').value !== null) ? new Date(0, 0, row.getCell('N').value, 0, 0, 0) : '',
                            finPeriode: (typeof row.getCell('K').value === 'string') ?
                                row.getCell('K').value.trim() :
                                (row.getCell('K').value !== null) ? new Date(0, 0, row.getCell('N').value, 0, 0, 0) : '',
                            raisonSociale: (typeof row.getCell('L').value === 'string') ?
                                row.getCell('L').value.trim() :
                                row.getCell('L').value,
                            codeProduit: (typeof row.getCell('M').value === 'string') ?
                                row.getCell('M').value.trim() :
                                row.getCell('M').value,
                            nomProduit: (typeof row.getCell('N').value === 'string') ?
                                row.getCell('N').value.trim() :
                                row.getCell('N').value,
                            emissionTTC: (typeof row.getCell('O').value === 'string') ?
                                row.getCell('O').value.trim() :
                                row.getCell('O').value,
                            reglementTTC: (typeof row.getCell('P').value === 'string') ?
                                row.getCell('P').value.trim() :
                                row.getCell('P').value,
                            reglementHT: (typeof row.getCell('Q').value === 'string') ?
                                row.getCell('Q').value.trim() :
                                row.getCell('Q').value,
                            taux: (typeof row.getCell('R').value === 'string') ?
                                row.getCell('R').value.trim() :
                                row.getCell('R').value,
                            montantPaiement: (typeof row.getCell('S').value === 'string') ?
                                row.getCell('S').value.trim() :
                                row.getCell('S').value,
                            courtier: (typeof row.getCell('T').value === 'string') ?
                                row.getCell('T').value.trim() :
                                row.getCell('T').value,
                            fondateur: (typeof row.getCell('U').value === 'string') ?
                                row.getCell('U').value.trim() :
                                row.getCell('U').value
                        };
                    }

                    allContrats.push(contrat);
                }
            })
        }
    });

    let allContratsPerCourtier = [];
    let courtiers = [];
    allContrats.forEach((element, index) => {
        if (courtiers.indexOf(element.codeCourtier) < 0) {
            courtiers.push(element.codeCourtier);
        }
    })
    for (let courtier of courtiers) {
        let contratCourtier = { courtier: '', contrats: [] };
        allContrats.forEach((element, index) => {
            contratCourtier.courtier = courtier;
            if (element.codeCourtier === contratCourtier.courtier) {
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
    console.log('FIN TRAITEMENT PAVILLON MCMS');
    return ocr;
};

