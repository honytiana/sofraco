const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, default: '', required: true, unique: true },
    login: { type: String, default: '', required: true, unique: true },
    password: { type: String, default: '', required: true },
    role: { type: String, required: true, enum: ['security', 'admin', 'collaborator'], default: 'collaborator' },
    create_date: { type: Date, default: Date.now() },
    is_enabled: { type: Boolean, default: true },
});

userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);

module.exports = User;