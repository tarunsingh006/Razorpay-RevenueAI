from collections import defaultdict

def generate_audit(all_transactions, failed_transactions, recovery_results):
    """Compute full audit metrics and activity log."""

    total_transactions = len(all_transactions)
    total_failed = len(failed_transactions)
    total_at_risk = sum(t["amount"] for t in failed_transactions)
    total_recovered = sum(r["recovered"] for r in recovery_results)
    recovery_rate = round((total_recovered / total_at_risk * 100), 2) if total_at_risk > 0 else 0

    # Breakdown by error code
    error_breakdown = defaultdict(lambda: {"count": 0, "amount": 0})
    for t in failed_transactions:
        code = t["error_code"]
        error_breakdown[code]["count"] += 1
        error_breakdown[code]["amount"] += t["amount"]

    # Breakdown by action taken
    action_breakdown = defaultdict(lambda: {"count": 0, "amount": 0})
    for r in recovery_results:
        action_breakdown[r["action_taken"]]["count"] += 1
        action_breakdown[r["action_taken"]]["amount"] += r["amount"]

    # Guardrail triggers
    guardrail_hits = [r for r in recovery_results if r["action_taken"] == "BLOCKED_BY_GUARDRAIL"]
    terminal_skips = [r for r in recovery_results if r["action_taken"] == "FLAGGED_TERMINAL"]
    notifications_sent = [r for r in recovery_results if r["action_taken"] == "NOTIFICATION_SENT"]
    retries = [r for r in recovery_results if r["action_taken"] == "AUTO_RETRY"]
    successful_retries = [r for r in retries if r["outcome"] == "recovered"]

    return {
        "summary": {
            "total_transactions": total_transactions,
            "total_failed": total_failed,
            "total_successful": total_transactions - total_failed,
            "total_at_risk_inr": total_at_risk,
            "total_recovered_inr": total_recovered,
            "recovery_rate_percent": recovery_rate,
        },
        "guardrails": {
            "max_retry_cap": 3,
            "guardrail_triggers": len(guardrail_hits),
            "terminal_skips": len(terminal_skips),
            "guardrail_details": guardrail_hits
        },
        "actions": {
            "auto_retries_attempted": len(retries),
            "auto_retries_succeeded": len(successful_retries),
            "notifications_sent": len(notifications_sent),
            "breakdown": dict(action_breakdown)
        },
        "error_breakdown": dict(error_breakdown),
        "activity_log": sorted(recovery_results, key=lambda x: x["timestamp"])
    }
