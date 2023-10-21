const shapes = ['hexagon', 'circle', 'trapeze', 'rect-hor', 'rect-ver'];
const storage = localStorage.getItem("configframe");
if (storage) {
  document.getElementById(storage).classList.add('selected-shape');
}

shapes.forEach( item => {
  document.getElementById(item).addEventListener("click", () => {
    playWithStorage("frame", item);
    highlightShape(item);
  });
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

function saveThis() {
  window.location.href = "./canvas/index.html";

}