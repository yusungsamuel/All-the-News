var  mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title : {
        type: String,
        require: true,
        unique: true
    },
    link : {
        type: String,
        required: true
    },
    description: {
        type: String

    },
    image:{
        type: String
    },
    saved:{
        type: Boolean,
        default: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;

