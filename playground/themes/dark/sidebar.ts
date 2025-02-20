import test from './test';

export default defineThemeBlock('sidebar', [
  {
    left: '#d3c6c6',
    right: '#6d7079'
  },
  test,

  defineThemeBlock('1', [
    {
      left: '#af0000',
      right: '#0056b2'
    }
  ]),
  defineThemeBlock('2', [
    {
      left: '#00ab1a',
      right: '#8700b2'
    }
  ])
]);
