const mongoose = require('mongoose')

const MagicTokenSchema = new mongoose.Schema({
    email: { type: String, required: true },
    token: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }
})

module.exports = mongoose.model('MagicToken', MagicTokenSchema)