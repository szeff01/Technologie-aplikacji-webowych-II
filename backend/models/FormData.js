const mongoose = require('mongoose');

const FormDataSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, match: /^\d{9,15}$/ }, // Walidacja numeru telefonu
    password: { type: String, required: true },
    role: { type: String, default: 'user' }, // Rola: user lub admin
}, {
    timestamps: true, // Dodaje createdAt i updatedAt
});

const FormDataModel = mongoose.model('log_reg_form', FormDataSchema);

module.exports = FormDataModel;
