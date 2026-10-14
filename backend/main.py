import os
import copy
from pathlib import Path
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

from models import ClinicalCase, ClinicalReviewResponse, TimelineEvent, EvidenceCitation
from demo_cases import DEMO_CASES
from evidence_store import get_all_evidence, search_evidence
from ai_service import generate_clinical_synthesis

load_dotenv()

app = FastAPI(
    title="NEUROSCOPE AI - Clinical Decision Support API",
    description="Evidence-grounded neurological clinical decision-support engine for evolving, inconclusive cases.",
    version="1.0.0"
)

allowed_origins = [origin.strip() for origin in os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174"
).split(",") if origin.strip()]

# Same-origin production deployments do not need CORS. Local Vite origins are allow-listed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# In-memory storage of cases initialized with demo cases
ACTIVE_CASES = copy.deepcopy(DEMO_CASES)

@app.get("/api/health")
def health_check():
    has_groq = bool(os.getenv("GROQ_API_KEY") and os.getenv("GROQ_API_KEY") != "your_groq_api_key_here")
    return {
        "status": "healthy",
        "service": "NEUROSCOPE AI Clinical Core",
        "version": "1.0.0",
        "clinical_logic": "Graus et al. (2016) International Consensus Guideline Engine",
        "llm_augmented": has_groq,
        "frontend_available": (Path(__file__).resolve().parent.parent / "frontend" / "dist").is_dir(),
        "active_cases_count": len(ACTIVE_CASES)
    }

@app.get("/api/cases", response_model=List[ClinicalCase])
def list_cases():
    """Returns all active demonstration and user-created cases."""
    return list(ACTIVE_CASES.values())

@app.get("/api/cases/{case_id}", response_model=ClinicalCase)
def get_case(case_id: str):
    """Retrieve details for a specific case by patient_display_id or id."""
    for case in ACTIVE_CASES.values():
        if case.patient_display_id == case_id or case.id == case_id:
            return case
    raise HTTPException(status_code=404, detail="Clinical case not found")

@app.post("/api/cases", response_model=ClinicalCase)
def save_case(case: ClinicalCase):
    """Save or update a clinical case."""
    if not case.patient_display_id:
        case.patient_display_id = f"SYNTH-CASE-{len(ACTIVE_CASES) + 1:03d}"
    ACTIVE_CASES[case.patient_display_id] = case
    return case

@app.post("/api/cases/{case_id}/timeline", response_model=List[TimelineEvent])
def update_timeline(case_id: str, events: List[TimelineEvent]):
    """Update timeline events for a given case."""
    target_case = None
    target_key = None
    for key, c in ACTIVE_CASES.items():
        if c.patient_display_id == case_id or c.id == case_id:
            target_case = c
            target_key = key
            break

    if not target_case:
        raise HTTPException(status_code=404, detail="Case not found")

    # Sort events chronologically
    sorted_events = sorted(events, key=lambda e: e.date or "9999-99-99")
    target_case.timeline_events = sorted_events
    ACTIVE_CASES[target_key] = target_case
    return sorted_events

@app.post("/api/analyze", response_model=ClinicalReviewResponse)
async def analyze_case(case: ClinicalCase):
    """Executes clinical criteria evaluation, red-flag detection, and evidence grounding."""
    review = await generate_clinical_synthesis(case)
    return review

@app.get("/api/evidence", response_model=List[EvidenceCitation])
def list_evidence():
    """Retrieve curated, peer-reviewed medical evidence citations."""
    return get_all_evidence()

@app.get("/api/evidence/search", response_model=List[EvidenceCitation])
def query_evidence(q: str = Query("", description="Search term for title, author, or excerpt")):
    """Search evidence by keyword."""
    if not q:
        return get_all_evidence()
    return search_evidence(q)

# Cloud Run serves the built single-page app and API from one origin.
static_dir = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if static_dir.is_dir():
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
