const path = require('path');

const config = require('../../config.json');
const companyHandler = require('../handlers/companyHandler');
const correspondanceHandler = require('../handlers/correspondanceHandler');
const correspondanceService = require('../services/correspondances/correspondances');

exports.createCorrespondance = async (req, res) => {
    const data = req.body;
    const authorization = req.headers.authorization;
    const correspondances = await correspondanceService.readExcelTableauCorrespondance(req.params.role);
    try {
        for (let correspondance of correspondances) {
            const c = await correspondanceHandler.createCorrespondance(correspondance);
        }
        res.status(200).end('Correspondances added');
    } catch (error) {
        res.status(400).json({ error })
    }

};

exports.addCodeCourtier = async (req, res) => {
    console.log('Add code courtier');
    const courtier = req.params.courtier;
    const idCompany = req.body.company;
    const particular = req.body.particular;
    const code = req.body.code;
    try {
        const company = await companyHandler.getCompany(idCompany);
        const correspondances = await correspondanceHandler.addCodeCourtier(courtier, idCompany, company.name, particular, code);
        res.status(200).end('Code added');
    } catch (error) {
        res.status(400).json({ error })
    }
};

exports.editCodeCourtier = async (req, res) => {
    console.log('Modifier le code courtier');
    const courtier = req.params.courtier;
    const company = req.body.company;
    const particular = req.body.particular;
    const code = req.body.code;
    try {
        const correspondances = await correspondanceHandler.editCodeCourtier(courtier, company, code);
        res.status(200).end('Code modifié');
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

exports.deleteCodeCourtier = async (req, res) => {
    console.log('Delete code courtier');
    try {
        const corr = await correspondanceHandler.deleteCodeCourtier(req.params.courtier, req.params.code);
        res.status(200).end('Code courtier deleted');
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
