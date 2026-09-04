import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import MetricCards from "./components/MetricCards";
import FunnelChart from "./components/FunnelChart";
import RevenueChart from "./components/RevenueChart";
import BaselineChart from "./components/BaselineChart";
import RecentCases from "./components/RecentCases";
import GuardrailsPanel from "./components/GuardrailsPanel";

export default function App() {
  const [auditData, setAuditData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("/audit_report.json").then((r) => r.json()).then(setAuditData);
    fetch("/transactions.json").then((r) => r.json()).then(setTransactions);
  }, []);

  if (!auditData) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#00D4AA] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading RecoverAI dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <Navbar />

      <main className="pt-24 pb-12 px-6 md:px-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Revenue recovery overview and key metrics</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            Live · Last run just now
          </div>
        </div>

        {/* Metric Cards */}
        <section className="mb-6">
          <MetricCards data={auditData} />
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <FunnelChart data={auditData} />
          <RevenueChart />
        </section>

        {/* Baseline vs RecoverAI full width */}
        <section className="mb-6">
          <BaselineChart />
        </section>

        {/* Guardrails + Error Breakdown */}
        <section className="mb-6">
          <GuardrailsPanel data={auditData} />
        </section>

        {/* Recent Cases */}
        <section>
          <RecentCases data={auditData} transactions={transactions} />
        </section>
      </main>
    </div>
  );
}
