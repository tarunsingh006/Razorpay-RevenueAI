# Diagnosis rules — maps error codes to recovery categories
# RETRIABLE   : Temporary issue, safe to auto-retry
# USER_ACTION : Needs customer to fix something (card update, top-up)
# TERMINAL    : Permanent block, do not retry, flag for manual review

DIAGNOSIS_MAP = {
    "GATEWAY_TIMEOUT": {
        "category": "RETRIABLE",
        "reason": "Bank/gateway server timed out temporarily. Auto-retry after delay is safe.",
        "action": "schedule_retry"
    },
    "INSUFFICIENT_FUNDS": {
        "category": "USER_ACTION",
        "reason": "Customer account has low balance. Retry will keep failing until customer tops up.",
        "action": "send_notification"
    },
    "EXPIRED_CARD": {
        "category": "USER_ACTION",
        "reason": "Card on file is expired. Customer must update payment method.",
        "action": "send_notification"
    },
    "FRAUD_BLOCK": {
        "category": "TERMINAL",
        "reason": "Transaction flagged by fraud detection system. Retrying risks further security flags.",
        "action": "skip_and_flag"
    }
}

def diagnose(transaction):
    """Attach diagnosis metadata to a failed transaction."""
    error_code = transaction.get("error_code", "UNKNOWN")
    diagnosis = DIAGNOSIS_MAP.get(error_code, {
        "category": "TERMINAL",
        "reason": "Unknown error code. Cannot determine safe recovery path.",
        "action": "skip_and_flag"
    })
    return {**transaction, "diagnosis": diagnosis}

def diagnose_batch(failed_transactions):
    return [diagnose(t) for t in failed_transactions]
