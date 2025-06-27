let edges = [];
let edgeIdCounter = 1;
let edgeStart = null;
let svg = null;
let main = null;

export function initEdgeManager() {
  main = document.getElementById("main");
  svg = document.getElementById("edges-svg");

  if (!svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", "edges-svg");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.zIndex = "5";
    svg.style.pointerEvents = "none";
    main.prepend(svg);
  }
}

export function handleHandleClick(e) {
  const handle = e.currentTarget;
  const nodeId = handle.dataset.nodeId;
  const handleType = handle.dataset.handleType;

  if (handleType === "source") {
    edgeStart = { nodeId, handleEl: handle };
    svg.style.pointerEvents = "auto";
    svg.addEventListener("mousemove", drawEdgePreview);
    svg.addEventListener("click", cancelEdgePreview);
  } else if (handleType === "target" && edgeStart) {
    if (edgeStart.nodeId !== nodeId) {
      edges.push({
        id: "edge-" + edgeIdCounter++,
        sourceNode: edgeStart.nodeId,
        targetNode: nodeId,
      });
    }
    edgeStart = null;
    svg.removeEventListener("mousemove", drawEdgePreview);
    svg.removeEventListener("click", cancelEdgePreview);
    drawEdges();
  }
  e.stopPropagation();
}

function drawEdgePreview(e) {
  drawEdges(e);
}

function cancelEdgePreview() {
  edgeStart = null;
  svg.removeEventListener("mousemove", drawEdgePreview);
  svg.removeEventListener("click", cancelEdgePreview);
  drawEdges();
}

function getHandleCenter(handle) {
  const rect = handle.getBoundingClientRect();
  const mainRect = main.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - mainRect.left,
    y: rect.top + rect.height / 2 - mainRect.top,
  };
}

export function drawEdges(mouseEvent) {
  if (!svg) return;

  svg.innerHTML = "";

  edges.forEach((edge) => {
    const sourceHandle = document.querySelector(
      `[data-node-id='${edge.sourceNode}'][data-handle-type='source']`
    );
    const targetHandle = document.querySelector(
      `[data-node-id='${edge.targetNode}'][data-handle-type='target']`
    );

    if (sourceHandle && targetHandle) {
      const p1 = getHandleCenter(sourceHandle);
      const p2 = getHandleCenter(targetHandle);

      const c1 = { x: p1.x + 50, y: p1.y };
      const c2 = { x: p2.x - 50, y: p2.y };

      const d = `M${p1.x},${p1.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`;
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", d);
      path.setAttribute("stroke", "#aaa");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("fill", "none");
      path.setAttribute("data-edge-id", edge.id);
      path.addEventListener("mouseenter", () =>
        showDeleteButton(edge, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2)
      );
      svg.appendChild(path);

      const dx = 3 * (p2.x - c2.x);
      const dy = 3 * (p2.y - c2.y);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      const size = 12;
      const offset = 10;

      const points = [
        [0, 0],
        [size, size / 2],
        [0, size],
      ]
        .map((p) => p.join(","))
        .join(" ");

      const triangle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      triangle.setAttribute("points", points);
      triangle.setAttribute("fill", "#aaa");

      triangle.setAttribute(
        "transform",
        `translate(${p2.x - offset},${p2.y - size / 2})`
      );
      svg.appendChild(triangle);
    }
  });

  if (edgeStart && mouseEvent) {
    const sourceHandle = edgeStart.handleEl;
    const p1 = getHandleCenter(sourceHandle);
    const p2 = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
    const d = `M${p1.x},${p1.y} C${p1.x + 50},${p1.y} ${p2.x - 50},${p2.y} ${
      p2.x
    },${p2.y}`;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("stroke", "#aaa");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-dasharray", "4");
    svg.appendChild(path);
  }

  updateTargetHandles();
}

function showDeleteButton(edge, x, y) {
  let btn = document.getElementById("edge-delete-btn");
  if (!btn) {
    btn = document.createElement("div");
    btn.id = "edge-delete-btn";
    btn.style.position = "absolute";
    btn.style.width = "24px";
    btn.style.height = "24px";
    btn.style.background = "#ff4d4f";
    btn.style.color = "white";
    btn.style.borderRadius = "50%";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    btn.style.fontWeight = "bold";
    btn.style.fontSize = "16px";
    btn.style.border = "2px solid white";
    btn.style.zIndex = "100";
    btn.style.pointerEvents = "auto";
    btn.title = "Delete edge";
    btn.innerText = "X";
    btn.onclick = function (e) {
      edges = edges.filter((ed) => ed.id !== edge.id);
      btn.remove();
      drawEdges();
      e.stopPropagation();
    };
    main.appendChild(btn);
  }
  btn.style.left = x - 12 + "px";
  btn.style.top = y - 12 + "px";
  btn.style.display = "flex";

  svg.onmouseleave = () => {
    if (btn) btn.style.display = "none";
  };
}

export function removeNodeEdges(nodeId) {
  edges = edges.filter(
    (edge) => edge.sourceNode !== nodeId && edge.targetNode !== nodeId
  );
  drawEdges();
}

export function updateTargetHandles() {
  document.querySelectorAll('[data-handle-type="target"]').forEach((handle) => {
    handle.classList.remove("edge-targeted");
    const triangle = handle.querySelector(".triangle");
    if (triangle) triangle.remove();
  });

  edges.forEach((edge) => {
    const targetHandle = document.querySelector(
      `[data-node-id='${edge.targetNode}'][data-handle-type='target']`
    );
    if (targetHandle && !targetHandle.querySelector(".triangle")) {
      const triangle = document.createElement("div");
      triangle.className = "triangle";
      triangle.style.width = "0";
      triangle.style.height = "0";
      triangle.style.top = "-10px";
      triangle.style.left = "50%";
      triangle.style.position = "absolute";
      triangle.style.transform = "translateX(-50%)";
      triangle.style.borderLeft = "8px solid transparent";
      triangle.style.borderRight = "8px solid transparent";
      targetHandle.appendChild(triangle);
      targetHandle.classList.add("edge-targeted");
    }
  });
}
