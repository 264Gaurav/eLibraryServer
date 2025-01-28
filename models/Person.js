const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  user: {
    type: String,
    required:true,
    enum: ['reader', 'admin', 'author'],
    default: 'reader'
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'is invalid']
  },
  password: {
    type: String,
    required: true
  }
});


// Hashing password before saving to database   //bcrypt middleware 
userSchema.pre('save', async function (next) {
  const user = this;

  // No need to hash the password if it is not modified
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    const hashedPassword = await bcrypt.hash(user.password, salt); // Hash password

    // Override the plain password with the hashed password
    user.password = hashedPassword;
    next();
  } catch (err) {
    return next(err);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (userPassword) {
  try {
    return await bcrypt.compare(userPassword, this.password);
  } catch (err) {
    throw err;
  }
};

// Create and export User model
const User = mongoose.model('User', userSchema);
module.exports = User;
