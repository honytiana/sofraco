const mongoose = require('mongoose');

require('dotenv').config();

module.exports = async () => {
    const facteurMilli = 100000;
    mongoose.connect(process.env.DATABASE, {
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
