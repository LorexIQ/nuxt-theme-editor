import { getRouterParam, createError } from 'h3';
import { z } from 'zod';
import defineServerRoute from '../../helpers/server/defineServerRoute';
import type { APIResponseStatus } from '../../types';
import db from './helpers/db';
import bodyReader from './helpers/bodyReader';

const ThemeCheckConflictDto = z.object({
  updatedAt: z.number()
});

export default defineServerRoute<Promise<APIResponseStatus>>(async (event) => {
  const themeId = getRouterParam(event, 'id');
  const body = await bodyReader(event, ThemeCheckConflictDto);

  try {
    return db.checkConflictById(themeId, body.updatedAt);
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      message: e.message
    });
  }
});
