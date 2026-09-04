import json
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "transactions.json")

def load_transactions():
    with open(DATA_PATH, "r") as f:
        return json.load(f)

def detect_failures(transactions):
    """Return only failed transactions with their risk amount."""
    failed = [t for t in transactions if t["status"] == "failed"]
    total_at_risk = sum(t["amount"] for t in failed)
    return failed, total_at_risk
