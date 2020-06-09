const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const UsersSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Required user name']
  },
  email: {
    type: String,
    required: [true, 'Required user email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Required user password']
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'USER_ROLE'
  },
  status: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});

UsersSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UsersSchema);

