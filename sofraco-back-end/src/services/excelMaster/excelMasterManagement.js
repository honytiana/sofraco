const path = require('path');
const axios = require('axios');
const ExcelJS = require('exceljs');

const config = require('../../../config.json');
const excelMasterAPICIL = require('./excelMasterAPICIL');
const excelMasterMETLIFE = require('./excelMasterMETLIFE');
const excelMasterAVIVA = require('./excelMasterAVIVA');


exports.create = async () => {
    console.log('DEBUT GENERATION EXCEL MASTER');
    const ocrInfos = await getOCRInfos();
    const res = await generateExcelMaster(ocrInfos);
    console.log('FIN GENERATION EXCEL MASTER');
    return res;
};

const getOCRInfos = async () => {
    const res = await axios.get(`${config.nodeUrl}/api/document`);
    const documents = res.data
    let infos = [];
    for (let document of documents) {
        const company = document.companyName;
        const ocr = document.ocr;
        switch (company.toUpperCase()) {
            // case 'APICIL':
            //     infos.push(excelMasterAPICIL.getOCRAPICIL(ocr));
            //     break;
            // case 'APREP':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'AVIVA':
            //     infos = await getOCRAPICIL(file);
            //     break;
            case 'AVIVA SURCO':
                infos.push(excelMasterAVIVA.getOCRAVIVASURCO(ocr));
                break;
            // case 'CARDIF':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'CBP FRANCE':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'CEGEMA':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'ERES':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'GENERALI':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'HODEVA':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'METLIFE':
            //     infos.push(excelMasterMETLIFE.getOCRMETLIFE(ocr));
            //     break;
            // case 'SWISSLIFE':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'SWISSLIFE SURCO':
            //     infos = await getOCRAPICIL(file);
            //     break;
            default:
                console.log('Pas de compagnie correspondante');
        }
    }
    return infos;

}

const generateExcelMaster = async (ocrInfos) => {
    let eM = [];
    try {
        if (ocrInfos.length > 0) {
            for (let ocr of ocrInfos) {
                for (let dataCourtierOCR of ocr) {
                    let excelMaster = {
                        courtier: dataCourtierOCR.infosOCR.code,
                        companies: [],
                        create_date: new Date(),
                        ocr: null,
                        path: null,
                        is_enabled: true
                    }
                    const workbook = new ExcelJS.Workbook();
                    workbook.addWorksheet('RECAP');
                    const workSheet = workbook.addWorksheet(dataCourtierOCR.company);
                    excelMaster.companies.push(dataCourtierOCR.company);
                    workSheet.properties.defaultColWidth = 20;
                    let excelPath = '';
                    let month = new Date().getMonth();
                    month = (month + 1 < 10) ? `0${month + 1}` : `${month}`
                    const date = `${month}${new Date().getFullYear()}`
                    if (dataCourtierOCR.company === 'APICIL') {
                        excelMasterAPICIL.createWorkSheetAPICIL(workSheet, dataCourtierOCR);
                        excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'masterExcel', `Commissions${date}${(dataCourtierOCR.infosOCR.code) ? dataCourtierOCR.infosOCR.code.cabinet : ''}.xlsx`);
                    }
                    if (dataCourtierOCR.company === 'METLIFE') {
                        excelMasterMETLIFE.createWorkSheetMETLIFE(workSheet, dataCourtierOCR);
                        excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'masterExcel', `Commissions${date}${(dataCourtierOCR.infosOCR.code) ? dataCourtierOCR.infosOCR.code.cabinet : ''}${new Date()}.xlsx`);
                    }
                    if (dataCourtierOCR.company === 'AVIVA SURCO') {
                        excelMasterAVIVA.createWorkSheetAVIVASURCO(workSheet, dataCourtierOCR);
                        excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'masterExcel', `Commissions${date}${(dataCourtierOCR.infosOCR.code) ? dataCourtierOCR.infosOCR.code.cabinet : ''}.xlsx`);
                    }
                    await workbook.xlsx.writeFile(excelPath);
                    excelMaster.path = excelPath;
                    eM.push(excelMaster);
                }
            }
            return { excelMasters: eM, message: 'Excel Master générés' };
        }
        
    } catch (err) {
        return err;
    }
}
