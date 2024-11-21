import sidebar from './sidebar';

export default defineThemeBlockRoot(
  {
    test: '#2c2c2c',
    test2: '#d5e8d8'
  },
  sidebar,
  defineThemeBlock(
    'navbar',
    defineThemeBlock(
      'road',
      {
        test1: '#fff',
        a: '#f1f1f1'
      }
    ),
    {
      test1: '#f50000',
      a: '#f1f1f1'
    },
    {
      test2: '#f50000',
      a: '#f1f1f1'
    }
  ),
  defineThemeBlock(
    'abc',
    {
      a: '#fff',
      b: '#000'
    }
  ),
  defineThemeBlock(
    'abcd',
    {
      a: '#fff',
      b: '#000'
    }
  )
);
