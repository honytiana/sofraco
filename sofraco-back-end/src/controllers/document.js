const path = require('path');

const config = require('../../config.json');
const Document = require('../models/document');
const excelFileService = require('../services/document/excelFile');
const pdfFileService = require('../services/document/pdfFile');
const imageFileService = require('../services/document/imageFile');


exports.createDocument = async (req, res) => {
    const file = req.file;
    const user = req.body.user;
    const company = req.body.company
    const paths = file.path.split('.');
    const extension = paths[paths.length - 1];
    let infos = null;
    if (extension.toUpperCase() === 'XLSX') {
        switch (company.name.toUpperCase()) {
            case 'APICIL':
                infos = await excelFileService.readExcelAPICIL(file);
                break;
            // case 'APREP':
            //     infos = await excelFileService.readExcel(file);
            //     break;
            // case 'AVIVA':
            //     infos = await excelFileService.readExcel(file);
            //     break;
            // case 'AVIVA SURCO':
            //     infos = await excelFileService.readExcel(file);
            //     break;
            // case 'CARDIF':
            //     infos = await excelFileService.readExcel(file);
            //     break;
            // case 'CBP FRANCE':
            //     infos = await excelFileService.readExcel(file);
            //     break;
            // case 'CEGEMA':
            //     infos = await excelFileService.readExcel(file);
            //     break;
            // case 'ERES':
            //     infos = await excelFileService.readExcel(file);
            //     break;
            // case 'GENERALI':
            //     infos = await excelFileService.readExcel(file);
            //     break;
            // case 'HODEVA':
            //     infos = await excelFileService.readExcel(file);
            //     break;
            // case 'METLIFE':
            //     infos = await excelFileService.readExcel(file);
            //     break;
            // case 'SWISSLIFE':
            //     infos = await excelFileService.readExcel(file);
            //     break;
            // case 'SWISSLIFE SURCO':
            //     infos = await excelFileService.readExcel(file);
            //     break;
            default:
                console.log('Pas de compagnie correspondante');
        }
    } else if (extension.toUpperCase() === 'PDF') {
        switch (company.name.toUpperCase()) {
            // case 'APICIL':
            //     infos = await pdfFileService.readPdfMETLIFE(file);
            //     break;
            // case 'APREP':
            //     infos = await pdfFileService.readPdfMETLIFE(file);
            //     break;
            // case 'AVIVA':
            //     infos = await pdfFileService.readPdfMETLIFE(file);
            //     break;
            // case 'AVIVA SURCO':
            //     infos = await pdfFileService.readPdfMETLIFE(file);
            //     break;
            // case 'CARDIF':
            //     infos = await pdfFileService.readPdfMETLIFE(file);
            //     break;
            // case 'CBP FRANCE':
            //     infos = await pdfFileService.readPdfMETLIFE(file);
            //     break;
            // case 'CEGEMA':
            //     infos = await pdfFileService.readPdfMETLIFE(file);
            //     break;
            // case 'ERES':
            //     infos = await pdfFileService.readPdfMETLIFE(file);
            //     break;
            // case 'GENERALI':
            //     infos = await pdfFileService.readPdfMETLIFE(file);
            //     break;
            // case 'HODEVA':
            //     infos = await pdfFileService.readPdfMETLIFE(file);
            //     break;
            case 'METLIFE':
                infos = await pdfFileService.readPdfMETLIFE(file);
                break;
            // case 'SWISSLIFE':
            //     infos = await pdfFileService.readPdfMETLIFE(file);
            //     break;
            // case 'SWISSLIFE SURCO':
            //     infos = await pdfFileService.readPdfMETLIFE(file);
            //     break;
            default:
                console.log('Pas de compagnie correspondante');
        }
    } else if (extension.toUpperCase() === 'JPG' ||
        extension.toUpperCase() === 'JPEG' ||
        extension.toUpperCase() === 'PNG') {
        switch (company.name.toUpperCase()) {
            // case 'APICIL':
            //     infos = await imageFileService.readImage(file);
            //     break;
            // case 'APREP':
            //     infos = await imageFileService.readImage(file);
            //     break;
            // case 'AVIVA':
            //     infos = await imageFileService.readImage(file);
            //     break;
            // case 'AVIVA SURCO':
            //     infos = await imageFileService.readImage(file);
            //     break;
            // case 'CARDIF':
            //     infos = await imageFileService.readImage(file);
            //     break;
            // case 'CBP FRANCE':
            //     infos = await imageFileService.readImage(file);
            //     break;
            // case 'CEGEMA':
            //     infos = await imageFileService.readImage(file);
            //     break;
            // case 'ERES':
            //     infos = await imageFileService.readImage(file);
            //     break;
            // case 'GENERALI':
            //     infos = await imageFileService.readImage(file);
            //     break;
            // case 'HODEVA':
            //     infos = await imageFileService.readImage(file);
            //     break;
            // case 'METLIFE':
            //     infos = await imageFileService.readImage(file);
            //     break;
            // case 'SWISSLIFE':
            //     infos = await imageFileService.readImage(file);
            //     break;
            // case 'SWISSLIFE SURCO':
            //     infos = await imageFileService.readImage(file);
            //     break;
            default:
                console.log('Pas de compagnie correspondante');
        }
    } else {
        return;
    }
    const document = new Document();
    document.name = file.filename;
    document.user = user;
    document.company = company._id;
    document.upload_date = Date.now();
    document.path = file.path;
    document.type = file.mimetype;
    document.is_enabled = true;
    document.ocr = infos;
    document.save()
        .then((data) => {
            console.log('Post document');
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500);
            throw err;
        });

};

exports.getDocument = (req, res) => {
    console.log('get document');
    Document.findById(req.params.id, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(doc);
        }
    });
}

exports.getDocuments = (req, res) => {
    console.log('get document');
    Document.find((err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(doc);
        }
    });
}
