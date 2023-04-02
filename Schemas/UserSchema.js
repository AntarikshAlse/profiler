const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailAuthenticated: {
    type: Boolean,
    require: true,
    default: false,
  },
});

module.exports = mongoose.model("User", UserSchema);
