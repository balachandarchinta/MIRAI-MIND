import { motion } from "motion/react";
import { Brain, Zap, BarChart3, TrendingUp } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";
import { ModelData } from "../../types";

interface LabViewProps {
  customProfile: string;
  setCustomProfile: (profile: string) => void;
  loading: boolean;
  fetchData: (profile?: string) => void;
  models: ModelData[];
}

export default function LabView({
  customProfile,
  setCustomProfile,
  loading,
  fetchData,
  models,
}: LabViewProps) {
  return (
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
  );
}
