import React, { useState } from 'react';
import type { ClinicalCase, TimelineEvent } from '../types';
import { 
  Plus, Edit2, Trash2, AlertTriangle, 
  ArrowRight, Filter, Calendar
} from 'lucide-react';

interface TimelineScreenProps {
  currentCase: ClinicalCase;
  onUpdateTimeline: (events: TimelineEvent[]) => void;
  onProceedToReview: () => void;
}

export const TimelineScreen: React.FC<TimelineScreenProps> = ({
  currentCase,
  onUpdateTimeline,
  onProceedToReview
}) => {
  const [events, setEvents] = useState<TimelineEvent[]>([...currentCase.timeline_events].sort((a, b) => (a.date || '').localeCompare(b.date || '')));
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);

  // Form state for Modal
  const [modalDate, setModalDate] = useState('');
  const [modalCategory, setModalCategory] = useState<'symptom' | 'investigation' | 'intervention' | 'milestone'>('symptom');
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalStatus, setModalStatus] = useState<'normal' | 'abnormal' | 'inconclusive' | 'pending' | 'critical'>('normal');
  const [modalRedFlag, setModalRedFlag] = useState(false);

  const openAddModal = () => {
    setEditingEvent(null);
    setModalDate(new Date().toISOString().substring(0, 10));
    setModalCategory('symptom');
    setModalTitle('');
    setModalDescription('');
    setModalStatus('normal');
    setModalRedFlag(false);
    setIsModalOpen(true);
  };

  const openEditModal = (evt: TimelineEvent) => {
    setEditingEvent(evt);
    setModalDate(evt.date);
    setModalCategory(evt.category);
    setModalTitle(evt.title);
    setModalDescription(evt.description);
    setModalStatus(evt.status);
    setModalRedFlag(!!evt.red_flag);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) return;

    let updatedList: TimelineEvent[];
    if (editingEvent) {
      updatedList = events.map(ev => ev.id === editingEvent.id ? {
        ...ev,
        date: modalDate || 'Missing Date',
        category: modalCategory,
        title: modalTitle,
        description: modalDescription,
        status: modalStatus,
        red_flag: modalRedFlag
      } : ev);
    } else {
      const newEv: TimelineEvent = {
        id: `EVT-USER-${Date.now().toString().slice(-4)}`,
        date: modalDate || 'Missing Date',
        category: modalCategory,
        title: modalTitle,
        description: modalDescription,
        status: modalStatus,
        red_flag: modalRedFlag
      };
      updatedList = [...events, newEv];
    }

    // Sort chronologically
    updatedList.sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
    setEvents(updatedList);
    onUpdateTimeline(updatedList);
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    onUpdateTimeline(updated);
  };

  const filteredEvents = events.filter(e => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'red_flag') return !!e.red_flag;
    return e.category === filterCategory;
  });

  const redFlagCount = events.filter(e => e.red_flag).length;
  const pendingCount = events.filter(e => e.status === 'pending' || e.status === 'inconclusive').length;

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      
      {/* Header Bar */}
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
            <span className="badge badge-primary">Interactive Timeline</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              {currentCase.patient_display_id} • {events.length} Clinical Milestones
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-deep-navy)' }}>
            Chronological Disease Progression
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
            Track symptom emergence, investigation dates, and therapeutic interventions in strict temporal order.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={openAddModal}
            className="btn btn-secondary"
            id="timeline-add-event-btn"
          >
            <Plus size={16} />
            <span>Add Event</span>
          </button>
          <button
            onClick={onProceedToReview}
            className="btn btn-primary"
            id="timeline-proceed-review-btn"
          >
            <span>Run Clinical Review</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div className="surface-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Events
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-deep-navy)', marginTop: '4px' }}>
            {events.length}
          </div>
        </div>

        <div className="surface-card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--color-danger)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-danger)', fontWeight: 600, textTransform: 'uppercase' }}>
            Critical Red Flags
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-danger)', marginTop: '4px' }}>
            {redFlagCount}
          </div>
        </div>

        <div className="surface-card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--color-warning)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-warning)', fontWeight: 600, textTransform: 'uppercase' }}>
            Inconclusive / Pending
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-warning)', marginTop: '4px' }}>
            {pendingCount}
          </div>
        </div>

        <div className="surface-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Observed Span
          </div>
          <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--color-deep-navy)', marginTop: '8px' }}>
            {events.length > 0 ? `${events[0].date} to ${events[events.length - 1].date}` : 'None'}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '28px',
        overflowX: 'auto',
        paddingBottom: '6px'
      }}>
        <span style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Filter size={14} /> Filter:
        </span>
        {[
          { key: 'all', label: 'All Events' },
          { key: 'symptom', label: 'Symptoms' },
          { key: 'investigation', label: 'Investigations' },
          { key: 'intervention', label: 'Interventions' },
          { key: 'red_flag', label: 'Red Flags Only' }
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilterCategory(f.key)}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: filterCategory === f.key ? 'var(--color-deep-violet)' : '#FFFFFF',
              color: filterCategory === f.key ? '#FFFFFF' : 'var(--color-deep-navy)',
              border: '1px solid var(--color-border-subtle)',
              cursor: 'pointer'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Connected Visual Timeline Spine */}
      <div style={{ position: 'relative', paddingLeft: '36px' }}>
        
        {/* Continuous vertical line */}
        <div style={{
          position: 'absolute',
          top: '16px',
          bottom: '24px',
          left: '14px',
          width: '3px',
          background: 'linear-gradient(180deg, var(--color-primary-lavender) 0%, var(--color-border-subtle) 100%)',
          borderRadius: '2px'
        }} />

        {filteredEvents.map((evt) => {
          const isRed = !!evt.red_flag;
          const isPending = evt.status === 'pending' || evt.status === 'inconclusive';
          const isAbnormal = evt.status === 'abnormal' || evt.status === 'critical';

          let dotBg = 'var(--color-deep-violet)';
          if (isRed) dotBg = 'var(--color-danger)';
          else if (isPending) dotBg = 'var(--color-warning)';
          else if (isAbnormal) dotBg = '#E11D48';

          return (
            <div
              key={evt.id}
              style={{
                position: 'relative',
                marginBottom: '26px'
              }}
            >
              {/* Dot on spine */}
              <div style={{
                position: 'absolute',
                left: '-31px',
                top: '20px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: dotBg,
                border: '3px solid #FFFFFF',
                boxShadow: isRed ? '0 0 10px rgba(225, 29, 72, 0.4)' : '0 0 6px rgba(121, 84, 245, 0.3)',
                zIndex: 2
              }} />

              {/* Event Card */}
              <div className="surface-card" style={{
                borderLeft: isRed ? '4px solid var(--color-danger)' : (isPending ? '4px solid var(--color-warning)' : '1px solid var(--color-border-subtle)'),
                padding: '20px 24px',
                background: '#FFFFFF'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: 'var(--color-deep-violet)',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      <Calendar size={14} />
                      {evt.date || 'Date Unspecified'}
                    </span>
                    <span className={`badge ${
                      evt.category === 'symptom' ? 'badge-info' : 
                      evt.category === 'investigation' ? 'badge-primary' : 
                      evt.category === 'intervention' ? 'badge-success' : 'badge-warning'
                    }`}>
                      {evt.category}
                    </span>
                    {isRed && (
                      <span className="badge badge-danger">
                        <AlertTriangle size={12} />
                        Red Flag
                      </span>
                    )}
                  </div>

                  {/* Edit / Delete actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(evt)}
                      style={{ padding: '6px', borderRadius: '6px', color: 'var(--color-text-secondary)', background: 'var(--color-pale-lavender)' }}
                      title="Edit event"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      style={{ padding: '6px', borderRadius: '6px', color: 'var(--color-danger)', background: 'var(--color-danger-bg)' }}
                      title="Delete event"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h4 style={{ fontSize: '1.14rem', color: 'var(--color-deep-navy)', marginBottom: '6px' }}>
                  {evt.title}
                </h4>

                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  {evt.description}
                </p>

                <div style={{ display: 'flex', gap: '10px', marginTop: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)' }}>Status:</span>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: isRed ? 'var(--color-danger)' : (isPending ? 'var(--color-warning)' : 'var(--color-deep-navy)')
                  }}>
                    {evt.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="surface-card" style={{ padding: '36px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            No timeline events match the selected category filter.
          </div>
        )}
      </div>

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(25, 26, 69, 0.45)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            background: '#FFFFFF',
            maxWidth: '520px',
            width: '100%',
            padding: '28px 32px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-deep-navy)', marginBottom: '18px' }}>
              {editingEvent ? 'Edit Clinical Event' : 'Add New Timeline Event'}
            </h3>

            <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                    Event Date
                  </label>
                  <input
                    type="date"
                    required
                    value={modalDate}
                    onChange={(e) => setModalDate(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={modalCategory}
                    onChange={(e) => setModalCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontSize: '0.88rem', background: '#FFFFFF' }}
                  >
                    <option value="symptom">Symptom</option>
                    <option value="investigation">Investigation</option>
                    <option value="intervention">Intervention</option>
                    <option value="milestone">Milestone</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                  Title / Event Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Extreme Delta Brush identified on continuous EEG"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                  Clinical Description & Observations
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Characteristic 2 Hz delta activity with superimposed fast beta bursts..."
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                    Result Status
                  </label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', fontSize: '0.88rem', background: '#FFFFFF' }}
                  >
                    <option value="normal">Normal</option>
                    <option value="abnormal">Abnormal</option>
                    <option value="inconclusive">Inconclusive</option>
                    <option value="pending">Pending</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div style={{ paddingTop: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-danger)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={modalRedFlag}
                      onChange={(e) => setModalRedFlag(e.target.checked)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span>Flag as Red Flag Alert</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
