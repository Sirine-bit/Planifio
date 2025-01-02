const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  organization: { type: String, required: true },
  password: { type: String, required: true },
  profileImage: { type: String, required: false, default: ''},
  role: { type: String, required: false, default: 'user' }
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, username: this.username, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
