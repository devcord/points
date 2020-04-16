let userUtil = require('../utils/user');

module.exports = ({ router }) => {
  
  // getting the home route
  router.get('/', (ctx, next) => {
    ctx.body = { version: '1.0.0', totalPoints: 0, totalUsers: userUtil.getAllUsers()}
  });
};