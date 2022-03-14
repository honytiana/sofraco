const express = require('express');
const cluster = require('cluster');
const os = require('os');
const process = require('process');
const load = require('./src/loaders/loader');
const config = require('./config.json');
const workerThreadLoader = require('./src/loaders/workerThreadLoader');
const treatmentHandler = require('./src/handlers/treatmentHandler.js');
const documentController = require('./src/controllers/document');
// const { GPU } = require('gpu.js');

const startServer = async () => {
    const numCPUs = os.cpus().length;
    // await workerThreadLoader();

    if (cluster.isPrimary || cluster.isMaster) {
        require('events').EventEmitter.prototype._maxListeners = 100;
        console.log(`Primary ${process.pid} is running`);

        // Fork workers.
        // for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
        // }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`${new Date()} code : ${code} - worker ${worker.process.pid} died - ${signal}`);
        });
    } else {
        // Workers can share any TCP connection
        // In this case it is an HTTP server

        const app = express();
        await load({ app: app });

        const port = config.nodePort;
        if (require.main === module) {
            app.listen(port, async () => {
                require('events').EventEmitter.prototype._maxListeners = 100;
                console.info(`Server is listen on port : ${port}`);
                console.log(`Worker ${process.pid} started`);
                const processingTreatment = await treatmentHandler.getProcessingTreatment();
                if (processingTreatment.length > 0) {
                    await treatmentHandler.updateStatusTreatment('done');
                }
                try {
                    const result = await documentController.updateDocuments();
                    console.log(`${new Date()} TRAITEMENT FAIT EN : ${result.executionTime}`);
                } catch (err) {
                    console.log(`${new Date()} ERREUR LORS DU TRAITEMENT DES FICHIERS UPLOADES`);
                } finally {
                    console.log(`${new Date()} FIN DU TRAITEMENT DES FICHIERS UPLOADES`);
                }
            });
        }
    }
}

startServer();

