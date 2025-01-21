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
  defineThemeBlock('navbar', [
    defineThemeBlock('road321312312312313123', [
      {
        test12: '#fff', // Это navbar road test 1 описание
        a2: '#f1f1f1'
      },
      defineThemeBlock('road12312321312312321', [
        {
          test1: '#fff', // Это navbar road test 1 описание
          a: '#f1f1f1'
        }
      ])
    ]),
    {
      test1: '$sidebar.test.testtesttest2',
      a: '#f1f1f1'
    }
  ]),
  defineThemeBlock('abc', [
    {
      a: '#fff',
      b: '#000'
    }
  ], {
    name: 'Лютый фонк',
    inheritanceParent: true
  }),
  defineThemeBlock('abcd', [
    {
      a: '#fff',
      b: '#000'
    }
  ])
]);
