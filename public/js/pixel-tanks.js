const key = ['msgpackr', 'pathfinding', 'engine', 'client'];
const loadNext = i => {
  const script = document.createElement('SCRIPT');
  script.src = 'https://cs6413110.github.io/Pixel-Tanks/public/js/'+key[i]+'.js';
  if (key.length < i+1) script.onload = () => loadNext(i+1);
  document.head.appendChild(script);
}
loadNext(0);
