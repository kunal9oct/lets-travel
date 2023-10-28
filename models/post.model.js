let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let postSchema = new Schema({
    id: String,
    title: String,
    date: Date,
    description: String,
    text: String,
    country: String,
    imageURL: String
});

let Post = mongoose.model('Post', postSchema);

module.exports = {    // module.exports = {Post}   -   as key name and function assigned to it is same
    Post: Post        // We can also write like this when key name & function assigned to it is same
}                     // key is the name by which we use function inside of it in the other modules

// module.exports.Post = Post