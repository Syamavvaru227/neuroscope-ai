import React, { useState } from 'react';
import {
  ShieldCheck, Menu, X, ArrowRight, BrainCircuit,
  Sun, Moon
} from 'lucide-react';

interface NavbarProps {
  activeView: 'landing' | 'app';
  setActiveView: (view: 'landing' | 'app') => void;
  backendStatus: { status: string; engine?: string; llm_augmented?: boolean };
  onNavigateSection?: (sectionId: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  backendStatus,
  onNavigateSection,
  theme,
  onToggleTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = theme === 'dark';

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (activeView !== 'landing') {
      setActiveView('landing');
      setTimeout(() => onNavigateSection?.(sectionId), 100);
    } else {
      onNavigateSection?.(sectionId);
    }
  };

  const navStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 200,
    background: 'var(--navbar-bg)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    borderBottom: '1px solid var(--color-border-subtle)',
    transition: 'background 0.3s ease, border-color 0.3s ease'
  };

  return (
    <>
      <header style={navStyle}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>

          {/* ── Brand Logo & Wordmark ── */}
          <div
            onClick={() => setActiveView('landing')}
            style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', userSelect: 'none' }}
            role="button" tabIndex={0} aria-label="NEUROSCOPE AI Home"
          >
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'linear-gradient(135deg, #7954F5 0%, #191A45 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(121,84,245,0.35)',
              border: '1px solid rgba(184,164,255,0.3)'
            }}>
              <BrainCircuit size={24} color="#F1EDFF" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.28rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
                  NEUROSCOPE
                </span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.84rem', fontWeight: 800, color: 'var(--color-deep-violet)', background: 'var(--color-pale-lavender)', padding: '2px 8px', borderRadius: 6 }}>
                  AI
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>
                Clinical Decision Support
              </div>
            </div>
          </div>

          {/* ── Desktop Navigation ── */}
          <nav className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: 22 }}>
            {['hero', 'how-it-works', 'features', 'workflow', 'safety'].map((id, i) => {
              const labels = ['Home', 'How It Works', 'Features', 'Clinical Approach', 'Safety'];
              return (
                <button key={id} onClick={() => handleNavClick(id)} className="btn-ghost" style={{ fontWeight: 600, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {id === 'safety' && <ShieldCheck size={15} color="var(--color-deep-violet)" />}
                  {labels[i]}
                </button>
              );
            })}
          </nav>

          {/* ── Right Controls ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

            {/* Backend status badge */}
            <div
              className="hide-mobile"
              title={backendStatus.status === 'healthy' ? (backendStatus.llm_augmented ? 'API available; optional AI summary enabled' : 'API available; deterministic criteria engine') : 'Local demo fallback; changes may not persist'}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999,
                fontSize: '0.73rem', fontWeight: 600,
                background: backendStatus.status === 'healthy' ? 'var(--color-success-bg)' : 'var(--color-pale-lavender)',
                color:      backendStatus.status === 'healthy' ? 'var(--color-success)'    : 'var(--color-deep-violet)',
                border: `1px solid ${backendStatus.status === 'healthy' ? 'var(--color-success-border)' : 'var(--color-border-subtle)'}`
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: backendStatus.status === 'healthy' ? '#10B981' : '#B8A4FF' }} />
              {backendStatus.status === 'healthy' ? (backendStatus.llm_augmented ? 'API + AI Summary' : 'API Live · Rules') : 'Local Demo'}
            </div>

            {/* Theme toggle */}
            <button
              onClick={onToggleTheme}
              className="btn-icon"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark/light mode"
              id="theme-toggle-btn"
            >
              {isDark
                ? <Sun  size={17} color="var(--color-primary-lavender)" />
                : <Moon size={17} color="var(--color-deep-violet)" />
              }
            </button>

            {/* Primary CTA: Explore or Return */}
            <div className="hide-mobile">
              {activeView === 'landing' ? (
                <button onClick={() => setActiveView('app')} className="btn btn-primary" style={{ fontSize: '0.88rem', padding: '9px 20px' }} id="cta-explore-demo">
                  <span>Explore Demo</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button onClick={() => setActiveView('landing')} className="btn btn-secondary" style={{ fontSize: '0.88rem', padding: '9px 20px' }} id="cta-back-landing">
                  <span>Overview</span>
                </button>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ padding: 8, borderRadius: 8, color: 'var(--color-text-primary)' }}
              className="mobile-toggle"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileMenuOpen && (
          <div style={{ padding: '18px 24px 24px', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['hero', 'how-it-works', 'features', 'workflow', 'safety'].map((id, i) => {
              const labels = ['Home', 'How It Works', 'Features', 'Clinical Approach', 'Safety'];
              return (
                <button key={id} onClick={() => handleNavClick(id)} className="btn-ghost" style={{ textAlign: 'left' }}>{labels[i]}</button>
              );
            })}
            <button onClick={() => { setMobileMenuOpen(false); setActiveView('app'); }} className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
              Open Clinical Workspace
            </button>
          </div>
        )}

        <style>{`
          @media (min-width: 900px) {
            .desktop-nav { display: flex !important; }
            .mobile-toggle { display: none !important; }
          }
          @media (max-width: 768px) {
            .hide-mobile { display: none !important; }
          }
        `}</style>
      </header>

    </>
  );
};
