import { Link } from 'react-router-dom';
import '../styles/victorian.css';
import tokens from '../design/tokens.json';

const FIGMA_KIT = 'https://www.figma.com/design/PzEPUP1Bv0amoNA3ufvfut/Time-Lens-Fig?node-id=210-239';

type Tok = { $value: string; figma?: string | null };

export default function Library() {
  const colors = Object.entries(tokens.color as Record<string, Tok>);
  return (
    <div className="vb" style={{ paddingBottom: 56 }}>
      <header className="vb-masthead">
        <div className="vb-masthead__kicker">UI Kit · Code ↔ Figma</div>
        <h1 className="vb-masthead__name">Victorian Broadsheet</h1>
        <div className="vb-masthead__rule">
          <span className="vb-fleuron">❦</span> Design System <span className="vb-fleuron">❦</span>
        </div>
      </header>

      <div className="vb-dek">
        <p className="vb-dek__lede">
          Everything below renders live from <code>src/design/tokens.json</code> — the same values
          mapped to the Figma variables. Change a Figma variable → <code>npm&nbsp;run&nbsp;tokens:sync</code> →
          <code>npm&nbsp;run&nbsp;tokens</code> → this page updates.
        </p>
      </div>
      <div className="vb-kit" style={{ textAlign: 'center', paddingBottom: 6 }}>
        <a className="vb-featured__cta" href={FIGMA_KIT} target="_blank" rel="noreferrer">Open the Figma UI Kit →</a>
      </div>

      {/* Colour tokens — straight from tokens.json */}
      <div className="vb-kit">
        <div className="vb-kit__h">❦ Colour Tokens · {colors.length}</div>
        <div className="vb-kit__swatches">
          {colors.map(([name, tok]) => (
            <div key={name} className="vb-kit__sw">
              <div className="vb-kit__chip" style={{ background: tok.$value }} />
              <div className="vb-kit__meta">
                <div className="vb-kit__name">{name}</div>
                <div className="vb-kit__hex">{tok.$value}</div>
                {tok.figma && <div className="vb-kit__figma">⌥ {tok.figma}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="vb-kit">
        <div className="vb-kit__h">❦ Typography</div>
        <div className="vb-kit__type">
          <div style={{ fontFamily: 'var(--vb-font-masthead)', fontSize: 34, color: 'var(--vb-ink)' }}>The Yerba Buena</div>
          <div className="vb-kit__spec">Masthead · UnifrakturCook</div>
        </div>
        <div className="vb-kit__type">
          <div style={{ fontFamily: 'var(--vb-font-display)', fontSize: 24, fontWeight: 700, color: 'var(--vb-ink)' }}>Yerba Buena becomes San Francisco</div>
          <div className="vb-kit__spec">Display / Headline</div>
        </div>
        <div className="vb-kit__type">
          <div style={{ fontFamily: 'var(--vb-font-display)', fontStyle: 'italic', fontSize: 18, color: 'var(--vb-ink-soft)' }}>Stand where the cove once lapped the shore.</div>
          <div className="vb-kit__spec">Display / Lede Italic</div>
        </div>
        <div className="vb-kit__type">
          <div style={{ fontFamily: 'var(--vb-font-body)', fontSize: 17, lineHeight: 1.6, color: 'var(--vb-ink)' }}>Richardson founds a trading post under Mexican authority, and a new customs house rises on the edge of the cove.</div>
          <div className="vb-kit__spec">Body / Paragraph</div>
        </div>
        <div className="vb-kit__type">
          <div style={{ fontFamily: 'var(--vb-font-sc)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--vb-oxblood)' }}>San Francisco · 1906 —</div>
          <div className="vb-kit__spec">Label / Dateline SC</div>
        </div>
      </div>

      {/* Controls */}
      <div className="vb-kit">
        <div className="vb-kit__h">❦ Controls</div>
        <div className="vb-kit__spec">Chip · Default / Selected</div>
        <div className="vb-kit__row">
          <button className="vb-chip">Waterfront</button>
          <button className="vb-chip" aria-pressed={true}>Waterfront</button>
        </div>
        <div className="vb-kit__spec">Button · Primary / Text</div>
        <div className="vb-kit__row">
          <button className="vb-kit__btn">Read on ⌃</button>
          <button className="vb-kit__btn vb-kit__btn--text">Begin the walk →</button>
        </div>
        <div className="vb-kit__spec">Badges</div>
        <div className="vb-kit__row">
          <span className="vb-badge-soon">In the works</span>
          <span className="vb-featured__badge" style={{ position: 'static' }}>✦ Featured Dispatch</span>
        </div>
      </div>

      <div className="vb-kit" style={{ paddingTop: 22 }}>
        <Link className="vb-featured__cta" to="/explore">← Back to Explore</Link>
      </div>
    </div>
  );
}
