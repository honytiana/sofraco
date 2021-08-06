const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../../config.json');
const userHandler = require('../handlers/userHandler');

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
            const u = userHandler.createUser(user);
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
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    'SOFRACO_TOKEN_SECRET',
                    { expiresIn: '4h' }
                )
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

exports.getUsers = (req, res) => {
    console.log('get users');
    const users = userHandler.getUsers();
    res.status(200).json(users);
}

exports.getUser = async (req, res) => {
    console.log('get user');
    const user = await userHandler.getUserById(req.params.id);
    res.status(200).json(user);
}
