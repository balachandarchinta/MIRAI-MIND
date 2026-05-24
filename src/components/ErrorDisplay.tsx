import { ShieldAlert, Key } from "lucide-react";

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
  onShowKeySettings: () => void;
  onClearKey: () => void;
}

export default function ErrorDisplay({ error, onRetry, onShowKeySettings, onClearKey }: ErrorDisplayProps) {
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
              onClick={onShowKeySettings}
              className="text-xs uppercase tracking-widest font-bold px-8 py-4 bg-[#22c55e]/10 border border-[#22c55e]/30 hover:bg-[#22c55e]/20 hover:border-[#22c55e]/50 text-[#22c55e] rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              Update API Key
            </button>
            <button 
              onClick={onClearKey}
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
}
