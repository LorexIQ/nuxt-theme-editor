import getLocalStorage from '../../../helpers/server/getLocalStorage';
import type {
  APIResponseStatus,
  ModuleLocalStorageTheme, ModuleLocalStorageThemeCreate,
  ModuleLocalStorageThemeEdit,
  ModuleLocalStorageThemeMini
} from '../../../types';

class FakeDB {
  private localStorage = getLocalStorage();
  private data!: ModuleLocalStorageTheme[];

  constructor() {
    this.read();
  }

  private read() {
    const storage = this.localStorage.getItem('themes');

    if (!storage) {
      this.data = [];
      this.save();
    } else {
      const parsedStorage = JSON.parse(storage);

      if (!Array.isArray(parsedStorage)) {
        this.data = [];
        this.save();
      } else {
        this.data = parsedStorage;
      }
    }
  }

  private save() {
    this.localStorage.setItem('themes', JSON.stringify(this.data));
  }

  getAll(): ModuleLocalStorageThemeMini[] {
    return this.data.map(theme => ({
      id: theme.id,
      name: theme.name,
      description: theme.description,
      previewStylesJSON: theme.previewStylesJSON,
      updatedAt: theme.updatedAt
    }));
  }

  getThemeById(id: string | undefined): ModuleLocalStorageThemeMini {
    const themeIndex = this.data.findIndex(theme => theme.id === id);
    if (themeIndex === -1) throw new Error('Theme is not found!');
    const theme = this.data[themeIndex];
    return {
      id: theme.id,
      name: theme.name,
      description: theme.description,
      previewStylesJSON: theme.previewStylesJSON,
      updatedAt: theme.updatedAt
    };
  }

  getFullThemeById(id: string | undefined): ModuleLocalStorageTheme {
    const themeIndex = this.data.findIndex(theme => theme.id === id);
    if (themeIndex === -1) throw new Error('Theme is not found!');
    return this.data[themeIndex];
  }

  checkConflictById(id: string | undefined, updatedAt: number): APIResponseStatus {
    const themeIndex = this.data.findIndex(theme => theme.id === id);
    if (themeIndex === -1) throw new Error('Theme is not found!');
    const themeUpdatedAt = this.data[themeIndex].updatedAt;
    return { status: themeUpdatedAt > updatedAt };
  }

  addTheme(data: ModuleLocalStorageThemeCreate): ModuleLocalStorageTheme {
    const themeIndex = this.data.findIndex(theme => theme.id === data.id);
    if (themeIndex !== -1) throw new Error('Theme with this id is already exists!');
    this.data.push({
      ...data,
      updatedAt: Date.now()
    });
    this.save();
    return this.data.at(-1)!;
  }

  updateTheme(id: string | undefined, data: ModuleLocalStorageThemeEdit): ModuleLocalStorageTheme {
    const themeIndex = this.data.findIndex(theme => theme.id === id);
    if (themeIndex === -1) throw new Error('Theme is not found!');
    const theme = this.data[themeIndex];
    Object.assign(theme, {
      ...data,
      updatedAt: Date.now()
    });
    this.save();
    return theme;
  }

  deleteThemeById(id: string | undefined): ModuleLocalStorageTheme {
    const themeIndex = this.data.findIndex(theme => theme.id === id);
    if (themeIndex === -1) throw new Error('Theme is not found!');
    const theme = this.data[themeIndex];
    this.data.splice(themeIndex, 1);
    this.save();
    return theme;
  }
}

export default new FakeDB();
