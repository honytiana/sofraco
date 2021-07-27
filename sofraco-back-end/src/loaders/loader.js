const mongooseLoader = require('./mongooseLoader');
const expressLoader = require('./expressLoader');
const routeLoader = require('./routeLoader');
const cronLoader = require('./cronLoader');
const socketIOLoader = require('./socketIOLoader');

module.exports = async function ({ app }) {
    await mongooseLoader();
    await expressLoader({ app });
    socketIOLoader({ app });
    await routeLoader({ app });
    cronLoader();
};
