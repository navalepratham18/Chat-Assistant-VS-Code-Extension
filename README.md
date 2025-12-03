# 🤖 Chat Assistant – Your Offline AI Coding Companion

Welcome to **Chat Assistant**, a sleek and intelligent **VS Code extension** that brings local AI-powered conversations to your coding workspace – without needing an internet connection!


---

## ✨ Features

- 🧠 **Local AI Chat**: Interact with a locally hosted LLM (TinyLlama via Ollama).
- 💬 **Chat Interface**: A modern, responsive, and animated chat UI directly inside VS Code.
- 🌙 **Dark Theme**: Smooth, minimal design that blends perfectly with VS Code’s aesthetics.
- 🔒 **Privacy-First**: 100% offline – No API keys, no data sharing.
- 🛠️ **Built for Devs**: Ask questions, get code, and debug your work while staying in your IDE.

---

## 🛠️ Tech Stack

- **VS Code Webview API**
- **JavaScript, HTML, CSS**
- **Ollama** for LLM backend
- **TinyLlama** – A small and fast language model

---

## 🚀 Steps to Run the Extension

1.  **Install Prerequisites**
    *   Install **Node.js** and **Visual Studio Code** on your system.
2.  ```bash
    npm install -g yo generator-code
3.  ```bash
    cd path/to/your/chat-assistant
4.  ```bash
    npm install node-fetch
5.  **Install and Start Ollama**
    *   Download Ollama from its official site.
    ```bash    
    *   ollama pull tinyllama
    *   ollama run tinyllama
6. ```bash
   code .
    
7.  **Run the Extension**
    *   Press **F5**
    *   A new **Extension Development Host** window will open.
        
8.  **Use the Chat Assistant Sidebar**
    *   Open the sidebar tab named **Chat Assistant**
    *   Type your prompt
    *   Click **Send**
    *   The message is processed by **TinyLlama locally**, and the response appears in the UI.

---

## 📁 Project Structure

```plaintext
chat-assistant/
├── .vscode/                  # VS Code specific settings
│   └── launch.json           # Debug configuration for Extension Host
├── media/
│   └── icon.png              # Icon displayed in the VS Code sidebar
├── extension.js              # Main file handling activation, webview, HTML, CSS, and script logic
├── package.json              # Extension manifest file defining contributions, activation, and dependencies
└── README.md                 # Documentation for understanding and using the project
```
---

## 🎯 Use Cases
- Ask coding or debugging questions
- Use it as a personal offline assistant
- Speed up learning without leaving VS Code

---

## 📌 Note
🔄 Copy feature is currently not included but may return in future versions.

---

## 👥 Developed By

Prathamesh Rajendra Navale
- **Email**: [workwithprathamesh18@gmail.com](mailto:workwithprathamesh18@gmail.com)
- **GitHub**: [navalepratham18](https://github.com/navalepratham18)
- **LinkedIn**: [Prathamesh-Navale](https://linkedin.com/in/prathameshnavale18)

---

## 📃 License
MIT – Feel free to use, learn, and improve upon it.

---

## 🧠 Project Overview


https://github.com/user-attachments/assets/a098bb45-47e5-484e-b193-c8bb25d5e780




