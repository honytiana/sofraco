const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const time = require('../time/time');
const fileService = require('./files');

exports.readExcelMIELCREASIO = async (file) => {
    console.log('DEBUT TRAITEMENT MIEL CREASIO');
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
                        codeApporteurCommissionne: (typeof row.getCell('A').value === 'string') ?
                            row.getCell('A').value.trim() :
                            row.getCell('A').value,
                        codeApporteurAffaire: (typeof row.getCell('B').value === 'string') ?
                            row.getCell('B').value.trim() :
                            row.getCell('B').value,
                        nomApporteurAffaire: (typeof row.getCell('C').value === 'string') ?
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
                        codePostal: (typeof row.getCell('G').value === 'string') ?
                            row.getCell('G').value.trim() :
                            row.getCell('G').value,
                        ville: (typeof row.getCell('H').value === 'string') ?
                            row.getCell('H').value.trim() :
                            row.getCell('H').value,
                        codeProduit: (typeof row.getCell('I').value === 'string') ?
                            row.getCell('I').value.trim() :
                            row.getCell('I').value,
                        nomProduit: (typeof row.getCell('J').value === 'string') ?
                            row.getCell('J').value.trim() :
                            row.getCell('J').value,
                        codeContrat: (typeof row.getCell('K').value === 'string') ?
                            row.getCell('K').value.trim() :
                            row.getCell('K').value,
                        nomContrat: (typeof row.getCell('L').value === 'string') ?
                            row.getCell('L').value.trim() :
                            row.getCell('L').value,
                        dateDebutEcheance: (typeof row.getCell('M').value === 'string') ?
                            row.getCell('M').value.trim() :
                            (row.getCell('M').value !== null) ? new Date(0, 0, row.getCell('M').value, 0, 0, 0) : '',
                        dateFinEcheance: (typeof row.getCell('N').value === 'string') ?
                            row.getCell('N').value.trim() :
                            (row.getCell('N').value !== null) ? new Date(0, 0, row.getCell('N').value, 0, 0, 0) : '',
                        montantTTCEcheance: (typeof row.getCell('O').value === 'string') ?
                            row.getCell('O').value.trim() :
                            row.getCell('O').value,
                        montantHTEcheance: (typeof row.getCell('P').value === 'string') ?
                            row.getCell('P').value.trim() :
                            row.getCell('P').value,
                        codeGarantieTechnique: (typeof row.getCell('Q').value === 'string') ?
                            row.getCell('Q').value.trim() :
                            row.getCell('Q').value,
                        nomGarantieTechnique: (typeof row.getCell('R').value === 'string') ?
                            row.getCell('R').value.trim() :
                            row.getCell('R').value !== null,
                        baseCommisionnement: (typeof row.getCell('S').value === 'string') ?
                            row.getCell('S').value.trim() :
                            row.getCell('S').value,
                        tauxCommission: (typeof row.getCell('T').value === 'string') ?
                            row.getCell('T').value.trim() :
                            row.getCell('T').value,
                        montantCommissions: (typeof row.getCell('U').value === 'string') ?
                            row.getCell('U').value.trim() :
                            row.getCell('U').value,
                        bordereauPaiementCommissionsInitiales: (typeof row.getCell('V').value === 'string') ?
                            row.getCell('V').value.trim() :
                            row.getCell('V').value
                    };
                    allContrats.push(contrat);
                }
            })
        }
    });

    let allContratsPerCourtier = [];
    let courtiers = [];
    allContrats.forEach((element, index) => {
        if (courtiers.indexOf(element.codeApporteurAffaire) < 0) {
            courtiers.push(element.codeApporteurAffaire);
        }
    })
    for (let courtier of courtiers) {
        let contratCourtier = { courtier: '', contrats: [] };
        allContrats.forEach((element, index) => {
            contratCourtier.courtier = courtier;
            if (element.codeApporteurAffaire === contratCourtier.courtier) {
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
    console.log('FIN TRAITEMENT MIEL CREASIO');
    return ocr;
};

exports.readExcelMIELMCMS = async (file) => {
    console.log('DEBUT TRAITEMENT MIEL MCMS');
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
    let mielMCMSV1;
    let mielMCMSV2;
    let mielMCMSV3;
    let mielMCMSV4;
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
                    let contrat;
                    if (mielMCMSV1) {
                        contrat = {
                            codeApporteurCommissionne: (typeof row.getCell('A').value === 'string') ?
                                row.getCell('A').value.trim() :
                                row.getCell('A').value,
                            codeApporteurAffaire: (typeof row.getCell('B').value === 'string') ?
                                row.getCell('B').value.trim() :
                                row.getCell('B').value,
                            nomApporteurAffaire: (typeof row.getCell('C').value === 'string') ?
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
                            codePostal: (typeof row.getCell('G').value === 'string') ?
                                row.getCell('G').value.trim() :
                                row.getCell('G').value,
                            ville: (typeof row.getCell('H').value === 'string') ?
                                row.getCell('H').value.trim() :
                                row.getCell('H').value,
                            codeProduit: (typeof row.getCell('I').value === 'string') ?
                                row.getCell('I').value.trim() :
                                row.getCell('I').value,
                            nomProduit: (typeof row.getCell('J').value === 'string') ?
                                row.getCell('J').value.trim() :
                                row.getCell('J').value,
                            codeContrat: (typeof row.getCell('K').value === 'string') ?
                                row.getCell('K').value.trim() :
                                row.getCell('K').value,
                            nomContrat: (typeof row.getCell('L').value === 'string') ?
                                row.getCell('L').value.trim() :
                                row.getCell('L').value,
                            dateDebutEcheance: (typeof row.getCell('M').value === 'string') ?
                                row.getCell('M').value.trim() :
                                (row.getCell('M').value !== null) ? new Date(0, 0, row.getCell('M').value, 0, 0, 0) : '',
                            dateFinEcheance: (typeof row.getCell('N').value === 'string') ?
                                row.getCell('N').value.trim() :
                                (row.getCell('N').value !== null) ? new Date(0, 0, row.getCell('N').value, 0, 0, 0) : '',
                            montantTTCEcheance: (typeof row.getCell('O').value === 'string') ?
                                row.getCell('O').value.trim() :
                                row.getCell('O').value,
                            montantHTEcheance: (typeof row.getCell('P').value === 'string') ?
                                row.getCell('P').value.trim() :
                                row.getCell('P').value,
                            codeGarantieTechnique: (typeof row.getCell('Q').value === 'string') ?
                                row.getCell('Q').value.trim() :
                                row.getCell('Q').value,
                            nomGarantieTechnique: (typeof row.getCell('R').value === 'string') ?
                                row.getCell('R').value.trim() :
                                row.getCell('R').value !== null,
                            baseCommisionnement: (typeof row.getCell('S').value === 'string') ?
                                row.getCell('S').value.trim() :
                                row.getCell('S').value,
                            tauxCommission: (typeof row.getCell('T').value === 'string') ?
                                row.getCell('T').value.trim() :
                                row.getCell('T').value,
                            montantCommissions: (typeof row.getCell('U').value === 'string') ?
                                row.getCell('U').value.trim() :
                                row.getCell('U').value,
                            bordereauPaiementCommissionsInitiales: (typeof row.getCell('V').value === 'string') ?
                                row.getCell('V').value.trim() :
                                row.getCell('V').value,
                            courtier: (typeof row.getCell('W').value === 'string') ?
                                row.getCell('W').value.trim() :
                                row.getCell('W').value,
                            fondateur: (typeof row.getCell('X').value === 'string') ?
                                row.getCell('X').value.trim() :
                                row.getCell('X').value
                        };
                    }
                    if (mielMCMSV2) {
                        contrat = {
                            codeApporteurCommissionne: (typeof row.getCell('A').value === 'string') ?
                                row.getCell('A').value.trim() :
                                row.getCell('A').value,
                            codeApporteurAffaire: (typeof row.getCell('B').value === 'string') ?
                                row.getCell('B').value.trim() :
                                row.getCell('B').value,
                            nomApporteurAffaire: (typeof row.getCell('C').value === 'string') ?
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
                            codePostal: (typeof row.getCell('G').value === 'string') ?
                                row.getCell('G').value.trim() :
                                row.getCell('G').value,
                            ville: (typeof row.getCell('H').value === 'string') ?
                                row.getCell('H').value.trim() :
                                row.getCell('H').value,
                            codeProduit: (typeof row.getCell('I').value === 'string') ?
                                row.getCell('I').value.trim() :
                                row.getCell('I').value,
                            nomProduit: (typeof row.getCell('J').value === 'string') ?
                                row.getCell('J').value.trim() :
                                row.getCell('J').value,
                            codeContrat: (typeof row.getCell('K').value === 'string') ?
                                row.getCell('K').value.trim() :
                                row.getCell('K').value,
                            nomContrat: (typeof row.getCell('L').value === 'string') ?
                                row.getCell('L').value.trim() :
                                row.getCell('L').value,
                            dateDebutEcheance: (typeof row.getCell('M').value === 'string') ?
                                row.getCell('M').value.trim() :
                                (row.getCell('M').value !== null) ? new Date(0, 0, row.getCell('M').value, 0, 0, 0) : '',
                            dateFinEcheance: (typeof row.getCell('N').value === 'string') ?
                                row.getCell('N').value.trim() :
                                (row.getCell('N').value !== null) ? new Date(0, 0, row.getCell('N').value, 0, 0, 0) : '',
                            montantTTCEcheance: (typeof row.getCell('O').value === 'string') ?
                                row.getCell('O').value.trim() :
                                row.getCell('O').value,
                            montantHTEcheance: (typeof row.getCell('P').value === 'string') ?
                                row.getCell('P').value.trim() :
                                row.getCell('P').value,
                            codeGarantieTechnique: (typeof row.getCell('Q').value === 'string') ?
                                row.getCell('Q').value.trim() :
                                row.getCell('Q').value,
                            nomGarantieTechnique: (typeof row.getCell('R').value === 'string') ?
                                row.getCell('R').value.trim() :
                                row.getCell('R').value !== null,
                            baseCommisionnement: (typeof row.getCell('S').value === 'string') ?
                                row.getCell('S').value.trim() :
                                row.getCell('S').value,
                            tauxCommission: (typeof row.getCell('T').value === 'string') ?
                                row.getCell('T').value.trim() :
                                row.getCell('T').value,
                            montantCommissions: (typeof row.getCell('U').value === 'string') ?
                                row.getCell('U').value.trim() :
                                row.getCell('U').value,
                            bordereauPaiementCommissionsInitiales: (typeof row.getCell('V').value === 'string') ?
                                row.getCell('V').value.trim() :
                                row.getCell('V').value,
                            courtier: (typeof row.getCell('W').value === 'string') ?
                                row.getCell('W').value.trim() :
                                row.getCell('W').value,
                            fondateur: (typeof row.getCell('X').value === 'string') ?
                                row.getCell('X').value.trim() :
                                row.getCell('X').value,
                            sogeas: (typeof row.getCell('Y').value === 'string') ?
                                row.getCell('Y').value.trim() :
                                row.getCell('Y').value,
                            procedure: (typeof row.getCell('Z').value === 'string') ?
                                row.getCell('Z').value.trim() :
                                row.getCell('Z').value
                        };
                    }
                    if (mielMCMSV3) {
                        contrat = {
                            codeApporteurCommissionne: (typeof row.getCell('A').value === 'string') ?
                                row.getCell('A').value.trim() :
                                row.getCell('A').value,
                            codeApporteurAffaire: (typeof row.getCell('B').value === 'string') ?
                                row.getCell('B').value.trim() :
                                row.getCell('B').value,
                            nomApporteurAffaire: (typeof row.getCell('C').value === 'string') ?
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
                            codePostal: (typeof row.getCell('G').value === 'string') ?
                                row.getCell('G').value.trim() :
                                row.getCell('G').value,
                            ville: (typeof row.getCell('H').value === 'string') ?
                                row.getCell('H').value.trim() :
                                row.getCell('H').value,
                            codeProduit: (typeof row.getCell('I').value === 'string') ?
                                row.getCell('I').value.trim() :
                                row.getCell('I').value,
                            nomProduit: (typeof row.getCell('J').value === 'string') ?
                                row.getCell('J').value.trim() :
                                row.getCell('J').value,
                            codeContrat: (typeof row.getCell('K').value === 'string') ?
                                row.getCell('K').value.trim() :
                                row.getCell('K').value,
                            nomContrat: (typeof row.getCell('L').value === 'string') ?
                                row.getCell('L').value.trim() :
                                row.getCell('L').value,
                            dateDebutEcheance: (typeof row.getCell('M').value === 'string') ?
                                row.getCell('M').value.trim() :
                                (row.getCell('M').value !== null) ? new Date(0, 0, row.getCell('M').value, 0, 0, 0) : '',
                            dateFinEcheance: (typeof row.getCell('N').value === 'string') ?
                                row.getCell('N').value.trim() :
                                (row.getCell('N').value !== null) ? new Date(0, 0, row.getCell('N').value, 0, 0, 0) : '',
                            montantTTCEcheance: (typeof row.getCell('O').value === 'string') ?
                                row.getCell('O').value.trim() :
                                row.getCell('O').value,
                            montantHTEcheance: (typeof row.getCell('P').value === 'string') ?
                                row.getCell('P').value.trim() :
                                row.getCell('P').value,
                            codeGarantieTechnique: (typeof row.getCell('Q').value === 'string') ?
                                row.getCell('Q').value.trim() :
                                row.getCell('Q').value,
                            nomGarantieTechnique: (typeof row.getCell('R').value === 'string') ?
                                row.getCell('R').value.trim() :
                                row.getCell('R').value !== null,
                            baseCommisionnement: (typeof row.getCell('S').value === 'string') ?
                                row.getCell('S').value.trim() :
                                row.getCell('S').value,
                            tauxCommission: (typeof row.getCell('T').value === 'string') ?
                                row.getCell('T').value.trim() :
                                row.getCell('T').value,
                            montantCommissions: (typeof row.getCell('U').value === 'string') ?
                                row.getCell('U').value.trim() :
                                row.getCell('U').value,
                            bordereauPaiementCommissionsInitiales: (typeof row.getCell('V').value === 'string') ?
                                row.getCell('V').value.trim() :
                                row.getCell('V').value,
                            courtier: (typeof row.getCell('W').value === 'string') ?
                                row.getCell('W').value.trim() :
                                row.getCell('W').value,
                            fondateur: (typeof row.getCell('X').value === 'string') ?
                                row.getCell('X').value.trim() :
                                row.getCell('X').value,
                            sogeas: (typeof row.getCell('Y').value === 'string') ?
                                row.getCell('Y').value.trim() :
                                row.getCell('Y').value,
                            sofraco: (typeof row.getCell('Z').value === 'string') ?
                                row.getCell('Z').value.trim() :
                                row.getCell('Z').value,
                            procedure: (typeof row.getCell('AA').value === 'string') ?
                                row.getCell('AA').value.trim() :
                                row.getCell('AA').value,
                            bordereauPaiementCommissionsInitiales: (typeof row.getCell('AB').value === 'string') ?
                                row.getCell('AB').value.trim() :
                                row.getCell('AB').value,
                            bordereauPaiementCommissionsInitiales: (typeof row.getCell('AC').value === 'string') ?
                                row.getCell('AC').value.trim() :
                                row.getCell('AC').value
                        };
                    }
                    if (mielMCMSV4) {
                        contrat = {
                            codeApporteurCommissionne: (typeof row.getCell('A').value === 'string') ?
                                row.getCell('A').value.trim() :
                                row.getCell('A').value,
                            codeApporteurAffaire: (typeof row.getCell('B').value === 'string') ?
                                row.getCell('B').value.trim() :
                                row.getCell('B').value,
                            nomApporteurAffaire: (typeof row.getCell('C').value === 'string') ?
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
                            codePostal: (typeof row.getCell('G').value === 'string') ?
                                row.getCell('G').value.trim() :
                                row.getCell('G').value,
                            ville: (typeof row.getCell('H').value === 'string') ?
                                row.getCell('H').value.trim() :
                                row.getCell('H').value,
                            codeProduit: (typeof row.getCell('I').value === 'string') ?
                                row.getCell('I').value.trim() :
                                row.getCell('I').value,
                            nomProduit: (typeof row.getCell('J').value === 'string') ?
                                row.getCell('J').value.trim() :
                                row.getCell('J').value,
                            codeContrat: (typeof row.getCell('K').value === 'string') ?
                                row.getCell('K').value.trim() :
                                row.getCell('K').value,
                            nomContrat: (typeof row.getCell('L').value === 'string') ?
                                row.getCell('L').value.trim() :
                                row.getCell('L').value,
                            dateDebutEcheance: (typeof row.getCell('M').value === 'string') ?
                                row.getCell('M').value.trim() :
                                (row.getCell('M').value !== null) ? new Date(0, 0, row.getCell('M').value, 0, 0, 0) : '',
                            dateFinEcheance: (typeof row.getCell('N').value === 'string') ?
                                row.getCell('N').value.trim() :
                                (row.getCell('N').value !== null) ? new Date(0, 0, row.getCell('N').value, 0, 0, 0) : '',
                            montantTTCEcheance: (typeof row.getCell('O').value === 'string') ?
                                row.getCell('O').value.trim() :
                                row.getCell('O').value,
                            montantHTEcheance: (typeof row.getCell('P').value === 'string') ?
                                row.getCell('P').value.trim() :
                                row.getCell('P').value,
                            codeGarantieTechnique: (typeof row.getCell('Q').value === 'string') ?
                                row.getCell('Q').value.trim() :
                                row.getCell('Q').value,
                            nomGarantieTechnique: (typeof row.getCell('R').value === 'string') ?
                                row.getCell('R').value.trim() :
                                row.getCell('R').value !== null,
                            baseCommisionnement: (typeof row.getCell('S').value === 'string') ?
                                row.getCell('S').value.trim() :
                                row.getCell('S').value,
                            tauxCommission: (typeof row.getCell('T').value === 'string') ?
                                row.getCell('T').value.trim() :
                                row.getCell('T').value,
                            montantCommissions: (typeof row.getCell('U').value === 'string') ?
                                row.getCell('U').value.trim() :
                                row.getCell('U').value,
                            bordereauPaiementCommissionsInitiales: (typeof row.getCell('V').value === 'string') ?
                                row.getCell('V').value.trim() :
                                row.getCell('V').value,
                            courtier: (typeof row.getCell('W').value === 'string') ?
                                row.getCell('W').value.trim() :
                                row.getCell('W').value,
                            fondateur: (typeof row.getCell('X').value === 'string') ?
                                row.getCell('X').value.trim() :
                                row.getCell('X').value,
                            pavillon: (typeof row.getCell('Y').value === 'string') ?
                                row.getCell('Y').value.trim() :
                                row.getCell('Y').value,
                            sofracoExpertises: (typeof row.getCell('Z').value === 'string') ?
                                row.getCell('Z').value.trim() :
                                row.getCell('Z').value,
                            budget: (typeof row.getCell('AA').value === 'string') ?
                                row.getCell('AA').value.trim() :
                                row.getCell('AA').value,
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
        if (courtiers.indexOf(element.codeApporteurAffaire) < 0) {
            courtiers.push(element.codeApporteurAffaire);
        }
    })
    for (let courtier of courtiers) {
        let contratCourtier = { courtier: '', contrats: [] };
        allContrats.forEach((element, index) => {
            contratCourtier.courtier = courtier;
            if (element.codeApporteurAffaire === contratCourtier.courtier) {
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
    console.log('FIN TRAITEMENT MIEL MCMS');
    return ocr;
};

