const nodeCron = require('node-cron');

const mailerCron = require('../cron/mailerCron');
const launchTreatments = require('../cron/launchTreatmentsCron');

module.exports = () => {
    nodeCron.schedule('0 0 0 * * *', () => {
        console.log('SEND MAIL CRON');
        // mailerCron();
    });
    nodeCron.schedule('0 0 19 * * *', () => {
        console.log('LAUNCH TREATMENTS CRON');
        // launchTreatments();
    });
};