const axios = require('axios');
const config = require('../../config.json');
const tokenHandler = require('../handlers/tokenHandler');
const userHandler = require('../handlers/userHandler');

exports.launchTreatments = async () => {
    console.log(`${new Date()} DEBUT DU TRAITEMENT DES FICHIERS UPLOADES`);
    const user = await userHandler.getOneUser('Sofraco');
    const token = await tokenHandler.createTokens(user._id);
    axios.put(`${config.nodeUrl}/api/document`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.value}`
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