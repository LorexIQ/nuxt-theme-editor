import { defineEventHandler, readBody, createError } from 'h3';
import type { ModuleLocalStorageThemeFull } from '../../types';
import validator from './helpers/validator';
import db from './helpers/db';

export default defineEventHandler<Promise<ModuleLocalStorageThemeFull>>(async (event) => {
  const body = await readBody(event);

  try {
    validator(body, 'ModuleLocalStorageThemeFull');
    return db.addTheme(body);
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      message: e.message
    });
  }
});
