const Correspondance = require('../models/correspondance');
const fs = require('fs');

class CorrespondanceHandler {

    constructor() { }

    createCorrespondance(data) {
        let correspondance = new Correspondance();
        correspondance.courtier = data.courtier;
        correspondance.companies = data.companies;
        correspondance.is_enabled = data.is_enabled;
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

    updateCorrespondance(id, data) {
        return Correspondance.findByIdAndUpdate(id, data);
    }

    deleteCorrespondance() {

    }

}

module.exports = new CorrespondanceHandler();