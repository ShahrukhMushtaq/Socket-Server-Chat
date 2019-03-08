var mongoose = require('mongoose')

var schema = new mongoose.Schema({
    user: {
        type: String
    },
    message: {
        type: String
    }
}, {
        timestamps: true
    })
module.exports = mongoose.model('Message', schema)