import {Joi as JOI, Spec } from 'koa-joi-router';
import {SchemaMap} from 'joi';

import HELPER from './helper';
import USER_CONTROLLER from '../controller/user';

class UserRouter {
  private static userOutput: SchemaMap = {
    id: JOI.string(),
    points: JOI.number(),
  };

  // public static get: Spec = {
  //   method: HELPER.methods.GET,
  //   path: "/user",

  // }

  public static create: Spec = {
    method: HELPER.methods.POST,
    path: "/user",
    validate: {
      continueOnError: true,
      type: HELPER.contentType.JSON,
      body: JOI.object({
        id: JOI.string().alphanum().required(),
        points: JOI.number().integer(),
      }).options({ stripUnknown: true }),
      output: Object.assign(
        {},
        HELPER.errorResponse(400),
        HELPER.validationErrorResponse(),
        {
          201: {
            body: JOI.object({
              code: 201,
              data: JOI.object(UserRouter.userOutput),
            }).options({ stripUnknown: false }),
          },
        }
      ),
    },
    handler: [HELPER.validation, USER_CONTROLLER.create],
  };

  public static update: Spec = {
    method: HELPER.methods.PUT,
    path: "/user/:id",
    validate: {
      continueOnError: true,
      type: HELPER.contentType.JSON,
      params: JOI.object({
        id: JOI.string().regex(HELPER.mongoObjectRegEx),
      }),
      body: JOI.object({
        id: JOI.string().alphanum().required(),
        points: JOI.number().integer(),
      }).options({ stripUnknown: true }),
      output: Object.assign(
        {},
        HELPER.errorResponse(400),
        HELPER.validationErrorResponse(),
        {
          200: {
            body: JOI.object({
              code: 200,
              data: JOI.object(UserRouter.userOutput),
            }).options({ stripUnknown: false }),
          },
        }
      ),
    },
    handler: [HELPER.validation, USER_CONTROLLER.update],
  };

  public static read: Spec = {
    method: HELPER.methods.GET,
    path: "/user/:id",
    validate: {
      continueOnError: true,
      params: JOI.object({
        id: JOI.string().regex(HELPER.mongoObjectRegEx),
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
              data: JOI.object(UserRouter.userOutput),
            }).options({ stripUnknown: true }),
          },
        }
      ),
    },
    handler: [HELPER.validation, USER_CONTROLLER.read],
  };
};

export default UserRouter;
