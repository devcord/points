// @ts-nocheck

import { Responses, ModifiedContext } from './../types';

import PointModel, { PointDocument, PointType } from './../model/point';
/**
 * @param id - A valid string that has already been validated by JOI
 * @param points - A valid number that has already been validated by JOI
*/
type InputCreateBodyType = { id: string; totalPoints: number; points: PointType[] };


/**
 * @param id - A valid string that has already been validated by JOI
 * @param points - A valid number that has already been validated by JOI
*/
type InputUpdateBodyType = { id: string; totalPoints: number; points: PointType[] };

class PointController {

  public static read = async (ctx: ModifiedContext): Promise<void> => {
    const points: PointDocument[] | null = await PointModel.find({ userID: ctx.params.id });

    if (points) {
      return ctx.respond(200, points);
    } else {
      return ctx.respond(404, Responses.NOT_FOUND);
    }
  };

  public static read_days = async (ctx: ModifiedContext): Promise<void> => {
    const date = new Date(Date.now() - ctx.params.days * 24 * 60 * 60 * 1000);

    const points: PointDocument[] | null = await PointModel.find({
      userID: ctx.params.id,
      createdAt: { $gte: date.toISOString() }
    });

    if (points) {
      return ctx.respond(200, points);
    } else {
      return ctx.respond(404, Responses.NOT_FOUND);
    }
  }


  public static top_days = async (ctx: ModifiedContext): Promise<void> => {
    const date = new Date(Date.now() - ctx.params.days * 24 * 60 * 60 * 1000);


    let results = await PointModel.aggregate([{
      '$match': {
        'date': {
          '$gte': date
        }
      }
    }, {
      '$group': {
        '_id': '$userID',
        'total': {
          '$sum': '$amount'
        }
      }
    }, {
      '$sort': {
        'total': -1
      }
    }, {
      '$limit': 10
    }]).exec();


    if (results.length === 0) return ctx.respond(404, Responses.NOT_FOUND);

    results = results.map(e => {
      return { userId: e._id, total: e.total };
    });

    return ctx.respond(200, results);

  }
}

export default PointController;
