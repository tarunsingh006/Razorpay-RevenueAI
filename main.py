import json
from agent.detector import load_transactions, detect_failures
from agent.diagnoser import diagnose_batch
from agent.recovery import process_batch
from agent.audit import generate_audit

def run_pipeline():
    print("=" * 60)
    print("  RAZORPAY AI — PAYMENT RECOVERY AGENT")
    print("=" * 60)

    # Step 1: Detection
    transactions = load_transactions()
    failed, total_at_risk = detect_failures(transactions)
    print(f"\n[STEP 1] DETECTION")
    print(f"  Total transactions scanned : {len(transactions)}")
    print(f"  Failed transactions found  : {len(failed)}")
    print(f"  Total amount at risk       : INR {total_at_risk:,}")

    # Step 2: Diagnosis
    diagnosed = diagnose_batch(failed)
    categories = {}
    for t in diagnosed:
        cat = t["diagnosis"]["category"]
        categories[cat] = categories.get(cat, 0) + 1
    print(f"\n[STEP 2] DIAGNOSIS")
    for cat, count in categories.items():
        print(f"  {cat:<20} : {count} transactions")

    # Step 3: Recovery
    results = process_batch(diagnosed)
    print(f"\n[STEP 3] RECOVERY ACTIONS")
    action_counts = {}
    for r in results:
        action_counts[r["action_taken"]] = action_counts.get(r["action_taken"], 0) + 1
    for action, count in action_counts.items():
        print(f"  {action:<30} : {count}")

    # Step 4: Audit
    audit = generate_audit(transactions, failed, results)
    summary = audit["summary"]
    guardrails = audit["guardrails"]

    print(f"\n[STEP 4] AUDIT REPORT")
    print(f"  Total at risk              : INR {summary['total_at_risk_inr']:,}")
    print(f"  Total recovered            : INR {summary['total_recovered_inr']:,}")
    print(f"  Recovery rate              : {summary['recovery_rate_percent']}%")
    print(f"\n  --- GUARDRAILS IN ACTION ---")
    print(f"  Max retry cap              : {guardrails['max_retry_cap']} attempts")
    print(f"  Guardrail triggers         : {guardrails['guardrail_triggers']} (blocked from over-retrying)")
    print(f"  Terminal skips             : {guardrails['terminal_skips']} (fraud blocks — never retried)")

    # Save audit to both root and ui/public so dashboard auto-updates
    for path in ["audit_report.json", "ui/public/audit_report.json"]:
        with open(path, "w") as f:
            json.dump(audit, f, indent=2)
    print(f"\n  Full audit saved to audit_report.json + ui/public/audit_report.json")
    print("=" * 60)

    return audit

if __name__ == "__main__":
    run_pipeline()
