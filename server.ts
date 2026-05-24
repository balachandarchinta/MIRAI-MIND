import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const errorMsg = error.message?.toLowerCase() || "";
    
    // Check if it's a hard daily quota limit
    const isDailyQuota = errorMsg.includes("generaterequestsperdayperprojectpermodel");
    
    if (isDailyQuota) {
      console.error("Hard daily quota limit reached. Retrying will not help.");
      throw new Error("DAILY_QUOTA_EXCEEDED");
    }

    const isRetryable = 
      error.status === 503 || 
      error.status === 429 ||
      errorMsg.includes("503") || 
      errorMsg.includes("429") ||
      errorMsg.includes("high demand") ||
      errorMsg.includes("quota exceeded") ||
      errorMsg.includes("resource_exhausted");

    if (retries > 0 && isRetryable) {
      // Try to extract a specific retry delay from the error message if possible
      // Example: "Please retry in 8.560022582s."
      const waitMatch = errorMsg.match(/retry in ([\d.]+)s/);
      const waitMs = waitMatch ? (parseFloat(waitMatch[1]) * 1000) + 500 : delay;

      console.log(`Retrying after error... (${retries} attempts left). Waiting ${Math.round(waitMs)}ms. Msg: ${errorMsg.substring(0, 100)}...`);
      await new Promise(resolve => setTimeout(resolve, waitMs));
      return withRetry(fn, retries - 1, waitMs * 1.5);
    }
    throw error;
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API Route for Model Comparison
  app.get("/api/models", async (req, res) => {
    try {
      const modelsData = [
        {
          id: "gemma-3-2b",
          name: "Gemma 3 2B",
          type: "Dense",
          capabilities: {
            thinking: "Efficiency Focus",
            longContext: "8K",
            image: "Basic",
            video: "None",
            multimodal: "Limited",
            functionCalling: "Basic",
            coding: "Basic",
            multilingual: "Partial",
            audio: "None",
            scores: [
              { subject: "Thinking", value: 45 },
              { subject: "Multimodal", value: 30 },
              { subject: "Coding", value: 40 },
              { subject: "Multilingual", value: 50 },
              { subject: "Efficiency", value: 95 }
            ],
            benchmarks: [
              { metric: "GSM8K", value: 42.5 },
              { metric: "MATH", value: 12.1 },
              { metric: "HumanEval", value: 31.5 },
              { metric: "MMLU", value: 52.3 },
              { metric: "Perplexity", value: 8.4 },
              { metric: "Latency (ms)", value: 45 },
              { metric: "Tokens/sec", value: 120 }
            ]
          },
          target: "On-device / Mobile / Latency Critical"
        },
        {
          id: "gemma-3-4b",
          name: "Gemma 3 4B",
          type: "Multimodal Dense",
          capabilities: {
            thinking: "Moderate",
            longContext: "128K",
            image: "Advanced",
            video: "Advanced",
            multimodal: "Native",
            functionCalling: "Robust",
            coding: "Standard",
            multilingual: "Full",
            audio: "Native",
            scores: [
              { subject: "Thinking", value: 65 },
              { subject: "Multimodal", value: 85 },
              { subject: "Coding", value: 60 },
              { subject: "Multilingual", value: 75 },
              { subject: "Efficiency", value: 80 }
            ],
            benchmarks: [
              { metric: "GSM8K", value: 62.8 },
              { metric: "MATH", value: 24.5 },
              { metric: "HumanEval", value: 55.2 },
              { metric: "MMLU", value: 64.1 },
              { metric: "Perplexity", value: 6.2 },
              { metric: "Latency (ms)", value: 85 },
              { metric: "Tokens/sec", value: 85 }
            ]
          },
          target: "Personal Assistants / Creative Tools / Edge AI"
        },
        {
          id: "gemma-3-26b-moe",
          name: "Gemma 3 26B MoE",
          type: "Mixture of Experts",
          capabilities: {
            thinking: "Advanced",
            longContext: "128K",
            image: "High",
            video: "Standard",
            multimodal: "Integrated",
            functionCalling: "Expert",
            coding: "Advanced",
            multilingual: "Extensive",
            audio: "Standard",
            scores: [
              { subject: "Thinking", value: 82 },
              { subject: "Multimodal", value: 70 },
              { subject: "Coding", value: 85 },
              { subject: "Multilingual", value: 90 },
              { subject: "Efficiency", value: 75 }
            ],
            benchmarks: [
              { metric: "GSM8K", value: 86.4 },
              { metric: "MATH", value: 48.2 },
              { metric: "HumanEval", value: 78.5 },
              { metric: "MMLU", value: 79.8 },
              { metric: "Perplexity", value: 4.8 },
              { metric: "Latency (ms)", value: 150 },
              { metric: "Tokens/sec", value: 110 }
            ]
          },
          target: "Efficient Enterprise Solutions / High Throughput"
        },
        {
          id: "gemma-3-31b-dense",
          name: "Gemma 3 31B Dense",
          type: "Dense",
          capabilities: {
            thinking: "State-of-the-art",
            longContext: "128K",
            image: "Expert",
            video: "Expert",
            multimodal: "Native Unified",
            functionCalling: "Precision",
            coding: "Expert-grade",
            multilingual: "Global",
            audio: "High-fidelity",
            scores: [
              { subject: "Thinking", value: 96 },
              { subject: "Multimodal", value: 94 },
              { subject: "Coding", value: 92 },
              { subject: "Multilingual", value: 88 },
              { subject: "Efficiency", value: 60 }
            ],
            benchmarks: [
              { metric: "GSM8K", value: 94.2 },
              { metric: "MATH", value: 58.6 },
              { metric: "HumanEval", value: 86.4 },
              { metric: "MMLU", value: 84.5 },
              { metric: "Perplexity", value: 3.1 },
              { metric: "Latency (ms)", value: 420 },
              { metric: "Tokens/sec", value: 45 }
            ]
          },
          target: "Complex Reasoning / Software Dev / Deep Analysis"
        }
      ];
      res.json(modelsData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/analyze", async (req, res) => {
    try {
      const { customProfile, apiKey } = req.body;
      
      // Use provided API key or fallback to system key
      const activeAi = apiKey ? new GoogleGenAI({ apiKey }) : ai;

      const profileSubject = customProfile || `
        Daily Routine: Wakes up at 7:30 AM, skips breakfast, late office (10 AM), late lunch (2 PM), 7 PM home, lies on bed, late mobile usage, 5-6 hours sleep.
        Physical: Dark circles, pale face, obese, low energy, mentally fatigued.
        Behavioral: Procrastinates, feels stuck, low motivation, comfort over effort.
      `;

      const systemPrompt = `
        You are an advanced AI Model Architecture Analyst powered by Gemini for Mirai Mind.
        Your purpose is to deeply analyze and compare different AI model architectures (Gemma 3 variants) by evaluating how they would reason about a specific "Intelligence Subject" (the provided User Risk Profile).

        SUBJECT FOR ANALYSIS:
        ${profileSubject}

        Analyze the subject using the following four architectural tiers:
        1. TIER 1: On-Device Efficiency (Gemma 3 2B) - Low latency, reactive, simplified pattern recognition.
        2. TIER 2: Multimodal Perception (Gemma 3 4B) - Adaptive, context-aware, creative behavioral inference.
        3. TIER 3 (MoE): Expert-Routing Intelligence (Gemma 3 26B MoE) - Modular cognition, sparse activation, fast contextual switching using distributed specialist inference.
        4. TIER 3 (DENSE): Unified Deep Synthesis (Gemma 3 31B Dense) - Continuous causal reasoning, holistic systemic modeling, persistent long-chain abstraction.

        Return a JSON object with:
        {
          "user1": "Tier 1 Analysis: Reactive patterns. Include: Cognitive Stage, Reasoning Style, Time Horizon, Pattern Depth, Risk Interpretation, Intervention Logic, System Interpretation, Failure Prediction, Autonomy Level.",
          "user2": "Tier 2 Analysis: Adaptive behavioral drivers. Include: Cognitive Stage, Reasoning Style, Time Horizon, Pattern Depth, Risk Interpretation, Intervention Logic, System Interpretation, Failure Prediction, Autonomy Level.",
          "user3_moe": "Gemma 3 26B MoE Analysis: Expert routing. Include: Cognitive Stage, Reasoning Style, Time Horizon, Pattern Depth, Risk Interpretation, Intervention Logic, System Interpretation, Failure Prediction, Autonomy Level.",
          "user3_dense": "Gemma 3 31B Dense Analysis: Deep synthesis. Include: Cognitive Stage, Reasoning Style, Time Horizon, Pattern Depth, Risk Interpretation, Intervention Logic, System Interpretation, Failure Prediction, Autonomy Level.",
          "comparative": {
            "rows": [
              { "dimension": "Cognitive Stage", "t1": "Pattern Recognition", "t2": "Associative Inference", "t3": "Strategic Synthesis" },
              { "dimension": "Intelligence Level", "t1": "Operational", "t2": "Interpretive", "t3": "Expert / SOTA" },
              { "dimension": "Cognitive Style", "t1": "Linear Logic", "t2": "Multimodal Synthesis", "t3": "Holistic Systems Thinking" },
              { "dimension": "Time Horizon", "t1": "Immediate (24-Hour Cycle)", "t2": "Short-Term (Weekly Trends)", "t3": "Long-Term (Years/Decades)" },
              { "dimension": "Pattern Depth", "t1": "Surface-Level Correlations", "t2": "Intermediate Causal Links", "t3": "Deep Structural Logic" },
              { "dimension": "Core Capability", "t1": "Routine Optimization", "t2": "Contextual Behavior Analysis", "t3": "Neuro-Metabolic Engineering" },
              { "dimension": "Risk Model", "t1": "Physical Burnout", "t2": "Metabolic Syndrome Progression", "t3": "Systemic Physiological Collapse" },
              { "dimension": "Intervention Style", "t1": "Digital Reminders / Alarms", "t2": "Environmental Cues / Bio-Feedback", "t3": "Chronotherapy & CBT-I" },
              { "dimension": "Autonomy Level", "t1": "Assisted / Reactive", "t2": "Collaborative / Proactive", "t3": "Strategic / Autonomous" },
              { "dimension": "Key Evolution", "t1": "Data Logging → Health Triage", "t2": "Behavior Context → Driver Mapping", "t3": "System Modeling → Failure Prevention" },
              { "dimension": "System Interpretation", "t1": "Flags Disruptors (Specific to subject's daily routine)", "t2": "Understands Drivers (Specific to subject's behavior)", "t3": "Models Feedback Loops (Specific to subject's metabolic risk)" },
              { "dimension": "Complexity Level", "t1": "01", "t2": "02", "t3": "03" }
            ],
            "summary": "The architecture shifts from basic habit tracking (Tier 1) to inferring psychological drivers (Tier 2) and finally to modeling complex physiological feedback loops (Tier 3). This represents a transition from treating symptoms to identifying the core neuro-biological failure points.",
            "evolutionPath": ["Data Logging", "Driver Inference", "System Modeling", "Failure Prevention"]
          },
          "simulations": [
            {
              "title": "SCENARIO A — CHRONIC INERTIA",
              "status": "Stable but stagnant",
              "timeline": "6–12 Months",
              "focusArea": "Metabolic maintenance",
              "predictedOutcome": "Gradual weight gain and cognitive fog",
              "primaryRisk": "Early-stage insulin resistance",
              "suggestedIntervention": "Standing reminders and calorie tracking",
              "aiInterpretation": "User is trapped in a low-energy maintenance loop.",
              "severity": "stable"
            },
            {
              "title": "SCENARIO B — MICRO-HABIT SHIFT",
              "status": "Gradual optimization and growth",
              "timeline": "3–6 Months",
              "focusArea": "Circadian realignment",
              "predictedOutcome": "Improved alertness and mood stabilization",
              "primaryRisk": "Relapse during high-stress work weeks",
              "suggestedIntervention": "Morning sunlight + grayscale phone mode after 9 PM",
              "aiInterpretation": "Environmental restructuring improves biological rhythm stability.",
              "severity": "adaptive"
            },
            {
              "title": "SCENARIO C — SYSTEMIC BURNOUT",
              "status": "Crisis/Emergency response",
              "timeline": "1–2 Months",
              "focusArea": "Acute executive dysfunction",
              "predictedOutcome": "Work collapse and social withdrawal",
              "primaryRisk": "Severe depressive episode triggered by metabolic exhaustion",
              "suggestedIntervention": "Medical leave + supervised sleep restoration + CBT-I",
              "aiInterpretation": "The subject is approaching neuro-metabolic failure thresholds.",
              "severity": "critical"
            }
          ],
          "predictiveEscalationPath": ["Metabolic Drift", "Circadian Dysregulation", "Cognitive Degradation", "Systemic Burnout"],
          "isFallback": boolean
        }
        
        Ensure "System Interpretation" and all scenario details are strictly tailored to the provided profile subject.
      `;

      let response;
      let isFallback = false;
      const modelChain = ["gemini-3-flash-preview", "gemini-3.1-flash-lite", "gemini-flash-latest"];
      let lastError: any = null;

      for (const modelName of modelChain) {
        try {
          console.log(`Attempting analysis with model: ${modelName}...`);
          response = await withRetry(() => activeAi.models.generateContent({
            model: modelName,
            contents: systemPrompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  user1: { type: Type.STRING },
                  user2: { type: Type.STRING },
                  user3_moe: { type: Type.STRING },
                  user3_dense: { type: Type.STRING },
          "comparative": {
            "type": Type.OBJECT,
            "properties": {
              "rows": {
                "type": Type.ARRAY,
                "items": {
                  "type": Type.OBJECT,
                  "properties": {
                    "dimension": { "type": Type.STRING },
                    "t1": { "type": Type.STRING },
                    "t2": { "type": Type.STRING },
                    "t3": { "type": Type.STRING }
                  },
                  "required": ["dimension", "t1", "t2", "t3"]
                }
              },
              "summary": { "type": Type.STRING },
              "evolutionPath": {
                "type": Type.ARRAY,
                "items": { "type": Type.STRING }
              }
            },
            "required": ["rows", "summary", "evolutionPath"]
          },
          "simulations": {
            "type": Type.ARRAY,
            "items": {
              "type": Type.OBJECT,
              "properties": {
                "title": { "type": Type.STRING },
                "status": { "type": Type.STRING },
                "timeline": { "type": Type.STRING },
                "focusArea": { "type": Type.STRING },
                "predictedOutcome": { "type": Type.STRING },
                "primaryRisk": { "type": Type.STRING },
                "suggestedIntervention": { "type": Type.STRING },
                "aiInterpretation": { "type": Type.STRING },
                "severity": { "type": Type.STRING }
              },
              "required": ["title", "status", "timeline", "focusArea", "predictedOutcome", "primaryRisk", "suggestedIntervention", "aiInterpretation", "severity"]
            }
          },
          "predictiveEscalationPath": {
            "type": Type.ARRAY,
            "items": { "type": Type.STRING }
          },
          "isFallback": { "type": Type.BOOLEAN }
        },
        "required": ["user1", "user2", "user3_moe", "user3_dense", "comparative", "simulations", "predictiveEscalationPath"]
      }
            }
          }));
          
          if (modelName !== modelChain[0]) {
            isFallback = true;
          }
          console.log(`Successfully generated content using ${modelName}.`);
          break; // Success!
        } catch (err: any) {
          lastError = err;
          const errorMsg = err.message?.toLowerCase() || "";
          const isQuota = errorMsg.includes("quota") || err.status === 429 || err.message === "DAILY_QUOTA_EXCEEDED";
          const isNotFound = err.status === 404 || errorMsg.includes("not found");
          const isAuthError = errorMsg.includes("api key expired") || errorMsg.includes("api_key_invalid") || errorMsg.includes("api key not found");
          
          if (isAuthError) {
            if (apiKey) {
              throw new Error("The provided API key is expired or invalid. Please check your settings.");
            }
            // If it's the system key, we still fail fast but maybe with a clearer message
            throw new Error("System intelligence engine authentication failed. Please check back later.");
          }

          if (isQuota || isNotFound) {
            console.warn(`Model ${modelName} ${isQuota ? 'hit quota' : 'was not found'}. Trying next in chain...`);
            continue;
          }
          throw err; // Other errors, fail fast
        }
      }

      if (!response) {
        const errorMsg = lastError?.message?.toLowerCase() || "";
        const isQuota = errorMsg.includes("quota") || lastError?.status === 429 || errorMsg.includes("resource_exhausted");
        
        if (isQuota) {
          throw new Error("DAILY_QUOTA_EXCEEDED");
        }
        throw lastError || new Error("All models in the chain failed to generate content.");
      }

      const rawText = response.text;
      let data;
      
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        const start = rawText.indexOf('{');
        const end = rawText.lastIndexOf('}');
        
        if (start !== -1 && end !== -1 && end > start) {
          const jsonCandidate = rawText.substring(start, end + 1);
          try {
            data = JSON.parse(jsonCandidate);
          } catch (innerError) {
            console.error("Malformed JSON block extracted:", jsonCandidate);
            throw new Error(`Failed to parse extracted JSON structural data: ${innerError}`);
          }
        } else {
          console.error("No JSON structural markers found in response:", rawText);
          throw new Error("The intelligence engine returned an unparseable response format.");
        }
      }

      // Inject fallback status if not present in LLM output
      data.isFallback = isFallback;
      res.json(data);

    } catch (error: any) {
      console.error("Intelligence Analysis Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
