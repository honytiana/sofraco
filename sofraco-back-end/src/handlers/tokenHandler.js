const Tokens = require('../models/tokens');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class TokensHandler {

    constructor() { }

    createTokens(userId) {
        try {
            const token = jwt.sign(
                { userId },
                'SOFRACO_TOKEN_SECRET',
                { expiresIn: '10h' }
            );
            let tokens = new Tokens();
            tokens.value = token;
            tokens.userId = userId;
            tokens.expiresIn = + new Date() + 10 * 3600 * 1000;
            tokens.save();
            return tokens;
        } catch (err) {
            console.log(err);
        }
    }

    async checkToken(userId, cookies) {
        const sofraco = cookies.sofraco;
        const token = cookies.sofraco_;
        const tk = await Tokens.findOne({ userId: userId, value: token });
        const tokenFind = await Tokens.findOne({ value: token });

        console.log(`Token recu et créé : ${cookies}`);
        console.log(`Token trouvé dans la base: ${tokenFind}`);
        if (!tk) {
            throw `Token not found - no token ${tk}  ${userId}  ${token}`;
        }
        if (!sofraco) {
            throw 'Token not found - no sofraco cookie';
        }

        const isValid = (token === tk.value) ? true : false;
        if (!isValid) {
            throw "value doesn't match";
        }

        if (tk.expiresIn < Date.now()) {
            throw 'token is expired';
        }
        return tk;
    }

    getTokenByUser(userId) {
        return Tokens.find({ userId: userId });
    }

    getTokens() {
        return Tokens.find({});
    }

    removeTokenById(id) {
        return Tokens.findByIdAndRemove(id);
    }

    removeTokenByUser(userId) {
        return Tokens.deleteOne({ userId: userId });
    };

    removeTokenUser(userId, token) {
        return Tokens.deleteOne({ userId: userId, value: token });
    };

    deleteAllToken() {
        return Tokens.deleteMany({});
    }

}

module.exports = new TokensHandler();