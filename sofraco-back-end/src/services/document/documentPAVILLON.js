const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const time = require('../utils/time');
const fileService = require('../utils/files');
const generals = require('../utils/generals');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ pavillon: workerData });
}

exports.readExcelPAVILLON = async (file) => {}

exports.readExcelPAVILLONMCMS = async (file) => {
    console.log('DEBUT TRAITEMENT PAVILLON MCMS');
    const excecutionStartTime = performance.now();
    let filePath = file;
    const fileName = fileService.getFileNameWithoutExtension(filePath);
    const version = fileName.replace(/(\d+).+/, '$1');
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
    let ocr = { headers: [], allContratsPerCourtier: [], pavVersion: null, executionTime: 0 };
    let pavActio, pavV1, pavV2, pavV3, pavV4, pavV5, pavV6, pavV7, pavV8 = false;
    switch (version) {
        case '0':
            pavActio = true;
            break;
        case '01':
            pavV1 = true;
            break;
        case '02':
            pavV2 = true;
            break;
        case '03':
            pavV3 = true;
            break;
        case '04':
            pavV4 = true;
            break;
        case '05':
            pavV5 = true;
            break;
        case '06':
            pavV6 = true;
            break;
        case '07':
            pavV7 = true;
            break;
        case '08':
            pavV8 = true;
            break;
    }
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
                if (rowNumber > rowNumberHeader && !row.hidden) {
                    let contrat;
                    if (pavActio) {
                        contrat = getContratPAVILLONACTIO(row);
                    }
                    if (pavV1) {
                        contrat = getContratPAVILLONV1(row);
                    }
                    if (pavV2) {
                        contrat = getContratPAVILLONV2(row);
                    }
                    if (pavV3) {
                        contrat = getContratPAVILLONV3(row);
                    }
                    if (pavV4) {
                        contrat = getContratPAVILLONV4(row);
                    }
                    if (pavV5) {
                        contrat = getContratPAVILLONV5(row);
                    }
                    if (pavV6) {
                        contrat = getContratPAVILLONV6(row);
                    }
                    if (pavV7) {
                        contrat = getContratPAVILLONV7(row);
                    }
                    if (pavV8) {
                        contrat = getContratPAVILLONV8(row);
                    }
                    allContrats.push(contrat);
                }
            })
        }
    });

    const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'codeCourtier');

    ocr = { headers, allContratsPerCourtier, pavVersion: null, executionTime: 0, executionTimeMS: 0 };
    if (pavActio) {
        ocr.pavVersion = 'pavActio';
    }
    if (pavV1) {
        ocr.pavVersion = 'pavV1';
    }
    if (pavV2) {
        ocr.pavVersion = 'pavV2';
    }
    if (pavV3) {
        ocr.pavVersion = 'pavV3';
    }
    if (pavV4) {
        ocr.pavVersion = 'pavV4';
    }
    if (pavV5) {
        ocr.pavVersion = 'pavV5';
    }
    if (pavV6) {
        ocr.pavVersion = 'pavV6';
    }
    if (pavV7) {
        ocr.pavVersion = 'pavV7';
    }
    if (pavV8) {
        ocr.pavVersion = 'pavV8';
    }
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log('FIN TRAITEMENT PAVILLON MCMS');
    return ocr;
};

const getContratPAVILLONACTIO = (row) => {
    const contrat = {
        dateGeneration: (typeof row.getCell('A').value === 'string') ?
            row.getCell('A').value.trim() :
            (row.getCell('A').value !== null) ? new Date(0, 0, row.getCell('A').value, 0, 0, 0) : '',
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
            (row.getCell('E').value !== null) ? new Date(0, 0, row.getCell('E').value, 0, 0, 0) : '',
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
            (row.getCell('I').value !== null) ? new Date(0, 0, row.getCell('I').value, 0, 0, 0) : '',
        debutPeriode: (typeof row.getCell('J').value === 'string') ?
            row.getCell('J').value.trim() :
            (row.getCell('J').value !== null) ? new Date(0, 0, row.getCell('J').value, 0, 0, 0) : '',
        finPeriode: (typeof row.getCell('K').value === 'string') ?
            row.getCell('K').value.trim() :
            (row.getCell('K').value !== null) ? new Date(0, 0, row.getCell('K').value, 0, 0, 0) : '',
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
    return contrat;
};

const getContratPAVILLONV1 = (row) => {
    const contrat = {
        dateGeneration: (typeof row.getCell('A').value === 'string') ?
            row.getCell('A').value.trim() :
            (row.getCell('A').value !== null) ? new Date(0, 0, row.getCell('A').value, 0, 0, 0) : '',
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
            (row.getCell('E').value !== null) ? new Date(0, 0, row.getCell('E').value, 0, 0, 0) : '',
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
            (row.getCell('I').value !== null) ? new Date(0, 0, row.getCell('I').value, 0, 0, 0) : '',
        debutPeriode: (typeof row.getCell('J').value === 'string') ?
            row.getCell('J').value.trim() :
            (row.getCell('J').value !== null) ? new Date(0, 0, row.getCell('J').value, 0, 0, 0) : '',
        finPeriode: (typeof row.getCell('K').value === 'string') ?
            row.getCell('K').value.trim() :
            (row.getCell('K').value !== null) ? new Date(0, 0, row.getCell('K').value, 0, 0, 0) : '',
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
    return contrat;
};

const getContratPAVILLONV2 = (row) => {
    const contrat = {
        dateGeneration: (typeof row.getCell('A').value === 'string') ?
            row.getCell('A').value.trim() :
            (row.getCell('A').value !== null) ? new Date(0, 0, row.getCell('A').value, 0, 0, 0) : '',
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
            (row.getCell('E').value !== null) ? new Date(0, 0, row.getCell('E').value, 0, 0, 0) : '',
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
            (row.getCell('I').value !== null) ? new Date(0, 0, row.getCell('I').value, 0, 0, 0) : '',
        debutPeriode: (typeof row.getCell('J').value === 'string') ?
            row.getCell('J').value.trim() :
            (row.getCell('J').value !== null) ? new Date(0, 0, row.getCell('J').value, 0, 0, 0) : '',
        finPeriode: (typeof row.getCell('K').value === 'string') ?
            row.getCell('K').value.trim() :
            (row.getCell('K').value !== null) ? new Date(0, 0, row.getCell('K').value, 0, 0, 0) : '',
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

const getContratPAVILLONV3 = (row) => {
    const contrat = {
        dateGeneration: (typeof row.getCell('A').value === 'string') ?
            row.getCell('A').value.trim() :
            (row.getCell('A').value !== null) ? new Date(0, 0, row.getCell('A').value, 0, 0, 0) : '',
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
            (row.getCell('E').value !== null) ? new Date(0, 0, row.getCell('E').value, 0, 0, 0) : '',
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
            (row.getCell('I').value !== null) ? new Date(0, 0, row.getCell('I').value, 0, 0, 0) : '',
        debutPeriode: (typeof row.getCell('J').value === 'string') ?
            row.getCell('J').value.trim() :
            (row.getCell('J').value !== null) ? new Date(0, 0, row.getCell('J').value, 0, 0, 0) : '',
        finPeriode: (typeof row.getCell('K').value === 'string') ?
            row.getCell('K').value.trim() :
            (row.getCell('K').value !== null) ? new Date(0, 0, row.getCell('K').value, 0, 0, 0) : '',
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
    return contrat;
};

const getContratPAVILLONV4 = (row) => {
    const contrat = {
        dateGeneration: (typeof row.getCell('A').value === 'string') ?
            row.getCell('A').value.trim() :
            (row.getCell('A').value !== null) ? new Date(0, 0, row.getCell('A').value, 0, 0, 0) : '',
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
            (row.getCell('E').value !== null) ? new Date(0, 0, row.getCell('E').value, 0, 0, 0) : '',
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
            (row.getCell('I').value !== null) ? new Date(0, 0, row.getCell('I').value, 0, 0, 0) : '',
        debutPeriode: (typeof row.getCell('J').value === 'string') ?
            row.getCell('J').value.trim() :
            (row.getCell('J').value !== null) ? new Date(0, 0, row.getCell('J').value, 0, 0, 0) : '',
        finPeriode: (typeof row.getCell('K').value === 'string') ?
            row.getCell('K').value.trim() :
            (row.getCell('K').value !== null) ? new Date(0, 0, row.getCell('K').value, 0, 0, 0) : '',
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
            row.getCell('U').value,
        pavillon: (typeof row.getCell('V').value === 'string') ?
            row.getCell('V').value.trim() :
            row.getCell('V').value,
        sofraco: (typeof row.getCell('W').value === 'string') ?
            row.getCell('W').value.trim() :
            row.getCell('W').value,
        sofracoExpertise: (typeof row.getCell('X').value === 'string') ?
            row.getCell('X').value.trim() :
            row.getCell('X').value,
        budget: (typeof row.getCell('Y').value === 'string') ?
            row.getCell('Y').value.trim() :
            row.getCell('Y').value
    };
    return contrat;
};

const getContratPAVILLONV5 = (row) => {
    const contrat = {
        dateGeneration: (typeof row.getCell('A').value === 'string') ?
            row.getCell('A').value.trim() :
            (row.getCell('A').value !== null) ? new Date(0, 0, row.getCell('A').value, 0, 0, 0) : '',
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
            (row.getCell('E').value !== null) ? new Date(0, 0, row.getCell('E').value, 0, 0, 0) : '',
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
            (row.getCell('I').value !== null) ? new Date(0, 0, row.getCell('I').value, 0, 0, 0) : '',
        debutPeriode: (typeof row.getCell('J').value === 'string') ?
            row.getCell('J').value.trim() :
            (row.getCell('J').value !== null) ? new Date(0, 0, row.getCell('J').value, 0, 0, 0) : '',
        finPeriode: (typeof row.getCell('K').value === 'string') ?
            row.getCell('K').value.trim() :
            (row.getCell('K').value !== null) ? new Date(0, 0, row.getCell('K').value, 0, 0, 0) : '',
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
            row.getCell('U').value,
        pavillon: (typeof row.getCell('V').value === 'string') ?
            row.getCell('V').value.trim() :
            row.getCell('V').value,
        sofraco: (typeof row.getCell('W').value === 'string') ?
            row.getCell('W').value.trim() :
            row.getCell('W').value,
        sofracoExpertise: (typeof row.getCell('X').value === 'string') ?
            row.getCell('X').value.trim() :
            row.getCell('X').value
    };
    return contrat;
};

const getContratPAVILLONV6 = (row) => {
    const contrat = {
        dateGeneration: (typeof row.getCell('A').value === 'string') ?
            row.getCell('A').value.trim() :
            (row.getCell('A').value !== null) ? new Date(0, 0, row.getCell('A').value, 0, 0, 0) : '',
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
            (row.getCell('E').value !== null) ? new Date(0, 0, row.getCell('E').value, 0, 0, 0) : '',
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
            (row.getCell('I').value !== null) ? new Date(0, 0, row.getCell('I').value, 0, 0, 0) : '',
        debutPeriode: (typeof row.getCell('J').value === 'string') ?
            row.getCell('J').value.trim() :
            (row.getCell('J').value !== null) ? new Date(0, 0, row.getCell('J').value, 0, 0, 0) : '',
        finPeriode: (typeof row.getCell('K').value === 'string') ?
            row.getCell('K').value.trim() :
            (row.getCell('K').value !== null) ? new Date(0, 0, row.getCell('K').value, 0, 0, 0) : '',
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
            row.getCell('U').value,
        sofracoExpertise: (typeof row.getCell('V').value === 'string') ?
            row.getCell('V').value.trim() :
            row.getCell('V').value
    };
    return contrat;
};

const getContratPAVILLONV7 = (row) => {
    const contrat = {
        dateGeneration: (typeof row.getCell('A').value === 'string') ?
            row.getCell('A').value.trim() :
            (row.getCell('A').value !== null) ? new Date(0, 0, row.getCell('A').value, 0, 0, 0) : '',
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
            (row.getCell('E').value !== null) ? new Date(0, 0, row.getCell('E').value, 0, 0, 0) : '',
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
            (row.getCell('I').value !== null) ? new Date(0, 0, row.getCell('I').value, 0, 0, 0) : '',
        debutPeriode: (typeof row.getCell('J').value === 'string') ?
            row.getCell('J').value.trim() :
            (row.getCell('J').value !== null) ? new Date(0, 0, row.getCell('J').value, 0, 0, 0) : '',
        finPeriode: (typeof row.getCell('K').value === 'string') ?
            row.getCell('K').value.trim() :
            (row.getCell('K').value !== null) ? new Date(0, 0, row.getCell('K').value, 0, 0, 0) : '',
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
            row.getCell('U').value,
        pavillon: (typeof row.getCell('V').value === 'string') ?
            row.getCell('V').value.trim() :
            row.getCell('V').value,
        sofraco: (typeof row.getCell('W').value === 'string') ?
            row.getCell('W').value.trim() :
            row.getCell('W').value,
        sofracoExpertise: (typeof row.getCell('X').value === 'string') ?
            row.getCell('X').value.trim() :
            row.getCell('X').value,
        budget: (typeof row.getCell('Y').value === 'string') ?
            row.getCell('Y').value.trim() :
            row.getCell('Y').value
    };
    return contrat;
};

const getContratPAVILLONV8 = (row) => {
    const contrat = {
        dateGeneration: (typeof row.getCell('A').value === 'string') ?
            row.getCell('A').value.trim() :
            (row.getCell('A').value !== null) ? new Date(0, 0, row.getCell('A').value, 0, 0, 0) : '',
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
            (row.getCell('E').value !== null) ? new Date(0, 0, row.getCell('E').value, 0, 0, 0) : '',
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
            (row.getCell('I').value !== null) ? new Date(0, 0, row.getCell('I').value, 0, 0, 0) : '',
        debutPeriode: (typeof row.getCell('J').value === 'string') ?
            row.getCell('J').value.trim() :
            (row.getCell('J').value !== null) ? new Date(0, 0, row.getCell('J').value, 0, 0, 0) : '',
        finPeriode: (typeof row.getCell('K').value === 'string') ?
            row.getCell('K').value.trim() :
            (row.getCell('K').value !== null) ? new Date(0, 0, row.getCell('K').value, 0, 0, 0) : '',
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
            row.getCell('U').value,
        pavillon: (typeof row.getCell('V').value === 'string') ?
            row.getCell('V').value.trim() :
            row.getCell('V').value,
        sofraco: (typeof row.getCell('W').value === 'string') ?
            row.getCell('W').value.trim() :
            row.getCell('W').value,
        sofracoExpertise: (typeof row.getCell('X').value === 'string') ?
            row.getCell('X').value.trim() :
            row.getCell('X').value,
    };
    return contrat;
};
