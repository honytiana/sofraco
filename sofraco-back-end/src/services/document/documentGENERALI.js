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
        reference: /^\s*Référence\s*du\s*relevé\s*de\s*commission\s*$/i,
        numeroReleve: /^\s*Numéro\s*de\s*relevé\s*$/i,
        dateReleve: /^\s*Date\s*du\s*relevé\s*$/i,
        codeRegroupementIntermediaire: /^\s*Code\s*regroupement\s*intermédiaire\s*$/i,
        codeIntermediaire: /^\s*Code\s*intermédiaire\s*$/i,
        codePortefeuille: /^\s*Code\s*portefeuille\s*$/i,
        libellePortefeuille: /^\s*Libellé\s*portefeuille\s*$/i,
        codePortefeuilleExterne: /^\s*Code\s*portefeuille\s*externe\s*$/i,
        libelleFamilleCommerciale: /^\s*Libellé\s*famille\s*commerciale\s*$/i,
        codeProduit: /^\s*Code\s*produit\s*$/i,
        libelleProduit: /^\s*Libellé\s*du\s*produit\s*$/i,
        natureOperation: /^\s*Nature\s*de\s*l\s*opération\s*$/i,
        libelleTypePrime: /^\s*Libellé\s*type\s*de\s*prime\s*$/i,
        numeroContratOunumeroConvention: /^\s*Numéro\s*de\s*contrat\s*ou\s*numéro\s*de\s*convention\s*$/i,
        raisonSociale: /^\s*Raison\s*sociale\s*$/i,
        numeroContratAffilie: /^\s*Numéro\s*de\s*contrat\s*affilié\s*$/i,
        referenceExterne: /^\s*Référence\s*externe\s*$/i,
        numeroContractant: /^\s*Numéro\s*de\s*contractant\s*$/i,
        nomContractant: /^\s*Nom\s*du\s*contractant\s*$/i,
        prenomContractant: /^\s*Prénom\s*du\s*contractant\s*$/i,
        numeroAssure: /^\s*Numéro\s*assuré\s*$/i,
        nomAssure: /^\s*Nom\s*de\s*l\s*assuré\s*$/i,
        prenomAssure: /^\s*Prénom\s*de\s*l\s*assuré\s*$/i,
        dateOperation: /^\s*Date\s*de\s*l\s*opération\s*$/i,
        dateDebutPeriode: /^\s*Date\s*de\s*début\s*de\s*période\s*$/i,
        dateFinPeriode: /^\s*Date\s*de\s*fin\s*de\s*période\s*$/i,
        libelleGarantie: /^\s*Libellé\s*garantie\s*$/i,
        natureSupport: /^\s*Nature\s*du\s*support\s*$/i,
        codeISIN: /^\s*Code\s*ISIN\s*$/i,
        libelleSupport: /^\s*Libellé\s*du\s*support\s*$/i,
        montantCotisationTTC: /^\s*Montant\s*de\s*la\s*cotisation\s*TTC\s*$/i,
        montantCotisationHTOuNetInvestiEnEpargne: /^\s*Montant\s*cotisation\s*HT\s*ou\s*net\s*investi\s*en\s*épargne\s*$/i,
        assietteCasCommission: /^\s*Assiette\s*du\s*cas\s*de\s*commission\s*$/i,
        tauxCommission: /^\s*Taux\s*de\s*commission\s*$/i,
        typeMontant: /^\s*Type\s*de\s*montant\s*$/i,
        natureCommission: /^\s*Nature\s*de\s*commission\s*$/i,
        montantCommission: /^\s*Montant\s*de\s*commission\s*$/i,
        deviseMontant: /^\s*Devise\s*du\s*montant\s*$/i,
        qualificationCommission: /^\s*Qualification\s*de\s*la\s*commission\s*$/i,
        conformiteAdministrative: /^\s*Conformité\s*administrative\s*$/i,
        transfertPortefeuille: /^\s*Transfert\s*de\s*portefeuille\s*$/i,
        codeOption: /^\s*Code\s*option\s*$/i,
        complementInformations: /^\s*Complément\s*d\s*informations\s*$/i,
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

