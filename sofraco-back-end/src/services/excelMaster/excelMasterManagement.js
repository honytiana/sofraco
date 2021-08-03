const path = require('path');
const axios = require('axios');
const ExcelJS = require('exceljs');
const archiver = require('archiver');
const fs = require('fs');

const config = require('../../../config.json');
const fileService = require('../document/files');
const excelMasterAPICIL = require('./excelMasterAPICIL');
const excelMasterAPREP = require('./excelMasterAPREP');
const excelMasterAVIVA = require('./excelMasterAVIVA');
const excelMasterCARDIF = require('./excelMasterCARDIF');
const excelMasterCEGEMA = require('./excelMasterCEGEMA');
const excelMasterERES = require('./excelMasterERES');
const excelMasterGENERALI = require('./excelMasterGENERALI');
const excelMasterHODEVA = require('./excelMasterHODEVA');
const excelMasterLOURMEL = require('./excelMasterLOURMEL');
const excelMasterMETLIFE = require('./excelMasterMETLIFE');
const excelMasterSWISSLIFE = require('./excelMasterSWISSLIFE');


exports.create = async () => {
    console.log('DEBUT GENERATION EXCEL MASTER');
    const ocrInfos = await getOCRInfos();
    const excelMasters = await generateExcelMaster(ocrInfos);
    console.log('FIN GENERATION EXCEL MASTER');
    console.log('DEBUT GENERATION ZIP');
    const em = groupExcelsByCompany(excelMasters);
    const excelsMastersZipped = await generateZipFilesEM(em);
    const singleZip = await generateSingleZipForAllZippedEM(excelsMastersZipped);
    console.log('FIN GENERATION ZIP');
    return { excelMasters, excelsMastersZipped, singleZip, message: 'Excel Master générés' };
};

const getOCRInfos = async () => {
    const res = await axios.get(`${config.nodeUrl}/api/document`);
    let documents = res.data;
    documents = documents.filter((doc, index) => {
        return doc.status === 'done';
    });
    let infos = [];
    for (let document of documents) {
        const company = document.companyName;
        const ocr = document.ocr;
        switch (company.toUpperCase()) {
            case 'APICIL':
                infos.push(excelMasterAPICIL.getOCRAPICIL(ocr));
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
            // case 'SWISSLIFE':
            //     infos = await getOCRAPICIL(file);
            //     break;
            case 'SWISSLIFE SURCO':
                infos.push(excelMasterSWISSLIFE.getOCRSWISSLIFESURCO(ocr));
                break;
            default:
                console.log('Pas de compagnie correspondante');
        }
    }
    return infos;

}

const generateExcelMaster = async (ocrInfos) => {
    let excelMasters = [];
    try {
        if (ocrInfos.length > 0) {
            for (let ocr of ocrInfos) {
                for (let dataCourtierOCR of ocr) {
                    let excelMaster = {
                        courtier: null,
                        code_courtier: dataCourtierOCR.infosOCR.code,
                        company: null,
                        create_date: new Date(),
                        ocr: null,
                        path: null,
                        type: 'excel',
                        is_enabled: true
                    }
                    const workbook = new ExcelJS.Workbook();
                    workbook.addWorksheet('RECAP');
                    const workSheet = workbook.addWorksheet(dataCourtierOCR.company);
                    excelMaster.company = dataCourtierOCR.company;
                    workSheet.properties.defaultColWidth = 20;
                    let excelPath = '';
                    let month = new Date().getMonth();
                    month = (month + 1 < 10) ? `0${month + 1}` : `${month}`;
                    const date = `${month}${new Date().getFullYear()}`;
                    switch (dataCourtierOCR.company.toUpperCase()) {
                        case 'APICIL':
                            excelMasterAPICIL.createWorkSheetAPICIL(workSheet, dataCourtierOCR);
                            excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}${(dataCourtierOCR.infosOCR.code) ? dataCourtierOCR.infosOCR.code.cabinet : ''}.xlsx`);
                            break;
                        case 'APREP':
                            excelMasterAPREP.createWorkSheetAPREP(workSheet, dataCourtierOCR);
                            excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}${(dataCourtierOCR.infosOCR.code) ? dataCourtierOCR.infosOCR.code.cabinet : ''}.xlsx`);
                            break;
                        case 'APREP ENCOURS':
                            excelMasterAPREP.createWorkSheetAPREPENCOURS(workSheet, dataCourtierOCR);
                            excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}${(dataCourtierOCR.infosOCR.code) ? dataCourtierOCR.infosOCR.code.cabinet : ''}.xlsx`);
                            break;
                        // case 'AVIVA':
                        //     infos = await readExcel(file);
                        //     break;
                        case 'AVIVA SURCO':
                            excelMasterAVIVA.createWorkSheetAVIVASURCO(workSheet, dataCourtierOCR);
                            excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}${(dataCourtierOCR.infosOCR.code) ? dataCourtierOCR.infosOCR.code.cabinet : ''}.xlsx`);
                            break;
                        case 'CARDIF':
                            excelMasterCARDIF.createWorkSheetCARDIF(workSheet, dataCourtierOCR);
                            excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}${(dataCourtierOCR.infosOCR.code) ? dataCourtierOCR.infosOCR.code.cabinet : ''}.xlsx`);
                            break;
                        case 'CEGEMA':
                            excelMasterCEGEMA.createWorkSheetCEGEMA(workSheet, dataCourtierOCR);
                            excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}${(dataCourtierOCR.infosOCR.code) ? dataCourtierOCR.infosOCR.code.cabinet : ''}.xlsx`);
                            break;
                        case 'ERES':
                            excelMasterERES.createWorkSheetERES(workSheet, dataCourtierOCR);
                            excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}${(dataCourtierOCR.infosOCR.code) ? dataCourtierOCR.infosOCR.code.cabinet : ''}.xlsx`);
                            break;
                        case 'GENERALI':
                            excelMasterGENERALI.createWorkSheetGENERALI(workSheet, dataCourtierOCR);
                            excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}${(dataCourtierOCR.infosOCR.code) ? dataCourtierOCR.infosOCR.code.cabinet : ''}.xlsx`);
                            break;
                        case 'HODEVA':
                            excelMasterHODEVA.createWorkSheetHODEVA(workSheet, dataCourtierOCR);
                            excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}${(dataCourtierOCR.infosOCR.code) ? dataCourtierOCR.infosOCR.code.cabinet : ''}.xlsx`);
                            break;
                        case 'LOURMEL':  //CBP FRANCE
                            excelMasterLOURMEL.createWorkSheetLOURMEL(workSheet, dataCourtierOCR);
                            excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}${(dataCourtierOCR.infosOCR.code) ? dataCourtierOCR.infosOCR.code.cabinet : ''}.xlsx`);
                            break;
                        case 'METLIFE':
                            excelMasterMETLIFE.createWorkSheetMETLIFE(workSheet, dataCourtierOCR);
                            excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}${(dataCourtierOCR.infosOCR.code) ? dataCourtierOCR.infosOCR.code.cabinet : `${date}`}.xlsx`);
                            break;
                        // case 'SWISSLIFE':
                        //     infos = await readExcel(file);
                        //     break;
                        case 'SWISSLIFE SURCO':
                            excelMasterSWISSLIFE.createWorkSheetSWISSLIFESURCO(workSheet, dataCourtierOCR);
                            excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}${(dataCourtierOCR.infosOCR.code) ? dataCourtierOCR.infosOCR.code.cabinet : `${date}`}.xlsx`);
                            break;
                        default:
                            console.log('Pas de compagnie correspondante');
                    }
                    await workbook.xlsx.writeFile(excelPath);
                    excelMaster.path = excelPath;
                    excelMasters.push(excelMaster);
                }
            }
            return excelMasters;
        }

    } catch (err) {
        return err;
    }
};

const groupExcelsByCompany = (excelMasters) => {
    let companies = [];
    let excelMastersPerCompany = []
    excelMasters.forEach((excel, index) => {
        if (!companies.includes(excel.company)) {
            companies.push(excel.company);
        }
    });
    companies.forEach((company, i) => {
        let eM = { company, excelMasters: [] };
        excelMasters.forEach((excel, index) => {
            if (excel.company === company) {
                eM.excelMasters.push(excel);
            }
        });
        excelMastersPerCompany.push(eM);
    });
    return excelMastersPerCompany;
};

const generateZipFilesEM = async (excelMastersPerCompany) => {
    const excelMastersZips = [];
    for (let em of excelMastersPerCompany) {
        const zipPath = await generateZip(em.company, em.excelMasters);
        const excelMastersZip = {
            courtier: null,
            code_courtier: null,
            company: em.company,
            create_date: new Date(),
            ocr: null,
            path: zipPath,
            type: 'zip',
            is_enabled: true
        };
        excelMastersZips.push(excelMastersZip);
    }
    return excelMastersZips;
};

const generateSingleZipForAllZippedEM = async (excelsMastersZipped) => {
    let month = new Date().getMonth();
    month = (month + 1 < 10) ? `0${month + 1}` : `${month}`;
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
        console.log(archive.pointer() + ' total bytes');
    });
    output.on('end', () => {
        console.log('Data has been drained');
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
