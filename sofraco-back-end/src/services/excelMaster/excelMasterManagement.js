const path = require('path');
const axios = require('axios');
const ExcelJS = require('exceljs');
const archiver = require('archiver');
const fs = require('fs');
const generals = require('../utils/generals');
const excelFile = require('../utils/excelFile');

const config = require('../../../config.json');
const fileService = require('../utils/files');
const excelMasterAPICIL = require('./excelMasterAPICIL');
const excelMasterAPIVIA = require('./excelMasterAPIVIA');
const excelMasterAPREP = require('./excelMasterAPREP');
const excelMasterAVIVA = require('./excelMasterAVIVA');
const excelMasterCARDIF = require('./excelMasterCARDIF');
const excelMasterCEGEMA = require('./excelMasterCEGEMA');
const excelMasterERES = require('./excelMasterERES');
const excelMasterGENERALI = require('./excelMasterGENERALI');
const excelMasterHODEVA = require('./excelMasterHODEVA');
const excelMasterLOURMEL = require('./excelMasterLOURMEL');
const excelMasterMETLIFE = require('./excelMasterMETLIFE');
const excelMasterMIEL = require('./excelMasterMIEL');
const excelMasterMIE = require('./excelMasterMIE');
const excelMasterMILTIS = require('./excelMasterMILTIS');
const excelMasterMMA = require('./excelMasterMMA');
const excelMasterPAVILLON = require('./excelMasterPAVILLON');
const excelMasterSMATIS = require('./excelMasterSMATIS');
const excelMasterSPVIE = require('./excelMasterSPVIE');
const excelMasterSWISSLIFE = require('./excelMasterSWISSLIFE');
const excelMasterUAFLIFE = require('./excelMasterUAFLIFE');
const excelMasterRecap = require('./excelMasterRecap');
const documentHandler = require('../../handlers/documentHandler');
const correspondanceHandler = require('../../handlers/correspondanceHandler');
const courtierHandler = require('../../handlers/courtierHandler');


exports.create = async () => {
    try {
        console.log(`${new Date()} DEBUT GENERATION EXCEL MASTER`);
        const ocrInfos = await getOCRInfos();
        const excelMasters = await generateExcelMaster(ocrInfos);
        console.log(`${new Date()} FIN GENERATION EXCEL MASTER`);
        console.log(`${new Date()} DEBUT GENERATION ZIP`);
        const excelMastersPerCourtier = groupExcelsByCourtier(excelMasters);
        const excelsMastersZipped = await generateZipFilesEM(excelMastersPerCourtier);
        const singleZip = await generateSingleZipForAllZippedEM(excelsMastersZipped);
        console.log(`${new Date()} FIN GENERATION ZIP`);
        return { excelMasters, excelsMastersZipped, singleZip, message: 'Excel Master générés' };
    } catch (err) {
        console.log(err);
    }
};

const getOCRInfos = async () => {
    try {
        let documents = await documentHandler.getDocuments();
        const docs = documents.filter((doc, index) => {
            return doc.status === 'done';
        });
        let allDocs = [];
        for (let doc of docs) {
            const uploadDateMonth = new Date(doc.upload_date).getMonth();
            const currentMonth = new Date().getMonth();
            if (uploadDateMonth === currentMonth) {
                allDocs.push(doc);
            }
        }
        let infos = [];
        for (let document of allDocs) {
            const company = document.companyName;
            const ocr = document.ocr;
            switch (company.toUpperCase()) {
                case 'APICIL':
                    infos.push(excelMasterAPICIL.getOCRAPICIL(ocr));
                    break;
                case 'APIVIA':
                    infos.push(excelMasterAPIVIA.getOCRAPIVIA(ocr));
                    break;
                case 'APREP':
                    infos.push(excelMasterAPREP.getOCRAPREP(ocr));
                    break;
                case 'APREP ENCOURS':
                    infos.push(excelMasterAPREP.getOCRAPREPENCOURS(ocr));
                    break;
                // case 'AVIVA':
                //     infos = await getOCRAPICIL(file);
                //     break;
                case 'AVIVA SURCO':
                    infos.push(excelMasterAVIVA.getOCRAVIVASURCO(ocr));
                    break;
                case 'CARDIF':
                    infos.push(excelMasterCARDIF.getOCRCARDIF(ocr));
                    break;
                case 'LOURMEL': //LOURMEL
                    infos.push(excelMasterLOURMEL.getOCRLOURMEL(ocr));
                    break;
                case 'CEGEMA':
                    infos.push(excelMasterCEGEMA.getOCRCEGEMA(ocr));
                    break;
                case 'ERES':
                    infos.push(excelMasterERES.getOCRERES(ocr));
                    break;
                case 'GENERALI':
                    infos.push(excelMasterGENERALI.getOCRGENERALI(ocr));
                    break;
                case 'HODEVA':
                    infos.push(excelMasterHODEVA.getOCRHODEVA(ocr));
                    break;
                case 'METLIFE':
                    infos.push(excelMasterMETLIFE.getOCRMETLIFE(ocr));
                    break;
                case 'MIE':
                    infos.push(excelMasterMIE.getOCRMIE(ocr));
                    break;
                case 'MIE MCMS':
                    infos.push(excelMasterMIE.getOCRMIEMCMS(ocr));
                    break;
                case 'MIEL MUTUELLE':
                    infos.push(excelMasterMIEL.getOCRMIEL(ocr));
                    break;
                case 'MIEL MCMS':
                    infos.push(excelMasterMIEL.getOCRMIELMCMS(ocr));
                    break;
                case 'MILTIS':
                    infos.push(excelMasterMILTIS.getOCRMILTIS(ocr));
                    break;
                case 'MMA INCITATION':
                    infos.push(excelMasterMMA.getOCRMMAINCITATION(ocr));
                    break;
                case 'MMA ACQUISITION':
                    infos.push(excelMasterMMA.getOCRMMAACQUISITION(ocr));
                    break;
                case 'MMA ENCOURS':
                    infos.push(excelMasterMMA.getOCRMMAENCOURS(ocr));
                    break;
                case 'PAVILLON PREVOYANCE':
                    infos.push(excelMasterPAVILLON.getOCRPAVILLON(ocr));
                    break;
                case 'PAVILLON MCMS':
                    infos.push(excelMasterPAVILLON.getOCRPAVILLONMCMS(ocr));
                    break;
                case 'SLADE':   // swisslife
                    infos.push(excelMasterSWISSLIFE.getOCRSLADE(ocr));
                    break;
                case 'SPVIE':
                    infos.push(excelMasterSPVIE.getOCRSPVIE(ocr));
                    break;
                case 'SMATIS':
                    infos.push(excelMasterSMATIS.getOCRSMATIS(ocr));
                    break;
                case 'SMATIS MCMS':
                    infos.push(excelMasterSMATIS.getOCRSMATISMCMS(ocr));
                    break;
                case 'SWISSLIFE SURCO':
                    infos.push(excelMasterSWISSLIFE.getOCRSWISSLIFESURCO(ocr));
                    break;
                case 'UAF LIFE PATRIMOINE':
                    infos.push(excelMasterUAFLIFE.getOCRUAFLIFE(ocr));
                    break;
                default:
                    console.log('Pas de compagnie correspondante');
            }
        }
        return infos;
    } catch (err) {
        throw err;
    }

};

const generateExcelMaster = async (ocrInfos) => {
    try {
        const correspondances = await correspondanceHandler.getCorrespondances();
        const allOcr = getAllOCRInfosPerCourtiers(ocrInfos, correspondances);
        const excelMasters = setExcelMaster(allOcr);
        return excelMasters;

    } catch (err) {
        throw err;
    }
};

const readExcelMasterContent = async (file) => {
    try {
        console.log(`${new Date()} DEBUT RECUPERATION CONTENU EXCEL MASTER`);
        const worksheets = await excelFile.checkExcelFileAndGetWorksheets(file);
        let sheetsInformations = [];
        for (let worksheet of worksheets) {
            let sheet = { name: worksheet.name, content: [] };
            worksheet.eachRow((row, rowNumber) => {
                let rowValues = [];
                row.eachCell((cell, colNumber) => {
                    rowValues.push({ address: cell.address, value: cell.value });
                });
                sheet.content.push(rowValues);
            });
            sheetsInformations.push(sheet);
        }
        console.log(`${new Date()} FIN RECUPERATION CONTENU EXCEL MASTER`);
        return sheetsInformations;
    } catch (err) {
        throw err;
    }
};

const editDataOCR = (ocr, datas, d, companyName) => {
    if (ocr.companyGlobalName === companyName) {
        if (datas.length > 0) {
            for (let data of datas) {
                if (data.companyName === companyName) {
                    data.ocr.push(ocr);
                    break;
                } else {
                    d.companyGlobalName = companyName;
                    d.companyName = companyName;
                    d.ocr.push(ocr);
                    datas.push(d);
                    break;
                }
            }
        } else {
            d.companyGlobalName = companyName;
            d.companyName = companyName;
            d.ocr.push(ocr);
            datas.push(d);
        }
    }

};

const removeDoublonsOcr = (datas, ocrPerCourtier) => {
    for (let data of datas) {
        for (let d of data.ocr) {
            for (let ocr of ocrPerCourtier.infos) {
                if (d === ocr) {
                    ocrPerCourtier.infos.splice(ocrPerCourtier.infos.indexOf(ocr), 1);
                }
            }
        }
    }
};

const getAllOCRInfosPerCourtiers = (ocrInfos, correspondances) => {
    let allOCRPerCourtiers = [];
    let resteOcrInfos = [];
    for (let correspondance of correspondances) {
        const courtier = correspondance.courtier;
        let infos = [];
        for (let company of correspondance.companies) {
            for (let ocr of ocrInfos) {
                const indexOcr = ocrInfos.indexOf(ocr);
                for (let dataCourtierOCR of ocr) {
                    const indexDataCourtierOcr = ocr.indexOf(dataCourtierOCR);
                    if (dataCourtierOCR.companyName === 'APIVIA' || dataCourtierOCR.companyName === 'ERES' || dataCourtierOCR.companyName === 'HODEVA') {
                        if ((dataCourtierOCR.companyName === company.company || dataCourtierOCR.companyGlobalName === company.companyGlobalName) &&
                            dataCourtierOCR.infosOCR.code.code.toUpperCase().match(company.code.toUpperCase())) {
                            if (company.particular !== '') {
                                dataCourtierOCR.particular = company.particular;
                            }
                            infos.push(dataCourtierOCR);
                            ocr.splice(indexDataCourtierOcr, 1);
                            ocrInfos.splice(indexOcr, 1, ocr);
                            break;
                        }
                    } else {
                        let corrCode = company.code.toString();
                        if (dataCourtierOCR.infosOCR.code.code !== null) {
                            let dataCode = dataCourtierOCR.infosOCR.code.code.toString();
                            const regChiffres = /^\d+$/;
                            if (corrCode.match(regChiffres) && dataCode.match(regChiffres)) {
                                if ((dataCourtierOCR.companyName === company.company || dataCourtierOCR.companyGlobalName === company.companyGlobalName) &&
                                    dataCode.match(corrCode)) {
                                    if (company.particular !== '') {
                                        dataCourtierOCR.particular = company.particular;
                                    }
                                    infos.push(dataCourtierOCR);
                                    ocr.splice(indexDataCourtierOcr, 1);
                                    ocrInfos.splice(indexOcr, 1, ocr);
                                    break;
                                }
                            } else {
                                if ((dataCourtierOCR.companyName === company.company || dataCourtierOCR.companyGlobalName === company.companyGlobalName) &&
                                    dataCode === corrCode) {
                                    if (company.particular !== '') {
                                        dataCourtierOCR.particular = company.particular;
                                    }
                                    infos.push(dataCourtierOCR);
                                    ocr.splice(indexDataCourtierOcr, 1);
                                    ocrInfos.splice(indexOcr, 1, ocr);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (infos.length > 0) {
            allOCRPerCourtiers.push({
                courtier,
                infos
            });
        }
    }
    resteOcrInfos = ocrInfos;
    let infos = [];
    let allResteOCR = [];
    for (let ocr of resteOcrInfos) {
        for (let dataCourtierOCR of ocr) {
            infos.push(dataCourtierOCR);
        }
    }
    if (infos.length > 0) {
        allResteOCR = {
            courtier: null,
            infos
        };
    }
    const allOcr = [...allOCRPerCourtiers, allResteOCR];
    return allOcr;
};

const setExcelMaster = async (allOcr) => {
    let excelMasters = [];
    for (let ocrPerCourtier of allOcr) {
        let excelMaster;
        let workbook;
        let recapWorkSheet;
        let cr;
        let courtierCabinet;
        let courtierNomPrenom;
        if (ocrPerCourtier.courtier !== null) {
            cr = await courtierHandler.getCourtierById(ocrPerCourtier.courtier);
            console.log(`${new Date()} DEBUT GENERATION EXCEL MASTER : ${cr.cabinet}`);
            excelMaster = {
                courtier: ocrPerCourtier.courtier,
                cabinet: cr !== null ? cr.cabinet : '',
                create_date: new Date(),
                path: null,
                content: null,
                type: 'excel',
                is_enabled: true
            }
            courtierCabinet = cr !== null ? cr.cabinet.replace(/[/]/g, '_') : `cabMet${Date.now()}`;
            courtierNomPrenom = `${cr.lastName}_${cr.firstName}`;
        } else {
            console.log(`${new Date()} DEBUT GENERATION EXCEL MASTER : reste de données`);
            excelMaster = {
                courtier: ocrPerCourtier.courtier,
                cabinet: 'RESTE_DONNEES',
                create_date: new Date(),
                path: null,
                content: null,
                type: 'excel',
                is_enabled: true
            }
        }

        let datas = [];
        for (let ocr of ocrPerCourtier.infos) {
            let d = { companyName: null, companyName: null, ocr: [] };
            editDataOCR(ocr, datas, d, 'CARDIF');
            editDataOCR(ocr, datas, d, 'CEGEMA');
        }
        removeDoublonsOcr(datas, ocrPerCourtier);
        ocrPerCourtier.infos = [...ocrPerCourtier.infos, ...datas];
        workbook = new ExcelJS.Workbook();
        recapWorkSheet = workbook.addWorksheet('RECAP');
        let month = new Date().getMonth();
        month = (month + 1 < 10) ? `0${month + 1}` : `${month + 1}`;
        const date = `${month}${new Date().getFullYear()}`;
        if (ocrPerCourtier.company === 'METLIFE') {
            let workSheet = workbook.addWorksheet(ocrPerCourtier.companyGlobalName);
            workSheet.properties.defaultColWidth = 20;
            excelMasterMETLIFE.createWorkSheetMETLIFE(workSheet, ocrPerCourtier);
        }
        else {
            for (let ocr of ocrPerCourtier.infos) {
                if (ocr.companyName && ocr.companyName !== null) {
                    if (!workbook.worksheets.some(worksheet => worksheet.name === ocr.companyGlobalName)) {
                        let workSheet;
                        if (ocr.companyGlobalName === 'MMA') {
                            workSheet = workbook.addWorksheet(ocr.companyName);
                        } else {
                            workSheet = workbook.addWorksheet(ocr.companyGlobalName);
                        }
                        workSheet.properties.defaultColWidth = 20;
                        try {
                            createWorkSheetCompany(ocr, workSheet, ocrPerCourtier);
                        } catch (err) {
                            throw err;
                        }
                    }
                }
            }
        }

        try {
            const sheets = excelMasterRecap.getWorkSheets(workbook);
            excelMasterRecap.createWorkSheetRECAP(recapWorkSheet, sheets);
            if (excelMaster.courtier === null) {
                excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}_RESTE_DONNEES.xlsx`);
            } else {
                if (cr.role === 'courtier') {
                    excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}${(courtierCabinet) ? courtierCabinet : ''}.xlsx`);
                }
                if (cr.role === 'mandataire') {
                    excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}${(courtierCabinet) ? courtierCabinet : ''}_${courtierNomPrenom}.xlsx`);
                }
            }
            await workbook.xlsx.writeFile(excelPath);
            const excelContent = await readExcelMasterContent(excelPath);
            if (ocrPerCourtier.courtier !== null) {
                console.log(`${new Date()} FIN GENERATION EXCEL MASTER : ${cr.cabinet}`);
            } else {
                console.log(`${new Date()} FIN GENERATION EXCEL MASTER : reste de données`);
            }
            excelMaster.path = excelPath;
            excelMaster.content = excelContent;
            excelMasters.push(excelMaster);
        } catch (err) {
            throw err;
        }
    }
    return excelMasters;
}

const createWorkSheetCompany = (ocr, workSheet, ocrPerCourtier) => {
    switch (ocr.companyName.toUpperCase()) {
        case 'APICIL':
            excelMasterAPICIL.createWorkSheetAPICIL(workSheet, ocr);
            break;
        case 'APIVIA':
            excelMasterAPIVIA.createWorkSheetAPIVIA(workSheet, ocr);
            break;
        case 'APREP':
            excelMasterAPREP.createWorkSheetAPREP(workSheet, ocr);
            break;
        case 'APREP ENCOURS':
            excelMasterAPREP.createWorkSheetAPREPENCOURS(workSheet, ocr);
            break;
        // case 'AVIVA':
        //     infos = await readExcel(file);
        //     break;
        case 'AVIVA SURCO':
            excelMasterAVIVA.createWorkSheetAVIVASURCO(workSheet, ocr);
            break;
        case 'CARDIF':
            excelMasterCARDIF.createWorkSheetCARDIF(workSheet, ocr);
            break;
        case 'CEGEMA':
            excelMasterCEGEMA.createWorkSheetCEGEMA(workSheet, ocr);
            break;
        case 'ERES':
            excelMasterERES.createWorkSheetERES(workSheet, ocr);
            break;
        case 'GENERALI':
            excelMasterGENERALI.createWorkSheetGENERALI(workSheet, ocr);
            break;
        case 'HODEVA':
            excelMasterHODEVA.createWorkSheetHODEVA(workSheet, ocr);
            break;
        case 'LOURMEL':  //CBP FRANCE
            excelMasterLOURMEL.createWorkSheetLOURMEL(workSheet, ocr);
            break;
        case 'METLIFE':
            excelMasterMETLIFE.createWorkSheetMETLIFE(workSheet, ocr);
            break;
        case 'MIE':
            excelMasterMIE.createWorkSheetMIE(workSheet, ocr);
            break;
        case 'MIE MCMS':
            excelMasterMIE.createWorkSheetMIEMCMS(workSheet, ocr);
            break;
        case 'MIEL MUTUELLE':
            excelMasterMIEL.createWorkSheetMIEL(workSheet, ocr);
            break;
        case 'MIEL MCMS':
            excelMasterMIEL.createWorkSheetMIELMCMS(workSheet, ocr);
            break;
        case 'MILTIS':
            excelMasterMILTIS.createWorkSheetMILTIS(workSheet, ocr);
            break;
        case 'MMA INCITATION':
            excelMasterMMA.createWorkSheetMMAINCITATION(workSheet, ocr);
            break;
        case 'MMA ACQUISITION':
            excelMasterMMA.createWorkSheetMMAACQUISITION(workSheet, ocr);
            break;
        case 'MMA ENCOURS':
            excelMasterMMA.createWorkSheetMMAENCOURS(workSheet, ocr);
            break;
        case 'PAVILLON PREVOYANCE':
            excelMasterPAVILLON.createWorkSheetPAVILLON(workSheet, ocr);
            break;
        case 'PAVILLON MCMS':
            excelMasterPAVILLON.createWorkSheetPAVILLONMCMS(workSheet, ocr);
            break;
        case 'SLADE':   // SWISSLIFE
            excelMasterSWISSLIFE.createWorkSheetSLADE(workSheet, ocr);
            break;
        case 'SPVIE':
            excelMasterSPVIE.createWorkSheetSPVIE(workSheet, ocr);
            break;
        // case 'SMATIS':
        //     excelMasterSMATIS.createWorkSheetSMATIS(workSheet, ocr);
        //     break;
        case 'SMATIS MCMS':
            excelMasterSMATIS.createWorkSheetSMATISMCMS(workSheet, ocr);
            break;
        case 'SWISSLIFE SURCO':
            excelMasterSWISSLIFE.createWorkSheetSWISSLIFESURCO(workSheet, ocr);
            break;
        case 'UAF LIFE PATRIMOINE':
            excelMasterUAFLIFE.createWorkSheetUAFLIFE(workSheet, ocr);
            break;
        default:
            console.log('Pas de compagnie correspondante');
    }
};

const groupExcelsByCourtier = (excelMasters) => {
    let courtiers = [];
    let excelMastersPerCourtier = []
    for (let excel of excelMasters) {
        if (excel.courtier === null) {
            courtiers.push({ cabinet: excel.cabinet, courtier: null });
        }
        if (!courtiers.includes({ cabinet: excel.cabinet, courtier: excel.courtier })) {
            courtiers.push({ cabinet: excel.cabinet, courtier: excel.courtier });
        }
    };
    for (let courtier of courtiers) {
        let eM = { courtier, excelMasters: [] };
        for (let excel of excelMasters) {
            if (excel.cabinet === courtier.cabinet) {
                eM.excelMasters.push(excel);
            }
        };
        excelMastersPerCourtier.push(eM);
    }
    return excelMastersPerCourtier;
};

const generateZipFilesEM = async (excelMastersPerCourtier) => {
    const excelMastersZips = [];
    for (let em of excelMastersPerCourtier) {
        if (em.excelMasters.length > 0) {
            const zipPath = await generateZip(em.courtier.cabinet.replace(/[/]/g, '_'), em.excelMasters);
            const excelMastersZip = {
                courtier: em.courtier.courtier,
                cabinet: em.courtier.cabinet,
                create_date: new Date(),
                path: zipPath,
                type: 'zip',
                is_enabled: true
            };
            excelMastersZips.push(excelMastersZip);
        }
    }
    return excelMastersZips;
};

const generateSingleZipForAllZippedEM = async (excelsMastersZipped) => {
    console.log(`${new Date()} Generate single zip`);
    let month = new Date().getMonth();
    month = (month + 1 < 10) ? `0${month + 1}` : `${month + 1}`;
    const date = `${month}${new Date().getFullYear()}`;
    const singleZip = await generateZip(`all_files_${date}`, excelsMastersZipped);
    const singleZipEM = {
        courtier: null,
        company: 'ALL COMPANIES',
        create_date: new Date(),
        ocr: null,
        path: singleZip,
        type: 'zip of zip',
        is_enabled: true
    };
    console.log(`${new Date()} Single zip DONE`);
    return singleZipEM;
}

const generateZip = async (zipName, files) => {
    const zipPath = path.join(__dirname, '..', '..', '..', 'documents', 'archived', `${zipName}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });
    output.on('close', () => {
        // console.log(archive.pointer() + ' total bytes');
    });
    output.on('end', () => {
        console.log('Zip of file generated');
    });
    output.on('error', (err) => {
        console.log(err);
    });
    archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
            console.log(err);
        } else {
            throw err;
        }
    });
    archive.on('error', (err) => {
        throw err;
    });
    archive.pipe(output);
    files.forEach((e, i) => {
        const fileName = fileService.getFileName(e.path);
        archive.file(e.path, { name: fileName });
    });
    await archive.finalize();
    return zipPath
};