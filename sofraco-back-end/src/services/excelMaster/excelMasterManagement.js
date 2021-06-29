const path = require('path');
const axios = require('axios');
const ExcelJS = require('exceljs');

const config = require('../../../config.json');
const excelMasterAPICIL = require('./excelMasterAPICIL');
const excelMasterMETLIFE = require('./excelMasterMETLIFE');


exports.create = async () => {
    const ocrInfos = await getOCRInfos();
    const res = await generateExcelMaster(ocrInfos);
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
            case 'APICIL':
                infos.push(excelMasterAPICIL.getOCRAPICIL(ocr));
                break;
            // case 'APREP':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'AVIVA':
            //     infos = await getOCRAPICIL(file);
            //     break;
            // case 'AVIVA SURCO':
            //     infos = await getOCRAPICIL(file);
            //     break;
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
            case 'METLIFE':
                infos.push(excelMasterMETLIFE.getOCRMETLIFE(ocr));
                break;
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
        for (let ocr of ocrInfos) {
            for (let dataCourtierOCR of ocr) {
                let excelMaster = {
                    courtier: (dataCourtierOCR.company === 'APICIL') ? dataCourtierOCR.infosOCR.code : '',
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
                if (dataCourtierOCR.company === 'APICIL') {
                    excelMasterAPICIL.createWorkSheetAPICIL(workSheet, dataCourtierOCR);
                }
                if (dataCourtierOCR.company === 'METLIFE') {
                    excelMasterMETLIFE.createWorkSheetMETLIFE(workSheet, dataCourtierOCR);
                }

                const excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'masterExcel', `Commissions${new Date().getMonth()}${new Date().getYear()}${(dataCourtierOCR.infosOCR.code) ? dataCourtierOCR.infosOCR.code.cabinet : ''}.xlsx`);
                await workbook.xlsx.writeFile(excelPath);
                excelMaster.path = excelPath;
                eM.push(excelMaster);
            }
        }

        return { excelMasters: eM, message: 'Excel Master générés' };
    } catch (err) {
        return err;
    }
}

