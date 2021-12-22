const axios = require('axios');
const config = require('../../config.json');

exports.launchTreatments = () => {
    console.log(`${new Date()} DEBUT DU TRAITEMENT DES FICHIERS UPLOADES`);
    axios.put(`${config.nodeUrl}/api/document`, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        let executionTime = res.data.executionTime;
        console.log(`TRAITEMENT FAIT EN : ${executionTime}`);
    }).catch((err) => {
        console.log(`${new Date()} ERREUR LORS DU TRAITEMENT DES FICHIERS UPLOADES`);
        console.log(err);
    }).finally(() => {
        console.log(`${new Date()} FIN DU TRAITEMENT DES FICHIERS UPLOADES`);
    });
};