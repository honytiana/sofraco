'use strict'
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const time = require('../utils/time');
const excelFile = require('../utils/excelFile');
const files = require('../utils/files');
const generals = require('../utils/generals');
const errorHandler = require('../utils/errorHandler');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ generali: workerData });
}

exports.readExcelGENERALI = async (file) => {
    console.log(`${new Date()} DEBUT TRAITEMENT GENERALI`);
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    const fileName = files.getFileNameWithoutExtension(file);
    let headers = [];
    let allContrats = [];
    let errors = [];
    let ocr = { headers: null, allContratsPerCourtier: [], executionTime: 0 };
    				
    const arrReg = {
        reference: /^Référence\s*du\s*relevé\s*de\s*commission$/i,
        numeroReleve: /^Numéro\s*de\s*relevé$/i,
        dateReleve: /^Date\s*du\s*relevé$/i,
        codeRegroupementIntermediaire: /^Code\s*regroupement\s*intermédiaire$/i,
        codeIntermediaire: /^Code\s*intermédiaire$/i,
        codePortefeuille: /^Code\s*portefeuille$/i,
        libellePortefeuille: /^Libellé\s*portefeuille$/i,
        codePortefeuilleExterne: /^Code\s*portefeuille\s*externe$/i,
        libelleFamilleCommerciale: /^Libellé\s*famille\s*commerciale$/i,
        codeProduit: /^Code\s*produit$/i,
        libelleProduit: /^Libellé\s*du\s*produit$/i,
        natureOperation: /^Nature\s*de\s*l\s*opération$/i,
        libelleTypePrime: /^Libellé\s*type\s*de\s*prime$/i,
        numeroContratOunumeroConvention: /^Numéro\s*de\s*contrat\s*ou\s*numéro\s*de\s*convention$/i,
        raisonSociale: /^Raison\s*sociale$/i,
        numeroContratAffilie: /^Numéro\s*de\s*contrat\s*affilié$/i,
        referenceExterne: /^Référence\s*externe$/i,
        numeroContractant: /^Numéro\s*de\s*contractant$/i,
        nomContractant: /^Nom\s*du\s*contractant$/i,
        prenomContractant: /^Prénom\s*du\s*contractant$/i,
        numeroAssure: /^Numéro\s*assuré$/i,
        nomAssure: /^Nom\s*de\s*l\s*assuré$/i,
        prenomAssure: /^Prénom\s*de\s*l\s*assuré$/i,
        dateOperation: /^Date\s*de\s*l\s*opération$/i,
        dateDebutPeriode: /^Date\s*de\s*début\s*de\s*période$/i,
        dateFinPeriode: /^Date\s*de\s*fin\s*de\s*période$/i,
        libelleGarantie: /^Libellé\s*garantie$/i,
        natureSupport: /^Nature\s*du\s*support$/i,
        codeISIN: /^Code\s*ISIN$/i,
        libelleSupport: /^Libellé\s*du\s*support$/i,
        montantCotisationTTC: /^Montant\s*de\s*la\s*cotisation\s*TTC$/i,
        montantCotisationHTOuNetInvestiEnEpargne: /^Montant\s*cotisation\s*HT\s*ou\s*net\s*investi\s*en\s*épargne$/i,
        assietteCasCommission: /^Assiette\s*du\s*cas\s*de\s*commission$/i,
        tauxCommission: /^Taux\s*de\s*commission$/i,
        typeMontant: /^Type\s*de\s*montant$/i,
        natureCommission: /^Nature\s*de\s*commission$/i,
        montantCommission: /^Montant\s*de\s*commission$/i,
        deviseMontant: /^Devise\s*du\s*montant$/i,
        qualificationCommission: /^Qualification\s*de\s*la\s*commission$/i,
        conformiteAdministrative: /^Conformité\s*administrative$/i,
        transfertPortefeuille: /^Transfert\s*de\s*portefeuille$/i,
        codeOption: /^Code\s*option$/i,
        complementInformations: /^Complément\s*d\s*informations$/i,
    };
    worksheets.forEach((worksheet, index) => {
        if (index === 0) {
            let indexesHeader = {
                reference: null,
                numeroReleve: null,
                dateReleve: null,
                codeRegroupementIntermediaire: null,
                codeIntermediaire: null,
                codePortefeuille: null,
                libellePortefeuille: null,
                codePortefeuilleExterne: null,
                libelleFamilleCommerciale: null,
                codeProduit: null,
                libelleProduit: null,
                natureOperation: null,
                libelleTypePrime: null,
                numeroContratOunumeroConvention: null,
                raisonSociale: null,
                numeroContratAffilie: null,
                referenceExterne: null,
                numeroContractant: null,
                nomContractant: null,
                prenomContractant: null,
                numeroAssure: null,
                nomAssure: null,
                prenomAssure: null,
                dateOperation: null,
                dateDebutPeriode: null,
                dateFinPeriode: null,
                libelleGarantie: null,
                natureSupport: null,
                codeISIN: null,
                libelleSupport: null,
                montantCotisationTTC: null,
                montantCotisationHTOuNetInvestiEnEpargne: null,
                assietteCasCommission: null,
                tauxCommission: null,
                typeMontant: null,
                natureCommission: null,
                montantCommission: null,
                deviseMontant: null,
                qualificationCommission: null,
                conformiteAdministrative: null,
                transfertPortefeuille: null,
                codeOption: null,
                complementInformations: null
            };
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value;
                        headers.push(currentCellValue);
                        generals.setIndexHeaders(cell, colNumber, arrReg, indexesHeader);
                    });
                    for (let index in indexesHeader) {
                        if (indexesHeader[index] === null) {
                            errors.push(errorHandler.errorReadExcelGENERALI(index));
                        }
                    }
                }
                if (rowNumber > 1) {
                    const {contrat, error} = generals.createContratSimpleHeader(row, indexesHeader);
                    // for (let err of error) {
                    //     errors.push(errorHandler.errorEmptyCell('GENERALI', err));
                    // }
                    allContrats.push(contrat);
                }
            });
        }
    });

    let allContratsPerCourtier = [];
    let courtiers = [];
    allContrats.forEach((element, index) => {
        const c = element.codePortefeuille.result ? element.codePortefeuille.result : element.codePortefeuille;
        const courtier = { code: c };
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
            const c = element.codePortefeuille.result ? element.codePortefeuille.result : element.codePortefeuille;
            if (c === contratCourtier.courtier.code) {
                contratCourtier.contrats.push(element);
            }
        });
        allContratsPerCourtier.push(contratCourtier);
    }

    ocr = { headers, allContratsPerCourtier, errors, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    const dateOcr = new Date();
    const day = dateOcr.getDate();
    const month = dateOcr.getMonth() + 1;
    const year = dateOcr.getFullYear();
    const fileOCRPath = path.join(__dirname, '..', '..', '..', 'documents', 'ocr', `${fileName}_${day}_${month}_${year}.txt`);
    fs.writeFileSync(fileOCRPath, JSON.stringify(ocr));
    ocr.allContratsPerCourtier = fileOCRPath;
    console.log(`${new Date()} FIN TRAITEMENT GENERALI`);
    return ocr;
};

