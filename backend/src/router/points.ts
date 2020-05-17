import {Joi as JOI, Spec } from 'koa-joi-router';
import {SchemaMap} from 'joi';

import HELPER from './helper';
import POINT_CONTROLLER from '../controller/points';

class PointRouter {

  // TODO: Define this after get
  private static userOutput: SchemaMap = {
    id: JOI.string(),
    totalPoints: JOI.number(),
    points: JOI.array(),
  };

  public static read: Spec = {
    method: HELPER.methods.GET,
    path: "/points/:id",
    validate: {
      continueOnError: true,
      params: JOI.object({
        id: JOI.string(),
      }),
      output: Object.assign(
        {},
        HELPER.errorResponse(403),
        HELPER.errorResponse(400),
        HELPER.validationErrorResponse(),
        {
          200: {
            body: JOI.object({
              code: 200,
              data: JOI.array(),
            }).options({ stripUnknown: true }),
          },
        }
      ),
    },
    handler: [HELPER.validation, POINT_CONTROLLER.read],
  };

  public static read_days: Spec = {
    method: HELPER.methods.GET,
    path: "/points/:id/:days",
    validate: {
      continueOnError: true,
      params: JOI.object({
        id: JOI.string(),
        days: JOI.number().integer(),
      }),
      output: Object.assign(
        {},
        HELPER.errorResponse(403),
        HELPER.errorResponse(400),
        HELPER.validationErrorResponse(),
        {
          200: {
            body: JOI.object({
              code: 200,
              data: JOI.array(),
            }).options({ stripUnknown: true }),
          },
        }
      ),
    },
    handler: [HELPER.validation, POINT_CONTROLLER.read_days],
  };

}

export default PointRouter;
