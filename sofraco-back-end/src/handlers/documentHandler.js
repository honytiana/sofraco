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

    getDocumentsByYearMonth(year, month) {
        const myear = parseInt(year);
        const mmonth = parseInt(month);
        return Document.find({
            upload_date: {
                $gte: new Date(myear, mmonth - 1, 1),
                $lt: new Date(myear, mmonth, 1)
            }
        });
    }

    getDocumentsByYearMonth(company, year, month) {
        const myear = parseInt(year);
        const mmonth = parseInt(month);
        return Document.find({
            $and: [
                {
                    upload_date: {
                        $gte: new Date(myear, mmonth - 1, 1),
                        $lt: new Date(myear, mmonth, 1)
                    }
                },
                {
                    company: company
                }
            ]
        }
        );
    }

    getDocumentsCompany(company) {
        return Document.find({
            company: company
        });
    }

    updateDocument(id, data) {
        return Document.findByIdAndUpdate(id, data);
    }

    deleteDocument() {

    }

    deleteAllDocuments() {
        return Document.deleteMany({});
    }

}

module.exports = new DocumentHandler();