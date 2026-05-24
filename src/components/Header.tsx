import {
  Activity,
  Brain,
  Grid3X3,
  Timer,
  Zap,
  Settings,
} from "lucide-react";

interface HeaderProps {
  activeTab: "profiles" | "comparative" | "simulations" | "lab";
  setActiveTab: (tab: "profiles" | "comparative" | "simulations" | "lab") => void;
  showKeySettings: boolean;
  setShowKeySettings: (show: boolean) => void;
  isFallback?: boolean;
}

export default function Header({
  activeTab,
  setActiveTab,
  showKeySettings,
  setShowKeySettings,
  isFallback,
}: HeaderProps) {
  const tabs = [
    { id: "lab", label: "Intelligence Lab", icon: Zap },
    { id: "profiles", label: "Model Reasoning", icon: Brain },
    { id: "comparative", label: "Capability Matrix", icon: Grid3X3 },
    { id: "simulations", label: "Future Drift", icon: Timer },
  ] as const;

  return (
    <header className="border-b border-[#1a1a1a] p-4 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-50">
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
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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
            <div className={`w-1.5 h-1.5 rounded-full ${isFallback ? 'bg-amber-500' : 'bg-[#22c55e]'} animate-pulse`} />
            <span>STATUS: {isFallback ? 'STABILIZED MODE (HIGH LOAD)' : 'OPTIMAL (GEMINI-3)'}</span>
          </div>
          <span>Uptime: 172:14:02</span>
        </div>
      </div>
    </header>
  );
}
