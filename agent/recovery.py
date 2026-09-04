import random
from datetime import datetime

MAX_RETRY_ATTEMPTS = 3  # GUARDRAIL: Never retry more than 3 times

def _simulate_retry(transaction):
    """Simulate a payment retry. 60% success rate for realistic demo."""
    return random.random() < 0.60

def _simulate_notification(transaction):
    """Simulate sending WhatsApp/email nudge. Always succeeds (message sent)."""
    channel = "WhatsApp" if transaction.get("phone") else "Email"
    return {
        "channel": channel,
        "contact": transaction.get("phone") or transaction.get("email"),
        "message": f"Hi {transaction['customer'].split()[0]}, your payment of ₹{transaction['amount']} failed. "
                   f"Click here to update your payment: https://pay.example.com/fix/{transaction['txn_id']}"
    }

def process_recovery(diagnosed_transaction):
    """
    Execute the right recovery action based on diagnosis.
    Returns a recovery result dict with action taken and outcome.
    """
    txn = diagnosed_transaction
    category = txn["diagnosis"]["category"]
    action = txn["diagnosis"]["action"]
    retry_count = txn.get("retry_count", 0)
    timestamp = datetime.utcnow().isoformat() + "Z"

    # --- GUARDRAIL: Hard stop at MAX_RETRY_ATTEMPTS ---
    if retry_count >= MAX_RETRY_ATTEMPTS:
        return {
            "txn_id": txn["txn_id"],
            "customer": txn["customer"],
            "amount": txn["amount"],
            "action_taken": "BLOCKED_BY_GUARDRAIL",
            "outcome": "skipped",
            "recovered": 0,
            "note": f"GUARDRAIL TRIGGERED: Already attempted {retry_count} times. Max is {MAX_RETRY_ATTEMPTS}. No further retries to prevent customer spam.",
            "timestamp": timestamp
        }

    # --- RETRIABLE: Auto-retry ---
    if action == "schedule_retry":
        success = _simulate_retry(txn)
        return {
            "txn_id": txn["txn_id"],
            "customer": txn["customer"],
            "amount": txn["amount"],
            "action_taken": "AUTO_RETRY",
            "outcome": "recovered" if success else "retry_failed",
            "recovered": txn["amount"] if success else 0,
            "note": f"Retry attempt #{retry_count + 1}. {'Payment succeeded.' if success else 'Payment still failing, will retry later.'}",
            "timestamp": timestamp
        }

    # --- USER_ACTION: Send notification ---
    if action == "send_notification":
        notification = _simulate_notification(txn)
        return {
            "txn_id": txn["txn_id"],
            "customer": txn["customer"],
            "amount": txn["amount"],
            "action_taken": "NOTIFICATION_SENT",
            "outcome": "awaiting_user",
            "recovered": 0,
            "note": f"{notification['channel']} sent to {notification['contact']}: \"{notification['message']}\"",
            "timestamp": timestamp
        }

    # --- TERMINAL: Skip and flag ---
    return {
        "txn_id": txn["txn_id"],
        "customer": txn["customer"],
        "amount": txn["amount"],
        "action_taken": "FLAGGED_TERMINAL",
        "outcome": "skipped",
        "recovered": 0,
        "note": f"TERMINAL: {txn['diagnosis']['reason']} Flagged for manual review.",
        "timestamp": timestamp
    }

def process_batch(diagnosed_transactions):
    return [process_recovery(t) for t in diagnosed_transactions]
