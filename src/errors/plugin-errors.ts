export class PluginNotRegisteredError extends Error {
  get message() {
    return 'Plugin not registered.';
  }
}
