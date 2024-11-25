import sidebar from './sidebar';

export default defineThemeBlockRoot({
  name: 'Light',
  description: 'Стандартная светлая тема фырв шщрфшщырв шщрфышвр щшфырщв рфырв шщфршырв щшфырщшв рфыр фылдв фыв рфырвд фыдвр дфыырлвр фыдрдвр',
  previewStyles: {
  },
  uiStyles: {
  }
}, [
  {
    test: '#cccccc',
    dsd: '#002',
    dssssss3: '#001'
  },
  sidebar,
  defineThemeBlock('navbar', [
    defineThemeBlock('road', [
      {
        test1: '#fff',
        a: '#f1f1f1'
      }
    ]),
    {
      test1: '#f50000',
      a: '#f1f1f1'
    },
    {
      test2: '#f50000',
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
