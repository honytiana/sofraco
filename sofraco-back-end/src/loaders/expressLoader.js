const body_parser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const httpProxy = require('http-proxy');
const { logger } = require('../tools/logger');

require('dotenv').config();

module.exports = async function ({ app }) {
    const stream = {
        write: (text) => {
            logger.info(text);
        }
    };
    const proxy = httpProxy.createProxyServer({
        target: `${process.env.NODE_SRC}:${process.env.PORT}`,
        ws: true
    });
    // app.use(body_parser.json());
    // app.use(body_parser.urlencoded());
    app.use(cookieParser());
    app.use(cors());
    app.use((express.json()));
    app.use(morgan('combined', { stream: stream }));

    const allowedOrigin = JSON.parse(process.env.ALLOW_ORIGIN);
    
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
        res.cookie('sofraco', `${await bcrypt.hash('!SOFRACO!2022#bordereaux sofraco', 10)}`, { maxAge: 10 * 60 * 60 * 1000 });
        res.status(200).json({
            'status': 'Sofraco api is OK'
        });
    });

    // app.use((req, res, next) => {
    //     proxy.web(req, res, {
    //         ws: true
    //     }, (err) => {
    //         console.log(err);
    //     });
    //     next();
    // });

}
