const path = require('path');
const axios = require('axios');
const ExcelJS = require('exceljs');
const archiver = require('archiver');
const fs = require('fs');
const generals = require('../utils/generals');
const excelFile = require('../utils/excelFile');

const fileService = require('../utils/files');
const excelMasterAPICIL = require('./excelMasterAPICIL');
const excelMasterAPIVIA = require('./excelMasterAPIVIA');
const excelMasterNORTIA = require('./excelMasterNORTIA');
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
const clientHandler = require('../../handlers/clientHandler');
const cabinetHandler = require('../../handlers/cabinetHandler');


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
        return { excelMasters, excelsMastersZipped, singleZip, message: 'Excel Master g??n??r??s' };
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
                case 'APREP PREVOYANCE':
                    infos.push(excelMasterNORTIA.getOCRAPREP(ocr));
                    break;
                case 'APREP ENCOURS':
                    infos.push(excelMasterNORTIA.getOCRAPREPENCOURS(ocr));
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
                case 'SWISS LIFE SURCO':
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
        const clients = await clientHandler.getClients();
        const allOcr = await getAllOCRInfosPerCourtiers(ocrInfos, correspondances, clients);
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

const getAllOCRInfosPerCourtiers = async (ocrInfos, correspondances, clients) => {
    const ocrs = getOCRInfosPerCorrespondance(ocrInfos, correspondances);
    const { allOCRPerCourtiers, resteOcrInfos } = await getOCRInfosPerClient(ocrs.allOCRPerCourtiers, ocrs.resteOcrInfos, clients);
    let allOcr = null;
    let infos = [];
    let allResteOCR = [];
    for (let ocr of resteOcrInfos) {
        if (ocr.length > 0) {
            for (let dataCourtierOCR of ocr) {
                infos.push(dataCourtierOCR);
            }
        }
    }
    if (infos.length > 0) {
        allResteOCR = {
            courtier: null,
            infos
        };
        allOcr = [...allOCRPerCourtiers, allResteOCR];
    } else {
        allOcr = allOCRPerCourtiers;
    }
    return allOcr;
};

const getOCRInfosPerCorrespondance = (ocrInfos, correspondances) => {
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
                    if (dataCourtierOCR.companyName === 'APREP ENCOURS' || dataCourtierOCR.companyName === 'APIVIA' || dataCourtierOCR.companyName === 'ERES' || dataCourtierOCR.companyName === 'HODEVA') {
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
    return { allOCRPerCourtiers, resteOcrInfos };
};

const getOCRInfosPerClient = async (allOCRPerCourtiers, ocrInfos, clients) => {
    let resteOcrInfos = [];
    const ocrsCourtier = await setOcrsClientAprep(clients, ocrInfos);
    const contrats = regroupContratByCabinet(ocrsCourtier);
    regroupDataOcrPerCabinetAprep(contrats, allOCRPerCourtiers);
    resteOcrInfos = ocrInfos;
    return { allOCRPerCourtiers, resteOcrInfos };
};

const setOcrsClientAprep = async (clients, ocrInfos) => {
    const ocrsCourtier = [];
    for (let client of clients) {
        const cabinet = await cabinetHandler.getCabinetById(client.cabinet);
        let infos = [];
        let courtier = cabinet.cabinet;
        for (let ocr of ocrInfos) {
            const indexOcr = ocrInfos.indexOf(ocr);
            for (let dataCourtierOCR of ocr) {
                const indexDataCourtierOcr = ocr.indexOf(dataCourtierOCR);
                if (dataCourtierOCR.companyName === 'APREP PREVOYANCE') {
                    for (let data of dataCourtierOCR.infosOCR.datas) {
                        if (client.numeroContrat === data.numeroContrat) {
                            dataCourtierOCR.infosOCR.code.code = cabinet.cabinet;
                            infos.push(dataCourtierOCR);
                            ocr.splice(indexDataCourtierOcr, 1);
                            ocrInfos.splice(indexOcr, 1, ocr);
                            break;
                        }
                    }
                }
            }
        }
        if (infos.length > 0) {
            ocrsCourtier.push({
                courtier,
                infos
            });
        }
    }
    return ocrsCourtier;
};

const regroupContratByCabinet = (ocrsCourtier) => {
    let courtiers = [];
    const contrats = [];
    for (let element of ocrsCourtier) {
        if (courtiers.indexOf(element.courtier) < 0) {
            courtiers.push(element.courtier);
        }
    }
    for (let courtier of courtiers) {
        let contratCourtier = { courtier: '', infos: [] };
        for (let element of ocrsCourtier) {
            contratCourtier.courtier = courtier;
            if (element.courtier === contratCourtier.courtier) {
                for (let inf of element.infos) {
                    contratCourtier.infos.push(inf);
                }
            }
        };
        contrats.push(contratCourtier);
    }
    return contrats;
};

const regroupDataOcrPerCabinetAprep = (contrats, allOCRPerCourtiers) => {
    for (let contrat of contrats) {
        let contratCourtier = { courtier: contrat.courtier, infos: [] };
        let newData = [];
        let infos = {
            companyGlobalName: 'NORTIA',
            companyName: 'APREP PREVOYANCE',
            infosOCR: {
                code: contrat.infos[0].infosOCR.code,
                headers: contrat.infos[0].infosOCR.headers,
                datas: newData,
                infosBordereau: contrat.infos[0].infosOCR.infosBordereau

            }
        }
        for (let infos of contrat.infos) {
            for (let data of infos.infosOCR.datas) {
                newData.push(data);
            }
        };
        infos.infosOCR.datas = newData;
        contratCourtier.infos = [infos];
        allOCRPerCourtiers.push(contratCourtier);
    }
};

const setExcelMaster = async (allOcr) => {
    try {
        let excelMasters = [];
        for (let ocrPerCourtier of allOcr) {
            let excelMaster;
            let workbook;
            let recapWorkSheet;
            let cr;
            let courtierCabinet;
            let courtierNomPrenom;
            let reste = false;
            if (ocrPerCourtier.courtier !== null) {
                if (typeof ocrPerCourtier.courtier !== 'string') {
                    const config = await setConfigExcelMasterSimple(ocrPerCourtier);
                    cr = config.cr;
                    excelMaster = config.excelMaster;
                    courtierCabinet = config.courtierCabinet;
                    courtierNomPrenom = config.courtierNomPrenom;
                } else {
                    const config = setConfigExcelMasterClient(ocrPerCourtier);
                    excelMaster = config.excelMaster;
                    courtierCabinet = config.courtierCabinet;
                }
            } else {
                reste = true;
                excelMaster = setConfigExcelMasterReste(ocrPerCourtier);
            }

            let datas = [];
            if (!reste) {
                for (let ocr of ocrPerCourtier.infos) {
                    let d = { companyName: null, companyName: null, ocr: [] };
                    editDataOCR(ocr, datas, d, 'CARDIF');
                    editDataOCR(ocr, datas, d, 'CEGEMA');
                }
            }
            removeDoublonsOcr(datas, ocrPerCourtier);
            ocrPerCourtier.infos = [...ocrPerCourtier.infos, ...datas];
            workbook = new ExcelJS.Workbook();
            recapWorkSheet = workbook.addWorksheet('RECAP');
            let month = new Date().getMonth();
            month = (month + 1 < 10) ? `0${month + 1}` : `${month + 1}`;
            const date = `${month}${new Date().getFullYear()}`;
            try {
                setWorkSheets(ocrPerCourtier, workbook, reste);
                const sheets = excelMasterRecap.getWorkSheets(workbook);
                excelMasterRecap.createWorkSheetRECAP(recapWorkSheet, sheets);
                const excelPath = setExcelMasterPath(excelMaster, cr, date, courtierCabinet, courtierNomPrenom);
                await workbook.xlsx.writeFile(excelPath);
                const excelContent = await readExcelMasterContent(excelPath);
                if (ocrPerCourtier.courtier !== null) {
                    console.log(`${new Date()} FIN GENERATION EXCEL MASTER : ${cr && cr.cabinet ? cr.cabinet : courtierCabinet}`);
                } else {
                    console.log(`${new Date()} FIN GENERATION EXCEL MASTER : reste de donn??es`);
                }
                excelMaster.path = excelPath;
                excelMaster.content = excelContent;
                excelMasters.push(excelMaster);
            } catch (err) {
                throw err;
            }
        }
        return excelMasters;
    } catch (err) {
        throw err;
    }
}

const setConfigExcelMasterSimple = async (ocrPerCourtier) => {
    const cr = await courtierHandler.getCourtierById(ocrPerCourtier.courtier);
    console.log(`${new Date()} DEBUT GENERATION EXCEL MASTER : ${cr.cabinet}`);
    const excelMaster = {
        courtier: ocrPerCourtier.courtier,
        cabinet: cr !== null ? cr.cabinet : '',
        create_date: new Date(),
        path: null,
        content: null,
        type: 'excel',
        is_enabled: true
    };
    const courtierCabinet = cr !== null ? cr.cabinet.replace(/[/]/g, '_') : `cabMet${Date.now()}`;
    const courtierNomPrenom = `${cr.lastName}_${cr.firstName}`;
    return { excelMaster, cr, courtierCabinet, courtierNomPrenom }
};

const setConfigExcelMasterClient = (ocrPerCourtier) => {
    console.log(`${new Date()} DEBUT GENERATION EXCEL MASTER : ${ocrPerCourtier.courtier}`);
    const excelMaster = {
        courtier: null,
        cabinet: ocrPerCourtier.courtier,
        create_date: new Date(),
        path: null,
        content: null,
        type: 'excel',
        is_enabled: true
    };
    const courtierCabinet = ocrPerCourtier.courtier;
    return { excelMaster, courtierCabinet };
};

const setConfigExcelMasterReste = (ocrPerCourtier) => {
    console.log(`${new Date()} DEBUT GENERATION EXCEL MASTER : reste de donn??es`);
    const excelMaster = {
        courtier: ocrPerCourtier.courtier,
        cabinet: 'RESTE_DONNEES',
        create_date: new Date(),
        path: null,
        content: null,
        type: 'excel',
        is_enabled: true
    };
    const ocrInfosNoCourtier = ocrPerCourtier.infos;
    let newOcrPer = [];
    let companies = [];
    for (let element of ocrInfosNoCourtier) {
        const comp = { companyGlobalName: element.companyGlobalName, companyName: element.companyName };
        if (!companies.some(c => { return c.companyGlobalName === element.companyGlobalName && c.companyName === element.companyName })) {
            companies.push(comp);
        }
    }
    for (let company of companies) {
        let newOcr = { companyGlobalName: company.companyGlobalName, companyName: company.companyName, infosOCR: [] };
        for (let element of ocrInfosNoCourtier) {
            if (element.companyGlobalName === newOcr.companyGlobalName && element.companyName === newOcr.companyName) {
                newOcr.infosOCR.push(element.infosOCR);
            }
        };
        newOcrPer.push(newOcr);
    }
    ocrPerCourtier.infos = newOcrPer;
    return excelMaster;
};

const setExcelMasterPath = (excelMaster, cr, date, courtierCabinet, courtierNomPrenom) => {
    let excelPath;
    if (excelMaster.cabinet === 'RESTE_DONNEES') {
        excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}_RESTE_DONNEES.xlsx`);
    } else {
        if (excelMaster.courtier === null) {
            excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}${courtierCabinet}_APREP.xlsx`);
        } else {
            if (cr.role === 'courtier') {
                excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}${(courtierCabinet) ? courtierCabinet : ''}.xlsx`);
            }
            if (cr.role === 'mandataire') {
                excelPath = path.join(__dirname, '..', '..', '..', 'documents', 'master_excel', `Commissions${date}${(courtierCabinet) ? courtierCabinet : ''}_${courtierNomPrenom}.xlsx`);
            }
        }
    }
    return excelPath;
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

const setWorkSheets = (ocrPerCourtier, workbook, reste) => {
    try {
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
                            createWorkSheetCompany(ocr, workSheet, reste);
                        } catch (err) {
                            throw err;
                        }
                    }
                }
            }
        }
    } catch (err) {
        throw err;
    }
};

const createWorkSheetCompany = (ocr, workSheet, reste) => {
    switch (ocr.companyName.toUpperCase()) {
        case 'APICIL':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterAPICIL.createWorkSheetAPICIL(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterAPICIL.createWorkSheetAPICIL(workSheet, ocr);
            }
            break;
        case 'APIVIA':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterAPIVIA.createWorkSheetAPIVIA(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterAPIVIA.createWorkSheetAPIVIA(workSheet, ocr);
            }
            break;
        case 'APREP PREVOYANCE':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterNORTIA.createWorkSheetAPREP(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterNORTIA.createWorkSheetAPREP(workSheet, ocr);
            }
            break;
        case 'APREP ENCOURS':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterNORTIA.createWorkSheetAPREPENCOURS(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterNORTIA.createWorkSheetAPREPENCOURS(workSheet, ocr);
            }
            break;
        // case 'AVIVA':
        //     infos = await readExcel(file);
        //     break;
        case 'AVIVA SURCO':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterAVIVA.createWorkSheetAVIVASURCO(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterAVIVA.createWorkSheetAVIVASURCO(workSheet, ocr);
            }
            break;
        case 'CARDIF':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterCARDIF.createWorkSheetCARDIF(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterCARDIF.createWorkSheetCARDIF(workSheet, ocr);
            }
            break;
        case 'CEGEMA':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterCEGEMA.createWorkSheetCEGEMA(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterCEGEMA.createWorkSheetCEGEMA(workSheet, ocr);
            }
            break;
        case 'ERES':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterERES.createWorkSheetERES(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterERES.createWorkSheetERES(workSheet, ocr);
            }
            break;
        case 'GENERALI':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterGENERALI.createWorkSheetGENERALI(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterGENERALI.createWorkSheetGENERALI(workSheet, ocr);
            }
            break;
        case 'HODEVA':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterHODEVA.createWorkSheetHODEVA(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterHODEVA.createWorkSheetHODEVA(workSheet, ocr);
            }
            break;
        case 'LOURMEL':  //CBP FRANCE
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterLOURMEL.createWorkSheetLOURMEL(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterLOURMEL.createWorkSheetLOURMEL(workSheet, ocr);
            }
            break;
        case 'METLIFE':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterMETLIFE.createWorkSheetMETLIFE(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterMETLIFE.createWorkSheetMETLIFE(workSheet, ocr);
            }
            break;
        case 'MIE':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterMIE.createWorkSheetMIE(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterMIE.createWorkSheetMIE(workSheet, ocr);
            }
            break;
        case 'MIE MCMS':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterMIE.createWorkSheetMIEMCMS(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterMIE.createWorkSheetMIEMCMS(workSheet, ocr);
            }
            break;
        case 'MIEL MUTUELLE':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterMIEL.createWorkSheetMIEL(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterMIEL.createWorkSheetMIEL(workSheet, ocr);
            }
            break;
        case 'MIEL MCMS':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterMIEL.createWorkSheetMIELMCMS(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterMIEL.createWorkSheetMIELMCMS(workSheet, ocr);
            }
            break;
        case 'MILTIS':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterMILTIS.createWorkSheetMILTIS(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterMILTIS.createWorkSheetMILTIS(workSheet, ocr);
            }
            break;
        case 'MMA INCITATION':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterMMA.createWorkSheetMMAINCITATION(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterMMA.createWorkSheetMMAINCITATION(workSheet, ocr);
            }
            break;
        case 'MMA ACQUISITION':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterMMA.createWorkSheetMMAACQUISITION(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterMMA.createWorkSheetMMAACQUISITION(workSheet, ocr);
            }
            break;
        case 'MMA ENCOURS':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterMMA.createWorkSheetMMAENCOURS(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterMMA.createWorkSheetMMAENCOURS(workSheet, ocr);
            }
            break;
        case 'PAVILLON PREVOYANCE':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterPAVILLON.createWorkSheetPAVILLON(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterPAVILLON.createWorkSheetPAVILLON(workSheet, ocr);
            }
            break;
        case 'PAVILLON MCMS':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterPAVILLON.createWorkSheetPAVILLONMCMS(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterPAVILLON.createWorkSheetPAVILLONMCMS(workSheet, ocr);
            }
            break;
        case 'SLADE':   // SWISSLIFE
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterSWISSLIFE.createWorkSheetSLADE(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterSWISSLIFE.createWorkSheetSLADE(workSheet, ocr);
            }
            break;
        case 'SPVIE':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterSPVIE.createWorkSheetSPVIE(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterSPVIE.createWorkSheetSPVIE(workSheet, ocr);
            }
            break;
        // case 'SMATIS':
        //     excelMasterSMATIS.createWorkSheetSMATIS(workSheet, ocr);
        //     break;
        case 'SMATIS MCMS':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterSMATIS.createWorkSheetSMATISMCMS(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterSMATIS.createWorkSheetSMATISMCMS(workSheet, ocr);
            }
            break;
        case 'SWISS LIFE SURCO':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterSWISSLIFE.createWorkSheetSWISSLIFESURCO(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterSWISSLIFE.createWorkSheetSWISSLIFESURCO(workSheet, ocr);
            }
            break;
        case 'UAF LIFE PATRIMOINE':
            if (Array.isArray(ocr.infosOCR)) {
                let rowNumberI = 1;
                for (let inf of ocr.infosOCR) {
                    inf = { infosOCR: inf };
                    rowNumberI = excelMasterUAFLIFE.createWorkSheetUAFLIFE(workSheet, inf, reste, rowNumberI + 1);
                }
            } else {
                excelMasterUAFLIFE.createWorkSheetUAFLIFE(workSheet, ocr);
            }
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