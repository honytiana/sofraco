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

exports.getTreatments = async (req, res) => {
    console.log('get treatments');
    try {
        const c = await treatmentHandler.getTreatments();
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

exports.getProcessingTreatmentByUser = async (req, res) => {
    console.log('get treatment by user, status processing');
    try {
        const c = await treatmentHandler.getTreatmentByUser(req.params.user);
        const treatment = c.filter((treatment) => {
            return treatment.status === 'processing';
        });
        if (treatment.length > 0) {
            const time = Date.now() - treatment[0].begin_treatment;
            res.status(200).json({ treatment: treatment[0], time: time });
        } else {
            res.status(200).json({});
        }
    } catch (error) {
        res.status(400).json({ error });
    }
}

exports.getProcessingTreatment = async (req, res) => {
    console.log('get treatment status processing');
    try {
        const treatments = await treatmentHandler.getProcessingTreatment();
        if (treatments.length > 0) {
            res.status(200).json({ treatments: treatments });
        } else {
            res.status(200).json({});
        }
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

exports.updateStatusTreatmentUser = async (req, res) => {
    console.log('update Status Treatment User');
    try {
        const treatment = await treatmentHandler.updateStatusTreatmentUser(req.params.user, req.params.status);
        res.status(200).json(treatment);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.updateStatusTreatment = async (req, res) => {
    console.log('update Status Treatment');
    try {
        const treatment = await treatmentHandler.updateStatusTreatment(req.params.status);
        res.status(200).json(treatment);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.deleteTreatment = async (req, res) => {
    console.log('Delete Treatment');
    try {
        await treatmentHandler.deleteTreatment(req.params.id);
        res.status(200).end('Treatment deleted');
    } catch (error) {
        res.status(500).json({ error });
    }
}

exports.deleteAllTreatment = async (req, res) => {
    console.log('Delete all Treatment');
    try {
        await treatmentHandler.deleteAllTreatment();
        res.status(200).end('Treatments deleted');
    } catch (error) {
        res.status(500).json({ error });
    }
}
