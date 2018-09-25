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

var Headlines = mongoose.model("Headline", headlinesSchema);

module.exports = Headlines;