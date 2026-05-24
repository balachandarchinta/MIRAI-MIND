import { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
import { AnalysisData, ModelData } from "./types";

// Common Components
import Header from "./components/Header";
import ApiKeyModal from "./components/ApiKeyModal";

// Views
import LabView from "./components/views/LabView";
import ProfilesView from "./components/views/ProfilesView";
import ComparativeView from "./components/views/ComparativeView";
import SimulationsView from "./components/views/SimulationsView";

export default function App() {
  const [activeTab, setActiveTab] = useState<"profiles" | "comparative" | "simulations" | "lab">("lab");
  const [selectedModelIdx, setSelectedModelIdx] = useState<number>(0);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [models, setModels] = useState<ModelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem("MIRAI_API_KEY") || "");
  const [showKeySettings, setShowKeySettings] = useState(false);

  const [customProfile, setCustomProfile] = useState<string>(`Daily Routine:
• Wakes up around 7:30 AM
• Skips breakfast
• Goes late to office around 10 AM
• Eats lunch very late around 2 PM
• Returns home around 7 PM
• Lies down on bed after work
• Very low physical activity
• Uses mobile phone late into the night
• Sleeps around 5–6 hours

Physical Indicators:
• Under-eye dark circles, Pale face, Obese body type, Low energy

Behavioral Indicators:
• Frequently procrastinates, Feels stuck, Low motivation, Wants comfort over effort`);

  const fetchData = async (profile?: string) => {
    try {
      setLoading(true);
      setError(null);
      const [analysisRes, modelsRes] = await Promise.all([
        fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customProfile: profile || customProfile,
            apiKey: apiKey || undefined
          })
        }),
        fetch("/api/models")
      ]);

      const analysisData = await analysisRes.json();
      const modelsData = await modelsRes.json();

      if (analysisData.error) {
        if (analysisData.error === "DAILY_QUOTA_EXCEEDED") {
          setError("Neural engine quota exceeded. The daily intelligence limit has been reached. System capacity will reset tomorrow.");
        } else {
          setError(analysisData.error);

          // Auto-trigger security settings on auth failure
          const isAuthError = analysisData.error.toLowerCase().includes("expired") ||
                              analysisData.error.toLowerCase().includes("invalid") ||
                              analysisData.error.toLowerCase().includes("authentication failed");
          if (isAuthError) {
            setShowKeySettings(true);
          }
        }
      } else {
        setAnalysis(analysisData);
      }

      setModels(modelsData);
    } catch (err: any) {
      console.error(err);
      setError("Strategic analysis engine failed to initialize. Network disruption or quota limit detected.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("MIRAI_API_KEY", apiKey);
    } else {
      localStorage.removeItem("MIRAI_API_KEY");
    }
  }, [apiKey]);

  const handleClearApiKey = () => {
    setApiKey("");
    // Give state a brief tick to update before firing the fetch
    setTimeout(() => {
      fetchData();
    }, 100);
  };

  if (loading && !models.length) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] flex flex-col items-center justify-center p-8 space-y-4 font-mono">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Activity className="w-12 h-12 text-[#22c55e]" />
        </motion.div>
        <div className="text-sm tracking-widest uppercase opacity-50">Initializing Mirai Mind Engine...</div>
        <div className="w-64 h-1 bg-[#1a1a1a] overflow-hidden rounded-full">
          <motion.div
            className="h-full bg-[#22c55e]"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] font-sans selection:bg-[#22c55e] selection:text-black">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showKeySettings={showKeySettings}
        setShowKeySettings={setShowKeySettings}
        isFallback={analysis?.isFallback}
      />

      <ApiKeyModal
        showKeySettings={showKeySettings}
        setShowKeySettings={setShowKeySettings}
        apiKey={apiKey}
        setApiKey={setApiKey}
        fetchData={fetchData}
      />

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          {activeTab === "lab" && (
            <LabView
              customProfile={customProfile}
              setCustomProfile={setCustomProfile}
              loading={loading}
              fetchData={fetchData}
              models={models}
            />
          )}

          {activeTab === "profiles" && (
            <ProfilesView
              models={models}
              selectedModelIdx={selectedModelIdx}
              setSelectedModelIdx={setSelectedModelIdx}
              analysis={analysis}
              error={error}
              fetchData={fetchData}
              onShowKeySettings={() => setShowKeySettings(true)}
              onClearKey={handleClearApiKey}
            />
          )}

          {activeTab === "comparative" && (
            <ComparativeView
              analysis={analysis}
              error={error}
              fetchData={fetchData}
              onShowKeySettings={() => setShowKeySettings(true)}
              onClearKey={handleClearApiKey}
            />
          )}

          {activeTab === "simulations" && (
            <SimulationsView
              analysis={analysis}
              error={error}
              fetchData={fetchData}
              onShowKeySettings={() => setShowKeySettings(true)}
              onClearKey={handleClearApiKey}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="mt-20 border-t border-[#1a1a1a] p-8 text-center text-[10px] font-mono tracking-widest opacity-30 uppercase space-y-2">
        <p>© 2026 MIRAI MIND AI CORE v1.0.4</p>
        <p>REASONING PARAMETERS: MULTIMODAL UNITY / REASONING EFFICIENCY / ARCHITECTURAL DENSITY</p>
      </footer>
    </div>
  );
}
