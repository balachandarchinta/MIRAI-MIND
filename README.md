# 🧠 MIRAI MIND — Gemma 3 Architecture Lab
### 🏆 Gemma Challenge Project — Powered by Google AI Studio

**Mirai Mind** is a premium, state-of-the-art cognitive diagnostics and predictive reasoning dashboard developed for the **Gemma Challenge**. It evaluates, simulates, and visualizes how different AI model architectures reason about human metabolic risk profiles, behavioral routines, and circadian disruptions.

By feeding daily routines, physical symptoms, and behavioral indicators into the engine, Mirai Mind generates multi-tiered cognitive analyses across the entire range of Google's **Gemma 3** open models.

---

## ⚡ What Mirai Mind Does

Mirai Mind acts as a live comparative evaluation arena. It takes raw human behavioral inputs—such as irregular sleep cycles, poor dietary habits, and high screen time—and translates them into structured physiological models. The system evaluates these routines across four layers of reasoning depth:

1. **Reactive Triage (Operational)**: Flags surface-level habits and schedules.
2. **Context-Aware Inference (Interpretive)**: Maps environmental drivers and lifestyle habits.
3. **Sparse Expert Routing (Expert Systems)**: Dynamically routes specialized metabolic and neurological sub-tasks.
4. **Deep Systemic Synthesis (Unified Logic)**: Models complex physiological feedback loops, predicting failure points over years.

---

## 🧬 Why Gemma 3 Models Are Crucial

Mirai Mind leverages the unique strengths of the **Gemma 3 open model weights** to demonstrate how parameter scale and architectural design impact real-world reasoning depth.

### 🟢 Tier 1: Gemma 3 2B (On-Device / Mobile / Latency-Critical)
*   **Core Strength**: Low latency, lightweight footprint, high throughput.
*   **Utility in Mirai Mind**: Operates as a local, reactive health triage agent. It logs daily habits (like waking times or meal frequencies), fires instant reminders, and flags immediate rule-based anomalies without requiring cloud compute.
*   **Reasoning Style**: Linear logic, surface-level correlations.

### 🟡 Tier 2: Gemma 3 4B (Multimodal Perception / Creative Edge)
*   **Core Strength**: Native unified weights for multimodal inputs (Vision, Audio, Video).
*   **Utility in Mirai Mind**: Acts as an adaptive assistant capable of parsing visual logs, sleep-audio frequencies, or micro-movement logs. It maps environmental cues to identify behavioral triggers (e.g. night-time mobile screen light impacting sleep quality).
*   **Reasoning Style**: Associative inference, multimodal behavioral synthesis.

### 🟣 Tier 3: Gemma 3 26B MoE (Mixture of Experts / High Throughput)
*   **Core Strength**: Sparse activation routing. Runs with the speed of a small model while possessing the knowledge pool of a massive model.
*   **Utility in Mirai Mind**: Routes metabolic, psychological, and neurological diagnostics to distinct specialized sub-networks. This allows for fast contextual switching and high-speed complex health analytics.
*   **Reasoning Style**: Modular expert-driven reasoning, sparse contextual inference.

### 🔵 Tier 3: Gemma 3 31B Dense (Unified Deep Synthesis / Causal Reasoning)
*   **Core Strength**: SOTA dense parameter reasoning, persistent long-chain abstraction, expert-grade math/coding logic.
*   **Utility in Mirai Mind**: Models complex biological feedback systems (e.g., how late-afternoon caffeine, skipped breakfasts, and high-cortisol late-night work cycles combine to degrade insulin sensitivity and executive function). It predicts systemic failures months in advance.
*   **Reasoning Style**: Continuous causal reasoning, holistic systemic physiological modeling.

---

## 💎 Premium Features

*   **🧪 Intelligence Lab**: Interactive playground where you can write custom user profiles and evaluate the entire multi-model reasoning chain in real time.
*   **🧠 Model Reasoning Panels**: Deep-dives into the actual text outputs, displaying exactly how each model tier reasons differently about the same diagnostic subject.
*   **📊 Cognitive Architecture Matrix**: A granular dimensional overview evaluating latency, MMLU, multilingual parameters, and throughput.
*   **⏳ Future Drift Projections**: Visualizes long-term health trajectory scenarios (Chronic Inertia, Micro-Habit Shift, Systemic Burnout) with timeline forecasts, risk vectors, and custom chronotherapy suggestions.

---

## 🚀 Running Locally

Ensure you have **Node.js** installed, then execute:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file in the root folder and add your Gemini API Key:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   APP_URL="http://localhost:3000"
   ```

3. **Start Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

---

## ☁️ Containerization & Cloud Run Architecture

The codebase has been engineered and optimized to support secure, lightweight containerization and continuous delivery on **Google Cloud Run**:

### 1. 🛡️ Semantic Domain Guardrail
*   **Purpose:** Restricts the AI reasoning cluster exclusively to inputs relevant to **Healthcare** (diagnostics, symptoms), **Wellness** (lifestyle, habits, circadian sleep logs), and **Insurance Risk Profiling** (behavioral risk evaluation, longevity).
*   **Behavior:** Uses a lightweight JSON guardrail prompt on a fast model (`gemini-flash-latest`) to semantically classify user profiles. Irrelevant inputs (e.g., general programming, math, politics) are immediately blocked with a `400 Bad Request` and a helpful scoping error.
*   **UI Integration:** Validation errors are automatically intercepted and rendered natively in the frontend's custom error triage card.

### 2. 🐋 Production Multi-Stage Dockerfile
*   **Builder Stage:** Uses `node:20-alpine` to compile all Vite client assets and bundle the Express server into `dist/server.cjs` via `esbuild`.
*   **Runner Stage:** Employs a clean, minimal Alpine node environment that copies only the built static assets and server bundle, installing *only* production-level dependencies (omitting all heavy compiler tools). This minimizes container size and increases load efficiency.
*   **.dockerignore Rules:** Heavily filtered to keep local logs, secrets (`.env`), git structures, and `node_modules` completely out of the build context.

### 3. 🔒 Enterprise-Grade Secret Management
*   Supports binding `GEMINI_API_KEY` securely from **Google Cloud Secret Manager** (`gemini-api-key:latest`) directly as an environment variable in Cloud Run, eliminating plain-text credential leaks in the environment panel.
*   Supports dynamic port routing, binding automatically to the injected `process.env.PORT` variable.

