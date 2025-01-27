import { defineEventHandler, getRouterParam, createError } from 'h3';
import type { ModuleLocalStorageTheme } from '../../types';
import db from './helpers/db';

export default defineEventHandler<Promise<ModuleLocalStorageTheme>>(async (event) => {
  const themeId = getRouterParam(event, 'id');

  try {
    await new Promise(resolve => setTimeout(() => resolve(''), 1000));
    return db.getThemeById(themeId!);
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      message: e.message
    });
  }
});
