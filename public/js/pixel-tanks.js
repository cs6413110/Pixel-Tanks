['msgpackr', 'pathfinding', 'engine', 'client'].forEach(url => {
  const script = document.createElement('SCRIPT');
  script.src = 'https://cs6413110.github.io/Pixel-Tanks/public/js/'+url+'.js';
  document.head.appendChild(script);
});
