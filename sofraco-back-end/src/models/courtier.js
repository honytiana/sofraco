const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courtierSchema = new Schema({
    lastName: { type: String, default: '' },
    firstName: { type: String, default: '', required: true, default: '' },
    cabinet: { type: String, default: '', required: true , default: '' },
    email: { type: String, default: '', default: undefined },
    phone: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Inactive'] },
    role: { type: String, enum: ['courtier', 'mandataire'], default: 'courtier'},
    is_enabled: { type: Boolean, default: true },
});

const Courtier = mongoose.model('Courtier', courtierSchema);

module.exports = Courtier;