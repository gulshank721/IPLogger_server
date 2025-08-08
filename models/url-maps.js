const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UrlMapSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    destination: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // expires: '1h' // Automatically delete after 1 hour
    }
});
const UrlMap = mongoose.model('UrlMap', UrlMapSchema);
module.exports = UrlMap;