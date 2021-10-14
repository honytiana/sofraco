const Treatment = require('../models/treatment');
const fs = require('fs');

class TreatmentHandler {

    constructor() { }

    createTreatment(data) {
        let treatment = new Treatment();
        treatment.user = data.user;
        treatment.begin_treatment = Date.now();
        treatment.status = data.status;
        treatment.progress = data.progress;
        treatment.save();
        return treatment;
    }

    getTreatment(id) {
        return Treatment.findById(id);
    }

    getTreatmentByUser(user) {
        return Treatment.find({ user: user });
    }

    getTreatments() {
        return Treatment.find();
    }

    updateTreatment(id, data) {
        return Treatment.findByIdAndUpdate(id, data);
    }

    deleteTreatment(id) {
        return Treatment.deleteOne({ _id: id });
    }

}

module.exports = new TreatmentHandler();