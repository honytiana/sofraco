const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const treatmentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', default: undefined },
    begin_treatment: { type: Date, default: Date.now() },
    end_treatment: { type: Date, default: null},
    status: { type: String, required: true, enum: ['draft', 'processing', 'done', 'cancel'], default: 'draft' },
    progress: { type: Number, default: undefined }
});

const Treatment = mongoose.model('Treatment', treatmentSchema);

module.exports = Treatment;

// draft: traitement pas encore lancé
// processing: en cours de traitement
// done : traitement fait
// cancel: traitement annulé