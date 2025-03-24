const getMessages = async () => {
  const response = await fetch("https://chat.calicheoficial.lat/messages");
  const data = await response.json();
  return data;
};

const showMessages = async (arrayMessages) => {
  const messageContainer = document.getElementById("message-container");
  messageContainer.innerHTML = "";
  arrayMessages.forEach((message) => {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message";
    const userSpan = document.createElement("span");
    userSpan.className = "user";
    userSpan.textContent = message.user + ": ";
    const textSpan = document.createElement("span");
    textSpan.className = "text";
    textSpan.textContent = message.text;
    messageDiv.append(userSpan);
    messageDiv.append(textSpan);
    messageContainer.append(messageDiv);
  });
};

const loadingScreen = () => {
  const loadingScreenContainer = document.createElement("div");
  loadingScreenContainer.className = "loading-screen";

  const spinner = document.createElement("div");
  spinner.className = "spinner";

  const loadingText = document.createElement("p");
  loadingText.className = "loading-text";
  loadingText.textContent = "Cargando mensajes...";

  loadingScreenContainer.appendChild(spinner);
  loadingScreenContainer.appendChild(loadingText);
  return loadingScreenContainer;
};

const scrollToBottom = () => {
  const container = document.getElementById("message-container");
  const items = container.querySelectorAll("div");
  if (items.length > 0) {
    const lastItem = items[items.length - 1];
    lastItem.scrollIntoView({ behavior: "instant", block: "center" });
  }
};

const createEnviroment = (id) => {
  const container = document.createElement("div");
  container.id = id;
  container.className = "container";
  const subContainer = document.createElement("div");
  subContainer.className = "subcontainer";
  const messageContainer = document.createElement("div");
  messageContainer.id = "message-container";
  messageContainer.className = "message-container";
  const writeContainer = document.createElement("div");
  writeContainer.id = "write-container";
  writeContainer.className = "write-container";
  const inputMessage = document.createElement("input");
  inputMessage.className = "input-message";
  inputMessage.id = "input-message";
  inputMessage.placeholder = "Escribe un mensaje";
  inputMessage.maxLength = 140;
  const sendButton = document.createElement("button");
  sendButton.className = "send-button";
  sendButton.id = "send-button";
  sendButton.innerText = "Enviar";
  writeContainer.append(inputMessage);
  writeContainer.append(sendButton);
  subContainer.append(messageContainer);
  subContainer.append(writeContainer);
  container.append(subContainer);
  document.body.append(container);
  const styles = document.createElement("style");
  styles.textContent = `
        *{
        font-family: Roboto;
        margin: 0;
        padding: 0;
        }    

        .loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        }
        
        .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 15px;
        }
        
        @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
        }

        body{
        background-color: #aab6c1;
        }

        .container{
        height: 100dvh;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        }

        .subcontainer{
        background-color: #fff;
        width: 80%;
        height: 85%;
        display:flex;
        flex-flow: column;
        gap: 20px;
        justify-content: center;
        align-items: center;
        padding: 22px;
        border: 1px solid #ddd;
        border-radius: 25px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.4);
        }
        
        .message-container {
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        scroll-behavior: smooth;
        flex: 15;
        }

        .write-container{
        width: 100%;
        flex: 1;
        display: flex;
        gap: 25px;
        }

        .input-message{
        flex: 3;
        font-size: 1rem;
        padding: 10px;
        border-radius: 12px;
        border: solid 2px #555;
        }

        .send-button{
        flex: 1;
        border-radius: 12px;
        border: solid 2px #0066cc;
        color: #0066cc;
        font-weight: bold;
        font-size: 1rem;
        background-color: #fff;
        }
        
        .message {
        margin-bottom: 10px;
        padding: 8px;
        margin: 8px;
        border-bottom: 1px solid #eee;
        }
        
        .user {
        font-weight: bold;
        color: #0066cc;
        }
        
        .text {
        color: #333;
        }
        
        
    `;
  document.head.append(styles);
  messageContainer.append(loadingScreen());
};

const setContent = async () => {
  try {
    createEnviroment("container");
    const messages = await getMessages();
    showMessages(messages);
    scrollToBottom();
  } catch (error) {
    console.log(error);
  }
};

const sendMessage = async () => {
  const inputMessage = document.getElementById("input-message");
  const message = inputMessage.value.trim();
  if (!message) return;
  try {
    const response = await fetch("https://chat.calicheoficial.lat/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: message, user: "Diego Flores" }),
    });

    if (!response.ok) {
      throw new Error("Error al enviar el mensaje");
    }

    inputMessage.value = "";

    const messages = await getMessages();
    showMessages(messages);
    scrollToBottom();
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("send-button").addEventListener("click", sendMessage);
  document.getElementById("input-message").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
});

const refreshMessages = () => {
  setInterval(async () => {
    try {
      const messages = await getMessages();
      showMessages(messages);
      scrollToBottom();
    } catch (error) {
      console.error("Error al actualizar los mensajes:", error);
    }
  }, 10000);
};

setContent().then(refreshMessages);
