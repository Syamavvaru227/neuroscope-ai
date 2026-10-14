from typing import List, Tuple
from datetime import datetime
from models import (
    ClinicalCase, CriterionEvaluation, RedFlagItem,
    DifferentialItem, ClinicalReviewResponse
)
from evidence_store import CURATED_EVIDENCE_STORE

def evaluate_graus_criteria(case: ClinicalCase) -> Tuple[str, str, str, List[CriterionEvaluation]]:
    """
    Evaluates Graus et al. (2016) Lancet Neurol criteria for:
    1. Possible Autoimmune Encephalitis
    2. Probable Autoimmune Encephalitis (or anti-NMDAR)
    3. Definite Anti-NMDAR Encephalitis
    """
    evaluations: List[CriterionEvaluation] = []

    # Criterion 1: Subacute onset of working memory deficits, altered mental status, or psychiatric symptoms
    c1_subacute = case.onset_type in ["subacute_less_3_months"]
    c1_symptoms = case.cognitive_memory or case.altered_consciousness or case.psychiatric_behavioral
    c1_met = c1_subacute and c1_symptoms

    c1_evidence = []
    if c1_subacute:
        c1_evidence.append("Onset reported as subacute (< 3 months progression)")
    else:
        c1_evidence.append(f"Onset category: {case.onset_type.replace('_', ' ')}")
    if case.cognitive_memory:
        c1_evidence.append(f"Working memory/cognitive deficit ({case.cognitive_details or 'present'})")
    if case.psychiatric_behavioral:
        c1_evidence.append(f"Psychiatric/behavioral disturbance ({case.psychiatric_details or 'present'})")
    if case.altered_consciousness:
        c1_evidence.append(f"Altered mental status/consciousness ({case.consciousness_details or 'present'})")

    evaluations.append(CriterionEvaluation(
        criterion_name="Criterion 1: Subacute Onset (<3 Months) of Core Symptoms",
        description="Subacute rapid onset (<3 months) of working memory deficits, altered mental status, or psychiatric symptoms.",
        status="SUPPORTED" if c1_met else ("NOT_SUPPORTED" if not c1_subacute else "INCONCLUSIVE"),
        evidence_found="; ".join(c1_evidence) if c1_evidence else "No specific core symptoms recorded",
        clinical_significance="Foundational requirement under Graus et al. 2016 for all autoimmune encephalitis diagnostic tiers."
    ))

    # Criterion 2: At least one of paraclinical / examination criteria
    # 2a: New focal CNS findings
    # 2b: Seizures not explained by prior disorder
    # 2c: CSF pleocytosis (>5 WBC/mm³)
    # 2d: MRI features suggestive of encephalitis
    c2_points = []
    c2_missing = []

    # Seizures
    if case.seizures:
        c2_points.append(f"Seizures: {case.seizure_details or 'New-onset seizures documented'}")
    
    # Focal CNS
    if case.focal_cns_findings:
        c2_points.append(f"Focal CNS deficits: {case.focal_cns_details or 'Focal neurological signs'}")

    # CSF Pleocytosis
    if case.csf_analysis.status == "positive" or (case.csf_analysis.abnormal and "pleocytosis" in (case.csf_analysis.details or "").lower()):
        c2_points.append(f"CSF inflammatory changes: {case.csf_analysis.details}")
    elif case.csf_analysis.status == "pending":
        c2_missing.append("CSF analysis pending")

    # MRI Brain
    if case.mri_brain.status in ["positive", "inconclusive"] and case.mri_brain.abnormal:
        c2_points.append(f"Neuroimaging: {case.mri_brain.details}")
    elif case.mri_brain.status == "pending":
        c2_missing.append("MRI Brain pending")

    c2_met = len(c2_points) > 0
    c2_status = "SUPPORTED" if c2_met else ("PENDING_OR_MISSING" if c2_missing else "NOT_SUPPORTED")

    evaluations.append(CriterionEvaluation(
        criterion_name="Criterion 2: Objective Paraclinical / Focal CNS Evidence",
        description="At least one of: (a) New focal CNS findings, (b) Seizures, (c) CSF pleocytosis >5 WBC/mm³, (d) MRI suggestive of encephalitis.",
        status=c2_status,
        evidence_found="; ".join(c2_points) if c2_points else ("Pending investigations: " + ", ".join(c2_missing) if c2_missing else "None documented"),
        clinical_significance="Provides objective paraclinical proof of acute/subacute central nervous system inflammatory involvement."
    ))

    # Criterion 3: Reasonable exclusion of alternative causes
    c3_met = False
    c3_status = "SUPPORTED"
    c3_evidence = []
    
    if case.infectious_workup.status == "negative":
        c3_evidence.append(f"Viral PCR panel negative: {case.infectious_workup.details}")
        c3_met = True
    elif case.infectious_workup.status == "pending":
        c3_status = "PENDING_OR_MISSING"
        c3_evidence.append("Infectious CSF PCR panel (HSV-1/2, VZV, enterovirus) is pending")
    elif case.infectious_workup.status == "positive":
        c3_status = "NOT_SUPPORTED"
        c3_evidence.append(f"Positive infectious finding identified: {case.infectious_workup.details}")
    else:
        c3_status = "INCONCLUSIVE"
        c3_evidence.append("Infectious rule-out not fully completed")

    evaluations.append(CriterionEvaluation(
        criterion_name="Criterion 3: Review of Infectious & Toxic/Metabolic Alternatives",
        description="Document and review infectious (including HSV, VZV, and bacterial), toxic-metabolic, and other alternatives in clinical context.",
        status=c3_status,
        evidence_found="; ".join(c3_evidence),
        clinical_significance="Mandatory safety step before initiating heavy immunosuppression; preventing untreated infectious meningoencephalitis."
    ))

    # Criterion 4: Characteristic EEG or Specific Antibody Confirmation
    c4_met = False
    c4_status = "PENDING_OR_MISSING"
    c4_evidence = []

    if case.eeg.status == "positive" and case.eeg.abnormal:
        c4_evidence.append(f"EEG finding: {case.eeg.details}")
        c4_met = True
        c4_status = "SUPPORTED"
    elif case.eeg.status == "pending":
        c4_evidence.append("EEG pending completion/interpretation")

    if case.neuronal_antibodies.status == "positive":
        c4_evidence.append(f"Neuronal antibody confirmed: {case.neuronal_antibodies.details}")
        c4_met = True
        c4_status = "SUPPORTED"
    elif case.neuronal_antibodies.status == "pending":
        c4_evidence.append("Neuronal autoantibody panel pending (results awaited)")
    elif case.neuronal_antibodies.status == "negative":
        c4_evidence.append("Autoantibody panel currently negative (does not rule out seronegative AE if clinical criteria met)")

    evaluations.append(CriterionEvaluation(
        criterion_name="Criterion 4: Electroencephalography (EEG) & Neuronal Autoantibodies",
        description="EEG showing epileptic discharges, focal temporal slowing, or extreme delta brush; antibody confirmation in CSF/serum.",
        status=c4_status,
        evidence_found="; ".join(c4_evidence),
        clinical_significance="Distinguishes probable from definite autoimmune syndromes; guides targeted immunotherapy."
    ))

    # Overall Status Determination
    possible_status = "MET" if (c1_met and c2_met and c3_status == "SUPPORTED") else (
        "INSUFFICIENT_INFORMATION" if (c2_status == "PENDING_OR_MISSING" or c3_status == "PENDING_OR_MISSING") else "NOT_MET"
    )

    probable_status = "MET" if (possible_status == "MET" and (case.eeg.status == "positive" or "delta brush" in (case.eeg.details or "").lower() or case.movement_disorder)) else (
        "INSUFFICIENT_INFORMATION" if (possible_status == "INSUFFICIENT_INFORMATION" or case.eeg.status == "pending") else "NOT_MET"
    )

    definite_nmdar = "PENDING_ANTIBODY_CONFIRMATION"
    if case.neuronal_antibodies.status == "positive" and "nmdar" in (case.neuronal_antibodies.details or "").lower():
        definite_nmdar = "MET"
    elif case.neuronal_antibodies.status == "negative":
        definite_nmdar = "NOT_MET"

    return possible_status, probable_status, definite_nmdar, evaluations

def detect_red_flags(case: ClinicalCase) -> List[RedFlagItem]:
    """Identifies critical safety alerts, emergency clinical priorities, and urgent rule-outs."""
    flags: List[RedFlagItem] = []

    # Red Flag 1: Infectious workup requires clinician review
    if case.infectious_workup.status == "pending" or case.infectious_workup.status == "not_performed":
        flags.append(RedFlagItem(
            severity="URGENT_EMERGENCY",
            title="Infectious Encephalitis Evaluation Incomplete",
            rationale="Infectious causes remain under evaluation in this synthetic case. This prototype cannot assess urgency or determine whether a condition is present.",
            recommended_action="Have the treating clinical team promptly review pending results and the safety plan under local protocols."
        ))

    # Red Flag 2: Extreme Delta Brush or Refractory Seizures / Status Epilepticus
    if case.seizures and ("refractory" in (case.seizure_details or "").lower() or "status" in (case.seizure_details or "").lower()):
        flags.append(RedFlagItem(
            severity="URGENT_EMERGENCY",
            title="Refractory Seizures / Status Epilepticus Risk (NORSE)",
            rationale="Seizures in suspected autoimmune encephalitis can rapidly escalate into refractory status epilepticus requiring continuous EEG and neuro-ICU monitoring.",
            recommended_action="Prompt review by the treating neurology or emergency team; follow local protocols for urgent assessment."
        ))
    elif "delta brush" in (case.eeg.details or "").lower():
        flags.append(RedFlagItem(
            severity="HIGH_ALERT",
            title="Extreme Delta Brush Electroencephalographic Pattern",
            rationale="Identified in ~30% of adult anti-NMDA receptor encephalitis cases; strongly correlated with severe, prolonged hospitalization and ICU admission.",
            recommended_action="Prepare for potential respiratory or autonomic complications; ensure early neurocritical care involvement."
        ))

    # Red Flag 3: Autonomic instability or hypoventilation
    if case.autonomic_dysfunction:
        flags.append(RedFlagItem(
            severity="HIGH_ALERT",
            title="Autonomic Instability / Dysautonomia Manifestation",
            rationale="Fluctuating hemodynamics (tachycardia/bradycardia, BP lability) and central hypoventilation are recognized life-threatening complications of limbic & NMDA encephalitis.",
            recommended_action="Continuous cardiac telemetry and frequent respiratory monitoring (including forced vital capacity / negative inspiratory force if indicated)."
        ))

    # Red Flag 4: Underlying occult malignancy screening in young females
    if case.sex == "Female" and case.age and case.age <= 45 and (case.movement_disorder or case.psychiatric_behavioral):
        if "teratoma" not in (case.other_investigations or "").lower() or "pending" in (case.other_investigations or "").lower():
            flags.append(RedFlagItem(
                severity="MODERATE_WARNING",
                title="Occult Teratoma Screening Warranted (Pelvic Ultrasound / MRI)",
                rationale="Up to 40–50% of young women with anti-NMDAR encephalitis harbor an ovarian teratoma. Neurological recovery frequently depends on surgical resection.",
                recommended_action="Verify transvaginal/pelvic ultrasound or contrast pelvic MRI is scheduled and interpreted by experienced radiologist."
            ))

    return flags

def build_differential_matrix(case: ClinicalCase) -> List[DifferentialItem]:
    """Generates differential diagnosis considerations comparing findings."""
    differentials = []

    # 1. Autoimmune Encephalitis (NMDAR, LGI1, or Seronegative)
    ae_supporting = []
    if case.onset_type == "subacute_less_3_months":
        ae_supporting.append("Subacute progression (<3 months) classic for autoimmune etiology")
    if case.psychiatric_behavioral and case.seizures:
        ae_supporting.append("Biphasic psychiatric/behavioral onset rapidly followed by seizure activity")
    if case.movement_disorder:
        ae_supporting.append("Orofacial dyskinesia / involuntary movements typical of anti-NMDAR")
    if case.csf_analysis.abnormal:
        ae_supporting.append("Inflammatory CSF (pleocytosis / oligoclonal bands)")
    if "delta brush" in (case.eeg.details or "").lower():
        ae_supporting.append("Characteristic Extreme Delta Brush EEG pattern")

    ae_contradicting = []
    if case.neuronal_antibodies.status == "negative":
        ae_contradicting.append("Negative antibody panel (requires consideration of seronegative AE criteria)")
    if case.mri_brain.status == "negative":
        ae_contradicting.append("Normal brain MRI (occurs in ~50-60% of anti-NMDAR, does not rule out AE)")

    differentials.append(DifferentialItem(
        condition="Autoimmune Encephalitis (e.g., Anti-NMDAR, LGI1, or Seronegative AE)",
        likelihood_category="HIGH_CONSIDERATION",
        supporting_points=ae_supporting or ["Consistent subacute neurocognitive decline"],
        contradictory_or_differentiating_points=ae_contradicting or ["Pending antibody titers"],
        next_evaluations=[
            "Expedite CSF/serum cell-based assay antibody panel (NMDAR, LGI1, CASPR2, AMPAR, GABA-B)",
            "Pelvic ultrasound/MRI for ovarian teratoma screening in female patients",
            "Discuss additional specialist evaluation after reviewing infectious and toxic-metabolic alternatives"
        ]
    ))

    # 2. Viral / Infectious Encephalitis (HSV-1, VZV, Enterovirus)
    hsv_supporting = ["Acute altered mental status, seizures, CSF pleocytosis"]
    hsv_contradicting = []
    if case.infectious_workup.status == "negative":
        hsv_contradicting.append("The recorded CSF HSV-1/2 and VZV PCR results are negative; interpret with test timing and the full clinical picture")
    else:
        hsv_contradicting.append("Pending infectious PCR; cannot yet definitively exclude HSV")
    if case.onset_type == "subacute_less_3_months" and not case.focal_cns_findings:
        hsv_contradicting.append("Subacute multifaceted progression with prominent psychosis/dyskinesia more characteristic of autoimmune course")

    differentials.append(DifferentialItem(
        condition="Infectious Encephalitis (Herpes Simplex Virus - 1/2, VZV)",
        likelihood_category="LOWER_CONSIDERATION" if case.infectious_workup.status == "negative" else "HIGH_CONSIDERATION",
        supporting_points=hsv_supporting,
        contradictory_or_differentiating_points=hsv_contradicting,
        next_evaluations=[
            "Confirm repeat CSF PCR if initial puncture performed <48h from fever onset and high clinical suspicion remains",
            "Have the treating clinician review PCR timing, results, and the current safety plan under local protocols"
        ]
    ))

    # 3. Primary Psychiatric Disorder (First-Episode Psychosis, Bipolar Mania, Schizoaffective)
    psych_supporting = []
    if case.psychiatric_behavioral:
        psych_supporting.append("Prominent behavioral changes, agitation, hallucinations, paranoia")
    psych_contradicting = [
        "Presence of objective neurological signs (seizures, dyskinesia, abnormal EEG, CSF pleocytosis)",
        "Primary psychiatric illness does not produce inflammatory CSF changes or focal EEG abnormalities"
    ]

    differentials.append(DifferentialItem(
        condition="Primary Psychiatric Disorder (First-Episode Psychosis / Acute Mania)",
        likelihood_category="LOWER_CONSIDERATION",
        supporting_points=psych_supporting or ["Severe psychiatric presentation"],
        contradictory_or_differentiating_points=psych_contradicting,
        next_evaluations=[
            "Neurology and Psychiatry consultation liaison",
            "Review medication effects and potential sensitivities with the treating clinical team"
        ]
    ))

    # 4. Toxic / Metabolic / Hashimoto Encephalopathy (SREAT)
    diff4_supporting = ["Subacute cognitive fluctuations, memory impairment, sleep disturbance"]
    diff4_contradicting = ["Inflammatory CSF findings and specific EEG patterns argue against isolated metabolic derangement"]
    differentials.append(DifferentialItem(
        condition="Autoimmune Encephalopathy Associated with Thyroid Disease (Hashimoto Encephalopathy / SREAT) / Toxic-Metabolic",
        likelihood_category="MODERATE_CONSIDERATION",
        supporting_points=diff4_supporting,
        contradictory_or_differentiating_points=diff4_contradicting,
        next_evaluations=[
            "Check serum anti-TPO (thyroid peroxidase) and anti-thyroglobulin antibody titers",
            "Comprehensive toxicology screen, ammonia, B12, copper, ceruloplasmin"
        ]
    ))

    return differentials

def analyze_clinical_case(case: ClinicalCase) -> ClinicalReviewResponse:
    """Core analysis orchestrator evaluating criteria, red flags, differentials, and evidence."""
    pos_status, prob_status, def_status, graus_evals = evaluate_graus_criteria(case)
    red_flags = detect_red_flags(case)
    differential_matrix = build_differential_matrix(case)

    # Compile supporting findings
    supporting: List[str] = []
    if case.cognitive_memory:
        supporting.append(f"Cognitive decline / working memory deficits: {case.cognitive_details or 'documented'}")
    if case.psychiatric_behavioral:
        supporting.append(f"Subacute psychiatric & behavioral disturbances: {case.psychiatric_details or 'documented'}")
    if case.seizures:
        supporting.append(f"New-onset seizures: {case.seizure_details or 'documented'}")
    if case.movement_disorder:
        supporting.append(f"Movement disorder (dyskinesia/chorea): {case.movement_details or 'documented'}")
    if case.csf_analysis.abnormal:
        supporting.append(f"CSF inflammatory changes: {case.csf_analysis.details}")
    if case.eeg.abnormal:
        supporting.append(f"EEG abnormality: {case.eeg.details}")
    if case.mri_brain.abnormal:
        supporting.append(f"MRI neuroimaging: {case.mri_brain.details}")

    # Compile contradictory or alternative findings
    contradictory: List[str] = []
    if case.neuronal_antibodies.status == "negative":
        contradictory.append("Serum/CSF neuronal autoantibody panel currently reported as negative (consider seronegative criteria).")
    if case.mri_brain.status == "negative":
        contradictory.append("Brain MRI did not show focal T2/FLAIR hyperintensities (observed in up to 50% of true anti-NMDAR cases).")
    if case.infectious_workup.status == "positive":
        contradictory.append(f"Positive infectious result: {case.infectious_workup.details}")

    # Missing investigations
    missing: List[str] = []
    if case.neuronal_antibodies.status in ["pending", "not_performed"]:
        missing.append("Neuronal autoantibody panel (CSF and Serum) pending laboratory completion")
    if case.infectious_workup.status in ["pending", "not_performed"]:
        missing.append("CSF viral PCR panel (HSV-1, HSV-2, VZV, enterovirus) pending")
    if case.mri_brain.status in ["pending", "not_performed"]:
        missing.append("Contrast-enhanced brain MRI (with 3D FLAIR/DWI) pending")
    if case.eeg.status in ["pending", "not_performed"]:
        missing.append("Continuous video-EEG monitoring pending")
    if case.sex == "Female" and case.age and case.age <= 45 and "teratoma" not in (case.other_investigations or "").lower():
        missing.append("Pelvic ultrasound or MRI for ovarian teratoma screening not documented")

    # Unresolved clinical questions
    unresolved: List[str] = [
        "Have the treating clinicians reviewed pending infectious results and the current safety plan?",
        "If autoantibody testing returns negative, does the clinical course and paraclinical profile meet the published criteria for antibody-negative probable autoimmune encephalitis?",
        "Are autonomic instability and nocturnal hypoventilation adequately monitored with continuous telemetry?",
        "Has an occult malignancy (teratoma / thymoma / small-cell) screen been completed according to age and sex risk stratification?"
    ]

    # Synthesize executive summary
    synthesis = (
        f"Case {case.patient_display_id}: the documented fields were mapped to example clinical consensus criteria. "
        f"The rule set marks the possible autoimmune encephalitis criteria as {pos_status.replace('_', ' ')}. "
        f"This is a structured summary of entered information, not a diagnosis or an exclusion of other causes. "
        f"Review the full timeline, differential considerations, and any pending or contradictory findings with qualified clinicians."
    )

    uncertainty_statement = (
        "Clinical Uncertainty Notice: This evaluation is generated by an algorithmic clinical decision-support prototype. "
        "Diagnostic criteria reflect the Graus et al. (2016) consensus guidelines. A designation of 'MET' or 'SUPPORTED' "
        "indicates that available documented findings align with guideline thresholds, but does NOT establish a definitive medical diagnosis. "
        "Negative antibody assays do not exclude seronegative autoimmune encephalitis. All clinical judgements, management plans, and "
        "therapeutic interventions must be directed by a licensed neurologist."
    )

    safety_disclaimer = (
        "RESEARCH & DEMONSTRATION PROTOTYPE: NEUROSCOPE AI is an investigational decision-support interface for clinical review and research. "
        "It is not a medical device, is not FDA/CE cleared, and must never replace clinical judgement or delay urgent therapy."
    )

    return ClinicalReviewResponse(
        case_id=case.id,
        generated_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        synthesis_summary=synthesis,
        possible_ae_status=pos_status, # type: ignore
        probable_ae_status=prob_status, # type: ignore
        definite_nmdar_status=def_status, # type: ignore
        graus_criteria=graus_evals,
        red_flags=red_flags,
        differential_matrix=differential_matrix,
        supporting_findings=supporting,
        contradictory_findings=contradictory,
        missing_investigations=missing,
        unresolved_questions=unresolved,
        citations=CURATED_EVIDENCE_STORE,
        uncertainty_statement=uncertainty_statement,
        safety_disclaimer=safety_disclaimer,
        engine_source="deterministic_rule_engine"
    )
