const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    caption : {
        type: String,
        required: true
    },

    path : {
        type : String
    }
}, { timestamps: true});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;