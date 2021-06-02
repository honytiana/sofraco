const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courtierSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, default: true },
    email: { type: String, default: true },
    phone: { type: String, default: true },
    code: { type: String, default: true },
    is_enabled: { type: Boolean, default: true },
});

const Courtier = mongoose.model('Courtier', courtierSchema);

module.exports = Courtier;