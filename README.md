# AITPRM — Zero-Trust AI TPRM & Vendor Risk Governance Engine

An offline-first, portable Third-Party Risk Management (TPRM) platform for AI vendor assessment, control mapping, and risk posture auditing aligned with the **NIST AI Risk Management Framework (AI RMF SP 1270)** and **Cloud Security Alliance (CSA) CAIQ v4**.

🔗 **GitHub Repository**: [https://github.com/amitkpconsulting-spec/AITPRM](https://github.com/amitkpconsulting-spec/AITPRM)

---

## 🎯 Use Case

As organizations rapidly adopt generative, agentic, and third-party AI models, traditional TPRM questionnaires fail to capture AI-specific lifecycle risks like model drift, data lineage, autonomous action boundaries, prompt injection vulnerabilities, and cross-border transfers.

This platform empowers risk officers, CISOs, and enterprise compliance auditors to:
* **Evaluate AI Vendors**: Assess vendors against 13 core controls covering Data Governance, Model Lifecycle, and Agentic AI Safeguards.
* **NIST AI RMF Alignment**: Categorize risks across the 4 NIST SP 1270 functions:
  * **Govern**: Organizational risk management culture, accountability, data residency, and AI strategy.
  * **Map**: Contextualizing risks, mapping data lineage, pseudonymization, and cross-border impacts.
  * **Measure**: Quantitative & qualitative evaluations, bias testing, model drift monitoring, and red-teaming.
  * **Manage**: Priority mitigation, cryptographic safeguards, OWASP Top 10 LLM defenses, and Human-In-The-Loop (HITL) gates.
* **Executive Visualization**: Interactive NIST AI RMF Radar Chart and "What is Good / What is Not" gap analysis showcase.
* **Vendor Risk Passports**: Generate and export downloadable compliance passports and audit reports.

---

## 🏗️ Architecture & AI Engineering

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Client Browser / Local Execution Environment         │
│                                                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌────────────────┐ │
│  │   Embedded Vector    │  │  In-Memory Property  │  │ Agentic Risk   │ │
│  │   Store              │  │  Compliance Graph    │  │ Auditor        │ │
│  │ (Transformers.js/KNN)│  │ (Multi-hop Topology) │  │ (Local RAG/Graph)
│  └──────────┬───────────┘  └──────────┬───────────┘  └───────┬────────┘ │
└─────────────┼─────────────────────────┼──────────────────────┼──────────┘
              │                         │                      │
              ▼                         ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Offline Local LLM Sidecar (Ollama / Local Heuristic Auditor Fallback)   │
└─────────────────────────────────────────────────────────────────────────┘
```

1. **Embedded Vector Database (`src/vectorStore.ts`)**
   * Uses `@xenova/transformers` (`Xenova/bge-small-en-v1.5`) for client-side dense text embeddings.
   * Chunks evidence narratives and computes local cosine K-Nearest Neighbor (KNN) searches filtered by vendor and control ID.

2. **In-Memory Compliance Property Graph (`src/graphEngine.ts`)**
   * Models typed nodes (`Vendor`, `AISystem`, `Risk`, `Control`, `RMFFunction`, `Evidence`) and edges (`DEPLOYS`, `EXPOSES`, `MITIGATED_BY`, `MAPS_TO`, `PROVES`).
   * Computes multi-hop risk blast radius scores and downstream impacts when controls fail.

3. **Agentic Zero-Trust Auditor (`src/agenticAuditor.ts`)**
   * Synthesizes RAG vector search chunks and graph blast radius context to evaluate control maturity (`Ad-hoc`, `Managed`, `Optimized`).
   * Queries local Ollama sidecar endpoints (`http://localhost:11434/api/generate`) with automatic zero-trust local heuristic fallback when offline.

---

## 📦 How to Install & Run

### ⚡ Quick Start on Windows (Portable Batch Automation)

For air-gapped or portable Windows (x64) execution without manual CLI configuration:

1. **Run Portable Environment Setup (`setup.bat`)**
   Double-click `setup.bat` or execute in Command Prompt (`cmd.exe`):
   ```cmd
   setup.bat
   ```
   *What `setup.bat` performs automatically:*
   * Checks for Node.js v18+ (or uses portable Node runtime from `.\bin\node\`)
   * Installs all local NPM package dependencies (`npm install`)
   * Verifies local Ollama LLM sidecar binary or path configuration
   * Pre-fetches ONNX embedding model weights (`bge-small-en-v1.5`) & verifies vector store
   * Runs end-to-end self-test pipeline checks and compiles production assets

2. **Launch Portable Platform Server (`start.bat`)**
   Double-click `start.bat` or execute in Command Prompt:
   ```cmd
   start.bat
   ```
   *What `start.bat` performs automatically:*
   * Checks & starts local Ollama LLM sidecar listener service on port 11434 (if installed)
   * Automatically launches your default web browser at `http://localhost:3000`
   * Starts the local application server on port 3000

---

### 💻 Standard CLI Installation (Cross-Platform)

#### Prerequisites
* **Node.js**: v18.0 or higher
* **npm**: v9.0 or higher
* *(Optional)* **Ollama**: For local offline LLM evaluation (`ollama run llama3`)

#### Step-by-Step CLI Setup

1. **Clone the repository and install dependencies:**
   ```bash
   git clone https://github.com/amitkpconsulting-spec/AITPRM.git
   cd AITPRM
   npm install
   ```

2. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

3. **(Optional) Enable Local Ollama LLM Sidecar:**
   If you have Ollama running locally, start the service and serve a model:
   ```bash
   ollama run llama3
   ```
   The platform will automatically detect and query `http://localhost:11434/api/generate`. If Ollama is not active, the auditor seamlessly switches to the zero-trust local heuristic engine.

---

## 🔒 Portability & Zero-Trust Guarantee

* **100% Client-Side Processing**: All vector embeddings, KNN searches, graph traversals, and score calculations run inside the client browser runtime or local Node process.
* **No Remote Cloud Dependencies**: No third-party API keys or external SaaS connections are required.
* **Offline Data Persistence**: Vendor assessment profiles, evidence stores, and vector indices persist locally in `localStorage` and can be exported as Portable JSON dossiers or imported across air-gapped environments.

---

## 📄 License

Apache-2.0 License.
