const path = require('path');

const config = require('../../config.json');
const Document = require('../models/document');
const documentService = require('../services/document');


exports.createDocument = (req, res) => {
    const file = req.file;
    documentService.readExcel(file.path);
    const document = new Document();
    document.name = file.filename;
    document.user = '';
    document.company = '';
    document.upload_date = Date.now();
    document.path = file.path;
    document.type = file.mimitype;
    document.is_enabled = true;
    document.ocr = null;
    document.save()
        .then((data) => {
            console.log('Post document');
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500);
            res.end(err);
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
