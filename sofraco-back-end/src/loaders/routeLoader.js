const cabinet = require('../routes/cabinet');
const client = require('../routes/client');
const company = require('../routes/company');
const correspondance = require('../routes/correspondance');
const courtier = require('../routes/courtier');
const document = require('../routes/document');
const excelMaster = require('../routes/excelMaster');
const mailer = require('../routes/mailer');
const token = require('../routes/token');
const treatment = require('../routes/treatment');
const swagger = require('../routes/swagger');
const user = require('../routes/user');

module.exports = async function ({ app }) {
    app.use('/api/cabinet', cabinet);
    app.use('/api/client', client);
    app.use('/api/correspondance', correspondance);
    app.use('/api/company', company);
    app.use('/api/courtier', courtier);
    app.use('/api/document', document);
    app.use('/api/excelMaster', excelMaster);
    app.use('/api/mailer', mailer);
    app.use('/api/token', token);
    app.use('/api/treatment', treatment);
    app.use('/api/api-docs', swagger);
    app.use('/api/user', user);
}

