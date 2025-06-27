import { createSwitchNode } from "./SwitchNode.js";
import { initEdgeManager } from "./EdgeManager.js";
import { createChatMessageNode } from "./ChatMessage.js";
import { createOllamaModelNode } from "./OllamaModel.js";
initEdgeManager();

const plusBtn = document.getElementById("plusBtn");
const sidebar = document.getElementById("sidebar");
const chatCard = document.getElementById("chatCard");
const main = document.getElementById("main");

plusBtn.onclick = (e) => {
  e.stopPropagation();
  sidebar.style.right = sidebar.style.right === "0px" ? "-25vw" : "0px";
};
document.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && e.target !== plusBtn) {
    sidebar.style.right = "-25vw";
  }
});

chatCard.onclick = () => {
  createChatMessageNode(
    main,
    100 + Math.random() * 200,
    100 + Math.random() * 200
  );
};

const switchCard = document.getElementById("switchCard");
switchCard.onclick = () => {
  createSwitchNode(main, 200 + Math.random() * 200, 200 + Math.random() * 200);
};

const ollamaCard = document.getElementById("ollamaCard");
ollamaCard.onclick = () => {
  createOllamaModelNode(
    main,
    300 + Math.random() * 200,
    300 + Math.random() * 200
  );
};
