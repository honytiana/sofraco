const mongooseLoader = require('./mongooseLoader');
const expressLoader = require('./expressLoader');
const routeLoader = require('./routeLoader');

module.exports = async function ({ app }) {
    await mongooseLoader();
    await expressLoader({ app });
    await routeLoader({ app });
};
