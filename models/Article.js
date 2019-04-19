var  mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title : {
        type: String,
        require: true
    },
    link : {
        type: String,
        required: true
    },
    description: {
        type: String,

    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;

