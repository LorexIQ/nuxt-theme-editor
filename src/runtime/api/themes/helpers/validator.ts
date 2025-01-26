export default function (data: any, type: 'ModuleLocalStorageTheme' | 'ModuleLocalStorageThemeEdit') {
  const requiredKeys = [
    'id',
    'name',
    'description',
    'previewStylesJSON',
    'stylesJSON'
  ];

  if (
    typeof data !== 'object'
    || (
      type === 'ModuleLocalStorageTheme'
      && !requiredKeys.map(key => key in data && typeof data[key] === 'string').every(Boolean)
    )
  ) throw new Error(`The data type does not match the type ${type}`);

  Object.keys(data).forEach((key) => {
    if (!requiredKeys.includes(key)) delete data[key];
  });
}
