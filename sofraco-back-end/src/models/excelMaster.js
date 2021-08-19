const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const excelMasterSchema = new Schema({
    courtier: { type: Schema.Types.ObjectId, ref: 'Courtier', default: null },
    cabinet: { type: String, default: '' },
    create_date: { type: Date, default: Date.now() },
    path: { type: String, default: '' },
    type: { type: String, required: true, enum: ['excel', 'zip', 'zip of zip'], default: null },
    is_enabled: { type: Boolean, default: true },
});

const ExcelMaster = mongoose.model('ExcelMaster', excelMasterSchema);

module.exports = ExcelMaster;