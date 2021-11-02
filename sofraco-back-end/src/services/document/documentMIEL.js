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
    parentPort.postMessage({ miel: workerData });
}

exports.readExcelMIEL = async (file) => {};

exports.readExcelMIELMCMS = async (file) => {
    console.log('DEBUT TRAITEMENT MIEL MCMS');
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
    let ocr = { headers: [], allContratsPerCourtier: [], mielVersion: null, executionTime: 0 };
    let mielCreasio, mielV1, mielV2, mielV3, mielV4 = false;
    switch (version) {
        case '0':
            mielCreasio = true;
            break;
        case '01':
            mielV1 = true;
            break;
        case '02':
            mielV2 = true;
            break;
        case '03':
            mielV3 = true;
            break;
        case '04':
            mielV4 = true;
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
                    if (mielCreasio) {
                        contrat = getContratMIELCREASIO(row);
                    }
                    if (mielV1) {
                        contrat = getContratMIELV1(row);
                    }
                    if (mielV2) {
                        contrat = getContratMIELV2(row);
                    }
                    if (mielV3) {
                        contrat = getContratMIELV3(row);
                    }
                    if (mielV4) {
                        contrat = getContratMIELV4(row);
                    }

                    allContrats.push(contrat);
                }
            })
        }
    });

    const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'codeApporteurAffaire');

    ocr = { headers, allContratsPerCourtier, executionTime: 0, executionTimeMS: 0 };
    if (mielCreasio) {
        ocr.mielVersion = 'mielCreasio';
    }
    if (mielV1) {
        ocr.mielVersion = 'mielV1';
    }
    if (mielV2) {
        ocr.mielVersion = 'mielV2';
    }
    if (mielV3) {
        ocr.mielVersion = 'mielV3';
    }
    if (mielV4) {
        ocr.mielVersion = 'mielV4';
    }
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log('FIN TRAITEMENT MIEL MCMS');
    return ocr;
};

const getContratMIELCREASIO = (row) => {
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
    return contrat;
};

const getContratMIELV1 = (row) => {
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
            row.getCell('V').value,
        courtier: (typeof row.getCell('W').value === 'string') ?
            row.getCell('W').value.trim() :
            row.getCell('W').value,
        fondateur: (typeof row.getCell('X').value === 'string') ?
            row.getCell('X').value.trim() :
            row.getCell('X').value
    };
    return contrat;
};

const getContratMIELV2 = (row) => {
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
    return contrat;
};

const getContratMIELV3 = (row) => {
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
        dateDebutContrat: (typeof row.getCell('E').value === 'string') ?
            row.getCell('E').value.trim() :
            (row.getCell('E').value !== null) ? new Date(0, 0, row.getCell('E').value, 0, 0, 0) : '',
        nom: (typeof row.getCell('F').value === 'string') ?
            row.getCell('F').value.trim() :
            row.getCell('F').value,
        prenom: (typeof row.getCell('G').value === 'string') ?
            row.getCell('G').value.trim() :
            row.getCell('G').value,
        codePostal: (typeof row.getCell('H').value === 'string') ?
            row.getCell('H').value.trim() :
            row.getCell('H').value,
        ville: (typeof row.getCell('I').value === 'string') ?
            row.getCell('I').value.trim() :
            row.getCell('I').value,
        codeProduit: (typeof row.getCell('J').value === 'string') ?
            row.getCell('J').value.trim() :
            row.getCell('J').value,
        nomProduit: (typeof row.getCell('K').value === 'string') ?
            row.getCell('K').value.trim() :
            row.getCell('K').value,
        codeContrat: (typeof row.getCell('L').value === 'string') ?
            row.getCell('L').value.trim() :
            row.getCell('L').value,
        nomContrat: (typeof row.getCell('M').value === 'string') ?
            row.getCell('M').value.trim() :
            row.getCell('M').value,
        dateDebutEcheance: (typeof row.getCell('N').value === 'string') ?
            row.getCell('N').value.trim() :
            (row.getCell('N').value !== null) ? new Date(0, 0, row.getCell('N').value, 0, 0, 0) : '',
        dateFinEcheance: (typeof row.getCell('O').value === 'string') ?
            row.getCell('O').value.trim() :
            (row.getCell('O').value !== null) ? new Date(0, 0, row.getCell('O').value, 0, 0, 0) : '',
        montantTTCEcheance: (typeof row.getCell('P').value === 'string') ?
            row.getCell('P').value.trim() :
            row.getCell('P').value,
        montantHTEcheance: (typeof row.getCell('Q').value === 'string') ?
            row.getCell('Q').value.trim() :
            row.getCell('Q').value,
        codeGarantieTechnique: (typeof row.getCell('R').value === 'string') ?
            row.getCell('R').value.trim() :
            row.getCell('R').value,
        nomGarantieTechnique: (typeof row.getCell('S').value === 'string') ?
            row.getCell('S').value.trim() :
            row.getCell('S').value !== null,
        baseCommisionnement: (typeof row.getCell('T').value === 'string') ?
            row.getCell('T').value.trim() :
            row.getCell('T').value,
        tauxCommission: (typeof row.getCell('U').value === 'string') ?
            row.getCell('U').value.trim() :
            row.getCell('U').value,
        montantCommissions: (typeof row.getCell('V').value === 'string') ?
            row.getCell('V').value.trim() :
            row.getCell('V').value,
        bordereauPaiementCommissionsInitiales: (typeof row.getCell('W').value === 'string') ?
            row.getCell('W').value.trim() :
            row.getCell('W').value
    };
    return contrat;
};

const getContratMIELV4 = (row) => {
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
            row.getCell('V').value,
        courtier: (typeof row.getCell('W').value === 'string') ?
            row.getCell('W').value.trim() :
            row.getCell('W').value,
        fondateur: (typeof row.getCell('X').value === 'string') ?
            row.getCell('X').value.trim() :
            row.getCell('X').value,
        mielillon: (typeof row.getCell('Y').value === 'string') ?
            row.getCell('Y').value.trim() :
            row.getCell('Y').value,
        sofracoExpertises: (typeof row.getCell('Z').value === 'string') ?
            row.getCell('Z').value.trim() :
            row.getCell('Z').value,
        budget: (typeof row.getCell('AA').value === 'string') ?
            row.getCell('AA').value.trim() :
            row.getCell('AA').value,
    };
    return contrat;
};