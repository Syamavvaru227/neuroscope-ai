"""Smoke checks for the local synthetic demo API; timeline check normalizes canonical demo order."""
import os
import httpx

FRONTEND = os.getenv("NEUROSCOPE_FRONTEND_URL", "http://127.0.0.1:5173").rstrip("/")
API = os.getenv("NEUROSCOPE_API_URL", "http://127.0.0.1:8000/api").rstrip("/")

with httpx.Client(timeout=15.0) as client:
    frontend = client.get(f"{FRONTEND}/")
    assert frontend.status_code == 200 and "NEUROSCOPE AI" in frontend.text
    print("[PASS] Frontend responds")

    health = client.get(f"{API}/health")
    assert health.status_code == 200 and health.json().get("status") == "healthy"
    print("[PASS] API health")

    cases_response = client.get(f"{API}/cases")
    assert cases_response.status_code == 200
    cases = cases_response.json()
    assert len(cases) >= 3 and all(case.get("is_synthetic") for case in cases)
    print(f"[PASS] {len(cases)} synthetic cases")

    case = client.get(f"{API}/cases/SYNTH-NEURO-702").json()
    assert case.get("is_synthetic") is True
    analysis = client.post(f"{API}/analyze", json=case)
    assert analysis.status_code == 200
    review = analysis.json()
    assert review.get("engine_source") and review.get("citations")
    print("[PASS] Deterministic analysis contract")

    # Re-submit only the exact canonical synthetic timeline to exercise sorting.
    # This creates no test event or treatment recommendation.
    events = case.get("timeline_events", [])
    timeline = client.post(f"{API}/cases/SYNTH-NEURO-702/timeline", json=events)
    assert timeline.status_code == 200
    sorted_events = timeline.json()
    assert [event["id"] for event in sorted_events] == [event["id"] for event in sorted(events, key=lambda item: item.get("date") or "9999-99-99")]
    print("[PASS] Synthetic timeline sorting")

    evidence = client.get(f"{API}/evidence/search", params={"q": "Graus"})
    assert evidence.status_code == 200 and evidence.json()
    print("[PASS] Evidence search")

print("All configured smoke checks passed.")
