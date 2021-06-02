const express = require('express');
const body_parser = require('body-parser');
const mailer = require('./src/routes/mailer');

const mailerCron = require('./src/cron/mailerCron');
const excel = require('./src/controllers/excel');

const app = express();

app.use(body_parser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/mailer', mailer);
mailerCron();
// excel.createExcelFile()
//     .then(() => {
//         console.log('File created');
//     })
//     .catch((err) => {
//         console.log(err);
//     });




module.exports = app;