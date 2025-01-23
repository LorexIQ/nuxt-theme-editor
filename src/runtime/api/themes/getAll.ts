import { defineEventHandler, createError } from 'h3';
import type { ModuleLocalStorageThemeFull } from '../../types';
import db from './helpers/db';

export default defineEventHandler<Promise<ModuleLocalStorageThemeFull[]>>(async () => {
  try {
    return db.getAll();
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      message: e.message
    });
  }
});
