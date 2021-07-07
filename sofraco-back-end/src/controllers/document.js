const path = require('path');
const fs = require('fs');
const axios = require('axios');
const config = require('../../config.json');
const Document = require('../models/document');
const documentHandler = require('../handlers/documentHandler');
const documentAPICIL = require('../services/document/documentAPICIL');
const documentMETLIFE = require('../services/document/documentMETLIFE');
const documentAVIVA = require('../services/document/documentAVIVA');

exports.sendDocument = (req, res) => {
    documentHandler.sendDocument(req.file, req.body.company);
    res.status(200).end('Sent to Server');
}

exports.createDocuments = async (req, res) => {
    const files = fs.readdirSync(path.join(__dirname, '..', '..', 'documents', 'uploaded'));
    for (let file of files) {
        const fileName = file.split('.')[0];
        const extension = file.split('.')[1];
        const fileNameArr = fileName.split('_');
        const company = fileNameArr[fileNameArr.length - 1];
        const filePath = path.join(__dirname, '..', '..', 'documents', 'uploaded', file);
        const options = {
            filePath: filePath,
            fileName: fileName,
            extension: extension
        };
        const result = await axios.post(`${config.nodeUrl}/api/document/${company}`, options);
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
        // case 'CARDIF':
        //     infos = await readExcel(file);
        //     break;
        // case 'CBP FRANCE':
        //     infos = await readExcel(file);
        //     break;
        // case 'CEGEMA':
        //     infos = await readExcel(file);
        //     break;
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
    document.path = req.body.filePath;
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
