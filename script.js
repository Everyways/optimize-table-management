document.getElementById("hexagon").addEventListener("click", () => {
  playWithStorage("frame", "hexagon");
});
document.getElementById("circle").addEventListener("click", () => {
  playWithStorage("frame", "circle");
});
document.getElementById("trapeze").addEventListener("click", () => {
  playWithStorage("frame", "trapeze");
});
document.getElementById("rect-hor").addEventListener("click", () => {
  playWithStorage("frame", "rect-hor");
});
document.getElementById("rect-ver").addEventListener("click", () => {
  playWithStorage("frame", "rect-ver");
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

