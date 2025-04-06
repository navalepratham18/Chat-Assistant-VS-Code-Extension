const vscode = require('vscode');
const fetch = require('node-fetch'); // Make sure this is installed with `npm install node-fetch`

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
            font-family: "Segoe UI", sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            height: 100vh;
            background-color:rgb(46, 46, 46);
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
            border-radius: 10px;
            white-space: pre-wrap;
          }
          .user {
            align-self: flex-end;
            background-color: #007acc;
            color: white;
          }
          .assistant {
            align-self: flex-start;
            background-color: #e5e5ea;
            color: black;
          }
          #input-area {
            padding: 0.5rem;
            display: flex;
            gap: 0.5rem;
            border-top: 1px solid #ccc;
            background-color: #fff;
          }
          #input {
            flex: 1;
            padding: 0.5rem;
            font-size: 1rem;
          }
          button {
            padding: 0.5rem 1rem;
            background-color: #007acc;
            color: white;
            border: none;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div id="chat"></div>
        <div id="input-area">
          <input type="text" id="input" placeholder="Ask something..." />
          <button onclick="send()">Send</button>
        </div>

        <script>
          const vscode = acquireVsCodeApi();
          const chat = document.getElementById('chat');
          const input = document.getElementById('input');

          function appendMessage(text, sender) {
            const message = document.createElement('div');
            message.className = 'message ' + sender;
            message.textContent = text;
            chat.appendChild(message);
            chat.scrollTop = chat.scrollHeight;
          }

          function send() {
            const value = input.value.trim();
            if (!value) return;
            appendMessage(value, 'user');
            vscode.postMessage({ command: 'ask', text: value });
            input.value = '';
          }

          window.addEventListener('message', (event) => {
            const message = event.data;
            if (message.type === 'response') {
              appendMessage(message.text, 'assistant');
            }
          });
        </script>
      </body>
      </html>
    `;
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
