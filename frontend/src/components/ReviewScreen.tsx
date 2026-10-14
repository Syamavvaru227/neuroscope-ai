import React, { useState } from 'react';
import type { ClinicalCase, ClinicalReviewResponse } from '../types';
import { 
  BookOpen, AlertTriangle, CheckCircle2, XCircle, 
  HelpCircle, RefreshCw, Sparkles, Brain, 
  ArrowRight, FileText, Check, AlertCircle
} from 'lucide-react';

interface ReviewScreenProps {
  currentCase: ClinicalCase;
  reviewData: ClinicalReviewResponse | null;
  isLoading: boolean;
  onRefreshReview: () => void;
  onViewEvidenceItem: (citationId: string) => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  currentCase,
  reviewData,
  isLoading,
  onRefreshReview,
  onViewEvidenceItem
}) => {
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div style={{ maxWidth: '960px', margin: '40px auto', textAlign: 'center' }}>
        <div className="surface-card" style={{ padding: '60px 40px' }}>
          <div style={{ display: 'inline-block', marginBottom: '20px' }}>
            <RefreshCw size={36} color="var(--color-deep-violet)" className="animate-spin" />
          </div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--color-deep-navy)', marginBottom: '8px' }}>
            Evaluating Case Criteria & Grounding Evidence...
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto', fontSize: '0.92rem' }}>
            Cross-referencing documented findings with Graus et al. (2016) consensus criteria, 
            detecting red flags, and structuring the differential matrix.
          </p>
        </div>
      </div>
    );
  }

  if (!reviewData) {
    return (
      <div style={{ maxWidth: '960px', margin: '40px auto', textAlign: 'center' }}>
        <div className="surface-card" style={{ padding: '60px 40px' }}>
          <AlertCircle size={36} color="var(--color-warning)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.3rem', color: 'var(--color-deep-navy)', marginBottom: '8px' }}>
            Review Not Yet Generated
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
            Click the button below to execute algorithmic case analysis.
          </p>
          <button onClick={onRefreshReview} className="btn btn-primary">
            Run Clinical Review Now
          </button>
        </div>
      </div>
    );
  }

  const handleCopySummary = () => {
    const text = `NEUROSCOPE AI CLINICAL DECISION SUPPORT REPORT\nCase: ${currentCase.patient_display_id}\nGenerated: ${reviewData.generated_at}\n\nEXECUTIVE SYNTHESIS:\n${reviewData.synthesis_summary}\n\nGRAUS ET AL. (2016) STATUS:\n- Possible AE: ${reviewData.possible_ae_status}\n- Probable AE: ${reviewData.probable_ae_status}\n- Definite Anti-NMDAR: ${reviewData.definite_nmdar_status}\n\nRED FLAGS IDENTIFIED:\n${reviewData.red_flags.map(rf => `- [${rf.severity}] ${rf.title}: ${rf.rationale}`).join('\n')}\n\n${reviewData.safety_disclaimer}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'MET' || status === 'SUPPORTED') {
      return <span className="badge badge-success"><CheckCircle2 size={13} /> SUPPORTED</span>;
    }
    if (status === 'NOT_MET' || status === 'NOT_SUPPORTED') {
      return <span className="badge badge-danger"><XCircle size={13} /> NOT MET</span>;
    }
    return <span className="badge badge-warning"><HelpCircle size={13} /> INSUFFICIENT INFO</span>;
  };

  const engineLabel = reviewData.engine_source.includes('groq_augmented_engine')
    ? 'Optional AI assisted summary · criteria remain rule based'
    : reviewData.engine_source.includes('local_demo')
      ? 'Local demo rules · API unavailable'
      : reviewData.engine_source.includes('AI summary unavailable')
        ? 'Deterministic criteria · AI summary unavailable'
        : 'Deterministic consensus criteria · no AI summary';

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      
      {/* Top Header & Action Controls */}
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
            <span className="badge badge-primary">Evidence-Grounded Review</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              {engineLabel}
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-deep-navy)' }}>
            Clinical Synthesis & Criteria Evaluation
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
            Generated {reviewData.generated_at} • Evaluated under international consensus guidelines
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleCopySummary}
            className="btn btn-secondary"
            id="copy-summary-btn"
          >
            {copied ? <Check size={16} color="#059669" /> : <FileText size={16} />}
            <span>{copied ? 'Copied Report!' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={onRefreshReview}
            className="btn btn-primary"
            id="refresh-review-btn"
          >
            <RefreshCw size={16} />
            <span>Re-evaluate</span>
          </button>
        </div>
      </div>

      {/* Red-Flag Urgent Alerts (If Any) */}
      {reviewData.red_flags.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            background: 'var(--color-danger-bg)',
            border: '2px solid var(--color-danger-border)',
            borderRadius: '16px',
            padding: '24px 28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <AlertTriangle size={24} color="var(--color-danger)" />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-danger)' }}>
                Urgent Clinical Red Flags ({reviewData.red_flags.length})
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {reviewData.red_flags.map((flag, idx) => (
                <div key={idx} style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--color-danger-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--color-deep-navy)' }}>
                      {flag.title}
                    </span>
                    <span className="badge badge-danger">
                      {flag.severity.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '8px', lineHeight: 1.5 }}>
                    {flag.rationale}
                  </p>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ArrowRight size={14} /> Clinician Review Prompt: {flag.recommended_action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Graus et al. (2016) Diagnostic Tiers Scorecard */}
      <div className="surface-card" style={{ marginBottom: '28px', borderLeft: '5px solid var(--color-deep-violet)' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--color-deep-navy)', marginBottom: '14px' }}>
          Graus et al. (2016) Clinical Consensus Status
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '24px' }}>
          <div style={{ padding: '16px', borderRadius: '12px', background: '#FAF9FF', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Possible AE Criteria Mapping
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              {getStatusBadge(reviewData.possible_ae_status)}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
              Subacute onset + objective paraclinical signs + mimic exclusion
            </div>
          </div>

          <div style={{ padding: '16px', borderRadius: '12px', background: '#FAF9FF', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Probable AE Criteria Mapping
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              {getStatusBadge(reviewData.probable_ae_status)}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
              Confirmed inflammatory CSF / EEG discharges / dyskinesias
            </div>
          </div>

          <div style={{ padding: '16px', borderRadius: '12px', background: '#FAF9FF', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              CSF Anti-GluN1 IgG Assay Criterion
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              {getStatusBadge(reviewData.definite_nmdar_status)}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
              Requires positive CSF IgG antibody cell-based assay
            </div>
          </div>
        </div>

        {/* Individual Criteria Breakdown */}
        <h4 style={{ fontSize: '1.05rem', color: 'var(--color-deep-navy)', marginBottom: '12px' }}>
          Individual Criteria Analysis
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reviewData.graus_criteria.map((crit, idx) => (
            <div key={idx} style={{ padding: '14px 18px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-deep-navy)' }}>
                  {crit.criterion_name}
                </span>
                {getStatusBadge(crit.status)}
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                {crit.description}
              </p>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-deep-violet)', fontWeight: 600 }}>
                Evidence Found: {crit.evidence_found}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Executive Clinical Formulation */}
      <div className="surface-card" style={{ marginBottom: '28px', background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF9FF 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <Sparkles size={20} color="var(--color-deep-violet)" />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-deep-navy)' }}>
            Case Summary for Clinician Review
          </h3>
        </div>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.65, color: 'var(--color-deep-navy)', whiteSpace: 'pre-line' }}>
          {reviewData.synthesis_summary}
        </p>
      </div>

      {/* Differential Considerations Matrix */}
      <div className="surface-card" style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--color-deep-navy)', marginBottom: '16px' }}>
          Comparative Differential Diagnosis Matrix
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviewData.differential_matrix.map((diff, idx) => (
            <div key={idx} style={{ padding: '16px 20px', borderRadius: '12px', background: '#FAF9FF', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 800, fontSize: '1.02rem', color: 'var(--color-deep-navy)' }}>
                  {diff.condition}
                </span>
                <span className={`badge ${
                  diff.likelihood_category === 'HIGH_CONSIDERATION' ? 'badge-primary' : 
                  diff.likelihood_category === 'MODERATE_CONSIDERATION' ? 'badge-warning' : 'badge-info'
                }`}>
                  {diff.likelihood_category.replace(/_/g, ' ')}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', fontSize: '0.86rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#059669', marginBottom: '4px' }}>Supporting Points:</div>
                  <ul style={{ paddingLeft: '18px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                    {diff.supporting_points.map((sp, i) => <li key={i}>{sp}</li>)}
                  </ul>
                </div>

                <div>
                  <div style={{ fontWeight: 700, color: '#E11D48', marginBottom: '4px' }}>Contradicting / Differentiating:</div>
                  <ul style={{ paddingLeft: '18px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                    {diff.contradictory_or_differentiating_points.map((cp, i) => <li key={i}>{cp}</li>)}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--color-border-subtle)', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-deep-violet)' }}>Next Evaluation Steps: </span>
                <span style={{ color: 'var(--color-text-secondary)' }}>{diff.next_evaluations.join(' • ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Missing Information & Unresolved Questions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        
        {/* Missing or Pending Investigations */}
        <div className="surface-card" style={{ borderLeft: '4px solid var(--color-warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <HelpCircle size={18} color="var(--color-warning)" />
            <h4 style={{ fontSize: '1.08rem', color: 'var(--color-deep-navy)' }}>
              Missing or Pending Investigations
            </h4>
          </div>
          {reviewData.missing_investigations.length > 0 ? (
            <ul style={{ paddingLeft: '20px', fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              {reviewData.missing_investigations.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '0.88rem', color: '#059669' }}>
              All standard initial baseline investigations are recorded.
            </p>
          )}
        </div>

        {/* Unresolved Clinical Questions */}
        <div className="surface-card" style={{ borderLeft: '4px solid var(--color-deep-violet)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Brain size={18} color="var(--color-deep-violet)" />
            <h4 style={{ fontSize: '1.08rem', color: 'var(--color-deep-navy)' }}>
              Unresolved Clinical Inquiries
            </h4>
          </div>
          <ul style={{ paddingLeft: '20px', fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            {reviewData.unresolved_questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Relevant Evidence Citations for this case */}
      <div className="surface-card" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} color="var(--color-deep-violet)" />
            <h3 style={{ fontSize: '1.18rem', color: 'var(--color-deep-navy)' }}>
              Anchored Medical Literature ({reviewData.citations.length})
            </h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            Peer-reviewed references · summaries are paraphrased
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reviewData.citations.slice(0, 3).map((cit) => (
            <div
              key={cit.id}
              onClick={() => onViewEvidenceItem(cit.id)}
              style={{
                padding: '14px 18px',
                borderRadius: '10px',
                background: '#FAF9FF',
                border: '1px solid var(--color-border-subtle)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="hover-lift"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-deep-navy)' }}>
                  {cit.title}
                </span>
                <span className="badge badge-primary">{cit.year}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '4px 0' }}>
                {cit.authors} • <em>{cit.journal}</em> • DOI: {cit.doi}
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-deep-navy)', fontStyle: 'italic', marginTop: '6px' }}>
                {cit.excerpt.substring(0, 160)}{cit.excerpt.length > 160 ? '…' : ''}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Uncertainty & Safety Statements */}
      <div style={{
        padding: '24px',
        borderRadius: '14px',
        background: '#FAF9FF',
        border: '1px solid var(--color-border-subtle)',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '10px' }}>
          <strong>Clinical Uncertainty Statement: </strong>
          {reviewData.uncertainty_statement}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#8F8CAE', lineHeight: 1.5 }}>
          <strong>Prototype Disclaimer: </strong>
          {reviewData.safety_disclaimer}
        </div>
      </div>
    </div>
  );
};
