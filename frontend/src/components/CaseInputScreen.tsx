import React, { useState } from 'react';
import type { ClinicalCase, InvestigationResult } from '../types';
import { 
  Save, ArrowRight, Brain, Stethoscope, Microscope
} from 'lucide-react';

interface CaseInputScreenProps {
  currentCase: ClinicalCase;
  onSaveCase: (updatedCase: ClinicalCase) => Promise<boolean>;
  onProceedToTimeline: () => void;
}

export const CaseInputScreen: React.FC<CaseInputScreenProps> = ({
  currentCase,
  onSaveCase,
  onProceedToTimeline
}) => {
  const [formData, setFormData] = useState<ClinicalCase>({ ...currentCase });
  const [savedNotification, setSavedNotification] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleInputChange = (field: keyof ClinicalCase, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInvestigationChange = (
    invKey: 'mri_brain' | 'eeg' | 'csf_analysis' | 'neuronal_antibodies' | 'infectious_workup',
    field: keyof InvestigationResult,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [invKey]: {
        ...prev[invKey],
        [field]: value,
        abnormal: field === 'status' ? (value === 'positive' || value === 'inconclusive') : prev[invKey].abnormal
      }
    }));
  };

  const handleSave = async () => {
    const saved = await onSaveCase(formData);
    setSaveMessage(saved ? 'Saved for this demo session.' : 'Updated in this browser session; server is unavailable.');
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">Structured Input</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              CASE ID: {formData.patient_display_id}
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-deep-navy)' }}>
            Clinical Case Formulation
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
            Synthetic demonstration only. Do not enter names, dates of birth, IDs, or real patient records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleSave}
            className="btn btn-secondary"
            id="save-case-btn"
          >
            <Save size={16} />
            <span>{savedNotification ? 'Updated' : 'Save Progress'}</span>
          </button>
          <button
            onClick={async () => {
              await handleSave();
              onProceedToTimeline();
            }}
            className="btn btn-primary"
            id="proceed-timeline-btn"
          >
            <span>Proceed to Timeline</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {saveMessage && <p role="status" style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', marginTop: 10 }}>{saveMessage}</p>}

      {/* Form sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Section 1: Demographics & Onset Progression */}
        <div className="surface-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <Brain size={20} color="var(--color-deep-violet)" />
            <h3 style={{ fontSize: '1.18rem', color: 'var(--color-deep-navy)' }}>
              1. Case Identity & Progression Kinetics
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px', color: 'var(--color-deep-navy)' }}>
                Anonymous Case Identifier
              </label>
              <input
                type="text"
                value={formData.patient_display_id}
                onChange={(e) => handleInputChange('patient_display_id', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px', color: 'var(--color-deep-navy)' }}>
                Age & Biological Sex
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  placeholder="Age"
                  value={formData.age || ''}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                  style={{
                    width: '90px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border-subtle)',
                    fontSize: '0.9rem'
                  }}
                />
                <select
                  value={formData.sex || 'Unknown'}
                  onChange={(e) => handleInputChange('sex', e.target.value as any)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border-subtle)',
                    fontSize: '0.9rem',
                    background: '#FFFFFF'
                  }}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px', color: 'var(--color-deep-navy)' }}>
                Progression Velocity (Onset Window)
              </label>
              <select
                value={formData.onset_type}
                onChange={(e) => handleInputChange('onset_type', e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border-subtle)',
                  fontSize: '0.9rem',
                  background: '#FFFFFF',
                  fontWeight: 600,
                  color: formData.onset_type === 'subacute_less_3_months' ? 'var(--color-deep-violet)' : 'inherit'
                }}
              >
                <option value="subacute_less_3_months">Subacute (&lt; 3 months progression) — Graus Criteria Met</option>
                <option value="hyperacute_hours_days">Hyperacute (&lt; 48 hours / urgent infectious concern)</option>
                <option value="chronic_more_3_months">Chronic (&gt; 3 months / degenerative course)</option>
                <option value="unknown">Unknown onset timing</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px', color: 'var(--color-deep-navy)' }}>
              Symptom Chronology & Progression Narrative
            </label>
            <textarea
              rows={2}
              value={formData.symptom_progression}
              onChange={(e) => handleInputChange('symptom_progression', e.target.value)}
              placeholder="e.g. Prodromal viral headache followed by sleep disturbance, acute psychosis, and emergence of motor seizures..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid var(--color-border-subtle)',
                fontSize: '0.9rem',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        {/* Section 2: Clinical Symptoms & Neurological Signs */}
        <div className="surface-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <Stethoscope size={20} color="var(--color-deep-violet)" />
            <h3 style={{ fontSize: '1.18rem', color: 'var(--color-deep-navy)' }}>
              2. Core Clinical Manifestations (Graus Diagnostic Domain)
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            
            {/* Cognitive & Memory */}
            <div style={{ padding: '16px', borderRadius: '12px', background: formData.cognitive_memory ? 'var(--color-pale-lavender)' : '#FAF9FF', border: '1px solid var(--color-border-subtle)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, cursor: 'pointer', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  checked={formData.cognitive_memory}
                  onChange={(e) => handleInputChange('cognitive_memory', e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span>Cognitive / Working Memory Deficits</span>
              </label>
              {formData.cognitive_memory && (
                <input
                  type="text"
                  placeholder="Details (e.g. short-term anterograde amnesia)"
                  value={formData.cognitive_details || ''}
                  onChange={(e) => handleInputChange('cognitive_details', e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #D5CAFA', fontSize: '0.84rem' }}
                />
              )}
            </div>

            {/* Psychiatric / Behavioral */}
            <div style={{ padding: '16px', borderRadius: '12px', background: formData.psychiatric_behavioral ? 'var(--color-pale-lavender)' : '#FAF9FF', border: '1px solid var(--color-border-subtle)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, cursor: 'pointer', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  checked={formData.psychiatric_behavioral}
                  onChange={(e) => handleInputChange('psychiatric_behavioral', e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span>Psychiatric / Behavioral Disturbances</span>
              </label>
              {formData.psychiatric_behavioral && (
                <input
                  type="text"
                  placeholder="Details (e.g. hallucinations, catatonia, paranoia)"
                  value={formData.psychiatric_details || ''}
                  onChange={(e) => handleInputChange('psychiatric_details', e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #D5CAFA', fontSize: '0.84rem' }}
                />
              )}
            </div>

            {/* Seizures */}
            <div style={{ padding: '16px', borderRadius: '12px', background: formData.seizures ? 'var(--color-pale-lavender)' : '#FAF9FF', border: '1px solid var(--color-border-subtle)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, cursor: 'pointer', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  checked={formData.seizures}
                  onChange={(e) => handleInputChange('seizures', e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span>New-Onset Seizures / Status Epilepticus</span>
              </label>
              {formData.seizures && (
                <input
                  type="text"
                  placeholder="Details (e.g. focal motor, FBDS, generalized)"
                  value={formData.seizure_details || ''}
                  onChange={(e) => handleInputChange('seizure_details', e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #D5CAFA', fontSize: '0.84rem' }}
                />
              )}
            </div>

            {/* Movement Disorders */}
            <div style={{ padding: '16px', borderRadius: '12px', background: formData.movement_disorder ? 'var(--color-pale-lavender)' : '#FAF9FF', border: '1px solid var(--color-border-subtle)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, cursor: 'pointer', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  checked={formData.movement_disorder}
                  onChange={(e) => handleInputChange('movement_disorder', e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span>Movement Disorder / Involuntary Twitches</span>
              </label>
              {formData.movement_disorder && (
                <input
                  type="text"
                  placeholder="Details (e.g. orofacial dyskinesias, chorea)"
                  value={formData.movement_details || ''}
                  onChange={(e) => handleInputChange('movement_details', e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #D5CAFA', fontSize: '0.84rem' }}
                />
              )}
            </div>

            {/* Altered Consciousness */}
            <div style={{ padding: '16px', borderRadius: '12px', background: formData.altered_consciousness ? 'var(--color-pale-lavender)' : '#FAF9FF', border: '1px solid var(--color-border-subtle)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, cursor: 'pointer', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  checked={formData.altered_consciousness}
                  onChange={(e) => handleInputChange('altered_consciousness', e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span>Altered Consciousness / Lethargy / Coma</span>
              </label>
              {formData.altered_consciousness && (
                <input
                  type="text"
                  placeholder="Details (e.g. fluctuating somnolence, low GCS)"
                  value={formData.consciousness_details || ''}
                  onChange={(e) => handleInputChange('consciousness_details', e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #D5CAFA', fontSize: '0.84rem' }}
                />
              )}
            </div>

            {/* Autonomic Dysfunction */}
            <div style={{ padding: '16px', borderRadius: '12px', background: formData.autonomic_dysfunction ? '#FFFBEB' : '#FAF9FF', border: '1px solid var(--color-border-subtle)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, cursor: 'pointer', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  checked={formData.autonomic_dysfunction}
                  onChange={(e) => handleInputChange('autonomic_dysfunction', e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span>Autonomic Instability / Hypoventilation (Alert)</span>
              </label>
              {formData.autonomic_dysfunction && (
                <input
                  type="text"
                  placeholder="Details (e.g. BP lability, bradycardia/tachycardia)"
                  value={formData.autonomic_details || ''}
                  onChange={(e) => handleInputChange('autonomic_details', e.target.value)}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #FDE68A', fontSize: '0.84rem' }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Paraclinical Investigations (MRI, EEG, CSF, Antibodies) */}
        <div className="surface-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <Microscope size={20} color="var(--color-deep-violet)" />
            <h3 style={{ fontSize: '1.18rem', color: 'var(--color-deep-navy)' }}>
              3. Paraclinical Investigations & Inconclusive Status
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Brain MRI */}
            <div style={{ padding: '18px', borderRadius: '12px', border: '1px solid var(--color-border-subtle)', background: '#FAF9FF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-deep-navy)', fontSize: '0.96rem' }}>
                  Brain MRI (FLAIR / T2 / DWI / Contrast)
                </span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    value={formData.mri_brain.status}
                    onChange={(e) => handleInvestigationChange('mri_brain', 'status', e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontWeight: 600, fontSize: '0.84rem', background: '#FFFFFF' }}
                  >
                    <option value="inconclusive">Inconclusive (Subtle / Non-specific)</option>
                    <option value="positive">Positive (Suggestive of Encephalitis)</option>
                    <option value="negative">Normal / Negative</option>
                    <option value="pending">Pending Scan / Reading</option>
                    <option value="not_performed">Not Performed</option>
                  </select>
                  <input
                    type="date"
                    value={formData.mri_brain.date || ''}
                    onChange={(e) => handleInvestigationChange('mri_brain', 'date', e.target.value)}
                    style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontSize: '0.84rem' }}
                  />
                </div>
              </div>
              <input
                type="text"
                placeholder="Findings details (e.g. Mild bilateral mesiotemporal T2 hyperintensity without diffusion restriction)"
                value={formData.mri_brain.details || ''}
                onChange={(e) => handleInvestigationChange('mri_brain', 'details', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontSize: '0.86rem' }}
              />
            </div>

            {/* EEG */}
            <div style={{ padding: '18px', borderRadius: '12px', border: '1px solid var(--color-border-subtle)', background: '#FAF9FF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-deep-navy)', fontSize: '0.96rem' }}>
                  Electroencephalogram (EEG)
                </span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    value={formData.eeg.status}
                    onChange={(e) => handleInvestigationChange('eeg', 'status', e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontWeight: 600, fontSize: '0.84rem', background: '#FFFFFF' }}
                  >
                    <option value="positive">Positive / Abnormal (Discharges / Delta Brush)</option>
                    <option value="inconclusive">Inconclusive / Mild Non-specific Slowing</option>
                    <option value="negative">Normal Background</option>
                    <option value="pending">Pending Recording</option>
                    <option value="not_performed">Not Performed</option>
                  </select>
                  <input
                    type="date"
                    value={formData.eeg.date || ''}
                    onChange={(e) => handleInvestigationChange('eeg', 'date', e.target.value)}
                    style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontSize: '0.84rem' }}
                  />
                </div>
              </div>
              <input
                type="text"
                placeholder="EEG findings (e.g. Extreme Delta Brush pattern at 2 Hz or diffuse frontotemporal slowing)"
                value={formData.eeg.details || ''}
                onChange={(e) => handleInvestigationChange('eeg', 'details', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontSize: '0.86rem' }}
              />
            </div>

            {/* CSF Analysis */}
            <div style={{ padding: '18px', borderRadius: '12px', border: '1px solid var(--color-border-subtle)', background: '#FAF9FF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-deep-navy)', fontSize: '0.96rem' }}>
                  Cerebrospinal Fluid (CSF) Routine & Cytology
                </span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    value={formData.csf_analysis.status}
                    onChange={(e) => handleInvestigationChange('csf_analysis', 'status', e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontWeight: 600, fontSize: '0.84rem', background: '#FFFFFF' }}
                  >
                    <option value="positive">Abnormal (Pleocytosis &gt;5 WBC or Oligoclonal Bands)</option>
                    <option value="negative">Normal / Acellular (&lt;5 WBC, normal protein)</option>
                    <option value="inconclusive">Inconclusive (Traumatic tap)</option>
                    <option value="pending">Pending Lumbar Puncture / Lab</option>
                    <option value="not_performed">Not Performed</option>
                  </select>
                  <input
                    type="date"
                    value={formData.csf_analysis.date || ''}
                    onChange={(e) => handleInvestigationChange('csf_analysis', 'date', e.target.value)}
                    style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontSize: '0.84rem' }}
                  />
                </div>
              </div>
              <input
                type="text"
                placeholder="CSF values (e.g. Lymphocytic pleocytosis 28 WBC/mm³, protein 58 mg/dL, positive oligoclonal bands)"
                value={formData.csf_analysis.details || ''}
                onChange={(e) => handleInvestigationChange('csf_analysis', 'details', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontSize: '0.86rem' }}
              />
            </div>

            {/* Neuronal Antibodies */}
            <div style={{ padding: '18px', borderRadius: '12px', border: '1px solid var(--color-border-subtle)', background: '#FAF9FF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-deep-navy)', fontSize: '0.96rem' }}>
                  Neuronal Autoantibody Panel (Serum & CSF)
                </span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    value={formData.neuronal_antibodies.status}
                    onChange={(e) => handleInvestigationChange('neuronal_antibodies', 'status', e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontWeight: 600, fontSize: '0.84rem', background: '#FFFFFF' }}
                  >
                    <option value="pending">Pending Reference Lab (Common in subacute setting)</option>
                    <option value="positive">Positive Confirmed (NMDAR, LGI1, etc.)</option>
                    <option value="negative">Negative (Does NOT exclude seronegative AE)</option>
                    <option value="inconclusive">Inconclusive / Low Titre Non-specific</option>
                    <option value="not_performed">Not Performed</option>
                  </select>
                  <input
                    type="date"
                    value={formData.neuronal_antibodies.date || ''}
                    onChange={(e) => handleInvestigationChange('neuronal_antibodies', 'date', e.target.value)}
                    style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontSize: '0.84rem' }}
                  />
                </div>
              </div>
              <input
                type="text"
                placeholder="Antibody assay details (e.g. Paired serum/CSF cell-based assay panel sent; results awaited)"
                value={formData.neuronal_antibodies.details || ''}
                onChange={(e) => handleInvestigationChange('neuronal_antibodies', 'details', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontSize: '0.86rem' }}
              />
            </div>

            {/* Infectious Rule-Out */}
            <div style={{ padding: '18px', borderRadius: '12px', border: '1px solid var(--color-border-subtle)', background: '#FAF9FF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-deep-navy)', fontSize: '0.96rem' }}>
                  Infectious Workup (HSV-1/2, VZV, Bacterial)
                </span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    value={formData.infectious_workup.status}
                    onChange={(e) => handleInvestigationChange('infectious_workup', 'status', e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontWeight: 600, fontSize: '0.84rem', background: '#FFFFFF' }}
                  >
                    <option value="negative">Negative (HSV PCR negative - Mimic excluded)</option>
                    <option value="pending">Pending PCR (Urgent HSV Red-Flag Alert)</option>
                    <option value="positive">Positive (Infectious Encephalitis Confirmed)</option>
                    <option value="not_performed">Not Performed</option>
                  </select>
                  <input
                    type="date"
                    value={formData.infectious_workup.date || ''}
                    onChange={(e) => handleInvestigationChange('infectious_workup', 'date', e.target.value)}
                    style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontSize: '0.84rem' }}
                  />
                </div>
              </div>
              <input
                type="text"
                placeholder="Infectious panel findings (e.g. CSF HSV-1/2 PCR negative, VZV negative, Gram stain negative)"
                value={formData.infectious_workup.details || ''}
                onChange={(e) => handleInvestigationChange('infectious_workup', 'details', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontSize: '0.86rem' }}
              />
            </div>

          </div>
        </div>

        {/* Section 4: Additional Clinical Notes & Teratoma Screening */}
        <div className="surface-card">
          <h3 style={{ fontSize: '1.18rem', color: 'var(--color-deep-navy)', marginBottom: '14px' }}>
            4. Malignancy Screening & Clinician Notes
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                Other Investigations / Teratoma Screen
              </label>
              <textarea
                rows={3}
                value={formData.other_investigations || ''}
                onChange={(e) => handleInputChange('other_investigations', e.target.value)}
                placeholder="e.g. Pelvic ultrasound requested for ovarian teratoma screening in female patient..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--color-border-subtle)', fontSize: '0.88rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                Additional Clinical Context & Attending Notes
              </label>
              <textarea
                rows={3}
                value={formData.clinical_notes || ''}
                onChange={(e) => handleInputChange('clinical_notes', e.target.value)}
                placeholder="e.g. Multidisciplinary consultation requested with Neuro-Immunology and Psychiatry..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--color-border-subtle)', fontSize: '0.88rem' }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
