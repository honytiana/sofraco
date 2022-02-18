const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const time = require('../utils/time');
const fileService = require('../utils/files');
const excelFile = require('../utils/excelFile');
const generals = require('../utils/generals');
const errorHandler = require('../utils/errorHandler');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ pavillon: workerData });
}

exports.readExcelPAVILLON = async (file) => { }

exports.readExcelPAVILLONMCMS = async (file) => {
    console.log(`${new Date()} DEBUT TRAITEMENT PAVILLON MCMS`);
    const excecutionStartTime = performance.now();
    const fileName = fileService.getFileNameWithoutExtension(file);
    const version = fileName.replace(/.+(V\d+)/, '$1');
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    let headers = [];
    let allContrats = [];
    let errors = [];
    let ocr = { headers: [], allContratsPerCourtier: [], pavVersion: null, executionTime: 0 };
    let pavActio, pavV1, pavV2, pavV3, pavV4, pavV5, pavV6, pavV7, pavV8 = false;
    if (fileName.match('ACTIO')) {
        pavActio = true;
    }
    if (fileName.match('MEDOC')) {
        pavV6 = true;
    }
    if (fileName.match('22,5')) {
        pavV7 = true;
    }
    if (fileName.match('17,2')) {
        pavV8 = true;
    }
    switch (version) {
        case 'V1':
            pavV1 = true;
            break;
        case 'V2':
            pavV2 = true;
            break;
        case 'V3':
            pavV3 = true;
            break;
        case 'V4':
            pavV4 = true;
            break;
        case 'V5':
            pavV5 = true;
            break;
    }
    if (pavActio) {
        getContratPAVILLONACTIO(worksheets, headers, allContrats, errors);
    }
    if (pavV1) {
        getContratPAVILLONV1(worksheets, headers, allContrats, errors);
    }
    if (pavV2) {
        getContratPAVILLONV2(worksheets, headers, allContrats, errors);
    }
    if (pavV3) {
        getContratPAVILLONV3(worksheets, headers, allContrats, errors);
    }
    if (pavV4) {
        getContratPAVILLONV4(worksheets, headers, allContrats, errors);
    }
    if (pavV5) {
        getContratPAVILLONV5(worksheets, headers, allContrats, errors);
    }
    if (pavV6) {
        getContratPAVILLONV6(worksheets, headers, allContrats, errors);
    }
    if (pavV7) {
        getContratPAVILLONV7(worksheets, headers, allContrats, errors);
    }
    if (pavV8) {
        getContratPAVILLONV8(worksheets, headers, allContrats, errors);
    }

    const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'codeCourtier');

    ocr = { headers, allContratsPerCourtier, errors, pavVersion: null, executionTime: 0, executionTimeMS: 0 };
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
    console.log(`${new Date()} FIN TRAITEMENT PAVILLON MCMS`);
    return ocr;
};

const getContratPAVILLONACTIO = (worksheets, headers, allContrats, errors) => {
    const arrReg = {
        dateGeneration: /^\s*Date\s*génération\s*$/i,
        codeCompagnie: /^\s*Code\s*compagnie\s*$/i,
        codeCourtier: /^\s*Code\s*courtier\s*$/i,
        raisonSocialeApporteur: /^\s*Raison\s*Sociale\s*Apporteur\s*$/i,
        dateArrete: /^\s*Date\s*arrêté\s*$/i,
        identifiant: /^\s*Identifiant\s*$/i,
        codePostal: /^\s*Code\s*Postal\s*$/i,
        commune: /^\s*Commune\s*$/i,
        dateEffetContrat: /^\s*Date\s*d'effet\s*contrat\s*$/i,
        debutPeriode: /^\s*Début\s*période\s*$/i,
        finPeriode: /^\s*Fin\s*période\s*$/i,
        raisonSociale: /^\s*Nom\s*prénom\s*[/]\s*Raison\s*sociale\s*$/i,
        codeProduit: /^\s*Code\s*produit\s*$/i,
        nomProduit: /^\s*Nom\s*produit\s*$/i,
        emissionTTC: /^\s*Emission\s*TTC\s*$/i,
        reglementTTC: /^\s*Règlement\s*TTC\s*$/i,
        reglementHT: /^\s*Règlement\s*HT\s*$/i,
        taux: /^\s*Taux\s*$/i,
        montantPaiement: /^\s*Montant\s*paiement\s*$/i,
        courtier: /^\s*COURTIER\s*$/i,
        fondateur: /^\s*FONDATEURS*\s*$/i
    };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let indexesHeader = {
                dateGeneration: null,
                codeCompagnie: null,
                codeCourtier: null,
                raisonSocialeApporteur: null,
                dateArrete: null,
                identifiant: null,
                codePostal: null,
                commune: null,
                dateEffetContrat: null,
                debutPeriode: null,
                finPeriode: null,
                raisonSociale: null,
                codeProduit: null,
                nomProduit: null,
                emissionTTC: null,
                reglementTTC: null,
                reglementHT: null,
                taux: null,
                montantPaiement: null,
                courtier: null,
                fondateur: null
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
                            errors.push(errorHandler.errorReadExcelPAVILLONACTIO(index));
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

const getContratPAVILLONV1 = (worksheets, headers, allContrats, errors) => {
    const arrReg = {
        dateGeneration: /^\s*Date\s*génération\s*$/i,
        codeCompagnie: /^\s*Code\s*compagnie\s*$/i,
        codeCourtier: /^\s*Code\s*courtier\s*$/i,
        raisonSocialeApporteur: /^\s*Raison\s*Sociale\s*Apporteur\s*$/i,
        dateArrete: /^\s*Date\s*arrêté\s*$/i,
        identifiant: /^\s*Identifiant\s*$/i,
        codePostal: /^\s*Code\s*Postal\s*$/i,
        commune: /^\s*Commune\s*$/i,
        dateEffetContrat: /^\s*Date\s*d'effet\s*contrat\s*$/i,
        debutPeriode: /^\s*Début\s*période\s*$/i,
        finPeriode: /^\s*Fin\s*période\s*$/i,
        raisonSociale: /^\s*Nom\s*prénom\s*[/]\s*Raison\s*sociale\s*$/i,
        codeProduit: /^\s*Code\s*produit\s*$/i,
        nomProduit: /^\s*Nom\s*produit\s*$/i,
        emissionTTC: /^\s*Emission\s*TTC\s*$/i,
        reglementTTC: /^\s*Règlement\s*TTC\s*$/i,
        reglementHT: /^\s*Règlement\s*HT\s*$/i,
        taux: /^\s*Taux\s*$/i,
        montantPaiement: /^\s*Montant\s*paiement\s*$/i,
        courtier: /^\s*COURTIER\s*$/i,
        fondateur: /^\s*FONDATEURS*\s*$/i
    };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let indexesHeader = {
                dateGeneration: null,
                codeCompagnie: null,
                codeCourtier: null,
                raisonSocialeApporteur: null,
                dateArrete: null,
                identifiant: null,
                codePostal: null,
                commune: null,
                dateEffetContrat: null,
                debutPeriode: null,
                finPeriode: null,
                raisonSociale: null,
                codeProduit: null,
                nomProduit: null,
                emissionTTC: null,
                reglementTTC: null,
                reglementHT: null,
                taux: null,
                montantPaiement: null,
                courtier: null,
                fondateur: null
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
                            errors.push(errorHandler.errorReadExcelPAVILLONV1(index));
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

const getContratPAVILLONV2 = (worksheets, headers, allContrats, errors) => {
    const arrReg = {
        dateGeneration: /^\s*Date\s*génération\s*$/i,
        codeCompagnie: /^\s*Code\s*compagnie\s*$/i,
        codeCourtier: /^\s*Code\s*courtier\s*$/i,
        raisonSocialeApporteur: /^\s*Raison\s*Sociale\s*Apporteur\s*$/i,
        dateArrete: /^\s*Date\s*arrêté\s*$/i,
        identifiant: /^\s*Identifiant\s*$/i,
        codePostal: /^\s*Code\s*Postal\s*$/i,
        commune: /^\s*Commune\s*$/i,
        dateEffetContrat: /^\s*Date\s*d'effet\s*contrat\s*$/i,
        debutPeriode: /^\s*Début\s*période\s*$/i,
        finPeriode: /^\s*Fin\s*période\s*$/i,
        raisonSociale: /^\s*Nom\s*prénom\s*[/]\s*Raison\s*sociale\s*$/i,
        codeProduit: /^\s*Code\s*produit\s*$/i,
        nomProduit: /^\s*Nom\s*produit\s*$/i,
        emissionTTC: /^\s*Emission\s*TTC\s*$/i,
        reglementTTC: /^\s*Règlement\s*TTC\s*$/i,
        reglementHT: /^\s*Règlement\s*HT\s*$/i,
        taux: /^\s*Taux\s*$/i,
        montantPaiement: /^\s*Montant\s*paiement\s*$/i,
        courtier: /^\s*COURTIER\s*$/i,
        fondateur: /^\s*FONDATEURS*\s*$/i,
        sogeas: /^\s*SOGEAS\s*$/i,
        procedure: /^\s*PROCEDURE\s*$/i
    };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let indexesHeader = {
                dateGeneration: null,
                codeCompagnie: null,
                codeCourtier: null,
                raisonSocialeApporteur: null,
                dateArrete: null,
                identifiant: null,
                codePostal: null,
                commune: null,
                dateEffetContrat: null,
                debutPeriode: null,
                finPeriode: null,
                raisonSociale: null,
                codeProduit: null,
                nomProduit: null,
                emissionTTC: null,
                reglementTTC: null,
                reglementHT: null,
                taux: null,
                montantPaiement: null,
                courtier: null,
                fondateur: null,
                sogeas: null,
                procedure: null
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
                            errors.push(errorHandler.errorReadExcelPAVILLONV2(index));
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

const getContratPAVILLONV3 = (worksheets, headers, allContrats, errors) => {
    const arrReg = {
        dateGeneration: /^\s*Date\s*génération\s*$/i,
        codeCompagnie: /^\s*Code\s*compagnie\s*$/i,
        codeCourtier: /^\s*Code\s*courtier\s*$/i,
        raisonSocialeApporteur: /^\s*Raison\s*Sociale\s*Apporteur\s*$/i,
        dateArrete: /^\s*Date\s*arrêté\s*$/i,
        identifiant: /^\s*Identifiant\s*$/i,
        codePostal: /^\s*Code\s*Postal\s*$/i,
        commune: /^\s*Commune\s*$/i,
        dateEffetContrat: /^\s*Date\s*d'effet\s*contrat\s*$/i,
        debutPeriode: /^\s*Début\s*période\s*$/i,
        finPeriode: /^\s*Fin\s*période\s*$/i,
        raisonSociale: /^\s*Nom\s*prénom\s*[/]\s*Raison\s*sociale\s*$/i,
        codeProduit: /^\s*Code\s*produit\s*$/i,
        nomProduit: /^\s*Nom\s*produit\s*$/i,
        emissionTTC: /^\s*Emission\s*TTC\s*$/i,
        reglementTTC: /^\s*Règlement\s*TTC\s*$/i,
        reglementHT: /^\s*Règlement\s*HT\s*$/i,
        taux: /^\s*Taux\s*$/i,
        montantPaiement: /^\s*Montant\s*paiement\s*$/i,
        // courtier: /^\s*COURTIER\s*$/i,
        // fondateur: /^\s*FONDATEURS*\s*$/i
    };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let indexesHeader = {
                dateGeneration: null,
                codeCompagnie: null,
                codeCourtier: null,
                raisonSocialeApporteur: null,
                dateArrete: null,
                identifiant: null,
                codePostal: null,
                commune: null,
                dateEffetContrat: null,
                debutPeriode: null,
                finPeriode: null,
                raisonSociale: null,
                codeProduit: null,
                nomProduit: null,
                emissionTTC: null,
                reglementTTC: null,
                reglementHT: null,
                taux: null,
                montantPaiement: null,
                // courtier: null,
                // fondateur: null
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
                            errors.push(errorHandler.errorReadExcelPAVILLONV3(index));
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

const getContratPAVILLONV4 = (worksheets, headers, allContrats, errors) => {
    const arrReg = {
        dateGeneration: /^\s*Date\s*génération\s*$/i,
        codeCompagnie: /^\s*Code\s*compagnie\s*$/i,
        codeCourtier: /^\s*Code\s*courtier\s*$/i,
        raisonSocialeApporteur: /^\s*Raison\s*Sociale\s*Apporteur\s*$/i,
        dateArrete: /^\s*Date\s*arrêté\s*$/i,
        identifiant: /^\s*Identifiant\s*$/i,
        codePostal: /^\s*Code\s*Postal\s*$/i,
        commune: /^\s*Commune\s*$/i,
        dateEffetContrat: /^\s*Date\s*d'effet\s*contrat\s*$/i,
        debutPeriode: /^\s*Début\s*période\s*$/i,
        finPeriode: /^\s*Fin\s*période\s*$/i,
        raisonSociale: /^\s*Nom\s*prénom\s*[/]\s*Raison\s*sociale\s*$/i,
        codeProduit: /^\s*Code\s*produit\s*$/i,
        nomProduit: /^\s*Nom\s*produit\s*$/i,
        emissionTTC: /^\s*Emission\s*TTC\s*$/i,
        reglementTTC: /^\s*Règlement\s*TTC\s*$/i,
        reglementHT: /^\s*Règlement\s*HT\s*$/i,
        taux: /^\s*Taux\s*$/i,
        montantPaiement: /^\s*Montant\s*paiement\s*$/i,
        courtier: /^\s*COURTIER\s*$/i,
        fondateur: /^\s*FONDATEURS*\s*$/i,
        pavillon: /^\s*PAVILLON\s*$/i,
        sofraco: /^\s*SOFRACO\s*$/i,
        sofracoExpertise: /^\s*SOFRACO EXPERTISES\s*$/i,
        budget: /^\s*BUDGET\s*$/i
    };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let indexesHeader = {
                dateGeneration: null,
                codeCompagnie: null,
                codeCourtier: null,
                raisonSocialeApporteur: null,
                dateArrete: null,
                identifiant: null,
                codePostal: null,
                commune: null,
                dateEffetContrat: null,
                debutPeriode: null,
                finPeriode: null,
                raisonSociale: null,
                codeProduit: null,
                nomProduit: null,
                emissionTTC: null,
                reglementTTC: null,
                reglementHT: null,
                taux: null,
                montantPaiement: null,
                courtier: null,
                fondateur: null,
                pavillon: null,
                sofraco: null,
                sofracoExpertise: null,
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
                            errors.push(errorHandler.errorReadExcelPAVILLONV4(index));
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

const getContratPAVILLONV5 = (worksheets, headers, allContrats, errors) => {
    const arrReg = {
        dateGeneration: /^\s*Date\s*génération\s*$/i,
        codeCompagnie: /^\s*Code\s*compagnie\s*$/i,
        codeCourtier: /^\s*Code\s*courtier\s*$/i,
        raisonSocialeApporteur: /^\s*Raison\s*Sociale\s*Apporteur\s*$/i,
        dateArrete: /^\s*Date\s*arrêté\s*$/i,
        identifiant: /^\s*Identifiant\s*$/i,
        codePostal: /^\s*Code\s*Postal\s*$/i,
        commune: /^\s*Commune\s*$/i,
        dateEffetContrat: /^\s*Date\s*d'effet\s*contrat\s*$/i,
        debutPeriode: /^\s*Début\s*période\s*$/i,
        finPeriode: /^\s*Fin\s*période\s*$/i,
        raisonSociale: /^\s*Nom\s*prénom\s*[/]\s*Raison\s*sociale\s*$/i,
        codeProduit: /^\s*Code\s*produit\s*$/i,
        nomProduit: /^\s*Nom\s*produit\s*$/i,
        emissionTTC: /^\s*Emission\s*TTC\s*$/i,
        reglementTTC: /^\s*Règlement\s*TTC\s*$/i,
        reglementHT: /^\s*Règlement\s*HT\s*$/i,
        taux: /^\s*Taux\s*$/i,
        montantPaiement: /^\s*Montant\s*paiement\s*$/i,
        courtier: /^\s*COURTIER\s*$/i,
        fondateur: /^\s*FONDATEURS*\s*$/i,
        pavillon: /^\s*PAVILLON\s*$/i,
        sofraco: /^\s*SOFRACO\s*$/i,
        sofracoExpertise: /^\s*SOFRACO EXPERTISES\s*$/i
    };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let indexesHeader = {
                dateGeneration: null,
                codeCompagnie: null,
                codeCourtier: null,
                raisonSocialeApporteur: null,
                dateArrete: null,
                identifiant: null,
                codePostal: null,
                commune: null,
                dateEffetContrat: null,
                debutPeriode: null,
                finPeriode: null,
                raisonSociale: null,
                codeProduit: null,
                nomProduit: null,
                emissionTTC: null,
                reglementTTC: null,
                reglementHT: null,
                taux: null,
                montantPaiement: null,
                courtier: null,
                fondateur: null,
                pavillon: null,
                sofraco: null,
                sofracoExpertise: null
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
                            errors.push(errorHandler.errorReadExcelPAVILLONV5(index));
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

const getContratPAVILLONV6 = (worksheets, headers, allContrats, errors) => {
    const arrReg = {
        dateGeneration: /^\s*Date\s*génération\s*$/i,
        codeCompagnie: /^\s*Code\s*compagnie\s*$/i,
        codeCourtier: /^\s*Code\s*courtier\s*$/i,
        raisonSocialeApporteur: /^\s*Raison\s*Sociale\s*Apporteur\s*$/i,
        dateArrete: /^\s*Date\s*arrêté\s*$/i,
        identifiant: /^\s*Identifiant\s*$/i,
        codePostal: /^\s*Code\s*Postal\s*$/i,
        commune: /^\s*Commune\s*$/i,
        dateEffetContrat: /^\s*Date\s*d'effet\s*contrat\s*$/i,
        debutPeriode: /^\s*Début\s*période\s*$/i,
        finPeriode: /^\s*Fin\s*période\s*$/i,
        raisonSociale: /^\s*Nom\s*prénom\s*[/]\s*Raison\s*sociale\s*$/i,
        codeProduit: /^\s*Code\s*produit\s*$/i,
        nomProduit: /^\s*Nom\s*produit\s*$/i,
        emissionTTC: /^\s*Emission\s*TTC\s*$/i,
        reglementTTC: /^\s*Règlement\s*TTC\s*$/i,
        reglementHT: /^\s*Règlement\s*HT\s*$/i,
        taux: /^\s*Taux\s*$/i,
        montantPaiement: /^\s*Montant\s*paiement\s*$/i,
        courtier: /^\s*COURTIER\s*$/i,
        fondateur: /^\s*FONDATEURS*\s*$/i,
        sofracoExpertise: /^\s*SOFRACO EXPERTISES\s*$/i
    };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let indexesHeader = {
                dateGeneration: null,
                codeCompagnie: null,
                codeCourtier: null,
                raisonSocialeApporteur: null,
                dateArrete: null,
                identifiant: null,
                codePostal: null,
                commune: null,
                dateEffetContrat: null,
                debutPeriode: null,
                finPeriode: null,
                raisonSociale: null,
                codeProduit: null,
                nomProduit: null,
                emissionTTC: null,
                reglementTTC: null,
                reglementHT: null,
                taux: null,
                montantPaiement: null,
                courtier: null,
                fondateur: null,
                sofracoExpertise: null
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
                            errors.push(errorHandler.errorReadExcelPAVILLONV6(index));
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

const getContratPAVILLONV7 = (worksheets, headers, allContrats, errors) => {
    const arrReg = {
        dateGeneration: /^\s*Date\s*génération\s*$/i,
        codeCompagnie: /^\s*Code\s*compagnie\s*$/i,
        codeCourtier: /^\s*Code\s*courtier\s*$/i,
        raisonSocialeApporteur: /^\s*Raison\s*Sociale\s*Apporteur\s*$/i,
        dateArrete: /^\s*Date\s*arrêté\s*$/i,
        identifiant: /^\s*Identifiant\s*$/i,
        codePostal: /^\s*Code\s*Postal\s*$/i,
        commune: /^\s*Commune\s*$/i,
        dateEffetContrat: /^\s*Date\s*d'effet\s*contrat\s*$/i,
        debutPeriode: /^\s*Début\s*période\s*$/i,
        finPeriode: /^\s*Fin\s*période\s*$/i,
        raisonSociale: /^\s*Nom\s*prénom\s*[/]\s*Raison\s*sociale\s*$/i,
        codeProduit: /^\s*Code\s*produit\s*$/i,
        nomProduit: /^\s*Nom\s*produit\s*$/i,
        emissionTTC: /^\s*Emission\s*TTC\s*$/i,
        reglementTTC: /^\s*Règlement\s*TTC\s*$/i,
        reglementHT: /^\s*Règlement\s*HT\s*$/i,
        taux: /^\s*Taux\s*$/i,
        montantPaiement: /^\s*Montant\s*paiement\s*$/i,
        courtier: /^\s*COURTIER\s*$/i,
        fondateur: /^\s*FONDATEURS*\s*$/i,
        pavillon: /^\s*PAVILLON\s*$/i,
        sofraco: /^\s*SOFRACO\s*$/i,
        sofracoExpertise: /^\s*SOFRACO EXPERTISES\s*$/i,
        budget: /^\s*BUDGET\s*$/i
    };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let indexesHeader = {
                dateGeneration: null,
                codeCompagnie: null,
                codeCourtier: null,
                raisonSocialeApporteur: null,
                dateArrete: null,
                identifiant: null,
                codePostal: null,
                commune: null,
                dateEffetContrat: null,
                debutPeriode: null,
                finPeriode: null,
                raisonSociale: null,
                codeProduit: null,
                nomProduit: null,
                emissionTTC: null,
                reglementTTC: null,
                reglementHT: null,
                taux: null,
                montantPaiement: null,
                courtier: null,
                fondateur: null,
                pavillon: null,
                sofraco: null,
                sofracoExpertise: null,
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
                            errors.push(errorHandler.errorReadExcelPAVILLONV7(index));
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

const getContratPAVILLONV8 = (worksheets, headers, allContrats, errors) => {
    const arrReg = {
        dateGeneration: /^\s*Date\s*génération\s*$/i,
        codeCompagnie: /^\s*Code\s*compagnie\s*$/i,
        codeCourtier: /^\s*Code\s*courtier\s*$/i,
        raisonSocialeApporteur: /^\s*Raison\s*Sociale\s*Apporteur\s*$/i,
        dateArrete: /^\s*Date\s*arrêté\s*$/i,
        identifiant: /^\s*Identifiant\s*$/i,
        codePostal: /^\s*Code\s*Postal\s*$/i,
        commune: /^\s*Commune\s*$/i,
        dateEffetContrat: /^\s*Date\s*d'effet\s*contrat\s*$/i,
        debutPeriode: /^\s*Début\s*période\s*$/i,
        finPeriode: /^\s*Fin\s*période\s*$/i,
        raisonSociale: /^\s*Nom\s*prénom\s*[/]\s*Raison\s*sociale\s*$/i,
        codeProduit: /^\s*Code\s*produit\s*$/i,
        nomProduit: /^\s*Nom\s*produit\s*$/i,
        emissionTTC: /^\s*Emission\s*TTC\s*$/i,
        reglementTTC: /^\s*Règlement\s*TTC\s*$/i,
        reglementHT: /^\s*Règlement\s*HT\s*$/i,
        taux: /^\s*Taux\s*$/i,
        montantPaiement: /^\s*Montant\s*paiement\s*$/i,
        courtier: /^\s*COURTIER\s*$/i,
        fondateur: /^\s*FONDATEURS*\s*$/i,
        pavillon: /^\s*PAVILLON\s*$/i,
        sofraco: /^\s*SOFRACO\s*$/i,
        sofracoExpertise: /^\s*SOFRACO EXPERTISES\s*$/i
    };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let indexesHeader = {
                dateGeneration: null,
                codeCompagnie: null,
                codeCourtier: null,
                raisonSocialeApporteur: null,
                dateArrete: null,
                identifiant: null,
                codePostal: null,
                commune: null,
                dateEffetContrat: null,
                debutPeriode: null,
                finPeriode: null,
                raisonSociale: null,
                codeProduit: null,
                nomProduit: null,
                emissionTTC: null,
                reglementTTC: null,
                reglementHT: null,
                taux: null,
                montantPaiement: null,
                courtier: null,
                fondateur: null,
                pavillon: null,
                sofraco: null,
                sofracoExpertise: null
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
                            errors.push(errorHandler.errorReadExcelPAVILLONV8(index));
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
