import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../styles/victorian.css';
import rawData from '../data/yerbaBuena.json';
import { SF_LOCATIONS } from '../data/sfLocations';

/* ── Types ─────────────────────────────────────────────────── */
interface SideStory { eventId: string; title: string; body: string; }
interface YBEvent { id: string; year: string; title: string; images: string[]; sideStories: SideStory[]; }
interface Period { id: string; range: string; title: string; events: YBEvent[]; }
interface YBData { location: { id: string; name: string; range: string; city: string }; periods: Period[]; }

const data = rawData as unknown as YBData;

// Resolve public assets against Vite's base (e.g. '/waterfront/' on GitHub Pages, '/' in dev)
const asset = (p: string) => import.meta.env.BASE_URL + p.replace(/^\//, '');

/* short period years for the timeline scrubber */
function periodStartYear(range: string) { return range.split('–')[0].trim().slice(0, 4); }

/* ── Living image: Ken Burns + grain + sepia→color on view / tap ─ */
function LivingImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [alive, setAlive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAlive(true); io.disconnect(); } },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure
      ref={ref}
      className={`vb-figure${alive ? ' is-alive' : ''}`}
      onClick={() => setAlive((a) => !a)}
    >
      <img className="vb-figure__img" src={src} alt={alt} loading="lazy" />
      <span className="vb-figure__halftone" aria-hidden="true" />
      <span className="vb-figure__grain" aria-hidden="true" />
      <span className="vb-figure__vignette" aria-hidden="true" />
      {!alive && <span className="vb-figure__alive-tag" aria-hidden="true">☞ Tap to revive</span>}
    </figure>
  );
}

/* ── Then / Now wipe slider (JuxtaposeJS-style) ────────────────── */
function ThenNow({ thenSrc, nowSrc, thenLabel, nowLabel }: {
  thenSrc: string; nowSrc: string; thenLabel: string; nowLabel: string;
}) {
  const [pos, setPos] = useState(50);
  return (
    <div className="vb-thennow">
      <img className="vb-thennow__img vb-thennow__then" src={thenSrc} alt={thenLabel} />
      <img
        className="vb-thennow__img vb-thennow__now"
        src={nowSrc}
        alt={nowLabel}
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      />
      <span className="vb-thennow__label vb-thennow__label--then">{thenLabel}</span>
      <span className="vb-thennow__label vb-thennow__label--now">{nowLabel}</span>
      {/* invisible full-area range = click-to-position + drag + keyboard, all accessible */}
      <input
        className="vb-thennow__range"
        type="range" min={0} max={100} value={pos}
        onChange={(e) => setPos(+e.target.value)}
        aria-label={`Slide to compare ${thenLabel} with ${nowLabel}`}
      />
      <div className="vb-thennow__divider" style={{ left: `${pos}%` }}>
        <div className="vb-thennow__handle" aria-hidden="true">⇄</div>
      </div>
    </div>
  );
}

/* placeholder body copy — structure-over-content per the brief */
const LOREM = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.',
];

/* ── Bottom sheet — full side-story (peek → expand) ────────────── */
function BottomSheet({ story, image, onClose }: { story: SideStory; image: string; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="vb-sheet-scrim" onClick={onClose}>
      <div
        className={`vb-sheet${expanded ? ' is-expanded' : ''}`}
        role="dialog" aria-modal="true" aria-label={story.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="vb-sheet__grip" onClick={() => setExpanded((x) => !x)} aria-label={expanded ? 'Collapse' : 'Expand'}>
          <span />
        </button>
        <button className="vb-sheet__close" onClick={onClose} aria-label="Close">✕</button>
        <div className="vb-sheet__kicker">In Brief · The Full Account</div>
        <h3 className="vb-sheet__title">{story.title}</h3>
        <p className="vb-sheet__teaser">{story.body}</p>
        {expanded ? (
          <div className="vb-sheet__body">
            {image && <img className="vb-sheet__img" src={image} alt={story.title} />}
            {image && <p className="vb-sheet__cutline">— Historic plate from the archive.</p>}
            {LOREM.map((p, i) => (
              <p key={i} className={i === 0 ? 'vb-article__body vb-article__body--lead' : 'vb-article__body'}>{p}</p>
            ))}
          </div>
        ) : (
          <button className="vb-sheet__expand" onClick={() => setExpanded(true)}>Read on ⌃</button>
        )}
      </div>
    </div>
  );
}

/* ── Side-story "column inch" — opens the bottom sheet ──────────── */
function SideStory({ story, onOpen }: { story: SideStory; onOpen: () => void }) {
  return (
    <aside className="vb-sidestory">
      <span className="vb-sidestory__kicker">In Brief</span>
      <div className="vb-sidestory__title">{story.title}</div>
      <p className="vb-sidestory__body">{story.body}</p>
      <button className="vb-sidestory__more" onClick={onOpen} aria-haspopup="dialog">
        <span className="vb-manicule" aria-hidden="true">☞</span>
        Read the full account
      </button>
    </aside>
  );
}

/* ── Event article block ───────────────────────────────────────── */
function Article({ ev, onOpenStory }: { ev: YBEvent; onOpenStory: (s: SideStory, image: string) => void }) {
  const hero = ev.images[0];
  const heroAlt = `${ev.year} — ${ev.title}`;
  return (
    <article className="vb-article">
      <div className="vb-article__dateline">San Francisco · {ev.year} —</div>
      {hero && <LivingImage src={asset(hero)} alt={heroAlt} />}
      {hero && (
        <p className="vb-cutline">
          — Historic plate, {ev.year}. {ev.images.length > 1 ? `${ev.images.length} views in the archive.` : ''}
        </p>
      )}
      <p className="vb-article__body vb-article__body--lead">{ev.title}.</p>
      {ev.sideStories.map((s, i) => (
        <SideStory key={i} story={s} onOpen={() => onOpenStory(s, hero ? asset(hero) : '')} />
      ))}
      <div className="vb-article__end" aria-hidden="true">⁂</div>
    </article>
  );
}

/* ── Period accordion section ──────────────────────────────────── */
function PeriodSection({ period, index, open, onToggle, anchorRef, onOpenStory }: {
  period: Period; index: number; open: boolean; onToggle: () => void;
  anchorRef: (el: HTMLDivElement | null) => void;
  onOpenStory: (s: SideStory, image: string) => void;
}) {
  const romans = ['I', 'II', 'III', 'IV', 'V'];
  return (
    <section className="vb-period" data-open={open} ref={anchorRef}>
      <button className="vb-period__head" onClick={onToggle} aria-expanded={open}>
        <div className="vb-period__no">
          <span className="vb-fleuron">❦</span> Chapter {romans[index]} <span className="vb-fleuron">❦</span>
        </div>
        <h2 className="vb-period__title">{period.title}</h2>
        <div className="vb-period__range">{period.range}</div>
        <span className="vb-period__toggle">
          {open ? 'Close chapter' : `Read ${period.events.length} dispatches`}
          <span className="vb-period__chev" aria-hidden="true">▾</span>
        </span>
      </button>
      <div className="vb-period__events">
        <div className="vb-period__events-inner">
          {period.events.map((ev) => <Article key={ev.id} ev={ev} onOpenStory={onOpenStory} />)}
        </div>
      </div>
    </section>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */
const ROMANS = ['I', 'II', 'III', 'IV', 'V'];

export default function YerbaBuena() {
  const [openIndex, setOpenIndex] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  const [playing, setPlaying] = useState(false);
  const [sheet, setSheet] = useState<{ story: SideStory; image: string } | null>(null);
  const anchors = useRef<(HTMLDivElement | null)[]>([]);

  const markVisited = useCallback((i: number) => {
    if (i >= 0) setVisited((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
  }, []);

  const jumpTo = useCallback((i: number) => {
    setOpenIndex(i);
    markVisited(i);
    requestAnimationFrame(() => {
      anchors.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [markVisited]);

  const openChapter = openIndex >= 0 ? data.periods[openIndex] : null;

  return (
    <div className="vb">
      {/* Masthead */}
      <header className="vb-masthead">
        <div className="vb-masthead__kicker">
          <Link to="/explore" style={{ color: 'inherit', textDecoration: 'none' }}>← The TimeLens Gazette</Link>
        </div>
        <h1 className="vb-masthead__name">The Yerba Buena</h1>
        <div className="vb-masthead__rule">
          <span className="vb-fleuron">❦</span>
          San Francisco · Est. 1833 · No. 4
          <span className="vb-fleuron">❦</span>
        </div>
      </header>

      {/* Breadcrumb — anti-lost context for the deep hierarchy */}
      <nav className="vb-crumb" aria-label="Breadcrumb">
        <Link to="/explore">Explore</Link>
        <span className="vb-crumb__sep" aria-hidden="true">›</span>
        <span>Yerba Buena Cove</span>
      </nav>

      <div className="vb-dek">
        <p className="vb-dek__lede">
          Stand where the cove once lapped the shore. Five chapters, {data.periods.reduce((n, p) => n + p.events.length, 0)} dispatches —
          the rise of a city from sand dunes to skyline, told on the streets it happened.
        </p>
      </div>

      {/* Then & Now hero — the signature "this happened here" moment */}
      <section className="vb-article" style={{ borderTop: 'none', paddingBottom: 6 }}>
        <div className="vb-article__dateline">Then &amp; Now · the cove beneath your feet —</div>
        <ThenNow
          thenSrc={asset('/historic/4-1-4a-1848-view-of-sf-harbor-house-count.jpg')}
          nowSrc={asset('/historic/4-5-5a-2020-buried-ships-of-sf.jpeg')}
          thenLabel="Then · 1848"
          nowLabel="Now · 2020"
        />
        <p className="vb-cutline">
          Drag to reveal the buried ships beneath today’s Financial District — the cove was
          filled within a generation.
        </p>
      </section>

      {/* Printer's-rule timeline scrubber */}
      <nav className="vb-timeline" aria-label="Jump to a period">
        <div className="vb-timeline__track">
          {data.periods.map((p, i) => (
            <button
              key={p.id}
              className="vb-timeline__tick"
              aria-current={i === openIndex}
              onClick={() => jumpTo(i)}
            >
              <span className="vb-timeline__year">{periodStartYear(p.range)}</span>
              <span className={`vb-timeline__dot${visited.has(i) ? '' : ' vb-timeline__dot--unread'}`} aria-hidden="true" />
              <span className="vb-sr">{visited.has(i) ? 'read' : 'unread'}</span>
            </button>
          ))}
        </div>
        <div className="vb-timeline__base" />
      </nav>

      {/* Periods */}
      {data.periods.map((p, i) => (
        <PeriodSection
          key={p.id}
          period={p}
          index={i}
          open={i === openIndex}
          onToggle={() => { const next = i === openIndex ? -1 : i; setOpenIndex(next); markVisited(next); }}
          anchorRef={(el) => { anchors.current[i] = el; }}
          onOpenStory={(s, image) => setSheet({ story: s, image })}
        />
      ))}

      {/* Up next — guided off-ramp to keep browsing momentum */}
      <section className="vb-upnext">
        <div className="vb-upnext__label">Up Next · More of the City</div>
        <Link className="vb-loc-card" to="/explore">
          <img className="vb-loc-card__img" src={asset(SF_LOCATIONS[1].hero)} alt={SF_LOCATIONS[1].name} />
          <div className="vb-loc-card__body">
            <div className="vb-loc-card__name">{SF_LOCATIONS[1].name}</div>
            <div className="vb-loc-card__meta">{SF_LOCATIONS[1].neighborhood} · {SF_LOCATIONS[1].range}</div>
            <div className="vb-loc-card__dek">{SF_LOCATIONS[1].dek}</div>
            <span className="vb-badge-soon">Browse all walks →</span>
          </div>
        </Link>
      </section>

      {/* Phonograph audio bar (mock) */}
      <div className={`vb-audio${playing ? ' is-playing' : ''}`}>
        <button
          className="vb-audio__btn"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause narration' : 'Play narration'}
        >
          {playing ? '❚❚' : '▶'}
        </button>
        <div className="vb-audio__meta">
          <div className="vb-audio__label">
            {openChapter ? `Now reading · Chapter ${ROMANS[openIndex]}` : 'Listen as you walk'}
          </div>
          <div className="vb-audio__title">
            {openChapter ? openChapter.title : `${data.location.name} — narrated tour`}
          </div>
          <div className="vb-audio__stylus" aria-hidden="true" />
        </div>
      </div>

      {/* Bottom sheet — full side-story */}
      {sheet && (
        <BottomSheet story={sheet.story} image={sheet.image} onClose={() => setSheet(null)} />
      )}
    </div>
  );
}
