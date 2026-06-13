'use client';

export default function UploadProgressBar({ progress = 0, label }) {
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="_create_post_upload_progress" role="progressbar" aria-valuenow={safeProgress} aria-valuemin={0} aria-valuemax={100}>
      <div className="_create_post_upload_progress_track">
        <div className="_create_post_upload_progress_fill" style={{ width: `${safeProgress}%` }} />
      </div>
      <p className="_create_post_upload_progress_label">{label}</p>
    </div>
  );
}
