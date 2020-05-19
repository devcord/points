import { Responses, ModifiedContext } from './../types';

import UserModel, { UserDocument, UserType } from './../model/user';
import PointModel, { PointType } from './../model/point';
/**
 * @param id - A valid string that has already been validated by JOI
 * @param points - A valid number that has already been validated by JOI
*/
type InputCreateBodyType = { id: string; totalPoints: number; points: PointType[]};


/**
 * @param id - A valid string that has already been validated by JOI
 * @param points - A valid number that has already been validated by JOI
*/
type InputUpdateBodyType = { id: string; totalPoints: number; points: PointType[] };

class UserController {
  public static create = async (ctx: ModifiedContext): Promise<void> => {
    const body: InputCreateBodyType = ctx.request.body;

    await UserModel.create(body).catch(
      () => ctx.throw(500, Responses.CANT_CREATE_USER)
    ).then((createdUser) => {
      const response: UserType = createdUser.toNormalization();
      ctx.respond(201, response);
    })
  };

  public static read = async (ctx: ModifiedContext): Promise<void> => {
    if (!ctx.state.user || ctx.params.id !== ctx.state.user.id)
      return ctx.respond(403, Responses.NO_ACCESS_USER);

    const user: UserDocument | null = await UserModel.findOne(
      {
        id: ctx.params.id
      }
    );
    if (user) {
      const response: UserType = user.toNormalization();
      return ctx.respond(200, response);
    } else {
      return ctx.respond(404, Responses.NOT_FOUND);
    }
  };

  public static read_all = async (ctx: ModifiedContext): Promise<void> => {
    const users: Array<UserDocument> | null = await UserModel.find({});

    if (users) {
      const response: Array<UserDocument> = users;
      return ctx.respond(200, response);
    } else {
      return ctx.respond(400, Responses.SOMETHING_WENT_WRONG);
    }
  };

  public static update = async (ctx: ModifiedContext): Promise<void> => {
    if (!ctx.state.user || ctx.params.id !== ctx.state.user.id)
      return ctx.respond(403, Responses.NO_ACCESS_USER);

    const body: InputUpdateBodyType = ctx.request.body;
    const updateUser: UserDocument | null = await UserModel.findByIdAndUpdate(
      ctx.state.user.id,
      { totalPoints: body.totalPoints},
      { new: true }
    )
      .exec()
      .catch(() => null);

    if (updateUser) {
      const response: UserType = updateUser.toNormalization();
      return ctx.respond(200, response);
    } else {
      return ctx.respond(400, Responses.CANT_UPDATE_USER);
    }
  };

  public static exists = async (ctx: ModifiedContext): Promise<void> => {
    const user: UserDocument | null = await UserModel.findOne({
      id: ctx.params.id,
    });

    if (user) {
      const response = true;
      return ctx.respond(200, response);
    } else {
      return ctx.respond(400, Responses.USER_NOT_FOUND);
    }
  };

  public static points = async (ctx: ModifiedContext): Promise<void> => {
    if (!ctx.state.user || ctx.params.id != ctx.state.user.id)
      return ctx.respond(403, Responses.NO_ACCESS_USER);

    const body: InputUpdateBodyType = ctx.request.body;

    

    const user: UserDocument | null = await UserModel.findOneAndUpdate({
      id: body.id,
    }, {
      $inc:{
        totalPoints: body.totalPoints
      }
    });

    if (user) {
      PointModel.create({
        amount: body.totalPoints,
        userID: user.id,
      }).catch(() => ctx.throw(400, Responses.CANT_CREATE_POINT)).then(res => {
        user.points.push(res._id.toString());
        user.save();
      });

      const response: Record<string, any> = { user };
      return ctx.respond(200, response);
    } else {
      return ctx.respond(400, Responses.POINTS_UNDEFINED);
    }
  };
}

export default UserController;
