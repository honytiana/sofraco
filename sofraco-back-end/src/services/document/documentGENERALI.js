'use strict'
const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const time = require('../utils/time');
const fileService = require('../utils/files');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ generali: workerData });
}

exports.readExcelGENERALI = async (file) => {
    console.log('DEBUT TRAITEMENT GENERALI');
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
    const generalifile = fs.readFileSync(filePath);
    await workbook.xlsx.load(generalifile);
    const worksheets = workbook.worksheets;
    let headers = [];
    let allContrats = [];
    let ocr = { headers: null, allContratsPerCourtier: [], executionTime: 0 };
    for (let worksheet of worksheets) {
        if (worksheet.name === 'Commission_VIE_bordereau_de_com') {
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value;
                        headers.push(currentCellValue);
                    });
                }
                if (rowNumber > 1) {
                    const contrat = {
                        reference: (typeof row.getCell('A').value === 'string') ?
                            row.getCell('A').value.trim() :
                            row.getCell('A').value,
                        numeroReleve: (typeof row.getCell('B').value === 'string') ?
                            row.getCell('B').value.trim() :
                            row.getCell('B').value,
                        dateReleve: (typeof row.getCell('C').value === 'string') ?
                            row.getCell('C').value.trim() :
                            row.getCell('C').value,
                        codeRegroupementIntermediaire: (typeof row.getCell('D').value === 'string') ?
                            row.getCell('D').value.trim() :
                            row.getCell('D').value,
                        codeIntermediaire: (typeof row.getCell('E').value === 'string') ?
                            row.getCell('E').value.trim() :
                            row.getCell('E').value,
                        codePortefeuille: (typeof row.getCell('F').value === 'string') ?
                            row.getCell('F').value.trim() :
                            row.getCell('F').value,
                        libellePortefeuille: (typeof row.getCell('G').value === 'string') ?
                            row.getCell('G').value.trim() :
                            row.getCell('G').value,
                        codePortefeuilleExterne: (typeof row.getCell('H').value === 'string') ?
                            row.getCell('H').value.trim() :
                            row.getCell('H').value,
                        libelleFamilleCommerciale: (typeof row.getCell('I').value === 'string') ?
                            row.getCell('I').value.trim() :
                            row.getCell('I').value,
                        codeProduit: (typeof row.getCell('J').value === 'string') ?
                            row.getCell('J').value.trim() :
                            row.getCell('J').value,
                        libelleProduit: (typeof row.getCell('K').value === 'string') ?
                            row.getCell('K').value.trim() :
                            row.getCell('K').value,
                        natureOperation: (typeof row.getCell('L').value === 'string') ?
                            row.getCell('L').value.trim() :
                            row.getCell('L').value,
                        libelleTypePrime: (typeof row.getCell('M').value === 'string') ?
                            row.getCell('M').value.trim() :
                            row.getCell('M').value,
                        numeroContratOunumeroConvention: (typeof row.getCell('N').value === 'string') ?
                            row.getCell('N').value.trim() :
                            row.getCell('N').value,
                        raisonSociale: (typeof row.getCell('O').value === 'string') ?
                            row.getCell('O').value.trim() :
                            row.getCell('O').value,
                        numeroContratAffilie: (typeof row.getCell('P').value === 'string') ?
                            row.getCell('P').value.trim() :
                            row.getCell('P').value,
                        referenceExterne: (typeof row.getCell('Q').value === 'string') ?
                            row.getCell('Q').value.trim() :
                            row.getCell('Q').value,
                        numeroContractant: (typeof row.getCell('R').value === 'string') ?
                            row.getCell('R').value.trim() :
                            row.getCell('R').value,
                        nomContractant: (typeof row.getCell('S').value === 'string') ?
                            row.getCell('S').value.trim() :
                            row.getCell('S').value,
                        prenomContractant: (typeof row.getCell('T').value === 'string') ?
                            row.getCell('T').value.trim() :
                            row.getCell('T').value,
                        numeroAssure: (typeof row.getCell('U').value === 'string') ?
                            row.getCell('U').value.trim() :
                            row.getCell('U').value,
                        nomAssure: (typeof row.getCell('V').value === 'string') ?
                            row.getCell('V').value.trim() :
                            row.getCell('V').value,
                        prenomAssure: (typeof row.getCell('W').value === 'string') ?
                            row.getCell('W').value.trim() :
                            row.getCell('W').value,
                        dateOperation: (typeof row.getCell('X').value === 'string') ?
                            row.getCell('X').value.trim() :
                            row.getCell('X').value,
                        dateDebutPeriode: (typeof row.getCell('Y').value === 'string') ?
                            row.getCell('Y').value.trim() :
                            row.getCell('Y').value,
                        dateFinPeriode: (typeof row.getCell('Z').value === 'string') ?
                            row.getCell('Z').value.trim() :
                            row.getCell('Z').value,
                        libelleGarantie: (typeof row.getCell('AA').value === 'string') ?
                            row.getCell('AA').value.trim() :
                            row.getCell('AA').value,
                        natureSupport: (typeof row.getCell('AB').value === 'string') ?
                            row.getCell('AB').value.trim() :
                            row.getCell('AB').value,
                        codeISIN: (typeof row.getCell('AC').value === 'string') ?
                            row.getCell('AC').value.trim() :
                            row.getCell('AC').value,
                        libelleSupport: (typeof row.getCell('AD').value === 'string') ?
                            row.getCell('AD').value.trim() :
                            row.getCell('AD').value,
                        montantCotisationTTC: (typeof row.getCell('AE').value === 'string') ?
                            row.getCell('AE').value.trim() :
                            row.getCell('AE').value,
                        montantCotisationHTOuNetInvestiEnEpargne: (typeof row.getCell('AF').value === 'string') ?
                            row.getCell('AF').value.trim() :
                            row.getCell('AF').value,
                        assietteCasCommission: (typeof row.getCell('AG').value === 'string') ?
                            row.getCell('AG').value.trim() :
                            row.getCell('AG').value,
                        tauxCommission: (typeof row.getCell('AH').value === 'string') ?
                            row.getCell('AH').value.trim() :
                            row.getCell('AH').value,
                        typeMontant: (typeof row.getCell('AI').value === 'string') ?
                            row.getCell('AI').value.trim() :
                            row.getCell('AI').value,
                        natureCommission: (typeof row.getCell('AJ').value === 'string') ?
                            row.getCell('AJ').value.trim() :
                            row.getCell('AJ').value,
                        montantCommission: (typeof row.getCell('AK').value === 'string') ?
                            row.getCell('AK').value.trim() :
                            row.getCell('AK').value,
                        deviseMontant: (typeof row.getCell('AL').value === 'string') ?
                            row.getCell('AL').value.trim() :
                            row.getCell('AL').value,
                        qualificationCommission: (typeof row.getCell('AM').value === 'string') ?
                            row.getCell('AM').value.trim() :
                            row.getCell('AM').value,
                        conformiteAdministrative: (typeof row.getCell('AN').value === 'string') ?
                            row.getCell('AN').value.trim() :
                            row.getCell('AN').value,
                        transfertPortefeuille: (typeof row.getCell('AO').value === 'string') ?
                            row.getCell('AO').value.trim() :
                            row.getCell('AO').value,
                        codeOption: (typeof row.getCell('AP').value === 'string') ?
                            row.getCell('AP').value.trim() :
                            row.getCell('AP').value,
                        complementInformations: (typeof row.getCell('AQ').value === 'string') ?
                            row.getCell('AQ').value.trim() :
                            row.getCell('AQ').value,
                    };
                    allContrats.push(contrat);
                }
            })
        }
    }

    let allContratsPerCourtier = [];
    let courtiers = [];
    allContrats.forEach((element, index) => {
        const courtier = { code: element.codePortefeuille.result };
        if (!courtiers.some(c => { return c.code === courtier.code })) {
            courtiers.push(courtier);
        }
    })
    for (let courtier of courtiers) {
        let contratCourtier = {
            courtier: courtier,
            contrats: []
        };
        allContrats.forEach((element, index) => {
            if (element.codePortefeuille.result === contratCourtier.courtier.code) {
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
    console.log(ocr.allContratsPerCourtier.length);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    const dateOcr = new Date();
    const day = dateOcr.getDate();
    const month = dateOcr.getMonth() + 1;
    const year = dateOcr.getFullYear();
    console.log(fileName);
    const fileOCRPath = path.join(__dirname, '..', '..', '..', 'documents', 'ocr', `${fileName}_${day}_${month}_${year}.txt`);
    console.log(fileOCRPath);
    fs.writeFileSync(fileOCRPath, JSON.stringify(ocr));
    ocr.allContratsPerCourtier = fileOCRPath;
    console.log('FIN TRAITEMENT GENERALI');
    return ocr;
};

