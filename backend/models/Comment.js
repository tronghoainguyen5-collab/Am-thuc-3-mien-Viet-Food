const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);