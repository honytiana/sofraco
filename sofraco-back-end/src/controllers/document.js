const path = require('path');
const fs = require('fs');
const axios = require('axios');
const config = require('../../config.json');
const fileService = require('../services/document/files');
const time = require('../services/time/time');
const documentHandler = require('../handlers/documentHandler');
const documentAPICIL = require('../services/document/documentAPICIL');
const documentAPIVIA = require('../services/document/documentAPIVIA');
const documentAPREP = require('../services/document/documentAPREP');
const documentAVIVA = require('../services/document/documentAVIVA');
const documentCARDIF = require('../services/document/documentCARDIF');
const documentCEGEMA = require('../services/document/documentCEGEMA');
const documentERES = require('../services/document/documentERES');
const documentGENERALI = require('../services/document/documentGENERALI');
const documentHODEVA = require('../services/document/documentHODEVA');
const documentLOURMEL = require('../services/document/documentLOURMEL');
const documentMETLIFE = require('../services/document/documentMETLIFE');
const documentMIE = require('../services/document/documentMIE');
const documentMIEL = require('../services/document/documentMIEL');
const documentMILTIS = require('../services/document/documentMILTIS');
const documentMMA = require('../services/document/documentMMA');
const documentPAVILLON = require('../services/document/documentPAVILLON');
const documentSPVIE = require('../services/document/documentSPVIE');
const documentSWISSLIFE = require('../services/document/documentSWISSLIFE');
const documentUAFLIFE = require('../services/document/documentUAFLIFE');

exports.createDocument = (req, res) => {  // create document
    console.log('Create document');
    try {
        const company = JSON.parse(req.body.company);
        let companySurco;
        if (req.body.companySurco !== 'undefined') {
            companySurco = JSON.parse(req.body.companySurco);
        }
        const surco = JSON.parse(req.body.surco);
        const mcms = JSON.parse(req.body.mcms);
        if (company.surco && surco && companySurco && req.files.length > 1) {  // company and surco
            let document = {};
            const fileName = fileService.getFileName(req.files[0].path);
            document.name = fileName;
            document.company = company._id;
            document.companyName = company.name;
            document.path_original_file = req.files[0].path;
            document.type = req.body.extension;
            const doc = documentHandler.createDocument(document);
            let documentSurco = {};
            const fileNameSurco = fileService.getFileName(req.files[1].path);
            documentSurco.name = fileNameSurco;
            documentSurco.company = companySurco._id;
            documentSurco.companyName = companySurco.name;
            documentSurco.path_original_file = req.files[1].path;
            documentSurco.type = req.body.extension;
            const docSurco = documentHandler.createDocument(documentSurco);
        } 
        if (company.surco && surco && companySurco && req.files.length === 1) { // surco
            let document = {};
            const fileName = fileService.getFileName(req.files[0].path);
            document.name = fileName;
            document.company = companySurco._id;
            document.companyName = companySurco.name;
            document.path_original_file = req.files[0].path;
            document.type = req.body.extension;
            const doc = documentHandler.createDocument(document);
        } 
        if (((company.surco && !surco) || (!company.surco && !surco)) && !mcms) {     // company
            let document = {};
            const fileName = fileService.getFileName(req.files[0].path);
            document.name = fileName;
            document.company = company._id;
            document.companyName = company.name;
            document.path_original_file = req.files[0].path;
            document.type = req.body.extension;
            const doc = documentHandler.createDocument(document);
        }
        if (mcms) { // MCMS 
            for (let file of req.files) {
                let document = {};
                const fileName = fileService.getFileName(file.path);
                document.name = fileName;
                document.company = company._id;
                document.companyName = company.name;
                document.path_original_file = file.path;
                document.type = req.body.extension;
                const doc = documentHandler.createDocument(document);
            }
        }
        res.status(200).end('Sent to Server');
    } catch (err) {
        res.status(500).json({ err });
    }
}

exports.updateDocuments = async (req, res) => {
    try {
        const document = await documentHandler.getDocument(req.body.document);
        const fileName = fileService.getFileNameWithoutExtension(document.path_original_file);
        const extension = fileService.getFileExtension(document.path_original_file);
        const options = {
            document: document._id,
            filePath: document.path_original_file,
            fileName: fileName,
            extension: extension
        };
        const rs = await axios.put(`${config.nodeUrl}/api/document/${document.companyName}`, options, {
            headers: {
                'Authorization': `${req.headers.authorization}`
            }
        });
        const result = { data: rs.data.company, executionTime: rs.data.executionTime };
        res.status(202).json(result);
    } catch (err) {
        res.status(500).json({ err });
    }
};

exports.setStatusDocument = async (req, res) => {
    console.log('set status document');
    try {
        let documents = await documentHandler.getDocuments();
        documents = documents.filter((doc, index) => {
            // const currentMonth = new Date().getMonth();
            // const uploadDateMonth = new Date(doc.upload_date).getMonth();
            // return (currentMonth === uploadDateMonth) && (doc.status === 'draft');
            return doc.status === 'draft';
        });
        for (let document of documents) {
            document.status = req.params.status;
            await documentHandler.updateDocument(document._id, document);
        }
        res.status(200).end();
    } catch (err) {
        res.status(500).json({ err });
    }
}

exports.updateDocument = async (req, res) => {
    try {
        let document = {};
        document.status = 'processing';
        let ocr;
        const d = await documentHandler.updateDocument(req.body.document, document);
        switch (req.params.company.toUpperCase()) {
            case 'APICIL':
                ocr = await documentAPICIL.readExcelAPICIL(req.body.filePath);
                break;
            case 'APIVIA':
                ocr = await documentAPIVIA.readPdfAPIVIA(req.body.filePath);
                break;
            case 'APREP':
                ocr = await documentAPREP.readPdfAPREP(req.body.filePath);
                break;
            case 'APREP ENCOURS':
                ocr = await documentAPREP.readPdfAPREPENCOURS(req.body.filePath);
                break;
            // case 'AVIVA':
            //     infos = await readExcel(file);
            //     break;
            case 'AVIVA SURCO':
                ocr = await documentAVIVA.readExcelAVIVASURCO(req.body.filePath);
                break;
            case 'CARDIF':
                ocr = await documentCARDIF.readExcelCARDIF(req.body.filePath);
                break;
            case 'CBP FRANCE': //LOURMEL
                ocr = await documentLOURMEL.readExcelLOURMEL(req.body.filePath);
                break;
            case 'LOURMEL': //LOURMEL
                ocr = await documentLOURMEL.readExcelLOURMEL(req.body.filePath);
                break;
            case 'CEGEMA':
                ocr = await documentCEGEMA.readExcelCEGEMA(req.body.filePath);
                break;
            case 'ERES':
                ocr = await documentERES.readPdfERES(req.body.filePath);
                break;
            case 'GENERALI':
                ocr = await documentGENERALI.readExcelGENERALI(req.body.filePath);
                break;
            case 'HODEVA':
                ocr = await documentHODEVA.readExcelHODEVA(req.body.filePath);
                break;
            case 'METLIFE':
                ocr = await documentMETLIFE.readPdfMETLIFE(req.body.filePath);
                break;
            case 'MIE': //'MCMS'
                ocr = await documentMIE.readExcelMIE(req.body.filePath);
                break;
            case 'MIEL MUTUELLE': //'MCMS'
                ocr = await documentMIEL.readExcelMIEL(req.body.filePath);
                break;
            case 'MILTIS':
                ocr = await documentMILTIS.readExcelMILTIS(req.body.filePath);
                break;
            case 'MMA':
                ocr = await documentMMA.readExcelMMA(req.body.filePath);
                break;
            case 'PAVILLON PREVOYANCE': //'MCMS'
                ocr = await documentPAVILLON.readExcelPAVILLON(req.body.filePath);
                break;
            case 'SLADE':   // SWISSLIFE
                ocr = await documentSWISSLIFE.readPdfSLADE(req.body.filePath);
                break;
            case 'SPVIE':
                ocr = await documentSPVIE.readExcelSPVIE(req.body.filePath);
                break;
            case 'SWISSLIFE SURCO':
                ocr = await documentSWISSLIFE.readExcelSWISSLIFESURCO(req.body.filePath);
                break;
            case 'UAF LIFE PATRIMOINE':
                ocr = await documentUAFLIFE.readExcelUAFLIFE(req.body.filePath);
                break;
            default:
                console.log('Pas de compagnie correspondante');
        }
        document.treatment_date = new Date();
        document.ocr = ocr;
        document.status = 'done';
        const doc = await documentHandler.updateDocument(req.body.document, document);
        res.status(202).json({ executionTime: ocr.executionTimeMS, company: req.params.company });
    } catch (err) {
        res.status(500).json({ err });
    }
}

exports.getDocument = async (req, res) => {
    console.log('get document');
    try {
        const document = await documentHandler.getDocument(req.params.id);
        res.status(200).json(document);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.getDocuments = async (req, res) => {
    console.log('get documents');
    try {
        const documents = await documentHandler.getDocuments();
        res.status(200).json(documents);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.getDocumentsByDate = async (req, res) => {
    console.log('get documents');
    try {
        const documents = await documentHandler.getDocuments();
        res.status(200).json(documents);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.getDocumentsByYearMonth = async (req, res) => {
    console.log('get documents by year and month');
    try {
        const year = req.params.year;
        const month = req.params.month;
        const documents = await documentHandler.getDocumentsByYearMonth(year, month);
        res.status(200).json(documents);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.getDocumentsCompanyByYearMonth = async (req, res) => {
    console.log('get documents of company by year and month');
    try {
        const company = req.params.company;
        const year = req.params.year;
        const month = req.params.month;
        const documents = await documentHandler.getDocumentsByYearMonth(company, year, month);
        res.status(200).json(documents);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.getDocumentsCompany = async (req, res) => {
    console.log('get documents of company');
    try {
        const company = req.params.company;
        const documents = await documentHandler.getDocumentsCompany(company);
        res.status(200).json(documents);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.deleteDocument = async (req, res) => {
    console.log('Delete document');
    try {
        await documentHandler.deleteDocument(req.params.id);
        res.status(200).end('Document deleted');
    } catch (error) {
        res.status(500).json({ error });
    }
}

exports.deleteAllDocuments = async (req, res) => {
    console.log('Delete all documents');
    try {
        await documentHandler.deleteAllDocuments();
        res.status(200).end('Documents deleted');
    } catch (error) {
        res.status(500).json({ error });
    }
}
