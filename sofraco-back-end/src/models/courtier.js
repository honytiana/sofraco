const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courtierSchema = new Schema({
    code: { type: String, default: '' },
    firstName: { type: String, default: '', required: true },
    lastName: { type: String, default: '' },
    email: { type: String, default: '', required: true  },
    cabinet: { type: String, default: '', required: true  },
    phone: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Inactive', 'Pending', 'Banned'] },
    is_enabled: { type: Boolean, default: true },
});

const Courtier = mongoose.model('Courtier', courtierSchema);

module.exports = Courtier;