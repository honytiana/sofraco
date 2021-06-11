const body_parser = require('body-parser');
const express = require('express');

module.exports = async function ({ app }) {
    // app.use(body_parser.json());
    // app.use(body_parser.urlencoded());
    app.use((express.json()));

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        next();
    });

}
