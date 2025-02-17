import test from './test';

export default defineThemeBlock('sidebar', [
  {
    left: '#ffeded',
    right: '#989ca9'
  },
  test,

  defineThemeBlock('1', [
    {
      left: '#ff0000',
      right: '#0075ff'
    }
  ]),
  defineThemeBlock('2', [
    {
      left: '#00ff22',
      right: '#bf00ff'
    }
  ])
]);
