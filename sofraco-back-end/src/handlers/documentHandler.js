const Document = require('../models/document');
const fs = require('fs');

class DocumentHandler {

    constructor() { }

    createDocument(data) {
        let document = new Document();
        document.name = data.name;
        document.company = null;
        document.companyName = data.companyName;
        document.upload_date = Date.now();
        document.path = data.path;
        document.type = data.type;
        document.is_enabled = true;
        document.ocr = data.ocr;
        document.save();
        return document;
    }

    sendDocument(file, company) {
        const filePathArr = file.path.split('/');
        filePathArr.pop();
        const absolutePath = filePathArr.join('/');
        const fileNameWithExtension = file.filename;
        const fileName = fileNameWithExtension.split('.')[0];
        const extension = fileNameWithExtension.split('.')[1];
        fs.renameSync(file.path, `${absolutePath}/${fileName}_${company}.${extension}`);
    }

    getDocument(id) {
        Document.findById(id, (err, doc) => {
            if (err) {
                console.log(err);
            } else {
                return doc;
            }
        });
    }

    getDocuments() {
        Document.find((err, doc) => {
            if (err) {
                console.log(err);
            } else {
                return doc;
            }
        });
    }

    updateDocument() {

    }

    deleteDocument() {

    }

}

module.exports = new DocumentHandler();