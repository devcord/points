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

    const points: PointDocument[] | null = await PointModel.find({
      createdAt: {$gte: date.toISOString()},
    });
    console.log(points.length)
    if(points){

      const p: Record<string, number> = {};

      const cache: string[] = [];
      
      for(let i = 0; i < points.length; ++i){
        const point: PointDocument = points[i];
        const userID: string = point.userID;
        if(!cache.includes(point.userID)){
          p[userID] = point.amount;
          cache.push(userID);
        } else {
          p[userID] += point.amount;
        }
      }

      return ctx.respond(200, p);
    } else {
      return ctx.respond(404, Responses.NOT_FOUND);
    }
  }


}

export default PointController;
