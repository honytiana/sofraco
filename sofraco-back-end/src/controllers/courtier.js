const path = require('path');

const config = require('../../config.json');
const Courtier = require('../models/courtier');
const courtierHandler = require('../handlers/courtierHandler');


exports.createCourtier = async (req, res) => {
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
    console.log('get courtier');
    try {
        const courtier = await courtierHandler.getCourtierById(req.params.id);
        res.status(200).json(courtier);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getCourtiers = async (req, res) => {
    console.log('get courtiers and mandataires');
    try {
        const courtiers = await courtierHandler.getCourtiers();
        res.status(200).json(courtiers);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getCourtiersByRole = async (req, res) => {
    console.log('get courtiers by role');
    try {
        const courtiers = await courtierHandler.getCourtiersByRole(req.params.role);
        res.status(200).json(courtiers);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getMandatairesOfCourtier = async (req, res) => {
    console.log('get mandataires of courtier');
    try {
        const courtiers = await courtierHandler.getMandatairesOfCourtier(req.params.courtier);
        res.status(200).json(courtiers);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getCourtierOfMandataire = async (req, res) => {
    console.log('get courtier of mandataire');
    try {
        const courtier = await courtierHandler.getCourtierOfMandataire(req.params.mandataire);
        res.status(200).json(courtier);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.updateCourtier = async (req, res) => {
    console.log('Update courtier');
    try {
        const courtier = await courtierHandler.updateCourtier(req.params.id, req.body);
        res.status(200).json(courtier);
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.deleteCourtier = async (req, res) => {
    console.log('Delete courtier');
    try {
        const courtiers = await courtierHandler.deleteCourtier(req.params.id);
        res.status(200).json(courtiers);
    } catch (error) {
        res.status(500).json({ error });
    }
};
