const mongoose = require('mongoose');


let Schema = mongoose.Schema;

let ThankSchema = new Schema({
  thankee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  thanker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  message: {
    type: String
  },
  channel: {
    type: Number
  },
  Guild: {
    type: Number
  },
  updated: {
    type: Date,
    default: Date.now()
  },
});

let Thank = mongoose.model('Thank', ThankSchema);

module.exports = Thank;