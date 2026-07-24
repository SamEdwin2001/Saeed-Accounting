const STATS = [
  { value: '216', label: 'Entrepreneurs\nServed' },
  { value: '37', label: 'Professional\nNetworks' },
  { value: '4', label: 'Years Of Experience' },
  { value: '10', label: 'Team Strength' },
]

export default function Stats() {
  return (
    <section className="stats">
      <div className="container stats__grid">
        {STATS.map((s) => (
          <article className="stat" key={s.value + s.label}>
            <p className="stat__value">{s.value}</p>
            <p className="stat__label">{s.label}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
