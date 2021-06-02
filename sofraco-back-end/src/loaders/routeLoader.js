const mailer = require('../routes/mailer');
const company = require('../routes/company');
const courtier = require('../routes/courtier');

module.exports = async function ({ app }) {
    app.use('/api/mailer', mailer);
    app.use('/api/company', company);
    app.use('/api/courtier', courtier);
}

