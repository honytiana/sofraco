const tokenHandler = require("../handlers/tokenHandler");

exports.getTokenByUser = async (req, res) => {
    console.log(`${new Date()} Get token by user`);
    try {
        const tokens = await tokenHandler.getTokenByUser(req.params.userId);
        res.status(200).json(tokens);
    } catch (err) {
        res.status(400).json({ err });
    }
};

exports.getTokens = async (req, res) => {
    console.log(`${new Date()} Get all tokens`);
    try {
        const tokens = await tokenHandler.getTokens();
        res.status(200).json(tokens);
    } catch (err) {
        res.status(400).json({ err });
    }
};

exports.checkToken = async (req, res) => {
    console.log(`${new Date()} Check token`);
    try {
        console.log(req.cookies);
        const token = await tokenHandler.checkToken(req.params.userId, req.cookies);
        res.status(200).json(token);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.removeTokenById = async (req, res) => {
    console.log(`${new Date()} Remove token by id`);
    try {
        await tokenHandler.removeTokenById(req.params.id);
        res.status(200).end('Token deleted');
    } catch (err) {
        res.status(400).json({ err });
    }
};

exports.removeTokenByUser = async (req, res) => {
    console.log(`${new Date()} Remove token by user`);
    try {
        await tokenHandler.removeTokenByUser(req.params.userId);
        res.status(200).end('Token deleted');
    } catch (err) {
        res.status(400).json({ err });
    }
};

exports.removeTokenUser = async (req, res) => {
    console.log(`${new Date()} Remove token user`);
    try {
        await tokenHandler.removeTokenUser(req.params.userId, req.params.token);
        res.status(200).end('Token deleted');
    } catch (err) {
        res.status(400).json({ err });
    }
};

exports.deleteAllToken = async (req, res) => {
    console.log(`${new Date()} Delete all token`);
    try {
        await tokenHandler.deleteAllToken();
        res.status(200).end('Tokens deleted');
    } catch (error) {
        res.status(500).json({ error });
    }
}