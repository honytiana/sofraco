const axios = require('axios');
const config = require('../../config.json');

exports.sendMail = () => {
    const courtiers = axios.get(`${config.nodeUrl}/api/courtier`);
    for(let courtier of courtiers) {
        const options = {
            user: {
                email: courtier.email,
                firstName : courtier.firstName,
                lastName: courtier.lastName
            }
        };
        axios.post(`${config.nodeUrl}/api/mailer`, options)
            .then(() => {
                console.log('Mail sent');
            }).catch((err) => {
                console.log(err);
            });
    }
};