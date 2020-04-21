const User = require('../models/User.js');

module.exports = {
  getAllUsersNum() {
    return new Promise((resolve, reject) => {
      User.countDocuments({}, (err, users) => {
        if (err) reject(err);
        resolve(users);
      });
    });
  },
  getAllUsers() {
    return new Promise((resolve, reject) => {
      User.find({}, (err, users) => {
        if (err) reject(err);
        resolve(users);
      });
    });
  },
  getUser(id) {
    return new Promise((resolve, reject) => {
      User.findOne({ id }, (err, user) => {
        if (err) reject(err);
        resolve(user);
      });
    });
  },
  getUsers(ids) {
    return new Promise((resolve, reject) => {
      User.find({
        id: { $in: ids },
      }, (err, users) => {
        if (err) reject(err);
        resolve(users);
      });
    });
  },
  setUser(params) {
    return new Promise((resolve, reject) => {
      // Rank is a string such as MVP, Senior, Staff etc.
      // TODO: Add this as a setting to allow change


      // let m = multiplier[params.rank];
      const m = 1;
      User.findOneAndUpdate(
        { id: params.id },
        { id: params.id, multiplier: m },
        { upsert: true },
        (err, u) => {
          if (err) reject(err);
          resolve(u);
        },
      );
    });
  },
  updatePoints(objId, points) {
    return new Promise((resolve, reject) => {
      User.findById(objId, (err, user) => {
        if (err) reject(err);
        let p = user.points;
        const m = user.multiplier;

        p += (m * points);

        User.update({ _id: objId }, { points: p }, (uErr, uUser) => {
          if (uErr) reject(uErr);
          resolve(uUser);
        });
      });
    });
  },
};
