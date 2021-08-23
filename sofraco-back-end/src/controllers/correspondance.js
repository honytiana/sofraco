const path = require('path');

const config = require('../../config.json');
const correspondanceHandler = require('../handlers/correspondanceHandler');
const correspondanceService = require('../services/correspondances/correspondances');

exports.createCorrespondance = async (req, res) => {
    const data = req.body;
    const authorization = req.headers.authorization;
    const correspondances = await correspondanceService.readExcelTableauCorrespondance(authorization, req.params.role);
    try {
        for (let correspondance of correspondances) {
            const c = await correspondanceHandler.createCorrespondance(correspondance);
        }
        res.status(200).end('Correspondances added');
    } catch (error) {
        res.status(400).json({ error })
    }

};

exports.getCorrespondance = async (req, res) => {
    console.log('get correspondance');
    try {
        const correspondance = await correspondanceHandler.getCorrespondance(req.params.id);
        res.status(200).json(correspondance);
    } catch (error) {
        res.status(400).json({ error });
    }
}

exports.getCorrespondanceByCourtier = async (req, res) => {
    console.log('get correspondance by courtier');
    try {
        const correspondance = await correspondanceHandler.getCorrespondanceByCourtier(req.params.courtier);
        res.status(200).json(correspondance);
    } catch (error) {
        res.status(400).json({ error });
    }
}

exports.getCorrespondances = async (req, res) => {
    console.log('get correspondances');
    try {
        const correspondances = await correspondanceHandler.getCorrespondances();
        res.status(200).json(correspondances);
    } catch (error) {
        res.status(400).json({ error });
    }
}

exports.updateCorrespondance = async (req, res) => {
    console.log('update correpondance');
    try {
        const correspondance = await correspondanceHandler.updateCorrespondance(req.params.id, req.body);
        res.status(200).json(correspondance);
    } catch (error) {
        res.status(500).json({ error });
    }
}

exports.deleteCorrespondance = async (req, res) => {
    console.log('Delete correspondance');
    try {
        const corr = await correspondanceHandler.deleteCorrespondance(req.params.id);
        res.status(200).end('Correspondance deleted');
    } catch (error) {
        res.status(500).json({ error });
    }
}

exports.deleteAllCorrespondances = async (req, res) => {
    console.log('Delete all correspondances');
    try {
        await correspondanceHandler.deleteAllCorrespondances();
        res.status(200).end('Correspondances deleted');
    } catch (error) {
        res.status(500).json({ error });
    }
}
