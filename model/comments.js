var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const commentSchema = new Schema({
    bookId: String,
    comment: String
})

module.exports = mongoose.model("Comment", commentSchema);                                                                                                                                                                                                                                                                                                                                                                                                                                                  