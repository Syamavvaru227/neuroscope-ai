import { lazy, Suspense, useState, useEffect } from 'react';
import type { ClinicalCase, EvidenceCitation } from './types';
import { fetchCases, fetchEvidence, fetchHealth, saveCase, FALLBACK_CASES, FALLBACK_EVIDENCE } from './api';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { WorkspaceLayout } from './components/WorkspaceLayout';

const NeuralBrainWatermark = lazy(() => import('./components/NeuralBrainCanvas').then(module => ({ default: module.NeuralBrainWatermark })));

export function App() {
  const [activeView, setActiveView] = useState<'landing' | 'app'>('landing');
  const [cases, setCases] = useState<ClinicalCase[]>(FALLBACK_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('SYNTH-NEURO-702');
  const [evidenceList, setEvidenceList] = useState<EvidenceCitation[]>(FALLBACK_EVIDENCE);
  const [backendStatus, setBackendStatus] = useState<{ status: string; engine?: string; llm_augmented?: boolean }>({
    status: 'checking',
    engine: 'Consensus Engine'
  });

  // ── Theme state ──
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('neuroscope-theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return 'light';
  });

  // Apply data-theme attribute to <html> whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('neuroscope-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // Load initial backend health, cases, and evidence
  useEffect(() => {
    async function loadInitialData() {
      const health = await fetchHealth();
      setBackendStatus(health);

      const loadedCases = await fetchCases();
      if (loadedCases && loadedCases.length > 0) setCases(loadedCases);

      const loadedEvidence = await fetchEvidence();
      if (loadedEvidence && loadedEvidence.length > 0) setEvidenceList(loadedEvidence);
    }
    loadInitialData();
  }, []);

  const handleSaveCase = async (updatedCase: ClinicalCase): Promise<boolean> => {
    setCases(prev => {
      const exists = prev.some(c => (c.patient_display_id === updatedCase.patient_display_id || c.id === updatedCase.id));
      if (exists) {
        return prev.map(c => (c.patient_display_id === updatedCase.patient_display_id || c.id === updatedCase.id) ? updatedCase : c);
      }
      return [...prev, updatedCase];
    });
    return saveCase(updatedCase);
  };

  const handleNewCase = () => {
    const newId = `SYNTH-NEURO-${Math.floor(100 + Math.random() * 900)}`;
    const newCase: ClinicalCase = {
      id: `CASE-USER-${Date.now()}`,
      is_synthetic: true,
      title: 'New Synthetic Patient Investigation',
      patient_display_id: newId,
      age: 32,
      sex: 'Female',
      onset_type: 'subacute_less_3_months',
      symptom_progression: 'Recent progressive cognitive changes over 4 weeks...',
      altered_consciousness: false,
      seizures: false,
      psychiatric_behavioral: true,
      psychiatric_details: 'Mild anxiety and sleep fragmentation',
      cognitive_memory: true,
      cognitive_details: 'Working memory lapses',
      movement_disorder: false,
      autonomic_dysfunction: false,
      focal_cns_findings: false,
      mri_brain: { status: 'pending', details: 'Contrast MRI scheduled', date: new Date().toISOString().substring(0, 10), abnormal: false },
      eeg: { status: 'pending', details: 'Standard EEG scheduled', date: new Date().toISOString().substring(0, 10), abnormal: false },
      csf_analysis: { status: 'pending', details: 'Diagnostic lumbar puncture planned', date: new Date().toISOString().substring(0, 10), abnormal: false },
      neuronal_antibodies: { status: 'pending', details: 'Autoantibody panel planned', date: null, abnormal: false },
      infectious_workup: { status: 'pending', details: 'HSV PCR ordered', date: null, abnormal: false },
      clinical_notes: 'Newly created synthetic case for evaluation.',
      timeline_events: [{
        id: `EVT-INIT-${Date.now()}`,
        date: new Date().toISOString().substring(0, 10),
        category: 'symptom',
        title: 'Initial Consultation',
        description: 'Patient presented with subacute cognitive difficulties.',
        status: 'normal'
      }]
    };

    setCases(prev => [newCase, ...prev]);
    void saveCase(newCase);
    setSelectedCaseId(newId);
    setActiveView('app');
  };

  const handleNavigateSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ─── Fixed full-viewport 3D watermark brain ─── */}
      {activeView === 'landing' && (
        <div className="watermark-bg" aria-hidden="true">
          <Suspense fallback={null}>
            <NeuralBrainWatermark dark={theme === 'dark'} />
          </Suspense>
        </div>
      )}

      {/* ─── App shell ─── */}
      <div className="app-root">
        <Navbar
          activeView={activeView}
          setActiveView={setActiveView}
          backendStatus={backendStatus}
          onNavigateSection={handleNavigateSection}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        <main style={{ flex: 1 }}>
          {activeView === 'landing' ? (
            <LandingPage
              onExploreDemo={() => setActiveView('app')}
              onSelectCaseDemo={(caseId) => {
                setSelectedCaseId(caseId);
                setActiveView('app');
              }}
            />
          ) : (
            <WorkspaceLayout
              cases={cases}
              selectedCaseId={selectedCaseId}
              onSelectCase={setSelectedCaseId}
              onSaveCase={handleSaveCase}
              onNewCase={handleNewCase}
              evidenceList={evidenceList}
              onBackToLanding={() => setActiveView('landing')}
            />
          )}
        </main>
      </div>
    </>
  );
}

export default App;
