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
        distribution: /^DISTRIBUTION$/i,
        produit: /^PRODUIT$/i,
        adherent: /^ADHERENT$/i,
        statutDate: /^STATUT\s*ET\s*DATES$/i,
        cotisation: /^COTISATION$/i,
        commissionnementReprise: /^COMMISSIONEMENT\s*ET\s*REPRISE$/i,
    };
    const arrRegSecondHeader = {
        code: /^CODE$/i,
        codeVendeur: /^CODE\s*VENDEUR$/i,
        nomCourtierVendeur: /^NOM\s*COURTIER\s*VENDEUR$/i,
        groupe: /^GROUPE$/i,
        entite: /^ENTITE$/i,
        vendeur: /^VENDEUR$/i,
        compagnie: /^COMPAGNIE$/i,
        branche: /^BRANCHE$/i,
        type: /^TYPE$/i,
        gamme: /^GAMME$/i,
        produit: /^PRODUIT$/i,
        formule: /^FORMULE$/i,
        numContrat: /^N°\s*DE\s*CONTRAT$/i,
        nomClient: /^NOM\s*CLIENT$/i,
        prenomClient: /^PRÉNOM\s*CLIENT$/i,
        statutContrat: /^STATUT\s*DU\s*CONTRAT$/i,
        dateSignature: /^DATE\s*DE\s*SIGNATURE$/i,
        dateValidation: /^DATE\s*DE\s*VALIDATION$/i,
        dateEffet: /^DATE\s*D'EFFET$/i,
        dateResilliation: /^DATE\s*DE\s*RÉSILIATION$/i,
        debutPeriode: /^DÉBUT\s*DE\s*PÉRIODE$/i,
        finPeriode: /^FIN\s*DE\s*PÉRIODE$/i,
        cotisationTTCFrais: /^COTISATION\s*TTC\s*[+]\s*FRAIS$/i,
        dontFraisSpvie: /^DONT\s*FRAIS\s*SPVIE$/i,
        dontAutreFrais: /^DONT\s*AUTRES\s*FRAIS$/i,
        dontTaxes: /^DONT\s*TAXES$/i,
        dontPrimesHTHorsFrais: /^DONT\s*PRIME\s*HT\s*[(]HORS\s*FRAIS[)]$/i,
        tauxTaxes: /^TAUX\s*DE\s*TAXES$/i,
        primeHTAnnuel: /^PRIME\s*HT\s*ANNUELLE$/i,
        periodiciteCommission: /^PÉRIODICITÉ\s*COMMISSIONS$/i,
        assietteDeCommissionnement: /^ASSIETTE\s*DE\s*COMMISSIONNEMENT$/i,
        structureCommissionnementInitiale: /^STRUCTURE\s*COMMISSIONNEMENT\s*INITIALE$/i,
        commissionAppliquee: /^COMMISSION\s*APPLIQUÉE$/i,
        fractionAppliquee: /^FRACTION\s*APPLIQUÉE$/i,
        commission: /^COMMISSION$/i,
        reprise: /^REPRISE$/i,
        solde: /^SOLDE$/i,
        bordereauReference: /^BORDEREAU\s*DE\s*RÉFÉRENCE$/i,
        libelle: /^LIBELLÉ$/i,
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

