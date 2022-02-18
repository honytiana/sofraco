const { performance } = require('perf_hooks');
const time = require('../utils/time');
const fileService = require('../utils/files');
const excelFile = require('../utils/excelFile');
const generals = require('../utils/generals');
const errorHandler = require('../utils/errorHandler');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ miel: workerData });
}

exports.readExcelMIEL = async (file) => { };

exports.readExcelMIELMCMS = async (file) => {
    console.log(`${new Date()} DEBUT TRAITEMENT MIEL MCMS`);
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    const fileName = fileService.getFileNameWithoutExtension(file);
    const version = fileName.replace(/.+(V\d+).*/, '$1');
    let headers = [];
    let allContrats = [];
    let errors = [];
    let ocr = { headers: [], allContratsPerCourtier: [], mielVersion: null, executionTime: 0 };
    let mielCreasio, mielV1, mielV2, mielV3, mielV4 = false;
    if (fileName.match('CREASIO')) {
        mielCreasio = true;
    }
    switch (version) {
        case 'V1':
            mielV1 = true;
            break;
        case 'V2':
            mielV2 = true;
            break;
        case 'V3':
            mielV3 = true;
            break;
        case 'V4':
            mielV4 = true;
            break;
    }
    if (mielCreasio) {
        getContratMIELCREASIO(worksheets, headers, allContrats, errors);
    }
    if (mielV1) {
        getContratMIELV1(worksheets, headers, allContrats, errors);
    }
    if (mielV2) {
        getContratMIELV2(worksheets, headers, allContrats, errors);
    }
    if (mielV3) {
        getContratMIELV3(worksheets, headers, allContrats, errors);
    }
    if (mielV4) {
        getContratMIELV4(worksheets, headers, allContrats, errors);
    }

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
    console.log(`${new Date()} FIN TRAITEMENT MIEL MCMS`);
    return ocr;
};

const getContratMIELCREASIO = (worksheets, headers, allContrats, errors) => {
    const arrReg = {
        codeApporteurCommissionne: /^\s*Code\s*Apporteur\s*commissionné\s*$/i,
        codeApporteurAffaire: /^\s*Code\s*Apporteur\s*d'Affaire\s*$/i,
        nomApporteurAffaire: /^\s*Nom\s*Apporteur\s*d'Affaire\s*$/i,
        numAdherent: /^\s*N°\s*Adhérent\s*$/i,
        nom: /^\s*Nom\s*$/i,
        prenom: /^\s*Prénom\s*$/i,
        codePostal: /^\s*Code\s*postal\s*$/i,
        ville: /^\s*Ville\s*$/i,
        codeProduit: /^\s*Code\s*Poduit\s*$/i,
        nomProduit: /^\s*Nom\s*Produit\s*$/i,
        codeContrat: /^\s*Code\s*Contrat\s*$/i,
        nomContrat: /^\s*Nom\s*Contrat\s*$/i,
        dateDebutEcheance: /^\s*Date\s*début\s*échéance\s*$/i,
        dateFinEcheance: /^\s*Date\s*fin\s*échéance\s*$/i,
        montantTTCEcheance: /^\s*Montant\s*TTC\s*échéance\s*$/i,
        montantHTEcheance: /^\s*Montant\s*HT\s*échéance\s*$/i,
        codeGarantieTechnique: /^\s*Code\s*de\s*la\s*Garantie\s*Technique\s*$/i,
        nomGarantieTechnique: /^\s*Nom\s*de\s*la\s*Garantie\s*Technique\s*$/i,
        baseCommisionnement: /^\s*Base\s*de\s*commisionnement\s*$/i,
        tauxCommission: /^\s*Taux\s*de\s*commission\s*$/i,
        montantCommissions: /^\s*Montant\s*commissions\s*$/i,
        bordereauPaiementCommissionsInitiales: /^\s*Bordereau\s*du\s*paiement\s*des\s*commissions\s*initiales\s*$/i
    };

    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let indexesHeader = {
                codeApporteurCommissionne: null,
                codeApporteurAffaire: null,
                nomApporteurAffaire: null,
                numAdherent: null,
                nom: null,
                prenom: null,
                codePostal: null,
                ville: null,
                codeProduit: null,
                nomProduit: null,
                codeContrat: null,
                nomContrat: null,
                dateDebutEcheance: null,
                dateFinEcheance: null,
                montantTTCEcheance: null,
                montantHTEcheance: null,
                codeGarantieTechnique: null,
                nomGarantieTechnique: null,
                baseCommisionnement: null,
                tauxCommission: null,
                montantCommissions: null,
                bordereauPaiementCommissionsInitiales: null
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
                            errors.push(errorHandler.errorReadExcelMIELCREASIO(index));
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

const getContratMIELV1 = (worksheets, headers, allContrats, errors) => {
    const arrReg = {
        codeApporteurCommissionne: /^\s*Code\s*Apporteur\s*commissionné\s*$/i,
        codeApporteurAffaire: /^\s*Code\s*Apporteur\s*d'Affaire\s*$/i,
        nomApporteurAffaire: /^\s*Nom\s*Apporteur\s*d'Affaire\s*$/i,
        numAdherent: /^\s*N°\s*Adhérent\s*$/i,
        nom: /^\s*Nom\s*$/i,
        prenom: /^\s*Prénom\s*$/i,
        codePostal: /^\s*Code\s*postal\s*$/i,
        ville: /^\s*Ville\s*$/i,
        codeProduit: /^\s*Code\s*Poduit\s*$/i,
        nomProduit: /^\s*Nom\s*Produit\s*$/i,
        codeContrat: /^\s*Code\s*Contrat\s*$/i,
        nomContrat: /^\s*Nom\s*Contrat\s*$/i,
        dateDebutEcheance: /^\s*Date\s*début\s*échéance\s*$/i,
        dateFinEcheance: /^\s*Date\s*fin\s*échéance\s*$/i,
        montantTTCEcheance: /^\s*Montant\s*TTC\s*échéance\s*$/i,
        montantHTEcheance: /^\s*Montant\s*HT\s*échéance\s*$/i,
        codeGarantieTechnique: /^\s*Code\s*de\s*la\s*Garantie\s*Technique\s*$/i,
        nomGarantieTechnique: /^\s*Nom\s*de\s*la\s*Garantie\s*Technique\s*$/i,
        baseCommisionnement: /^\s*Base\s*de\s*commisionnement\s*$/i,
        tauxCommission: /^\s*Taux\s*de\s*commission\s*$/i,
        montantCommissions: /^\s*Montant\s*commissions\s*$/i,
        bordereauPaiementCommissionsInitiales: /^\s*Bordereau\s*du\s*paiement\s*des\s*commissions\s*initiales\s*$/i,
        courtier: /^\s*COURTIER\s*$/i,
        fondateur: /^\s*FONDATEUR\s*$/i
    };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let indexesHeader = {
                codeApporteurCommissionne: null,
                codeApporteurAffaire: null,
                nomApporteurAffaire: null,
                numAdherent: null,
                nom: null,
                prenom: null,
                codePostal: null,
                ville: null,
                codeProduit: null,
                nomProduit: null,
                codeContrat: null,
                nomContrat: null,
                dateDebutEcheance: null,
                dateFinEcheance: null,
                montantTTCEcheance: null,
                montantHTEcheance: null,
                codeGarantieTechnique: null,
                nomGarantieTechnique: null,
                baseCommisionnement: null,
                tauxCommission: null,
                montantCommissions: null,
                bordereauPaiementCommissionsInitiales: null,
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
                            errors.push(errorHandler.errorReadExcelMIELV1(index));
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

const getContratMIELV2 = (worksheets, headers, allContrats, errors) => {
    const arrReg = {
        codeApporteurCommissionne: /^\s*Code\s*Apporteur\s*commissionné\s*$/i,
        codeApporteurAffaire: /^\s*Code\s*Apporteur\s*d'Affaire\s*$/i,
        nomApporteurAffaire: /^\s*Nom\s*Apporteur\s*d'Affaire\s*$/i,
        numAdherent: /^\s*N°\s*Adhérent\s*$/i,
        nom: /^\s*Nom\s*$/i,
        prenom: /^\s*Prénom\s*$/i,
        codePostal: /^\s*Code\s*postal\s*$/i,
        ville: /^\s*Ville\s*$/i,
        codeProduit: /^\s*Code\s*Poduit\s*$/i,
        nomProduit: /^\s*Nom\s*Produit\s*$/i,
        codeContrat: /^\s*Code\s*Contrat\s*$/i,
        nomContrat: /^\s*Nom\s*Contrat\s*$/i,
        dateDebutEcheance: /^\s*Date\s*début\s*échéance\s*$/i,
        dateFinEcheance: /^\s*Date\s*fin\s*échéance\s*$/i,
        montantTTCEcheance: /^\s*Montant\s*TTC\s*échéance\s*$/i,
        montantHTEcheance: /^\s*Montant\s*HT\s*échéance\s*$/i,
        codeGarantieTechnique: /^\s*Code\s*de\s*la\s*Garantie\s*Technique\s*$/i,
        nomGarantieTechnique: /^\s*Nom\s*de\s*la\s*Garantie\s*Technique\s*$/i,
        baseCommisionnement: /^\s*Base\s*de\s*commisionnement\s*$/i,
        tauxCommission: /^\s*Taux\s*de\s*commission\s*$/i,
        montantCommissions: /^\s*Montant\s*commissions\s*$/i,
        bordereauPaiementCommissionsInitiales: /^\s*Bordereau\s*du\s*paiement\s*des\s*commissions\s*initiales\s*$/i,
        courtier: /^\s*COURTIER\s*$/i,
        fondateur: /^\s*FONDATEUR\s*$/i,
        sogeas: /^\s*SOGEAS\s*$/i,
        procedure: /^\s*PROCEDURE\s*$/i
    };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let indexesHeader = {
                codeApporteurCommissionne: null,
                codeApporteurAffaire: null,
                nomApporteurAffaire: null,
                numAdherent: null,
                nom: null,
                prenom: null,
                codePostal: null,
                ville: null,
                codeProduit: null,
                nomProduit: null,
                codeContrat: null,
                nomContrat: null,
                dateDebutEcheance: null,
                dateFinEcheance: null,
                montantTTCEcheance: null,
                montantHTEcheance: null,
                codeGarantieTechnique: null,
                nomGarantieTechnique: null,
                baseCommisionnement: null,
                tauxCommission: null,
                montantCommissions: null,
                bordereauPaiementCommissionsInitiales: null,
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
                            errors.push(errorHandler.errorReadExcelMIELV2(index));
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

const getContratMIELV3 = (worksheets, headers, allContrats, errors) => {
    const arrReg1 = {
        codeApporteurCommissionne: /^\s*Code\s*Apporteur\s*commissionné\s*$/i,
        codeApporteurAffaire: /^\s*Code\s*Apporteur\s*d'Affaire\s*$/i,
        nomApporteurAffaire: /^\s*Nom\s*Apporteur\s*d'Affaire\s*$/i,
        numAdherent: /^\s*N°\s*Adhérent\s*$/i,
        dateDebutContrat: /^\s*date\s*début\s*d*e*\s*contrat\s*$/i,
        nom: /^\s*Nom\s*$/i,
        prenom: /^\s*Prénom\s*$/i,
        codePostal: /^\s*Code\s*postal\s*$/i,
        ville: /^\s*Ville\s*$/i,
        codeProduit: /^\s*Code\s*Poduit\s*$/i,
        nomProduit: /^\s*Nom\s*Produit\s*$/i,
        codeContrat: /^\s*Code\s*Contrat\s*$/i,
        nomContrat: /^\s*Nom\s*Contrat\s*$/i,
        dateDebutEcheance: /^\s*Date\s*début\s*échéance\s*$/i,
        dateFinEcheance: /^\s*Date\s*fin\s*échéance\s*$/i,
        montantTTCEcheance: /^\s*Montant\s*TTC\s*échéance\s*$/i,
        montantHTEcheance: /^\s*Montant\s*HT\s*échéance\s*$/i,
        codeGarantieTechnique: /^\s*Code\s*de\s*la\s*Garantie\s*Technique\s*$/i,
        nomGarantieTechnique: /^\s*Nom\s*de\s*la\s*Garantie\s*Technique\s*$/i,
        baseCommisionnement: /^\s*Base\s*de\s*commisionnement\s*$/i,
        tauxCommission: /^\s*Taux\s*de\s*commission\s*$/i,
        montantCommissions: /^\s*Montant\s*commissions\s*$/i,
        bordereauPaiementCommissionsInitiales: /^\s*Bordereau\s*du\s*paiement\s*des\s*commissions\s*initiales\s*$/i,
        courtier: /^\s*COURTIER\s*$/i,
        fondateur: /^\s*FONDATEURS*\s*$/i,
        sogeas: /^\s*SOGEAS\s*$/i,
        sofraco: /^\s*SOFRACO\s*$/i,
        procedure: /^\s*PROCEDURE\s*$/i,
    };
    const arrReg2 = {
        codeApporteurCommissionne: /^\s*Code\s*Apporteur\s*commissionné\s*$/i,
        codeApporteurAffaire: /^\s*Code\s*Apporteur\s*d'Affaire\s*$/i,
        nomApporteurAffaire: /^\s*Nom\s*Apporteur\s*d'Affaire\s*$/i,
        numAdherent: /^\s*N°\s*Adhérent\s*$/i,
        dateDebutContrat: /^\s*date\s*début\s*d*e*\s*contrat\s*$/i,
        nom: /^\s*Nom\s*$/i,
        prenom: /^\s*Prénom\s*$/i,
        codePostal: /^\s*Code\s*postal\s*$/i,
        ville: /^\s*Ville\s*$/i,
        codeProduit: /^\s*Code\s*Poduit\s*$/i,
        nomProduit: /^\s*Nom\s*Produit\s*$/i,
        codeContrat: /^\s*Code\s*Contrat\s*$/i,
        nomContrat: /^\s*Nom\s*Contrat\s*$/i,
        dateDebutEcheance: /^\s*Date\s*début\s*échéance\s*$/i,
        dateFinEcheance: /^\s*Date\s*fin\s*échéance\s*$/i,
        montantTTCEcheance: /^\s*Montant\s*TTC\s*échéance\s*$/i,
        montantHTEcheance: /^\s*Montant\s*HT\s*échéance\s*$/i,
        codeGarantieTechnique: /^\s*Code\s*de\s*la\s*Garantie\s*Technique\s*$/i,
        nomGarantieTechnique: /^\s*Nom\s*de\s*la\s*Garantie\s*Technique\s*$/i,
        baseCommisionnement: /^\s*Base\s*de\s*commisionnement\s*$/i,
        tauxCommission: /^\s*Taux\s*de\s*commission\s*$/i,
        montantCommissions: /^\s*Montant\s*commissions\s*$/i,
        bordereauPaiementCommissionsInitiales: /^\s*Bordereau\s*du\s*paiement\s*des\s*commissions\s*initiales\s*$/i,
        courtier: /^\s*COURTIER\s*$/i,
        fondateur: /^\s*FONDATEURS*\s*$/i,
        pavillon: /^\s*PAVILLON\s*$/i,
        sofraco: /^\s*SOFRACO\s*$/i,
        sofracoExpertises: /^\s*SOFRACO\s*EXPERTISES\s*$/i,
        budget: /^\s*BUDGET\s*$/i
    };
    worksheets.forEach((worksheet, index) => {
        if (index === 2) {
            let indexesHeader = {
                codeApporteurCommissionne: null,
                codeApporteurAffaire: null,
                nomApporteurAffaire: null,
                numAdherent: null,
                dateDebutContrat: null,
                nom: null,
                prenom: null,
                codePostal: null,
                ville: null,
                codeProduit: null,
                nomProduit: null,
                codeContrat: null,
                nomContrat: null,
                dateDebutEcheance: null,
                dateFinEcheance: null,
                montantTTCEcheance: null,
                montantHTEcheance: null,
                codeGarantieTechnique: null,
                nomGarantieTechnique: null,
                baseCommisionnement: null,
                tauxCommission: null,
                montantCommissions: null,
                bordereauPaiementCommissionsInitiales: null,
                courtier: null,
                fondateur: null,
                sogeas: null,
                sofraco: null,
                procedure: null,
            };
            let rowNumberHeader;
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    rowNumberHeader = rowNumber;
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim().replace(/\n/g, ' ') : cell.value.replace(/\n/g, ' ');
                        if (headers.indexOf(currentCellValue) < 0) {
                            headers.push(currentCellValue);
                            generals.setIndexHeaders(cell, colNumber, arrReg1, indexesHeader);
                        }
                    });
                    for (let index in indexesHeader) {
                        if (indexesHeader[index] === null) {
                            errors.push(errorHandler.errorReadExcelMIELV3_1(index));
                        }
                    }
                }
                if (rowNumber > rowNumberHeader && !row.hidden) {
                    const { contrat, error } = generals.createContratSimpleHeader(row, indexesHeader);
                    allContrats.push(contrat);
                }
            })
        }
        if (index === 3) {
            let indexesHeader = {
                codeApporteurCommissionne: null,
                codeApporteurAffaire: null,
                nomApporteurAffaire: null,
                numAdherent: null,
                dateDebutContrat: null,
                nom: null,
                prenom: null,
                codePostal: null,
                ville: null,
                codeProduit: null,
                nomProduit: null,
                codeContrat: null,
                nomContrat: null,
                dateDebutEcheance: null,
                dateFinEcheance: null,
                montantTTCEcheance: null,
                montantHTEcheance: null,
                codeGarantieTechnique: null,
                nomGarantieTechnique: null,
                baseCommisionnement: null,
                tauxCommission: null,
                montantCommissions: null,
                bordereauPaiementCommissionsInitiales: null,
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
                        // if (headers.indexOf(currentCellValue) < 0) {
                            // headers.push(currentCellValue);
                            generals.setIndexHeaders(cell, colNumber, arrReg2, indexesHeader);
                        // }
                    });
                    for (let index in indexesHeader) {
                        if (indexesHeader[index] === null) {
                            errors.push(errorHandler.errorReadExcelMIELV3_2(index));
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

const getContratMIELV4 = (worksheets, headers, allContrats, errors) => {
    const arrReg = {
        codeApporteurCommissionne: /^\s*Code\s*Apporteur\s*commissionné\s*$/i,
        codeApporteurAffaire: /^\s*Code\s*Apporteur\s*d'Affaire\s*$/i,
        nomApporteurAffaire: /^\s*Nom\s*Apporteur\s*d'Affaire\s*$/i,
        numAdherent: /^\s*N°\s*Adhérent\s*$/i,
        nom: /^\s*Nom\s*$/i,
        prenom: /^\s*Prénom\s*$/i,
        codePostal: /^\s*Code\s*postal\s*$/i,
        ville: /^\s*Ville\s*$/i,
        codeProduit: /^\s*Code\s*Poduit\s*$/i,
        nomProduit: /^\s*Nom\s*Produit\s*$/i,
        codeContrat: /^\s*Code\s*Contrat\s*$/i,
        nomContrat: /^\s*Nom\s*Contrat\s*$/i,
        dateDebutEcheance: /^\s*Date\s*début\s*échéance\s*$/i,
        dateFinEcheance: /^\s*Date\s*fin\s*échéance\s*$/i,
        montantTTCEcheance: /^\s*Montant\s*TTC\s*échéance\s*$/i,
        montantHTEcheance: /^\s*Montant\s*HT\s*échéance\s*$/i,
        codeGarantieTechnique: /^\s*Code\s*de\s*la\s*Garantie\s*Technique\s*$/i,
        nomGarantieTechnique: /^\s*Nom\s*de\s*la\s*Garantie\s*Technique\s*$/i,
        baseCommisionnement: /^\s*Base\s*de\s*commisionnement\s*$/i,
        tauxCommission: /^\s*Taux\s*de\s*commission\s*$/i,
        montantCommissions: /^\s*Montant\s*commissions\s*$/i,
        bordereauPaiementCommissionsInitiales: /^\s*Bordereau\s*du\s*paiement\s*des\s*commissions\s*initiales\s*$/i,
        courtier: /^\s*COURTIER\s*$/i,
        fondateur: /^\s*FONDATEUR\s*$/i,
        pavillon: /^\s*PAVILLON\s*$/i,
        sofracoExpertises: /^\s*SOFRACO\s*EXPERTISES\s*$/i,
        budget: /^\s*BUDGET\s*$/i
    };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let indexesHeader = {
                codeApporteurCommissionne: null,
                codeApporteurAffaire: null,
                nomApporteurAffaire: null,
                numAdherent: null,
                nom: null,
                prenom: null,
                codePostal: null,
                ville: null,
                codeProduit: null,
                nomProduit: null,
                codeContrat: null,
                nomContrat: null,
                dateDebutEcheance: null,
                dateFinEcheance: null,
                montantTTCEcheance: null,
                montantHTEcheance: null,
                codeGarantieTechnique: null,
                nomGarantieTechnique: null,
                baseCommisionnement: null,
                tauxCommission: null,
                montantCommissions: null,
                bordereauPaiementCommissionsInitiales: null,
                courtier: null,
                fondateur: null,
                pavillon: null,
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
                            errors.push(errorHandler.errorReadExcelMIELV4(index));
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