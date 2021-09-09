const Correspondance = require('../models/correspondance');
const fs = require('fs');

class CorrespondanceHandler {

    constructor() { }

    createCorrespondance(data) {
        let correspondance = new Correspondance();
        correspondance.courtier = data.courtier;
        correspondance.companies = data.companies;
        correspondance.role_courtier = data.role_courtier;
        correspondance.is_enabled = true;
        correspondance.save();
        return correspondance;
    }

    getCorrespondance(id) {
        return Correspondance.findById(id);
    }

    getCorrespondanceByCourtier(courtier) {
        return Correspondance.findOne({ courtier: courtier });
    }

    getCorrespondances() {
        return Correspondance.find();
    }

    addCodeCourtier(courtier, idCompany, company, particular, code) {
        return Correspondance.findOneAndUpdate(
            {
                courtier: courtier
            },
            {
                $push: {
                    companies: {
                        idCompany: idCompany,
                        company: company,
                        particular: particular,
                        code: code,
                        is_enabled: true
                    }
                }
            }
        )
    }

    editCodeCourtier(courtier, company, code) {
        return Correspondance.findOneAndUpdate(
            {
                courtier: courtier,
                'companies.company': company
            },
            { $set: { 'companies.$.code': code } }
        )
    }

    updateCorrespondance(id, data) {
        return Correspondance.findByIdAndUpdate(id, data);
    }

    deleteCorrespondance(id) {
        return Correspondance.findByIdAndUpdate(id, { is_enabled: false });
    }

    deleteCodeCourtier(courtier, code) {
        return Correspondance.findOneAndUpdate(
            {
                courtier: courtier,
                'companies.code': code
            },
            { $set: { 'companies.$.is_enabled': false } }
        );

    }

    deleteAllCorrespondances() {
        return Correspondance.deleteMany({});
    }

}

module.exports = new CorrespondanceHandler();