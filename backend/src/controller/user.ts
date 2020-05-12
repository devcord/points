import { Responses, ModifiedContext } from './../types';

import UserModel, {UserDocument, UserType} from './../model/user';

/**
 * @param id - A valid string that has already been validated by JOI
 * @param points - A valid number that has already been validated by JOI
*/
type InputCreateBodyType = {id: string, points: number};


/**
 * @param id - A valid string that has already been validated by JOI
 * @param points - A valid number that has already been validated by JOI
*/
type InputUpdateBodyType = {id: string, points: number};

class UserController {
  public static create = async (ctx: ModifiedContext) => {
    const body: InputCreateBodyType = ctx.request.body;
    console.log(body);
    const createUser:UserDocument|null  = await UserModel.create(body).catch( err => null);
    console.log(createUser);
    if (createUser) {
      let response:UserType = createUser.toNormalization();
      return ctx.respond(201, response);
    } else {
      return ctx.respond(400, Responses.CANT_CREATE_USER);
    }
  };

  public static read = async (ctx: ModifiedContext) => {
    if (!ctx.state.user || ctx.params.id !== ctx.state.user.id) return ctx.respond(403, Responses.NO_ACCESS_USER);

    const user:UserDocument|null = await UserModel.findById(ctx.state.user.id);

    if (user) {
      let response:UserType = user.toNormalization();
      return ctx.respond(200, response);
    } else {
      return ctx.respond(400, Responses.SOMETHING_WENT_WRONG);
    }
  };

  public static update = async (ctx: ModifiedContext) => {
    if (!ctx.state.user || ctx.params.id !== ctx.state.user.id) return ctx.respond(403, Responses.NO_ACCESS_USER);

    const body:InputUpdateBodyType      = ctx.request.body;
    const updateUser:UserDocument|null  = await UserModel.findByIdAndUpdate(ctx.state.user.id, {$set: body}, {new: true}).exec().catch( err => null);

    if (updateUser) {
      let response:UserType = updateUser.toNormalization();
      return ctx.respond(200, response);
    } else {
      return ctx.respond(400, Responses.CANT_UPDATE_USER);
    }
  };

};

export default UserController;
