'use client';

import { useEffect } from 'react';

const OPTIONS = [
  {
    value: 'public',
    label: 'Public',
    description: 'Anyone can see this post',
  },
  {
    value: 'private',
    label: 'Only me',
    description: 'Only you can see this post',
  },
];

function GlobeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function VisibilityIcon({ visibility }) {
  return visibility === 'private' ? <LockIcon /> : <GlobeIcon />;
}

export function AudienceIconButton({ visibility, onOpen }) {
  return (
    <div className="_feed_inner_text_area_bottom_audience _feed_common">
      <button
        type="button"
        className="_feed_inner_text_area_bottom_photo_link"
        onClick={onOpen}
        title={visibility === 'private' ? 'Only me' : 'Public'}
        aria-label="Choose audience"
      >
        <span className="_feed_inner_text_area_bottom_photo_iamge">
          <VisibilityIcon visibility={visibility} />
        </span>
      </button>
    </div>
  );
}

export function AudienceModal({ visibility, onChange, open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSelect = (value) => {
    onChange(value);
    onClose();
  };

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.45)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="audience-modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 12,
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid #f0f0f0' }}>
          <h3 id="audience-modal-title" style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
            Who can see your post?
          </h3>
        </div>

        <div style={{ padding: '8px 0' }}>
          {OPTIONS.map((option) => {
            const selected = visibility === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                style={{
                  width: '100%',
                  border: 'none',
                  background: selected ? 'rgba(24, 144, 255, 0.08)' : 'transparent',
                  textAlign: 'left',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#f5f5f5',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <VisibilityIcon visibility={option.value} />
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: '#111' }}>
                    {option.label}
                  </span>
                  <span style={{ display: 'block', fontSize: 13, color: '#666', marginTop: 2 }}>
                    {option.description}
                  </span>
                </span>
                {selected && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#1890FF" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ padding: '12px 20px 20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: '#1890FF',
              color: '#fff',
              borderRadius: 8,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
