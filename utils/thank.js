let Thank = require('../models/Thank.js');
let userUtil = require('./user');

module.exports = {
  getAllThanksNum: function () {
    return new Promise((resolve, reject) => {
      Thank.count({}, (err, thanks) => {
        if (err) reject(err);
        resolve(thanks);
      })
    })
  },
  getAllThanks: function () {
    return new Promise((resolve, reject) => {
      Thank.find({}, (err, thanks) => {
        if (err) reject(err);
        resolve(thanks);
      })
    })
  },
  getThank: function (id) {
    return new Promise((resolve, reject) => {
      Thank.findOne({ _id: id }, (err, thank) => {
        if (err) reject(err);
        resolve(thank);
      })
    })
  },
  setThank: function (params) {
    return new Promise((resolve, reject) => {
      /*
       * Thankee
       * thanker
       * Message
       * Channel
       * Guild
       */
      Thank.create({ thankee: params.thankee._id, thanker: params.thanker._id, message: params.message, channel: params.channel, guild: params.guild }, (err, thank) => {
        userUtil.updatePoints(params.thankee._id, 1).then((thankee, _err) => {
          if (err) reject(err);
          if (_err) reject(_err);
          resolve(thank);
        })
      });
    })

  },
}