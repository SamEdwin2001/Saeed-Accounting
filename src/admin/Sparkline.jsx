/* Inline sparkline for the stat cards. Takes raw counts and draws a smooth
   filled area — no chart library, so it costs nothing in the bundle. */
export default function Sparkline({ points = [], color = '#e0342a', id }) {
  const w = 110
  const h = 40

  /* Fewer than two points can't describe a line; render nothing rather than
     dividing by zero below. */
  if (points.length < 2) return <svg width={w} height={h} aria-hidden="true" />

  const max = Math.max(...points)
  const min = Math.min(...points)
  const span = max - min || 1

  const coords = points.map((p, i) => [
    (i / (points.length - 1)) * w,
    h - ((p - min) / span) * (h - 8) - 4,
  ])

  /* Catmull-Rom-ish smoothing: pull each segment toward a midpoint so the
     line curves like the reference instead of showing hard corners. */
  const line = coords.reduce((d, [x, y], i, arr) => {
    if (i === 0) return `M ${x} ${y}`
    const [px, py] = arr[i - 1]
    const cx = (px + x) / 2
    return `${d} C ${cx} ${py}, ${cx} ${y}, ${x} ${y}`
  }, '')

  const gradId = `spark-${id}`

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="adm-spark">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L ${w} ${h} L 0 ${h} Z`} fill={`url(#${gradId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
