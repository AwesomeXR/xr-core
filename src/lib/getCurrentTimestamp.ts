export let getCurrentTimestamp: () => number;

try {
  performance.now();
  getCurrentTimestamp = () => performance.now();
} catch (_err) {
  getCurrentTimestamp = () => new Date().valueOf();
}
