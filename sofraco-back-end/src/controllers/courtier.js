const path = require('path');

const config = require('../../config.json');
const Courtier = require('../models/courtier');
const courtierHandler = require('../handlers/courtierHandler');
const correspondanceHandler = require('../handlers/correspondanceHandler');


exports.createCourtier = async (req, res) => {
    console.log(`${new Date()} Create courtier`);
    const data = req.body;
    let courtier = {
        lastName: data.lastName,
        firstName: data.firstName,
        cabinet: data.cabinet,
        email: data.email,
        phone: data.phone,
        status: 'Active',
        role: data.role,
        is_enabled: true
    };
    try {
        const c = await courtierHandler.createCourtier(courtier);
        res.status(200).json(c);
    } catch (error) {
        res.status(500).json({ error });
    }

};

exports.getCourtier = async (req, res) => {
    console.log(`${new Date()} get courtier`);
    try {
        const courtier = await courtierHandler.getCourtierById(req.params.id);
        res.status(200).json(courtier);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getCourtiers = async (req, res) => {
    console.log(`${new Date()} get courtiers and mandataires`);
    try {
        const courtiers = await courtierHandler.getCourtiers();
        res.status(200).json(courtiers);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getCourtiersByRole = async (req, res) => {
    console.log(`${new Date()} get courtiers by role`);
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const skip = req.query.limit ? parseInt(req.query.skip) : 0;
    try {
        const courtiers = await courtierHandler.getCourtiersByRole(req.params.role, limit, skip);
        res.status(200).json(courtiers);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getMandatairesOfCourtier = async (req, res) => {
    console.log(`${new Date()} get mandataires of courtier`);
    try {
        const courtiers = await courtierHandler.getMandatairesOfCourtier(req.params.courtier);
        res.status(200).json(courtiers);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getCourtierOfMandataire = async (req, res) => {
    console.log(`${new Date()} get courtier of mandataire`);
    try {
        const courtier = await courtierHandler.getCourtierOfMandataire(req.params.mandataire);
        res.status(200).json(courtier);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getGlobalCourtierMandataireCodeLike = async (req, res) => {
    console.log(`${new Date()} search courtier by name, cabinet`);
    try {
        const courtiers = await courtierHandler.getCourtiersLike(req.params.name);
        const mandataires = await courtierHandler.getMandatairesLike(req.params.name);
        const correspondances = await correspondanceHandler.getCorrespondancesLike(req.params.name);
        res.status(200).json({ courtiers, mandataires, correspondances });
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.updateCourtier = async (req, res) => {
    console.log(`${new Date()} Update courtier`);
    try {
        const courtier = await courtierHandler.updateCourtier(req.params.id, req.body);
        res.status(200).json(courtier);
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.updateAllCourtier = async (req, res) => {
    console.log(`${new Date()} Update All courtier`);
    try {
        const courtiers = await courtierHandler.updateAllCourtier();
        res.status(200).json(courtiers);
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.addEmailCopieCourtier = async (req, res) => {
    console.log(`${new Date()} Add email copie courtier`);
    try {
        const courtier = await courtierHandler.addEmailCopieCourtier(req.params.courtier, req.body.emailCopie);
        res.status(200).json(courtier);
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.editEmailCopieCourtier = async (req, res) => {
    console.log(`${new Date()} Edit email copie courtier`);
    try {
        const courtier = await courtierHandler.editEmailCopieCourtier(req.params.courtier, req.body.oldEmailCopie, req.body.emailCopie);
        res.status(200).json(courtier);
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.deleteEmailCopieCourtier = async (req, res) => {
    console.log(`${new Date()} Delete email copie courtier`);
    try {
        const courtier = await courtierHandler.deleteEmailCopieCourtier(req.params.courtier, req.body.emailCopie);
        res.status(200).json(courtier);
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.deleteCourtier = async (req, res) => {
    console.log(`${new Date()} Delete courtier`);
    try {
        const courtiers = await courtierHandler.deleteCourtier(req.params.id);
        res.status(200).json(courtiers);
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.deleteAllCourtiers = async (req, res) => {
    console.log(`${new Date()} Delete all courtiers`);
    try {
        const courtiers = await courtierHandler.deleteAllCourtier();
        res.status(200).end(`Courtiers deleted`);
    } catch (error) {
        res.status(500).json({ error });
    }
};
