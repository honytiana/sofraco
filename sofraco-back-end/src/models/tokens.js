const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    value: { type: String, unique: true, required: true },
    userId: { type: String, required: true },
    navigator: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
    expiresIn: { type: Date, default: function () { return + new Date() + 1000 * 60 * 60 * 4; } } // 1000ms by sec, 60 sec by min, 60 min by hour, 4h by day.
});

const TokenSchema = mongoose.model('Token', tokenSchema);

module.exports = TokenSchema;
// TokenSchema.methods.cancel = (value) => {
//     return this.model('TokenSchema').deleteOne({ value: value });
// };
