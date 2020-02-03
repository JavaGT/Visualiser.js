import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import Layer from './Layer.js'

export default class Layer3D extends Layer {
  constructor({width, height}){
    const camera = new THREE.PerspectiveCamera(75, width/height)
    camera.position.z = 10;
    super({width, height, camera})
  }
}
