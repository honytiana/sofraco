const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const time = require('../utils/time');
const fileService = require('../utils/files');

exports.readExcelMIE = async (file) => {};

exports.readExcelMIEMCMS = async (file) => {
    console.log('DEBUT TRAITEMENT MIE MCMS');
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
    const miefile = fs.readFileSync(filePath);
    await workbook.xlsx.load(miefile);
    const worksheets = workbook.worksheets;
    let headers = [];
    let allContrats = [];
    let ocr = { headers: [], allContratsPerCourtier: [], mieVersion: null, executionTime: 0 };
    let mieAxiom, mieV1 = false;
    switch (version) {
        case '01':
            mieAxiom = true;
            break;
        case '02':
            mieV1 = true;
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
                    if (mieAxiom) {
                        contrat = getContratMIEAXIOM(row);
                    }
                    if (mieV1) {
                        contrat = getContratMIEV1(row);
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

    ocr = { headers, allContratsPerCourtier, mieVersion: null, executionTime: 0, executionTimeMS: 0 };
    if (mieAxiom) {
        ocr.mieVersion = 'mieAxiom';
    }
    if (mieV1) {
        ocr.mieVersion = 'mieV1';
    }
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log('FIN TRAITEMENT MIE MCMS');
    return ocr;
};

const getContratMIEAXIOM = (row) => {
    const contrat = {
        dateComptable: (typeof row.getCell('A').value === 'string') ?
            row.getCell('A').value.trim() :
            (row.getCell('A').value !== null) ? new Date(0, 0, row.getCell('A').value, 0, 0, 0) : '',
        codeCourtier: (typeof row.getCell('B').value === 'string') ?
            row.getCell('B').value.trim() :
            row.getCell('B').value,
        raisonSocialeApporteur: (typeof row.getCell('C').value === 'string') ?
            row.getCell('C').value.trim() :
            row.getCell('C').value,
        numAdherent: (typeof row.getCell('D').value === 'string') ?
            row.getCell('D').value.trim() :
            row.getCell('D').value,
        nom: (typeof row.getCell('E').value === 'string') ?
            row.getCell('E').value.trim() :
            row.getCell('E').value,
        prenom: (typeof row.getCell('F').value === 'string') ?
            row.getCell('F').value.trim() :
            row.getCell('F').value,
        tel: (typeof row.getCell('G').value === 'string') ?
            row.getCell('G').value.trim() :
            row.getCell('G').value,
        mail: (typeof row.getCell('H').value === 'string') ?
            row.getCell('H').value.trim() :
            row.getCell('H').value,
        codePostal: (typeof row.getCell('I').value === 'string') ?
            row.getCell('I').value.trim() :
            row.getCell('I').value,
        ville: (typeof row.getCell('J').value === 'string') ?
            row.getCell('J').value.trim() :
            row.getCell('J').value,
        dateEffetContrat: (typeof row.getCell('K').value === 'string') ?
            row.getCell('K').value.trim() :
            (row.getCell('K').value !== null) ? new Date(0, 0, row.getCell('K').value, 0, 0, 0) : '',
        dateFinContrat: (typeof row.getCell('L').value === 'string') ?
            row.getCell('L').value.trim() :
            (row.getCell('L').value !== null) ? new Date(0, 0, row.getCell('L').value, 0, 0, 0) : '',
        codeProduit: (typeof row.getCell('M').value === 'string') ?
            row.getCell('M').value.trim() :
            row.getCell('M').value,
        libelleProduit: (typeof row.getCell('N').value === 'string') ?
            row.getCell('N').value.trim() :
            row.getCell('N').value,
        mtCommission: (typeof row.getCell('O').value === 'string') ?
            row.getCell('O').value.trim() :
            row.getCell('O').value,
        totalEncaisse: (typeof row.getCell('P').value === 'string') ?
            row.getCell('P').value.trim() :
            row.getCell('P').value,
        assieteSanteHTEncaisse: (typeof row.getCell('Q').value === 'string') ?
            row.getCell('Q').value.trim() :
            row.getCell('Q').value,
        taxesEncaisses: (typeof row.getCell('R').value === 'string') ?
            row.getCell('R').value.trim() :
            row.getCell('R').value,
        obsActionMutac: (typeof row.getCell('S').value === 'string') ?
            row.getCell('S').value.trim() :
            row.getCell('S').value,
        spheria: (typeof row.getCell('T').value === 'string') ?
            row.getCell('T').value.trim() :
            row.getCell('T').value,
        cotisationARepartir: (typeof row.getCell('U').value === 'string') ?
            row.getCell('U').value.trim() :
            row.getCell('U').value,
        courtier: (typeof row.getCell('V').value === 'string') ?
            row.getCell('V').value.trim() :
            row.getCell('V').value,
        fondateur: (typeof row.getCell('W').value === 'string') ?
            row.getCell('W').value.trim() :
            row.getCell('W').value,
        pavillon: (typeof row.getCell('X').value === 'string') ?
            row.getCell('X').value.trim() :
            row.getCell('X').value,
        sofraco: (typeof row.getCell('Y').value === 'string') ?
            row.getCell('Y').value.trim() :
            row.getCell('Y').value,
        sofracoExpertises: (typeof row.getCell('Z').value === 'string') ?
            row.getCell('Z').value.trim() :
            row.getCell('Z').value,
        resteAVerser: (typeof row.getCell('AA').value === 'string') ?
            row.getCell('AA').value.trim() :
            row.getCell('AA').value
    };
    return contrat;
};

const getContratMIEV1 = (row) => {
    const contrat = {
        dateComptable: (typeof row.getCell('A').value === 'string') ?
            row.getCell('A').value.trim() :
            (row.getCell('A').value !== null) ? new Date(0, 0, row.getCell('A').value, 0, 0, 0) : '',
        codeCourtier: (typeof row.getCell('B').value === 'string') ?
            row.getCell('B').value.trim() :
            row.getCell('B').value,
        raisonSocialeApporteur: (typeof row.getCell('C').value === 'string') ?
            row.getCell('C').value.trim() :
            row.getCell('C').value,
        numAdherent: (typeof row.getCell('D').value === 'string') ?
            row.getCell('D').value.trim() :
            row.getCell('D').value,
        nom: (typeof row.getCell('E').value === 'string') ?
            row.getCell('E').value.trim() :
            row.getCell('E').value,
        prenom: (typeof row.getCell('F').value === 'string') ?
            row.getCell('F').value.trim() :
            row.getCell('F').value,
        tel: (typeof row.getCell('G').value === 'string') ?
            row.getCell('G').value.trim() :
            row.getCell('G').value,
        mail: (typeof row.getCell('H').value === 'string') ?
            row.getCell('H').value.trim() :
            row.getCell('H').value,
        codePostal: (typeof row.getCell('I').value === 'string') ?
            row.getCell('I').value.trim() :
            row.getCell('I').value,
        ville: (typeof row.getCell('J').value === 'string') ?
            row.getCell('J').value.trim() :
            row.getCell('J').value,
        dateEffetContrat: (typeof row.getCell('K').value === 'string') ?
            row.getCell('K').value.trim() :
            (row.getCell('K').value !== null) ? new Date(0, 0, row.getCell('K').value, 0, 0, 0) : '',
        dateFinContrat: (typeof row.getCell('L').value === 'string') ?
            row.getCell('L').value.trim() :
            (row.getCell('L').value !== null) ? new Date(0, 0, row.getCell('L').value, 0, 0, 0) : '',
        codeProduit: (typeof row.getCell('M').value === 'string') ?
            row.getCell('M').value.trim() :
            row.getCell('M').value,
        libelleProduit: (typeof row.getCell('N').value === 'string') ?
            row.getCell('N').value.trim() :
            row.getCell('N').value,
        mtCommission: (typeof row.getCell('O').value === 'string') ?
            row.getCell('O').value.trim() :
            row.getCell('O').value,
        totalEncaisse: (typeof row.getCell('P').value === 'string') ?
            row.getCell('P').value.trim() :
            row.getCell('P').value,
        assieteSanteHTEncaisse: (typeof row.getCell('Q').value === 'string') ?
            row.getCell('Q').value.trim() :
            row.getCell('Q').value,
        taxesEncaisses: (typeof row.getCell('R').value === 'string') ?
            row.getCell('R').value.trim() :
            row.getCell('R').value,
        obsActionMutac: (typeof row.getCell('S').value === 'string') ?
            row.getCell('S').value.trim() :
            row.getCell('S').value,
        spheria: (typeof row.getCell('T').value === 'string') ?
            row.getCell('T').value.trim() :
            row.getCell('T').value,
        cotisationARepartir: (typeof row.getCell('U').value === 'string') ?
            row.getCell('U').value.trim() :
            row.getCell('U').value,
        courtier: (typeof row.getCell('V').value === 'string') ?
            row.getCell('V').value.trim() :
            row.getCell('V').value,
        fondateur: (typeof row.getCell('W').value === 'string') ?
            row.getCell('W').value.trim() :
            row.getCell('W').value,
        pavillon: (typeof row.getCell('X').value === 'string') ?
            row.getCell('X').value.trim() :
            row.getCell('X').value,
        sofraco: (typeof row.getCell('Y').value === 'string') ?
            row.getCell('Y').value.trim() :
            row.getCell('Y').value,
        sofracoExpertises: (typeof row.getCell('Z').value === 'string') ?
            row.getCell('Z').value.trim() :
            row.getCell('Z').value,
        resteAVerser: (typeof row.getCell('AA').value === 'string') ?
            row.getCell('AA').value.trim() :
            row.getCell('AA').value
    };
    return contrat;
};
