export function setData(target: any, path: string | string[], value: any) {
  if (typeof target !== 'object') return target;

  const pathX = typeof path === 'string' ? path.split('.') : path;

  pathX.reduce((o, k, i) => {
    if (i === pathX.length - 1) {
      o[k] = value;
      return null;
    }
    //
    else if (k in o) {
      // 若存在对应路径，则返回找到的对象，进行下一次遍历
      return o[k];
    }
    //
    else {
      // 若不存在对应路径，则创建对应对象，若下一路径是数字，新对象赋值为空数组，否则赋值为空对象
      o[k] = /^[0-9]{1,}$/.test(pathX[i + 1]) ? [] : {};
      return o[k];
    }
  }, target);

  return target;
}
