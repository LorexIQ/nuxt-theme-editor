import sidebar from './sidebar';

export default defineThemeBlockRoot({
  previewStyles: {
    defaultPreviewCardBG1: 'purple',
    defaultPreviewCardBG2: 'pink',
    defaultPreviewCardBG3: 'brown'
  }
}, [
  {
    test: '#676764',
    dssssss3: '#830101'
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
      test1: '#207909',
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
