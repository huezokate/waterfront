import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/victorian.css';
import { asset } from '../lib/asset';
import { SF_LOCATIONS, THEMES } from '../data/sfLocations';

/* Shared Victorian bottom nav (≤4 tabs per browsing research) */
export function VbNav({ active }: { active: 'explore' | 'map' | 'saved' }) {
  return (
    <nav className="vb-nav" aria-label="Primary">
      <Link className="vb-nav__tab" to="/explore" aria-current={active === 'explore' ? 'page' : undefined}>
        <span className="vb-nav__icon" aria-hidden="true">❦</span>Explore
      </Link>
      <button className="vb-nav__tab" aria-current={active === 'map' ? 'page' : undefined} aria-disabled="true">
        <span className="vb-nav__icon" aria-hidden="true">✦</span>Map
      </button>
      <button className="vb-nav__tab" aria-current={active === 'saved' ? 'page' : undefined} aria-disabled="true">
        <span className="vb-nav__icon" aria-hidden="true">☞</span>Saved
      </button>
    </nav>
  );
}

export default function Explore() {
  const featured = SF_LOCATIONS.find((l) => l.status === 'live')!;
  const [theme, setTheme] = useState<string | null>(null);
  const others = SF_LOCATIONS
    .filter((l) => l.id !== featured.id)
    .filter((l) => !theme || l.themes.includes(theme));

  return (
    <div className="vb">
      <header className="vb-masthead">
        <div className="vb-masthead__kicker">San Francisco · Every Street a Story</div>
        <h1 className="vb-masthead__name">The TimeLens Gazette</h1>
        <div className="vb-masthead__rule">
          <span className="vb-fleuron">❦</span> Choose Your Walk <span className="vb-fleuron">❦</span>
        </div>
      </header>

      <div className="vb-dek">
        <p className="vb-dek__lede">
          Hand-crafted history walks through the streets of San Francisco. Pick a place and let
          the city tell you what happened where you stand.
        </p>
      </div>

      <div className="vb-chips" role="group" aria-label="Filter by theme">
        {THEMES.map((t) => (
          <button key={t} className="vb-chip" aria-pressed={theme === t} onClick={() => setTheme(theme === t ? null : t)}>
            {t}
          </button>
        ))}
      </div>

      {/* Featured location (cold-start: lead with one curated walk, not a bare map) */}
      <Link className="vb-featured" to={featured.route!}>
        <div className="vb-featured__imgwrap">
          <img className="vb-featured__img" src={asset(featured.hero)} alt={featured.name} />
          <span className="vb-featured__badge">✦ Featured Dispatch</span>
        </div>
        <div className="vb-featured__body">
          <div className="vb-featured__kicker">No. {featured.no} · {featured.neighborhood}</div>
          <div className="vb-featured__name">{featured.name}</div>
          <div className="vb-featured__meta">{featured.range} · {featured.themes.join(' · ')}</div>
          <p className="vb-featured__dek">{featured.dek}</p>
          <span className="vb-featured__cta">Begin the walk <span aria-hidden="true">→</span></span>
        </div>
      </Link>

      <div className="vb-section-label">More of the City</div>
      <div className="vb-loc-grid">
        {others.length === 0 && (
          <div className="vb-loc-card__dek" style={{ padding: '0 2px 8px' }}>
            No other walks tagged “{theme}” yet — more dispatches in the works.
          </div>
        )}
        {others.map((l) => (
          <div key={l.id} className="vb-loc-card">
            <img className="vb-loc-card__img" src={asset(l.hero)} alt={l.name} />
            <div className="vb-loc-card__body">
              <div className="vb-loc-card__name">{l.name}</div>
              <div className="vb-loc-card__meta">{l.neighborhood} · {l.range}</div>
              <div className="vb-loc-card__dek">{l.dek}</div>
              <span className="vb-badge-soon">In the works</span>
            </div>
          </div>
        ))}
      </div>

      <VbNav active="explore" />
    </div>
  );
}
