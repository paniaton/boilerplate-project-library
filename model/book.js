var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: String,
    comments: [String]
})

module.exports = mongoose.model("Book", bookSchema);                                                                                                                                                                                                                                                                                                                                                                                                                                                  