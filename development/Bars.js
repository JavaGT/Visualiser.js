import Plugin from "./visualiser/plugins/Plugin.js";

export default class Bars extends Plugin {
  #context;
  #options = {
    width: 1280,
    height: 100
  };
  get options() {
    return this.#options;
  }
  constructor(options) {
    super(options);
    Object.assign(this.#options, options);
  }
  init({ context }) {
    this.#context = context;
  }
  dispose(){}
  draw({ data }) {
    this.#context.fillStyle = this.#options.color;
    this.#context.fillRect(0, 0, this.#options.width, Math.max(...data));
  }
}
