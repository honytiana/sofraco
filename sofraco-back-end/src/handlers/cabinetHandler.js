const Cabinet = require('../models/cabinet');
const fs = require('fs');

class CabinetHandler {

    constructor() { }

    createCabinet(data) {
        let cabinet = new Cabinet();
        cabinet.cabinet = data.cabinet;
        cabinet.description = data.description;
        cabinet.save();
        return cabinet;
    }

    addCabinetName(cabinet, name) {
        return Cabinet.findOneAndUpdate(
            {
                _id: cabinet
            },
            {
                $push: {
                    names: name
                }
            }
        )
    }

    editCabinetName(cabinet, odlCabinetName, cabinetName) {
        return Cabinet.findOneAndUpdate(
            {
                _id: cabinet,
                'names': odlCabinetName
            },
            { $set: { 'names.$': cabinetName } }
        )
    }

    deleteCabinetName(cabinet, cabinetName) {
        return Cabinet.findOneAndUpdate(
            {
                _id: cabinet,
                'names': cabinetName
            },
            { $pull: { 'names': cabinetName } }
        )
    }

    getCabinetById(id) {
        return Cabinet.findById(id);
    }

    getCabinets() {
        return Cabinet.find({}).sort({ cabinet: 1 });
    }

    getCabinetByName(cabinet) {
        return Cabinet.findOne({ cabinet: cabinet });
    }

    getCabinetById(id) {
        return Cabinet.findOne({ _id: id });
    }

    updateCabinet(id, data) {
        return Cabinet.findByIdAndUpdate(id, data);
    }

    deleteCabinet(id) {
        return Cabinet.findByIdAndDelete(id);
    }

    deleteAllCabinet() {
        return Cabinet.deleteMany({});
    }

    desactivateCabinet(id) {
        return Cabinet.findByIdAndUpdate(id, { active: 'Inactive', is_enabled: false });
    }

}

module.exports = new CabinetHandler();