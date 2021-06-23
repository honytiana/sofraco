const path = require('path');

const config = require('../../config.json');
const Document = require('../models/document');
const excelFileService = require('../services/document/excelFile');
const pdfFileService = require('../services/document/pdfFile');
const imageFileService = require('../services/document/imageFile');


exports.createDocument = async (req, res) => {
    const file = req.file;
    const user = req.body.user;
    const company = JSON.parse(req.body.company);
    const paths = file.path.split('.');
    const extension = paths[paths.length - 1];
    let infos = null;
    if (extension.toUpperCase() === 'XLSX') {
        infos = await excelFileService.readExcel(file, company.name);
    } else if (extension.toUpperCase() === 'PDF') {
        infos = await pdfFileService.readPdf(file, company.name);
    } else if (extension.toUpperCase() === 'JPG' ||
        extension.toUpperCase() === 'JPEG' ||
        extension.toUpperCase() === 'PNG') {
        infos = await imageFileService.readImage(file, company.name);
    } else {
        return;
    }
    const document = new Document();
    document.name = file.filename;
    document.user = user;
    document.company = company._id;
    document.companyName =  company.name;
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
    console.log('get documents');
    Document.find((err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(doc);
        }
    });
}
