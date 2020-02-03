export default function LinearGradient({context, x1, y1, x2, y2, stops}){
  const gradient = context.createLinearGradient(x1, y1, x2, y2);
  stops.forEach(stop=>{
    gradient.addColorStop(stop.position, stop.color);
  })
  return gradient
}
