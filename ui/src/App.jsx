import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import MetricCards from "./components/MetricCards";
import FunnelChart from "./components/FunnelChart";
import RevenueChart from "./components/RevenueChart";
import BaselineChart from "./components/BaselineChart";
import RecentCases from "./components/RecentCases";
import GuardrailsPanel from "./components/GuardrailsPanel";

const REFRESH_MS = 30000;

export default function App() {
  const [auditData, setAuditData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [auditRes, txnRes] = await Promise.all([
        fetch("/api/overview"),
        fetch("/api/transactions"),
      ]);
      const [audit, txn] = await Promise.all([auditRes.json(), txnRes.json()]);
      setAuditData(audit);
      setTransactions(txn);
      setLastRun(new Date());
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    }
  }, []);

  const runAudit = useCallback(async () => {
    setRunning(true);
    try {
      const res = await fetch("/api/run", { method: "POST" });
      const body = await res.json();
      if (body.success) {
        setAuditData(body.data);
        setLastRun(new Date());
      }
    } catch (err) {
      console.error("Failed to run audit:", err);
    } finally {
      setRunning(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const id = setInterval(loadData, REFRESH_MS);
    return () => clearInterval(id);
  }, [loadData]);

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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
              Live
              {lastRun ? (
                <span>· Updated {lastRun.toLocaleTimeString()}</span>
              ) : (
                <span>· Connecting…</span>
              )}
            </div>
            <button
              onClick={runAudit}
              disabled={running}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00D4AA] text-[#0B0F19] text-sm font-semibold hover:bg-[#00D4AA]/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {running ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#0B0F19] border-t-transparent rounded-full animate-spin" />
                  Running…
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12a8 8 0 118 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 12V7m0 5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Run Audit
                </>
              )}
            </button>
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
