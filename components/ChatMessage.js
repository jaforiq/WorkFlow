import {
  handleHandleClick,
  drawEdges,
  removeNodeEdges,
} from "./EdgeManager.js";

export function createChatMessageNode(container, startX = 500, startY = 300) {
  const nodeId = "node-" + Date.now() + "-" + Math.floor(Math.random() * 10000);

  const wrapper = document.createElement("div");
  wrapper.className = "draggable";
  wrapper.style.left = startX + "px";
  wrapper.style.top = startY + "px";
  wrapper.style.zIndex = 10;
  wrapper.dataset.nodeId = nodeId;

  const node = document.createElement("div");
  node.className =
    "group w-[110px] h-[100px] rounded-[60px_16px_16px_60px] bg-[#3b3a3a] border-2 border-gray-400 flex flex-col items-center justify-center relative shadow transition-all";
  node.style.boxShadow = "0 0 0 0px #7a7a78";
  node.style.transition = "all 0.2s";
  node.style.zIndex = "20";
  node.tabIndex = 0;

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "X";
  deleteBtn.title = "Delete node";
  deleteBtn.className =
    "absolute -top-10 left-1/2 -translate-x-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-red-500 text-white border-2 border-white shadow z-50 font-bold text-lg opacity-0 group-hover:opacity-100 transition";
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    removeNodeEdges(nodeId);
    wrapper.remove();
  };
  deleteBtn.addEventListener("mousedown", (e) => e.stopPropagation());
  node.appendChild(deleteBtn);

  // Icon
  const img = document.createElement("img");
  img.src =
    "https://download.logo.wine/logo/WeChat/WeChat-Icon-Light-Grey-Logo.wine.png";
  img.alt = "Chat";
  img.className = "w-[65px] h-[65px] mb-2 rounded-full";
  node.appendChild(img);

  // Label
  const label = document.createElement("div");
  label.className =
    "absolute top-full left-0 w-full text-center mt-1 font-bold text-white text-lg leading-tight pointer-events-none";
  label.style.minHeight = "2.4em";
  label.style.maxHeight = "2.4em";
  label.innerHTML = "When Chat<br>Message Received";
  node.appendChild(label);

  const rightHandle = document.createElement("div");
  rightHandle.className =
    "absolute right-[-10px] top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-400 border-2 border-gray-400 rounded-full flex items-center justify-center z-10 cursor-pointer hover:bg-red-500 transition";
  rightHandle.dataset.nodeId = nodeId;
  rightHandle.dataset.handleType = "source";
  rightHandle.addEventListener("click", handleHandleClick);
  node.appendChild(rightHandle);

  wrapper.appendChild(node);
  container.appendChild(wrapper);

  // Drag logic
  let isDragging = false,
    offsetX = 0,
    offsetY = 0;

  function onMouseMove(e) {
    if (!isDragging) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    const main = container;
    x = Math.max(0, Math.min(main.offsetWidth - 120, x));
    y = Math.max(0, Math.min(main.offsetHeight - 120, y));
    wrapper.style.left = x + "px";
    wrapper.style.top = y + "px";
    drawEdges();
  }

  function onMouseUp() {
    if (isDragging) {
      isDragging = false;
      wrapper.style.zIndex = 10;
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
  }

  wrapper.addEventListener("mousedown", function (e) {
    if (e.target === deleteBtn) return;
    isDragging = true;
    offsetX = e.clientX - wrapper.offsetLeft;
    offsetY = e.clientY - wrapper.offsetTop;
    wrapper.style.zIndex = 1000;
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  // Selection logic
  node.addEventListener("click", function (e) {
    e.stopPropagation();
    document.querySelectorAll(".selected-chat-node").forEach((el) => {
      el.classList.remove("selected-chat-node");
      el.style.background = "#3b3a3a";
      el.style.boxShadow = "0 0 0 0px #7a7a78";
    });
    node.classList.add("selected-chat-node");
    node.style.background = "#2b2b2a";
    node.style.boxShadow = "0 0 0 8px #7a7a78";
  });

  if (!window._workflowDeselectListenerAdded) {
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".draggable")) {
        document.querySelectorAll(".selected-chat-node").forEach((el) => {
          el.classList.remove("selected-chat-node");
          el.style.background = "#3b3a3a";
          el.style.boxShadow = "0 0 0 0px #7a7a78";
        });
      }
    });
    window._workflowDeselectListenerAdded = true;
  }
}
