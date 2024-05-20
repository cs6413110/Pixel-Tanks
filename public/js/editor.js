window.oncontextmenu = () => false;

const canvas = document.createElement('canvas'), draw = canvas.getContext('2d'), importer = document.createElement('input'), output = document.createElement('div'), coords = document.createElement('div'), select = document.createElement('div'), porter = document.createElement('BUTTON');
document.body.innerHTML += '<h1>Pixel Tanks Level Editor</h1>';
canvas.width = 600;
canvas.height = 600;
canvas.tabIndex = 1;
document.body.appendChild(coords);
document.body.appendChild(output);
document.body.appendChild(canvas);
document.body.appendChild(select);
document.body.appendChild(importer);
document.body.appendChild(porter);
const button_key = {
  'B0': 'Eraser',
  'B1': 'Weak Block',
  'B2': 'Strong Block',
  'B3': 'Gold Block',
  'B4': 'Barrier Block',
  'B5': 'Void Block',
  'A0': 'Turret',
  'A1': 'Attacking AI',
  'A2': 'Supporting AI',
  'A3': 'Defending AI',
  'A4': 'Class Ability AI',
  'S': 'Global Player Spawn',
  'A': 'Spawn A',
  'B': 'Spawn B',
  '@': 'Spike',
};
const image_key = {
  'B0': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAABCAQAAAB0m0auAAAADElEQVR42mNkIBIAAABSAAI2VLqiAAAAAElFTkSuQmCC',
  'B1': 'blocks/weak',
  'B2': 'blocks/strong',
  'B3': 'blocks/gold',
  'B4': 'blocks/barrier',
  'B5': 'blocks/void',
  'B6': 'blocks/barrel',
  'B7': 'blocks/halfbarrier',
  'A0': 'tanks/base',
  'A1': 'tanks/base',
  'A2': 'tanks/base',
  'A3': 'tanks/base',
  'A4': 'tanks/base',
  'S': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAH0lEQVR42mNk+C/xn4GKgHHUwFEDRw0cNXDUwJFqIABtgCnNTYQqZgAAAABJRU5ErkJggg==',
  'A': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAHklEQVR42mP8z8AARNQDjKMGjho4auCogaMGjlQDAUwCJ+0NBcXlAAAAAElFTkSuQmCC',
  'B': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAH0lEQVR42mNkkPj/n4GKgHHUwFEDRw0cNXDUwJFqIABbdCnNVZ8NSQAAAABJRU5ErkJggg==',
  '@': 'blocks/spike',
};

let world = [];
for (let y = 0; y < 30; y++) {
  world[y] = [];
  for (let x = 0; x < 30; x++) world[y][x] = 'B0';
}

let current = 'B0';
for (const id in button_key) {
  const button = document.createElement('BUTTON');
  button.innerHTML = button_key[id];
  button.addEventListener('click', e => {
    current = id;
    document.querySelectorAll('button').forEach(e => {
      e.style.border = 'none';
    });
    button.style.border = '5px solid black';
  });
  select.appendChild(button);
}
for (const i in image_key) {
  const src = image_key[i];
  image_key[i] = new Image();
  image_key[i].src = src.includes('data') ? src : 'https://cs6413110.github.io/Pixel-Tanks/public/images/'+src+'.png';
}

let x, y;
canvas.addEventListener('mousemove', (e) => {
  x = e.offsetX;
  y = e.offsetY;
  coords.innerHTML = x+', '+y;
});
let drawLoop;
canvas.addEventListener('mousedown', (e) => {
  clearInterval(drawLoop);
  drawer(e);
  drawLoop = setInterval(drawer, 10, e);
});
window.addEventListener('mouseup', (e) => {
  clearInterval(drawLoop);
});

const drawer = (e) => {
  if (x > 0 && y > 0 && x < 600 && y < 600) {
    world[Math.floor(y/20)][Math.floor(x/20)] = e.button === 0 ? current : 'B0';
    output.innerHTML = JSON.stringify(world);
  }
}

const port = () => {
  try {
    world = JSON.parse(importer.value);
  } catch(e) {alert('Error Parsing Level Code')}
}

const render = () => {
  draw.clearRect(0, 0, 600, 600);
  draw.strokeStyle = '#000000';
  for (let i = 1; i < 30; i++) {
    draw.beginPath();
    draw.moveTo(i*20, 0);
    draw.lineTo(i*20, 600);
    draw.stroke();
    draw.beginPath();
    draw.moveTo(0, i*20);
    draw.lineTo(600, i*20);
    draw.stroke();
  }
  for (const y in world) {
    for (const x in world[y]) {
      draw.drawImage(image_key[world[y][x]], x*20, y*20, 20, 20);
    }
  }
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
