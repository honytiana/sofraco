const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    globalName: { type: String, required: true },
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
    surco: { type: Boolean, default: false },
    companySurco: { type: String, default: '' },
    type: { type: String, enum: ['simple', 'surco'] }
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;