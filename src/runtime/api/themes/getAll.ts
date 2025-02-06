import { createError } from 'h3';
import type { ModuleLocalStorageThemeMini } from '../../types';
import defineServerRoute from '../../helpers/server/defineServerRoute';
import db from './helpers/db';

export default defineServerRoute<Promise<ModuleLocalStorageThemeMini[]>>(async () => {
  try {
    return db.getAll();
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      message: e.message
    });
  }
});
