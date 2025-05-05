const vscode = require('vscode');
const fetch = require('node-fetch'); 

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const provider = new ChatViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("chatAssistantView", provider)
  );
}

class ChatViewProvider {
  constructor(extensionUri) {
    this.extensionUri = extensionUri;
    this.panel = null;
  }

  resolveWebviewView(webviewView) {
    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = this.getHtml();

    webviewView.webview.onDidReceiveMessage(async (message) => {
      if (message.command === 'ask') {
        const question = message.text;

        try {
          const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'tinyllama',
              prompt: question,
              stream: false
            })
          });

          const data = await response.json();
          webviewView.webview.postMessage({ type: 'response', text: data.response });
        } catch (err) {
          webviewView.webview.postMessage({ type: 'response', text: 'Error: ' + err.message });
        }
      }
    });
  }

  getHtml() {
    return `
      <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8">
      <style>
        body {
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          height: 100vh;
          font-family: "Segoe UI", sans-serif;
          background-color: #1e1e1e;
          color: #ffffff;
        }

        #chat {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message {
          max-width: 80%;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          white-space: pre-wrap;
          word-wrap: break-word;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          animation: fadeIn 0.2s ease-in-out;
        }

        .user {
          align-self: flex-end;
          background-color: #007acc;
          color: white;
        }

        .assistant {
          align-self: flex-start;
          background-color: #2d2d30;
          color: #dcdcdc;
        }

        #loading {
          align-self: flex-start;
          background-color: #2d2d30;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          display: flex;
          gap: 5px;
          align-items: center;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #dcdcdc;
          animation: blink 1.4s infinite both;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes blink {
          0%, 80%, 100% {
            opacity: 0;
          }

          40% {
            opacity: 1;
          }
        }

        #input-area {
          padding: 0.75rem;
          display: flex;
          gap: 0.5rem;
          margin: 10px 20px 10px 20px;
          border-radius: 20px;
          border-top: 1px solid #3c3c3c;
          background-color: #2c2c2c;
        }

        #input {
          flex: 1;
          display: flex;
          padding: 0.6rem;
          margin-left: 7px;
          margin-right: 7px;
          font-size: 14px;
          border-radius: 6px;
          border: none;
          background-color: #2c2c2c;
          color: white;
        }

        #input::placeholder {
          color: #b0abab;
        }

        button {
          padding: 0.6rem 1rem;
          background-color: #dae2e6;
          color: rgb(0, 0, 0);
          border: none;
          border-radius: 15px;
          cursor: pointer;
          font-weight: bold;
          margin-right: 7px;
        }

        button:hover {
          background-color: #a2a2a2;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        #footer {
          text-align: center;
          font-size: 13px;
          font-weight: bold;
          color: #c0c0c0;
          padding: 2px 0 15px 0;
          margin-bottom: 10px;
          margin-top: 3px;
        }
      </style>
    </head>

    <body>
      <div id="chat"></div>

      <div id="input-area">
        <input type="text" id="input" placeholder="Ask something..." />
        <button onclick="send()">Send</button>
      </div>

      <div id="footer">Project by Team NooBs</div>

      <script>
        const vscode = acquireVsCodeApi();
        const chat = document.getElementById('chat');
        const input = document.getElementById('input');
        let loadingElem = null;

        function appendMessage(text, sender) {
          const message = document.createElement('div');
          message.className = 'message ' + sender;
          message.textContent = text;
          chat.appendChild(message);
          chat.scrollTop = chat.scrollHeight;
        }

        function showLoading() {
          loadingElem = document.createElement('div');
          loadingElem.id = 'loading';
          loadingElem.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
          chat.appendChild(loadingElem);
          chat.scrollTop = chat.scrollHeight;
        }

        function hideLoading() {
          if (loadingElem) {
            loadingElem.remove();
            loadingElem = null;
          }
        }

        function send() {
          const value = input.value.trim();
          if (!value) return;
          appendMessage(value, 'user');
          input.value = '';

          showLoading();
          vscode.postMessage({ command: 'ask', text: value });
        }

        window.addEventListener('message', (event) => {
          const message = event.data;
          if (message.type === 'response') {
            hideLoading();
            appendMessage(message.text, 'assistant');
          }
        });
      </script>
    </body>

    </html>

    `;
  }
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
};
