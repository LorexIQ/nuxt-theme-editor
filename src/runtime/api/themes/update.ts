import { createError, getRouterParam } from 'h3';
import { z } from 'zod';
import defineServerRoute from '../../helpers/server/defineServerRoute';
import type { ModuleLocalStorageTheme } from '../../types';
import bodyReader from './helpers/bodyReader';
import db from './helpers/db';

const ThemeEditDto = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  previewStylesJSON: z.string().optional(),
  stylesJSON: z.string().optional()
});

export default defineServerRoute<Promise<ModuleLocalStorageTheme>>(async (event) => {
  const themeId = getRouterParam(event, 'id');
  const body = await bodyReader(event, ThemeEditDto);

  try {
    return db.updateTheme(themeId!, body);
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      message: e.message
    });
  }
});
