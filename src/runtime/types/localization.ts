import type { LANGUAGES } from '../assets/defaultLanguages';

export type ModuleLocalizationStructure = {
  global: {
    unknown: string;
    notSet: string;
    loading: string;
    loadingError: string;
  };
  pagesTitles: {
    newTheme: string;
    deleteTheme: string;
    editThemeConflict: string;
    editThemeInfo: string;
    editThemeStyles: string;
    editThemeStylesCancel: string;
    depublishApprove: string;
    publishApprove: string;
  };
  themeCard: {
    emptyName: string;
    emptyDescription: string;

    status: {
      cache: string;
      active: string;
      lightDark: string;
      light: string;
      dark: string;
    };
  };
  contextMenu: {
    selectActionTip: string;
    selectAnInheritanceTip: string;
    search: string;
    empty: string;

    selectTheme: {
      main: string;
      active: string;
    };
    selectAsLightTheme: {
      main: string;
      active: string;
    };
    selectAsDarkTheme: {
      main: string;
      active: string;
    };
    createThemeCopy: string;
    publish: string;
    depublish: string;
    editInfo: string;
    editStyles: string;
    deleteTheme: string;
    useInheritance: string;
    useColorPicker: string;
  };
  errorsMessages: {
    publishTheme: {
      title: string;
      message: string;
    };
    depublishTheme: {
      title: string;
      message: string;
    };
    editTheme: {
      title: string;
      message: string;
    };
    editThemeStyles: {
      title: string;
      message: string;
    };
    deleteTheme: {
      title: string;
      message: string;
    };
    checkConflict: {
      title: string;
      message: string;
    };
    loadThemeStyles: {
      title: string;
      message: string;
    };
    loadThemeInfo: {
      title: string;
      message: string;
    };
    loadThemes: {
      title: string;
      message: string;
    };
    idConflict: {
      message: (oldId: string, newId: string, name: string) => string;
      systemTitle: string;
      globalTitle: string;
    };
  };

  page404: {
    title: string;

    buttons: {
      goMain: string;
    };
  };
  pageCreateEdit: {
    infoTitle: string;
    previewTitle: string;
    parentTitle: string;
    inputId: string;
    inputName: string;
    inputDescription: string;

    messages: {
      validationError: string;
      idRequired: string;
      idIncorrect: (id: string) => string;
      idConflict: (id: string) => string;
      parentRequired: string;

      info: {
        title: string;
        description: string;
      };
    };
    buttons: {
      goBack: string;
      create: string;
      save: string;
    };
  };
  pageDelete: {
    title: string;

    buttons: {
      cancel: string;
      delete: string;
    };
  };
  pageDepublish: {
    title: string;

    buttons: {
      cancel: string;
      depublish: string;
    };
  };
  pageEditConflict: {
    title: string;
    server: string;
    local: string;

    buttons: {
      pull: string;
      push: string;
    };
  };
  pageEditThemeStyles: {
    previewHeader: string;
    uiHeader: string;
    circularInheritance: string;
    inheritanceFrom: string;

    buttons: {
      goBack: string;
      save: string;
    };
  };
  pageEditStylesCancel: {
    title: string;

    buttons: {
      cancel: string;
      approve: string;
    };
  };
  pagePublish: {
    title: string;

    buttons: {
      cancel: string;
      publish: string;
    };
  };
  pageIndex: {
    blockSystemTitle: string;
    blockGlobalTitle: string;
    blockLocalTitle: string;
    autoModeTitle: string;
    themesEmpty: string;
  };
};

export type ModuleLang = keyof typeof LANGUAGES;
