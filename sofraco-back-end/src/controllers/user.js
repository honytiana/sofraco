const path = require('path');
const bcrypt = require('bcrypt');

const config = require('../../config.json');
const userHandler = require('../handlers/userHandler');
const tokenHandler = require('../handlers/tokenHandler');

exports.createUser = async (req, res) => {      // signup
    const data = req.body;
    try {
        const hash = await bcrypt.hash(data.password, 10);
        let user = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            login: data.login,
            password: hash,
            create_date: data.create_date,
            role: data.role
        };
        try {
            const u = await userHandler.createUser(user);
            res.status(200).json(u);
        } catch (error) {
            res.status(400).json({ error })
        }
    } catch (error) {
        res.status(500).json({ error })
    }
};

exports.login = async (req, res) => {
    try {
        const user = await userHandler.getOneUser(req.body.login);
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        try {
            const valid = await bcrypt.compare(req.body.password, user.password);
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            const token = await tokenHandler.createTokens(user._id);
            // res.cookie('token', token, { maxAge: 10 * 3600, encode: async (token) => { await bcrypt.hash(token, 10) } });
            res.status(200)
                .json({
                    userId: user._id,
                    token,
                    expiresIn: 4
                });
        } catch (error) {
            res.status(500).json({ error });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
}

exports.createToken = (req, res, next) => {

};

exports.getUsers = async (req, res) => {
    console.log('get users');
    try {
        const users = await userHandler.getUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ err });
    }
}

exports.getUser = async (req, res) => {
    console.log('get user');
    try {
        const user = await userHandler.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ err });
    }
}
