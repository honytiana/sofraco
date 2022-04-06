const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cabinetSchema = new Schema({
    cabinet: { type: String, default: '', required: true},
    description: { type: String, default: '' },
    names: { type: Schema.Types.Mixed, default: null },
    is_enabled: { type: Boolean, default: true },
});

const Cabinet = mongoose.model('Cabinet', cabinetSchema);

module.exports = Cabinet;