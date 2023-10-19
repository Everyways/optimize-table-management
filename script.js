shapes = ['hexagon', 'circle', 'trapeze', 'rect-hor', 'rect-ver'];

shapes.forEach( item => {
  document.getElementById(item).addEventListener("click", () => {
    playWithStorage("frame", item);
    highlightShape(item);
  });
});

document.getElementById("table").addEventListener("change", (event) => {
  playWithStorage("table", event.target.value);
});
document.getElementById("seat").addEventListener("change", (event) => {
  playWithStorage("seat", event.target.value);
});

function playWithStorage(index, item) {
    localStorage.setItem('config'+index, item);
}

function highlightShape(shape) {
  shapes.forEach( item => {
    document.getElementById(item).classList.remove('selected-shape');
  });
  
  if (!document.getElementById(shape).classList.contains('selected-shape')) {
    document.getElementById(shape).classList.add('selected-shape');
  } 
}