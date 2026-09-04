import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const comparisonData = [
  { label: "Jan", baseline: 1200, recoverai: 1200 },
  { label: "Feb", baseline: 1400, recoverai: 2800 },
  { label: "Mar", baseline: 1100, recoverai: 4200 },
  { label: "Apr", baseline: 1600, recoverai: 5900 },
  { label: "May", baseline: 1300, recoverai: 7400 },
  { label: "Jun", baseline: 1500, recoverai: 9100 },
  { label: "Jul", baseline: 1200, recoverai: 8600 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#1E2A3A] border border-[#2A3A4A] rounded-lg px-3 py-2 text-sm">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.fill }} className="font-medium">
            {p.name === "recoverai" ? "RecoverAI" : "Baseline"}: ₹{p.value.toLocaleString("en-IN")}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function BaselineChart() {
  return (
    <div className="bg-[#131929] rounded-xl p-6 border border-[#1E2A3A]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-base">Baseline vs RecoverAI</h3>
          <p className="text-gray-500 text-xs mt-1">Monthly recovery comparison</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-gray-400"><span className="w-3 h-3 rounded-sm bg-[#374151] inline-block" />Baseline</span>
          <span className="flex items-center gap-1.5 text-gray-400"><span className="w-3 h-3 rounded-sm bg-[#00D4AA] inline-block" />RecoverAI</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={comparisonData} margin={{ left: 0, right: 10, top: 5, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3A" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false}
            tickFormatter={(v) => `₹${v}`} ticks={[0, 2500, 5000, 7500, 10000]} domain={[0, 10000]} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1E2A3A55" }} />
          <Bar dataKey="baseline" fill="#374151" radius={[4, 4, 0, 0]} barSize={18} />
          <Bar dataKey="recoverai" fill="#00D4AA" radius={[4, 4, 0, 0]} barSize={18} fillOpacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
