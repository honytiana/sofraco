const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const correspondanceSchema = new Schema({
    courtier: { type: Schema.Types.ObjectId, ref: 'Courtier', default: null },
    companies: { type: Schema.Types.Mixed, default: null },
    is_enabled: { type: Boolean, default: true },
});

const Correspondance = mongoose.model('Correspondance', correspondanceSchema);

module.exports = Correspondance;