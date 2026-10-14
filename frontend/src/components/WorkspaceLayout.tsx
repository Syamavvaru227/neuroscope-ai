import React, { useState, useEffect } from 'react';
import type { ClinicalCase, ClinicalReviewResponse, EvidenceCitation, TimelineEvent } from '../types';
import { DashboardScreen } from './DashboardScreen';
import { CaseInputScreen } from './CaseInputScreen';
import { TimelineScreen } from './TimelineScreen';
import { ReviewScreen } from './ReviewScreen';
import { EvidenceExplorerScreen } from './EvidenceExplorerScreen';
import { analyzeCase } from '../api';
import { 
  LayoutDashboard, FileEdit, Clock, FileCheck2, BookOpen, 
  PlusCircle, ArrowLeft
} from 'lucide-react';

interface WorkspaceLayoutProps {
  cases: ClinicalCase[];
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  onSaveCase: (updatedCase: ClinicalCase) => Promise<boolean>;
  onNewCase: () => void;
  evidenceList: EvidenceCitation[];
  onBackToLanding: () => void;
}

export type WorkspaceTab = 'dashboard' | 'input' | 'timeline' | 'review' | 'evidence';

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
  onSaveCase,
  onNewCase,
  evidenceList,
  onBackToLanding
}) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('dashboard');
  const [reviewData, setReviewData] = useState<ClinicalReviewResponse | null>(null);
  const [isReviewLoading, setIsReviewLoading] = useState<boolean>(false);
  const [evidenceInitialQuery, setEvidenceInitialQuery] = useState<string>('');

  const activeCase = cases.find(c => c.patient_display_id === selectedCaseId || c.id === selectedCaseId) || cases[0];

  // Fetch or refresh analysis whenever activeCase or activeTab switches to 'review'
  const runAnalysis = async (caseToAnalyze: ClinicalCase) => {
    setIsReviewLoading(true);
    try {
      const response = await analyzeCase(caseToAnalyze);
      setReviewData(response);
    } catch (err) {
      console.error("Analysis execution error:", err);
    } finally {
      setIsReviewLoading(false);
    }
  };

  useEffect(() => {
    if (!activeCase) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      if (cancelled) return;
      setIsReviewLoading(true);
      try {
        const response = await analyzeCase(activeCase);
        if (!cancelled) setReviewData(response);
      } catch (err) {
        console.error('Analysis execution error:', err);
      } finally {
        if (!cancelled) setIsReviewLoading(false);
      }
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [activeCase]);

  const handleTimelineUpdate = async (newEvents: TimelineEvent[]) => {
    const updated = { ...activeCase, timeline_events: newEvents };
    await onSaveCase(updated);
  };

  const handleCaseSave = async (updated: ClinicalCase) => {
    return onSaveCase(updated);
  };

  const handleViewEvidenceCitation = (citationId: string) => {
    const cit = evidenceList.find(e => e.id === citationId);
    setEvidenceInitialQuery(cit ? cit.title : '');
    setActiveTab('evidence');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 76px)', background: 'var(--color-bg)', padding: '28px 0 60px' }}>
      <div className="container">
        
        {/* Workspace Top Bar: Case Switcher & Quick Navigation */}
        <div className="surface-card" style={{
          padding: '16px 24px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Active Case Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={onBackToLanding}
              className="btn btn-ghost"
              style={{ padding: '6px 12px', fontSize: '0.84rem' }}
              title="Return to Landing Page"
            >
              <ArrowLeft size={16} />
              <span>Back to Overview</span>
            </button>

            <div style={{ width: '1px', height: '24px', background: 'var(--color-border-subtle)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                Active Case:
              </span>
              <select
                value={activeCase.patient_display_id || activeCase.id}
                onChange={(e) => onSelectCase(e.target.value)}
                style={{
                  width: 'min(280px, calc(100vw - 170px))',
                  maxWidth: '100%',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border-subtle)',
                  background: 'var(--color-surface)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer'
                }}
              >
                {cases.map((c) => (
                  <option key={c.patient_display_id || c.id} value={c.patient_display_id || c.id}>
                    {c.patient_display_id}: {c.title.substring(0, 42)}...
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                onNewCase();
                setActiveTab('input');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.8rem',
                color: 'var(--color-deep-violet)',
                fontWeight: 700,
                background: 'var(--color-pale-lavender)',
                padding: '6px 12px',
                borderRadius: '8px'
              }}
            >
              <PlusCircle size={14} />
              <span>New Case</span>
            </button>
          </div>

          {/* Quick Case Status Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
              Onset: <strong>{activeCase.onset_type.replace(/_/g, ' ')}</strong>
            </span>
            <span className="badge badge-primary">
              Synthetic Case
            </span>
          </div>
        </div>

        {/* Tab Navigation Menu (Screens 1 to 5) */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          overflowX: 'auto',
          paddingBottom: '4px',
          borderBottom: '1px solid var(--color-border-subtle)'
        }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderBottom: activeTab === 'dashboard' ? '3px solid var(--color-deep-violet)' : '3px solid transparent',
              color: activeTab === 'dashboard' ? 'var(--color-deep-violet)' : 'var(--color-text-secondary)',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer'
            }}
            id="tab-dashboard"
          >
            <LayoutDashboard size={17} />
            <span>1. Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('input')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderBottom: activeTab === 'input' ? '3px solid var(--color-deep-violet)' : '3px solid transparent',
              color: activeTab === 'input' ? 'var(--color-deep-violet)' : 'var(--color-text-secondary)',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer'
            }}
            id="tab-case-input"
          >
            <FileEdit size={17} />
            <span>2. Case Input</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderBottom: activeTab === 'timeline' ? '3px solid var(--color-deep-violet)' : '3px solid transparent',
              color: activeTab === 'timeline' ? 'var(--color-deep-violet)' : 'var(--color-text-secondary)',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer'
            }}
            id="tab-timeline"
          >
            <Clock size={17} />
            <span>3. Timeline ({activeCase.timeline_events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderBottom: activeTab === 'review' ? '3px solid var(--color-deep-violet)' : '3px solid transparent',
              color: activeTab === 'review' ? 'var(--color-deep-violet)' : 'var(--color-text-secondary)',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer'
            }}
            id="tab-clinical-review"
          >
            <FileCheck2 size={17} />
            <span>4. Clinical Review</span>
            {reviewData && reviewData.red_flags.length > 0 && (
              <span style={{
                background: 'var(--color-danger)',
                color: '#FFFFFF',
                borderRadius: '999px',
                fontSize: '0.7rem',
                padding: '1px 6px',
                fontWeight: 800
              }}>
                {reviewData.red_flags.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderBottom: activeTab === 'evidence' ? '3px solid var(--color-deep-violet)' : '3px solid transparent',
              color: activeTab === 'evidence' ? 'var(--color-deep-violet)' : 'var(--color-text-secondary)',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer'
            }}
            id="tab-evidence-explorer"
          >
            <BookOpen size={17} />
            <span>5. Evidence Explorer</span>
          </button>
        </div>

        {/* Tab View Contents */}
        {activeTab === 'dashboard' && (
          <DashboardScreen
            cases={cases}
            selectedCaseId={selectedCaseId}
            onSelectCase={(id) => onSelectCase(id)}
            onNewCase={() => {
              onNewCase();
              setActiveTab('input');
            }}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'input' && (
          <CaseInputScreen
            currentCase={activeCase}
            onSaveCase={handleCaseSave}
            onProceedToTimeline={() => setActiveTab('timeline')}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineScreen
            currentCase={activeCase}
            onUpdateTimeline={handleTimelineUpdate}
            onProceedToReview={() => setActiveTab('review')}
          />
        )}

        {activeTab === 'review' && (
          <ReviewScreen
            currentCase={activeCase}
            reviewData={reviewData}
            isLoading={isReviewLoading}
            onRefreshReview={() => runAnalysis(activeCase)}
            onViewEvidenceItem={handleViewEvidenceCitation}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceExplorerScreen
            evidenceList={evidenceList}
            initialSearchQuery={evidenceInitialQuery}
          />
        )}

      </div>
    </div>
  );
};
