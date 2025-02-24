import type { ModuleLocalizationStructure } from '../types';

const EN: ModuleLocalizationStructure = {
  global: {
    unknown: 'Unknown',
    notSet: 'Not Set',
    loading: 'Loading...',
    loadingError: 'Loading error'
  },
  pagesTitles: {
    newTheme: 'New',
    deleteTheme: 'Delete',
    editThemeConflict: 'Conflict',
    editThemeInfo: 'Edit Info',
    editThemeStyles: 'Edit Styles',
    editThemeStylesCancel: 'Cancel Changes',
    depublishApprove: 'Depublish Approve',
    publishApprove: 'Publish Approve'
  },
  themeCard: {
    emptyName: 'Empty',
    emptyDescription: 'Description isn\'t set',

    status: {
      cache: 'Cache',
      active: 'Active',
      lightDark: 'Light/Dark',
      light: 'Light',
      dark: 'Dark'
    }
  },
  contextMenu: {
    selectActionTip: 'Select an action',
    selectAnInheritanceTip: 'Select an inheritance',
    search: 'Search',
    empty: 'Empty',

    selectTheme: {
      main: 'Select a theme',
      active: 'Theme is active'
    },
    selectAsLightTheme: {
      main: 'Set as light theme',
      active: 'Light theme is set'
    },
    selectAsDarkTheme: {
      main: 'Set as dark theme',
      active: 'Dark theme is set'
    },
    createThemeCopy: 'Create theme copy',
    publish: 'Publish',
    depublish: 'Depublish',
    editInfo: 'Edit info',
    editStyles: 'Edit Styles',
    deleteTheme: 'Delete theme',
    useInheritance: 'Use inheritance',
    useColorPicker: 'Select by color picker'
  },
  errorsMessages: {
    publishTheme: {
      title: 'Error theme publishing',
      message: 'Error uploading the theme to the server. Please try again later.'
    },
    depublishTheme: {
      title: 'Error theme depublishing',
      message: 'The error of removing a topic from publication. Please try again later.'
    },
    editTheme: {
      title: 'Information modification error',
      message: 'An error occurred on the server when saving the information. Please try again later.'
    },
    editThemeStyles: {
      title: 'Styles modification error',
      message: 'An error occurred on the server when saving the information. Please try again later.'
    },
    deleteTheme: {
      title: 'Error theme deleting',
      message: 'An error occurred while deleting the theme. Please try again later.'
    },
    checkConflict: {
      title: 'Conflict verification error',
      message: 'The server returned an error. Please try again later.'
    },
    loadThemeStyles: {
      title: 'Error theme styles loading',
      message: 'Error loading theme styles from the server. Please try again later.'
    },
    loadThemeInfo: {
      title: 'Error theme info loading',
      message: 'Error loading info from the server. Please try again later.'
    },
    loadThemes: {
      title: 'Error downloading themes from the server',
      message: 'Wait and try downloading again. If there is this error, it is NOT RECOMMENDED to edit topics, these actions may lead to conflicts.'
    },
    idConflict: {
      message: (oldId: string, newId: string, name: string) => `Used plug: ${oldId} (${name}) > ${newId}`,
      systemTitle: 'Local theme id conflict with system theme id',
      globalTitle: 'Local theme id conflict with global theme id'
    }
  },

  page404: {
    title: 'Page not found',

    buttons: {
      goMain: 'Go main'
    }
  },
  pageCreateEdit: {
    infoTitle: 'Theme Info',
    previewTitle: 'Preview Card',
    parentTitle: 'Parent Theme',
    inputId: 'ID',
    inputName: 'Name',
    inputDescription: 'Description',

    messages: {
      validationError: 'Validation error',
      idRequired: 'The ID value is required.',
      idIncorrect: () => 'The ID may only contain digits, letters (a-z, A-Z), hyphens (-), and underscores (_).',
      idConflict: id => `The theme with the ID "${id}" already exists.`,
      parentRequired: 'The parent theme is not set.',

      info: {
        title: 'Information',
        description: 'You can customize all styles, including preview card and theme editor, after creating the theme.'
      }
    },
    buttons: {
      goBack: 'Go back',
      create: 'Create',
      save: 'Save'
    }
  },
  pageDelete: {
    title: 'Are you sure you want to delete the theme?',

    buttons: {
      cancel: 'Cancel',
      delete: 'Delete'
    }
  },
  pageDepublish: {
    title: 'Are you serious about removing the topic from publication?',

    buttons: {
      cancel: 'Cancel',
      depublish: 'Depublish'
    }
  },
  pageEditConflict: {
    title: 'Conflict detected',
    server: 'Server',
    local: 'Local',

    buttons: {
      pull: 'Pull',
      push: 'Push'
    }
  },
  pageEditThemeStyles: {
    previewHeader: 'Preview Card',
    uiHeader: 'Editor UI',
    circularInheritance: 'Circular Inheritance',
    inheritanceFrom: 'Inheritance from',

    buttons: {
      goBack: 'Go back',
      save: 'Save'
    }
  },
  pageEditStylesCancel: {
    title: 'The changes you have made may not be saved',

    buttons: {
      cancel: 'Cancel',
      approve: 'Approve'
    }
  },
  pagePublish: {
    title: 'Are you sure you want to make the theme global?',

    buttons: {
      cancel: 'Cancel',
      publish: 'Publish'
    }
  },
  pageIndex: {
    blockSystemTitle: 'System',
    blockGlobalTitle: 'Global',
    blockLocalTitle: 'Local',
    autoModeTitle: 'Use the color scheme of the device',
    themesEmpty: 'No Themes available'
  }
};
const RU: ModuleLocalizationStructure = {
  global: {
    unknown: 'Неизвестно',
    notSet: 'Не установлено',
    loading: 'Загрузка...',
    loadingError: 'Ошибка загрузки'
  },
  pagesTitles: {
    newTheme: 'Новая',
    deleteTheme: 'Удаление',
    editThemeConflict: 'Конфликт',
    editThemeInfo: 'Изменение',
    editThemeStyles: 'Изменение стилей',
    editThemeStylesCancel: 'Отмена изменений',
    depublishApprove: 'Снятие с публикации',
    publishApprove: 'Публикация'
  },
  themeCard: {
    emptyName: 'Пусто',
    emptyDescription: 'Описание не задано',

    status: {
      cache: 'Кэш',
      active: 'Активна',
      lightDark: 'Свет/Тёмн',
      light: 'Светлая',
      dark: 'Тёмная'
    }
  },
  contextMenu: {
    selectActionTip: 'Выбор действия',
    selectAnInheritanceTip: 'Выбор наследования',
    search: 'Поиск',
    empty: 'Пусто',

    selectTheme: {
      main: 'Выбрать тему',
      active: 'Тема выбрана'
    },
    selectAsLightTheme: {
      main: 'Выбрать как светлую тему',
      active: 'Тема выбрана как светлая'
    },
    selectAsDarkTheme: {
      main: 'Выбрать как тёмную тему',
      active: 'Тема выбрана как тёмная'
    },
    createThemeCopy: 'Создать копию темы',
    publish: 'Опубликовать',
    depublish: 'Снять с публикации',
    editInfo: 'Изменить информацию',
    editStyles: 'Изменить стили',
    deleteTheme: 'Удалить тему',
    useInheritance: 'Использовать наследование',
    useColorPicker: 'Выбрать палитрой цветов'
  },
  errorsMessages: {
    publishTheme: {
      title: 'Ошибка публикации темы',
      message: 'Не удалось загрузить тему на сервер. Повторите попытку позже.'
    },
    depublishTheme: {
      title: 'Ошибка снятия темы с публикации',
      message: 'Не удалось удалить тему с сервера. Повторите попытку позже.'
    },
    editTheme: {
      title: 'Ошибка изменения информации',
      message: 'Не удалось изменить информацию об теме на сервере. Повторите попытку позже.'
    },
    editThemeStyles: {
      title: 'Ошибка сохранения стилей темы',
      message: 'Не удалось изменить информацию об теме на сервере. Повторите попытку позже.'
    },
    deleteTheme: {
      title: 'Ошибка удаления темы',
      message: 'Не удалось удалить тему с сервера. Повторите попытку позже.'
    },
    checkConflict: {
      title: 'Ошибка проверки конфликтов',
      message: 'Не удалось проверить темы на наличие конфликтов с сервером. Повторите попытку позже.'
    },
    loadThemeStyles: {
      title: 'Ошибка загрузки стилей темы',
      message: 'Не удалось получить информацию об теме с сервера. Повторите попытку позже.'
    },
    loadThemeInfo: {
      title: 'Ошибка загрузки информации об темы',
      message: 'Не удалось получить информацию об теме с сервера. Повторите попытку позже.'
    },
    loadThemes: {
      title: 'Ошибка загрузки списка тем',
      message: 'Подождите и повторите попытку снова. Если вы видите эту ошибку, настоятельно НЕ РЕКОМЕНДУЕТСЯ взаимодействовать с глобальными темами, данные действия могут вызвать конфликты и потерю локальных тем.'
    },
    idConflict: {
      message: (oldId: string, newId: string, name: string) => `Используется заглушка: ${oldId} (${name}) > ${newId}`,
      systemTitle: 'ID локальной темы конфликтует с системной темой',
      globalTitle: 'ID локальной темы конфликтует с глобальной темой'
    }
  },

  page404: {
    title: 'Страница не найдена',

    buttons: {
      goMain: 'На главную'
    }
  },
  pageCreateEdit: {
    infoTitle: 'Информация',
    previewTitle: 'Карточка предпросмотра',
    parentTitle: 'Родительская тема',
    inputId: 'ID',
    inputName: 'Наименование',
    inputDescription: 'Описание',

    messages: {
      validationError: 'Ошибка валидации',
      idRequired: 'ID является обязательным',
      idIncorrect: () => 'ID может содержать только цифры, буквы (a-z, A-Z), тире (-), и подчёркивание (_).',
      idConflict: id => `Тема с ID "${id}" уже существует.`,
      parentRequired: 'Родительская тема не выбрана',

      info: {
        title: 'Информация',
        description: 'Изменение пользовательских стилей, а так же карточки предпросмотра и интерфейса редактора, будет доступно после создания темы.'
      }
    },
    buttons: {
      goBack: 'Назад',
      create: 'Создать',
      save: 'Сохранить'
    }
  },
  pageDelete: {
    title: 'Вы уверены, что хотите удалить тему?',

    buttons: {
      cancel: 'Отмена',
      delete: 'Удалить'
    }
  },
  pageDepublish: {
    title: 'Вы уверены, что хотите снять тему с публикации?',

    buttons: {
      cancel: 'Отмена',
      depublish: 'Снять'
    }
  },
  pageEditConflict: {
    title: 'Обнаружен конфликт версий',
    server: 'Сервер',
    local: 'Локальная',

    buttons: {
      pull: 'Загрузить',
      push: 'Отправить'
    }
  },
  pageEditThemeStyles: {
    previewHeader: 'Карточка предпросмотра',
    uiHeader: 'UI редактора',
    circularInheritance: 'Цикличное наследование',
    inheritanceFrom: 'Наследование от',

    buttons: {
      goBack: 'Назад',
      save: 'Сохранить'
    }
  },
  pageEditStylesCancel: {
    title: 'Не сохранённые изменения могут быть потеряны',

    buttons: {
      cancel: 'Отмена',
      approve: 'Подтвердить'
    }
  },
  pagePublish: {
    title: 'Вы уверены, что хотите опубликовать тему?',

    buttons: {
      cancel: 'Отмена',
      publish: 'Опубликовать'
    }
  },
  pageIndex: {
    blockSystemTitle: 'Системные',
    blockGlobalTitle: 'Глобальные',
    blockLocalTitle: 'Локальные',
    autoModeTitle: 'Использовать цветовую схему устройства',
    themesEmpty: 'Нет доступных тем'
  }
};

export const LANGUAGES = {
  EN,
  RU
};
