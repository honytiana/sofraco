const axios = require('axios');
require('dotenv').config();

exports.sendMail = () => {
    const courtiers = axios.get(`${process.env.NODE_SRC}/api/courtier`);
    for (let courtier of courtiers) {
        const options = {
            user: {
                email: courtier.email,
                firstName: courtier.firstName,
                lastName: courtier.lastName
            }
        };
        axios.post(`${process.env.NODE_SRC}/api/mailer`, options)
            .then(() => {
                console.log('Mail sent');
            }).catch((err) => {
                console.log(err);
            });
    }
};