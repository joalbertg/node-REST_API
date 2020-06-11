
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const CategoriesSchema = new Schema({
  description: {
    type: String,
    unique: true,
    required: [true, 'Required description']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

CategoriesSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Category', CategoriesSchema);

