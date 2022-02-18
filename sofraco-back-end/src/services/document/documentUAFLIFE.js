const { performance } = require('perf_hooks');
const time = require('../utils/time');
const generals = require('../utils/generals');
const excelFile = require('../utils/excelFile');
const errorHandler = require('../utils/errorHandler');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ uaflife: workerData });
}

exports.readExcelUAFLIFE = async (file) => {
    console.log(`${new Date()} DEBUT TRAITEMENT UAF LIFE`);
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    let headers = [];
    let allContrats = [];
    let detailsBordereau = [];
    let errors = [];
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    const arrReg = {
        codeIntermediaireDestinataireReglements: /^\s*Code\s*intermediaire\s*destinataire\s*règlements\s*$/i,
        nomIntermediaireDestinataireReglements: /^\s*Nom\s*intermediaire\s*destinataire\s*règlements\s*$/i,
        codeIntermediaireResponsableContrat: /^\s*Code\s*intermédiaire\s*responsable\s*contrat\s*$/i,
        nomIntermediaireResponsableContrat: /^\s*Nom\s*intermédiaire\s*responsable\s*contrat\s*$/i,
        codeProduit: /^\s*Code\s*produit\s*$/i,
        libelleProduit: /^\s*Libellé\s*produit\s*$/i,
        numeroContrat: /^\s*Numéro\s*contrat\s*$/i,
        nomSouscripteur: /^\s*Nom\s*souscripteur\s*$/i,
        prenomSouscripteur: /^\s*Prénom\s*souscripteur\s*$/i,
        libelleProfil: /^\s*Libellé\s*profil\s*$/i,
        codeISIN: /^\s*Code\s*ISIN\s*$/i,
        libelleSupport: /^\s*Libellé\s*support\s*$/i,
        natureCommissions: /^\s*Nature\s*commissions\s*$/i,
        typeCommissions: /^\s*Type\s*commissions\s*$/i,
        libelleOperation: /^\s*Libellé\s*opération\s*$/i,
        numeroOperation: /^\s*Numéro\s*opération\s*$/i,
        dateCreationOperation: /^\s*Date\s*création\s*opération\s*$/i,
        dateValidationOperation: /^\s*Date\s*validation\s*opération\s*$/i,
        dateValeurOperation: /^\s*Date\s*valeur\s*opération\s*$/i,
        montantOperationTousSupports: /^\s*Montant\s*de\s*l'opération\s*[(]tous supports[)]\s*[(]euros[)]$/i,
        montantOperationSurSupport: /^\s*Montant\s*de\s*l'opération\s*[(]sur\s*le\s*support[)]\s*$/i,
        montantAssietteCommission: /^\s*Montant\s*de\s*l'assiette\s*de\s*commission\s*$/i,
        tauxCommissionsIntermediaireTeteReseau: /^\s*Taux\s*commissions\s*intermédiaire\s*tête\s*réseau\s*$/i,
        montantCommissionIntermediaireTeteReseau: /^\s*Montant\s*commission\s*intermédiaire\s*tête\s*réseau\s*[(]euros[)]\s*$/i,
        tauxCommissionsIntermediaireResponsableContrat: /^\s*Taux\s*commissions\s*intermédiaire\s*responsable\s*contrat\s*$/i,
        montantCommissionsIntermediaireResponsableContrat: /^\s*Montant\s*commissions\s*intermédiaire\s*responsable\s*contrat\s*[(]euros[)]\s*$/i,
        nbPartsAssietteCommission: /^\s*Nb\s*de\s*parts\s*de\s*l'assiette\s*de\s*commission\s*$/i,
        VLUtilisePourCalculFrais: /^\s*VL\s*utilisé\s*pour\s*calcul\s*frais\s*$/i,
        dateValeurVL: /^\s*Date\s*valeur\s*VL\s*$/i,
        codeBordereau: /^\s*Code\s*bordereau\s*$/i,
        dateGenerationBordereau: /^\s*Date\s*génération\s*bordereau\s*$/i,
    };

    worksheets.forEach((worksheet, index) => {
        if (index === 0) {
            let rowNumberHeader;
            for (let i = 1; i <= 14; i++) {
                detailsBordereau.push(worksheet.getRow(i).getCell('A').value);
            }
            let indexesHeader = {
                codeIntermediaireDestinataireReglements: null,
                nomIntermediaireDestinataireReglements: null,
                codeIntermediaireResponsableContrat: null,
                nomIntermediaireResponsableContrat: null,
                codeProduit: null,
                libelleProduit: null,
                numeroContrat: null,
                nomSouscripteur: null,
                prenomSouscripteur: null,
                libelleProfil: null,
                codeISIN: null,
                libelleSupport: null,
                natureCommissions: null,
                typeCommissions: null,
                libelleOperation: null,
                numeroOperation: null,
                dateCreationOperation: null,
                dateValidationOperation: null,
                dateValeurOperation: null,
                montantOperationTousSupports: null,
                montantOperationSurSupport: null,
                montantAssietteCommission: null,
                tauxCommissionsIntermediaireTeteReseau: null,
                montantCommissionIntermediaireTeteReseau: null,
                tauxCommissionsIntermediaireResponsableContrat: null,
                montantCommissionsIntermediaireResponsableContrat: null,
                nbPartsAssietteCommission: null,
                VLUtilisePourCalculFrais: null,
                dateValeurVL: null,
                codeBordereau: null,
                dateGenerationBordereau: null,
            }
            worksheet.eachRow((row, rowNumber) => {
                if (typeof row.getCell('A').value === 'string' && row.getCell('A').value.match(/Code intermediaire/i)) {
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
                            errors.push(errorHandler.errorReadExcelUAFLIFE(index));
                        }
                    }
                }
                if (rowNumber > rowNumberHeader) {
                    const { contrat, error } = generals.createContratSimpleHeader(row, indexesHeader);
                    // for (let err of error) {
                    //     errors.push(errorHandler.errorEmptyCell('SWISSLIFE SURCO', err));
                    // }
                    allContrats.push(contrat);
                }
            })
        }
    });

    const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'codeIntermediaireResponsableContrat');

    ocr = { headers, detailsBordereau, allContratsPerCourtier, errors, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log(`${new Date()} FIN TRAITEMENT UAF LIFE`);
    return ocr;
};

