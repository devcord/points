const thankUtil = require('../utils/thank');
const userUtil = require('../utils/user');

module.exports = ({ router }) => {
  // getting the home route
  router.get('/thank/', async (ctx) => {
    let result;
    try {
      result = await Promise.resolve(thankUtil.getAllThanksNum());
    } catch (e) {
      console.error(e);
    }
    ctx.body = { totalThanks: result };
  });

  router.get('/thank/all', async (ctx) => {
    let result;
    try {
      result = await Promise.resolve(thankUtil.getAllThanks());
    } catch (e) {
      console.error(e);
    }
    ctx.body = { totalThanks: result };
  });

  router.post('/thank/', async (ctx) => {
    const params = ctx.request.body;
    let result;
    params.thankee = await Promise.resolve(userUtil.getUser(params.thankee));
    params.thanker = await Promise.resolve(userUtil.getUser(params.thanker));

    try {
      result = await Promise.resolve(thankUtil.setThank(params));
    } catch (e) {
      console.error(e);
      ctx.status = 500;
      ctx.body = 'error';
    }
    ctx.status = 201;
    ctx.body = result;
  });

  router.get('/thank/:id', async (ctx) => {
    let result;
    try {
      result = await Promise.resolve(thankUtil.getThank(ctx.params.id));
    } catch (e) {
      console.error(e);
    }
    if (result == undefined || result == null) {
      ctx.status = 404;
      ctx.body = { error: 'thank not found' };
    } else {
      ctx.body = result;
    }
  });
};
