import { ConfigServerType } from './types/';

import SERVER from './server';
const { env: ENV } = process;

process.on('unhandledRejection', (err) => console.error(err));
process.on('uncaughtException', (err) => console.error(err.stack || err));

class Services {
  public static server = () => {
    let CONFIG: ConfigServerType = {
      port: ENV.PORT ? +ENV.PORT : 3000,
      mongo_uri: ENV.MONGO_URI
        ? ENV.MONGO_URI
        : 'mongodb+srv://dbadmin:lostisabigbootyhoe@devcord-points-testing-2zzzp.mongodb.net/points?retryWrites=true&w=majority',
      jwt_secret: ENV.JWT_SECRET ? ENV.JWT_SECRET : 'lostisabigbootyhoe',
    };
  }
}