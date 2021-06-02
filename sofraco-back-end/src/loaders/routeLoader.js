const mailer = require('../routes/mailer');
const company = require('../routes/company');

module.exports = async function ({ app }) {
    app.use('/api/mailer', mailer);
    app.use('/api/company', company);
}

