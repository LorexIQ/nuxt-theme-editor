import { defineEventHandler, readBody, createError } from 'h3';
import type { ModuleLocalStorageTheme } from '../../types';
import validator from './helpers/validator';
import db from './helpers/db';

export default defineEventHandler<Promise<ModuleLocalStorageTheme>>(async (event) => {
  const body = await readBody(event);

  try {
    validator(body, 'ModuleLocalStorageThemeCreate');
    return db.addTheme(body);
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      message: e.message
    });
  }
});
