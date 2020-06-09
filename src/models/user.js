const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const validRoles = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} invalid role.'
};

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
    default: 'USER_ROLE',
    enum: validRoles
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

// to delete password from response
// this delete userDB.password not found
UsersSchema.methods.toJSON = function() {
  const model = this;
  const userObject = model.toObject();

  delete userObject.password;
  return userObject;
}

UsersSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UsersSchema);

