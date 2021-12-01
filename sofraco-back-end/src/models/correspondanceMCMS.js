const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const correspondanceMCMSSchema = new Schema({
    courtier: { type: Schema.Types.ObjectId, ref: 'Courtier', default: null },
    role_courtier: { type: String, enum: ['courtier', 'mandataire'], default: 'courtier'},
    companies: { type: Schema.Types.Mixed, default: null },
    is_enabled: { type: Boolean, default: true },
});

const CorrespondanceMCMS = mongoose.model('CorrespondanceMCMS', correspondanceMCMSSchema);

module.exports = CorrespondanceMCMS;