// Plus Button logic
const plusBtn = document.getElementById("plusBtn");

plusBtn.onclick = (e) => {
  e.stopPropagation();
  sidebar.style.right = sidebar.style.right === "0px" ? "-25vw" : "0px";
};
document.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && e.target !== plusBtn) {
    sidebar.style.right = "-25vw";
  }
});

// Zoom and Background Dots Logic
const main = document.getElementById("main");
const zoomContent = document.getElementById("zoom-content");
const edgesSvg = document.getElementById("edges-svg");
let scale = 1;

const dotsBg = document.getElementById("dots-bg");
const resetZoomBtn = document.getElementById("resetZoomBtn");
let dotSpacing = 20;
const defaultDotSpacing = 20;

function updateDotSpacing() {
  dotsBg.style.backgroundSize = `${dotSpacing}px ${dotSpacing}px`;
  if (dotSpacing !== defaultDotSpacing) {
    resetZoomBtn.style.display = "";
  } else {
    resetZoomBtn.style.display = "none";
  }
}

function applyZoom() {
  zoomContent.style.transform = `scale(${scale})`;
  zoomContent.style.transformOrigin = "0 0";
  edgesSvg.style.transform = `scale(${scale})`;
  edgesSvg.style.transformOrigin = "0 0";
}

document.getElementById("zoomInBtn").onclick = () => {
  dotSpacing = Math.min(dotSpacing + 2, 60);
  scale = Math.min(scale + 0.1, 2);
  applyZoom();
  updateDotSpacing();
};

document.getElementById("zoomOutBtn").onclick = () => {
  dotSpacing = Math.max(dotSpacing - 2, 6);
  scale = Math.max(scale - 0.1, 0.5);
  applyZoom();
  updateDotSpacing();
};

document.getElementById("fitViewBtn").onclick = () => {
  dotSpacing = defaultDotSpacing;
  scale = 1;
  applyZoom();
  updateDotSpacing();
};

resetZoomBtn.onclick = () => {
  dotSpacing = defaultDotSpacing;
  scale = 1;
  applyZoom();
  updateDotSpacing();
};

updateDotSpacing();
