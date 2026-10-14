import React from 'react';
import { 
  ArrowRight, Clock, ShieldAlert, BookOpen, CheckCircle2, 
  HelpCircle, AlertTriangle, FileText, BrainCircuit,
  Microscope, GitBranch, Layers
} from 'lucide-react';
const NeuralBrainCanvas = React.lazy(() => import('./NeuralBrainCanvas').then(module => ({ default: module.NeuralBrainCanvas })));

interface LandingPageProps {
  onExploreDemo: () => void;
  onSelectCaseDemo?: (caseId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onExploreDemo, onSelectCaseDemo }) => {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background ambient gradient glow circles */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        right: '-100px',
        width: '650px',
        height: '650px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(184, 164, 255, 0.22) 0%, rgba(241, 237, 255, 0.05) 70%, transparent 100%)',
        filter: 'blur(70px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        top: '600px',
        left: '-150px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(121, 84, 245, 0.12) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* =========================================================================
          SECTION 1: HERO
         ========================================================================= */}
      <section id="hero" style={{ position: 'relative', padding: '60px 0 90px' }}>
        <div className="container hero-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(320px, 1fr)',
          gap: '48px',
          alignItems: 'center'
        }}>
          
          {/* Left Column: Clinical Pitch & CTAs */}
          <div style={{ zIndex: 10 }}>
            {/* Eyebrow badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'var(--color-pale-lavender)',
              border: '1px solid var(--color-border-subtle)',
              marginBottom: '24px'
            }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--color-deep-violet)'
              }} />
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: 'var(--color-deep-violet)',
                textTransform: 'uppercase'
              }}>
                AI-Assisted Neurological Clinical Decision Support
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
              lineHeight: 1.12,
              marginBottom: '22px',
              color: 'var(--color-deep-navy)'
            }}>
              See the clues.<br />
              <span style={{
                background: 'linear-gradient(135deg, #7954F5 0%, #B8A4FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Connect the evidence.
              </span>
            </h1>

            {/* Description */}
            <p style={{
              fontSize: '1.14rem',
              lineHeight: 1.65,
              color: 'var(--color-text-secondary)',
              maxWidth: '540px',
              marginBottom: '36px'
            }}>
              Organize evolving neurological findings, see how the timeline develops, and review
              relevant evidence when early investigations leave questions open. Designed to
              support clinician review, not to make a diagnosis.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '40px' }}>
              <button
                onClick={onExploreDemo}
                className="btn btn-primary"
                style={{ padding: '14px 28px', fontSize: '1.02rem' }}
                id="hero-explore-demo-btn"
              >
                <span>Explore the Demo</span>
                <ArrowRight size={18} />
              </button>

              <a
                href="#how-it-works"
                className="btn btn-secondary"
                style={{ padding: '14px 26px', fontSize: '1.02rem' }}
              >
                <span>Discover How It Works</span>
              </a>
            </div>

            {/* Micro stats / clinical trust badges */}
            <div style={{
              display: 'flex',
              gap: '28px',
              paddingTop: '20px',
              borderTop: '1px solid var(--color-border-subtle)'
            }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-deep-navy)' }}>Graus (2016)</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Consensus Diagnostic Criteria</div>
              </div>
              <div style={{ width: '1px', background: 'var(--color-border-subtle)' }} />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-deep-navy)' }}>Evidence-linked</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>References for clinician review</div>
              </div>
              <div style={{ width: '1px', background: 'var(--color-border-subtle)' }} />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-deep-navy)' }}>Human-in-Loop</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Decision-Support Prototype</div>
              </div>
            </div>
          </div>

          {/* Right Column: Signature 3D Brain & Floating Glass Clinical Data Panels */}
          <div className="hero-brain-stage" style={{ position: 'relative', height: '560px', width: '100%' }}>
            
            {/* 3D Brain Viewport Canvas */}
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '24px',
              background: 'radial-gradient(circle at center, rgba(241, 237, 255, 0.6) 0%, rgba(250, 249, 255, 0.1) 70%)',
              border: '1px solid rgba(232, 226, 250, 0.8)',
              boxShadow: 'inset 0 0 40px rgba(184, 164, 255, 0.1)',
              overflow: 'hidden'
            }}>
              <React.Suspense fallback={<div aria-label="Loading 3D brain illustration" style={{ width: '100%', height: '100%' }} />}>
                <NeuralBrainCanvas />
              </React.Suspense>
            </div>

            {/* Floating Glass Panel 1: Patient Timeline (Top Left) */}
            <div className="glass-panel hero-data-card hero-data-card--timeline" style={{
              position: 'absolute',
              top: '24px',
              left: '-20px',
              padding: '14px 18px',
              maxWidth: '220px',
              zIndex: 20,
              fontSize: '0.82rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Clock size={15} color="var(--color-deep-violet)" />
                <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--color-deep-navy)' }}>Patient Timeline</span>
              </div>
              <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                Synthetic case · Day 18: EEG finding added to the timeline.
              </div>
            </div>

            {/* Floating Glass Panel 2: Clinical Findings (Bottom Left) */}
            <div className="glass-panel hero-data-card hero-data-card--findings" style={{
              position: 'absolute',
              bottom: '36px',
              left: '-10px',
              padding: '14px 18px',
              maxWidth: '230px',
              zIndex: 20,
              fontSize: '0.82rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <CheckCircle2 size={15} color="#059669" />
                <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--color-deep-navy)' }}>Clinical Findings</span>
              </div>
              <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                Synthetic findings · CSF and MRI entries ready for review.
              </div>
            </div>

            {/* Floating Glass Panel 3: Evidence References (Top Right) */}
            <div className="glass-panel hero-data-card hero-data-card--evidence" style={{
              position: 'absolute',
              top: '40px',
              right: '-16px',
              padding: '14px 18px',
              maxWidth: '225px',
              zIndex: 20,
              fontSize: '0.82rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <BookOpen size={15} color="var(--color-deep-violet)" />
                <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--color-deep-navy)' }}>Evidence Reference</span>
              </div>
              <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                Consensus criteria · View the source and relevant excerpt.
              </div>
            </div>

            {/* Floating Glass Panel 4: Unresolved Questions (Bottom Right) */}
            <div className="glass-panel hero-data-card hero-data-card--questions" style={{
              position: 'absolute',
              bottom: '28px',
              right: '-20px',
              padding: '14px 18px',
              maxWidth: '235px',
              zIndex: 20,
              fontSize: '0.82rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <HelpCircle size={15} color="#D97706" />
                <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--color-deep-navy)' }}>Unresolved Inquiries</span>
              </div>
              <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                Open questions · Antibody results and further evaluation pending.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: HOW IT WORKS (Four-Stage Visual Sequence)
         ========================================================================= */}
      <section id="how-it-works" style={{
        padding: '90px 0',
        background: 'linear-gradient(180deg, rgba(241, 237, 255, 0.4) 0%, rgba(250, 249, 255, 0.8) 100%)',
        borderTop: '1px solid var(--color-border-subtle)',
        borderBottom: '1px solid var(--color-border-subtle)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '14px' }}>
              Systematic Methodology
            </span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '16px' }}>
              How NEUROSCOPE AI Works
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem' }}>
              Organize an evolving case through four review steps, with dates, documented findings,
              and relevant sources kept visible for the clinical team.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            position: 'relative'
          }}>
            {/* Step 1 */}
            <div className="surface-card" style={{ position: 'relative' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--color-primary-lavender)',
                marginBottom: '12px'
              }}>
                01
              </div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--color-pale-lavender)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <FileText size={22} color="var(--color-deep-violet)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Build the Clinical Case</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Structure symptoms, examination findings, and investigations. Distinguish missing tests from negative results with verified status tagging.
              </p>
            </div>

            {/* Step 2 */}
            <div className="surface-card" style={{ position: 'relative' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--color-primary-lavender)',
                marginBottom: '12px'
              }}>
                02
              </div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--color-pale-lavender)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Clock size={22} color="var(--color-deep-violet)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Visualize the Timeline</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Chronologically align symptom onset, test dates, and clinical interventions. Spot rapid clinical deteriorations and temporal red flags.
              </p>
            </div>

            {/* Step 3 */}
            <div className="surface-card" style={{ position: 'relative' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--color-primary-lavender)',
                marginBottom: '12px'
              }}>
                03
              </div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--color-pale-lavender)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <BookOpen size={22} color="var(--color-deep-violet)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Review Medical Evidence</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Compare documented findings with published criteria and explore the linked references for context.
              </p>
            </div>

            {/* Step 4 */}
            <div className="surface-card" style={{ position: 'relative' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--color-primary-lavender)',
                marginBottom: '12px'
              }}>
                04
              </div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--color-pale-lavender)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <GitBranch size={22} color="var(--color-deep-violet)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Explore Considerations</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Evaluate differential matrices (autoimmune vs HSV vs psychiatric), identify missing investigations, and generate structured uncertainty briefs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: FEATURES (6 Distinct Capabilities)
         ========================================================================= */}
      <section id="features" style={{ padding: '90px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '14px' }}>
              Core Capabilities
            </span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '16px' }}>
              Built for Clinical Rigor
            </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem' }}>
              Explore a structured view of the case, its open questions, and the sources available for review.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '28px'
          }}>
            {/* Feature 1 */}
            <div className="surface-card" style={{ borderLeft: '4px solid var(--color-deep-violet)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--color-pale-lavender)' }}>
                  <Clock size={20} color="var(--color-deep-violet)" />
                </div>
                <h3 style={{ fontSize: '1.18rem' }}>Diagnostic Timeline Intelligence</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Chronologically tracks prodrome, psychiatric onset, seizure emergence, and test milestones. Identifies whether progression meets subacute (&lt;3 months) criteria.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="surface-card" style={{ borderLeft: '4px solid var(--color-danger)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--color-danger-bg)' }}>
                  <AlertTriangle size={20} color="var(--color-danger)" />
                </div>
                <h3 style={{ fontSize: '1.18rem' }}>Neurological Red-Flag Review</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Highlights selected documented findings and missing information for clinician attention. It is not a real-time monitoring or emergency response system.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="surface-card" style={{ borderLeft: '4px solid #059669' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--color-success-bg)' }}>
                  <BookOpen size={20} color="#059669" />
                </div>
                <h3 style={{ fontSize: '1.18rem' }}>Evidence-Grounded Analysis</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Explore curated medical references linked to selected findings and consensus criteria. Review each source in its full clinical context.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="surface-card" style={{ borderLeft: '4px solid #D97706' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--color-warning-bg)' }}>
                  <HelpCircle size={20} color="#D97706" />
                </div>
                <h3 style={{ fontSize: '1.18rem' }}>Missing Information Detection</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Proactively highlights unperformed or pending investigations—such as pelvic teratoma screening in young women or paired CSF antibody assays.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="surface-card" style={{ borderLeft: '4px solid #4F46E5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--color-info-bg)' }}>
                  <Layers size={20} color="#4F46E5" />
                </div>
                <h3 style={{ fontSize: '1.18rem' }}>Clinical Uncertainty Tracking</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Never presents false confidence. Explains when antibody tests may be false-negative, when MRI may be normal, and labels insufficient data explicitly.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="surface-card" style={{ borderLeft: '4px solid var(--color-deep-navy)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--color-pale-lavender)' }}>
                  <Microscope size={20} color="var(--color-deep-navy)" />
                </div>
                <h3 style={{ fontSize: '1.18rem' }}>Transparent Evidence Explorer</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                In-app access to a curated literature set with available identifiers, publication details, and excerpts for source review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: CLINICAL WORKFLOW SHOWCASE (Fictional Case Journey)
         ========================================================================= */}
      <section id="workflow" style={{
        padding: '90px 0',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF9FF 100%)',
        borderTop: '1px solid var(--color-border-subtle)',
        borderBottom: '1px solid var(--color-border-subtle)'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '12px' }}>
                Case Progression Walkthrough
              </span>
              <h2 style={{ fontSize: '2.4rem' }}>
                Synthetic Case Journey: SYNTH-NEURO-702
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '620px', marginTop: '8px' }}>
                Follow a fictional, synthetic case as new findings are added over time. The example demonstrates organization and evidence review; it does not prescribe care.
              </p>
            </div>
            <button
              onClick={() => {
                onSelectCaseDemo?.('SYNTH-NEURO-702');
                onExploreDemo();
              }}
              className="btn btn-primary"
            >
              <span>Load This Case in Workspace</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Interactive Flow Sequence */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px'
          }}>
            {/* Step A */}
            <div className="surface-card" style={{ background: '#FAF9FF' }}>
              <div className="badge badge-info" style={{ marginBottom: '12px' }}>Day 1 - 7</div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Patient Symptoms</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Behavioral and sleep changes are recorded as the initial presentation.
              </p>
            </div>

            {/* Step B */}
            <div className="surface-card" style={{ background: '#FAF9FF' }}>
              <div className="badge badge-warning" style={{ marginBottom: '12px' }}>Day 10 - 12</div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Initial Investigations</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                A seizure is added to the timeline; MRI findings remain inconclusive.
              </p>
            </div>

            {/* Step C */}
            <div className="surface-card" style={{ background: '#FAF9FF' }}>
              <div className="badge badge-danger" style={{ marginBottom: '12px' }}>Day 13 - 14</div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Unresolved Findings</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                CSF and EEG findings are added; infectious testing is documented separately.
              </p>
            </div>

            {/* Step D */}
            <div className="surface-card" style={{ background: '#FAF9FF' }}>
              <div className="badge badge-primary" style={{ marginBottom: '12px' }}>Automated Review</div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Evidence Matching</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Review the documented findings against published criteria and note what remains unresolved.
              </p>
            </div>

            {/* Step E */}
            <div className="surface-card" style={{ background: '#FAF9FF' }}>
              <div className="badge badge-success" style={{ marginBottom: '12px' }}>Clinician Review</div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Questions to Discuss</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Consider what additional information, specialist input, and safety checks are appropriate for the individual case.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: TRUST AND SAFETY (Clinical Disclaimer)
         ========================================================================= */}
      <section id="safety" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="glass-panel" style={{
            padding: '48px 36px',
            border: '2px solid rgba(121, 84, 245, 0.25)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 237, 255, 0.5) 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{
                padding: '10px',
                borderRadius: '12px',
                background: 'var(--color-pale-lavender)',
                color: 'var(--color-deep-violet)'
              }}>
                <ShieldAlert size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--color-deep-navy)' }}>
                  Clinical Trust, Validation & Research Disclaimer
                </h3>
                <div style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)' }}>
                  Commitment to medical safety and transparent algorithmic boundaries
                </div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginTop: '28px',
              paddingTop: '24px',
              borderTop: '1px solid var(--color-border-subtle)'
            }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-deep-navy)', marginBottom: '8px' }}>
                  Decision Support, Not Independent Diagnosis
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  NEUROSCOPE AI assists clinicians in organizing complex data and reviewing evidence-based criteria. It does not independently diagnose disease or confirm clinical outcomes.
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-deep-navy)', marginBottom: '8px' }}>
                  No Automated Prescriptions
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  The prototype does not prescribe treatment. Qualified healthcare professionals remain responsible for clinical decisions and any diagnostic or management plan.
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-deep-navy)', marginBottom: '8px' }}>
                  Investigational Demonstration Prototype
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  This application is an investigational research prototype and has not received FDA 510(k), CE mark, or formal medical device clearance. Synthetic demonstration data is used.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
         ========================================================================= */}
      <footer style={{
        background: 'var(--color-deep-navy)',
        color: '#F1EDFF',
        padding: '70px 0 35px',
        borderTop: '1px solid rgba(184, 164, 255, 0.2)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '48px'
          }}>
            {/* Col 1: Identity */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <BrainCircuit size={26} color="var(--color-primary-lavender)" />
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  NEUROSCOPE AI
                </span>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#B8A4FF', lineHeight: 1.6, maxWidth: '300px' }}>
                Evidence-grounded neurological clinical decision support for inconclusive and evolving conditions.
              </p>
              <div style={{ marginTop: '16px', fontSize: '0.78rem', color: '#8F8CAE' }}>
                Prototype v1.0.0 • Clinical Research Edition
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <h5 style={{ color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '16px' }}>Platform Navigation</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#B8A4FF' }}>
                <a href="#hero" style={{ transition: 'color 0.2s' }}>Home Overview</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#features">Core Features</a>
                <a href="#workflow">Clinical Workflow</a>
                <a href="#safety">Trust & Safety Guidelines</a>
              </div>
            </div>

            {/* Col 3: Clinical Methodology */}
            <div>
              <h5 style={{ color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '16px' }}>Methodology & Standards</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#B8A4FF' }}>
                <span>Graus et al. (2016) Criteria</span>
                <span>International Encephalitis Consortium</span>
                <span>Anti-NMDA Receptor Staging Models</span>
                <span>Seronegative AE Rule-Out Frameworks</span>
              </div>
            </div>

            {/* Col 4: Workspace CTA */}
            <div>
              <h5 style={{ color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '16px' }}>Interactive Demonstrator</h5>
              <p style={{ fontSize: '0.85rem', color: '#B8A4FF', lineHeight: 1.5, marginBottom: '16px' }}>
                Test interactive cases with our structured timeline, clinical criteria engine, and evidence explorer.
              </p>
              <button
                onClick={onExploreDemo}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <span>Launch Clinical Workspace</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div style={{
            paddingTop: '28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.8rem',
            color: '#8F8CAE'
          }}>
            <div>
              © 2026 NEUROSCOPE AI. Demonstration Prototype. Not for unverified clinical usage.
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span>Synthetic Patient Data Only</span>
              <span>•</span>
              <span>Non-Diagnostic Research Aid</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Responsive layout helper style */}
      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-brain-stage { height: min(440px, 98vw) !important; }
          .hero-data-card--findings, .hero-data-card--evidence { display: none; }
          .hero-data-card--timeline { left: 8px !important; top: 12px !important; }
          .hero-data-card--questions { right: 8px !important; bottom: 12px !important; }
        }
        @media (max-width: 560px) {
          .hero-brain-stage { height: 310px !important; }
          .hero-data-card { max-width: 190px !important; padding: 10px 12px !important; font-size: .74rem !important; }
        }
      `}</style>
    </div>
  );
};
