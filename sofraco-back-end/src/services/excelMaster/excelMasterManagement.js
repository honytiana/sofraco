const path = require('path');
const axios = require('axios');
const ExcelJS = require('exceljs');
const archiver = require('archiver');
const fs = require('fs');

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


exports.create = async (authorization) => {
    try {
        console.log('DEBUT GENERATION EXCEL MASTER');
        const ocrInfos = await getOCRInfos();
        const excelMasters = await generateExcelMaster(ocrInfos);
        console.log('FIN GENERATION EXCEL MASTER');
        console.log('DEBUT GENERATION ZIP');
        const excelMastersPerCourtier = groupExcelsByCourtier(excelMasters);
        const excelsMastersZipped = await generateZipFilesEM(excelMastersPerCourtier);
        const singleZip = await generateSingleZipForAllZippedEM(excelsMastersZipped);
        console.log('FIN GENERATION ZIP');
        return { excelMasters, excelsMastersZipped, singleZip, message: 'Excel Master générés' };
    } catch (err) {
        console.log(err);
    }
};

const getOCRInfos = async () => {
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
            case 'CBP FRANCE': //LOURMEL
                infos.push(excelMasterLOURMEL.getOCRLOURMEL(ocr));
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

}

const generateExcelMaster = async (ocrInfos) => {
    let excelMasters = [];
    let allOCRPerCourtiers = [];
    try {
        const correspondances = await correspondanceHandler.getCorrespondances();
        for (let correspondance of correspondances) {
            const courtier = correspondance.courtier;
            let infos = [];
            for (let company of correspondance.companies) {
                for (let ocr of ocrInfos) {
                    for (let dataCourtierOCR of ocr) {
                        if ((dataCourtierOCR.companyName === company.company || dataCourtierOCR.companyGlobalName === company.companyGlobalName) &&
                            dataCourtierOCR.infosOCR.code.code === company.code) {
                            if (company.particular !== '') {
                                dataCourtierOCR.particular = company.particular;
                            }
                            infos.push(dataCourtierOCR);
                            break;
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
        for (let ocrPerCourtier of allOCRPerCourtiers) {
            let excelMaster;
            let cr;
            let courtier;
            let workbook;
            let recapWorkSheet;
            let date;
            // if (!ocrPerCourtier.courtier) {
            //     excelMaster = {
            //         courtier: null,
            //         cabinet: ocrPerCourtier.infosOCR.code.cabinet,
            //         create_date: new Date(),
            //         path: null,
            //         type: 'excel',
            //         is_enabled: true
            //     }
            //     courtier = ocrPerCourtier.infosOCR.code.cabinet.replace(/[/]/g, '_');
            //     excelMaster.code_courtier = ocrPerCourtier.infosOCR.code.cabinet;
            //     workbook = new ExcelJS.Workbook();
            //     recapWorkSheet = workbook.addWorksheet('RECAP');
            //     let month = new Date().getMonth();
            //     month = (month + 1 < 10) ? `0${month + 1}` : `${month}`;
            //     date = `${month}${new Date().getFullYear()}`;
            //     if (ocrPerCourtier.company == 'APIVIA') {
            //         let workSheet = workbook.addWorksheet(ocrPerCourtier.company);
            //         workSheet.properties.defaultColWidth = 20;
            //         excelMasterAPIVIA.createWorkSheetAPIVIA(workSheet, ocrPerCourtier);
            //     }
            // } else {
            cr = await courtierHandler.getCourtierById(ocrPerCourtier.courtier);
            console.log(`DEBUT GENERATION EXCEL MASTER : ${cr.cabinet}`);
            excelMaster = {
                courtier: ocrPerCourtier.courtier,
                cabinet: cr !== null ? cr.cabinet : '',
                create_date: new Date(),
                path: null,
                type: 'excel',
                is_enabled: true
            }
            courtier = cr !== null ? cr.cabinet.replace(/[/]/g, '_') : `cabMet${Date.now()}`;
            excelMaster.code_courtier = courtier;
            let datas = { company: null, ocr: [] };
            for (let ocr of ocrPerCourtier.infos) {
                if (ocr.company === 'CARDIF' && ocr.particular) {
                    datas.company = 'CARDIF';
                    datas.ocr.push(ocr);
                }
            }
            for (let d of datas.ocr) {
                for (let ocr of ocrPerCourtier.infos) {
                    if (d === ocr) {
                        ocrPerCourtier.infos.splice(ocrPerCourtier.infos.indexOf(ocr), 1);
                    }
                }
            }
            ocrPerCourtier.infos = [...ocrPerCourtier.infos, datas];
            workbook = new ExcelJS.Workbook();
            recapWorkSheet = workbook.addWorksheet('RECAP');
            let month = new Date().getMonth();
            month = (month + 1 < 10) ? `0${month + 1}` : `${month + 1}`;
            date = `${month}${new Date().getFullYear()}`;
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
                            switch (ocr.companyName.toUpperCase()) {
                                case 'APICIL':
                                    excelMasterAPICIL.createWorkSheetAPICIL(workSheet, ocr);
                                    break;
                                case 'APIVIA':
                                    excelMasterAPIVIA.createWorkSheetAPIVIA(workSheet, ocrPerCourtier);
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
                        }
                    }
                }
            }

            // }
            const sheets = excelMasterRecap.getWorkSheets(workbook);
            excelMasterRecap.createWorkSheetRECAP(recapWorkSheet, sheets);
            excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}${(courtier) ? courtier : ''}.xlsx`);
            await workbook.xlsx.writeFile(excelPath);
            console.log(`FIN GENERATION EXCEL MASTER : ${cr.cabinet}`);
            excelMaster.path = excelPath;
            excelMasters.push(excelMaster);
        }
        return excelMasters;

    } catch (err) {
        return err;
    }
};

const groupExcelsByCourtier = (excelMasters) => {
    let courtiers = [];
    let excelMastersPerCourtier = []
    for (let excel of excelMasters) {
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
    let month = new Date().getMonth();
    month = (month + 1 < 10) ? `0${month + 1}` : `${month + 1}`;
    const date = `${month}${new Date().getFullYear()}`;
    const singleZip = await generateZip(`all_files_${date}`, excelsMastersZipped);
    const singleZipEM = {
        courtier: null,
        code_courtier: null,
        company: 'ALL COMPANIES',
        create_date: new Date(),
        ocr: null,
        path: singleZip,
        type: 'zip of zip',
        is_enabled: true
    };
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
        // console.log('Data has been drained');
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