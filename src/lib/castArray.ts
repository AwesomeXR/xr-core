export function castArray(target: any): any[] {
  if (Array.isArray(target)) return target;
  return [target];
}
