import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Key, Eye, EyeOff } from "lucide-react";

interface ApiKeyModalProps {
  showKeySettings: boolean;
  setShowKeySettings: (show: boolean) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  fetchData: () => void;
}

export default function ApiKeyModal({
  showKeySettings,
  setShowKeySettings,
  apiKey,
  setApiKey,
  fetchData,
}: ApiKeyModalProps) {
  const [isKeyVisible, setIsKeyVisible] = useState(false);

  return (
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
  );
}
