const path = require('path');

const config = require('../../config.json');
const Document = require('../models/document');
const documentService = require('../services/document');


exports.createDocument = async (req, res) => {
    const file = req.file;
    const user = req.body.user;
    const company = req.body.company
    const paths = file.path.split('.');
    const extension = paths[paths.length - 1];
    let infos = null;
    if (extension.toUpperCase() === 'XLSX') {
        infos = await documentService.readExcel(file);
    } else if (extension.toUpperCase() === 'PDF') {
        infos = await documentService.readPdf(file);
    } else if (extension.toUpperCase() === 'JPG' ||
        extension.toUpperCase() === 'JPEG' ||
        extension.toUpperCase() === 'PNG') {
        infos = await documentService.readImage(file);
    } else {
        return;
    }
    const document = new Document();
    document.name = file.filename;
    document.user = user;
    document.company = company;
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
