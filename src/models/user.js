const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UsersSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Required user name']
  },
  email: {
    type: String,
    required: [true, 'Required user email']
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

module.exports = mongoose.model('User', UsersSchema);

