const path = require('path');

const config = require('../../config.json');
const correspondanceHandler = require('../handlers/correspondanceHandler');
const correspondanceService = require('../services/correspondances/correspondances');

exports.createCorrespondance = async (req, res) => {
    const data = req.body;
    const authorization = req.headers.authorization;
    const correspondances = await correspondanceService.readExcelTableauCorrespondance(authorization);
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
    const correspondance = await correspondanceHandler.getCorrespondance(req.params.id);
    res.status(200).json(correspondance);
}

exports.getCorrespondanceByCourtier = async (req, res) => {
    console.log('get correspondance by courtier');
    const correspondance = await correspondanceHandler.getCorrespondanceByCourtier(req.params.courtier);
    res.status(200).json(correspondance);
}

exports.getCorrespondances = async (req, res) => {
    console.log('get correspondances');
    const correspondances = await correspondanceHandler.getCorrespondances();
    res.status(200).json(correspondances);
}

exports.updateCorrespondance = (req, res) => {
    console.log('update')
}
