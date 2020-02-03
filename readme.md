# Visualiser.js
An audio visualiser interface & plugin system.

#### Readme todo
- Tutorial to make a plugin
- Actual documentation of classes

## How to use
Visualiser.js is an ES6 Module, so you can
```
import Visualiser from './visualiser/Visualiser.js'
const visualiser = new Visualiser({width: 1920, height: 1080})
```
and you're almost up and running!
### Layers
Visualiser.js runs plugins (think 'visual components') on layers (think like photoshop). These layers have to be defined as 2D or 3D content and is done like so
```
import { default as Visualiser, Layer2D, Layer3D } from './visualiser/Visualiser.js'
import Bar from './plugins/Bar.js'

const width = 1920
const height = 1080

const visualiser = new Visualiser({width, height})

const layer = new Layer2D({width, height})
visualiser.addLayer(layer)

const bar = new Bar({width, height, color: '#FF897E'})
layer.addPlugin(bar)
```
### Rendering
Now you have a visualiser that will actually make something when fed an audio source, but first it must be added to the page
```
document.body.appendChild(visualiser.canvas)
```
and fed some audio!
```
const audioElement = document.createElement('audio')
const source = visualiser.audioElementToSource(audioElement);
visualiser.connectAudioSource(source);
audioElement.src = 'audio.webm'
audioElement.play()
```
but you might notice the nothing happens, this is due to the web browser blocking auto-playing audio. This is a great thing but means we must wait for user interaction using window.addEventListener
### All together now!

```
<script type="module">
  import { default as Visualiser, Layer2D, Layer3D } from './visualiser/Visualiser.js'
  import Bar from './plugins/Bar.js'

  const width = 1920
  const height = 1080
  const audioPath = 'audio.webm'

  window.addEventListener('click', ()=>{

    const visualiser = new Visualiser({width, height})

    const layer = new Layer2D({width, height})
    visualiser.addLayer(layer)

    const bar = new Bar({width, height, color: '#FF897E'})
    layer.addPlugin(bar)  

    document.body.appendChild(visualiser.canvas)

    const audioElement = document.createElement('audio')
    const source = visualiser.audioElementToSource(audioElement);
    visualiser.connectAudioSource(source);
    audioElement.src = audioPath
    audioElement.play()
    visualiser.start()

  }, {once: true})
</script>
```
