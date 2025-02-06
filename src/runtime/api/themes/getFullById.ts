import { getRouterParam, createError } from 'h3';
import defineServerRoute from '../../helpers/server/defineServerRoute';
import type { ModuleLocalStorageTheme } from '../../types';
import db from './helpers/db';

export default defineServerRoute<Promise<ModuleLocalStorageTheme>>(async (event) => {
  const themeId = getRouterParam(event, 'id');

  try {
    return db.getFullThemeById(themeId!);
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      message: e.message
    });
  }
});
