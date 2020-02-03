export default class Plugin {
  type = constructor.name;
  toConfig() {
    return {
      type: this.type,
      options: this.options
    };
  }
}
