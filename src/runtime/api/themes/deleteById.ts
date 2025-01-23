import { defineEventHandler, getRouterParam, createError } from 'h3';
import type { ModuleLocalStorageThemeFull } from '../../types';
import db from './helpers/db';

export default defineEventHandler<Promise<ModuleLocalStorageThemeFull>>(async (event) => {
  const themeId = getRouterParam(event, 'id');

  try {
    return db.deleteThemeById(themeId!);
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      message: e.message
    });
  }
});
