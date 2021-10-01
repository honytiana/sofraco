const tokenHandler = require("../handlers/tokenHandler");

exports.getTokenByUser = async (req, res) => {
    console.log('Get token');
    try {
        const token = await tokenHandler.getTokenByUser(req.params.userId);
        res.status(200).json(token);
    } catch (err) {
        res.status(400).json({ err });
    }
};

exports.checkToken = async (req, res) => {
    console.log('Check token');
    try {
        const token = await tokenHandler.checkToken(req.params.userId, req.params.token);
        res.status(200).json(token);
    } catch (err) {
        res.status(400).json({ err });
    }
};

exports.removeTokenById = async (req, res) => {
    console.log('Remove token by id');
    try {
        await tokenHandler.removeTokenById(req.params.id);
        res.status(200).end('Token deleted');
    } catch (err) {
        res.status(400).json({ err });
    }
};

exports.removeTokenByUser = async (req, res) => {
    console.log('Remove token by user');
    try {
        await tokenHandler.removeTokenByUser(req.params.userId);
        res.status(200).end('Token deleted');
    } catch (err) {
        res.status(400).json({ err });
    }
};