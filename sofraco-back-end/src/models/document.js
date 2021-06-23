const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    name: { type: String, default: '' },
    user: { type: String, default: undefined },
    company: { type: Schema.Types.ObjectId, ref: 'Company', default: undefined },
    companyName: { type: String, default: '' },
    upload_date: { type: Date, default: Date.now() },
    path: { type: String, default: undefined },
    type: { type: String, default: undefined },
    is_enabled: { type: Boolean, default: true },
    ocr: { type: Schema.Types.Mixed, default: undefined },
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;