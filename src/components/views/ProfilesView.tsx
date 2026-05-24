import { motion } from "motion/react";
import {
  Database,
  ChevronRight,
  Brain,
  Zap,
  BarChart3,
  Timer,
  Search,
  Clock,
  ShieldAlert
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";
import { ModelData, AnalysisData } from "../../types";
import ErrorDisplay from "../ErrorDisplay";

interface ProfilesViewProps {
  models: ModelData[];
  selectedModelIdx: number;
  setSelectedModelIdx: (idx: number) => void;
  analysis: AnalysisData | null;
  error: string | null;
  fetchData: () => void;
  onShowKeySettings: () => void;
  onClearKey: () => void;
}

export default function ProfilesView({
  models,
  selectedModelIdx,
  setSelectedModelIdx,
  analysis,
  error,
  fetchData,
  onShowKeySettings,
  onClearKey,
}: ProfilesViewProps) {
  const selectedModel = models[selectedModelIdx];

  return (
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
              {models.length > 0 ? (
                models.map((model, idx) => (
                  <option key={model.id} value={idx}>
                    {model.name}
                  </option>
                ))
              ) : (
                <>
                  <option value={0}>Gemma 3 2B</option>
                  <option value={1}>Gemma 3 4B</option>
                  <option value={2}>Gemma 3 26B MoE</option>
                  <option value={3}>Gemma 3 31B Dense</option>
                </>
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#22c55e]">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        <div className="flex gap-8 items-center bg-black/40 px-6 py-4 rounded-lg border border-white/5 font-mono">
          <div className="space-y-1">
            <div className="text-[9px] font-bold uppercase tracking-widest opacity-40">Reasoning Qual.</div>
            <div className="text-xl font-bold text-[#22c55e] uppercase">
              {selectedModel?.capabilities.thinking || "N/A"}
            </div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="space-y-1">
            <div className="text-[9px] font-bold uppercase tracking-widest opacity-40">Multimodality</div>
            <div className="text-xl font-bold text-white uppercase">
              {selectedModel?.capabilities.multimodal || "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile View */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-8">
          {selectedModel && (
            <div className="p-8 rounded-2xl border border-[#1a1a1a] bg-[#111]/20 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#22c55e]" />
              <div className="relative z-10 space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono text-[#22c55e] mb-1">
                      ARCH ID: {selectedModel.id.toUpperCase()}
                    </div>
                    <h2 className="text-5xl font-bold tracking-tighter uppercase">{selectedModel.name}</h2>
                    <p className="text-[#888] font-mono text-xs uppercase tracking-widest mt-1">
                      Status: Operational Insight Active
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {(selectedModel.id.includes("31b") || selectedModel.id.includes("26b")) && (
                      <div className="px-3 py-1.5 rounded bg-[#22c55e]/10 border border-[#22c55e]/30 text-[10px] font-mono text-[#22c55e] flex items-center gap-2">
                        <Brain className="w-3 h-3" />
                        ITERATIVE THINKING ENABLED
                      </div>
                    )}
                    <div className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/60 flex items-center gap-2">
                      <Zap className="w-3 h-3" />
                      {selectedModel.type}
                    </div>
                  </div>
                </div>
                <div className="max-w-3xl text-sm leading-relaxed text-[#aaa] border-l-2 border-[#222] pl-6 italic">
                  "The {selectedModel.name} represents a breakthrough in{" "}
                  {selectedModel.target.toLowerCase().includes("reasoning")
                    ? "structural reasoning logic"
                    : "multimodal parameter efficiency"}
                  , leveraging unified weights for seamless perception."
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-[#1a1a1a] bg-[#111]/40 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#22c55e] flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                SOTA Quality Benchmarks
              </h3>
              <div className="space-y-5 pt-2">
                {selectedModel?.capabilities.benchmarks
                  ?.filter((b) => ["GSM8K", "MATH", "HumanEval", "MMLU"].includes(b.metric))
                  .map((b) => (
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
                {selectedModel?.capabilities.benchmarks
                  ?.filter((b) => ["Perplexity", "Latency (ms)", "Tokens/sec"].includes(b.metric))
                  .map((b) => (
                    <div
                      key={b.metric}
                      className="p-3 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="text-[8px] font-mono uppercase opacity-40 leading-none">{b.metric}</div>
                        <div className="text-sm font-bold text-white tracking-widest">
                          {b.value}
                          {b.metric === "Tokens/sec"
                            ? " t/s"
                            : b.metric === "Perplexity"
                            ? ""
                            : "ms"}
                        </div>
                      </div>
                      <div className="w-24 h-1 bg-[#22c55e]/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width:
                              b.metric === "Perplexity"
                                ? `${(15 - b.value) * 6.6}%`
                                : b.metric === "Tokens/sec"
                                ? `${(b.value / 150) * 100}%`
                                : `${(1000 - b.value) / 10}%`,
                          }}
                          className={`h-full ${
                            b.metric === "Perplexity" || b.metric === "Latency (ms)"
                              ? "bg-amber-500"
                              : "bg-[#22c55e]"
                          }`}
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
              <ErrorDisplay
                error={error}
                onRetry={fetchData}
                onShowKeySettings={onShowKeySettings}
                onClearKey={onClearKey}
              />
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
                {selectedModel && (
                  <div
                    className={`mb-8 p-6 rounded-2xl border ${
                      selectedModel.type === "Mixture of Experts"
                        ? "border-purple-500/30 bg-purple-500/5"
                        : selectedModel.id.includes("31b")
                        ? "border-blue-500/30 bg-blue-500/5"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          selectedModel.type === "Mixture of Experts"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {selectedModel.type === "Mixture of Experts" ? (
                          <Database className="w-6 h-6" />
                        ) : (
                          <Brain className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-black uppercase tracking-tight text-lg">
                          {selectedModel.type === "Mixture of Experts"
                            ? "Expert-Routing Intelligence Corridors"
                            : "Unified Dense Synthesis Engine"}
                        </h4>
                        <p className="text-xs text-white/40 uppercase tracking-widest font-mono">
                          {selectedModel.type === "Mixture of Experts"
                            ? "Sparse Activation // Specialist Modular Cognition"
                            : "Continuous Causal Reasoning // Holistic Abstraction"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

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
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={selectedModel?.capabilities.scores || []}
                >
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#888", fontSize: 8 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name={selectedModel?.name}
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
                { label: "Vision Core", value: selectedModel?.capabilities.image },
                { label: "Audio Core", value: selectedModel?.capabilities.audio },
                { label: "Video Engine", value: selectedModel?.capabilities.video },
                { label: "Logic Engine", value: selectedModel?.capabilities.coding },
              ].map((spec) => (
                <div key={spec.label} className="flex flex-col p-3 bg-black/20 rounded border border-white/5">
                  <span className="opacity-50 uppercase text-[8px] font-mono tracking-widest">
                    {spec.label}
                  </span>
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
              <span className="text-[10px] font-mono text-[#22c55e] font-bold">
                {selectedModelIdx > 1 ? "Enterprise" : "Edge"}
              </span>
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
  );
}
