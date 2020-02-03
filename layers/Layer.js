import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js";

export default class Layer {
  #options = {};
  #plugins = [];
  #three = {
    scene: new THREE.Scene()
  };
  type = constructor.name;
  constructor({ width, height, camera }) {
    this.#options.width = width;
    this.#options.height = height;
    this.#three.camera = camera;
  }

  get width() {
    return this.#options.width;
  }
  get height() {
    return this.#options.height;
  }

  get camera() {
    return this.#three.camera;
  }
  get scene() {
    return this.#three.scene;
  }

  toConfig() {
    return {
      type: this.type,
      options: this.#options,
      plugins: this.#plugins.map(plugin => plugin.toConfig())
    };
  }

  dispose() {
    this.#three.scene.dispose();
    this.#three.camera.dispose();
    this.#plugins.forEach(item => item.dispose());
    if (this.disposeables) this.disposeables.forEach(item => item.dispose());
  }

  static fromConfig({ options, plugins }, pluginList) {
    console.log(options, plugins);
    const layer = new this(options);
    // const layer = new [options.name](options);
    if (plugins)
      layer.addPlugin(
        ...plugins.map(pluginInfo => {
          const plugin = new pluginList[pluginInfo.type](pluginInfo.options);
          return plugin;
        })
      );
    return layer;
  }

  addPlugin(plugin) {
    this.#plugins.push(plugin);
    if (plugin.init) plugin.init(this);
    return plugin;
  }

  draw(information) {
    if (this.clear) this.clear();

    const sorted_plugins = this.#plugins.sort((a, b) => a.zindex - b.zindex);
    sorted_plugins.forEach(plugin => {
      if (plugin.draw) plugin.draw(information);
    });
  }
}
