const { performance } = require('perf_hooks');
const time = require('../utils/time');
const generals = require('../utils/generals');
const excelFile = require('../utils/excelFile');

const { workerData, parentPort } = require('worker_threads');
const errorHandler = require('../utils/errorHandler');
if (parentPort !== null) {
    parentPort.postMessage({ aviva: workerData });
}

exports.readExcelAVIVASURCO = async (file) => {
    console.log(`${new Date()} DEBUT TRAITEMENT AVIVA SURCO`);
    const excecutionStartTime = performance.now();
    const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
    let headers = [];
    let errors = [];
    let allContrats = [];
    let ocr = { headers: [], allContratsPerCourtier: [], executionTime: 0 };
    for (let worksheet of worksheets) {
        let cabinetCourtier = { apporteur: '', contrats: [] };
        const indexesHeader = {
            ireseau: null,
            iregion: null,
            iinspecteur: null,
            icodeInter: null,
            inomApporteur: null,
            inumeroContrat: null,
            inumeroCouverture: null,
            inomAssure: null,
            inomContrat: null,
            inomGarantie: null,
            ifamilleContrat: null,
            itypeMVT: null,
            idateEffetMVT: null,
            imoisEffetMVT: null,
            iprodBrute: null,
            iprodObjectifAE: null,
            iprodCalculAE: null,
        };
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                row.eachCell((cell, colNumber) => {
                    headers.push((typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value);
                    setIndexHeaders(cell, indexesHeader);
                });
                for (let index in indexesHeader) {
                    if (indexesHeader[index] === null) {
                        errors.push(errorHandler.errorReadExcelAVIVA(index));
                    }
                }
            }
            if (rowNumber > 1) {
                const contrat = {
                    reseau: (indexesHeader.ireseau !== null) && ((typeof row.getCell(indexesHeader.ireseau[0]).value === 'string') ?
                        row.getCell(indexesHeader.ireseau[0]).value.trim() :
                        row.getCell(indexesHeader.ireseau[0]).value),
                    region: (indexesHeader.iregion !== null) && ((typeof row.getCell(indexesHeader.iregion[0]).value === 'string') ?
                        row.getCell(indexesHeader.iregion[0]).value.trim() :
                        row.getCell(indexesHeader.iregion[0]).value),
                    inspecteur: (indexesHeader.iinspecteur !== null) && ((typeof row.getCell(indexesHeader.iinspecteur[0]).value === 'string') ?
                        row.getCell(indexesHeader.iinspecteur[0]).value.trim() :
                        row.getCell(indexesHeader.iinspecteur[0]).value),
                    codeInter: (indexesHeader.icodeInter !== null) && ((typeof row.getCell(indexesHeader.icodeInter[0]).value === 'string') ?
                        row.getCell(indexesHeader.icodeInter[0]).value.trim() :
                        row.getCell(indexesHeader.icodeInter[0]).value),
                    nomApporteur: (indexesHeader.inomApporteur !== null) && ((typeof row.getCell(indexesHeader.inomApporteur[0]).value === 'string') ?
                        row.getCell(indexesHeader.inomApporteur[0]).value.trim() :
                        row.getCell(indexesHeader.inomApporteur[0]).value),
                    numeroContrat: (indexesHeader.inumeroContrat !== null) && ((typeof row.getCell(indexesHeader.inumeroContrat[0]).value === 'string') ?
                        row.getCell(indexesHeader.inumeroContrat[0]).value.trim() :
                        row.getCell(indexesHeader.inumeroContrat[0]).value),
                    numeroCouverture: (indexesHeader.inumeroCouverture !== null) && ((typeof row.getCell(indexesHeader.inumeroCouverture[0]).value === 'string') ?
                        row.getCell(indexesHeader.inumeroCouverture[0]).value.trim() :
                        row.getCell(indexesHeader.inumeroCouverture[0]).value),
                    nomAssure: (indexesHeader.inomAssure !== null) && ((typeof row.getCell(indexesHeader.inomAssure[0]).value === 'string') ?
                        row.getCell(indexesHeader.inomAssure[0]).value.trim() :
                        row.getCell(indexesHeader.inomAssure[0]).value),
                    nomContrat: (indexesHeader.inomContrat !== null) && ((typeof row.getCell(indexesHeader.inomContrat[0]).value === 'string') ?
                        row.getCell(indexesHeader.inomContrat[0]).value.trim() :
                        row.getCell(indexesHeader.inomContrat[0]).value),
                    nomGarantie: (indexesHeader.inomGarantie !== null) && ((typeof row.getCell(indexesHeader.inomGarantie[0]).value === 'string') ?
                        row.getCell(indexesHeader.inomGarantie[0]).value.trim() :
                        row.getCell(indexesHeader.inomGarantie[0]).value),
                    familleContrat: (indexesHeader.ifamilleContrat !== null) && ((typeof row.getCell(indexesHeader.ifamilleContrat[0]).value === 'string') ?
                        row.getCell(indexesHeader.ifamilleContrat[0]).value.trim() :
                        row.getCell(indexesHeader.ifamilleContrat[0]).value),
                    typeMVT: (indexesHeader.itypeMVT !== null) && ((typeof row.getCell(indexesHeader.itypeMVT[0]).value === 'string') ?
                        row.getCell(indexesHeader.itypeMVT[0]).value.trim() :
                        row.getCell(indexesHeader.itypeMVT[0]).value),
                    dateEffetMVT: (indexesHeader.idateEffetMVT !== null) && ((typeof row.getCell(indexesHeader.idateEffetMVT[0]).value === 'string') ?
                        row.getCell(indexesHeader.idateEffetMVT[0]).value.trim() :
                        row.getCell(indexesHeader.idateEffetMVT[0]).value),
                    moisEffetMVT: (indexesHeader.imoisEffetMVT !== null) && ((typeof row.getCell(indexesHeader.imoisEffetMVT[0]).value === 'string') ?
                        row.getCell(indexesHeader.imoisEffetMVT[0]).value.trim() :
                        row.getCell(indexesHeader.imoisEffetMVT[0]).value),
                    prodBrute: (indexesHeader.iprodBrute !== null) && ((typeof row.getCell(indexesHeader.iprodBrute[0]).value === 'string') ?
                        row.getCell(indexesHeader.iprodBrute[0]).value.trim() :
                        row.getCell(indexesHeader.iprodBrute[0]).value),
                    prodObjectifAE: (indexesHeader.iprodObjectifAE !== null) && ((typeof row.getCell(indexesHeader.iprodObjectifAE[0]).value === 'string') ?
                        row.getCell(indexesHeader.iprodObjectifAE[0]).value.trim() :
                        row.getCell(indexesHeader.iprodObjectifAE[0]).value),
                    prodCalculAE: (indexesHeader.iprodCalculAE !== null) && ((typeof row.getCell(indexesHeader.iprodCalculAE[0]).value === 'string') ?
                        row.getCell(indexesHeader.iprodCalculAE[0]).value.trim() :
                        row.getCell(indexesHeader.iprodCalculAE[0]).value),
                };
                if (contrat.codeInter && contrat.codeInter.match(/Total.+/i)) {
                    cabinetCourtier.contrats.push(contrat);
                    allContrats.push(cabinetCourtier);
                    cabinetCourtier = { apporteur: '', contrats: [] };

                } else {
                    cabinetCourtier.contrats.push(contrat);
                    cabinetCourtier.apporteur = contrat.codeInter;
                }
            }
        })
    }

    const allContratsPerCourtier = generals.regroupContratByCourtier(allContrats, 'apporteur');

    ocr = { headers, allContratsPerCourtier, errors, executionTime: 0, executionTimeMS: 0 };
    const excecutionStopTime = performance.now();
    const executionTimeMS = excecutionStopTime - excecutionStartTime;
    const executionTime = time.millisecondToTime(executionTimeMS);
    console.log('Total Execution time : ', executionTime);
    ocr.executionTime = executionTime;
    ocr.executionTimeMS = executionTimeMS;
    console.log(`${new Date()} FIN TRAITEMENT AVIVA SURCO`);
    return ocr;
};

const setIndexHeaders = (cell, indexesHeader) => {
    const regReseau = /reseau/i;
    const regRegion = /region/i;
    const regInspecteur = /inspecteur/i;
    const regCodeInter = /code inter/i;
    const regNomApporteur = /nom de l'apporteur/i;
    const regNumeroContrat = /n° de contrat/i;
    const regNumeroCouverture = /n° de couverture/i;
    const regNomAssure = /nom de l'assure/i;
    const regNomContrat = /nom contrat/i;
    const regNomGarantie = /nom garantie/i;
    const regFamilleContrat = /famille contrat/i;
    const regTypeMVT = /type mvt/i;
    const regDateEffetMVT = /date effet mvt/i;
    const regMoisEffetMVT = /mois effet mvt/i;
    const regProdBrute = /prod brute/i;
    const regProdObjectifAE = /prod pour objectif ae/i;
    const regProdCalculAE = /prod pour calcul ae/i;
    if (cell.value.match(regReseau)) {
        indexesHeader.ireseau = [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value];
    }
    if (cell.value.match(regRegion)) {
        indexesHeader.iregion = [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value];
    }
    if (cell.value.match(regInspecteur)) {
        indexesHeader.iinspecteur = [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value];
    }
    if (cell.value.match(regCodeInter)) {
        indexesHeader.icodeInter = [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value];
    }
    if (cell.value.match(regNomApporteur)) {
        indexesHeader.inomApporteur = [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value];
    }
    if (cell.value.match(regNumeroContrat)) {
        indexesHeader.inumeroContrat = [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value];
    }
    if (cell.value.match(regNumeroCouverture)) {
        indexesHeader.inumeroCouverture = [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value];
    }
    if (cell.value.match(regNomAssure)) {
        indexesHeader.inomAssure = [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value];
    }
    if (cell.value.match(regNomContrat)) {
        indexesHeader.inomContrat = [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value];
    }
    if (cell.value.match(regNomGarantie)) {
        indexesHeader.inomGarantie = [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value];
    }
    if (cell.value.match(regFamilleContrat)) {
        indexesHeader.ifamilleContrat = [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value];
    }
    if (cell.value.match(regTypeMVT)) {
        indexesHeader.itypeMVT = [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value];
    }
    if (cell.value.match(regDateEffetMVT)) {
        indexesHeader.idateEffetMVT = [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value];
    }
    if (cell.value.match(regMoisEffetMVT)) {
        indexesHeader.imoisEffetMVT = [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value];
    }
    if (cell.value.match(regProdBrute)) {
        indexesHeader.iprodBrute = [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value];
    }
    if (cell.value.match(regProdObjectifAE)) {
        indexesHeader.iprodObjectifAE = [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value];
    }
    if (cell.value.match(regProdCalculAE)) {
        indexesHeader.iprodCalculAE = [colNumber, (typeof cell.value === 'string' || cell.value !== '') ? cell.value.trim() : cell.value];
    }
};
