const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const time = require('../time/time');
const fileService = require('./files');

exports.readExcelSMATIS = async (file) => { };

exports.readExcelSMATISMCMS = async (file) => {
    console.log('DEBUT TRAITEMENT SMATIS MCMS');
    const excecutionStartTime = performance.now();
    let filePath = file;
    const fileName = fileService.getFileNameWithoutExtension(filePath);
    // const version = fileName.replace(/(\d+).+/, '$1');
    const extension = fileService.getFileExtension(filePath);
    if (extension.toUpperCase() === 'XLS') {
        let originalFile = XLSX.readFile(filePath);
        filePath = path.join(__dirname, '..', '..', '..', 'documents', 'uploaded', `${fileName}.xlsx`);
        XLSX.writeFile(originalFile, filePath);
    }
    const workbook = new ExcelJS.Workbook();
    const smatisfile = fs.readFileSync(filePath);
    await workbook.xlsx.load(smatisfile);
    const worksheets = workbook.worksheets;
    let allContrats = [];
    let headers = {
        firstHeader: [],
        secondHeader: []
    };
    let ocr = { headers: null, allContratsPerCourtier: [], smatisVersion: null, executionTime: 0 };
    // let smatisAxiom = false;
    // switch (version) {
    //     case '01':
    //         smatisAxiom = true;
    //         break;
    // }
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let rowNumberHeader;
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    headers.firstHeader.push((typeof row.getCell('D').value === 'string') ?
                        row.getCell('D').value.trim() :
                        row.getCell('D').value);
                }
                if (rowNumber === 2) {
                    headers.firstHeader.push((typeof row.getCell('N').value === 'string') ?
                        row.getCell('N').value.trim() :
                        row.getCell('N').value);
                }
                if (rowNumber === 3) {
                    rowNumberHeader = rowNumber;
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim().replace(/\n/g, ' ') : cell.value.replace(/\n/g, ' ');
                        if (headers.secondHeader.indexOf(currentCellValue) < 0) {
                            headers.secondHeader.push(currentCellValue);
                        }
                    });
                }
                if (rowNumber > rowNumberHeader && !row.hidden) {
                    const contrat = getContratSMATISMCMS(row);
                    // if (smatisAxiom) {
                    //     contrat = getContratSMATIS(row);
                    // }

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

    ocr = { headers, allContratsPerCourtier, smatisVersion: null, executionTime: 0, executionTimeMS: 0 };
    // if (smatisAxiom) {
    //     ocr.smatisVersion = 'smatisAxiom';
    // }
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log('FIN TRAITEMENT SMATIS MCMS');
    return ocr;
};

const getContratSMATISMCMS = (row) => {
    const contrat = {
        debutPeriodeCotisation: (typeof row.getCell('A').value === 'string') ?
            row.getCell('A').value.trim() :
            (row.getCell('A').value !== null) ? new Date(0, 0, row.getCell('A').value, 0, 0, 0) : '',
        finDePeriodeCotisation: (typeof row.getCell('B').value === 'string') ?
            row.getCell('B').value.trim() :
            (row.getCell('B').value !== null) ? new Date(0, 0, row.getCell('B').value, 0, 0, 0) : '',
        nomGarantie: (typeof row.getCell('C').value === 'string') ?
            row.getCell('C').value.trim() :
            row.getCell('C').value,
        souscripteurContratGroupe: (typeof row.getCell('D').value === 'string') ?
            row.getCell('D').value.trim() :
            row.getCell('D').value,
        numPayeur: (typeof row.getCell('E').value === 'string') ?
            row.getCell('E').value.trim() :
            row.getCell('E').value,
        nomPayeur: (typeof row.getCell('F').value === 'string') ?
            row.getCell('F').value.trim() :
            row.getCell('F').value,
        codeCourtier: (typeof row.getCell('G').value === 'string') ?
            row.getCell('G').value.trim() :
            row.getCell('G').value,
        nomCourtier: (typeof row.getCell('H').value === 'string') ?
            row.getCell('H').value.trim() :
            row.getCell('H').value,
        numContratGroupe: (typeof row.getCell('I').value === 'string') ?
            row.getCell('I').value.trim() :
            row.getCell('I').value,
        dateDebutContratAdhesion: (typeof row.getCell('J').value === 'string') ?
            row.getCell('J').value.trim() :
            row.getCell('J').value,
        statusContratAdhesion: (typeof row.getCell('K').value === 'string') ?
            row.getCell('K').value.trim() :
            (row.getCell('K').value !== null) ? new Date(0, 0, row.getCell('N').value, 0, 0, 0) : '',
        dateFinContratAdhesion: (typeof row.getCell('L').value === 'string') ?
            row.getCell('L').value.trim() :
            (row.getCell('L').value !== null) ? new Date(0, 0, row.getCell('L').value, 0, 0, 0) : '',
        etapeImpaye: (typeof row.getCell('M').value === 'string') ?
            row.getCell('M').value.trim() :
            row.getCell('M').value,
        periodiciteCotisation: (typeof row.getCell('N').value === 'string') ?
            row.getCell('N').value.trim() :
            row.getCell('N').value,
        cotisationPayeePeriodeTTC: (typeof row.getCell('O').value === 'string') ?
            row.getCell('O').value.trim() :
            row.getCell('O').value,
        cotisationPayeePeriodeHT: (typeof row.getCell('P').value === 'string') ?
            row.getCell('P').value.trim() :
            row.getCell('P').value,
        taux: (typeof row.getCell('Q').value === 'string') ?
            row.getCell('Q').value.trim() :
            row.getCell('Q').value,
        typeCommission: (typeof row.getCell('R').value === 'string') ?
            row.getCell('R').value.trim() :
            row.getCell('R').value,
        montantCommission: (typeof row.getCell('S').value === 'string') ?
            row.getCell('S').value.trim() :
            row.getCell('S').value,
        courtier: (typeof row.getCell('T').value === 'string') ?
            row.getCell('T').value.trim() :
            row.getCell('T').value,
        fondateur: (typeof row.getCell('U').value === 'string') ?
            row.getCell('U').value.trim() :
            row.getCell('U').value,
        sogeas: (typeof row.getCell('V').value === 'string') ?
            row.getCell('V').value.trim() :
            row.getCell('V').value,
        procedure: (typeof row.getCell('W').value === 'string') ?
            row.getCell('W').value.trim() :
            row.getCell('W').value
    };
    return contrat;
};
