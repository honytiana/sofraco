const Tokens = require('../models/tokens');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class TokensHandler {

    constructor() { }

    createTokens(userId, navigator) {
        try {
            const token = jwt.sign(
                { userId },
                'SOFRACO_TOKEN_SECRET',
                { expiresIn: '10h' }
            );
            let tokens = new Tokens();
            tokens.value = token;
            tokens.userId = userId;
            tokens.navigator = navigator;
            tokens.expiresIn = + new Date() + 10 * 3600 * 1000;
            tokens.save();
            return tokens;
        } catch (err) {
            console.log(err);
        }
    }

    async checkToken(userId, value) {
        const tokens = await Tokens.find({ userId: userId });
        for (let tk of tokens) {
            if (!tk) {
                console.error('Token not found');
                continue;
            }
            const isValid = (value === tk.value) ? true : false;
            if (!isValid) {
                console.error('value doesn\'t match');
                continue;
            }
            if (tk.expiresIn < Date.now()) {
                console.error('token is expired');
                continue;
            }
            return tk;
        }
    }

    getTokenByUser(userId) {
        return Tokens.findOne({ userId: userId });
    }

    getTokens(userId) {
        return Tokens.find({});
    }

    removeTokenById(id) {
        return Tokens.findByIdAndRemove(id);
    }

    removeTokenByUser(userId) {
        return Tokens.deleteMany({ userId: userId });
    };

}

module.exports = new TokensHandler();