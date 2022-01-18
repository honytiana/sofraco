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

    async checkToken(userId, value, cookies) {
        const token = cookies.sofraco;
        const tk = await Tokens.findOne({ userId: userId });
        if (!tk) {
            throw 'Token not found';
        }
        if (!token) {
            throw 'Token not found';
        }

        const isValid = (value === tk.value) ? true : false;
        if (!isValid) {
            throw "value doesn't match";
        }

        if (tk.expiresIn < Date.now()) {
            throw 'token is expired';
        }
        return tk;
    }

    getTokenByUser(userId) {
        return Tokens.findOne({ userId: userId });
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

}

module.exports = new TokensHandler();