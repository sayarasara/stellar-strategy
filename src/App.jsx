import { useEffect, useState } from 'react'
import logo from './logo.jpg'
import SpaceBackground from './SpaceBackground.jsx'

const TIPS = ['Calibrating telescopes…', 'Fueling the rockets…', 'Contacting mission control…', 'Ready for launch']
const missionActions = [
  { title: 'Scan the debris field', detail: 'Map the safest route through orbit.', icon: '⌕', cost: 120, support: 6 },
  { title: 'Deploy a clean-up drone', detail: 'Collect the largest pieces of orbital waste.', icon: '✦', cost: 260, support: 12 },
  { title: 'Share the discovery', detail: 'Bring the global community into the mission.', icon: '◎', cost: 80, support: 10 },
]

function Loader({ onDone }) {
  const [p, setP] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setP(v => (v >= 100 ? 100 : v + 2)), 60)
    return () => clearInterval(t)
  }, [])
  useEffect(() => { if (p >= 100) { const t = setTimeout(onDone, 500); return () => clearTimeout(t) } }, [p, onDone])
  return <div className="loader" role="status"><img src={logo} alt="" className="loader-logo" /><h1 className="loader-name">Stellar Strategy</h1><div className="bar"><i style={{ width: p + '%' }} /></div><p className="tip">{TIPS[Math.min(3, Math.floor(p / 26))]}</p></div>
}

const Stat = ({ icon, label, value, color }) => <div className={'stat ' + color}><span className="ico">{icon}</span><span className="lbl">{label}</span><b>{value}</b></div>

export default function App() {
  const [ready, setReady] = useState(false)
  const [page, setPage] = useState('Home')
  const [missionStarted, setMissionStarted] = useState(false)
  const [completed, setCompleted] = useState([])
  const [budget, setBudget] = useState(2500)
  const [support, setSupport] = useState(72)
  const finishAction = action => {
    setBudget(v => Math.max(0, v - action.cost))
    setSupport(v => Math.min(100, v + action.support))
    setCompleted(v => [...v, action.title])
  }
  const startMission = () => { setPage('Missions'); setMissionStarted(true) }
  const pages = ['Home', 'Missions', 'About']

  return <>
    {!ready && <Loader onDone={() => setReady(true)} />}
    <SpaceBackground />
    <div className="app" style={{ opacity: ready ? 1 : 0 }}>
      <header className="nav">
        <div className="brand"><img src={logo} alt="" /><span>Stellar Strategy</span></div>
        <nav aria-label="Main navigation">{pages.map(p => <button key={p} className={p === page ? 'on' : ''} onClick={() => setPage(p)}>{p}</button>)}</nav>
        <div className="meters"><Stat icon="◈" label="Budget" value={`$${(budget / 1000).toFixed(2)}B`} color="blue" /><Stat icon="✧" label="Support" value={support + '%'} color="green" /></div>
      </header>

      <main className={'hero ' + (page === 'Missions' ? 'mission-page' : '')}>
        {page === 'Home' && <>
          <div className="eyebrow"><i /> YOUR NEXT GREAT SPACE ADVENTURE <i /></div>
          <img src={logo} alt="" className="hero-logo" />
          <h1 className="game-title"><span className="title-top">STELLER</span><span className="title-bottom">STRATEGY</span></h1>
          <p className="sub">Gamifying space data to empower today's children-ensuring the world never loses their future potential</p>
          <button className="cta" onClick={startMission}><span className="play-icon">▶</span> Begin your adventure <span>↗</span></button>
          <div className="home-metrics"><div><span>UP NEXT</span><b>Orbital Cleanup</b></div><div><span>MISSION STATUS</span><b><i className="status-dot" /> Ready for launch</b></div><div><span>CREW ONLINE</span><b>04 astronauts</b></div></div>
        </>}
        {page === 'Missions' && <section className="mission-content">
          <div className="eyebrow"><i /> MISSION CONTROL <i /></div>
          <h2>Orbital <span>Cleanup</span></h2>
          <p className="sub">Clear the path for tomorrow. Make smart calls, protect the crew, and bring the community along.</p>
          <div className="mission-card">
            <div className="mission-top"><div><span className="mission-label">MISSION 01 · EARTH ORBIT</span><h3>{completed.length === missionActions.length ? 'Mission complete!' : missionStarted ? 'Your next move' : 'Launch Day'}</h3></div><span className="mission-count">{String(completed.length).padStart(2, '0')} / 03</span></div>
            <div className="progress-track"><i style={{ width: `${completed.length / missionActions.length * 100}%` }} /></div>
            {completed.length === missionActions.length ? <div className="mission-done"><span>✦</span><div><b>Orbit is safer because of you.</b><p>Public support is up and the crew is ready for what comes next.</p></div><button onClick={() => { setCompleted([]); setMissionStarted(true) }}>Replay mission ↻</button></div> : <div className="action-list">{missionActions.map((a, i) => <article className={'action-row ' + (completed.includes(a.title) ? 'done' : '')} key={a.title}><span className="action-icon">{completed.includes(a.title) ? '✓' : a.icon}</span><div className="action-copy"><b>{a.title}</b><p>{a.detail}</p></div>{completed.includes(a.title) ? <span className="done-label">Complete</span> : <button disabled={!missionStarted || budget < a.cost} onClick={() => finishAction(a)}>{missionStarted ? `Choose · $${a.cost}M` : 'Locked'}</button>}</article>)}</div>}
            {!missionStarted && <button className="launch-button" onClick={() => setMissionStarted(true)}>Launch mission <span>→</span></button>}
          </div>
          <p className="mission-footnote">Every decision changes your agency budget and public support.</p>
        </section>}
        {page === 'About' && <section className="about-content"><div className="eyebrow"><i /> OUR MISSION <i /></div><h2>Today’s Players.<br /><span> Tomorrow’s Space Explorers.</span></h2><p className="sub">Stellar Strategy turns real space challenges into a mission you can lead. 
          We, a team of engineering students from Mymensingh Engineering College (MEC), Bangladesh, are on a mission to inspire the next generation to look beyond Planet Earth
 We invite them to explore it, make decisions, solve problems, and discover space.
          </p><div className="about-pillars"><div><span>01</span><b>Explore</b><p>See our planet from a new perspective.</p></div><div><span>02</span><b>Decide</b><p>Make trade-offs with real consequences.</p></div><div><span>03</span><b>Protect</b><p>Build a safer future for everyone.</p></div></div></section>}
      </main>
      <footer className="footer"><span>Stellar Strategy</span><span>MISSION CONTROL · EARTH ORBIT</span><span>✦ &nbsp; THE FUTURE IS IN YOUR HANDS</span></footer>
    </div>
  </>
}
