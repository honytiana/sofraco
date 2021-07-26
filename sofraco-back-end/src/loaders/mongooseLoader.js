const mongoose = require('mongoose');

const config = require('../../config.json');

module.exports = async () => {
    const facteurMilli = 1000;
    mongoose.connect(config.database, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        socketTimeoutMS: 60 * facteurMilli,
        connectTimeoutMS: 60 * facteurMilli
    })
    .then(() => {
        console.log('Successfully connected to database')
    })
    .catch((err) => {
        console.log(`Error connecting to database : ${err}`);
    });

};
