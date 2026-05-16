import type { Era } from '../data/locations';

interface Props {
  eras: Era[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function EraStrip({ eras, activeIndex, onSelect }: Props) {
  return (
    <div className="era-strip" role="group" aria-label="Historical eras">
      <div className="era-strip__track">
        {eras.map((era, i) => (
          <div key={era.year} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && <div className="era-strip__connector" aria-hidden="true" />}
            <button
              className={`era-strip__pill ${i === activeIndex ? 'active' : ''}`}
              onClick={() => onSelect(i)}
              aria-pressed={i === activeIndex}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(i);
                }
              }}
            >
              {era.year}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
