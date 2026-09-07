# Razorpay RevenueAI — Payment Recovery Agent

AI-powered revenue recovery agent for failed Razorpay payments. Detects failed transactions, diagnoses why they failed, and takes safe recovery actions — with guardrails to prevent over-retrying or spamming customers.

> **Status: Demo / simulated.** Recovery actions are simulated, not sent to the real Razorpay API. See [Current limitations](#current-limitations--what-is-real-vs-simulated).

---

## Project structure

```
RazorpayAI/
├── main.py              # CLI entry point (~ python main.py)
├── pipeline.py          # Shared pipeline logic (used by CLI + API server)
├── api.py               # FastAPI server exposing the pipeline over HTTP
├── requirements.txt     # Python deps (fastapi, uvicorn)
├── agent/
│   ├── detector.py      # Load transactions, filter failed ones
│   ├── diagnoser.py     # Map error codes -> recovery category (rule-based)
│   ├── recovery.py      # Execute recovery action (currently simulated)
│   └── audit.py         # Compute dashboard metrics / audit report
├── data/
│   └── transactions.json  # Sample transaction data (60 records)
├── audit_report.json    # Latest generated audit (root copy)
└── ui/                  # React + Vite dashboard (frontend)
```

## How the pipeline works

One run goes through 4 steps:

| Step | Module | What it does |
|------|--------|--------------|
| 1. Detection | `agent/detector.py` | Reads all transactions, keeps `status == "failed"` |
| 2. Diagnosis | `agent/diagnoser.py` | `error_code` → category via rule map |
| 3. Recovery | `agent/recovery.py` | Takes the matching recovery action |
| 4. Audit | `agent/audit.py` | Tallies results into the dashboard JSON |

### Diagnosis rules (`agent/diagnoser.py`)

| Error code | Category | Action |
|-----------|----------|--------|
| `GATEWAY_TIMEOUT` | RETRIABLE | Auto-retry after delay (guardrail: max 3) |
| `INSUFFICIENT_FUNDS` | USER_ACTION | Notify customer to top up |
| `EXPIRED_CARD` | USER_ACTION | Notify customer to update card |
| `FRAUD_BLOCK` | TERMINAL | Skip & flag for manual review (never retried) |

### Guardrails (`agent/recovery.py`)

- Max **3 retries** per transaction (`BLOCKED_BY_GUARDRAIL`)
- Fraud blocks are terminal — never retried (`FLAGGED_TERMINAL`)
- Notifications only for actionable, user-fixable failures

## Running the app

### 1. Start the backend (FastAPI)

```bash
pip install -r requirements.txt
uvicorn api:app --reload     # http://localhost:8000
```

### 2. Start the frontend (Vite)

```bash
cd ui
npm install
npm run dev                  # http://localhost:5173
```

Vite proxies `/api/*` requests to the backend, so the dashboard shows live data.

### CLI mode (no server)

```bash
python main.py
```

Runs the pipeline once and prints the report / writes `audit_report.json`.

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server status |
| `GET` | `/api/overview` | Latest audit data (metrics, guardrails, activity log) |
| `GET` | `/api/transactions` | Raw transaction data |
| `POST` | `/api/run` | Re-runs the full AI pipeline, returns fresh results |

The dashboard auto-refreshes every 30s and has a **Run Audit** button that calls `/api/run`.

## Current limitations — what is real vs simulated

- ❌ Recovery is **simulated** — retries use a fixed 60% random chance, no real Razorpay calls, no real customer notifications.
- ❌ Diagnosis is **rule-based** — a static error-code lookup table. It does **not** learn from past records / history.
- ❌ No ML — nothing predicts recoverability or the best retry window.
- ✅ The real bits: pipeline architecture, guardrails, audit metrics, live dashboard wiring, FastAPI + React setup.

## Next steps (planned roadmap)

1. **Real Razorpay integration** — call the actual payment/order APIs for retries and notifications; read real transaction history.
2. **Historical learning** — analyze past recovery attempts by card, error, time, customer to drive smarter retry decisions.
3. **ML scoring layer** — predict per-transaction recoverability and best recovery action.