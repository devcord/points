const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let UserSchema = new Schema({
  id: {
    type: Number,
    index: {
      uniqe: true,
      dropDups: true
    }
  },
  points: {
    type: Number,
    default: 0
  },
  multiplier: Number,
  updated: {
    type: Date,
    default: Date.now()
  },
});

let User = mongoose.model('User', UserSchema);

module.exports = User;