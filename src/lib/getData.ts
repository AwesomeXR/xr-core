export function getData(target: any, path: string | string[], defaultValue?: any) {
  if (!path) return target;

  // 判断 object 是否是数组或者对象，否则直接返回默认值 defaultValue
  if (typeof target !== 'object') return defaultValue;

  const pathX = typeof path === 'string' ? path.split('.') : path;

  // 沿着路径寻找到对应的值，未找到则返回默认值 defaultValue
  return pathX.reduce((o, k) => (o || {})[k], target) || defaultValue;
}
