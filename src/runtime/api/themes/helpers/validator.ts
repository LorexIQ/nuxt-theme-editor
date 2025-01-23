export default function (data: any, type: 'ModuleLocalStorageThemeFull' | 'ModuleLocalStorageThemeEdit') {
  const requiredKeys = [
    ...(type === 'ModuleLocalStorageThemeFull' ? ['id'] : []),
    'name',
    'description',
    'previewJSON',
    'stylesJSON'
  ];

  if (
    typeof data !== 'object'
    || !requiredKeys.map(key => key in data && typeof data[key] === 'string').every(Boolean)
  ) throw new Error(`The data type does not match the type ${type}`);

  Object.keys(data).forEach((key) => {
    if (!requiredKeys.includes(key)) delete data[key];
  });
}
