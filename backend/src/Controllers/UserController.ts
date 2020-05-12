import { Responses, ModifiedContext } from './../types';
import User, { UserDocument, UserType } from "../Models/User";

type InputCreateBodyType = { id: string, points: number };
type InputUpdateBodyType = { points: number };

class UserController {
  public static create = async (ctx: ModifiedContext) => {
    const body: InputCreateBodyType = ctx.request.body;
    const createUser: UserDocument | null = await User.create(body).catch(
      (err) => null
    );

    if (createUser) {
      let response: UserType = createUser.toNormalization();
      return ctx.resp(201, response);
    } else {
      return ctx.resp(400, Responses.CANT_CREATE_USER);
    }
  };

  public static read = async (ctx: ModifiedContext) => {
    if (!ctx.state.user || ctx.params.id !== ctx.state.user.id)
      return ctx.resp(403, Responses.NO_ACCESS_USER);

    const user: UserDocument | null = await User.findById(
      ctx.state.user.id
    );

    if (user) {
      let response: UserType = user.toNormalization();
      return ctx.resp(200, response);
    } else {
      return ctx.resp(400, Responses.SOMETHING_WENT_WRONG);
    }
  };

  public static update = async (ctx: ModifiedContext) => {
    if (!ctx.state.user || ctx.params.id !== ctx.state.user.id)
      return ctx.resp(403, Responses.NO_ACCESS_USER);

    const body: InputUpdateBodyType = ctx.request.body;
    const updateUser: UserDocument | null = await User.findByIdAndUpdate(
      ctx.state.user.id,
      { $set: body },
      { new: true }
    )
      .exec()
      .catch((err) => null);

    if (updateUser) {
      let response: UserType = updateUser.toNormalization();
      return ctx.resp(200, response);
    } else {
      return ctx.resp(400, Responses.CANT_UPDATE_USER);
    }
  };
}

export default UserController;