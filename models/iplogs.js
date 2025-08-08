const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const IpLogSchema = new Schema({
    ip: {
        type: String,
        required: true
    },
    location: {
        type: Object,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    screen: {
        type: Object,
        required: true
    },
    battery: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});
const IpLog = mongoose.model('IpLog', IpLogSchema);
module.exports = IpLog;