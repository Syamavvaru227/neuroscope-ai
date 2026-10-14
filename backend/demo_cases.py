from typing import List, Dict
from models import ClinicalCase, InvestigationResult, TimelineEvent

DEMO_CASES: Dict[str, ClinicalCase] = {
    "SYNTH-NEURO-702": ClinicalCase(
        id="CASE-DEMO-01",
        is_synthetic=True,
        title="Subacute Psychosis & Orofacial Dyskinesias with Extreme Delta Brush",
        patient_display_id="SYNTH-NEURO-702",
        age=24,
        sex="Female",
        onset_type="subacute_less_3_months",
        symptom_progression="Rapid psychiatric deterioration over 18 days: insomnia -> anxiety/paranoia -> catatonia -> focal motor seizures and involuntary facial movements.",
        altered_consciousness=True,
        consciousness_details="Fluctuating somnolence, mutism, responsive only to noxious stimuli during peak episodes.",
        seizures=True,
        seizure_details="New-onset focal motor seizures with secondary generalization; required IV levetiracetam.",
        psychiatric_behavioral=True,
        psychiatric_details="Auditory and visual hallucinations, agitation, profound sleep cycle disruption.",
        cognitive_memory=True,
        cognitive_details="Marked short-term anterograde amnesia, disoriented to time and place.",
        movement_disorder=True,
        movement_details="Stereotyped orofacial-lingual dyskinesias, choreiform movements of both upper extremities.",
        autonomic_dysfunction=True,
        autonomic_details="Autonomic instability with episodic tachycardia (HR 130-140) and blood pressure fluctuations.",
        focal_cns_findings=False,
        focal_cns_details="No focal cranial nerve deficits; bilateral brisk tendon reflexes, flexor plantar responses.",
        mri_brain=InvestigationResult(
            status="inconclusive",
            details="Mild, ill-defined T2/FLAIR hyperintensity in bilateral mesial temporal lobes without restricted diffusion or pathological enhancement.",
            date="2024-03-12",
            abnormal=True
        ),
        eeg=InvestigationResult(
            status="positive",
            details="Abnormal continuous recording showing diffuse frontotemporal slowing and characteristic 'Extreme Delta Brush' (EDB) pattern at 2 Hz with superimposed fast beta bursts.",
            date="2024-03-14",
            abnormal=True
        ),
        csf_analysis=InvestigationResult(
            status="positive",
            details="Clear CSF, opening pressure 190 mmH2O. Lymphocytic pleocytosis (32 WBC/mm³, 94% lymphocytes), protein 58 mg/dL, glucose 64 mg/dL. Positive CSF-restricted oligoclonal bands (Pattern 2).",
            date="2024-03-13",
            abnormal=True
        ),
        neuronal_antibodies=InvestigationResult(
            status="pending",
            details="Paired CSF and serum autoantibody cell-based assay panel (anti-NMDAR, LGI1, CASPR2, AMPAR, GABA-B) dispatched to neuroimmunology reference lab. Result awaiting final validation.",
            date="2024-03-14",
            abnormal=False
        ),
        infectious_workup=InvestigationResult(
            status="negative",
            details="CSF multiplex PCR panel negative for HSV-1, HSV-2, VZV, Enterovirus, Parechovirus, and HHV-6. Gram stain negative, fungal stain negative.",
            date="2024-03-13",
            abnormal=False
        ),
        other_investigations="Transvaginal ultrasound ordered to evaluate for underlying ovarian teratoma (preliminary reading pending formal radiology sign-off). Serum ANA and anti-TPO within normal limits.",
        clinical_notes="Synthetic demonstration case simulating classic multi-stage Anti-NMDA Receptor Encephalitis in a young adult female patient. Demonstrates typical diagnostic dilemma where initial psychiatric presentation precedes neurological deterioration.",
        timeline_events=[
            TimelineEvent(
                id="EVT-01",
                date="2024-02-24",
                category="symptom",
                title="Viral-like Prodrome & Low-grade Fever",
                description="Patient reported mild frontal headache, malaise, and low-grade temperature (37.8°C) lasting 4 days.",
                status="normal"
            ),
            TimelineEvent(
                id="EVT-02",
                date="2024-03-02",
                category="symptom",
                title="Acute Psychiatric Symptoms & Insomnia",
                description="Developed severe anxiety, paranoid delusions regarding colleagues, and total insomnia over 72 hours.",
                status="abnormal"
            ),
            TimelineEvent(
                id="EVT-03",
                date="2024-03-06",
                category="intervention",
                title="Emergency Dept Psychiatric Evaluation",
                description="Evaluated in psychiatric emergency. Prescribed low-dose olanzapine with minimal response; patient became progressively confused.",
                status="inconclusive"
            ),
            TimelineEvent(
                id="EVT-04",
                date="2024-03-10",
                category="symptom",
                title="First Generalized Tonic-Clonic Seizure",
                description="Observed tonic-clonic seizure lasting 2 minutes in family presence. Emergency medical services summoned.",
                status="critical",
                red_flag=True
            ),
            TimelineEvent(
                id="EVT-05",
                date="2024-03-12",
                category="investigation",
                title="Brain MRI (3T Contrast Protocol)",
                description="Subtle, inconclusive T2/FLAIR hyperintensity in bilateral mesiotemporal lobes.",
                status="inconclusive"
            ),
            TimelineEvent(
                id="EVT-06",
                date="2024-03-13",
                category="investigation",
                title="Lumbar Puncture & CSF Analysis",
                description="Lymphocytic pleocytosis (32 WBC/mm³) and unique oligoclonal bands. Multiplex viral PCR sent.",
                status="abnormal"
            ),
            TimelineEvent(
                id="EVT-07",
                date="2024-03-13",
                category="intervention",
                title="Empiric Intravenous Acyclovir Started",
                description="Weight-based IV acyclovir 10 mg/kg q8h started empirically to cover potential herpes simplex encephalitis.",
                status="normal"
            ),
            TimelineEvent(
                id="EVT-08",
                date="2024-03-14",
                category="investigation",
                title="Video-EEG & Discovery of Extreme Delta Brush",
                description="Continuous EEG demonstrated hallmark Extreme Delta Brush (EDB) pattern and diffuse encephalopathy.",
                status="abnormal"
            ),
            TimelineEvent(
                id="EVT-09",
                date="2024-03-14",
                category="investigation",
                title="Viral PCR Negative; Antibody Panel Sent",
                description="HSV-1/2 PCR reported negative. Autoantibody panel dispatched. First-line methylprednisolone pulse therapy planned.",
                status="pending"
            )
        ]
    ),

    "SYNTH-NEURO-841": ClinicalCase(
        id="CASE-DEMO-02",
        is_synthetic=True,
        title="Acute Febrile Encephalopathy with Unilateral Temporal Lesion (Urgent HSV vs AE)",
        patient_display_id="SYNTH-NEURO-841",
        age=58,
        sex="Male",
        onset_type="hyperacute_hours_days",
        symptom_progression="Rapid 48-hour decline following acute fever (38.9°C), severe headache, expressive aphasia, and focal motor seizures.",
        altered_consciousness=True,
        consciousness_details="Lethargic, confused, fluctuating GCS 10-12, profound disorientation.",
        seizures=True,
        seizure_details="Cluster of focal seizures with right facial twitching and speech arrest.",
        psychiatric_behavioral=False,
        psychiatric_details="None prior to onset; acute agitation secondary to delirium.",
        cognitive_memory=True,
        cognitive_details="Expressive dysphasia and retrograde amnesia.",
        movement_disorder=False,
        movement_details="No chorea or dyskinesias.",
        autonomic_dysfunction=False,
        autonomic_details="Tachycardia congruent with fever (HR 108).",
        focal_cns_findings=True,
        focal_cns_details="Right facial droop, nominal aphasia, right extensor plantar response.",
        mri_brain=InvestigationResult(
            status="positive",
            details="Marked unilateral left temporal lobe edema with T2/FLAIR hyperintensity and petechial microhemorrhage on SWI, highly suspicious for necrotizing viral encephalitis.",
            date="2024-03-15",
            abnormal=True
        ),
        eeg=InvestigationResult(
            status="positive",
            details="Periodic lateralized epileptiform discharges (PLEDs) over left frontotemporal channels.",
            date="2024-03-15",
            abnormal=True
        ),
        csf_analysis=InvestigationResult(
            status="positive",
            details="Hemorrhagic CSF with lymphocytic predominance: 145 WBC/mm³, 1,200 RBC/mm³, elevated protein (92 mg/dL), normal glucose ratio.",
            date="2024-03-15",
            abnormal=True
        ),
        neuronal_antibodies=InvestigationResult(
            status="not_performed",
            details="Autoantibody testing held pending urgent viral PCR results.",
            date=None,
            abnormal=False
        ),
        infectious_workup=InvestigationResult(
            status="pending",
            details="STAT CSF HSV-1 and HSV-2 DNA PCR in progress. Viral culture and enterovirus PCR pending.",
            date="2024-03-15",
            abnormal=False
        ),
        other_investigations="CT angiogram negative for vascular malformation. Chest X-ray clear.",
        clinical_notes="Synthetic demonstration case highlighting crucial infectious rule-out workflow. Illustrates the imperative not to classify acute unilateral temporal necrotizing encephalitis as autoimmune prior to definitive infectious exclusion.",
        timeline_events=[
            TimelineEvent(
                id="EVT-201",
                date="2024-03-14",
                category="symptom",
                title="Acute High Fever & Severe Frontotemporal Headache",
                description="Temperature spike to 38.9°C with photophobia and nausea.",
                status="critical",
                red_flag=True
            ),
            TimelineEvent(
                id="EVT-202",
                date="2024-03-15",
                category="symptom",
                title="Expressive Aphasia & Right Facial Seizures",
                description="Difficulty finding words progressing to focal motor seizure with speech arrest.",
                status="critical",
                red_flag=True
            ),
            TimelineEvent(
                id="EVT-203",
                date="2024-03-15",
                category="investigation",
                title="Brain MRI: Unilateral Left Temporal Lesion",
                description="T2/FLAIR hyperintensity and petechial hemorrhage characteristic of HSV encephalitis.",
                status="abnormal"
            ),
            TimelineEvent(
                id="EVT-204",
                date="2024-03-15",
                category="intervention",
                title="Urgent Intravenous Acyclovir Initiated",
                description="IV acyclovir administered STAT within 1 hour of hospital arrival.",
                status="normal"
            )
        ]
    ),

    "SYNTH-NEURO-915": ClinicalCase(
        id="CASE-DEMO-03",
        is_synthetic=True,
        title="Subacute Memory Loss & Faciobrachial Dystonic Seizures (Suspected LGI1 Encephalitis)",
        patient_display_id="SYNTH-NEURO-915",
        age=66,
        sex="Male",
        onset_type="subacute_less_3_months",
        symptom_progression="6-week insidious decline in short-term recall accompanied by sudden, brief involuntary jerking movements of the right face and arm occurring up to 40 times daily.",
        altered_consciousness=False,
        consciousness_details="Conscious and alert between episodes, but troubled by memory gaps.",
        seizures=True,
        seizure_details="Frequent stereotypical brief (<3 seconds) unilateral facial grimacing with synchronous ipsilateral arm posturing (pathognomonic Faciobrachial Dystonic Seizures - FBDS).",
        psychiatric_behavioral=True,
        psychiatric_details="Irritability and sleep disruption, mild apathy.",
        cognitive_memory=True,
        cognitive_details="Prominent anterograde episodic memory impairment (MoCA score 21/30).",
        movement_disorder=True,
        movement_details="Faciobrachial dystonic jerks; no chorea or cerebellar ataxia.",
        autonomic_dysfunction=False,
        autonomic_details="Normal blood pressure and cardiac rhythm.",
        focal_cns_findings=False,
        focal_cns_details="No focal sensorimotor deficit on formal interictal examination.",
        mri_brain=InvestigationResult(
            status="inconclusive",
            details="Subtle increased T2/FLAIR signal in medial aspect of left hippocampus without significant volume loss or contrast enhancement. Radiologist notes 'possible age-related or early limbic swelling'.",
            date="2024-03-10",
            abnormal=True
        ),
        eeg=InvestigationResult(
            status="inconclusive",
            details="Interictal EEG shows mild left temporal theta slowing; no overt epileptiform spikes captured during clinical dystonic jerks (common in FBDS due to deep subcortical origin).",
            date="2024-03-11",
            abnormal=True
        ),
        csf_analysis=InvestigationResult(
            status="negative",
            details="Normal CSF: 2 WBC/mm³, protein 38 mg/dL, normal glucose, negative oligoclonal bands (acellular CSF occurs in ~70% of LGI1 cases!).",
            date="2024-03-11",
            abnormal=False
        ),
        neuronal_antibodies=InvestigationResult(
            status="pending",
            details="Serum and CSF LGI1 / CASPR2 antibody assays sent. Serum test is highly sensitive for LGI1 antibodies.",
            date="2024-03-12",
            abnormal=False
        ),
        infectious_workup=InvestigationResult(
            status="negative",
            details="Comprehensive CSF viral PCR negative.",
            date="2024-03-11",
            abnormal=False
        ),
        other_investigations="Serum sodium: 128 mEq/L (moderate hyponatremia due to SIADH, typical association with LGI1 antibodies). CT chest/abdomen/pelvis negative for paraneoplastic malignancy.",
        clinical_notes="Synthetic demonstration case illustrating anti-LGI1 encephalitis. Highlights how normal routine CSF and non-epileptiform surface EEG can mislead clinicians, while FBDS and hyponatremia provide the crucial diagnostic clues.",
        timeline_events=[
            TimelineEvent(
                id="EVT-301",
                date="2024-02-01",
                category="symptom",
                title="Onset of Episodic Working Memory Lapses",
                description="Repeatedly asking the same questions, misplacing household keys, forgetting appointments.",
                status="normal"
            ),
            TimelineEvent(
                id="EVT-302",
                date="2024-02-18",
                category="symptom",
                title="Onset of Involuntary Facial & Arm Twitches",
                description="Brief 2-second twitches of right face and arm, dismissed initially as muscle spasms or tics.",
                status="abnormal"
            ),
            TimelineEvent(
                id="EVT-303",
                date="2024-03-05",
                category="symptom",
                title="Frequency Escalation to 30-40 Episodes Daily",
                description="Events occurring dozens of times daily, interfering with eating and writing.",
                status="critical",
                red_flag=True
            ),
            TimelineEvent(
                id="EVT-304",
                date="2024-03-10",
                category="investigation",
                title="Serum Chemistry Shows Hyponatremia (Na 128)",
                description="Refractory mild-to-moderate hyponatremia consistent with SIADH.",
                status="abnormal"
            ),
            TimelineEvent(
                id="EVT-305",
                date="2024-03-11",
                category="investigation",
                title="Normal CSF Analysis (Acellular)",
                description="Lumbar puncture reveals normal cell count; absence of pleocytosis does NOT exclude LGI1.",
                status="inconclusive"
            ),
            TimelineEvent(
                id="EVT-306",
                date="2024-03-12",
                category="investigation",
                title="Serum and CSF LGI1 Antibody Panel Sent",
                description="Dispatched to reference lab. Immunotherapy trial (IV methylprednisolone) actively considered.",
                status="pending"
            )
        ]
    )
}
