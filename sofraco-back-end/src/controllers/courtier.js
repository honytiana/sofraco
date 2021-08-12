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
        status: data.status,
        role: data.role,
        is_enabled: data.is_enabled
    };
    try {
        const c = await courtierHandler.createCourtier(courtier);
        res.status(200).json(c);
    } catch (error) {
        res.status(400).json({ error })
    }

};

exports.getCourtier = async (req, res) => {
    console.log('get courtier');
    try {
        const courtier = await courtierHandler.getCourtierById(req.params.id);
        res.status(200).json(courtier);
    } catch (error) {
        res.status(400).json({ error })
    }
}

exports.getCourtiers = async (req, res) => {
    console.log('get courtiers');
    try {
        const courtiers = await courtierHandler.getCourtiers();
        res.status(200).json(courtiers);
    } catch (error) {
        res.status(400).json({ error })
    }
}
