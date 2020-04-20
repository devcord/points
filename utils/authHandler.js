const JWT = require('jsonwebtoken');
require('dotenv').config();

// AUTH
module.exports = async (ctx, next) => {
  const auth = ctx.header.authorization.split(' ');
  const type = auth[0];
  const token = auth[1];
  if (type !== 'Bearer') {
    ctx.status = 403;
    ctx.body = { error: 'invalid authorization type' };
  } else {
    await JWT.verify(token, process.env.SECRET, { complete: true }, async (err, result) => {
      if (err) throw new Error(err);

      // TODO: Check issuer instead of payload next time, payload is always accessible
      if (result.payload.bot === process.env.BOTNAME) {
        await next();
      } else {
        throw new Error('Invalid bot name');
      }
    });
  }
};
