import {
  defineEventHandler,
  type EventHandlerResponse, type EventHandlerRequest, type EventHandler, getHeader, createError
} from 'h3';
import { useRuntimeConfig } from '#imports';
import type { ModuleOptionsExtend } from '~/src/runtime/types';

export default function<Request = EventHandlerRequest, Response = EventHandlerResponse>(handler: EventHandler<Request extends EventHandlerRequest ? Request : EventHandlerRequest, Request extends EventHandlerRequest ? Response : Request>): EventHandler<Request extends EventHandlerRequest ? Request : EventHandlerRequest, Request extends EventHandlerRequest ? Response : Request> {
  return defineEventHandler<Request, Response>((event) => {
    const authorizationToken = getHeader(event, 'Authorization');
    const config = useRuntimeConfig().public.themesEditor as ModuleOptionsExtend;
    const tokens = config.tokens;

    if (['GET'].includes(event.method)) {
      if (
        tokens.baseAuthorizationToken !== authorizationToken
        && tokens.fullAuthorizationToken !== authorizationToken
      ) {
        throw createError({
          statusCode: 401,
          message: 'Unauthorized'
        });
      }
    } else if (['POST', 'PUT', 'DELETE'].includes(event.method)) {
      if (tokens.fullAuthorizationToken !== authorizationToken) {
        throw createError({
          statusCode: 401,
          message: 'Unauthorized'
        });
      }
    } else {
      throw createError({
        statusCode: 403,
        message: 'Method Not Allowed'
      });
    }

    return handler(event);
  });
}
