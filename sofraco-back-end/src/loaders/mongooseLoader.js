const mongoose = require('mongoose');

const config = require('../../config.json');

module.exports = async function () {
    mongoose.connect(config.database, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log('Successfully connected to database')
    })
    .catch((err) => {
        console.log(`Error connecting to database : ${err}`);
    });

};
