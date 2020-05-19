import {Joi as JOI, Spec } from 'koa-joi-router';

import HELPER from './helper';
import POINT_CONTROLLER from '../controller/points';

class PointRouter {

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
    path: "/points/user/:id/:days",
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

  public static top_days: Spec = {
    method: HELPER.methods.GET,
    path: "/points/top/:days",
    validate: {
      continueOnError: true,
      params: JOI.object({
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
              data: JOI.any(),
            }).options({ stripUnknown: true }),
          },
        }
      ),
    },
    handler: [HELPER.validation, POINT_CONTROLLER.top_days],
  };

}

export default PointRouter;
