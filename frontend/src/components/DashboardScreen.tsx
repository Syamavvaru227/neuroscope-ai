import React from 'react';
import type { ClinicalCase } from '../types';
import { 
  PlusCircle, Clock, ShieldCheck, ArrowRight
} from 'lucide-react';

interface DashboardScreenProps {
  cases: ClinicalCase[];
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  onNewCase: () => void;
  onNavigateTab: (tab: 'input' | 'timeline' | 'review' | 'evidence') => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
  onNewCase,
  onNavigateTab
}) => {
  return (
    <div>
      {/* Top Banner with Synthetic Data Notice */}
      <div style={{
        background: 'linear-gradient(135deg, #191A45 0%, #2A2368 100%)',
        color: '#FFFFFF',
        borderRadius: '20px',
        padding: '32px 36px',
        marginBottom: '36px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(25, 26, 69, 0.15)'
      }}>
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(184, 164, 255, 0.3) 0%, transparent 70%)',
          filter: 'blur(30px)'
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(184, 164, 255, 0.2)', border: '1px solid rgba(184, 164, 255, 0.35)', marginBottom: '14px' }}>
              <ShieldCheck size={14} color="#B8A4FF" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em', color: '#F1EDFF', textTransform: 'uppercase' }}>
                Synthetic Clinical Cohort • Demo Environment
              </span>
            </div>
            <h2 style={{ fontSize: '2.1rem', color: '#FFFFFF', marginBottom: '10px' }}>
              Clinical Decision Support Workspace
            </h2>
            <p style={{ color: '#D9CEF7', fontSize: '0.98rem', lineHeight: 1.6 }}>
              Select a pre-configured synthetic case demonstrating autoimmune encephalitis workflows, 
              or initialize a new structured case to evaluate criteria and visualize the chronological timeline.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={onNewCase}
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, #B8A4FF 0%, #7954F5 100%)', color: '#191A45', fontWeight: 700 }}
              id="dash-start-new-case"
            >
              <PlusCircle size={18} />
              <span>Start New Case</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Synthetic Cases */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-deep-navy)' }}>Demonstration Cases</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)' }}>
              Curated synthetic patient cases illustrating distinct clinical trajectories and diagnostic dilemmas.
            </p>
          </div>
          <span className="badge badge-primary">
            {cases.length} Synthetic Cases Loaded
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {cases.map((c) => {
            const isSelected = c.patient_display_id === selectedCaseId || c.id === selectedCaseId;
            const hasPending = c.neuronal_antibodies.status === 'pending' || c.infectious_workup.status === 'pending';
            const hasRedFlag = c.timeline_events.some(e => e.red_flag);

            return (
              <div
                key={c.id || c.patient_display_id}
                onClick={() => onSelectCase(c.patient_display_id || c.id)}
                className="surface-card"
                style={{
                  border: isSelected ? '2px solid var(--color-deep-violet)' : '1px solid var(--color-border-subtle)',
                  background: isSelected ? 'linear-gradient(180deg, #FFFFFF 0%, #F8F5FF 100%)' : '#FFFFFF',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: 'var(--color-pale-lavender)',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      color: 'var(--color-deep-violet)'
                    }}>
                      {c.patient_display_id}
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                      SYNTHETIC
                    </span>
                  </div>

                  {/* Status Badge */}
                  {hasRedFlag ? (
                    <span className="badge badge-danger">Red Flag Alert</span>
                  ) : hasPending ? (
                    <span className="badge badge-warning">Workup Pending</span>
                  ) : (
                    <span className="badge badge-info">Under Review</span>
                  )}
                </div>

                {/* Case Title */}
                <h4 style={{ fontSize: '1.12rem', marginBottom: '8px', color: 'var(--color-deep-navy)' }}>
                  {c.title}
                </h4>

                {/* Patient Demographics & Onset */}
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
                  <span>{c.age} y/o {c.sex}</span>
                  <span>•</span>
                  <span>Onset: {c.onset_type.replace(/_/g, ' ')}</span>
                </div>

                {/* Clinical Progression Summary */}
                <p style={{
                  fontSize: '0.86rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.5,
                  marginBottom: '18px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {c.symptom_progression}
                </p>

                {/* Investigation Mini-Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: c.mri_brain.status === 'positive' || c.mri_brain.abnormal ? '#FFF1F2' : '#F1EDFF',
                    color: c.mri_brain.status === 'positive' || c.mri_brain.abnormal ? '#E11D48' : '#7954F5',
                    fontWeight: 600
                  }}>
                    MRI: {c.mri_brain.status}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: c.csf_analysis.abnormal ? '#FFF1F2' : '#ECFDF5',
                    color: c.csf_analysis.abnormal ? '#E11D48' : '#059669',
                    fontWeight: 600
                  }}>
                    CSF: {c.csf_analysis.abnormal ? 'Inflammatory' : c.csf_analysis.status}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: c.neuronal_antibodies.status === 'pending' ? '#FFFBEB' : '#F1EDFF',
                    color: c.neuronal_antibodies.status === 'pending' ? '#D97706' : '#7954F5',
                    fontWeight: 600
                  }}>
                    Ab: {c.neuronal_antibodies.status}
                  </span>
                </div>

                {/* Action footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '14px',
                  borderTop: '1px solid var(--color-border-subtle)',
                  fontSize: '0.84rem'
                }}>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={14} />
                    {c.timeline_events.length} Timeline Events
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCase(c.patient_display_id || c.id);
                      onNavigateTab('review');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--color-deep-violet)',
                      fontWeight: 700
                    }}
                  >
                    <span>Analyze Case</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
