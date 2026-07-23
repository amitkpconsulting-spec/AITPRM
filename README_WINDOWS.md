# AITPRM Tool - Portable Windows (x64) Quick Start Guide

🔗 **Repository**: [https://github.com/amitkpconsulting-spec/AITPRM](https://github.com/amitkpconsulting-spec/AITPRM)

This platform is engineered to operate in **100% air-gapped, zero-trust Windows (x64) environments**. All document parsing, ONNX vector embeddings, knowledge graph traversal, and AI auditing run strictly on the local machine without external cloud dependencies.

---

## 🚀 Quick Start Instructions

### 1. Run Setup & Environment Verification
Double-click `setup.bat` or run from Windows Command Prompt (`cmd.exe`):

```cmd
setup.bat
```

What `setup.bat` performs automatically:
- Checks for Node.js v18+ (or portable Node binary in `.\bin\node\`)
- Installs local NPM dependencies (`npm install`)
- Pre-fetches ONNX embedding model weights (`bge-small-en-v1.5`)
- Verifies local Vector DB & Knowledge Graph via end-to-end self-tests
- Builds static production bundles

---

### 2. Launch Local Platform
Double-click `start.bat` or run from Command Prompt:

```cmd
start.bat
```

What `start.bat` performs automatically:
- Verifies local Ollama LLM sidecar service on port 11434 (if installed)
- Launches local Node application server on `http://localhost:3000`
- Automatically opens `http://localhost:3000` in your default browser

---

## 📦 Optional: Air-Gapped Local LLM Sidecar (Ollama)
If you wish to use an external local LLM sidecar (e.g. Llama 3, Mistral, Gemma):
1. Download Ollama for Windows from [ollama.com/download/windows](https://ollama.com/download/windows) or place `ollama.exe` in `.\bin\`.
2. Pull your preferred model:
   ```cmd
   ollama pull llama3
   ```
3. `start.bat` will automatically detect and bind to Ollama on `http://localhost:11434`.
