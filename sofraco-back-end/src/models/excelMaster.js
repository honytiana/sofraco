const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const excelMasterSchema = new Schema({
    courtier: { type: Schema.Types.ObjectId, ref: 'Courtier', default: undefined },
    code_courtier: { type: Schema.Types.Mixed, default: undefined },
    companies: { type: Array, default: [] },
    create_date: { type: Date, default: Date.now() },
    path: { type: String, default: '' },
    is_enabled: { type: Boolean, default: true },
});

const ExcelMaster = mongoose.model('ExcelMaster', excelMasterSchema);

module.exports = ExcelMaster;