const config = require('../../config.json');
const treatmentHandler = require('../handlers/treatmentHandler');

exports.createTreatment = async (req, res) => {
    const treatment = req.body;
    try {
        const c = await treatmentHandler.createTreatment(treatment);
        res.status(200).json(c);
    } catch (error) {
        res.status(400).json({ error });
    }

};

exports.getTreatment = async (req, res) => {
    console.log('get treatment');
    try {
        const c = await treatmentHandler.getTreatment(req.params.id);
        res.status(200).json(c);
    } catch (error) {
        res.status(400).json({ error });
    }
}

exports.getTreatmentByUser = async (req, res) => {
    console.log('get treatment by user');
    try {
        const c = await treatmentHandler.getTreatmentByUser(req.params.user);
        res.status(200).json(c);
    } catch (error) {
        res.status(400).json({ error });
    }
}

exports.getTreatments = async (req, res) => {
    console.log('get treatments');
    try {
        const treatments = await treatmentHandler.getCompanies();
        res.status(200).json(treatments);
    } catch (error) {
        res.status(400).json({ error });
    }
}

exports.updateTreatment = async (req, res) => {
    console.log('update treatment');
    const data = req.body;
    try {
        const treatment = await treatmentHandler.updateTreatment(req.params.id, data);
        res.status(200).json(treatment);
    } catch (error) {
        res.status(400).json({ error });
    }
}

exports.deleteTreatment = async (req, res) => {
    console.log('Delete Treatment');
    try {
        await treatmentHandler.deleteTreatment(req.params.id);
        res.status(200).end('Treatment deleted');
    } catch (error) {
        res.status(500).json({ error });
    }
}
