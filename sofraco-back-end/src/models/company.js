const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    name: { type: String, required: true },
    logo: { type: String, required: true },
    address: { type: String, default: '' },
    zip: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    creation_date: { type: Date, default: '' },
    phone: { type: String, default: '' },
    website: { type: String, default: '' },
    is_enabled: { type: Boolean, default: true },
    surco: {
        name: { type: String, default: '' },
        logo: { type: String, default: '' },
        address: { type: String, default: '' },
        zip: { type: String, default: '' },
        city: { type: String, default: '' },
        country: { type: String, default: '' },
        creation_date: { type: Date, default: '' },
        phone: { type: String, default: '' },
        website: { type: String, default: '' },
        is_enabled: { type: Boolean, default: true },
    }
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;