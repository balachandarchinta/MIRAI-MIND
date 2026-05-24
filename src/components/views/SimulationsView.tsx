import { motion } from "motion/react";
import {
  Timer,
  Zap,
  TrendingUp,
  ShieldAlert,
  Clock,
  Search,
  ChevronRight
} from "lucide-react";
import { AnalysisData } from "../../types";
import ErrorDisplay from "../ErrorDisplay";

interface SimulationsViewProps {
  analysis: AnalysisData | null;
  error: string | null;
  fetchData: () => void;
  onShowKeySettings: () => void;
  onClearKey: () => void;
}

export default function SimulationsView({
  analysis,
  error,
  fetchData,
  onShowKeySettings,
  onClearKey,
}: SimulationsViewProps) {
  return (
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

      {error ? (
        <ErrorDisplay
          error={error}
          onRetry={fetchData}
          onShowKeySettings={onShowKeySettings}
          onClearKey={onClearKey}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {analysis?.simulations?.map((sim, idx) => {
              const severityConfig = {
                stable: {
                  color: "text-blue-400",
                  border: "border-blue-500/30",
                  bg: "bg-blue-500/5",
                  icon: Zap,
                  label: "Stable/Stagnant",
                },
                adaptive: {
                  color: "text-amber-400",
                  border: "border-amber-500/30",
                  bg: "bg-amber-500/5",
                  icon: TrendingUp,
                  label: "Adaptive/Growth",
                },
                critical: {
                  color: "text-red-400",
                  border: "border-red-500/30",
                  bg: "bg-red-500/5",
                  icon: ShieldAlert,
                  label: "Critical/Emergency",
                },
              }[sim.severity as "stable" | "adaptive" | "critical"] || {
                color: "text-white",
                border: "border-white/10",
                bg: "bg-white/5",
                icon: Timer,
                label: "Unknown",
              };

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
                      <div
                        className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 ${severityConfig.color} flex items-center gap-2`}
                      >
                        <severityConfig.icon className="w-3 h-3" />
                        {severityConfig.label}
                      </div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                        {sim.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${severityConfig.color} animate-pulse`} />
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest leading-none">
                          Status: {sim.status}
                        </span>
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
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-3">
                          AI Interpretation
                        </div>
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
            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40 mb-12">
              Predictive Escalation Path
            </h4>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-4xl mx-auto">
              {(analysis?.predictiveEscalationPath || [
                "Metabolic Drift",
                "Circadian Dysregulation",
                "Cognitive Degradation",
                "Systemic Burnout",
              ]).map((step, idx, arr) => (
                <div key={idx} className="flex flex-col md:flex-row items-center gap-6 group">
                  <div className="px-8 py-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl relative group-hover:border-red-500/30 transition-all duration-700">
                    {idx === arr.length - 1 && (
                      <div className="absolute -top-1 -right-1">
                        <div className="p-1 bg-red-500 rounded-full animate-ping opacity-75" />
                      </div>
                    )}
                    <span
                      className={`text-xs font-black uppercase tracking-[0.2em] ${
                        idx === arr.length - 1 ? "text-red-500" : "text-white/60"
                      }`}
                    >
                      {step}
                    </span>
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
        </>
      )}
    </motion.div>
  );
}
