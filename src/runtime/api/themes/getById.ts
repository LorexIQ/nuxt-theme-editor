import { getRouterParam, createError } from 'h3';
import defineServerRoute from '../../helpers/server/defineServerRoute';
import type { ModuleLocalStorageThemeMini } from '../../types';
import db from './helpers/db';

export default defineServerRoute<Promise<ModuleLocalStorageThemeMini>>(async (event) => {
  const themeId = getRouterParam(event, 'id');

  try {
    return db.getThemeById(themeId!);
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      message: e.message
    });
  }
});
