import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js";
import Plugin from "./plugins/Plugin.js";
import Layer2D from "./layers/Layer2D.js";
import Layer3D from "./layers/Layer3D.js";

export { THREE, Layer2D, Layer3D, Plugin };

export default class Visualiser {
  // Private, but will be edited in creation
  #options = {
    width: 1280,
    height: 720
  };
  #layers = [];

  // Only edit if you know what you are doing, or curious.
  #smoothingTimeConstant = 0;
  #fftSize = 2 ** 11;

  // private generated by setup
  #renderer;
  #context;
  #analyser;
  #canvas;
  #requestAnimationFrameId;
  #data;
  #drawCallbacks = [];

  time = 0;

  get width() {
    return this.#options.width;
  }
  get height() {
    return this.#options.height;
  }
  get canvas() {
    return this.#canvas;
  }
  get paused() {
    return !this.#requestAnimationFrameId;
  }

  static fromConfig(config, plugins) {
    const { options, layers } = config;
    const visualiser = new Visualiser(options);
    if (layers)
      visualiser.addLayer(
        ...layers.map(layer => {
          const layerType = { Layer2D, Layer3D }[layer.name];
          return layerType.fromConfig(
            { options: layer.options, plugins: layer.plugins },
            plugins
          );
        })
      );
    return visualiser;
  }

  toConfig() {
    return {
      name: this.constructor.name,
      options: this.#options,
      layers: this.#layers.map(layer => layer.toConfig())
    };
  }

  // Take named width and height options on creation
  constructor(options = {}) {
    Object.assign(this.#options, options);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // Clears are to be done manually for layering
    renderer.autoClear = false;
    renderer.setSize(this.#options.width, this.#options.height);
    this.#canvas = renderer.domElement;

    const context = new AudioContext();
    const analyser = context.createAnalyser();
    analyser.fftSize = this.#fftSize;
    analyser.smoothingTimeConstant = this.#smoothingTimeConstant;

    this.#data = new Uint8Array(analyser.frequencyBinCount);
    this.#renderer = renderer;
    this.#context = context;
    this.#analyser = analyser;
  }

  addLayer(...layers) {
    this.#layers.push(...layers);
    this.#layers.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)); // support a zIndex
  }

  connectAudioSource(source) {
    source.connect(this.#analyser);
    source.connect(this.#context.destination);
  }

  disconnectAudioSource(source) {
    source.disconnect(this.#analyser);
    source.disconnect(this.#context.destination);
  }

  audioElementToSource(element) {
    return this.#context.createMediaElementSource(element);
  }

  start() {
    if (!this.#requestAnimationFrameId) this.draw();
  }

  stop() {
    if (this.#requestAnimationFrameId)
      window.cancelAnimationFrame(this.#requestAnimationFrameId);
  }

  onDraw(callback) {
    this.#drawCallbacks.push(callback);
    return function() {
      this.#drawCallbacks = this.#drawCallbacks.filter(x => x != callback);
    };
  }

  draw(timestamp = 0) {
    this.#requestAnimationFrameId = window.requestAnimationFrame(
      this.draw.bind(this)
    );
    const timedelta = this.time - timestamp;

    this.#analyser.getByteTimeDomainData(this.#data);

    const params = {
      data: this.#data,
      timestamp,
      timedelta
    };

    this.#drawCallbacks.forEach(callback => callback(params));

    this.#layers.forEach(layer => {
      layer.draw(params);
      this.#renderer.clearDepth();
      this.#renderer.render(layer.scene, layer.camera);
    });

    this.time = timestamp;
  }
}