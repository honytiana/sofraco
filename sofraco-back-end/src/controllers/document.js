const path = require('path');
const fs = require('fs');
const axios = require('axios');
const fileService = require('../services/utils/files');
const splitPDF = require('../services/pdf/splitPDF');
const time = require('../services/utils/time');
const documentHandler = require('../handlers/documentHandler');
const documentAPICIL = require('../services/document/documentAPICIL');
const documentAPIVIA = require('../services/document/documentAPIVIA');
const documentNORTIA = require('../services/document/documentNORTIA');
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
const documentSMATIS = require('../services/document/documentSMATIS');
const documentSPVIE = require('../services/document/documentSPVIE');
const documentSWISSLIFE = require('../services/document/documentSWISSLIFE');
const documentUAFLIFE = require('../services/document/documentUAFLIFE');
const treatmentHandler = require('../handlers/treatmentHandler');
const companyHandler = require('../handlers/companyHandler');

const deleteCacheRequire = () => {
    delete require.cache[require.resolve('../services/document/documentAPICIL')];
    delete require.cache[require.resolve('../services/document/documentAPIVIA')];
    delete require.cache[require.resolve('../services/document/documentNORTIA')];
    delete require.cache[require.resolve('../services/document/documentAVIVA')];
    delete require.cache[require.resolve('../services/document/documentCARDIF')];
    delete require.cache[require.resolve('../services/document/documentCEGEMA')];
    delete require.cache[require.resolve('../services/document/documentERES')];
    delete require.cache[require.resolve('../services/document/documentGENERALI')];
    delete require.cache[require.resolve('../services/document/documentHODEVA')];
    delete require.cache[require.resolve('../services/document/documentLOURMEL')];
    delete require.cache[require.resolve('../services/document/documentMETLIFE')];
    delete require.cache[require.resolve('../services/document/documentMIE')];
    delete require.cache[require.resolve('../services/document/documentMIEL')];
    delete require.cache[require.resolve('../services/document/documentMILTIS')];
    delete require.cache[require.resolve('../services/document/documentMMA')];
    delete require.cache[require.resolve('../services/document/documentPAVILLON')];
    delete require.cache[require.resolve('../services/document/documentSMATIS')];
    delete require.cache[require.resolve('../services/document/documentSPVIE')];
    delete require.cache[require.resolve('../services/document/documentSWISSLIFE')];
    delete require.cache[require.resolve('../services/document/documentUAFLIFE')];
};

exports.createDocument = async (req, res) => {  // create document
    console.log(`${new Date()} Create document`);
    try {
        if (!req) {
            const waitingDocs = await documentHandler.getDocumentsByStatus('waiting');
            if (waitingDocs.length > 0) {
                for(let waitingDoc of waitingDocs) {
                    const company = await companyHandler.getCompanyByName('METLIFE');
                    const pdfPaths = await splitPDF.splitPDFMETLIFEByBordereaux(waitingDoc.path_original_file, company, new Date());
                }
            }
        } else {
            const company = JSON.parse(req.body.company);
            let companySurco;
            if (req.body.companySurco !== 'undefined') {
                companySurco = JSON.parse(req.body.companySurco);
            }
            let companySurco2;
            if (req.body.companySurco2 !== 'undefined') {
                companySurco2 = JSON.parse(req.body.companySurco2);
            }
            const simple = JSON.parse(req.body.simple);
            const surco = JSON.parse(req.body.surco);
            const surco2 = JSON.parse(req.body.surco2);
            const mcms = JSON.parse(req.body.mcms);
            const selectedDate = JSON.parse(req.body.selectedDate);
            let fileLength = 0;
            let surcoLength = 0;
            if (req.body.fileLength !== 'undefined') {
                fileLength = parseInt(req.body.fileLength);
            }
            if (req.body.surcoLength !== 'undefined') {
                surcoLength = parseInt(req.body.surcoLength);
            }

            if (simple && surco && surco2 && !mcms) {  // company and surco ans surco2
                const docCompany = await saveDocumentUploaded(company, req.files[0].path, req.body.extension, selectedDate);
                const docSurco = await saveDocumentUploaded(companySurco, req.files[1].path, req.body.extension, selectedDate);
                const docMCMS = await saveDocumentUploaded(companySurco2, req.files[2].path, req.body.extension, selectedDate);
            }

            if (simple && surco && !surco2 && !mcms) {  // company and surco
                const docCompany = await saveDocumentUploaded(company, req.files[0].path, req.body.extension, selectedDate);
                const docSurco = await saveDocumentUploaded(companySurco, req.files[1].path, req.body.extension, selectedDate);
            }

            if (!simple && surco && surco2 && !mcms) { // surco and surco2
                const docSurco = await saveDocumentUploaded(companySurco, req.files[0].path, req.body.extension, selectedDate);
                const docSurco2 = await saveDocumentUploaded(companySurco2, req.files[1].path, req.body.extension, selectedDate);
            }

            if (simple && !surco && surco2 && !mcms) { // company and surco2
                const docCompany = await saveDocumentUploaded(company, req.files[0].path, req.body.extension, selectedDate);
                const docSurco2 = await saveDocumentUploaded(companySurco2, req.files[1].path, req.body.extension, selectedDate);
            }

            if (simple && !surco && !surco2 && !mcms) {     // company
                const docCompany = await saveDocumentUploaded(company, req.files[0].path, req.body.extension, selectedDate);
            }

            if (!simple && surco && !surco2 && !mcms) { // surco
                const docSurco = await saveDocumentUploaded(companySurco, req.files[0].path, req.body.extension, selectedDate);
            }

            if (!simple && !surco && surco2 && !mcms) { // surco2
                const docSurco2 = await saveDocumentUploaded(companySurco2, req.files[0].path, req.body.extension, selectedDate);
            }

            if (!simple && surco && !surco2 && mcms && surcoLength > 0 && fileLength === 0) { // MCMS 
                for (let file of req.files) {
                    await saveDocumentUploaded(companySurco, file.path, req.body.extension, selectedDate);
                }
            }
            if (simple && surco && !surco2 && mcms && surcoLength > 0 && fileLength > 0) { // company & MCMS 
                const docCompany = await saveDocumentUploaded(company, req.files[0].path, req.body.extension, selectedDate);
                const doc = await documentHandler.createDocument(document);
                const files = req.files.splice(1, req.files.length - 1);
                for (let file of files) {
                    const docMCMS = await saveDocumentUploaded(companySurco, file.path, req.body.extension, selectedDate);
                }
            }
            if (company.name === 'METLIFE') {
                const pdfPaths = await splitPDF.splitPDFMETLIFEByBordereaux(req.files[0].path, company, selectedDate);
                // for (let pdf of pdfPaths) {
                //     const singleDoc = saveDocument(company, pdf, req.body.extension);
                // }
            }
            res.status(200).end(`Sent to Server`);
        }
        console.log(`${new Date()} Document created`);

    } catch (err) {
        res.status(500).json({ err });
    }
}

exports.saveDocument = async (company, filePath, extension, selectedDate, status = 'draft') => {
    try {
        let document = {};
        const fileName = fileService.getFileName(filePath);
        document.name = fileName;
        document.company = company._id;
        document.companyGlobalName = company.globalName;
        document.companyName = company.name;
        document.path_original_file = filePath;
        if (selectedDate.year) {
            document.upload_date = new Date(selectedDate.year, selectedDate.month, selectedDate.day);
        } else {
            document.upload_date === selectedDate;
        }
        document.type = extension;
        document.status = status;
        const doc = await documentHandler.createDocument(document);
        return doc;
    } catch (err) {
        throw err;
    }
};

const saveDocumentUploaded = async (company, filePath, extension, selectedDate) => {
    try {
        let doc;
        if (company.name === 'METLIFE') {
            doc = await this.saveDocument(company, filePath, extension, selectedDate, 'cancel');
        } else {
            doc = await this.saveDocument(company, filePath, extension, selectedDate);
        }
        return doc;
    } catch (err) {
        throw err;
    }
};

exports.updateDocuments = async (req, res) => {
    try {
        console.log(`${new Date()} TRAITEMENT DES FICHIERS`);
        let executionTimes = [];
        const treatment = {
            user: req ? req.body.user : null,
            begin_treatment: Date.now(),
            status: 'processing',
            progress: 0,
        };
        const resultTreatment = await treatmentHandler.createTreatment(treatment);
        let drafts = await getDraftsDocuments();
        let errors = [];
        let numberFiles = 1;
        for (let draftId of drafts) {
            req && deleteCacheRequire();
            try {
                console.log('**********************************************');
                console.log(`------ Fichier numero : ${numberFiles} ------`);
                console.log('**********************************************');
                const indexOfDoc = drafts.indexOf(draftId);
                const document = await documentHandler.getDocument(draftId);
                const rs = await setOCRDocument(document.companyName, document._id, document.path_original_file);
                const result = { data: rs.company, executionTime: rs.executionTime };
                const progress = ((indexOfDoc + 1) * 100) / drafts.length;
                const treatment = await treatmentHandler.updateTreatment(resultTreatment._id, { progress: progress });
                executionTimes.push(result.executionTime);
                if (rs.errors && rs.errors !== null) {
                    errors = [...errors, ...rs.errors];
                }
                numberFiles++;
            } catch (err) {
                console.log(err);
            } finally {
                continue;
            }
        }

        drafts = await getDraftsDocuments();
        if (drafts.length > 0) {
            for (let draft of drafts) {
                errors.push(`Le fichier ${fileService.getFileName(draft.path)} n'a pas été traité, veuillez relancer le traitement`);
            }
        }
        const directoryTemp = path.join(__dirname, '..', '..', 'documents', 'temp');
        const directoryTexte = path.join(__dirname, '..', '..', 'documents', 'texte');
        const directorySplitedPDF = path.join(__dirname, '..', '..', 'documents', 'splited_PDF');
        try {
            fileService.deleteFilesinDirectory(directoryTemp);
            fileService.deleteFilesinDirectory(directoryTexte);
            fileService.deleteFilesinDirectory(directorySplitedPDF);
        } catch (err) {
            console.log(err);
        }
        await treatmentHandler.updateTreatment(resultTreatment._id, { status: 'done', end_treatment: Date.now() });
        let executionTime = Date.now() - treatment.begin_treatment;
        executionTime = time.millisecondToTime(executionTime);
        console.log(`${new Date()} FIN TRAITEMENT DES FICHIERS`);
        const jsonRes = { executionTime, errors };
        if (req) {
            res.status(202).json(jsonRes);
        } else {
            return jsonRes;
        }
    } catch (err) {
        req ? res.status(500).json({ err }) : console.log(`${new Date()} ERROR ${err}`);
    }
};

const getDraftsDocuments = async () => {
    let drafts = [];
    const resultDraftDocuments = await documentHandler.getDocumentsByStatus('draft');
    const resultProcessingDocuments = await documentHandler.getDocumentsByStatus('processing');
    const currentMonth = new Date().getMonth();
    for (let draftDocument of resultDraftDocuments) {
        const uploadDateMonth = new Date(draftDocument.upload_date).getMonth();
        if (uploadDateMonth === currentMonth) {
            drafts.push(draftDocument._id);
        }
    }
    for (let processingDocument of resultProcessingDocuments) {
        const uploadDateMonth = new Date(processingDocument.upload_date).getMonth();
        if (uploadDateMonth === currentMonth) {
            drafts.push(processingDocument._id);
        }
    }
    return drafts;
}

exports.setStatusDocument = async (req, res) => {
    console.log(`${new Date()} set status document`);
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

};

const setOCRDocument = async (companyName, documentId, filePath) => {
    try {
        let document = {};
        document.status = 'processing';
        let ocr;
        const d = await documentHandler.updateDocument(documentId, document);
        switch (companyName.toUpperCase()) {
            case 'APICIL':
                ocr = await documentAPICIL.readExcelAPICIL(filePath);
                break;
            case 'APIVIA':
                ocr = await documentAPIVIA.readPdfAPIVIA(filePath);
                break;
            case 'APREP PREVOYANCE':
                ocr = await documentNORTIA.readPdfAPREP(filePath);
                break;
            case 'APREP ENCOURS':
                ocr = await documentNORTIA.readPdfAPREPENCOURS(filePath);
                break;
            // case 'AVIVA':
            // ocr = await documentAVIVA.readExcelAVIVASURCO(filePath);
            // break;
            case 'AVIVA SURCO':
                ocr = await documentAVIVA.readExcelAVIVASURCO(filePath);
                break;
            case 'CARDIF':
                ocr = await documentCARDIF.readExcelCARDIF(filePath);
                break;
            case 'LOURMEL': //LOURMEL
                ocr = await documentLOURMEL.readExcelLOURMEL(filePath);
                break;
            case 'CEGEMA':
                ocr = await documentCEGEMA.readExcelCEGEMA(filePath);
                break;
            case 'ERES':
                ocr = await documentERES.readPdfERES(filePath);
                break;
            case 'GENERALI':
                ocr = await documentGENERALI.readExcelGENERALI(filePath);
                break;
            case 'HODEVA':
                ocr = await documentHODEVA.readExcelHODEVA(filePath);
                break;
            case 'METLIFE':
                ocr = await documentMETLIFE.readPdfMETLIFE(filePath);
                break;
            case 'MIE':
                ocr = await documentMIE.readExcelMIE(filePath);
                break;
            case 'MIE MCMS': //'MCMS'
                ocr = await documentMIE.readExcelMIEMCMS(filePath);
                break;
            case 'MIEL MUTUELLE':
                ocr = await documentMIEL.readExcelMIEL(filePath);
                break;
            case 'MIEL MCMS': //'MCMS'
                ocr = await documentMIEL.readExcelMIELMCMS(filePath);
                break;
            case 'MILTIS':
                ocr = await documentMILTIS.readExcelMILTIS(filePath);
                break;
            case 'MMA INCITATION':
                ocr = await documentMMA.readExcelMMAINCITATION(filePath);
                break;
            case 'MMA ACQUISITION':
                ocr = await documentMMA.readExcelMMAACQUISITION(filePath);
                break;
            case 'MMA ENCOURS':
                ocr = await documentMMA.readExcelMMAENCOURS(filePath);
                break;
            case 'PAVILLON PREVOYANCE':
                ocr = await documentPAVILLON.readExcelPAVILLON(filePath);
                break;
            case 'PAVILLON MCMS': //'MCMS'
                ocr = await documentPAVILLON.readExcelPAVILLONMCMS(filePath);
                break;
            case 'SLADE':   // SWISSLIFE
                ocr = await documentSWISSLIFE.readPdfSLADE(filePath);
                break;
            case 'SMATIS':
                ocr = await documentSMATIS.readExcelSMATIS(filePath);
                break;
            case 'SMATIS MCMS': //'MCMS'
                ocr = await documentSMATIS.readExcelSMATISMCMS(filePath);
                break;
            case 'SPVIE':
                ocr = await documentSPVIE.readExcelSPVIE(filePath);
                break;
            case 'SWISS LIFE SURCO':
                ocr = await documentSWISSLIFE.readExcelSWISSLIFESURCO(filePath);
                break;
            case 'UAF LIFE PATRIMOINE':
                ocr = await documentUAFLIFE.readExcelUAFLIFE(filePath);
                break;
            default:
                console.log('Pas de compagnie correspondante');
        }
        document.treatment_date = new Date();
        document.ocr = ocr;
        document.status = 'done';
        const doc = await documentHandler.updateDocument(documentId, document);
        return { executionTime: ocr.executionTimeMS, company: companyName, doc, errors: (ocr.errors && ocr.errors.length > 0) ? ocr.errors : null };
    } catch (err) {
        throw err;
    }
}

exports.getDocument = async (req, res) => {
    console.log(`${new Date()} get document`);
    try {
        const document = await documentHandler.getDocument(req.params.id);
        res.status(200).json(document);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.getDocuments = async (req, res) => {
    console.log(`${new Date()} get documents`);
    try {
        const documents = await documentHandler.getDocuments();
        res.status(200).json(documents);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.getDocumentsByDate = async (req, res) => {
    console.log(`${new Date()} get documents`);
    try {
        const documents = await documentHandler.getDocuments();
        res.status(200).json(documents);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.getDocumentsByStatus = async (req, res) => {
    console.log(`${new Date()} get documents by status ${req.params.status}`);
    try {
        const documents = await documentHandler.getDocumentsByStatus(req.params.status);
        res.status(200).json(documents);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.getDocumentsByYearMonth = async (req, res) => {
    console.log(`${new Date()} get documents by year and month`);
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
    console.log(`${new Date()} get documents of company by year and month`);
    try {
        const company = req.params.company;
        const year = req.params.year;
        const month = req.params.month;
        const documents = await documentHandler.getDocumentsCompanyByYearMonth(company, year, month);
        res.status(200).json(documents);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.getDocumentsCompanyByAllYearMonth = async (req, res) => {
    console.log(`${new Date()} get all documents of company by all year and month`);
    try {
        const company = req.params.company;
        let archived = [];
        const months = [
            { month: 'Janvier', index: 0 },
            { month: 'Février', index: 1 },
            { month: 'Mars', index: 2 },
            { month: 'Avril', index: 3 },
            { month: 'Mai', index: 4 },
            { month: 'Juin', index: 5 },
            { month: 'Juillet', index: 6 },
            { month: 'Août', index: 7 },
            { month: 'Septembre', index: 8 },
            { month: 'Octobre', index: 9 },
            { month: 'Novembre', index: 10 },
            { month: 'Décembre', index: 11 }
        ];
        let years = [];
        const currentYear = new Date().getFullYear();
        for (let i = 2020; i <= currentYear; i++) {
            years.push(i);
        }
        for (let year of years) {
            let documentsPerMonth = [];
            for (let month of months) {
                const docs = await documentHandler.getDocumentsCompanyByYearMonth(company, year, month.index);
                documentsPerMonth.push({ month: month, documents: docs });
            }
            archived.push({ year: year, documents: documentsPerMonth });
        }
        res.status(200).json(archived);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.getDocumentsCompany = async (req, res) => {
    console.log(`${new Date()} get documents of company`);
    try {
        const company = req.params.company;
        const documents = await documentHandler.getDocumentsCompany(company);
        res.status(200).json(documents);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.deleteDocument = async (req, res) => {
    console.log(`${new Date()} Delete document`);
    try {
        await documentHandler.deleteDocument(req.params.id);
        res.status(200).end('Document deleted');
    } catch (error) {
        res.status(500).json({ error });
    }
}

exports.deleteAllDocuments = async (req, res) => {
    console.log(`${new Date()} Delete all documents`);
    try {
        await documentHandler.deleteAllDocuments();
        res.status(200).end('Documents deleted');
    } catch (error) {
        res.status(500).json({ error });
    }
}
