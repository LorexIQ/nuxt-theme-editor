import sidebar from './sidebar';

export default defineThemeBlockRoot({
  name: 'Light',
  description: 'Стандартная светлая тема',
  previewStyles: {
    defaultPreviewCardBG1: 'red',
    defaultPreviewCardBG2: 'green',
    defaultPreviewCardBG3: 'blue'
  },
  uiStyles: {
  }
}, [
  {
    test: '#cccccc', // Это описание глобального стиля
    dsd: '$global.test',
    dssssss3: '#5da239'
  },
  sidebar,
  defineThemeBlock('navbar', [
    defineThemeBlock('road', [
      {
        test1: '#fff', // Это navbar road test 1 описание
        a: '#f1f1f1'
      }
    ]),
    {
      test1: '$sidebar.test.testtesttest2',
      a: '#f1f1f1'
    },
    {
      test2: '#e5b7b7',
      a: '#f1f1f1'
    }
  ]),
  defineThemeBlock('abc', [
    {
      a: '#fff',
      b: '#000'
    }
  ]),
  defineThemeBlock('abcd', [
    {
      a: '#fff',
      b: '#000'
    }
  ])
]);
