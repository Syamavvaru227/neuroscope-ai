import React, { useState } from 'react';
import type { EvidenceCitation } from '../types';
import { 
  Search, ExternalLink, ShieldCheck, Filter
} from 'lucide-react';

interface EvidenceExplorerScreenProps {
  evidenceList: EvidenceCitation[];
  initialSearchQuery?: string;
}

export const EvidenceExplorerScreen: React.FC<EvidenceExplorerScreenProps> = ({
  evidenceList,
  initialSearchQuery = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const tags = ['all', 'Diagnostic Criteria', 'Anti-NMDAR', 'LGI1', 'Extreme Delta Brush', 'International Consensus', 'Management'];

  const filteredEvidence = evidenceList.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.relevance_tag.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedTag === 'all') return matchesSearch;
    return matchesSearch && item.relevance_tag.toLowerCase().includes(selectedTag.toLowerCase());
  });

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-primary">Curated Corpus</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
            {evidenceList.length} Peer-Reviewed Articles Indexed
          </span>
        </div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--color-deep-navy)' }}>
          Medical Evidence & Guidelines Explorer
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
          Transparent clinical reference database anchoring all algorithmic criteria, EEG biomarkers, and differential considerations.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="surface-card" style={{ padding: '16px 20px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--color-text-secondary)" style={{ position: 'absolute', left: '14px', top: '11px' }} />
            <input
              type="text"
              placeholder="Search by guideline, author, DOI, or clinical term (e.g. Graus, delta brush, LGI1)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 14px 9px 40px',
                borderRadius: '10px',
                border: '1px solid var(--color-border-subtle)',
                fontSize: '0.9rem'
              }}
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="btn btn-ghost"
              style={{ fontSize: '0.84rem' }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Tag Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={13} /> Topics:
          </span>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              style={{
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 600,
                background: selectedTag === tag ? 'var(--color-deep-violet)' : '#FAF9FF',
                color: selectedTag === tag ? '#FFFFFF' : 'var(--color-deep-navy)',
                border: '1px solid var(--color-border-subtle)',
                cursor: 'pointer'
              }}
            >
              {tag === 'all' ? 'All Literature' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredEvidence.map((item) => (
          <div
            key={item.id}
            className="surface-card"
            style={{
              padding: '24px',
              borderLeft: '4px solid var(--color-deep-violet)',
              background: '#FFFFFF'
            }}
          >
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-primary">
                  {item.relevance_tag}
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#059669',
                  background: '#ECFDF5',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}>
                  <ShieldCheck size={12} />
                  Peer-Reviewed Verified
                </span>
              </div>

              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-deep-violet)' }}>
                {item.year}
              </span>
            </div>

            {/* Title */}
            <h3 style={{ fontSize: '1.24rem', color: 'var(--color-deep-navy)', marginBottom: '8px' }}>
              {item.title}
            </h3>

            {/* Authors & Journal */}
            <div style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
              <span style={{ fontWeight: 600 }}>{item.authors}</span> • <em>{item.journal}</em> • DOI: {item.doi}
              {item.pmid && <span> • PMID: {item.pmid}</span>}
            </div>

            {/* Excerpt with Highlight Box */}
            <div style={{
              padding: '16px 20px',
              borderRadius: '10px',
              background: '#FAF9FF',
              border: '1px solid var(--color-border-subtle)',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--color-deep-violet)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                Reference Summary · Paraphrased
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-deep-navy)', lineHeight: 1.6, fontStyle: 'italic' }}>
                {item.excerpt}
              </p>
            </div>

            {/* External DOI link */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                Anchored to Graus (2016) clinical algorithm logic
              </span>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: 'var(--color-deep-violet)',
                  textDecoration: 'none'
                }}
              >
                <span>View Full Article (DOI)</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}

        {filteredEvidence.length === 0 && (
          <div className="surface-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            No medical literature citations matched your search query. Try searching for "Graus", "NMDAR", "LGI1", or "criteria".
          </div>
        )}
      </div>
    </div>
  );
};
