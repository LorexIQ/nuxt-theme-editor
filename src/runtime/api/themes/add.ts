import { createError } from 'h3';
import { z } from 'zod';
import defineServerRoute from '../../helpers/server/defineServerRoute';
import type { ModuleLocalStorageTheme } from '../../types';
import bodyReader from './helpers/bodyReader';
import db from './helpers/db';

const ThemeCreateDto = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  previewStylesJSON: z.string(),
  stylesJSON: z.string()
});

export default defineServerRoute<Promise<ModuleLocalStorageTheme>>(async (event) => {
  const body = await bodyReader(event, ThemeCreateDto);

  try {
    return db.addTheme(body);
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      message: e.message
    });
  }
});
