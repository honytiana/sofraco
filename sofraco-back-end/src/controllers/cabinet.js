const path = require('path');

const config = require('../../config.json');
const Cabinet = require('../models/cabinet');
const cabinetHandler = require('../handlers/cabinetHandler');


exports.createCabinet = async (req, res) => {
    console.log(`${new Date()} Create cabinet`);
    const data = req.body;
    let cabinet = {
        lastName: data.lastName,
        firstName: data.firstName,
        courtier: data.courtier,
        email: data.email,
        phone: data.phone
    };
    try {
        const c = await cabinetHandler.createCabinet(cabinet);
        res.status(200).json(c);
    } catch (error) {
        res.status(500).json({ error });
    }

};

exports.getCabinet = async (req, res) => {
    console.log(`${new Date()} get cabinet`);
    try {
        const cabinet = await cabinetHandler.getCabinetById(req.params.id);
        res.status(200).json(cabinet);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getCabinets = async (req, res) => {
    console.log(`${new Date()} get cabinets`);
    try {
        const cabinets = await cabinetHandler.getCabinets();
        res.status(200).json(cabinets);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.updateCabinet = async (req, res) => {
    console.log(`${new Date()} Update cabinet`);
    try {
        const cabinet = await cabinetHandler.updateCabinet(req.params.id, req.body);
        res.status(200).json(cabinet);
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.deleteCabinet = async (req, res) => {
    console.log(`${new Date()} Delete cabinet`);
    try {
        const cabinets = await cabinetHandler.deleteCabinet(req.params.id);
        res.status(200).json(cabinets);
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.deleteAllCabinets = async (req, res) => {
    console.log(`${new Date()} Delete all cabinets`);
    try {
        const cabinets = await cabinetHandler.deleteAllCabinet();
        res.status(200).end(`Cabinets deleted`);
    } catch (error) {
        res.status(500).json({ error });
    }
};
