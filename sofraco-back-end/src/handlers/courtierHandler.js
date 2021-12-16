const Courtier = require('../models/courtier');
const fs = require('fs');

class CourtierHandler {

    constructor() { }

    createCourtier(data) {      // signup
        let courtier = new Courtier();
        courtier.lastName = data.lastName;
        courtier.firstName = data.firstName;
        courtier.cabinet = data.cabinet;
        courtier.email = data.email;
        courtier.phone = data.phone;
        courtier.status = data.status;
        courtier.role = data.role;
        courtier.is_enabled = data.is_enabled;
        courtier.save();
        return courtier;
    }

    getCourtierById(id) {
        return Courtier.findById(id);
    }

    getCourtiers() {
        return Courtier.find({});
    }

    getCourtiersByRole(role, limit = 0, skip = 0) {
        return Courtier.find({ role: role, is_enabled: true }).skip(skip).limit(limit);
    }

    async getMandatairesOfCourtier(courtier) {
        const cr = await Courtier.findById(courtier);
        return Courtier.find({
            cabinet: cr.cabinet,
            role: 'mandataire'
        });
    }

    async getCourtierOfMandataire(mandataire) {
        const md = await Courtier.findById(mandataire);
        return Courtier.find({
            cabinet: md.cabinet,
            role: 'courtier'
        });
    }

    getCourtierById(id) {
        return Courtier.findOne({ _id: id });
    }

    updateCourtier(id, data) {
        return Courtier.findByIdAndUpdate(id, data);
    }

    updateAllCourtier() {
        return Courtier.updateMany({ is_enabled: 'TRUE' }, { $set: { is_enabled: true } });
    }

    deleteCourtier(id) {
        return Courtier.findByIdAndDelete(id);
    }

    // deleteCourtier(id) {
    //     return Courtier.findByIdAndUpdate(id, { active: 'Inactive', is_enabled: false });
    // }

}

module.exports = new CourtierHandler();