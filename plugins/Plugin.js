export default class Plugin {
  toConfig() {
    return {
      name: this.constructor.name,
      options: this.options,
    };
  }
}
