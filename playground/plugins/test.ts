export default defineNuxtPlugin(() => {
  console.log(defineThemeBlock(
    null,
    {
      test: '#000'
    },
    defineThemeBlock(
      'sidebar',
      {
        test1: '#fff',
        a: '#f1f1f1'
      }
    ),
    defineThemeBlock(
      'navbar',
      {
        test1: '#fff',
        a: '#f1f1f1'
      },
      defineThemeBlock(
        'road',
        {
          test1: '#fff',
          a: '#f1f1f1'
        }
      )
    )
  ));
});
