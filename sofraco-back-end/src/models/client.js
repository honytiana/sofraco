const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    lastName: { type: String, default: '' },
    firstName: { type: String, default: '', required: true},
    courtier: { type: Schema.Types.ObjectId, ref: 'Courtier', default: null },
    email: { type: String, default: ''},
    phone: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    is_enabled: { type: Boolean, default: true },
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;