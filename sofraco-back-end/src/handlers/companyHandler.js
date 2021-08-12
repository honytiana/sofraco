const Company = require('../models/company');
const fs = require('fs');

class CompanyHandler {

    constructor() { }

    createCompany(data) {
        let company = new Company();
        company.globalName = data.globalName;
        company.name = data.name;
        company.logo = data.logo;
        company.address = data.address;
        company.zip = data.zip;
        company.city = data.city;
        company.country = data.country;
        company.creation_date = data.creation_date;
        company.phone = data.phone;
        company.website = data.website;
        company.surco = data.surco;
        company.companySurco = data.companySurco;
        company.is_enabled = data.is_enabled;
        company.save();
        return company;
    }

    getCompany(id) {
        return Company.findById(id);
    }

    getCompanyByName(name) {
        return Company.findOne({ name: name });
    }

    getCompanies() {
        return Company.find();
    }

    updateCompany(id, data) {
        return Company.findByIdAndUpdate(id, data);
    }

    deleteCompany() {

    }

}

module.exports = new CompanyHandler();