export default function GuardrailsPanel({ data }) {
  const { guardrails, actions, error_breakdown } = data;

  const rules = [
    {
      title: "Max Retry Cap",
      desc: `Hard limit of ${guardrails.max_retry_cap} retries per transaction`,
      status: `${guardrails.guardrail_triggers} blocked`,
      icon: "🛡️",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    },
    {
      title: "Terminal Skip",
      desc: "FRAUD_BLOCK transactions never retried",
      status: `${guardrails.terminal_skips} skipped`,
      icon: "🚫",
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
    {
      title: "Smart Notifications",
      desc: "User nudges sent only for actionable failures",
      status: `${actions.notifications_sent} sent`,
      icon: "📲",
      color: "text-teal-400",
      bg: "bg-teal-500/10",
      border: "border-teal-500/20",
    },
    {
      title: "Auto Retry Engine",
      desc: "Retriable failures retried with backoff",
      status: `${actions.auto_retries_succeeded}/${actions.auto_retries_attempted} succeeded`,
      icon: "⚡",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
  ];

  const breakdown = [
    { code: "GATEWAY_TIMEOUT", label: "Gateway Timeout", count: error_breakdown.GATEWAY_TIMEOUT?.count || 0, color: "bg-blue-400" },
    { code: "INSUFFICIENT_FUNDS", label: "Insufficient Funds", count: error_breakdown.INSUFFICIENT_FUNDS?.count || 0, color: "bg-yellow-400" },
    { code: "EXPIRED_CARD", label: "Expired Card", count: error_breakdown.EXPIRED_CARD?.count || 0, color: "bg-orange-400" },
    { code: "FRAUD_BLOCK", label: "Fraud Block", count: error_breakdown.FRAUD_BLOCK?.count || 0, color: "bg-red-400" },
  ];
  const total = breakdown.reduce((s, b) => s + b.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Guardrail Rules */}
      <div className="bg-[#131929] rounded-xl p-6 border border-[#1E2A3A]">
        <h3 className="text-white font-semibold text-base mb-1">Safety Guardrails</h3>
        <p className="text-gray-500 text-xs mb-4">Production-ready rules in action</p>
        <div className="flex flex-col gap-3">
          {rules.map((r) => (
            <div key={r.title} className={`flex items-center justify-between p-3 rounded-lg border ${r.bg} ${r.border}`}>
              <div className="flex items-center gap-3">
                <span className="text-lg">{r.icon}</span>
                <div>
                  <p className={`text-xs font-semibold ${r.color}`}>{r.title}</p>
                  <p className="text-gray-500 text-xs">{r.desc}</p>
                </div>
              </div>
              <span className={`text-xs font-bold ${r.color} whitespace-nowrap`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Breakdown */}
      <div className="bg-[#131929] rounded-xl p-6 border border-[#1E2A3A]">
        <h3 className="text-white font-semibold text-base mb-1">Failure Breakdown</h3>
        <p className="text-gray-500 text-xs mb-4">Distribution of error codes in batch</p>
        <div className="flex flex-col gap-4">
          {breakdown.map((b) => (
            <div key={b.code}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-gray-300 text-xs font-medium">{b.label}</span>
                <span className="text-gray-400 text-xs">{b.count} / {total}</span>
              </div>
              <div className="w-full bg-[#1E2A3A] rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${b.color}`}
                  style={{ width: `${(b.count / total) * 100}%`, opacity: 0.8 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
