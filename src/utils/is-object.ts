export function isObject(value: unknown) {
  return (
    typeof value === 'object' &&
    String(value) == '[object Object]'
  );
}
