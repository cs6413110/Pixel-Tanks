const key = ['msgpackr', 'pathfinding', 'engine', 'client'];
const loadNext = i => {
  const script = document.createElement('SCRIPT');
  script.src = 'https://cs6413110.github.io/Pixel-Tanks/public/js/'+key[i]+'.js';
  if (i+1 < key.length) script.onload = () => loadNext(i+1);
  document.head.appendChild(script);
  alert('added script with id of '+script.src);
}
loadNext(0);
