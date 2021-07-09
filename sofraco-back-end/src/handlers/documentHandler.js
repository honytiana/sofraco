const Document = require('../models/document');
const fs = require('fs');

class DocumentHandler {

    constructor() { }

    createDocument(data) {
        let document = new Document();
        document.name = data.name;
        document.company = data.company;
        document.companyName = data.companyName;
        document.upload_date = Date.now();
        document.path_original_file = data.path_original_file;
        document.type = data.type;
        document.is_enabled = true;
        document.ocr = null;
        document.save();
        return document;
    }

    sendDocument(file, company) {
        const filePathArr = file.path.split('/');
        filePathArr.pop();
        const absolutePath = filePathArr.join('/');
        const fileNameWithExtension = file.filename;
        let fileName = fileNameWithExtension.split('.')[0];
        fileName = fileName.replace(/\s/g, '_');
        const extension = fileNameWithExtension.split('.')[1];
        fs.renameSync(file.path, `${absolutePath}/${fileName}_${company.name}.${extension}`);
    }

    getDocument(id) {
        return Document.findById(id);
    }

    getDocuments() {
        return Document.find();
    }

    updateDocument() {

    }

    deleteDocument() {

    }

}

module.exports = new DocumentHandler();