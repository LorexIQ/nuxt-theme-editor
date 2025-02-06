import type { z } from 'zod';
import { createError, type EventHandlerRequest, type H3Event, readValidatedBody } from 'h3';

export default async function<T extends z.ZodTypeAny>(event: H3Event<EventHandlerRequest>, dto: T): Promise<z.infer<T>> {
  const body = await readValidatedBody(event, body => dto.safeParse(body));

  if (!body.success) throw createError({
    statusCode: 400,
    data: body.error.issues
  });

  return body.data;
}
