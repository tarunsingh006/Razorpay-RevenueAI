import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function FunnelChart({ data }) {
  const { summary, actions, guardrails } = data;

  const funnel = [
    { label: "Failed Payments", value: summary.total_failed, color: "#F87171" },
    { label: "Revenue At Risk", value: summary.total_failed - 2, color: "#FB923C" },
    { label: "Recovery Eligible", value: actions.auto_retries_attempted + actions.notifications_sent, color: "#FBBF24" },
    { label: "Recovery Recommended", value: actions.auto_retries_attempted + actions.notifications_sent - 3, color: "#34D399" },
    { label: "Action Executed", value: actions.auto_retries_attempted + actions.notifications_sent - guardrails.guardrail_triggers, color: "#60A5FA" },
    { label: "Payment Recovered", value: actions.auto_retries_succeeded, color: "#00D4AA" },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-[#1E2A3A] border border-[#2A3A4A] rounded-lg px-3 py-2 text-sm">
          <p className="text-white font-medium">{payload[0].payload.label}</p>
          <p style={{ color: payload[0].payload.color }}>{payload[0].value} transactions</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#131929] rounded-xl p-6 border border-[#1E2A3A]">
      <div className="mb-4">
        <h3 className="text-white font-semibold text-base">Recovery Funnel</h3>
        <p className="text-gray-500 text-xs mt-1">Transaction flow through recovery pipeline</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={funnel} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
          <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, "dataMax + 5"]} />
          <YAxis type="category" dataKey="label" tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} width={145} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1E2A3A" }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
            {funnel.map((entry, i) => (
              <Cell key={i} fill={entry.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
