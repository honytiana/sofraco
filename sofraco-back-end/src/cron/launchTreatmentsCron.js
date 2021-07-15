const axios = require('axios');
const config = require('../../config.json');

exports.launchTreatments = () => {
    axios.put(`${config.nodeUrl}/api/document`, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then((res) => {
        console.log(`Traitement terminé pour ${res.data.company}`);
    }).catch((err) => {
        console.log(err);
    }).finally(() => {
    });
};