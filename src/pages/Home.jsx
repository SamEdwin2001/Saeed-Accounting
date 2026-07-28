import Hero from '../components/Hero.jsx'
import Services from '../components/Services.jsx'
import About from '../components/About.jsx'
import Commitment from '../components/Commitment.jsx'
import TeamCta from '../components/TeamCta.jsx'
import Reviews from '../components/Reviews.jsx'
import Stats from '../components/Stats.jsx'
import { Dirham } from '../components/Icons.jsx'

export default function Home() {
  return (
    <>
      <Hero />

      <div className="penalty">
        <div className="container">
          <p className="penalty__text">
            Avoid <Dirham /> 10,000 penalty by registering for Corporate Tax today!
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
