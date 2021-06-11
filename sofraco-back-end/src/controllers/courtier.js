const path = require('path');

const config = require('../../config.json');
const Courtier = require('../models/courtier');


exports.createCourtier = (req, res) => {
    const data = req.body;
    const courtier = new Courtier(data);
    courtier.save()
    .then((data) => {
        console.log('Post courtier');
        res.status(200).json(data);
    })
    .catch((err) => {
        res.status(500);
        res.end(err);
    });

};

exports.getCourtier = (req, res) => {
    console.log('get courtier');
    Courtier.findById(req.params.id, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(doc);
        }
    });
}

exports.getCourtiers = (req, res) => {
    console.log('get courtier');
    Courtier.find((err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(doc);
        }
    });
}
