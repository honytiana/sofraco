const Document = require('../models/document');
const fs = require('fs');

class DocumentHandler {

    constructor() { }

    createDocument(data) {
        let document = new Document();
        document.name = data.name;
        document.company = data.company;
        document.companyGlobalName = data.companyGlobalName;
        document.companyName = data.companyName;
        document.upload_date = data.upload_date;
        document.path_original_file = data.path_original_file;
        document.type = data.type;
        document.status = data.status;
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

    getDocumentsByStatus(status) {
        return Document.find({
            status: status
        });
    }

    getDocumentsByYearMonth(year, month) {
        const myear = parseInt(year);
        const mmonth = parseInt(month);
        return Document.find({
            upload_date: {
                $gte: new Date(myear, mmonth, 1),
                $lt: new Date(myear, mmonth + 1, 1)
            }
        });
    }

    getDocumentsCompanyByYearMonth(company, year, month) {
        const myear = parseInt(year);
        const mmonth = parseInt(month);
        return Document.find({
            $and: [
                {
                    company: company
                },
                {
                    upload_date: {
                        $gte: new Date(myear, mmonth),
                        $lt: new Date(myear, mmonth + 1)
                    }
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

    deleteDocument(id) {
        return Document.deleteOne({_id: id});
    }

    deleteAllDocuments() {
        return Document.deleteMany({});
    }

}

module.exports = new DocumentHandler();