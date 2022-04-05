const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    numeroContrat: { type: String, required: true},
    lastName: { type: String, default: '' },
    firstName: { type: String, default: ''},
    cabinet: { type: Schema.Types.ObjectId, ref: 'Cabinet', required: true },
    versementCommissions: { type: String, default: ''},
    is_enabled: { type: Boolean, default: true },
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;