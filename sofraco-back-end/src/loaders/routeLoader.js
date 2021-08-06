const mailer = require('../routes/mailer');
const company = require('../routes/company');
const courtier = require('../routes/courtier');
const document = require('../routes/document');
const excelMaster = require('../routes/excelMaster');
const user = require('../routes/user');

module.exports = async function ({ app }) {
    app.use('/api/mailer', mailer);
    app.use('/api/company', company);
    app.use('/api/courtier', courtier);
    app.use('/api/document', document);
    app.use('/api/excelMaster', excelMaster);
    app.use('/api/user', user);
}

