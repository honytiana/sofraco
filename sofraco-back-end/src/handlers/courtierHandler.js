const Courtier = require('../models/courtier');
const fs = require('fs');

class CourtierHandler {

    constructor() { }

    createCourtier(data) {
        let courtier = new Courtier();
        courtier.lastName = data.lastName;
        courtier.firstName = data.firstName;
        courtier.cabinet = data.cabinet;
        courtier.cabinetRef = data.cabinetRef;
        courtier.email = data.email;
        courtier.emailCopie = data.emailCopie;
        courtier.phone = data.phone;
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

    getCourtiersLike(name) {
        return Courtier.find({
            role: 'courtier',
            $or: [
                {
                    lastName: { $regex: name, $options: 'i' }
                },
                {
                    firstName: { $regex: name, $options: 'i' }
                },
                {
                    cabinet: { $regex: name, $options: 'i' }
                },
            ]
        });
    }

    getMandatairesLike(name) {
        return Courtier.find({
            role: 'mandataire',
            $or: [
                {
                    lastName: { $regex: name, $options: 'i' }
                },
                {
                    firstName: { $regex: name, $options: 'i' }
                },
                {
                    cabinet: { $regex: name, $options: 'i' }
                },
            ]
        });
    }

    updateCourtier(id, data) {
        return Courtier.findByIdAndUpdate(id, data);
    }

    updateAllCourtier() {
        return Courtier.updateMany({ is_enabled: 'TRUE' }, { $set: { is_enabled: true } });
    }

    updateCourtierSetCabinets(courtier, cabinet) {
        return Courtier.findOneAndUpdate(
            {
                _id: courtier
            },
            {
                cabinetRef: cabinet
            }
        )
    }

    addEmailCopieCourtier(courtier, email) {
        return Courtier.findOneAndUpdate(
            {
                _id: courtier
            },
            {
                $push: {
                    emailCopie: email
                }
            }
        )
    }

    editEmailCopieCourtier(courtier, oldEmailCopie, emailCopie) {
        return Courtier.findOneAndUpdate(
            {
                _id: courtier,
                'emailCopie': oldEmailCopie
            },
            { $set: { 'emailCopie.$': emailCopie } }
        )
    }

    deleteEmailCopieCourtier(courtier, emailCopie) {
        return Courtier.findOneAndUpdate(
            {
                _id: courtier,
                'emailCopie': emailCopie
            },
            { $pull: { 'emailCopie': emailCopie } }
        )
    }

    deleteCourtier(id) {
        return Courtier.findByIdAndDelete(id);
    }

    deleteAllCourtier() {
        return Courtier.deleteMany({});
    }

    desactivateCourtier(id) {
        return Courtier.findByIdAndUpdate(id, { active: 'Inactive', is_enabled: false });
    }

}

module.exports = new CourtierHandler();