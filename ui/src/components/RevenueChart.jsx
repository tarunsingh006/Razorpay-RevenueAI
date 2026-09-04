import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

const weeklyData = [
  { day: "Mon", recoverai: 1200, baseline: 800 },
  { day: "Tue", recoverai: 2800, baseline: 900 },
  { day: "Wed", recoverai: 3500, baseline: 1100 },
  { day: "Thu", recoverai: 5200, baseline: 1200 },
  { day: "Fri", recoverai: 9800, baseline: 1400 },
  { day: "Sat", recoverai: 7200, baseline: 1300 },
  { day: "Sun", recoverai: 6100, baseline: 1100 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#1E2A3A] border border-[#2A3A4A] rounded-lg px-3 py-2 text-sm">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="font-medium">
            {p.name === "recoverai" ? "RecoverAI" : "Baseline"}: ₹{p.value.toLocaleString("en-IN")}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueChart() {
  return (
    <div className="bg-[#131929] rounded-xl p-6 border border-[#1E2A3A]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-base">Revenue Recovered</h3>
          <p className="text-gray-500 text-xs mt-1">Weekly recovery performance</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="w-6 h-0.5 bg-[#00D4AA] inline-block rounded" />RecoverAI
          </span>
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="w-6 border-t border-dashed border-gray-500 inline-block" />Baseline
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={weeklyData} margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3A" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false}
            tickFormatter={(v) => `₹${v / 1000}k`} domain={[0, 10000]} ticks={[0, 3000, 5000, 8000, 10000]} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="recoverai" stroke="#00D4AA" strokeWidth={2.5} dot={{ fill: "#00D4AA", r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="baseline" stroke="#4B5563" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
