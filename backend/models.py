from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

class InvestigationResult(BaseModel):
    status: Literal["positive", "negative", "inconclusive", "pending", "not_performed"] = "not_performed"
    details: Optional[str] = ""
    date: Optional[str] = None
    abnormal: bool = False

class TimelineEvent(BaseModel):
    id: str
    date: str
    category: Literal["symptom", "investigation", "intervention", "milestone"]
    title: str
    description: str
    status: Literal["normal", "abnormal", "inconclusive", "pending", "critical"] = "normal"
    red_flag: bool = False

class ClinicalCase(BaseModel):
    id: str = "CASE-DEMO-01"
    is_synthetic: bool = True
    title: str = "Synthetic Patient Case"
    patient_display_id: str = "SYNTH-NEURO-702"
    age: Optional[int] = 24
    sex: Optional[Literal["Female", "Male", "Other", "Unknown"]] = "Female"
    
    # Clinical history & symptoms
    onset_type: Literal["hyperacute_hours_days", "subacute_less_3_months", "chronic_more_3_months", "unknown"] = "subacute_less_3_months"
    symptom_progression: str = "Progressive cognitive and psychiatric decline over 3 weeks"
    altered_consciousness: bool = True
    consciousness_details: Optional[str] = "Fluctuating somnolence and agitation"
    
    seizures: bool = True
    seizure_details: Optional[str] = "New-onset focal motor seizures with secondary generalization"
    
    psychiatric_behavioral: bool = True
    psychiatric_details: Optional[str] = "Marked personality change, paranoia, visual hallucinations"
    
    cognitive_memory: bool = True
    cognitive_details: Optional[str] = "Short-term memory deficits, disorientation to time"
    
    movement_disorder: bool = True
    movement_details: Optional[str] = "Orofacial dyskinesias, choreiform arm twitching"
    
    autonomic_dysfunction: bool = False
    autonomic_details: Optional[str] = "Sinus tachycardia, occasional blood pressure variability"
    
    focal_cns_findings: bool = False
    focal_cns_details: Optional[str] = "No focal cranial nerve palsies; hyperreflexia present"
    
    # Paraclinical investigations
    mri_brain: InvestigationResult = Field(default_factory=lambda: InvestigationResult(
        status="inconclusive",
        details="Mild, nonspecific T2/FLAIR hyperintensity in bilateral medial temporal regions; no overt mass effect or contrast enhancement",
        date="2024-03-12",
        abnormal=True
    ))
    
    eeg: InvestigationResult = Field(default_factory=lambda: InvestigationResult(
        status="positive",
        details="Diffuse background slowing in frontotemporal leads with burst of rhythmic delta activity ('extreme delta brush' pattern)",
        date="2024-03-14",
        abnormal=True
    ))
    
    csf_analysis: InvestigationResult = Field(default_factory=lambda: InvestigationResult(
        status="positive",
        details="Lymphocytic pleocytosis (28 WBC/mm³), protein 54 mg/dL, positive oligoclonal bands (type 2 pattern), normal glucose",
        date="2024-03-13",
        abnormal=True
    ))
    
    neuronal_antibodies: InvestigationResult = Field(default_factory=lambda: InvestigationResult(
        status="pending",
        details="Serum and CSF cell-based assay panel (NMDAR, LGI1, CASPR2, GABA-B) dispatched to reference lab. Results pending.",
        date="2024-03-14",
        abnormal=False
    ))
    
    infectious_workup: InvestigationResult = Field(default_factory=lambda: InvestigationResult(
        status="negative",
        details="CSF HSV-1/2 PCR negative, VZV PCR negative, Enterovirus PCR negative, Gram stain and bacterial cultures no growth",
        date="2024-03-13",
        abnormal=False
    ))
    
    other_investigations: Optional[str] = "Pelvic ultrasound performed to screen for underlying ovarian teratoma (pending final formal radiologist sign-off). Thyroid antibodies negative."
    clinical_notes: Optional[str] = "Patient initially seen in psychiatric emergency for acute psychosis; subsequently developed seizures and dyskinesia prompting neuro consult."
    
    timeline_events: List[TimelineEvent] = Field(default_factory=list)

class CriterionEvaluation(BaseModel):
    criterion_name: str
    description: str
    status: Literal["SUPPORTED", "NOT_SUPPORTED", "PENDING_OR_MISSING", "INCONCLUSIVE"]
    evidence_found: str
    clinical_significance: str

class RedFlagItem(BaseModel):
    severity: Literal["URGENT_EMERGENCY", "HIGH_ALERT", "MODERATE_WARNING"]
    title: str
    rationale: str
    recommended_action: str

class DifferentialItem(BaseModel):
    condition: str
    likelihood_category: Literal["HIGH_CONSIDERATION", "MODERATE_CONSIDERATION", "LOWER_CONSIDERATION"]
    supporting_points: List[str]
    contradictory_or_differentiating_points: List[str]
    next_evaluations: List[str]

class EvidenceCitation(BaseModel):
    id: str
    title: str
    authors: str
    journal: str
    year: int
    doi: str
    pmid: Optional[str] = None
    url: str
    excerpt: str
    relevance_tag: str
    verified_peer_reviewed: bool = True

class ClinicalReviewResponse(BaseModel):
    case_id: str
    generated_at: str
    synthesis_summary: str
    possible_ae_status: Literal["MET", "NOT_MET", "INSUFFICIENT_INFORMATION"]
    probable_ae_status: Literal["MET", "NOT_MET", "INSUFFICIENT_INFORMATION"]
    definite_nmdar_status: Literal["MET", "NOT_MET", "PENDING_ANTIBODY_CONFIRMATION", "INSUFFICIENT_INFORMATION"]
    graus_criteria: List[CriterionEvaluation]
    red_flags: List[RedFlagItem]
    differential_matrix: List[DifferentialItem]
    supporting_findings: List[str]
    contradictory_findings: List[str]
    missing_investigations: List[str]
    unresolved_questions: List[str]
    citations: List[EvidenceCitation]
    uncertainty_statement: str
    safety_disclaimer: str
    engine_source: str
