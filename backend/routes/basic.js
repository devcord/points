const userUtil = require('../utils/user');
const thankUtil = require('../utils/thank');

module.exports = ({ router }) => {
  // getting the home route
  router.get('/', async (ctx) => {
    let result1;
    let result2;
    try {
      result1 = await Promise.resolve(thankUtil.getAllThanksNum());
      result2 = await Promise.resolve(userUtil.getAllUsersNum());
    } catch (e) {
      console.error(e);
    }
    ctx.body = { version: '1.0.0', totalPoints: result1, totalUsers: result2 };
  });
};
