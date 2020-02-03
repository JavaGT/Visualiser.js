import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import Layer from './Layer.js'

export default class Layer2D extends Layer {
  #context = document.createElement('canvas').getContext('2d')
  #material
  #sprite
  #texture
  type = 'Layer2D'
  constructor({width, height}){
    // magic numbers taken from
    const camera = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, 1, 10 )
    camera.position.z = 10;

    super({width, height, camera})
    this.#context.canvas.width = width
    this.#context.canvas.height = height

    this.#texture = new THREE.CanvasTexture(this.#context.canvas)
    this.#texture.minFilter = THREE.LinearFilter;

    this.#material = new THREE.SpriteMaterial( { map: this.#texture } )

    this.#sprite = new THREE.Sprite( this.#material )
    this.#sprite.scale.set(this.width, this.height, 1)
    this.#sprite.center.set(0, 0)
    this.#sprite.position.set(-this.width / 2, -this.height / 2, 1);

    this.scene.add(this.#sprite)
  }

  get context(){ return this.#context }

  clear(){
    this.#context.restore()
    this.#context.clearRect(0, 0, this.#context.canvas.width, this.#context.canvas.height)
    this.#material.map.needsUpdate = true;
    this.#context.save()
  }
}
