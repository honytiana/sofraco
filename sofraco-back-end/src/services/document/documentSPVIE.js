const { performance } = require('perf_hooks');
const time = require('../utils/time');
const excelFile = require('../utils/excelFile');

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
    let ocr = { headers: null, allContratsPerCourtier: [], executionTime: 0 };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value;
                        if (firstHeaders.indexOf(currentCellValue) < 0) {
                            firstHeaders.push(currentCellValue);
                        }
                    });
                    headers.firstHeaders = firstHeaders;
                }
                if (rowNumber === 2) {
                    row.eachCell((cell, colNumber) => {
                        secondHeaders.push((typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value);
                    });
                    headers.secondHeaders = secondHeaders;
                }
                if (rowNumber > 2) {
                    const contrat = {
                        distribution: {
                            code: (typeof row.getCell('A').value === 'string') ?
                                row.getCell('A').value.trim() :
                                row.getCell('A').value,
                            codeVendeur: (typeof row.getCell('B').value === 'string') ?
                                row.getCell('B').value.trim() :
                                row.getCell('B').value,
                            nomCourtierVendeur: (typeof row.getCell('C').value === 'string') ?
                                row.getCell('C').value.trim() :
                                row.getCell('C').value,
                            groupe: (typeof row.getCell('D').value === 'string') ?
                                row.getCell('D').value.trim() :
                                row.getCell('D').value,
                            entite: (typeof row.getCell('E').value === 'string') ?
                                row.getCell('E').value.trim() :
                                row.getCell('E').value,
                            vendeur: (typeof row.getCell('F').value === 'string') ?
                                row.getCell('F').value.trim() :
                                row.getCell('F').value,
                        },
                        produit: {
                            compagnie: (typeof row.getCell('G').value === 'string') ?
                                row.getCell('G').value.trim() :
                                row.getCell('G').value,
                            branche: (typeof row.getCell('H').value === 'string') ?
                                row.getCell('H').value.trim() :
                                row.getCell('H').value,
                            type: (typeof row.getCell('I').value === 'string') ?
                                row.getCell('I').value.trim() :
                                row.getCell('I').value,
                            gamme: (typeof row.getCell('J').value === 'string') ?
                                row.getCell('J').value.trim() :
                                row.getCell('J').value,
                            produit: (typeof row.getCell('K').value === 'string') ?
                                row.getCell('K').value.trim() :
                                row.getCell('K').value,
                            formule: (typeof row.getCell('L').value === 'string') ?
                                row.getCell('L').value.trim() :
                                row.getCell('L').value,
                            numContrat: (typeof row.getCell('M').value === 'string') ?
                                row.getCell('M').value.trim() :
                                row.getCell('M').value,
                        },
                        adherent: {
                            nomClient: (typeof row.getCell('N').value === 'string') ?
                                row.getCell('N').value.trim() :
                                row.getCell('N').value,
                            prenomClient: (typeof row.getCell('O').value === 'string') ?
                                row.getCell('O').value.trim() :
                                row.getCell('O').value,
                        },
                        statutDate: {
                            statutContrat: (typeof row.getCell('P').value === 'string') ?
                                row.getCell('P').value.trim() :
                                row.getCell('P').value,
                            dateSignature: (typeof row.getCell('Q').value === 'string') ?
                                row.getCell('Q').value.trim() :
                                row.getCell('Q').value,
                            dateValidation: (typeof row.getCell('R').value === 'string') ?
                                row.getCell('R').value.trim() :
                                row.getCell('R').value,
                            dateEffet: (typeof row.getCell('S').value === 'string') ?
                                row.getCell('S').value.trim() :
                                row.getCell('S').value,
                            dateResilliation: (typeof row.getCell('T').value === 'string') ?
                                row.getCell('T').value.trim() :
                                row.getCell('T').value,
                            debutPeriode: (typeof row.getCell('U').value === 'string') ?
                                row.getCell('U').value.trim() :
                                row.getCell('U').value,
                            finPeriode: (typeof row.getCell('V').value === 'string') ?
                                row.getCell('V').value.trim() :
                                row.getCell('V').value,
                        },
                        cotisation: {
                            cotisationTTCFrais: (typeof row.getCell('W').value === 'string') ?
                                row.getCell('W').value.trim() :
                                row.getCell('W').value,
                            dontFraisSpvie: (typeof row.getCell('X').value === 'string') ?
                                row.getCell('X').value.trim() :
                                row.getCell('X').value,
                            dontAutreFrais: (typeof row.getCell('Y').value === 'string') ?
                                row.getCell('Y').value.trim() :
                                row.getCell('Y').value,
                            dontTaxes: (typeof row.getCell('Z').value === 'string') ?
                                row.getCell('Z').value.trim() :
                                row.getCell('Z').value,
                            dontPrimesHTHorsFrais: (typeof row.getCell('AA').value === 'string') ?
                                row.getCell('AA').value.trim() :
                                row.getCell('AA').value,
                            tauxTaxes: (typeof row.getCell('AB').value === 'string') ?
                                row.getCell('AB').value.trim() :
                                row.getCell('AB').value,
                            primeHTAnnuel: (typeof row.getCell('AC').value === 'string') ?
                                row.getCell('AC').value.trim() :
                                row.getCell('AC').value,
                        },
                        commissionnementReprise: {
                            periodiciteCommission: (typeof row.getCell('AD').value === 'string') ?
                                row.getCell('AD').value.trim() :
                                row.getCell('AD').value,
                            assietteDeCommissionnement: (typeof row.getCell('AE').value === 'string') ?
                                row.getCell('AE').value.trim() :
                                row.getCell('AE').value,
                            structureCommissionnementInitiale: (typeof row.getCell('AF').value === 'string') ?
                                row.getCell('AF').value.trim() :
                                row.getCell('AF').value,
                            commissionAppliquee: (typeof row.getCell('AG').value === 'string') ?
                                row.getCell('AG').value.trim() :
                                row.getCell('AG').value,
                            fractionAppliquee: (typeof row.getCell('AH').value === 'string') ?
                                row.getCell('AH').value.trim() :
                                row.getCell('AH').value,
                            commission: (typeof row.getCell('AI').value === 'string') ?
                                row.getCell('AI').value.trim() :
                                row.getCell('AI').value,
                            reprise: (typeof row.getCell('AJ').value === 'string') ?
                                row.getCell('AJ').value.trim() :
                                row.getCell('AJ').value,
                            solde: (typeof row.getCell('AK').value === 'string') ?
                                row.getCell('AK').value.trim() :
                                row.getCell('AK').value,
                            bordereauReference: (typeof row.getCell('AL').value === 'string') ?
                                row.getCell('AL').value.trim() :
                                row.getCell('AL').value,
                            libelle: (typeof row.getCell('AM').value === 'string') ?
                                row.getCell('AM').value.trim() :
                                row.getCell('AM').value
                        }
                    };
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

    ocr = { headers, allContratsPerCourtier, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log(`${new Date()} FIN TRAITEMENT SPVIE`);
    return ocr;
};

