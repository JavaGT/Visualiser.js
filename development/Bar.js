import Plugin from './visualiser/plugins/Plugin.js'

export default class Bar extends Plugin {
  #context
  #options = {
    width: 1280,
    height: 720
  }
  get options(){
    return this.#options
  }
  constructor(options){
    super(options)
    Object.assign(this.#options, options)
  }
  init({context}){
    this.#context = context
  }
  draw({data}){
    this.#context.fillStyle = this.#options.color
    this.#context.fillRect(0,0,this.#options.width, Math.max(...data))
  }
}
