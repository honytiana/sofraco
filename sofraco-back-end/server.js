const express = require('express');
const load = require('./src/loaders/loader');
const config = require('./config.json');
const cluster = require('cluster');
const os = require('os');
const process = require('process');

const startServer = async () => {
    const numCPUs =os.cpus().length;

    if (cluster.isPrimary) {
        console.log(`Primary ${process.pid} is running`);

        // Fork workers.
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });
    } else {
        // Workers can share any TCP connection
        // In this case it is an HTTP server

        const app = express();
        await load({ app: app });

        const port = config.nodePort;
        if (require.main === module) {
            app.listen(port, () => {
                console.info(`Server is listen on port : ${port}`);
                console.log(`Worker ${process.pid} started`);
            });
        }
    }
}

startServer();

