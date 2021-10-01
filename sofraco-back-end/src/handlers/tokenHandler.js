const Tokens = require('../models/tokens');
const fs = require('fs');
const jwt = require('jsonwebtoken');

class TokensHandler {

    constructor() { }

    createTokens(userId) {
        try {
            const token = jwt.sign(
                { userId },
                'SOFRACO_TOKEN_SECRET',
                { expiresIn: '4h' }
            );
            let tokens = new Tokens();
            tokens.value = token;
            tokens.userId = userId;
            tokens.expiresIn = + new Date() + 4 * 3600 * 1000;
            tokens.save();
            return tokens;
        } catch (err) {
            console.log(err);
        }
    }

    async checkToken(userId, value) {
        const tk = await Tokens.findOne({ userID: userId });
        if (!tk) {
            throw 'Token not found';
        }

        const isValid = await bcrypt.compare(value, tk.value);
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

    removeTokenById(id) {
        return Tokens.findByIdAndRemove(id);
    }

    removeTokenByUser(userId) {
        return Tokens.deleteMany({ userId: userId });
    };

}

module.exports = new TokensHandler();