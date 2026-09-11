export function LeafMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 22C12 22 3.5 16.5 3.5 9.5A8.5 8.5 0 0 1 12 3c3.5 4 4 8.5 8.5 8.5 1.2 0 2.4-.3 3.4-.9C20.9 19 12 22 12 22Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LeafDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`} aria-hidden="true">
      <div className="h-px flex-1 bg-outline-variant" />
      <svg viewBox="0 0 120 16" className="mx-lg w-28" fill="none" aria-hidden="true">
        <path d="M2 8h36M82 8h36" stroke="#E3DED2" strokeWidth="1" />
        <path d="M60 3c3 0 4.5 2.2 4.5 5H60V3ZM60 3c-3 0-4.5 2.2-4.5 5H60V3Z" fill="#5A7D3C" />
        <path d="M60 13c3 0 4.5-2.2 4.5-5H60v5ZM60 13c-3 0-4.5-2.2-4.5-5H60v5Z" fill="#5A7D3C" />
      </svg>
      <div className="h-px flex-1 bg-outline-variant" />
    </div>
  );
}