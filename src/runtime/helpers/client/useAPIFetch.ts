import type { ModuleAPISwagger } from '../../api';
import defineAPI from './defineAPI';

export default defineAPI<ModuleAPISwagger>('/te-api/themes', {
  addSlash: true
});
