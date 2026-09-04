const NAV_LINKS = ["Home", "Dashboard", "Cases", "Audit", "AI Center", "Evaluation", "Settings"];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-[#1E2A3A] bg-[#0B0F19]/95 backdrop-blur">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#00D4AA22] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-white font-semibold text-lg tracking-tight">RevGuard AI</span>
      </div>

      <div className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map((link) => (
          <button key={link} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            link === "Dashboard"
              ? "bg-[#00D4AA22] text-[#00D4AA] border border-[#00D4AA44]"
              : "text-gray-400 hover:text-white hover:bg-[#1E2A3A]"
          }`}>
            {link}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-500/40 bg-yellow-500/10">
          <span className="text-yellow-400 text-xs">⚠️</span>
          <span className="text-yellow-400 text-xs font-medium">DEMO MODE — No Real Payments</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4AA] to-[#0891b2] flex items-center justify-center text-xs font-bold text-[#0B0F19]">
          TA
        </div>
      </div>
    </nav>
  );
}