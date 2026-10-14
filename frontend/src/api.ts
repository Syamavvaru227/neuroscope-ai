import type { ClinicalCase, ClinicalReviewResponse, EvidenceCitation, TimelineEvent } from './types';

const API_BASE = `${(import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')}`;

// Curated fallback evidence
export const FALLBACK_EVIDENCE: EvidenceCitation[] = [
  {
    id: "EVID-GRAUS-2016",
    title: "A clinical approach to diagnosis of autoimmune encephalitis",
    authors: "Graus F, Titulaer MJ, Balu R, et al.",
    journal: "The Lancet Neurology",
    year: 2016,
    doi: "10.1016/S1474-4422(15)00401-9",
    pmid: "26906964",
    url: "https://doi.org/10.1016/S1474-4422(15)00401-9",
    excerpt: "Graus and colleagues present a clinical approach and criteria for classifying autoimmune encephalitis syndromes. The criteria combine clinical course, supporting investigations, and consideration of alternative causes; they are intended for clinical evaluation, not autonomous diagnosis.",
    relevance_tag: "Diagnostic Criteria / Possible & Probable AE",
    verified_peer_reviewed: true
  },
  {
    id: "EVID-DALMAU-2019",
    title: "An update on anti-NMDA receptor encephalitis for neurologists and psychiatrists: mechanisms and models",
    authors: "Dalmau J, Armangué T, Planagumà J, et al.",
    journal: "The Lancet Neurology",
    year: 2019,
    doi: "10.1016/S1474-4422(19)30244-3",
    pmid: "31326280",
    url: "https://doi.org/10.1016/S1474-4422(19)30244-3",
    excerpt: "Anti-NMDA receptor encephalitis features psychiatric manifestations, catatonia, speech reduction, seizures, and orofacial dyskinesias. CSF testing has higher sensitivity than serum. In women aged 18-45, ovarian teratoma is found in 40-50% of cases.",
    relevance_tag: "Anti-NMDAR / Clinical Features & Teratoma Screening",
    verified_peer_reviewed: true
  },
  {
    id: "EVID-TITULAER-2013",
    title: "Treatment and prognostic factors for long-term outcome in patients with anti-NMDA receptor encephalitis",
    authors: "Titulaer MJ, McCracken L, Gabilondo I, et al.",
    journal: "The Lancet Neurology",
    year: 2013,
    doi: "10.1016/S1474-4422(12)70310-1",
    pmid: "23290630",
    url: "https://doi.org/10.1016/S1474-4422(12)70310-1",
    excerpt: "This observational cohort study included 577 patients with anti-NMDA receptor encephalitis and examined treatment and prognostic factors. Its group-level findings do not determine an individual patient's diagnosis, prognosis, or treatment.",
    relevance_tag: "Prognosis & Treatment Escalation",
    verified_peer_reviewed: true
  },
  {
    id: "EVID-SCHMITZ-2012",
    title: "Extreme delta brush: a unique EEG pattern in adults with anti-NMDA receptor encephalitis",
    authors: "Schmitt SE, Pargeon K, Frechette ES, et al.",
    journal: "Neurology",
    year: 2012,
    doi: "10.1212/WNL.0b013e3182698cd8",
    pmid: "22933737",
    url: "https://doi.org/10.1212/WNL.0b013e3182698cd8",
    excerpt: "In this series of 23 adults monitored with continuous EEG, the authors described extreme delta brush in 7 patients (30.4%). The study is descriptive and the EEG finding must be interpreted in clinical context.",
    relevance_tag: "EEG Biomarker / Extreme Delta Brush",
    verified_peer_reviewed: true
  },
  {
    id: "EVID-IRANI-2011",
    title: "Faciobrachial dystonic seizures precede Lgi1 antibody limbic encephalitis",
    authors: "Irani SR, Michell AW, Lang B, et al.",
    journal: "Annals of Neurology",
    year: 2011,
    doi: "10.1002/ana.22307",
    pmid: "21416487",
    url: "https://doi.org/10.1002/ana.22307",
    excerpt: "This study describes frequent, brief dystonic seizures predominantly affecting the arm and ipsilateral face in patients associated with LGI1 antibodies; the events can precede limbic encephalitis. The reference is not an individual diagnostic rule.",
    relevance_tag: "LGI1 Encephalitis / Faciobrachial Dystonic Seizures",
    verified_peer_reviewed: true
  },
  {
    id: "EVID-VENKATESAN-2013",
    title: "Case definitions, diagnostic algorithms, and priorities in encephalitis: consensus statement",
    authors: "Venkatesan A, Tunkel AR, Bloch KC, et al.",
    journal: "Clinical Infectious Diseases",
    year: 2013,
    doi: "10.1093/cid/cit458",
    pmid: "23861361",
    url: "https://doi.org/10.1093/cid/cit458",
    excerpt: "International Encephalitis Consortium consensus: requires altered mental status lasting >=24h with no alternative cause, plus minor criteria (fever, seizures, focal deficits, CSF pleocytosis, abnormal neuroimaging or EEG).",
    relevance_tag: "International Consensus Case Definition",
    verified_peer_reviewed: true
  }
];

// Fallback initial cases
export const FALLBACK_CASES: ClinicalCase[] = [
  {
    id: "CASE-DEMO-01",
    is_synthetic: true,
    title: "Subacute Psychosis & Orofacial Dyskinesias with Extreme Delta Brush",
    patient_display_id: "SYNTH-NEURO-702",
    age: 24,
    sex: "Female",
    onset_type: "subacute_less_3_months",
    symptom_progression: "Rapid psychiatric deterioration over 18 days: insomnia -> anxiety/paranoia -> catatonia -> focal motor seizures and involuntary facial movements.",
    altered_consciousness: true,
    consciousness_details: "Fluctuating somnolence, mutism, responsive only to noxious stimuli during peak episodes.",
    seizures: true,
    seizure_details: "New-onset focal motor seizures with secondary generalization; required IV levetiracetam.",
    psychiatric_behavioral: true,
    psychiatric_details: "Auditory and visual hallucinations, agitation, profound sleep cycle disruption.",
    cognitive_memory: true,
    cognitive_details: "Marked short-term anterograde amnesia, disoriented to time and place.",
    movement_disorder: true,
    movement_details: "Stereotyped orofacial-lingual dyskinesias, choreiform movements of both upper extremities.",
    autonomic_dysfunction: true,
    autonomic_details: "Autonomic instability with episodic tachycardia (HR 130-140) and blood pressure fluctuations.",
    focal_cns_findings: false,
    focal_cns_details: "No focal cranial nerve deficits; bilateral brisk tendon reflexes.",
    mri_brain: {
      status: "inconclusive",
      details: "Mild, ill-defined T2/FLAIR hyperintensity in bilateral mesial temporal lobes without mass effect or enhancement.",
      date: "2024-03-12",
      abnormal: true
    },
    eeg: {
      status: "positive",
      details: "Abnormal continuous recording showing diffuse frontotemporal slowing and characteristic 'Extreme Delta Brush' pattern at 2 Hz.",
      date: "2024-03-14",
      abnormal: true
    },
    csf_analysis: {
      status: "positive",
      details: "Lymphocytic pleocytosis (32 WBC/mm³, 94% lymphocytes), protein 58 mg/dL, positive CSF-restricted oligoclonal bands (Pattern 2).",
      date: "2024-03-13",
      abnormal: true
    },
    neuronal_antibodies: {
      status: "pending",
      details: "Paired CSF and serum autoantibody cell-based assay panel (NMDAR, LGI1, CASPR2, AMPAR, GABA-B) dispatched to reference lab. Results pending.",
      date: "2024-03-14",
      abnormal: false
    },
    infectious_workup: {
      status: "negative",
      details: "CSF multiplex PCR panel negative for HSV-1, HSV-2, VZV, Enterovirus, Parechovirus. Gram stain negative.",
      date: "2024-03-13",
      abnormal: false
    },
    other_investigations: "Transvaginal ultrasound ordered to evaluate for underlying ovarian teratoma (preliminary reading pending formal sign-off).",
    clinical_notes: "Synthetic demonstration case simulating classic multi-stage Anti-NMDA Receptor Encephalitis in a young adult female patient.",
    timeline_events: [
      { id: "EVT-01", date: "2024-02-24", category: "symptom", title: "Viral-like Prodrome & Low-grade Fever", description: "Patient reported mild frontal headache, malaise, and low-grade temperature (37.8°C) lasting 4 days.", status: "normal" },
      { id: "EVT-02", date: "2024-03-02", category: "symptom", title: "Acute Psychiatric Symptoms & Insomnia", description: "Developed severe anxiety, paranoid delusions regarding colleagues, and total insomnia over 72 hours.", status: "abnormal" },
      { id: "EVT-03", date: "2024-03-06", category: "intervention", title: "Emergency Dept Psychiatric Evaluation", description: "Evaluated in psychiatric emergency. Prescribed low-dose olanzapine with minimal response; patient became confused.", status: "inconclusive" },
      { id: "EVT-04", date: "2024-03-10", category: "symptom", title: "First Generalized Tonic-Clonic Seizure", description: "Observed tonic-clonic seizure lasting 2 minutes in family presence. EMS summoned.", status: "critical", red_flag: true },
      { id: "EVT-05", date: "2024-03-12", category: "investigation", title: "Brain MRI (3T Contrast Protocol)", description: "Subtle, inconclusive T2/FLAIR hyperintensity in bilateral mesiotemporal lobes.", status: "inconclusive" },
      { id: "EVT-06", date: "2024-03-13", category: "investigation", title: "Lumbar Puncture & CSF Analysis", description: "Lymphocytic pleocytosis (32 WBC/mm³) and unique oligoclonal bands. Viral PCR sent.", status: "abnormal" },
      { id: "EVT-07", date: "2024-03-13", category: "intervention", title: "Empiric Intravenous Acyclovir Started", description: "Weight-based IV acyclovir 10 mg/kg q8h started empirically to cover potential herpes simplex encephalitis.", status: "normal" },
      { id: "EVT-08", date: "2024-03-14", category: "investigation", title: "Video-EEG & Discovery of Extreme Delta Brush", description: "Continuous EEG demonstrated hallmark Extreme Delta Brush (EDB) pattern and diffuse encephalopathy.", status: "abnormal" },
      { id: "EVT-09", date: "2024-03-14", category: "investigation", title: "Viral PCR Negative; Antibody Panel Sent", description: "HSV-1/2 PCR reported negative. Autoantibody panel dispatched. First-line methylprednisolone planned.", status: "pending" }
    ]
  },
  {
    id: "CASE-DEMO-02",
    is_synthetic: true,
    title: "Acute Febrile Encephalopathy with Unilateral Temporal Lesion (Urgent HSV vs AE)",
    patient_display_id: "SYNTH-NEURO-841",
    age: 58,
    sex: "Male",
    onset_type: "hyperacute_hours_days",
    symptom_progression: "Rapid 48-hour decline following acute fever (38.9°C), severe headache, expressive aphasia, and focal motor seizures.",
    altered_consciousness: true,
    consciousness_details: "Lethargic, confused, fluctuating GCS 10-12, profound disorientation.",
    seizures: true,
    seizure_details: "Cluster of focal seizures with right facial twitching and speech arrest.",
    psychiatric_behavioral: false,
    cognitive_memory: true,
    cognitive_details: "Expressive dysphasia and retrograde amnesia.",
    movement_disorder: false,
    autonomic_dysfunction: false,
    focal_cns_findings: true,
    focal_cns_details: "Right facial droop, nominal aphasia, right extensor plantar response.",
    mri_brain: {
      status: "positive",
      details: "Marked unilateral left temporal lobe edema with T2/FLAIR hyperintensity and petechial microhemorrhage on SWI, highly suspicious for necrotizing viral encephalitis.",
      date: "2024-03-15",
      abnormal: true
    },
    eeg: {
      status: "positive",
      details: "Periodic lateralized epileptiform discharges (PLEDs) over left frontotemporal channels.",
      date: "2024-03-15",
      abnormal: true
    },
    csf_analysis: {
      status: "positive",
      details: "Hemorrhagic CSF with lymphocytic predominance: 145 WBC/mm³, 1,200 RBC/mm³, elevated protein (92 mg/dL).",
      date: "2024-03-15",
      abnormal: true
    },
    neuronal_antibodies: {
      status: "not_performed",
      details: "Autoantibody testing held pending urgent viral PCR results.",
      date: null,
      abnormal: false
    },
    infectious_workup: {
      status: "pending",
      details: "STAT CSF HSV-1 and HSV-2 DNA PCR in progress. Viral culture and enterovirus PCR pending.",
      date: "2024-03-15",
      abnormal: false
    },
    clinical_notes: "Synthetic demonstration case highlighting crucial infectious rule-out workflow.",
    timeline_events: [
      { id: "EVT-201", date: "2024-03-14", category: "symptom", title: "Acute High Fever & Severe Frontotemporal Headache", description: "Temperature spike to 38.9°C with photophobia and nausea.", status: "critical", red_flag: true },
      { id: "EVT-202", date: "2024-03-15", category: "symptom", title: "Expressive Aphasia & Right Facial Seizures", description: "Difficulty finding words progressing to focal motor seizure with speech arrest.", status: "critical", red_flag: true },
      { id: "EVT-203", date: "2024-03-15", category: "investigation", title: "Brain MRI: Unilateral Left Temporal Lesion", description: "T2/FLAIR hyperintensity and petechial hemorrhage characteristic of HSV encephalitis.", status: "abnormal" },
      { id: "EVT-204", date: "2024-03-15", category: "intervention", title: "Urgent Intravenous Acyclovir Initiated", description: "IV acyclovir administered STAT within 1 hour of hospital arrival.", status: "normal" }
    ]
  },
  {
    id: "CASE-DEMO-03",
    is_synthetic: true,
    title: "Subacute Memory Loss & Faciobrachial Dystonic Seizures (Suspected LGI1 Encephalitis)",
    patient_display_id: "SYNTH-NEURO-915",
    age: 66,
    sex: "Male",
    onset_type: "subacute_less_3_months",
    symptom_progression: "6-week insidious decline in short-term recall accompanied by sudden, brief involuntary jerking movements of the right face and arm up to 40 times daily.",
    altered_consciousness: false,
    seizures: true,
    seizure_details: "Frequent stereotypical brief (<3 seconds) unilateral facial grimacing with synchronous arm posturing (pathognomonic FBDS).",
    psychiatric_behavioral: true,
    psychiatric_details: "Irritability and sleep disruption, mild apathy.",
    cognitive_memory: true,
    cognitive_details: "Prominent anterograde episodic memory impairment (MoCA score 21/30).",
    movement_disorder: true,
    movement_details: "Faciobrachial dystonic jerks; no chorea or cerebellar ataxia.",
    autonomic_dysfunction: false,
    focal_cns_findings: false,
    mri_brain: {
      status: "inconclusive",
      details: "Subtle increased T2/FLAIR signal in medial aspect of left hippocampus without significant volume loss or contrast enhancement.",
      date: "2024-03-10",
      abnormal: true
    },
    eeg: {
      status: "inconclusive",
      details: "Interictal EEG shows mild left temporal theta slowing; no overt epileptiform spikes captured during dystonic jerks.",
      date: "2024-03-11",
      abnormal: true
    },
    csf_analysis: {
      status: "negative",
      details: "Normal CSF: 2 WBC/mm³, protein 38 mg/dL, normal glucose, negative oligoclonal bands (acellular CSF occurs in ~70% of LGI1 cases).",
      date: "2024-03-11",
      abnormal: false
    },
    neuronal_antibodies: {
      status: "pending",
      details: "Serum and CSF LGI1 / CASPR2 antibody assays sent. Serum test is highly sensitive for LGI1 antibodies.",
      date: "2024-03-12",
      abnormal: false
    },
    infectious_workup: {
      status: "negative",
      details: "Comprehensive CSF viral PCR negative.",
      date: "2024-03-11",
      abnormal: false
    },
    other_investigations: "Serum sodium: 128 mEq/L (moderate hyponatremia due to SIADH, typical association with LGI1 antibodies).",
    clinical_notes: "Synthetic demonstration case illustrating anti-LGI1 encephalitis.",
    timeline_events: [
      { id: "EVT-301", date: "2024-02-01", category: "symptom", title: "Onset of Episodic Working Memory Lapses", description: "Repeatedly asking the same questions, misplacing household keys, forgetting appointments.", status: "normal" },
      { id: "EVT-302", date: "2024-02-18", category: "symptom", title: "Onset of Involuntary Facial & Arm Twitches", description: "Brief 2-second twitches of right face and arm, dismissed initially as muscle spasms.", status: "abnormal" },
      { id: "EVT-303", date: "2024-03-05", category: "symptom", title: "Frequency Escalation to 30-40 Episodes Daily", description: "Events occurring dozens of times daily, interfering with eating and writing.", status: "critical", red_flag: true },
      { id: "EVT-304", date: "2024-03-10", category: "investigation", title: "Serum Chemistry Shows Hyponatremia (Na 128)", description: "Refractory mild-to-moderate hyponatremia consistent with SIADH.", status: "abnormal" },
      { id: "EVT-305", date: "2024-03-11", category: "investigation", title: "Normal CSF Analysis (Acellular)", description: "Lumbar puncture reveals normal cell count; absence of pleocytosis does NOT exclude LGI1.", status: "inconclusive" },
      { id: "EVT-306", date: "2024-03-12", category: "investigation", title: "Serum and CSF LGI1 Antibody Panel Sent", description: "Dispatched to reference lab. Immunotherapy trial (IV methylprednisolone) actively considered.", status: "pending" }
    ]
  }
];

// Helper to evaluate case locally if backend is unavailable
export function generateLocalReview(caseData: ClinicalCase): ClinicalReviewResponse {
  const isSubacute = caseData.onset_type === 'subacute_less_3_months';
  const hasCoreSymptoms = caseData.cognitive_memory || caseData.altered_consciousness || caseData.psychiatric_behavioral;
  const c1Met = isSubacute && hasCoreSymptoms;

  const paraclinicalPoints: string[] = [];
  if (caseData.seizures) paraclinicalPoints.push(`Seizures: ${caseData.seizure_details || 'Documented'}`);
  if (caseData.focal_cns_findings) paraclinicalPoints.push(`Focal CNS: ${caseData.focal_cns_details || 'Documented'}`);
  if (caseData.csf_analysis.abnormal) paraclinicalPoints.push(`CSF Inflammatory: ${caseData.csf_analysis.details || 'Documented'}`);
  if (caseData.mri_brain.abnormal) paraclinicalPoints.push(`MRI Neuroimaging: ${caseData.mri_brain.details || 'Documented'}`);
  const c2Met = paraclinicalPoints.length > 0;

  const infectiousExcluded = caseData.infectious_workup.status === 'negative';
  const infectiousPending = caseData.infectious_workup.status === 'pending';

  const possibleStatus = (c1Met && c2Met && infectiousExcluded) 
    ? 'MET' 
    : (infectiousPending || caseData.csf_analysis.status === 'pending') 
    ? 'INSUFFICIENT_INFORMATION' 
    : 'NOT_MET';

  const probableStatus = (possibleStatus === 'MET' && (caseData.eeg.status === 'positive' || caseData.movement_disorder))
    ? 'MET'
    : 'INSUFFICIENT_INFORMATION';

  const redFlags = [];
  if (caseData.infectious_workup.status === 'pending') {
    redFlags.push({
      severity: 'URGENT_EMERGENCY' as const,
      title: 'Infectious Encephalitis Evaluation Incomplete',
      rationale: 'Infectious causes remain under evaluation in this synthetic case. This prototype cannot assess urgency or determine whether a condition is present.',
      recommended_action: 'Have the treating clinical team promptly review pending results and the safety plan under local protocols.'
    });
  }
  if (caseData.eeg.details?.toLowerCase().includes('delta brush')) {
    redFlags.push({
      severity: 'HIGH_ALERT' as const,
      title: 'Extreme Delta Brush Electroencephalographic Pattern',
      rationale: 'Hallmark finding in anti-NMDA receptor encephalitis associated with prolonged ICU stay and autonomic risk.',
      recommended_action: 'Implement continuous cardiac telemetry and respiratory monitoring.'
    });
  }
  if (caseData.autonomic_dysfunction) {
    redFlags.push({
      severity: 'HIGH_ALERT' as const,
      title: 'Autonomic Instability / Dysautonomia Manifestation',
      rationale: 'Fluctuating vitals indicate limbic or brainstem involvement, carrying risk of sudden bradycardia or hypoventilation.',
      recommended_action: 'Close neuro-ICU / telemetry monitoring and airway contingency planning.'
    });
  }

  return {
    case_id: caseData.id,
    generated_at: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    synthesis_summary: `Case ${caseData.patient_display_id} exhibits a clinical presentation concerning for Autoimmune Encephalitis. Based on international consensus criteria (Graus et al., 2016), the criteria for 'Possible Autoimmune Encephalitis' are currently ${possibleStatus}. Objective findings including inflammatory CSF markers, EEG abnormalities, and movement/seizure manifestations prioritize an autoimmune etiology over primary psychiatric disorder. Clinical certainty remains contingent on pending autoantibody results and continuous observation.`,
    possible_ae_status: possibleStatus,
    probable_ae_status: probableStatus,
    definite_nmdar_status: caseData.neuronal_antibodies.status === 'positive' ? 'MET' : 'PENDING_ANTIBODY_CONFIRMATION',
    graus_criteria: [
      {
        criterion_name: "Criterion 1: Subacute Onset (<3 Months) of Core Symptoms",
        description: "Subacute rapid progression (<3 months) of working memory deficits, altered mental status, or psychiatric symptoms.",
        status: c1Met ? "SUPPORTED" : "INCONCLUSIVE",
        evidence_found: `${caseData.onset_type.replace(/_/g, ' ')}; Cognitive: ${caseData.cognitive_memory}; Psych: ${caseData.psychiatric_behavioral}`,
        clinical_significance: "Essential prerequisite under Graus et al. 2016."
      },
      {
        criterion_name: "Criterion 2: Objective Paraclinical / Focal CNS Evidence",
        description: "At least one of: New focal CNS findings, Seizures, CSF pleocytosis (>5 WBC/mm³), or MRI suggestive of encephalitis.",
        status: c2Met ? "SUPPORTED" : "PENDING_OR_MISSING",
        evidence_found: paraclinicalPoints.join('; ') || 'None documented',
        clinical_significance: "Establishes objective inflammatory CNS involvement."
      },
      {
        criterion_name: "Criterion 3: Exclusion of Infectious & Toxic/Metabolic Mimics",
        description: "Reasonable exclusion of infectious encephalitis (specifically HSV, VZV), toxic-metabolic encephalopathy, and CNS malignancy.",
        status: infectiousExcluded ? "SUPPORTED" : (infectiousPending ? "PENDING_OR_MISSING" : "NOT_SUPPORTED"),
        evidence_found: `Infectious workup status: ${caseData.infectious_workup.status} (${caseData.infectious_workup.details})`,
        clinical_significance: "Critical safety requirement before intensifying immunosuppression."
      },
      {
        criterion_name: "Criterion 4: Electroencephalography (EEG) & Neuronal Autoantibodies",
        description: "EEG showing epileptic discharges or extreme delta brush; paired serum/CSF antibody confirmation.",
        status: caseData.eeg.abnormal ? "SUPPORTED" : "PENDING_OR_MISSING",
        evidence_found: `EEG: ${caseData.eeg.details}; Antibodies: ${caseData.neuronal_antibodies.details}`,
        clinical_significance: "Provides syndrome-specific confirmation."
      }
    ],
    red_flags: redFlags,
    differential_matrix: [
      {
        condition: "Autoimmune Encephalitis (e.g. Anti-NMDAR, Anti-LGI1, Seronegative AE)",
        likelihood_category: "HIGH_CONSIDERATION",
        supporting_points: ["Subacute multifaceted clinical presentation", "Paraclinical markers (CSF pleocytosis/oligoclonal bands, abnormal EEG)"],
        contradictory_or_differentiating_points: ["Pending neuronal autoantibody titers"],
        next_evaluations: ["Expedite CSF/serum cell-based assay antibody panel", "Screen for occult teratoma / malignancy"]
      },
      {
        condition: "Infectious Encephalitis (HSV-1, VZV, Enterovirus)",
        likelihood_category: infectiousExcluded ? "LOWER_CONSIDERATION" : "HIGH_CONSIDERATION",
        supporting_points: ["Acute neurological presentation with seizures and altered consciousness"],
        contradictory_or_differentiating_points: infectiousExcluded ? ["Negative CSF HSV-1/2 PCR"] : ["Infectious workup still pending"],
        next_evaluations: ["Have the treating clinicians review result timing, findings, and the full clinical picture; consider whether further evaluation is warranted"]
      },
      {
        condition: "Primary Psychiatric Disorder (First-Episode Psychosis / Mania)",
        likelihood_category: "LOWER_CONSIDERATION",
        supporting_points: ["Prominent psychiatric and behavioral disruption"],
        contradictory_or_differentiating_points: ["Objective neurological signs (seizures, CSF pleocytosis, EEG abnormality) inconsistent with primary psychiatric etiology"],
        next_evaluations: ["Liaison psychiatry evaluation with avoidance of neuroleptic triggers"]
      }
    ],
    supporting_findings: [
      `Onset: ${caseData.onset_type.replace(/_/g, ' ')}`,
      `Documented symptoms: ${[
        caseData.cognitive_memory ? 'Cognitive/Memory Deficits' : '',
        caseData.psychiatric_behavioral ? 'Psychiatric Symptoms' : '',
        caseData.seizures ? 'Seizures' : '',
        caseData.movement_disorder ? 'Movement Disorder' : ''
      ].filter(Boolean).join(', ')}`,
      caseData.csf_analysis.abnormal ? `CSF: ${caseData.csf_analysis.details}` : '',
      caseData.eeg.abnormal ? `EEG: ${caseData.eeg.details}` : ''
    ].filter(Boolean),
    contradictory_findings: [
      caseData.neuronal_antibodies.status === 'negative' ? 'Negative antibody panel does not exclude seronegative autoimmune encephalitis.' : '',
      caseData.mri_brain.status === 'negative' ? 'Normal MRI occurs in a significant subset of autoimmune encephalitis cases.' : ''
    ].filter(Boolean),
    missing_investigations: [
      caseData.neuronal_antibodies.status === 'pending' ? 'Neuronal autoantibody panel results pending.' : '',
      caseData.infectious_workup.status === 'pending' ? 'CSF viral PCR panel results pending.' : '',
      caseData.sex === 'Female' && (caseData.age || 0) <= 45 ? 'Pelvic ultrasound / MRI teratoma screening completion.' : ''
    ].filter(Boolean),
    unresolved_questions: [
      "Have the treating clinicians reviewed pending infectious results and the current safety plan?",
      "If autoantibody testing returns negative, does the clinical course meet published criteria for antibody-negative probable autoimmune encephalitis?",
      "Are telemetry and respiratory rate monitoring active for potential dysautonomia or central hypoventilation?"
    ],
    citations: FALLBACK_EVIDENCE,
    uncertainty_statement: "Clinical Uncertainty Notice: This evaluation is generated by an algorithmic clinical decision-support prototype. Diagnostic criteria reflect Graus et al. (2016) consensus guidelines. A designation of 'MET' or 'SUPPORTED' indicates that documented findings align with guideline thresholds, but does NOT establish a definitive medical diagnosis. Negative antibody assays do not exclude seronegative autoimmune encephalitis.",
    safety_disclaimer: "RESEARCH & DEMONSTRATION PROTOTYPE: NEUROSCOPE AI is an investigational decision-support interface for clinical review and research. It is not an FDA/CE-cleared medical device and must never replace clinical judgement or delay emergency therapy.",
    engine_source: "local_demo_rules_fallback"
  };
}

export async function fetchHealth(): Promise<{ status: string; engine?: string; llm_augmented?: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      return { status: data.status, engine: data.clinical_logic || data.service, llm_augmented: Boolean(data.llm_augmented) };
    }
  } catch {
    // Backend offline / not yet ready
  }
  return { status: 'offline', engine: 'Local Consensus Engine' };
}

export async function saveCase(caseData: ClinicalCase): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/cases`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData), signal: AbortSignal.timeout(4000)
    });
    return res.ok;
  } catch { return false; }
}

export async function fetchCases(): Promise<ClinicalCase[]> {
  try {
    const res = await fetch(`${API_BASE}/cases`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }
  return FALLBACK_CASES;
}

export async function analyzeCase(caseData: ClinicalCase): Promise<ClinicalReviewResponse> {
  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData),
      signal: AbortSignal.timeout(15000)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }
  return generateLocalReview(caseData);
}

export async function updateTimelineEvents(caseId: string, events: TimelineEvent[]): Promise<TimelineEvent[]> {
  try {
    const res = await fetch(`${API_BASE}/cases/${caseId}/timeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(events),
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }
  return [...events].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
}

export async function fetchEvidence(query: string = ''): Promise<EvidenceCitation[]> {
  try {
    const url = query ? `${API_BASE}/evidence/search?q=${encodeURIComponent(query)}` : `${API_BASE}/evidence`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }
  if (!query) return FALLBACK_EVIDENCE;
  const q = query.toLowerCase();
  return FALLBACK_EVIDENCE.filter(e => 
    e.title.toLowerCase().includes(q) || 
    e.excerpt.toLowerCase().includes(q) || 
    e.authors.toLowerCase().includes(q) ||
    e.relevance_tag.toLowerCase().includes(q)
  );
}
