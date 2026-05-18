import { useState, useEffect, useRef } from "react";
import { 
  Activity, 
  Brain, 
  ShieldAlert, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Users,
  Grid3X3,
  BarChart3,
  Timer,
  ChevronRight,
  Database,
  Search,
  Key,
  Eye,
  EyeOff,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";

interface AnalysisData {
  user1: string;
  user2: string;
  user3_moe: string;
  user3_dense: string;
  comparative: {
    rows: {
      dimension: string;
      t1: string;
      t2: string;
      t3: string;
    }[];
    summary: string;
    evolutionPath: string[];
  };
  simulations: {
    title: string;
    status: string;
    timeline: string;
    focusArea: string;
    predictedOutcome: string;
    primaryRisk: string;
    suggestedIntervention: string;
    aiInterpretation: string;
    severity: string;
  }[];
  predictiveEscalationPath: string[];
  isFallback?: boolean;
}

import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from "recharts";

interface ModelData {
  id: string;
  name: string;
  type: string;
  target: string;
  capabilities: {
    thinking: string;
    longContext: string;
    image: string;
    video: string;
    multimodal: string;
    functionCalling: string;
    coding: string;
    multilingual: string;
    audio: string;
    scores?: { subject: string; value: number }[];
    benchmarks?: { metric: string; value: number }[];
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"profiles" | "comparative" | "simulations" | "lab">("lab");
  const [selectedModelIdx, setSelectedModelIdx] = useState<number>(0);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [models, setModels] = useState<ModelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem("MIRAI_API_KEY") || "");
  const [showKeySettings, setShowKeySettings] = useState(false);
  const [isKeyVisible, setIsKeyVisible] = useState(false);

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
  }

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

  const users = [
    { id: 1, name: "User 1", type: "Passive", color: "#ef4444" },
    { id: 2, name: "User 2", type: "Growth/Inconsistent", color: "#eab308" },
    { id: 3, name: "User 3", type: "Structured", color: "#22c55e" },
  ];

  const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => {
    const isQuotaError = error.includes("DAILY_QUOTA_EXCEEDED") || error.toLowerCase().includes("quota") || error.includes("capacity reached");
    const isAuthError = error.includes("expired") || error.includes("invalid") || error.includes("authentication failed");
    
    return (
      <div className="p-12 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400 space-y-6 flex flex-col items-center text-center">
        <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold uppercase tracking-widest text-red-500">
            {isQuotaError ? "Daily System Capacity Reached" : isAuthError ? "Authentication Intelligence Failure" : "Intelligence Subsystem Offline"}
          </h3>
          <p className="text-sm leading-relaxed max-w-md opacity-80">
            {isQuotaError 
              ? "The neural engine has reached its maximum daily throughput limit. All models in our reasoning chain are currently at capacity. This limit will reset automatically tomorrow. Please return then for a full cognitive assessment."
              : error}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {isAuthError && (
            <>
              <button 
                onClick={() => setShowKeySettings(true)}
                className="text-xs uppercase tracking-widest font-bold px-8 py-4 bg-[#22c55e]/10 border border-[#22c55e]/30 hover:bg-[#22c55e]/20 hover:border-[#22c55e]/50 text-[#22c55e] rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                Update API Key
              </button>
              <button 
                onClick={() => {
                  setApiKey("");
                  setTimeout(() => fetchData(), 100);
                }}
                className="text-xs uppercase tracking-widest font-bold px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                Clear Key & Revert
              </button>
            </>
          )}
          <button 
            onClick={onRetry}
            className="text-xs uppercase tracking-widest font-bold px-8 py-4 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 rounded-lg transition-all"
          >
            {isQuotaError ? "Force Reset Attempt" : "Attempt System Restart"}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
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
      {/* Header */}
      <header className="border-b border-[#1a1a1a] p-4 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-50">
        {/* API Key Modal Overlay */}
        <AnimatePresence>
          {showKeySettings && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowKeySettings(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed top-20 right-4 w-80 bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6 z-[70] shadow-2xl space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#22c55e]">Security Cluster</h3>
                  <button onClick={() => setShowKeySettings(false)} className="text-white/40 hover:text-white">&times;</button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-black rounded-lg border border-white/5">
                    <span className="text-[9px] uppercase font-mono text-white/40">Status</span>
                    <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded ${apiKey ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-blue-500/20 text-blue-400'}`}>
                      {apiKey ? 'Custom Node Active' : 'System Engine Active'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono text-white/40">Custom Gemini API Key</label>
                    <div className="relative">
                      <input 
                        type={isKeyVisible ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Insert your API key..."
                        className="w-full bg-black border border-white/10 rounded-lg p-3 pt-4 text-xs font-mono text-[#22c55e] placeholder:text-white/10 focus:border-[#22c55e]/50 focus:outline-none"
                      />
                      <Key className="absolute top-1/2 -translate-y-1/2 left-3 w-3 h-3 text-white/20 pointer-events-none" />
                      <button 
                        onClick={() => setIsKeyVisible(!isKeyVisible)}
                        className="absolute top-1/2 -translate-y-1/2 right-3 text-white/20 hover:text-white/60"
                      >
                        {isKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[9px] text-white/20 leading-relaxed">
                      Overrides the system default. Your key is stored locally in this node.
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setShowKeySettings(false);
                      fetchData();
                    }}
                    className="w-full py-3 bg-[#22c55e]/10 border border-[#22c55e]/30 hover:bg-[#22c55e]/20 text-[#22c55e] text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all"
                  >
                    Sync Secure Engine
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#22c55e]/10 rounded border border-[#22c55e]/20">
            <Activity className="w-5 h-5 text-[#22c55e]" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tighter uppercase text-[#22c55e]">Mirai Mind</h1>
            <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase">Gemma 3 Architecture Lab</p>
          </div>
        </div>
        
        <nav className="flex gap-1">
          {[
            { id: "lab", label: "Intelligence Lab", icon: Zap },
            { id: "profiles", label: "Model Reasoning", icon: Brain },
            { id: "comparative", label: "Capability Matrix", icon: Grid3X3 },
            { id: "simulations", label: "Future Drift", icon: Timer },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all rounded ${
                activeTab === tab.id 
                  ? "bg-[#1a1a1a] text-[#22c55e] border border-[#22c55e]/30" 
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowKeySettings(!showKeySettings)}
            className={`p-2 rounded-lg transition-all ${showKeySettings ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'text-white/40 hover:text-white'}`}
          >
            <Settings className="w-4 h-4" />
          </button>

          <div className="hidden md:flex items-center gap-4 text-[10px] font-mono opacity-40">
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${analysis?.isFallback ? 'bg-amber-500' : 'bg-[#22c55e]'} animate-pulse`} />
              <span>STATUS: {analysis?.isFallback ? 'STABILIZED MODE (HIGH LOAD)' : 'OPTIMAL (GEMINI-3)'}</span>
            </div>
            <span>Uptime: 172:14:02</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          {activeTab === "profiles" && (
            <motion.div
              key="profiles"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Dropdown Selector */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl border border-[#1a1a1a] bg-[#111]/40">
                <div className="space-y-1">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
                    <Database className="w-3 h-3" />
                    Model Selection
                  </h3>
                  <div className="relative inline-block w-64 mt-2">
                    <select 
                      value={selectedModelIdx}
                      onChange={(e) => setSelectedModelIdx(parseInt(e.target.value))}
                      className="w-full appearance-none bg-black border border-[#22c55e]/30 text-[#22c55e] text-xs font-bold uppercase tracking-tighter p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#22c55e] cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                    >
                      {models.length > 0 ? models.map((model, idx) => (
                        <option key={model.id} value={idx}>{model.name}</option>
                      )) : [
                        <option key="1" value={0}>Gemma 3 2B</option>,
                        <option key="2" value={1}>Gemma 3 4B</option>,
                        <option key="3" value={2}>Gemma 3 26B MoE</option>,
                        <option key="4" value={3}>Gemma 3 31B Dense</option>
                      ]}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#22c55e]">
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-8 items-center bg-black/40 px-6 py-4 rounded-lg border border-white/5 font-mono">
                  <div className="space-y-1">
                    <div className="text-[9px] font-bold uppercase tracking-widest opacity-40">Reasoning Qual.</div>
                    <div className="text-xl font-bold text-[#22c55e] uppercase">{models[selectedModelIdx]?.capabilities.thinking || "N/A"}</div>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="space-y-1">
                    <div className="text-[9px] font-bold uppercase tracking-widest opacity-40">Multimodality</div>
                    <div className="text-xl font-bold text-white uppercase">{models[selectedModelIdx]?.capabilities.multimodal || "N/A"}</div>
                  </div>
                </div>
              </div>

              {/* Main Profile View */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
                <div className="space-y-8">
                  <div className="p-8 rounded-2xl border border-[#1a1a1a] bg-[#111]/20 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#22c55e]" />
                    <div className="relative z-10 space-y-6">
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                          <div className="text-xs font-mono text-[#22c55e] mb-1">ARCH ID: {models[selectedModelIdx]?.id.toUpperCase()}</div>
                          <h2 className="text-5xl font-bold tracking-tighter uppercase">{models[selectedModelIdx]?.name}</h2>
                          <p className="text-[#888] font-mono text-xs uppercase tracking-widest mt-1">Status: Operational Insight Active</p>
                        </div>
                        <div className="flex gap-2">
                           {models[selectedModelIdx]?.id.includes('31b') || models[selectedModelIdx]?.id.includes('26b') ? (
                             <div className="px-3 py-1.5 rounded bg-[#22c55e]/10 border border-[#22c55e]/30 text-[10px] font-mono text-[#22c55e] flex items-center gap-2">
                               <Brain className="w-3 h-3" />
                               ITERATIVE THINKING ENABLED
                             </div>
                           ) : null}
                           <div className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/60 flex items-center gap-2">
                             <Zap className="w-3 h-3" />
                             {models[selectedModelIdx]?.type}
                           </div>
                        </div>
                      </div>
                      <div className="max-w-3xl text-sm leading-relaxed text-[#aaa] border-l-2 border-[#222] pl-6 italic">
                        "The {models[selectedModelIdx]?.name} represents a breakthrough in {models[selectedModelIdx]?.target.toLowerCase().includes('reasoning') ? 'structural reasoning logic' : 'multimodal parameter efficiency'}, leveraging unified weights for seamless perception."
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl border border-[#1a1a1a] bg-[#111]/40 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#22c55e] flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        SOTA Quality Benchmarks
                      </h3>
                      <div className="space-y-5 pt-2">
                        {models[selectedModelIdx]?.capabilities.benchmarks?.filter(b => ["GSM8K", "MATH", "HumanEval", "MMLU"].includes(b.metric)).map((b) => (
                          <div key={b.metric} className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                              <span className="opacity-60">{b.metric}</span>
                              <span className="text-white font-bold">{b.value}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-white/5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${b.value}%` }}
                                className="h-full bg-gradient-to-r from-[#22c55e] to-[#4ade80]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 rounded-xl border border-[#1a1a1a] bg-[#111]/40 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
                        <Timer className="w-4 h-4" />
                        Efficiency & Inference Specs
                      </h3>
                      <div className="grid grid-cols-1 gap-4 pt-2">
                        {models[selectedModelIdx]?.capabilities.benchmarks?.filter(b => ["Perplexity", "Latency (ms)", "Tokens/sec"].includes(b.metric)).map((b) => (
                          <div key={b.metric} className="p-3 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between">
                            <div className="space-y-0.5">
                              <div className="text-[8px] font-mono uppercase opacity-40 leading-none">{b.metric}</div>
                              <div className="text-sm font-bold text-white tracking-widest">{b.value}{b.metric === "Tokens/sec" ? " t/s" : b.metric === "Perplexity" ? "" : "ms"}</div>
                            </div>
                            <div className="w-24 h-1 bg-[#22c55e]/10 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: b.metric === "Perplexity" ? `${(15-b.value)*6.6}%` : b.metric === "Tokens/sec" ? `${(b.value/150)*100}%` : `${(1000-b.value)/10}%` }}
                                 className={`h-full ${b.metric === "Perplexity" || b.metric === "Latency (ms)" ? 'bg-amber-500' : 'bg-[#22c55e]'}`}
                               />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 text-[9px] font-mono text-[#555] uppercase tracking-tight italic">
                        * Efficiency metrics measured on standard A100/H100 compute profiles.
                      </div>
                    </div>
                  </div>

                    <div className="prose prose-invert prose-emerald prose-sm max-w-none prose-headings:uppercase prose-headings:tracking-widest prose-headings:font-bold prose-headings:text-[#22c55e] prose-strong:text-white prose-li:my-1">
                      {error ? (
                        <ErrorDisplay error={error} onRetry={() => fetchData()} />
                      ) : (
                        <>
                          {analysis?.isFallback && (
                            <div className="mb-6 p-3 rounded bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                              <ShieldAlert className="w-4 h-4 text-amber-500" />
                              <div className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold">
                                Primary Intelligence Quota Exceeded — High-Capacity Fallback Active
                              </div>
                            </div>
                          )}

                          {/* Architectural Core Callout */}
                          <div className={`mb-8 p-6 rounded-2xl border ${
                            models[selectedModelIdx]?.type === 'Mixture of Experts' 
                              ? 'border-purple-500/30 bg-purple-500/5' 
                              : models[selectedModelIdx]?.id.includes('31b')
                              ? 'border-blue-500/30 bg-blue-500/5'
                              : 'border-white/10 bg-white/5'
                          }`}>
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-xl ${
                                models[selectedModelIdx]?.type === 'Mixture of Experts' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {models[selectedModelIdx]?.type === 'Mixture of Experts' ? <Database className="w-6 h-6" /> : <Brain className="w-6 h-6" />}
                              </div>
                              <div>
                                <h4 className="text-white font-black uppercase tracking-tight text-lg">
                                  {models[selectedModelIdx]?.type === 'Mixture of Experts' ? 'Expert-Routing Intelligence Corridors' : 'Unified Dense Synthesis Engine'}
                                </h4>
                                <p className="text-xs text-white/40 uppercase tracking-widest font-mono">
                                  {models[selectedModelIdx]?.type === 'Mixture of Experts' ? 'Sparse Activation // Specialist Modular Cognition' : 'Continuous Causal Reasoning // Holistic Abstraction'}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-white/5 shadow-inner">
                            <ReactMarkdown>
                              {selectedModelIdx === 0 
                                ? analysis?.user1 
                                : selectedModelIdx === 1 
                                ? analysis?.user2 
                                : selectedModelIdx === 2 
                                ? analysis?.user3_moe 
                                : analysis?.user3_dense || ""}
                            </ReactMarkdown>
                          </div>
                        </>
                      )}
                    </div>
                </div>

                <aside className="space-y-6">
                   <div className="p-6 rounded-xl border border-[#1a1a1a] bg-[#111]/40 space-y-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#22c55e] flex items-center gap-2">
                      <Zap className="w-3 h-3" />
                      Architecture Pulse
                    </h3>
                    <div className="h-[240px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={models[selectedModelIdx]?.capabilities.scores || []}>
                          <PolarGrid stroke="#333" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 8 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar
                            name={models[selectedModelIdx]?.name}
                            dataKey="value"
                            stroke="#22c55e"
                            fill="#22c55e"
                            fillOpacity={0.3}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl border border-[#1a1a1a] bg-[#111]/40 space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
                      <Search className="w-3 h-3" />
                      Multimodal Matrix
                    </h4>
                    <div className="space-y-3">
                      {[
                        { label: "Vision Core", value: models[selectedModelIdx]?.capabilities.image },
                        { label: "Audio Core", value: models[selectedModelIdx]?.capabilities.audio },
                        { label: "Video Engine", value: models[selectedModelIdx]?.capabilities.video },
                        { label: "Logic Engine", value: models[selectedModelIdx]?.capabilities.coding },
                      ].map((spec) => (
                        <div key={spec.label} className="flex flex-col p-3 bg-black/20 rounded border border-white/5">
                          <span className="opacity-50 uppercase text-[8px] font-mono tracking-widest">{spec.label}</span>
                          <span className="text-white mt-1 text-xs font-bold">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-xl border border-[#1a1a1a] bg-[#111]/40 space-y-4">
                     <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Lifecycle Status
                    </h4>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-mono opacity-50 uppercase">Tier</span>
                       <span className="text-[10px] font-mono text-[#22c55e] font-bold">{selectedModelIdx > 1 ? "Enterprise" : "Edge"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-mono opacity-50 uppercase">Update Drift</span>
                       <span className="text-[10px] font-mono text-white">None</span>
                    </div>
                    <div className="pt-2">
                       <div className="w-full bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-[9px] font-mono uppercase p-2 text-center rounded">
                          Production Ready
                       </div>
                    </div>
                  </div>
                </aside>
              </div>
            </motion.div>
          )}

          {activeTab === "comparative" && (
            <motion.div
              key="comparative"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 border-b border-white/5">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-[#22c55e]/10 rounded-2xl border border-[#22c55e]/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                    <Grid3X3 className="w-8 h-8 text-[#22c55e]" />
                  </div>
                  <div>
                    <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">Cognitive Architecture Matrix</h2>
                    <p className="text-xs font-mono text-white/40 uppercase tracking-[0.3em] mt-2">Multi-Node Intelligence Scaling Framework // v1.0.4-LOCKED</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/60 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#22c55e] animate-pulse" />
                      Architecture Level Overview
                   </div>
                   <div className="text-[10px] font-mono text-[#22c55e] uppercase tracking-[0.4em] opacity-40">
                      REF: MIR-CORE-SYSC-982
                   </div>
                </div>
              </div>
              
              <div className="space-y-16 pb-32">
                {error ? (
                  <ErrorDisplay error={error} onRetry={() => fetchData()} />
                ) : analysis?.comparative?.rows ? (
                  <div className="space-y-12">
                     <div className="overflow-x-auto">
                        <div className="min-w-[1000px] border border-white/5 rounded-3xl bg-[#0a0a0a] overflow-hidden shadow-2xl">
                          {/* Table Headers */}
                          <div className="grid grid-cols-[240px_1fr_1fr_1fr] border-b border-white/10">
                            <div className="p-8 border-r border-white/5 bg-white/[0.02] flex items-center">
                              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">System Dimension</span>
                            </div>
                            
                            <div className="p-8 border-r border-white/5 bg-blue-500/5 relative group transition-colors hover:bg-blue-500/10">
                              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                              <div className="flex items-center gap-3 mb-2">
                                <Zap className="w-4 h-4 text-blue-400" />
                                <span className="text-blue-400 font-black text-xs uppercase tracking-widest">TIER 1: GEMMA 3 2B</span>
                              </div>
                              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">REACTIVE</h3>
                            </div>

                            <div className="p-8 border-r border-white/5 bg-amber-500/5 relative group transition-colors hover:bg-amber-500/10">
                              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                              <div className="flex items-center gap-3 mb-2">
                                <Activity className="w-4 h-4 text-amber-400" />
                                <span className="text-amber-400 font-black text-xs uppercase tracking-widest">TIER 2: GEMMA 3 4B</span>
                              </div>
                              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">ADAPTIVE</h3>
                            </div>

                            <div className="p-8 bg-[#22c55e]/5 relative group transition-colors hover:bg-[#22c55e]/10">
                              <div className="absolute top-0 left-0 w-full h-1 bg-[#22c55e] shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                              <div className="flex items-center gap-3 mb-2">
                                <Brain className="w-4 h-4 text-[#22c55e]" />
                                <span className="text-[#22c55e] font-black text-xs uppercase tracking-widest">TIER 3: GEMMA 3 26B/31B</span>
                              </div>
                              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">PREDICTIVE</h3>
                            </div>
                          </div>

                          {/* Rows */}
                          <div className="divide-y divide-white/5">
                            {analysis.comparative.rows.map((row, idx) => (
                              <div key={idx} className="grid grid-cols-[240px_1fr_1fr_1fr] group">
                                <div className="p-6 border-r border-white/5 bg-white/[0.01] group-hover:bg-white/[0.03] transition-colors">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-[#22c55e] opacity-70">{row.dimension}</span>
                                </div>
                                
                                <div className="p-6 border-r border-white/5 text-xs text-blue-100/60 font-medium leading-relaxed bg-blue-500/[0.01] group-hover:bg-blue-500/[0.03] transition-colors">
                                  {row.t1}
                                </div>

                                <div className="p-6 border-r border-white/5 text-xs text-amber-100/60 font-medium leading-relaxed bg-amber-500/[0.01] group-hover:bg-amber-500/[0.03] transition-colors">
                                  {row.t2}
                                </div>

                                <div className="p-6 text-xs text-green-100/60 font-medium leading-relaxed bg-green-500/[0.01] group-hover:bg-green-500/[0.03] transition-colors">
                                  {row.t3}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                     </div>

                    {/* Bottom Summary Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 mt-12 items-start">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-10 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl relative overflow-hidden"
                      >
                         <div className="absolute top-0 left-0 w-1 pt-20 h-full bg-gradient-to-b from-blue-500 via-amber-500 to-[#22c55e]" />
                         <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-white mb-6">Emergent Capability Shift Summary</h2>
                         <p className="text-lg text-white/70 leading-relaxed font-light italic">
                           "{analysis.comparative.summary}"
                         </p>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl border border-white/5 bg-black/40 h-full flex flex-col justify-center"
                      >
                         <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8 border-b border-white/5 pb-4">Evolution Path</h4>
                         <div className="space-y-6">
                            {(analysis.comparative.evolutionPath || ["Data Logging", "Driver Inference", "System Modeling", "Failure Prevention"]).map((step, idx, arr) => (
                              <div key={idx} className="flex flex-col items-center">
                                <div className={`w-full p-4 rounded-xl border ${idx === arr.length - 1 ? 'border-[#22c55e] bg-[#22c55e]/10 text-[#22c55e]' : 'border-white/10 bg-white/5 text-white/60'} text-center text-[10px] font-black uppercase tracking-[0.2em]`}>
                                  {step}
                                </div>
                                {idx < arr.length - 1 && (
                                  <motion.div 
                                    animate={{ y: [0, 5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="my-2 text-white/20"
                                  >
                                    <ChevronRight className="w-4 h-4 rotate-90" />
                                  </motion.div>
                                )}
                              </div>
                            ))}
                         </div>
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-500 font-mono text-xs text-center py-20 p-8 border border-dashed border-red-500/20 rounded-xl bg-red-500/5">
                    No comparative intelligence data received from the neural cluster.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "simulations" && (
            <motion.div
              key="simulations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 border-b border-white/5">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                    <Timer className="w-8 h-8 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">Predictive Scenarios</h2>
                    <p className="text-xs font-mono text-white/40 uppercase tracking-[0.3em] mt-2">Strategic Temporal Projections & Risk Analysis</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/60 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                      Neural-Drift Assessment active
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {analysis?.simulations?.map((sim, idx) => {
                  const severityConfig = {
                    stable: { color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/5', icon: Zap, label: 'Stable/Stagnant' },
                    adaptive: { color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/5', icon: TrendingUp, label: 'Adaptive/Growth' },
                    critical: { color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/5', icon: ShieldAlert, label: 'Critical/Emergency' }
                  }[sim.severity as keyof typeof severityConfig] || { color: 'text-white', border: 'border-white/10', bg: 'bg-white/5', icon: Timer, label: 'Unknown' };

                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className={`p-8 rounded-[2rem] border ${severityConfig.border} ${severityConfig.bg} backdrop-blur-md relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500`}
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                        <severityConfig.icon className="w-32 h-32" />
                      </div>

                      <div className="relative z-10 space-y-8">
                        <div>
                          <div className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 ${severityConfig.color} flex items-center gap-2`}>
                            <severityConfig.icon className="w-3 h-3" />
                            {severityConfig.label}
                          </div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">{sim.title}</h3>
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${severityConfig.color} animate-pulse`} />
                             <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest leading-none">Status: {sim.status}</span>
                          </div>
                        </div>

                        <div className="space-y-6 pt-4 border-t border-white/5">
                          <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                                <Clock className="w-3 h-3" />
                                Timeline
                              </div>
                              <div className="text-sm font-medium text-white/80">{sim.timeline}</div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                                <Search className="w-3 h-3" />
                                Focus Area
                              </div>
                              <div className="text-sm font-medium text-[#22c55e]">{sim.focusArea}</div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                                <TrendingUp className="w-3 h-3" />
                                Predicted Outcome
                              </div>
                              <div className="text-sm font-medium text-white/80">{sim.predictedOutcome}</div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                                <ShieldAlert className="w-3 h-3 text-red-500" />
                                Primary Risk
                              </div>
                              <div className="text-sm font-bold text-red-400">{sim.primaryRisk}</div>
                            </div>

                            <div className="space-y-2 p-5 bg-white/5 rounded-2xl border border-white/5">
                              <div className="flex items-center gap-2 text-[10px] font-black text-[#22c55e] uppercase tracking-[0.2em] mb-2">
                                <Zap className="w-3 h-3" />
                                Suggested Intervention
                              </div>
                              <div className="text-sm font-medium text-white">{sim.suggestedIntervention}</div>
                            </div>
                          </div>

                          <div className="pt-6 border-t border-white/5">
                            <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-3">AI Interpretation</div>
                            <p className="text-xs text-white/60 leading-relaxed font-mono italic">
                              "{sim.aiInterpretation}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Predictive Escalation Path Section */}
              <div className="mt-20 pt-12 border-t border-white/5 text-center">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40 mb-12">Predictive Escalation Path</h4>
                 <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-4xl mx-auto">
                    {(analysis?.predictiveEscalationPath || ["Metabolic Drift", "Circadian Dysregulation", "Cognitive Degradation", "Systemic Burnout"]).map((step, idx, arr) => (
                      <div key={idx} className="flex flex-col md:flex-row items-center gap-6 group">
                        <div className={`px-8 py-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl relative group-hover:border-red-500/30 transition-all duration-700`}>
                           {idx === arr.length - 1 && (
                             <div className="absolute -top-1 -right-1">
                                <div className="p-1 bg-red-500 rounded-full animate-ping opacity-75" />
                             </div>
                           )}
                           <span className={`text-xs font-black uppercase tracking-[0.2em] ${idx === arr.length - 1 ? 'text-red-500' : 'text-white/60'}`}>{step}</span>
                        </div>
                        {idx < arr.length - 1 && (
                          <div className="text-white/10 flex items-center justify-center">
                            <ChevronRight className="w-5 h-5 md:rotate-0 rotate-90" />
                          </div>
                        )}
                      </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === "lab" && (
            <motion.div
              key="lab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4 py-8 border-b border-[#1a1a1a]">
                <Zap className="w-8 h-8 text-[#22c55e]" />
                <div>
                  <h2 className="text-4xl font-bold uppercase tracking-tighter">Intelligence Architecture Labs</h2>
                  <p className="text-xs font-mono text-[#888] uppercase tracking-widest">Cross-model capability analysis using active risk profile subject</p>
                </div>
              </div>

              {/* Custom Input Section */}
              <div className="p-8 rounded-xl border border-[#1a1a1a] bg-[#111]/40 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold uppercase tracking-tighter flex items-center gap-2">
                      <Brain className="w-5 h-5 text-[#22c55e]" />
                      Intelligence Subject Input
                    </h3>
                    <p className="text-[10px] font-mono text-[#888] uppercase tracking-widest">Define the profile for architectural reasoning evaluation</p>
                  </div>
                  <button 
                    onClick={() => fetchData(customProfile)}
                    disabled={loading}
                    className={`px-8 py-3 rounded-lg bg-[#22c55e] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-[#4ade80] transition-all hover:scale-105 active:scale-95 disabled:opacity-50`}
                  >
                    {loading ? "Synthesizing Analysis..." : "Execute Intelligence Analysis"}
                  </button>
                </div>
                <textarea
                  value={customProfile}
                  onChange={(e) => setCustomProfile(e.target.value)}
                  className="w-full h-48 bg-black border border-[#22c55e]/20 rounded-xl p-6 text-sm font-mono text-[#aaa] focus:outline-none focus:border-[#22c55e]/60 transition-colors resize-none shadow-inner"
                />
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#1a1a1a] bg-[#111]/40">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-black/50">
                      <th className="p-4 text-[10px] uppercase font-bold tracking-widest border-b border-[#1a1a1a] text-[#888]">Architecture</th>
                      <th className="p-4 text-[10px] uppercase font-bold tracking-widest border-b border-[#1a1a1a] text-[#22c55e]">MMLU Score</th>
                      <th className="p-4 text-[10px] uppercase font-bold tracking-widest border-b border-[#1a1a1a] text-white">Latency</th>
                      <th className="p-4 text-[10px] uppercase font-bold tracking-widest border-b border-[#1a1a1a] text-[#888]">Coding</th>
                      <th className="p-4 text-[10px] uppercase font-bold tracking-widest border-b border-[#1a1a1a] text-[#888]">Multilingual</th>
                      <th className="p-4 text-[10px] uppercase font-bold tracking-widest border-b border-[#1a1a1a] text-[#888]">Tokens/sec</th>
                      <th className="p-4 text-[10px] uppercase font-bold tracking-widest border-b border-[#1a1a1a] text-[#888]">Deployment Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]">
                    {models.map((model) => (
                      <tr key={model.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-4">
                          <div className="font-bold text-sm tracking-tight text-white group-hover:text-[#22c55e] transition-colors">{model.name}</div>
                          <div className="text-[10px] font-mono opacity-40 uppercase">{model.type}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                             <div className="text-xs font-bold text-[#22c55e]">{model.capabilities.benchmarks?.find(b => b.metric === "MMLU")?.value}%</div>
                             <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#22c55e]" style={{ width: `${model.capabilities.benchmarks?.find(b => b.metric === "MMLU")?.value}%` }} />
                             </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-xs text-white">{model.capabilities.benchmarks?.find(b => b.metric === "Latency (ms)")?.value}ms</div>
                          <div className="text-[8px] font-mono opacity-30 uppercase mt-1">E2E Delay</div>
                        </td>
                        <td className="p-4 text-xs font-mono opacity-80">{model.capabilities.coding}</td>
                        <td className="p-4 text-[10px] font-bold tracking-widest uppercase opacity-70">{model.capabilities.multilingual}</td>
                        <td className="p-4">
                          <div className="text-xs text-[#22c55e] font-mono">{model.capabilities.benchmarks?.find(b => b.metric === "Tokens/sec")?.value} t/s</div>
                          <div className="text-[8px] font-mono opacity-30 mt-1 uppercase">Throughput</div>
                        </td>
                        <td className="p-4 max-w-[200px]">
                          <div className="text-[10px] font-mono opacity-50 uppercase leading-relaxed italic">{model.target}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 rounded-xl border border-[#1a1a1a] bg-[#111]/40 space-y-6">
                  <h3 className="text-xl font-bold uppercase tracking-tighter flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#22c55e]" />
                    Comparative Vector Analysis
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={
                        models[0]?.capabilities?.scores?.map((_, i) => {
                          const entry: any = { subject: models[0].capabilities.scores![i].subject };
                          models.forEach(m => {
                            entry[m.id] = m.capabilities.scores![i].value;
                          });
                          return entry;
                        }) || []
                      }>
                        <PolarGrid stroke="#333" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        {models.map((m, i) => (
                          <Radar
                            key={m.id}
                            name={m.name}
                            dataKey={m.id}
                            stroke={["#22c55e", "#eab308", "#ef4444", "#3b82f6"][i % 4]}
                            fill={["#22c55e", "#eab308", "#ef4444", "#3b82f6"][i % 4]}
                            fillOpacity={0.1}
                          />
                        ))}
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {models.map((m, i) => (
                      <div key={m.id} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ["#22c55e", "#eab308", "#ef4444", "#3b82f6"][i % 4] }} />
                        <span className="text-[10px] font-mono uppercase opacity-60 tracking-wider font-bold">{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="p-8 rounded-xl border border-[#1a1a1a] bg-[#111]/40 space-y-4">
                    <h3 className="text-xl font-bold uppercase tracking-tighter flex items-center gap-2">
                      <Brain className="w-5 h-5 text-[#22c55e]" />
                      Reasoning Architecture
                    </h3>
                    <p className="text-sm text-[#888] leading-relaxed">
                      The <span className="text-white font-bold">31B Dense</span> and <span className="text-white font-bold">26B MoE</span> models utilize an advanced iterative thinking chain, allowing them to solve highly competitive math and coding problems that previously required models twice their size.
                    </p>
                    <div className="pt-4 flex gap-4">
                      <div className="px-3 py-1.5 rounded-md bg-black border border-[#1a1a1a] text-[10px] font-mono uppercase tracking-widest">SOTA Logic</div>
                      <div className="px-3 py-1.5 rounded-md bg-black border border-[#1a1a1a] text-[10px] font-mono uppercase tracking-widest">CoT Mastery</div>
                    </div>
                  </div>
                  <div className="p-8 rounded-xl border border-[#1a1a1a] bg-[#111]/40 space-y-4">
                    <h3 className="text-xl font-bold uppercase tracking-tighter flex items-center gap-2">
                       <TrendingUp className="w-5 h-5 text-[#22c55e]" />
                      Efficiency Frontiers
                    </h3>
                    <p className="text-sm text-[#888] leading-relaxed">
                      The <span className="text-white font-bold">4B Multimodal</span> model establishes a new quality-per-parameter record, delivering native audio and visual understanding in a package small enough for high-speed local inference on standard consumer hardware.
                    </p>
                    <div className="pt-4 flex gap-4">
                      <div className="px-3 py-1.5 rounded-md bg-black border border-[#1a1a1a] text-[10px] font-mono uppercase tracking-widest">High Tokens/sec</div>
                      <div className="px-3 py-1.5 rounded-md bg-black border border-[#1a1a1a] text-[10px] font-mono uppercase tracking-widest">Multimodal Native</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
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
