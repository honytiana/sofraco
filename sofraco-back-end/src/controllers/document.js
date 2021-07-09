const path = require('path');
const fs = require('fs');
const axios = require('axios');
const config = require('../../config.json');
const fileService = require('../services/document/files');
const Document = require('../models/document');
const documentHandler = require('../handlers/documentHandler');
const documentAPICIL = require('../services/document/documentAPICIL');
const documentAVIVA = require('../services/document/documentAVIVA');
const documentCARDIF = require('../services/document/documentCARDIF');
const documentCEGEMA = require('../services/document/documentCEGEMA');
const documentMETLIFE = require('../services/document/documentMETLIFE');

exports.sendDocument = (req, res) => {  // create document
    const company = JSON.parse(req.body.company);
    if (company.surco && req.body.surco && req.files.length > 1) {  // company and surco
        documentHandler.sendDocument(req.files[0], company, false);
        let document = {};
        document.name = req.files[0].path;
        document.company = company._id;
        document.companyName = company.name;
        document.path_original_file = req.files[0].path;
        document.type = req.body.extension;
        const doc = documentHandler.createDocument(document);
        documentHandler.sendDocument(req.files[1], company.surco, true);
        let documentSurco = {};
        documentSurco.name = req.files[1].path;
        documentSurco.company = company._id;
        documentSurco.companyName = company.surco.name;
        documentSurco.path_original_file = req.files[1].path;
        documentSurco.type = req.body.extension;
        const docSurco = documentHandler.createDocument(documentSurco);
    } else if (company.surco && req.body.surco && req.files.length === 1) { // surco
        documentHandler.sendDocument(req.files[0], company.surco);
        let document = {};
        document.name = req.files[0].path;
        document.company = company._id;
        document.companyName = company.surco.name;
        document.path_original_file = req.files[0].path;
        document.type = req.body.extension;
        const doc = documentHandler.createDocument(document);
    } else if ((company.surco && !req.body.surco) || (!company.surco && !req.body.surco)) {     // company
        documentHandler.sendDocument(req.files[0], company);
        let document = {};
        document.name = req.files[0].path;
        document.company = company._id;
        document.companyName = company.name;
        document.path_original_file = req.files[0].path;
        document.type = req.body.extension;
        const doc = documentHandler.createDocument(document);
    }
    res.status(200).end('Sent to Server');
}

exports.createDocuments = async (req, res) => {
    const result = await axios.get(`${config.nodeUrl}/api/document`);
    let documents = result.data;
    documents = documents.filter((doc, index) => {
        const currentMonth = new Date().getMonth();
        const uploadDateMonth = new Date(doc.upload_date).getMonth();
        return currentMonth === uploadDateMonth;
    });
    for (let document of documents) {
        const fileName = fileService.getFileNameWithoutExtension(document.path_original_file);
        const extension = fileService.getFileExtension(document.path_original_file);
        const options = {
            filePath: document.path_original_file,
            fileName: fileName,
            extension: extension
        };
        const result = await axios.post(`${config.nodeUrl}/api/document/${document.companyName}`, options);
        res.status(200).json(result.data);
    }
    res.end();
};

exports.createDocument = async (req, res) => {
    let document = {};
    switch (req.params.company.toUpperCase()) {
        case 'APICIL':
            ocr = await documentAPICIL.readExcelAPICIL(req.body.filePath);
            break;
        // case 'APREP':
        //     infos = await readExcel(file);
        //     break;
        // case 'AVIVA':
        //     infos = await readExcel(file);
        //     break;
        case 'AVIVA SURCO':
            ocr = await documentAVIVA.readExcelAVIVASURCO(req.body.filePath);
            break;
        case 'CARDIF':
            ocr = await documentCARDIF.readExcelCARDIF(req.body.filePath);
            break;
        // case 'CBP FRANCE':
        //     infos = await readExcel(file);
        //     break;
        case 'CEGEMA':
            ocr = await documentCEGEMA.readExcelCEGEMA(req.body.filePath);
            break;
        // case 'ERES':
        //     infos = await readExcel(file);
        //     break;
        // case 'GENERALI':
        //     infos = await readExcel(file);
        //     break;
        // case 'HODEVA':
        //     infos = await readExcel(file);
        //     break;
        case 'METLIFE':
            ocr = await documentMETLIFE.readPdfMETLIFE(req.body.filePath);
            break;
        // case 'SWISSLIFE':
        //     infos = await readExcel(file);
        //     break;
        // case 'SWISSLIFE SURCO':
        //     infos = await readExcel(file);
        //     break;
        default:
            console.log('Pas de compagnie correspondante');
    }
    document.name = req.body.filePath;
    document.company = req.params.company;
    document.companyName = req.params.company;
    document.path_original_file = req.body.filePath;
    document.treatment_date = new Date();
    document.type = req.body.extension;
    document.ocr = ocr;
    const doc = documentHandler.createDocument(document);
    res.status(200).json({ executionTime: ocr.executionTime, company: req.params.company });
}

exports.getDocument = (req, res) => {
    console.log('get document');
    const document = documentHandler.getDocument(req.params.id);
    res.status(200).json(document);
}

exports.getDocuments = async (req, res) => {
    console.log('get documents');
    const documents = await documentHandler.getDocuments();
    res.status(200).json(documents);
}
