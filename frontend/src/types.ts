export interface InvestigationResult {
  status: 'positive' | 'negative' | 'inconclusive' | 'pending' | 'not_performed';
  details?: string;
  date?: string | null;
  abnormal: boolean;
}

export interface TimelineEvent {
  id: string;
  date: string;
  category: 'symptom' | 'investigation' | 'intervention' | 'milestone';
  title: string;
  description: string;
  status: 'normal' | 'abnormal' | 'inconclusive' | 'pending' | 'critical';
  red_flag?: boolean;
}

export interface ClinicalCase {
  id: string;
  is_synthetic: boolean;
  title: string;
  patient_display_id: string;
  age?: number;
  sex?: 'Female' | 'Male' | 'Other' | 'Unknown';
  onset_type: 'hyperacute_hours_days' | 'subacute_less_3_months' | 'chronic_more_3_months' | 'unknown';
  symptom_progression: string;
  altered_consciousness: boolean;
  consciousness_details?: string;
  seizures: boolean;
  seizure_details?: string;
  psychiatric_behavioral: boolean;
  psychiatric_details?: string;
  cognitive_memory: boolean;
  cognitive_details?: string;
  movement_disorder: boolean;
  movement_details?: string;
  autonomic_dysfunction: boolean;
  autonomic_details?: string;
  focal_cns_findings: boolean;
  focal_cns_details?: string;
  mri_brain: InvestigationResult;
  eeg: InvestigationResult;
  csf_analysis: InvestigationResult;
  neuronal_antibodies: InvestigationResult;
  infectious_workup: InvestigationResult;
  other_investigations?: string;
  clinical_notes?: string;
  timeline_events: TimelineEvent[];
}

export interface CriterionEvaluation {
  criterion_name: string;
  description: string;
  status: 'SUPPORTED' | 'NOT_SUPPORTED' | 'PENDING_OR_MISSING' | 'INCONCLUSIVE';
  evidence_found: string;
  clinical_significance: string;
}

export interface RedFlagItem {
  severity: 'URGENT_EMERGENCY' | 'HIGH_ALERT' | 'MODERATE_WARNING';
  title: string;
  rationale: string;
  recommended_action: string;
}

export interface DifferentialItem {
  condition: string;
  likelihood_category: 'HIGH_CONSIDERATION' | 'MODERATE_CONSIDERATION' | 'LOWER_CONSIDERATION';
  supporting_points: string[];
  contradictory_or_differentiating_points: string[];
  next_evaluations: string[];
}

export interface EvidenceCitation {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  pmid?: string;
  url: string;
  excerpt: string;
  relevance_tag: string;
  verified_peer_reviewed: boolean;
}

export interface ClinicalReviewResponse {
  case_id: string;
  generated_at: string;
  synthesis_summary: string;
  possible_ae_status: 'MET' | 'NOT_MET' | 'INSUFFICIENT_INFORMATION';
  probable_ae_status: 'MET' | 'NOT_MET' | 'INSUFFICIENT_INFORMATION';
  definite_nmdar_status: 'MET' | 'NOT_MET' | 'PENDING_ANTIBODY_CONFIRMATION' | 'INSUFFICIENT_INFORMATION';
  graus_criteria: CriterionEvaluation[];
  red_flags: RedFlagItem[];
  differential_matrix: DifferentialItem[];
  supporting_findings: string[];
  contradictory_findings: string[];
  missing_investigations: string[];
  unresolved_questions: string[];
  citations: EvidenceCitation[];
  uncertainty_statement: string;
  safety_disclaimer: string;
  engine_source: string;
}
