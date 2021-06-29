const path = require('path');
const fs = require('fs');

const config = require('../../config.json');
const Document = require('../models/document');
const excelFileService = require('../services/document/excelFile');
const pdfFileService = require('../services/document/pdfFile');
const imageFileService = require('../services/document/imageFile');

exports.sendDocument = (req, res) => {
    const file = req.file;
    const filePathArr = file.path.split('/');
    filePathArr.pop();
    const absolutePath = filePathArr.join('/');
    const fileNameWithExtension = file.filename;
    const fileName = fileNameWithExtension.split('.')[0];
    const extension = fileNameWithExtension.split('.')[1];
    const company = JSON.parse(req.body.company);
    fs.renameSync(file.path, `${absolutePath}/${fileName}_${company}.${extension}`);
    res.status(200).end('Sent to Server');
}

exports.createDocument = async (req, res) => {
    const user = req.body.user;
    const files = fs.readdirSync(path.join(__dirname, '..', '..', 'documents', 'uploaded'));
    for (let file of files) {
        let infos = null;
        const paths = file.split('/');
        const fileNameWithExtention = paths[paths.length - 1];
        const fileName = fileNameWithExtention.split('.')[0];
        const extension = fileNameWithExtention.split('.')[1];
        const fileNameArr = fileName.split('_');
        const company = fileNameArr[fileNameArr.length - 1];
        const filePath = path.join(__dirname, '..', '..', 'documents', 'uploaded', fileNameWithExtention);
        if (extension.toUpperCase() === 'XLSX') {
            infos = await excelFileService.readExcel(filePath, company);
        } else if (extension.toUpperCase() === 'PDF') {
            infos = await pdfFileService.readPdf(filePath, company);
        } else if (extension.toUpperCase() === 'JPG' ||
            extension.toUpperCase() === 'JPEG' ||
            extension.toUpperCase() === 'PNG') {
            infos = await imageFileService.readImage(filePath, company);
        } else {
            return;
        }
        const document = new Document();
        document.name = fileNameWithExtention;
        document.user = user;
        document.company = company._id;
        document.companyName = company;
        document.upload_date = Date.now();
        document.path = filePath;
        document.type = extension;
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
    }

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
