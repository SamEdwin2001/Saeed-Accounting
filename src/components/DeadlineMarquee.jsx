import { useEffect, useRef } from 'react'

const MESSAGE =
  "⚠️ Avoid Penalties ⏰ Corporate Tax Filing Deadline: September 30, 2026 – File Before It's Too Late!"

/**
 * Red deadline bar that scrolls above the site header.
 *
 * The header is absolute at top:0, so the bar publishes its measured height as
 * --marquee-h on <body> while mounted; styles.css offsets .header by it and the
 * hero padding follows. Measured rather than hardcoded so a line that wraps on
 * a narrow screen still clears. The variable is removed on unmount, which is
 * what keeps every other route at top: 0.
 */
export default function DeadlineMarquee() {
  const barRef = useRef(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return undefined

    const apply = () => document.body.style.setProperty('--marquee-h', `${bar.offsetHeight}px`)
    apply()

    const ro = new ResizeObserver(apply)
    ro.observe(bar)

    return () => {
      ro.disconnect()
      document.body.style.removeProperty('--marquee-h')
    }
  }, [])

  return (
    <div className="marquee" ref={barRef}>
      {/* Two copies: the track translates -50%, so the second is on screen as
          the first leaves and the loop reads as continuous. */}
      <div className="marquee__track">
        <span className="marquee__item">{MESSAGE}</span>
        <span className="marquee__item" aria-hidden="true">
          {MESSAGE}
        </span>
      </div>
    </div>
  )
}
