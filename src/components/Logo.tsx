type LogoProps = {
  compact?: boolean;
  className?: string;
};

export function Logo({ compact = false, className = "" }: LogoProps) {
  return (
    <span className={`logo ${compact ? "logo--compact" : ""} ${className}`.trim()}>
      <svg className="logo__mark" viewBox="0 0 42 32" role="img" aria-label="UME mark">
        <path d="M3 3.5h10.5v16.2h4.8V3.5h10.5v24.8H18.3v-4.1h-4.8v4.1H3V3.5Z" />
        <path d="M14.2 3.5h10.5l4.1 8.2 4.2-8.2h6.1v24.8H28.6V16.6l-4.1 7.8-4.1-7.8v11.7h-6.2V3.5Z" />
        <path className="logo__signal" d="M29.1 3.5H40v5.3h-5.6v4.1h5.2v5.2h-5.2V23H40v5.3H29.1V3.5Z" />
      </svg>
      {!compact && <span className="logo__wordmark">UME</span>}
    </span>
  );
}
