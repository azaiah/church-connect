import { Link } from 'react-router-dom'

/** ChurchConnect mark: a window arch with a connecting node, drawn in SVG so it scales crisply. */
export function Mark({ size = 28, light = false }: { size?: number; light?: boolean }) {
  const stroke = light ? '#FFFFFF' : '#101C2E'
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M6 28V14a10 10 0 0 1 20 0v14" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M11 28V16a5 5 0 0 1 10 0v12" stroke="#B8862B" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="16" cy="22" r="2.4" fill="#B8862B" />
      <path d="M3 28h26" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ light = false, size = 'md', compact = false, to = '/' }: { light?: boolean; size?: 'sm' | 'md'; compact?: boolean; to?: string }) {
  const text = light ? 'text-white' : 'text-midnight'
  const sub = light ? 'text-white/60' : 'text-slate'
  return (
    <Link to={to} className="inline-flex items-center gap-2.5 min-h-[44px]" aria-label="ChurchConnect home">
      <Mark size={size === 'sm' ? 26 : 30} light={light} />
      {!compact && (
        <span className="leading-none">
          <span className={`block font-display font-semibold ${size === 'sm' ? 'text-lg' : 'text-xl'} ${text}`}>ChurchConnect</span>
          <span className={`block font-mono text-[9px] uppercase tracking-[0.2em] mt-1 ${sub}`}>by DataIsData</span>
        </span>
      )}
    </Link>
  )
}

export function PoweredBy({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] ${light ? 'text-white/60' : 'text-slate'} ${className}`}>
      <img src="/dataisdata-icon.png" alt="" width={16} height={16} className="rounded-sm" />
      Powered by DataIsData
    </span>
  )
}
