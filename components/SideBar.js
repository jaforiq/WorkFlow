import { createSwitchNode } from "./SwitchNode.js";
import { initEdgeManager } from "./EdgeManager.js";
import { createChatMessageNode } from "./ChatMessage.js";
import { createOllamaModelNode } from "./OllamaModel.js";
initEdgeManager();

const sidebar = document.getElementById("sidebar");
const zoomContent = document.getElementById("zoom-content");

const chatCard = document.getElementById("chatCard");
chatCard.onclick = () => {
  createChatMessageNode(
    zoomContent,
    100 + Math.random() * 200,
    100 + Math.random() * 200
  );
};

const switchCard = document.getElementById("switchCard");
switchCard.onclick = () => {
  createSwitchNode(
    zoomContent,
    200 + Math.random() * 200,
    200 + Math.random() * 200
  );
};

const ollamaCard = document.getElementById("ollamaCard");
ollamaCard.onclick = () => {
  createOllamaModelNode(
    zoomContent,
    300 + Math.random() * 200,
    300 + Math.random() * 200
  );
};
