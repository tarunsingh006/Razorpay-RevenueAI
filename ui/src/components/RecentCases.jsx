const ACTION_STYLES = {
  AUTO_RETRY: { label: "Auto Retry", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  NOTIFICATION_SENT: { label: "Notified", bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/20" },
  FLAGGED_TERMINAL: { label: "Terminal", bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  BLOCKED_BY_GUARDRAIL: { label: "Guardrail", bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
};

const OUTCOME_STYLES = {
  recovered: { label: "Recovered", color: "text-green-400" },
  retry_failed: { label: "Retry Failed", color: "text-orange-400" },
  awaiting_user: { label: "Awaiting User", color: "text-blue-400" },
  skipped: { label: "Skipped", color: "text-gray-500" },
};

const ERROR_LABELS = {
  GATEWAY_TIMEOUT: "Gateway Timeout",
  INSUFFICIENT_FUNDS: "Insufficient Funds",
  EXPIRED_CARD: "Expired Card",
  FRAUD_BLOCK: "Fraud Block",
};

export default function RecentCases({ data, transactions }) {
  const log = data.activity_log.slice(0, 10);

  const txnMap = {};
  transactions.forEach((t) => { txnMap[t.txn_id] = t; });

  return (
    <div className="bg-[#131929] rounded-xl border border-[#1E2A3A]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2A3A]">
        <div>
          <h3 className="text-white font-semibold text-base">Recent Cases</h3>
          <p className="text-gray-500 text-xs mt-0.5">Latest recovery activity log</p>
        </div>
        <span className="text-xs text-[#00D4AA] bg-[#00D4AA11] border border-[#00D4AA33] px-3 py-1 rounded-full">
          {data.activity_log.length} total actions
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1E2A3A]">
              {["Transaction", "Customer", "Amount", "Error", "Action", "Outcome", "Recovered"].map((h) => (
                <th key={h} className="text-left text-gray-500 text-xs font-medium uppercase tracking-wider px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {log.map((row, i) => {
              const txn = txnMap[row.txn_id] || {};
              const action = ACTION_STYLES[row.action_taken] || { label: row.action_taken, bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/20" };
              const outcome = OUTCOME_STYLES[row.outcome] || { label: row.outcome, color: "text-gray-400" };
              return (
                <tr key={i} className="border-b border-[#1E2A3A]/50 hover:bg-[#1E2A3A]/30 transition-colors">
                  <td className="px-6 py-4 text-[#00D4AA] font-mono text-xs">{row.txn_id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00D4AA44] to-[#0891b244] flex items-center justify-center text-xs font-semibold text-[#00D4AA]">
                        {row.customer.charAt(0)}
                      </div>
                      <span className="text-white text-xs">{row.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white font-medium text-xs">₹{row.amount.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{ERROR_LABELS[txn.error_code] || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${action.bg} ${action.text} ${action.border}`}>
                      {action.label}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-xs font-medium ${outcome.color}`}>{outcome.label}</td>
                  <td className="px-6 py-4 text-xs font-semibold">
                    {row.recovered > 0
                      ? <span className="text-green-400">₹{row.recovered.toLocaleString("en-IN")}</span>
                      : <span className="text-gray-600">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
