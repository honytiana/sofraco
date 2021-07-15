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

    getDocument(id) {
        return Document.findById(id);
    }

    getDocuments() {
        return Document.find();
    }

    updateDocument(id, data) {
        return Document.findByIdAndUpdate(id, data);
    }

    deleteDocument() {

    }

}

module.exports = new DocumentHandler();