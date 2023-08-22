export function pick<T extends object, U extends keyof T>(data: T, keys: U[]) {
  const newData: Pick<T, U> = {} as any;

  keys.forEach(k => {
    newData[k] = data[k];
  });

  return newData;
}
