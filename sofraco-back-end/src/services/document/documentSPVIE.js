const { performance } = require('perf_hooks');
const time = require('../utils/time');
const excelFile = require('../utils/excelFile');
const generals = require('../utils/generals');
const errorHandler = require('../utils/errorHandler');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ spvie: workerData });
}

exports.readExcelSPVIE = async (file) => {
    console.log(`${new Date()} DEBUT TRAITEMENT SPVIE`);
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    let firstHeaders = [];
    let secondHeaders = [];
    let headers = { firstHeaders, secondHeaders };
    let allContrats = [];
    let errors = [];
    let ocr = { headers: null, allContratsPerCourtier: [], executionTime: 0 };
    const arrRegFirstHeader = {
        distribution: /^\s*DISTRIBUTION\s*$/i,
        produit: /^\s*PRODUIT\s*$/i,
        adherent: /^\s*ADHERENT\s*$/i,
        statutDate: /^\s*STATUT\s*ET\s*DATES\s*$/i,
        cotisation: /^\s*COTISATION\s*$/i,
        commissionnementReprise: /^\s*COMMISSIONEMENT\s*ET\s*REPRISE\s*$/i,
    };
    const arrRegSecondHeader = {
        code: /^\s*CODE\s*$/i,
        codeVendeur: /^\s*CODE\s*VENDEUR\s*$/i,
        nomCourtierVendeur: /^\s*NOM\s*COURTIER\s*VENDEUR\s*$/i,
        groupe: /^\s*GROUPE\s*$/i,
        entite: /^\s*ENTITE\s*$/i,
        vendeur: /^\s*VENDEUR\s*$/i,
        compagnie: /^\s*COMPAGNIE\s*$/i,
        branche: /^\s*BRANCHE\s*$/i,
        type: /^\s*TYPE\s*$/i,
        gamme: /^\s*GAMME\s*$/i,
        produit: /^\s*PRODUIT\s*$/i,
        formule: /^\s*FORMULE\s*$/i,
        numContrat: /^\s*N°\s*DE\s*CONTRAT\s*$/i,
        nomClient: /^\s*NOM\s*CLIENT\s*$/i,
        prenomClient: /^\s*PRÉNOM\s*CLIENT\s*$/i,
        statutContrat: /^\s*STATUT\s*DU\s*CONTRAT\s*$/i,
        dateSignature: /^\s*DATE\s*DE\s*SIGNATURE\s*$/i,
        dateValidation: /^\s*DATE\s*DE\s*VALIDATION\s*$/i,
        dateEffet: /^\s*DATE\s*D'EFFET\s*$/i,
        dateResilliation: /^\s*DATE\s*DE\s*RÉSILIATION\s*$/i,
        debutPeriode: /^\s*DÉBUT\s*DE\s*PÉRIODE\s*$/i,
        finPeriode: /^\s*FIN\s*DE\s*PÉRIODE\s*$/i,
        cotisationTTCFrais: /^\s*COTISATION\s*TTC\s*[+]\s*FRAIS\s*$/i,
        dontFraisSpvie: /^\s*DONT\s*FRAIS\s*SPVIE\s*$/i,
        dontAutreFrais: /^\s*DONT\s*AUTRES\s*FRAIS\s*$/i,
        dontTaxes: /^\s*DONT\s*TAXES\s*$/i,
        dontPrimesHTHorsFrais: /^\s*DONT\s*PRIME\s*HT\s*[(]HORS\s*FRAIS[)]\s*$/i,
        tauxTaxes: /^\s*TAUX\s*DE\s*TAXES\s*$/i,
        primeHTAnnuel: /^\s*PRIME\s*HT\s*ANNUELLE\s*$/i,
        periodiciteCommission: /^\s*PÉRIODICITÉ\s*COMMISSIONS\s*$/i,
        assietteDeCommissionnement: /^\s*ASSIETTE\s*DE\s*COMMISSIONNEMENT\s*$/i,
        structureCommissionnementInitiale: /^\s*STRUCTURE\s*COMMISSIONNEMENT\s*INITIALE\s*$/i,
        commissionAppliquee: /^\s*COMMISSION\s*APPLIQUÉE\s*$/i,
        fractionAppliquee: /^\s*FRACTION\s*APPLIQUÉE\s*$/i,
        commission: /^\s*COMMISSION\s*$/i,
        reprise: /^\s*REPRISE\s*$/i,
        solde: /^\s*SOLDE\s*$/i,
        bordereauReference: /^\s*BORDEREAU\s*DE\s*RÉFÉRENCE\s*$/i,
        libelle: /^\s*LIBELLÉ\s*$/i,
    };

    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let indexesFirstHeader = {
                distribution: null,
                produit: null,
                adherent: null,
                statutDate: null,
                cotisation: null,
                commissionnementReprise: null
            };
            let indexesSecondHeader = {
                code: null,
                codeVendeur: null,
                nomCourtierVendeur: null,
                groupe: null,
                entite: null,
                vendeur: null,
                compagnie: null,
                branche: null,
                type: null,
                gamme: null,
                produit: null,
                formule: null,
                numContrat: null,
                nomClient: null,
                prenomClient: null,
                statutContrat: null,
                dateSignature: null,
                dateValidation: null,
                dateEffet: null,
                dateResilliation: null,
                debutPeriode: null,
                finPeriode: null,
                cotisationTTCFrais: null,
                dontFraisSpvie: null,
                dontAutreFrais: null,
                dontTaxes: null,
                dontPrimesHTHorsFrais: null,
                tauxTaxes: null,
                primeHTAnnuel: null,
                periodiciteCommission: null,
                assietteDeCommissionnement: null,
                structureCommissionnementInitiale: null,
                commissionAppliquee: null,
                fractionAppliquee: null,
                commission: null,
                reprise: null,
                solde: null,
                bordereauReference: null,
                libelle: null
            };
            let indexesHeader = {
                distribution: {
                    code: null,
                    codeVendeur: null,
                    nomCourtierVendeur: null,
                    groupe: null,
                    entite: null,
                    vendeur: null,
                },
                produit: {
                    compagnie: null,
                    branche: null,
                    type: null,
                    gamme: null,
                    produit: null,
                    formule: null,
                    numContrat: null,
                },
                adherent: {
                    nomClient: null,
                    prenomClient: null,
                },
                statutDate: {
                    statutContrat: null,
                    dateSignature: null,
                    dateValidation: null,
                    dateEffet: null,
                    dateResilliation: null,
                    debutPeriode: null,
                    finPeriode: null,
                },
                cotisation: {
                    cotisationTTCFrais: null,
                    dontFraisSpvie: null,
                    dontAutreFrais: null,
                    dontTaxes: null,
                    dontPrimesHTHorsFrais: null,
                    tauxTaxes: null,
                    primeHTAnnuel: null,
                },
                commissionnementReprise: {
                    periodiciteCommission: null,
                    assietteDeCommissionnement: null,
                    structureCommissionnementInitiale: null,
                    commissionAppliquee: null,
                    fractionAppliquee: null,
                    commission: null,
                    reprise: null,
                    solde: null,
                    bordereauReference: null,
                    libelle: null
                }
            };
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value;
                        if (firstHeaders.indexOf(currentCellValue) < 0) {
                            firstHeaders.push(currentCellValue);
                            generals.setIndexHeaders(cell, colNumber, arrRegFirstHeader, indexesFirstHeader);
                        }
                    });
                    for (let index in indexesFirstHeader) {
                        if (indexesFirstHeader[index] === null) {
                            errors.push(errorHandler.errorReadExcelSPVIEFH(index));
                        }
                    }
                    headers.firstHeaders = firstHeaders;
                }
                if (rowNumber === 2) {
                    row.eachCell((cell, colNumber) => {
                        secondHeaders.push((typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value);
                        generals.setIndexHeaders(cell, colNumber, arrRegSecondHeader, indexesSecondHeader);
                    });
                    for (let index in indexesSecondHeader) {
                        if (indexesSecondHeader[index] === null) {
                            errors.push(errorHandler.errorReadExcelSPVIESH(index));
                        }
                    }
                    headers.secondHeaders = secondHeaders;
                }
                if (rowNumber > 2) {
                    const { contrat, error } = generals.createContratDoubleHeader(row, indexesFirstHeader, indexesSecondHeader, indexesHeader);
                    // for (let err of error) {
                    //     errors.push(errorHandler.errorEmptyCell('SPVIE', err));
                    // }
                    allContrats.push(contrat);
                }
            })
        }
    });

    // const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'distribution.codeVendeur');

    let allContratsPerCourtier = [];
    let courtiers = [];
    allContrats.forEach((element, index) => {
        if (courtiers.indexOf(element.distribution.codeVendeur) < 0) {
            courtiers.push(element.distribution.codeVendeur);
        }
    })
    for (let courtier of courtiers) {
        let contratCourtier = { courtier: '', contrats: [] };
        allContrats.forEach((element, index) => {
            contratCourtier.courtier = courtier;
            if (element.distribution.codeVendeur === contratCourtier.courtier) {
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
    console.log(`${new Date()} FIN TRAITEMENT SPVIE`);
    return ocr;
};

