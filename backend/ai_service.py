import os
import json
import httpx
from models import ClinicalCase, ClinicalReviewResponse
from clinical_engine import analyze_clinical_case

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

async def generate_clinical_synthesis(case: ClinicalCase) -> ClinicalReviewResponse:
    """
    Evaluates clinical case through deterministic rule engine first (ensuring zero hallucination of criteria).
    If GROQ_API_KEY is configured in environment, augments the executive synthesis with strict grounding.
    """
    # Baseline deterministic review
    review = analyze_clinical_case(case)
    groq_api_key = os.getenv("GROQ_API_KEY")

    if not groq_api_key or groq_api_key.strip() == "" or groq_api_key == "your_groq_api_key_here":
        # Return deterministic analysis directly
        return review

    prompt = f"""
You are NEUROSCOPE AI, a clinical decision-support summarizer for neurologists.
Case Identifier: {case.patient_display_id} (Synthetic demonstration case)
Onset: {case.onset_type}
Symptoms: Cognitive ({case.cognitive_memory}), Psychiatric ({case.psychiatric_behavioral}), Seizures ({case.seizures}), Movement ({case.movement_disorder}), Autonomic ({case.autonomic_dysfunction})
Investigations:
- Brain MRI: {case.mri_brain.status} - {case.mri_brain.details}
- EEG: {case.eeg.status} - {case.eeg.details}
- CSF: {case.csf_analysis.status} - {case.csf_analysis.details}
- Antibodies: {case.neuronal_antibodies.status} - {case.neuronal_antibodies.details}
- Infectious: {case.infectious_workup.status} - {case.infectious_workup.details}

Graus (2016) Possible AE Status: {review.possible_ae_status}
Graus (2016) Probable AE Status: {review.probable_ae_status}
Red Flags: {len(review.red_flags)} identified

TASK:
Provide a concise, 3-paragraph executive clinical case formulation for an attending neurologist.
    Strict demonstration rules:
1. Ground statements exclusively on documented facts.
2. Emphasize that antibody-negativity does not exclude autoimmune encephalitis.
3. Explicitly state that this is an AI decision-support synthesis for review, not a definitive medical diagnosis.
4. Highlight any pending safety priorities (e.g. infectious rule-out, continuous telemetry).
5. Do not diagnose, confirm, or exclude a disease; describe findings only as considerations for clinician review.
6. Do not prescribe, recommend, or suggest medication, dosing, or treatment changes.
Do NOT invent test results or fabricate statistics.
"""

    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            resp = await client.post(
                GROQ_API_URL,
                headers={
                    "Authorization": f"Bearer {groq_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": [
                        {"role": "system", "content": "You are an elite neurological clinical decision support assistant adhering strictly to evidence-based consensus guidelines."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.2,
                    "max_tokens": 600
                }
            )
            if resp.status_code == 200:
                data = resp.json()
                ai_text = data.get("choices", [{}])[0].get("message", {}).get("content")
                if ai_text:
                    review.synthesis_summary = ai_text.strip()
                    review.engine_source = "groq_augmented_engine (llama-3.3-70b-versatile)"
            else:
                # Keep deterministic
                review.engine_source = "deterministic_rule_engine (AI summary unavailable)"
    except Exception:
        # Do not expose provider details or request content in the interface.
        review.engine_source = "deterministic_rule_engine (AI summary unavailable)"

    return review
