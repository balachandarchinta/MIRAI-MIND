import { motion } from "motion/react";
import { Grid3X3, Zap, Activity, Brain, ChevronRight } from "lucide-react";
import { AnalysisData } from "../../types";
import ErrorDisplay from "../ErrorDisplay";

interface ComparativeViewProps {
  analysis: AnalysisData | null;
  error: string | null;
  fetchData: () => void;
  onShowKeySettings: () => void;
  onClearKey: () => void;
}

export default function ComparativeView({
  analysis,
  error,
  fetchData,
  onShowKeySettings,
  onClearKey,
}: ComparativeViewProps) {
  return (
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
          <ErrorDisplay
            error={error}
            onRetry={fetchData}
            onShowKeySettings={onShowKeySettings}
            onClearKey={onClearKey}
          />
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
  );
}
