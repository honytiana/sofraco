const body_parser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const { logger } = require('../tools/logger');

module.exports = async function ({ app }) {
    const stream = {
        write: (text) => {
            logger.info(text);
        }
    }
    // app.use(body_parser.json());
    // app.use(body_parser.urlencoded());
    app.use(cookieParser());
    app.use(cors());
    app.use((express.json()));
    app.use(morgan('combined', { stream: stream }));

    const allowedOrigin = ['http://localhost:3000', 'http://localhost:9000', 'http://92.182.25.197:3000', 'http://92.182.25.197:9000', 'http://192.168.20.48:3000', 'http://192.168.20.48:9000'];

    app.use((req, res, next) => {
        const origin = req.headers.origin;
        if (allowedOrigin.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        next();
    });

    app.get('/api/api-status', async (req, res) => {
        res.cookie('sofraco', `${await bcrypt.hash('SOFRACO!2022#', 10)}`, { maxAge: 10 * 3600 });
        res.status(200).json({
            'status': 'Sofraco api is OK'
        });
    });

}
