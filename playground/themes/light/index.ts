import sidebar from './sidebar';

export default defineThemeBlockRoot({
  name: 'Light',
  description: 'Стандартная светлая тема',
  previewStyles: {
    bg1: 'red',
    bg2: 'green',
    bg3: 'blue'
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
  defineThemeBlock('tabs', [
    {
      bg: '#000000'
    }
  ]),
  defineThemeBlock('system', [
    {
      a: '#fff',
      b: '#000'
    }
  ], {
    name: 'Лютый фонк',
    inheritanceParent: true
  }),
  defineThemeBlock('loader', [
    {
      bg: '#000',
      color: '#333',
      textColor: '#fff'
    }
  ])
]);
