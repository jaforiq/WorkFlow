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
      path.setAttribute("pointer-events", "stroke");
      path.addEventListener("mouseenter", () => {
        showDeleteButton(edge, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      });
      svg.appendChild(path);

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
  console.log("Showing delete button at:", x, y);

  let btn = document.getElementById("edge-delete-btn");

  if (!btn) {
    btn = document.createElement("div");
    btn.id = "edge-delete-btn";
    Object.assign(btn.style, {
      width: "24px",
      height: "24px",
      background: "#ff4d4f",
      color: "white",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      fontWeight: "bold",
      fontSize: "16px",
      border: "2px solid white",
      zIndex: "9999",
      pointerEvents: "auto",
      position: "fixed",
      transition: "opacity 0.2s ease-in-out",
    });
    btn.title = "Delete edge";
    btn.innerText = "X";

    btn.onclick = function (e) {
      edges = edges.filter((ed) => ed.id !== edge.id);
      btn.remove();
      drawEdges();
      e.stopPropagation();
    };

    document.body.appendChild(btn);
  }

  const mainRect = main.getBoundingClientRect();
  btn.style.left = mainRect.left + x - 12 + "px";
  btn.style.top = mainRect.top + y - 12 + "px";
  btn.style.display = "flex";

  if (btn.hideTimeout) clearTimeout(btn.hideTimeout);

  btn.onmouseenter = () => {
    clearTimeout(btn.hideTimeout);
  };

  btn.onmouseleave = () => {
    btn.hideTimeout = setTimeout(() => {
      btn.style.display = "none";
    }, 300);
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
