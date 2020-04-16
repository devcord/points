let userUtil = require('../utils/user');

module.exports =  ({ router }) => {
  
  // getting the home route
  router.get('/user/', async (ctx, next) => {
    let result;
    try {
      result = await Promise.resolve(userUtil.getAllUsersNum());
    } catch (e) {
      console.error(e)
    }
    ctx.body = {totalUsers: result};
  });

  router.get('/user/all', async (ctx, next) => {
    let result;
    try {
      result = await Promise.resolve(userUtil.getAllUsers());
    } catch (e) {
      console.error(e)
    }
    ctx.body = { totalUsers: result };
  });
  
  router.post('/user/', async (ctx, next) => {
    let params = ctx.request.body;
    let result;
    try {
      result = await Promise.resolve(userUtil.setUser(params));
    } catch (e) {
      console.error(e)

    }
    ctx.body = result;
  })

  router.get('/user/:id', async (ctx, next) => {
    let result;
    try {
      result = await Promise.resolve(userUtil.getUser(ctx.params.id));
    } catch (e) {
      console.error(e)
    }
    if (result == undefined || result == null) {
      ctx.status = 404;
      ctx.body = {error: 'User not found'}
    }else{
      ctx.body = result;
    }
  })
};