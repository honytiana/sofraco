const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, default: true },
    zip: { type: String, default: true },
    city: { type: String, default: true },
    country: { type: String, default: true },
    creation_date: { type: Date, default: true },
    phone: { type: String, default: true },
    website: { type: String, default: true },
    is_enabled: { type: Boolean, default: true },
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;