'use client';

export default function AuthLoader({ label = 'Please wait...' }) {
  return (
    <div className="_auth_loader_overlay" role="status" aria-live="polite" aria-busy="true">
      <div className="_auth_loader_box">
        <span className="_auth_loader_spinner" aria-hidden="true" />
        <p className="_auth_loader_label">{label}</p>
      </div>
    </div>
  );
}
