const path = require('path');
const fs = require('fs');

const config = require('../../config.json');
const companyHandler = require('../handlers/companyHandler');

exports.createCompany = async (req, res) => {
    const data = req.body;
    const file = req.file;
    let company = {
        globalName: data.globalName,
        name: data.name,
        logo: file,
        address: data.address,
        zip: data.zip,
        city: data.city,
        country: data.country,
        creation_date: data.creation_date,
        phone: data.phone,
        website: data.website,
        surco: data.surco,
        companySurco: data.companySurco,
        is_enabled: data.is_enabled,
    };
    try {
        const c = await companyHandler.createCompany(company);
        res.status(200).json(c);
    } catch (error) {
        res.status(400).json({ error })
    }

};

exports.getCompany = async (req, res) => {
    console.log(`${new Date()} get company`);
    try {
        const c = await companyHandler.getCompany(req.params.id);
        res.status(200).json(c);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getCompanyByName = async (req, res) => {
    console.log(`${new Date()} get company by name`);
    try {
        const company = await companyHandler.getCompanyByName(req.params.name);
        res.status(200).json(company);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getCompaniesLike = async (req, res) => {
    console.log(`${new Date()} search company by name`);
    try {
        const companies = await companyHandler.getCompaniesLike(req.params.name);
        const newCompanies = [];
        for (let company of companies) {
            company.logo = fs.readFileSync(company.logo, { encoding: 'base64' });
            newCompanies.push(company);
        }
        res.status(200).json(newCompanies);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getCompanyByCompanySurco = async (req, res) => {
    console.log(`${new Date()} get company by company surco`);
    try {
        const company = await companyHandler.getCompanyByCompanySurco(req.params.companySurco);
        res.status(200).json(company);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getCompanies = async (req, res) => {
    console.log(`${new Date()} get companies`);
    try {
        const companies = await companyHandler.getCompanies();
        const newCompanies = [];
        for (let company of companies) {
            company.logo = fs.readFileSync(company.logo, { encoding: 'base64' });
            newCompanies.push(company);
        }
        res.status(200).json(newCompanies);
    } catch (error) {
        res.status(400).json({ error });
    }
}

exports.updateCompany = (req, res) => {
    console.log(`${new Date()} update`);
}

exports.deleteCompany = async (req, res) => {
    console.log(`${new Date()} Delete company`);
    try {
        await companyHandler.deleteCompany(req.params.id);
        res.status(200).end('Company deleted');
    } catch (error) {
        res.status(500).json({ error });
    }
}
