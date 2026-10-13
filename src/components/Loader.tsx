type LoaderProps = {
  progress: number;
};

export function Loader({ progress }: LoaderProps) {
  const value = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div className="loader" role="status" aria-live="polite" aria-atomic="true" aria-label={`Loading UME studio scene: ${value}%`}>
      <span className="micro-label">UME / STUDIO SCENE</span>
      <span className="loader__line">LOADING EMPIRE... {value}%</span>
      <span className="loader__track" aria-hidden="true"><span style={{ width: `${value}%` }} /></span>
    </div>
  );
}
