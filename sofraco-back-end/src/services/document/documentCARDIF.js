const { performance } = require('perf_hooks');
const time = require('../utils/time');
const generals = require('../utils/generals');
const excelFile = require('../utils/excelFile');
const { workerData, parentPort } = require('worker_threads');
const errorHandler = require('../utils/errorHandler');

if (parentPort !== null) {
    parentPort.postMessage({ cardif: workerData });
}

exports.readExcelCARDIF = async (file) => {
    console.log(`${new Date()} DEBUT TRAITEMENT CARDIF`);
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    let firstHeaders = [];
    let secondHeaders = [];
    let headers = { firstHeaders, secondHeaders };
    let allContrats = [];
    let errors = [];
    let ocr = { headers: null, allContratsPerCourtier: [], executionTime: 0 };
    const arrRegFirstHeader = {
        courtier: /^courtier$/i,
        commission: /^commission$/i,
        client: /^client$/i,
        contrat: /^contrat$/i,
        supportFinancier: /^Support\s*Financier$/i,
        montantsCommission: /^Montants\s*de\s*commission$/i
    };
    const arrRegSecondHeader = {
        code: /^code$/i,
        libelle: /^libellé$/i,
        reference: /^Référence$/i,
        type: /^Type$/i,
        sousType: /^Sous-type$/i,
        datePriseEnCompte: /^Date\s*de\s*prise\s*en\s*compte$/i,
        dateEffet: /^Date\s*effet$/i,
        numeroClient: /^N°$/i,
        nom: /^Nom$/i,
        prenom: /^Prénom$/i,
        numeroContrat: /^N°$/i,
        produit: /^Produit$/i,
        codeISIN: /^Code\s*ISIN$/i,
        libelleSupportFinancier: /^Libellé$/i,
        classification: /^Classification$/i,
        assiette: /^Assiette$/i,
        taux: /^Taux/i,
        montant: /^Montant$/i
    };
    for (let worksheet of worksheets) {
        if (worksheet.name === 'CommissionsDetaillees') {
            let indexesFirstHeader = {
                courtier: null,
                commission: null,
                client: null,
                contrat: null,
                supportFinancier: null,
                montantsCommission: null
            };
            let indexesSecondHeader = {
                code: null,
                libelle: null,
                reference: null,
                type: null,
                sousType: null,
                datePriseEnCompte: null,
                dateEffet: null,
                numeroClient: null,
                nom: null,
                prenom: null,
                numeroContrat: null,
                produit: null,
                codeISIN: null,
                libelleSupportFinancier: null,
                classification: null,
                assiette: null,
                taux: null,
                montant: null
            };
            let indexesHeader = {
                courtier: {
                    code: null,
                    libelle: null
                },
                commission: {
                    reference: null,
                    type: null,
                    sousType: null,
                    datePriseEnCompte: null,
                    dateEffet: null,
                },
                client: {
                    numeroClient: null,
                    nom: null,
                    prenom: null,
                },
                contrat: {
                    numeroContrat: null,
                    produit: null,
                },
                supportFinancier: {
                    codeISIN: null,
                    libelleSupportFinancier: null,
                    classification: null,
                },
                montantsCommission: {
                    assiette: null,
                    taux: null,
                    montant: null
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
                            errors.push(errorHandler.errorReadExcelCARDIFFH(index));
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
                            errors.push(errorHandler.errorReadExcelCARDIFSH(index));
                        }
                    }
                    headers.secondHeaders = secondHeaders;
                }
                if (rowNumber > 2) {
                    const {contrat, error} = generals.createContratDoubleHeader(row, indexesFirstHeader, indexesSecondHeader, indexesHeader);
                    for (let err of error) {
                        errors.push(errorHandler.errorEmptyCell('CARDIF', err));
                    }
                    allContrats.push(contrat);
                }
            })
        }
    }

    let allContratsPerCourtier = [];
    let courtiers = [];
    allContrats.forEach((element, index) => {
        const courtier = { code: element.courtier.code, libelle: element.courtier.libelle };
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
            if (element.courtier.code === contratCourtier.courtier.code) {
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
    console.log(`${new Date()} FIN TRAITEMENT CARDIF`);
    return ocr;
};

