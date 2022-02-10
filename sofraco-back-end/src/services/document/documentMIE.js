const { performance } = require('perf_hooks');
const time = require('../utils/time');
const fileService = require('../utils/files');
const excelFile = require('../utils/excelFile');
const generals = require('../utils/generals');
const errorHandler = require('../utils/errorHandler');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ mie: workerData });
}

exports.readExcelMIE = async (file) => { };

exports.readExcelMIEMCMS = async (file) => {
    console.log(`${new Date()} DEBUT TRAITEMENT MIE MCMS`);
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    const fileName = fileService.getFileNameWithoutExtension(file);
    const version = fileName.replace(/^(\d+).+/, '$1');
    let headers = [];
    let allContrats = [];
    let errors = [];
    let ocr = { headers: [], allContratsPerCourtier: [], mieVersion: null, executionTime: 0 };
    let mieAxiom, mieV1 = false;
    if (version.match('1')) {
        mieV1 = true;
        getContratMIEV1(worksheets, headers, allContrats, errors);
    }
    if (fileName.match('ACTIOM')) {
        mieAxiom = true;
        getContratMIEAXIOM(worksheets, headers, allContrats, errors);
    }

    const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'codeCourtier');

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
    console.log(`${new Date()} FIN TRAITEMENT MIE MCMS`);
    return ocr;
};

const getContratMIEAXIOM = (worksheets, headers, allContrats, errors) => {
    const arrReg = {
        dateComptable: /^DATE_COMPTABLE$/i,
        numAdherent: /^NUM_ADHERENT$/i,
        codeCourtier: /^CODE_COURTIER$/i,
        raisonSocialeApporteur: /^RAISON_SOCIALE_APPORTEUR$/i,
        nom: /^NOM$/i,
        prenom: /^PRENOM$/i,
        tel: /^TEL$/i,
        mail: /^MAIL$/i,
        codePostal: /^CODE_POSTAL$/i,
        ville: /^VILLE$/i,
        dateEffetContrat: /^DATE_EFFET_CONTRAT$/i,
        dateFinContrat: /^DATE_FIN_CONTRAT$/i,
        codeProduit: /^CODE_PRODUIT$/i,
        libelleProduit: /^LIBELLE_PRODUIT$/i,
        mtCommission: /^MT_COMMISSION$/i,
        totalEncaisse: /^TOTAL_ENCAISSE$/i,
        assieteSanteHTEncaisse: /^ASSIETTE_SANTE_HT_ENCAISSE$/i,
        taxesEncaisses: /^TAXES_ENCAISSÉS$/i,
        obsActionMutac: /^OBS ACTIOM MUTAC$/i,
        spheria: /^SPHERIA$/i,
        cotisationARepartir: /^Cotisation à répartir$/i,
        courtier: /^COURTIER$/i,
        fondateur: /^FONDATEUR$/i,
        pavillon: /^PAVILLON$/i,
        sofraco: /^SOFRACO$/i,
        sofracoExpertises: /^SOFRACO EXPERTISES$/i,
        resteAVerser: /^Reste à verser$/i,
    };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let indexesHeader = {
                dateComptable: null,
                codeCourtier: null,
                raisonSocialeApporteur: null,
                numAdherent: null,
                nom: null,
                prenom: null,
                tel: null,
                mail: null,
                codePostal: null,
                ville: null,
                dateEffetContrat: null,
                dateFinContrat: null,
                codeProduit: null,
                libelleProduit: null,
                mtCommission: null,
                totalEncaisse: null,
                assieteSanteHTEncaisse: null,
                taxesEncaisses: null,
                obsActionMutac: null,
                spheria: null,
                cotisationARepartir: null,
                courtier: null,
                fondateur: null,
                pavillon: null,
                sofraco: null,
                sofracoExpertises: null,
                resteAVerser: null,
            };
            let rowNumberHeader;
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    rowNumberHeader = rowNumber;
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim().replace(/\n/g, ' ') : cell.value.replace(/\n/g, ' ');
                        if (headers.indexOf(currentCellValue) < 0) {
                            headers.push(currentCellValue);
                            generals.setIndexHeaders(cell, colNumber, arrReg, indexesHeader);
                        }
                    });
                    for (let index in indexesHeader) {
                        if (indexesHeader[index] === null) {
                            errors.push(errorHandler.errorReadExcelMIEAXIOM(index));
                        }
                    }
                }
                if (rowNumber > rowNumberHeader && !row.hidden) {
                    const { contrat, error } = generals.createContratSimpleHeader(row, indexesHeader);
                    allContrats.push(contrat);
                }
            })
        }
    });
};

const getContratMIEV1 = (worksheets, headers, allContrats, errors) => {
    const arrReg = {
        dateComptable: /^DATE_COMPTABLE$/i,
        codeCourtier: /^CODE_COURTIER$/i,
        raisonSocialeApporteur: /RAISON_SOCIALE_APPORTEUR$/i,
        numAdherent: /^NUM_ADHERENT$/i,
        nom: /^NOM$/i,
        prenom: /^PRENOM$/i,
        tel: /^TEL$/i,
        mail: /^MAIL$/i,
        codePostal: /^CODE_POSTAL$/i,
        ville: /^VILLE$/i,
        dateEffetContrat: /^DATE_EFFET_CONTRAT$/i,
        dateFinContrat: /^DATE_FIN_CONTRAT$/i,
        codeProduit: /^CODE_PRODUIT$/i,
        libelleProduit: /^LIBELLE_PRODUIT$/i,
        mtCommission: /^MT_COMMISSION$/i,
        totalEncaisse: /^TOTAL_ENCAISSE$/i,
        assieteSanteHTEncaisse: /^ASSIETTE_SANTE_HT_ENCAISSE$/i,
        trfObs: /^TRF_OBS$/i,
        trfMat: /^TRF_MAT$/i,
        taxesEncaisses: /^TAXES_ENCAISSÉS$/i,
        courtier: /^COURTIER$/i,
        fondateur: /^FONDATEUR$/i,
        pavillon: /^PAVILLON$/i,
        sofraco: /^SOFRACO$/i,
        sofracoExpertises: /^SOFRACO EXPERTISES$/i,
        budget: /^BUDGET$/i,
    };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let indexesHeader = {
                dateComptable: null,
                codeCourtier: null,
                raisonSocialeApporteur: null,
                numAdherent: null,
                nom: null,
                prenom: null,
                tel: null,
                mail: null,
                codePostal: null,
                ville: null,
                dateEffetContrat: null,
                dateFinContrat: null,
                codeProduit: null,
                libelleProduit: null,
                mtCommission: null,
                totalEncaisse: null,
                assieteSanteHTEncaisse: null,
                trfObs: null,
                trfMat: null,
                taxesEncaisses: null,
                courtier: null,
                fondateur: null,
                pavillon: null,
                sofraco: null,
                sofracoExpertises: null,
                budget: null
            };
            let rowNumberHeader;
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    rowNumberHeader = rowNumber;
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim().replace(/\n/g, ' ') : cell.value.replace(/\n/g, ' ');
                        if (headers.indexOf(currentCellValue) < 0) {
                            headers.push(currentCellValue);
                            generals.setIndexHeaders(cell, colNumber, arrReg, indexesHeader);
                        }
                    });
                    for (let index in indexesHeader) {
                        if (indexesHeader[index] === null) {
                            errors.push(errorHandler.errorReadExcelMIEAV1(index));
                        }
                    }
                }
                if (rowNumber > rowNumberHeader && !row.hidden) {
                    const { contrat, error } = generals.createContratSimpleHeader(row, indexesHeader);
                    allContrats.push(contrat);
                }
            })
        }
    });
};
