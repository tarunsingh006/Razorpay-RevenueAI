import json

from agent.detector import load_transactions, detect_failures
from agent.diagnoser import diagnose_batch
from agent.recovery import process_batch
from agent.audit import generate_audit

AUDIT_PATHS = ["audit_report.json", "ui/public/audit_report.json"]

def run_pipeline():
    """Run the full recovery pipeline and return the audit dict."""
    # Step 1: Detection
    transactions = load_transactions()
    failed, total_at_risk = detect_failures(transactions)

    # Step 2: Diagnosis
    diagnosed = diagnose_batch(failed)

    # Step 3: Recovery
    results = process_batch(diagnosed)

    # Step 4: Audit
    audit = generate_audit(transactions, failed, results)

    # Save audit to both root and ui/public so dashboard auto-updates
    for path in AUDIT_PATHS:
        with open(path, "w") as f:
            json.dump(audit, f, indent=2)

    return audit

if __name__ == "__main__":
    print("=" * 60)
    print("  RAZORPAY AI - PAYMENT RECOVERY AGENT")
    print("=" * 60)

    audit = run_pipeline()

    summary = audit["summary"]
    guardrails = audit["guardrails"]

    print(f"\n[STEP 1] DETECTION")
    print(f"  Total transactions scanned : {summary['total_transactions']}")
    print(f"  Failed transactions found  : {summary['total_failed']}")
    print(f"  Total amount at risk       : INR {summary['total_at_risk_inr']:,}")

    print(f"\n[STEP 2] DIAGNOSIS")
    categories = {}
    for row in audit["activity_log"]:
        code = row["action_taken"]
        categories[code] = categories.get(code, 0) + 1
    for cat, count in sorted(categories.items()):
        print(f"  {cat:<30} : {count}")

    print(f"\n[STEP 3] RECOVERY ACTIONS")
    for action, count in sorted(audit["actions"]["breakdown"].items()):
        print(f"  {action:<30} : {count}")

    print(f"\n[STEP 4] AUDIT REPORT")
    print(f"  Total at risk              : INR {summary['total_at_risk_inr']:,}")
    print(f"  Total recovered            : INR {summary['total_recovered_inr']:,}")
    print(f"  Recovery rate              : {summary['recovery_rate_percent']}%")

    print(f"\n  --- GUARDRAILS IN ACTION ---")
    print(f"  Max retry cap              : {guardrails['max_retry_cap']} attempts")
    print(f"  Guardrail triggers         : {guardrails['guardrail_triggers']} (blocked from over-retrying)")
    print(f"  Terminal skips             : {guardrails['terminal_skips']} (fraud blocks - never retried)")

    print(f"\n  Full audit saved to audit_report.json + ui/public/audit_report.json")
    print("=" * 60)