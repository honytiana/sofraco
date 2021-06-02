const nodeCron = require('node-cron');
const axios = require('axios');
const config = require('../../config.json');

module.exports = () => {
    nodeCron.schedule('0 51 22 31 05 *', () => {
        const user = {
            email: 'dirishony@gmail.com',
            firstName: 'Hony Tiana',
            lastName: 'RAZAFIMAHEFA'
        };
        const options = {
            user
        }
        axios.post(`${config.nodeUrl}/api/mailer`, options)
            .then(() => {
                console.log('Mail sent');
            }).catch((err) => {
                console.log(err);
            });
    });
};