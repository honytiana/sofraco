const path = require('path');
const fs = require('fs');

const config = require('../../config.json');
const Company = require('../models/company');

exports.createCompany = (req, res) => {
    const data = req.body;
    const file = req.file;
    const company = new Company(data);
    company.logo = file.path;
    company.save()
        .then((data) => {
            console.log('Post company');
            res.status(200).json(data);
        })
        .catch((err) => {
            throw err;
        });

};

exports.getCompany = (req, res) => {
    console.log('get company');
    Company.findById(req.params.id, (err, doc) => {
        if (err) {
            throw err;
        } else {
            res.status(200).json(doc);
        }
    });
}

exports.getCompanyByName = (req, res) => {
    Company.findOne({ name: req.params.name }, (err, doc) => {
        if (err) {
            throw err;
        } else {
            res.status(200).json(doc);
        }
    });
}

exports.getCompanies = (req, res) => {
    console.log('get companies');
    Company.find((err, doc) => {
        if (err) {
            throw err;
        } else {
            let newDoc = [];
            for (let c of doc) {
                c.logo = fs.readFileSync(c.logo, {encoding: 'base64'});
                newDoc.push(c);
            }
            res.status(200).json(newDoc);
        }
    });
}

exports.updateCompany = (req, res) => {
    console.log('update')
}
