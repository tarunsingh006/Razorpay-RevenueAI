import json
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pipeline import run_pipeline

ROOT = Path(__file__).resolve().parent
AUDIT_PATH = ROOT / "audit_report.json"
TRANSACTIONS_PATH = ROOT / "data" / "transactions.json"

app = FastAPI(title="Razorpay AI Recovery Agent API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _load_audit():
    if AUDIT_PATH.exists():
        return json.loads(AUDIT_PATH.read_text(encoding="utf-8"))
    return run_pipeline()


def _load_transactions():
    return json.loads(TRANSACTIONS_PATH.read_text(encoding="utf-8"))


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/overview")
def overview():
    return _load_audit()


@app.get("/api/transactions")
def transactions():
    return _load_transactions()


@app.post("/api/run")
def run_audit():
    audit = run_pipeline()
    return {"success": True, "data": audit}