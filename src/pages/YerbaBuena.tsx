import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../styles/victorian.css';
import rawData from '../data/yerbaBuena.json';

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

/* ── Side-story "column inch" with bottom-disclosure ───────────── */
function SideStory({ story }: { story: SideStory }) {
  const [open, setOpen] = useState(false);
  return (
    <aside className="vb-sidestory">
      <span className="vb-sidestory__kicker">In Brief</span>
      <div className="vb-sidestory__title">{story.title}</div>
      {open && <p className="vb-sidestory__body">{story.body}</p>}
      <button className="vb-sidestory__more" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="vb-manicule" aria-hidden="true">☞</span>
        {open ? 'Close' : 'Read the full account'}
      </button>
    </aside>
  );
}

/* ── Event article block ───────────────────────────────────────── */
function Article({ ev }: { ev: YBEvent }) {
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
      {ev.sideStories.map((s, i) => <SideStory key={i} story={s} />)}
      <div className="vb-article__end" aria-hidden="true">⁂</div>
    </article>
  );
}

/* ── Period accordion section ──────────────────────────────────── */
function PeriodSection({ period, index, open, onToggle, anchorRef }: {
  period: Period; index: number; open: boolean; onToggle: () => void;
  anchorRef: (el: HTMLDivElement | null) => void;
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
          {period.events.map((ev) => <Article key={ev.id} ev={ev} />)}
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
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>← The TimeLens Gazette</Link>
        </div>
        <h1 className="vb-masthead__name">The Yerba Buena</h1>
        <div className="vb-masthead__rule">
          <span className="vb-fleuron">❦</span>
          San Francisco · Est. 1833 · No. 4
          <span className="vb-fleuron">❦</span>
        </div>
      </header>

      <div className="vb-dek">
        <p className="vb-dek__lede">
          Stand where the cove once lapped the shore. Five chapters, {data.periods.reduce((n, p) => n + p.events.length, 0)} dispatches —
          the rise of a city from sand dunes to skyline, told on the streets it happened.
        </p>
      </div>

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
        />
      ))}

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
    </div>
  );
}
