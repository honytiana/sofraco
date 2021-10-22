const nodeCron = require('node-cron');

const mailerCron = require('../cron/mailerCron');
const launchTreatmentsCron = require('../cron/launchTreatmentsCron');

module.exports = () => {
    nodeCron.schedule('0 0 0 * * *', () => {
        console.log('SEND MAIL CRON');
        // mailerCron();
    });
    nodeCron.schedule('0 08 16 * * *', () => {
        console.log('LAUNCH TREATMENTS CRON');
        launchTreatmentsCron.launchTreatments();
    });
};