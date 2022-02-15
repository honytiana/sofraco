const { performance } = require('perf_hooks');
const time = require('../utils/time');
const fileService = require('../utils/files');
const excelFile = require('../utils/excelFile');
const generals = require('../utils/generals');
const errorHandler = require('../utils/errorHandler');

const { workerData, parentPort } = require('worker_threads');
if (parentPort !== null) {
    parentPort.postMessage({ smatis: workerData });
}

exports.readExcelSMATIS = async (file) => { };

exports.readExcelSMATISMCMS = async (file) => {
    console.log(`${new Date()} DEBUT TRAITEMENT SMATIS MCMS`);
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    const fileName = fileService.getFileNameWithoutExtension(file);
    // const version = fileName.replace(/(\d+).+/, '$1');
    let allContrats = [];
    let headers = { firstHeader: [], secondHeader: [] };
    let errors = [];
    let ocr = { headers: null, allContratsPerCourtier: [], smatisVersion: null, executionTime: 0 };
    // let smatisAxiom = false;
    // switch (version) {
    //     case '01':
    //         smatisAxiom = true;
    //         break;
    // }
    const arrReg = {
        debutPeriodeCotisation: /^Début\s*de\s*période\s*de\s*cotisation\s*$/i,
        finDePeriodeCotisation: /^Fin\s*de\s*période\s*de\s*cotisation\s*$/i,
        nomGarantie: /^Nom\s*de\s*la\s*garantie\s*$/i,
        souscripteurContratGroupe: /^Souscripteur\s*du\s*contrat\s*groupe\s*$/i,
        numPayeur: /^N°\s*payeur\s*$/i,
        nomPayeur: /^Nom\s*payeur\s*$/i,
        codeCourtier: /^Code\s*courtier\s*$/i,
        nomCourtier: /^Nom\s*du\s*courtier\s*$/i,
        numContratGroupe: /^N°\s*de\s*contrat\s*groupe\s*$/i,
        dateDebutContratAdhesion: /^Date\s*début\s*contrat\s*ou\s*d'adhésion\s*$/i,
        statusContratAdhesion: /^Statut\s*contrat\s*ou\s*adhésion\s*$/i,
        dateFinContratAdhesion: /^Date\s*fin\s*contrat\s*ou\s*adhésion\s*$/i,
        etapeImpaye: /^Etape\s*impayé\s*[/]\s*Motif\s*de\s*résilation\s*$/i,
        periodiciteCotisation: /^Périodicité\s*cotisation\s*$/i,
        cotisationPayeePeriodeTTC: /^Cotisation\s*payée\s*Période\s*TTC\s*$/i,
        cotisationPayeePeriodeHT: /^Cotisation\s*payée\s*Période\s*HT\s*$/i,
        taux: /^Taux\s*$/i,
        typeCommission: /^Type\s*de\s*commission\s*$/i,
        montantCommission: /^Montant\s*commission\s*$/i,
        courtier: /^COURTIER$/i,
        fondateur: /^FONDATEUR$/i,
        sogeas: /^SOGEAS$/i,
        procedure: /^PROCEDURE$/i
    };
    worksheets.forEach((worksheet, index) => {
        if (index === 1) {
            let indexesHeader = {
                debutPeriodeCotisation: null,
                finDePeriodeCotisation: null,
                nomGarantie: null,
                souscripteurContratGroupe: null,
                numPayeur: null,
                nomPayeur: null,
                codeCourtier: null,
                nomCourtier: null,
                numContratGroupe: null,
                dateDebutContratAdhesion: null,
                statusContratAdhesion: null,
                dateFinContratAdhesion: null,
                etapeImpaye: null,
                periodiciteCotisation: null,
                cotisationPayeePeriodeTTC: null,
                cotisationPayeePeriodeHT: null,
                taux: null,
                typeCommission: null,
                montantCommission: null,
                courtier: null,
                fondateur: null,
                sogeas: null,
                procedure: null
            };
            let rowNumberHeader;
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    headers.firstHeader.push((typeof row.getCell('D').value === 'string') ?
                        row.getCell('D').value.trim() :
                        row.getCell('D').value);
                }
                if (rowNumber === 2) {
                    headers.firstHeader.push((typeof row.getCell('N').value === 'string') ?
                        row.getCell('N').value.trim() :
                        row.getCell('N').value);
                }
                if (rowNumber === 3) {
                    rowNumberHeader = rowNumber;
                    row.eachCell((cell, colNumber) => {
                        const currentCellValue = (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim().replace(/\n/g, ' ') : cell.value.replace(/\n/g, ' ');
                        if (headers.secondHeader.indexOf(currentCellValue) < 0) {
                            headers.secondHeader.push(currentCellValue);
                            generals.setIndexHeaders(cell, colNumber, arrReg, indexesHeader);

                        }
                    });
                    for (let index in indexesHeader) {
                        if (indexesHeader[index] === null) {
                            errors.push(errorHandler.errorReadExcelSMATIS(index));
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

    const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'codeCourtier');

    ocr = { headers, allContratsPerCourtier, errors, smatisVersion: null, executionTime: 0, executionTimeMS: 0 };
    // if (smatisAxiom) {
    //     ocr.smatisVersion = 'smatisAxiom';
    // }
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log(`${new Date()} FIN TRAITEMENT SMATIS MCMS`);
    return ocr;
};

const getContratSMATISMCMS = (row) => {
    const contrat = {
        debutPeriodeCotisation: (typeof row.getCell('A').value === 'string') ?
            row.getCell('A').value.trim() :
            (row.getCell('A').value !== null) ? new Date(0, 0, row.getCell('A').value, 0, 0, 0) : '',
        finDePeriodeCotisation: (typeof row.getCell('B').value === 'string') ?
            row.getCell('B').value.trim() :
            (row.getCell('B').value !== null) ? new Date(0, 0, row.getCell('B').value, 0, 0, 0) : '',
        nomGarantie: (typeof row.getCell('C').value === 'string') ?
            row.getCell('C').value.trim() :
            row.getCell('C').value,
        souscripteurContratGroupe: (typeof row.getCell('D').value === 'string') ?
            row.getCell('D').value.trim() :
            row.getCell('D').value,
        numPayeur: (typeof row.getCell('E').value === 'string') ?
            row.getCell('E').value.trim() :
            row.getCell('E').value,
        nomPayeur: (typeof row.getCell('F').value === 'string') ?
            row.getCell('F').value.trim() :
            row.getCell('F').value,
        codeCourtier: (typeof row.getCell('G').value === 'string') ?
            row.getCell('G').value.trim() :
            row.getCell('G').value,
        nomCourtier: (typeof row.getCell('H').value === 'string') ?
            row.getCell('H').value.trim() :
            row.getCell('H').value,
        numContratGroupe: (typeof row.getCell('I').value === 'string') ?
            row.getCell('I').value.trim() :
            row.getCell('I').value,
        dateDebutContratAdhesion: (typeof row.getCell('J').value === 'string') ?
            row.getCell('J').value.trim() :
            row.getCell('J').value,
        statusContratAdhesion: (typeof row.getCell('K').value === 'string') ?
            row.getCell('K').value.trim() :
            (row.getCell('K').value !== null) ? new Date(0, 0, row.getCell('N').value, 0, 0, 0) : '',
        dateFinContratAdhesion: (typeof row.getCell('L').value === 'string') ?
            row.getCell('L').value.trim() :
            (row.getCell('L').value !== null) ? new Date(0, 0, row.getCell('L').value, 0, 0, 0) : '',
        etapeImpaye: (typeof row.getCell('M').value === 'string') ?
            row.getCell('M').value.trim() :
            row.getCell('M').value,
        periodiciteCotisation: (typeof row.getCell('N').value === 'string') ?
            row.getCell('N').value.trim() :
            row.getCell('N').value,
        cotisationPayeePeriodeTTC: (typeof row.getCell('O').value === 'string') ?
            row.getCell('O').value.trim() :
            row.getCell('O').value,
        cotisationPayeePeriodeHT: (typeof row.getCell('P').value === 'string') ?
            row.getCell('P').value.trim() :
            row.getCell('P').value,
        taux: (typeof row.getCell('Q').value === 'string') ?
            row.getCell('Q').value.trim() :
            row.getCell('Q').value,
        typeCommission: (typeof row.getCell('R').value === 'string') ?
            row.getCell('R').value.trim() :
            row.getCell('R').value,
        montantCommission: (typeof row.getCell('S').value === 'string') ?
            row.getCell('S').value.trim() :
            row.getCell('S').value,
        courtier: (typeof row.getCell('T').value === 'string') ?
            row.getCell('T').value.trim() :
            row.getCell('T').value,
        fondateur: (typeof row.getCell('U').value === 'string') ?
            row.getCell('U').value.trim() :
            row.getCell('U').value,
        sogeas: (typeof row.getCell('V').value === 'string') ?
            row.getCell('V').value.trim() :
            row.getCell('V').value,
        procedure: (typeof row.getCell('W').value === 'string') ?
            row.getCell('W').value.trim() :
            row.getCell('W').value
    };
    return contrat;
};
