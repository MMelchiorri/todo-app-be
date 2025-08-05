const mongoose = require("mongoose");

const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");

const UserSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
  },
  role: {
    type: String,
  },
  jobAssigned: {
    type: [String],
  },
});

module.exports = mongoose.model("UserObject", UserSchema);
