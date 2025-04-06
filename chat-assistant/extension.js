const vscode = require('vscode');
const fetch = require('node-fetch');

function activate(context) {
  const provider = new ChatViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('chatAssistantView', provider)
  );
}

class ChatViewProvider {
  constructor(extensionUri) {
    this.extensionUri = extensionUri;
    this._view = null;
  }

  resolveWebviewView(webviewView) {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this.getHtml();

    webviewView.webview.onDidReceiveMessage(async (message) => {
      const userPrompt = message.text;
      const response = await this.queryOllama(userPrompt);
      webviewView.webview.postMessage({ type: 'response', text: response });
    });
  }

  async queryOllama(prompt) {
    try {
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'tinyllama',
          prompt,
          stream: false
        })
      });

      const data = await res.json();
      return data.response || '[No response]';
    } catch (err) {
      return 'Error contacting Ollama locally: ' + err.message;
    }
  }

  getHtml() {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><style>
        body { font-family: sans-serif; padding: 1rem; }
        #output { border: 1px solid #ccc; height: 150px; overflow-y: auto; margin-bottom: 1rem; }
        textarea { width: 100%; height: 50px; }
        button { margin-top: 0.5rem; padding: 5px 10px; }
      </style></head>
      <body>
        <div id="output">Assistant will reply here...</div>
        <textarea id="input" placeholder="Ask something..."></textarea>
        <button onclick="send()">Send</button>
        <script>
          const vscode = acquireVsCodeApi();
          function send() {
            const input = document.getElementById('input').value;
            document.getElementById('output').innerHTML += '<div><strong>You:</strong> ' + input + '</div>';
            vscode.postMessage({ text: input });
          }

          window.addEventListener('message', (event) => {
            const message = event.data;
            if (message.type === 'response') {
              document.getElementById('output').innerHTML += '<div><strong>Assistant:</strong> ' + message.text + '</div>';
            }
          });
        </script>
      </body>
      </html>
    `;
  }
}

function deactivate() {}

module.exports = { activate, deactivate };
