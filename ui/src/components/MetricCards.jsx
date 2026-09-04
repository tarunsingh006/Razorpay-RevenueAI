export default function MetricCards({ data }) {
  const { summary, actions } = data;

  const cards = [
    {
      label: "Revenue At Risk",
      value: `₹${summary.total_at_risk_inr.toLocaleString("en-IN")}`,
      sub: `${summary.total_failed} failed payments`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      iconBg: "bg-red-500/10",
      accent: "text-red-400",
      border: "border-red-500/20",
    },
    {
      label: "Recoverable",
      value: `₹${Math.round(summary.total_at_risk_inr * 0.47).toLocaleString("en-IN")}`,
      sub: "AI-identified opportunity",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#FBBF24" strokeWidth="2"/>
          <path d="M12 6v6l4 2" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      iconBg: "bg-yellow-500/10",
      accent: "text-yellow-400",
      border: "border-yellow-500/20",
    },
    {
      label: "Recovered",
      value: `₹${summary.total_recovered_inr.toLocaleString("en-IN")}`,
      sub: "Successfully recovered",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#34D399" strokeWidth="2" strokeLinecap="round"/>
          <path d="M22 4L12 14.01l-3-3" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      iconBg: "bg-green-500/10",
      accent: "text-green-400",
      border: "border-green-500/20",
    },
    {
      label: "Recovery Rate",
      value: `${summary.recovery_rate_percent}%`,
      sub: "vs 5% baseline",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M18 20V10M12 20V4M6 20v-6" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      iconBg: "bg-blue-500/10",
      accent: "text-blue-400",
      border: "border-blue-500/20",
    },
    {
      label: "Active Cases",
      value: actions.notifications_sent,
      sub: "In recovery pipeline",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="9" cy="7" r="4" stroke="#A78BFA" strokeWidth="2"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      iconBg: "bg-purple-500/10",
      accent: "text-purple-400",
      border: "border-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((c) => (
        <div key={c.label} className={`bg-[#131929] rounded-xl p-5 border ${c.border} flex flex-col gap-3`}>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">{c.label}</span>
            <div className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center`}>{c.icon}</div>
          </div>
          <div className={`text-2xl font-bold ${c.accent}`}>{c.value}</div>
          <div className="text-gray-500 text-xs">{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
