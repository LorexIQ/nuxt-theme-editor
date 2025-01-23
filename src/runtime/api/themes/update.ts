import { defineEventHandler, readBody, createError, getRouterParam } from 'h3';
import type { ModuleLocalStorageThemeFull } from '../../types';
import validator from './helpers/validator';
import db from './helpers/db';

export default defineEventHandler<Promise<ModuleLocalStorageThemeFull>>(async (event) => {
  const themeId = getRouterParam(event, 'id');
  const body = await readBody(event);

  try {
    validator(body, 'ModuleLocalStorageThemeEdit');
    return db.updateTheme(themeId!, body);
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      message: e.message
    });
  }
});
