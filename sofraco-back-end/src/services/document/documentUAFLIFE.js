const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const time = require('../utils/time');
const fileService = require('../utils/files');

exports.readExcelUAFLIFE = async (file) => {
    console.log('DEBUT TRAITEMENT UAF LIFE');
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
    const uaffile = fs.readFileSync(filePath);
    await workbook.xlsx.load(uaffile);
    const worksheets = workbook.worksheets;
    let headers = [];
    let allContrats = [];
    let detailsBordereau = [];
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    worksheets.forEach((worksheet, index) => {
        if (index === 0) {
            let rowNumberHeader;
            for (let i = 1; i <= 14; i++) {
                detailsBordereau.push(worksheet.getRow(i).getCell('A').value);
            }
            worksheet.eachRow((row, rowNumber) => {
                if (typeof row.getCell('A').value === 'string' && row.getCell('A').value.match(/Code intermediaire/i)) {
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
                        codeIntermediaireDestinataireReglements: (typeof row.getCell('A').value === 'string') ?
                            row.getCell('A').value.trim() :
                            row.getCell('A').value,
                        nomIntermediaireDestinataireReglements: (typeof row.getCell('B').value === 'string') ?
                            row.getCell('B').value.trim() :
                            row.getCell('B').value,
                        codeIntermediaireResponsableContrat: (typeof row.getCell('C').value === 'string') ?
                            row.getCell('C').value.trim() :
                            row.getCell('C').value,
                        nomIntermediaireResponsableContrat: (typeof row.getCell('D').value === 'string') ?
                            row.getCell('D').value.trim() :
                            row.getCell('D').value,
                        codeProduit: (typeof row.getCell('E').value === 'string') ?
                            row.getCell('E').value.trim() :
                            row.getCell('E').value,
                        libelleProduit: (typeof row.getCell('F').value === 'string') ?
                            row.getCell('F').value.trim() :
                            row.getCell('F').value,
                        numeroContrat: (typeof row.getCell('G').value === 'string') ?
                            row.getCell('G').value.trim() :
                            row.getCell('G').value,
                        nomSouscripteur: (typeof row.getCell('H').value === 'string') ?
                            row.getCell('H').value.trim() :
                            row.getCell('H').value,
                        prenomSouscripteur: (typeof row.getCell('I').value === 'string') ?
                            row.getCell('I').value.trim() :
                            row.getCell('I').value,
                        libelleProfil: (typeof row.getCell('J').value === 'string') ?
                            row.getCell('J').value.trim() :
                            row.getCell('J').value,
                        codeISIN: (typeof row.getCell('K').value === 'string') ?
                            row.getCell('K').value.trim() :
                            row.getCell('K').value,
                        libelleSupport: (typeof row.getCell('L').value === 'string') ?
                            row.getCell('L').value.trim() :
                            row.getCell('L').value,
                        natureCommissions: (typeof row.getCell('M').value === 'string') ?
                            row.getCell('M').value.trim() :
                            row.getCell('M').value,
                        typeCommissions: (typeof row.getCell('N').value === 'string') ?
                            row.getCell('N').value.trim() :
                            row.getCell('N').value,
                        libelleOperation: (typeof row.getCell('O').value === 'string') ?
                            row.getCell('O').value.trim() :
                            row.getCell('O').value,
                        numeroOperation: (typeof row.getCell('P').value === 'string') ?
                            row.getCell('P').value.trim() :
                            row.getCell('P').value,
                        dateCreationOperation: (typeof row.getCell('Q').value === 'string') ?
                            row.getCell('Q').value.trim() :
                            (row.getCell('Q').value !== null) ? new Date(0, 0, row.getCell('Q').value, 0, 0, 0) : '',
                        dateValidationOperation: (typeof row.getCell('R').value === 'string') ?
                            row.getCell('R').value.trim() :
                            (row.getCell('R').value !== null) ? new Date(0, 0, row.getCell('R').value, 0, 0, 0) : '',
                        dateValeurOperation: (typeof row.getCell('S').value === 'string') ?
                            row.getCell('S').value.trim() :
                            (row.getCell('S').value !== null) ? new Date(0, 0, row.getCell('S').value, 0, 0, 0) : '',
                        montantOperationTousSupports: (typeof row.getCell('T').value === 'string') ?
                            row.getCell('T').value.trim() :
                            row.getCell('T').value,
                        montantOperationSurSupport: (typeof row.getCell('U').value === 'string') ?
                            row.getCell('U').value.trim() :
                            row.getCell('U').value,
                        montantAssietteCommission: (typeof row.getCell('V').value === 'string') ?
                            row.getCell('V').value.trim() :
                            row.getCell('V').value,
                        tauxCommissionsIntermediaireTeteReseau: (typeof row.getCell('W').value === 'string') ?
                            row.getCell('W').value.trim() :
                            row.getCell('W').value,
                        montantCommissionIntermediaireTeteReseau: (typeof row.getCell('X').value === 'string') ?
                            row.getCell('X').value.trim() :
                            row.getCell('X').value,
                        tauxCommissionsIntermediaireResponsableContrat: (typeof row.getCell('Y').value === 'string') ?
                            row.getCell('Y').value.trim() :
                            row.getCell('Y').value,
                        montantCommissionsIntermediaireResponsableContrat: (typeof row.getCell('Z').value === 'string') ?
                            row.getCell('Z').value.trim() :
                            row.getCell('Z').value,
                        nbPartsAssietteCommission: (typeof row.getCell('AA').value === 'string') ?
                            row.getCell('AA').value.trim() :
                            row.getCell('AA').value,
                        VLUtilisePourCalculFrais: (typeof row.getCell('AB').value === 'string') ?
                            row.getCell('AB').value.trim() :
                            row.getCell('AB').value,
                        dateValeurVL: (typeof row.getCell('AC').value === 'string') ?
                            row.getCell('AC').value.trim() :
                            (row.getCell('AC').value !== null) ? new Date(0, 0, row.getCell('AC').value, 0, 0, 0) : '',
                        codeBordereau: (typeof row.getCell('AD').value === 'string') ?
                            row.getCell('AD').value.trim() :
                            row.getCell('AD').value,
                        dateGenerationBordereau: (typeof row.getCell('AE').value === 'string') ?
                            row.getCell('AE').value.trim() :
                            (row.getCell('AE').value !== null) ? new Date(0, 0, row.getCell('AE').value, 0, 0, 0) : ''
                    };
                    allContrats.push(contrat);
                }
            })
        }
    });

    let allContratsPerCourtier = [];
    let courtiers = [];
    allContrats.forEach((element, index) => {
        if (courtiers.indexOf(element.codeIntermediaireResponsableContrat) < 0) {
            courtiers.push(element.codeIntermediaireResponsableContrat);
        }
    })
    for (let courtier of courtiers) {
        let contratCourtier = { courtier: '', contrats: [] };
        allContrats.forEach((element, index) => {
            contratCourtier.courtier = courtier;
            if (element.codeIntermediaireResponsableContrat === contratCourtier.courtier) {
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
    console.log('FIN TRAITEMENT UAF LIFE');
    return ocr;
};

