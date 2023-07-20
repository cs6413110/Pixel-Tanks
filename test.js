function toPoint(angle) {
    const theta = (-angle) * Math.PI / 180;
    const y = Math.cos(theta);
    const x = Math.sin(theta);
 
    if (x === 0) {
      return { x: 0, y: y / Math.abs(y) };
    } else {
      return { x: x / Math.abs(x), y: y / Math.abs(x) };
    }
  }
const tests = [0, 45, 90, 135, 180, 225, 270, 315];
for (const t of tests) console.log(t+': '+toPoint(t).x+', '+toPoint(t).y);