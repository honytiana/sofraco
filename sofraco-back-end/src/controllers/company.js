const path = require('path');

const config = require('../../config.json');
const Company = require('../models/company');

exports.createCompany = (req, res) => {
    const data = req.body;
    const company = new Company(data);
    company.save()
    .then((data) => {
        console.log('Post company');
        res.status(200).json(data);
    })
    .catch((err) => {
        res.status(500);
        res.end(err);
    });

};

exports.getCompany = (req, res) => {
    console.log('get company');
    Company.findById(req.params.id, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(doc);
        }
    });
}

exports.getCompanies = (req, res) => {
    console.log('get company');
    Company.find((err, doc) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(doc);
        }
    });
}
