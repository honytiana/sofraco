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
const excelMasterRecap = require('./excelMasterRecap');


exports.create = async (authorization) => {
    console.log('DEBUT GENERATION EXCEL MASTER');
    const ocrInfos = await getOCRInfos(authorization);
    const excelMasters = await generateExcelMaster(ocrInfos, authorization);
    console.log('FIN GENERATION EXCEL MASTER');
    console.log('DEBUT GENERATION ZIP');
    const em = groupExcelsByCompany(excelMasters);
    const excelsMastersZipped = await generateZipFilesEM(em);
    const singleZip = await generateSingleZipForAllZippedEM(excelsMastersZipped);
    console.log('FIN GENERATION ZIP');
    return { excelMasters, excelsMastersZipped, singleZip, message: 'Excel Master générés' };
};

const getOCRInfos = async (authorization) => {
    const res = await axios.get(`${config.nodeUrl}/api/document`, {
        headers: {
            authorization: authorization
        }
    });
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
            case 'SLADE':   // swisslife
                infos.push(excelMasterSWISSLIFE.getOCRSLADE(ocr));
                break;
            case 'SWISSLIFE SURCO':
                infos.push(excelMasterSWISSLIFE.getOCRSWISSLIFESURCO(ocr));
                break;
            default:
                console.log('Pas de compagnie correspondante');
        }
    }
    return infos;

}

const getCorrespondances = async () => {
    try {
        const result = await axios.get(`${config.nodeUrl}/api/correspondance`);
        return result.data;
    } catch (err) {
        console.log(err);
    }
};

const generateExcelMaster = async (ocrInfos, authorization) => {
    let excelMasters = [];
    let allOCRPerCourtiers = [];
    const correspondances = await getCorrespondances();
    for (let correspondance of correspondances) {
        const courtier = correspondance.courtier;
        let infos = [];
        for (let company of correspondance.companies) {
            for (let ocr of ocrInfos) {
                for (let dataCourtierOCR of ocr) {
                    if (dataCourtierOCR.company === company.company &&
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
    try {
        for (let ocrPerCourtier of allOCRPerCourtiers) {
            let excelMaster = {
                courtier: ocrPerCourtier.courtier,
                code_courtier: null,
                create_date: new Date(),
                ocr: null,
                path: null,
                type: 'excel',
                is_enabled: true
            }
            const result = await axios.get(`${config.nodeUrl}/api/courtier/${ocrPerCourtier.courtier}`, {
                headers: {
                    'Authorization': `${authorization}`
                }
            });
            const courtier = result.data.cabinet.replace(/[/]/g, '_');
            excelMaster.code_courtier = courtier;
            const workbook = new ExcelJS.Workbook();
            const recapWorkSheet = workbook.addWorksheet('RECAP');
            let month = new Date().getMonth();
            month = (month + 1 < 10) ? `0${month + 1}` : `${month}`;
            const date = `${month}${new Date().getFullYear()}`;
            for (let ocr of ocrPerCourtier.infos) {
                let workSheet;
                if (ocr.particular) {
                    if (!workbook.getWorksheet(ocr.particular.replace(/[\s.]/g, ''))) {
                        workSheet = workbook.addWorksheet(ocr.particular.replace(/[\s.]/g, ''));
                    } else {
                        workSheet = workbook.addWorksheet(`${ocr.particular.replace(/[\s.]/g, '')}_`);
                    }
                } else {
                    workSheet = workbook.addWorksheet(ocr.company);
                }
                workSheet.properties.defaultColWidth = 20;
                switch (ocr.company.toUpperCase()) {
                    case 'APICIL':
                        excelMasterAPICIL.createWorkSheetAPICIL(workSheet, ocr);
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
                    case 'SLADE':   // SWISSLIFE
                        excelMasterSWISSLIFE.createWorkSheetSLADE(workSheet, ocr);
                        break;
                    case 'SWISSLIFE SURCO':
                        excelMasterSWISSLIFE.createWorkSheetSWISSLIFESURCO(workSheet, ocr);
                        break;
                    default:
                        console.log('Pas de compagnie correspondante');
                }

            }
            const sheets = excelMasterRecap.getWorkSheets(workbook);
            excelMasterRecap.createWorkSheetRECAP(recapWorkSheet, sheets);
            excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}${(courtier) ? courtier : ''}.xlsx`);
            await workbook.xlsx.writeFile(excelPath);
            excelMaster.path = excelPath;
            excelMasters.push(excelMaster);
        }
        return excelMasters;

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
