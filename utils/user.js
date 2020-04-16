let User = require('../models/User.js');

module.exports = {
  getAllUsers: function () {
    return new Promise((resolve, reject) => {
      User.count({}, (err, users) => {
        if (err) reject(err);
        resolve(users);
      })
    })
  },
  getUser: function (id) {
    return new Promise((resolve, reject) => {
      User.findOne({id: id }, (err, user) => {
        if (err) reject(err);
        resolve(user);
      })
    })
  },
  setUser: function (params) {
    return new Promise((resolve, reject) => {
      // Rank is a string such as MVP, Senior, Staff etc.
      // TODO: Add this as a setting to allow change
      multiplier = {
        'Staff': 1.1,
        'MVP': 1.05,
        'Senior': 1.02,
        'verified': 1.0,
      }
      let m = multiplier[params.rank];
      User.findOneAndUpdate({ id: params.id }, { id: params.id, multiplier: m }, { upsert: true }, (err, u) => {
        if (err) reject(err); 
        resolve(u);
      });
    })

  },
}