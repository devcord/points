const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  id: {
    type: Number,
    index: {
      uniqe: true,
      dropDups: true,
    },
  },
  points: {
    type: Number,
    default: 0,
  },
  multiplier: Number,
  updated: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
