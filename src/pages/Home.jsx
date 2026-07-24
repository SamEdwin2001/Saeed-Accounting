import Hero from '../components/Hero.jsx'
import Services from '../components/Services.jsx'
import About from '../components/About.jsx'
import Commitment from '../components/Commitment.jsx'
import TeamCta from '../components/TeamCta.jsx'
import Reviews from '../components/Reviews.jsx'
import Stats from '../components/Stats.jsx'
import Seo from '../components/Seo.jsx'

export default function Home() {
  return (
    <>
      <Seo description="Saeed Accounting provides accounting, bookkeeping, VAT and corporate tax services across the UAE — FTA-compliant registration, filing and advisory for mainland and free zone companies." />
      <Hero />

      <div className="penalty">
        <div className="container">
          <p className="penalty__text">
            Avoid Ð 10,000 penalty by registering for Corporate Tax today!
          </p>
        </div>
      </div>

      <Services />
      <About />
      <Commitment />
      <TeamCta />
      <Reviews />
      <Stats />
    </>
  )
}
