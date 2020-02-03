import {
  default as Visualiser,
  Layer2D,
  Layer3D
} from "./visualiser/Visualiser.js";
import Bar from "./Bar.js";

const width = 1280;
const height = 720;
const audioPath = "Disfigure - Blank [NCS Release].webm";

window.addEventListener(
  "click",
  () => {
    const visualiser = new Visualiser({ width, height });

    const layer = new Layer2D({ width, height });
    visualiser.addLayer(layer);

    const bar = new Bar({ width, height, color: "#FF897E" });
    layer.addPlugin(bar);

    document.body.appendChild(visualiser.canvas);

    const audioElement = document.createElement("audio");
    const source = visualiser.audioElementToSource(audioElement);
    visualiser.connectAudioSource(source);
    audioElement.src = audioPath;
    audioElement.play();
    visualiser.start();
  },
  { once: true }
);
