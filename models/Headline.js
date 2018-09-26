var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var headlinesSchema = new Schema({
    headline: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        required: true
    },
    date: Boolean,
    saved: {
        type: Boolean,
        default: false
    }

});

var Headline = mongoose.model("Headline", headlinesSchema);

module.exports = Headline;