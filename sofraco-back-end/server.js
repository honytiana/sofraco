const express = require('express');
const load = require('./src/loaders/loader');
const config = require('./config.json');

const startServer = async () => {
    const app = express();
    await load({ app: app });

    const port = config.nodePort;
    if (require.main === module) {
        app.listen(port, () => {
            console.info(`Server is listen on port : ${port}`);
        });
    }
}

startServer();
