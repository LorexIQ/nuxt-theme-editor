export default defineNuxtPlugin(() => {
  const theme = defineThemeBlockRoot(
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
  console.log(JSON.stringify(theme));
});
