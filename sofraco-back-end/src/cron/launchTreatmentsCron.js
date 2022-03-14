const documentController = require('../controllers/document');

exports.launchTreatments = async () => {
    console.log(`${new Date()} DEBUT DU TRAITEMENT DES FICHIERS UPLOADES CRON`);
    try {
        const result = await documentController.updateDocuments();
        console.log(`${new Date()} TRAITEMENT FAIT EN : ${result.executionTime}`);
    } catch (err) {
        console.log(`${new Date()} ERREUR LORS DU TRAITEMENT DES FICHIERS UPLOADES`);
    } finally {
        console.log(`${new Date()} FIN DU TRAITEMENT DES FICHIERS UPLOADES`);
    }
};